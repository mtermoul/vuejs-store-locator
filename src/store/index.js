import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import Cosmic from '../api/cosmic'

Vue.use(Vuex)
Vue.use(VueResource)

export default new Vuex.Store({
    state: {
        userLocation: {},
        selectedLocation: {},
        selectedStore: null,
        availableLocations: {},
        stores: [],
        storeCardImages: [],
        mapIcons: {},
        storesDataUrl: '../../static/data/'
    },
    getters: {
        userLocation (state) {
            return state.userLocation
        },
        selectedLocation (state) {
            return state.selectedLocation
        },
        selectedStore (state) {
            return state.selectedStore
        },
        availableLocations (state) {
            return state.availableLocations
        },
        availableLocationsShort (state) {
            const data = []
            for (let stateKey in state.availableLocations) {
                for (let cityKey in state.availableLocations[stateKey]) {
                    data.push(state.availableLocations[stateKey][cityKey].city + ', ' + stateKey)
                }
            }
            return data
        },
        stores (state) {
            return state.stores
        },
        getStoreById (state, getters) {
            return (Id) => {
                return state.stores.find(item => {
                    return item.id === Id
                })
            }
        },
        storeCardImages (state) {
            return state.storeCardImages
        },
        mapIcons (state) {
            return state.mapIcons
        }
    },
    mutations: {
        SET_USER_LOCATION (state, location) {
            state.userLocation = location
        },
        SET_SELECTED_LOCATION (state, location) {
            state.selectedLocation = location
        },
        SET_STORES (state, stores) {
            state.stores = stores
        },
        SET_SELECTED_STORE (state, store) {
            state.selectedStore = store
        },
        SET_AVAILABLE_LOCATIONS (state, locations) {
            state.availableLocations = locations
        },
        SET_STORE_CARD_IMAGES (state, images) {
            state.storeCardImages = images
        },
        SET_MAP_ICONS (state, icons) {
            state.mapIcons = icons
        }
    },
    actions: {
        updateUserLocation ({commit}, payload) {
            // TODO: need to add function to detect user location using google maps location ws
            commit('SET_USER_LOCATION', payload)
        },
        updateSelectedStore ({commit}, payload) {
            commit('SET_SELECTED_STORE', payload)
        },
        updateSelectedLocation ({commit, state}, payload) {
            // payload: location object {state: 'FL', city: 'Orlando', postalCode: '32821'}
            if (payload.state in state.availableLocations && payload.city in state.availableLocations[payload.state]) {
                const location = state.availableLocations[payload.state][payload.city]
                commit('SET_SELECTED_LOCATION', location)
                // need to fetch the corresponding stores
                // we could instead issue ajax call or db search by city, state, and zip code
                // but we need to have a database with all stores by location and zip code
                // const storesDataUrl = state.availableLocations[location.state][location.city]['dataUrl']
                // read stores data from local json file
                Vue.http.get(state.storesDataUrl + location.dataUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data) {
                            const stores = data
                            commit('SET_STORES', stores)
                        }
                    })
            } else {
                commit('SET_STORES', [])
                // TODO: need to show an error message that no result is found
            }
        },
        fetchCities ({commit, dispatch, state}) {
            // will populate the cities from cosmic js REST API
            const params = {
                type_slug: 'cities'
            }
            Cosmic.getObjectsByType(params)
                .then(data => {
                    // need to transform cosmic json into our app json format, before we store into vuex
                    // TODO: need to take this logic outside this function or change the app logic to work
                    // TODO: with cosmic json format without any reformating.
                    let locations = {}
                    let country = ''
                    data.objects.forEach(city => {
                        const cityKey = city.slug.toUpperCase()
                        const stateKey = city.metadata.state.slug.toUpperCase()

                        if (!(stateKey in locations)) {
                            locations[stateKey] = {}
                        }
                        if (!(cityKey in locations[stateKey])) {
                            locations[stateKey][cityKey] = {}
                        }
                        if (!country) {
                            country = city.metadata.state.metadata.country.title
                        }
                        locations[stateKey][cityKey].city = city.title
                        locations[stateKey][cityKey].state = city.metadata.state.title
                        locations[stateKey][cityKey].postalCode = city.metadata.postal_code
                        locations[stateKey][cityKey].dataUrl = city.metadata.data_url
                        locations[stateKey][cityKey].country = country
                        locations[stateKey][cityKey].geoPoint = {
                            latitude: city.metadata.lat,
                            longitude: city.metadata.lng
                        }
                    })
                    commit('SET_AVAILABLE_LOCATIONS', locations)
                    // set the initial default location
                    dispatch('updateSelectedLocation', {state: 'FL', city: 'ORLANDO', postalCode: '32821'})
                })
                .catch(err => {
                    console.log(err)
                })
        },
        fetchStoreCardImages ({commit}) {
            // will get the images from Cosmic js media folder and store in vuex
            const params = {
                folder: 'store-card-images'
            }
            Cosmic.getMedia(params)
                .then(data => {
                    commit('SET_STORE_CARD_IMAGES', data.media)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        fetchMapIcons ({commit}) {
            // will fetch the map icons images from cosmic
            let icons = {}
            const params = {
                folder: 'map-images'
            }
            Cosmic.getMedia(params)
                .then(data => {
                    data.media.forEach(item => {
                        if (item.original_name === 'Shopping_Bag_3.svg') {
                            icons.defaultIcon = item.imgix_url
                        } else if (item.original_name === 'Shopping_Bag_6.svg') {
                            icons.selectedIcon = item.imgix_url
                        }
                    })
                    commit('SET_MAP_ICONS', icons)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})
