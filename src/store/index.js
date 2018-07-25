import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

Vue.use(Vuex)
Vue.use(VueResource)

export default new Vuex.Store({
    state: {
        userLocation: {},
        selectedLocation: {},
        selectedStore: null,
        availableLocations: {
            FL: {
                Orlando: {
                    dataUrl: '../../static/data/stores_orlando_fl.json',
                    postalCode: '32801',
                    country: 'USA',
                    state: 'FL',
                    geoPoint: {
                        'latitude': 28.536694,
                        'longitude': -81.380851
                    }
                },
                Jacksonville: {
                    dataUrl: '../../static/data/stores_jacksonville_fl.json',
                    postalCode: '32202',
                    country: 'USA',
                    state: 'FL',
                    geoPoint: {
                        'latitude': 30.325974,
                        'longitude': -81.660454
                    }
                },
                Miami: {
                    dataUrl: '../../static/data/stores_miami_fl.json',
                    postalCode: '33131',
                    country: 'USA',
                    state: 'FL',
                    geoPoint: {
                        'latitude': 25.771205,
                        'longitude': -80.193937
                    }
                },
                Tempa: {
                    dataUrl: '../../static/data/stores_tempa_fl.json',
                    postalCode: '33602',
                    country: 'USA',
                    state: 'FL',
                    geoPoint: {
                        'latitude': 27.948891,
                        'longitude': -82.457665
                    }
                }
            }
        },
        stores: []
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
                    data.push(cityKey + ', ' + stateKey)
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
                location.city = payload.city
                commit('SET_SELECTED_LOCATION', location)
                // need to fetch the corresponding stores
                // we could instead issue ajax call or db search by city, state, and zip code
                // but we need to have a database with all stores by location and zip code
                // const storesDataUrl = state.availableLocations[location.state][location.city]['dataUrl']
                // read stores data from local json file
                Vue.http.get(location.dataUrl)
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
        }
    }
})
