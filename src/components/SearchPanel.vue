<template>
    <v-card color="cyan accent-4" class="elevation-8 fill-height">
        <v-container fluid grid-list-lg>
            <v-layout row wrap>

                <v-flex xs1>
                    <v-icon class="recenter-map-icon" title="Recenter map location" @click="onRecenterMapLocation">my_location</v-icon>
                </v-flex>
                <v-flex xs10 offset-xs1>
                    <div class="subheading" v-show="!isSelectedLocationEdited">
                        <span>Your location:</span>
                        <a @click="onEditSelectedLocation"
                            href="#" class="white--text">{{ selectedLocation }}</a>
                    </div>
                    <div class="subheading location-edit" v-show="isSelectedLocationEdited">
                        <v-combobox label="Select a location"
                            ref="locationCombobox"
                            v-model="selectedLocation"
                            :items="availableLocations"
                            @change="onLocationChange"
                            @blur.self="onLocationBlur"
                            @input="onLocationBlur"
                            class="inline-input">
                        </v-combobox>
                    </div>
                </v-flex>

                <v-flex xs12 class="stores-list">
                    <div class="subheading">Nearby Stores ({{ storesCount }})</div>
                    <v-container fluid class="stores-list-container">
                        <v-layout row wrap>
                            <template v-for="store in stores">

                                <v-flex xs12 :key="'store-card-' + store.id"
                                    class="store-container" @mouseover="hoveredOnStore=store.id" @mouseleave="hoveredOnStore=null" :class="[(hoveredOnStore===store.id && selectedStore!==store.id)? 'animated pulse store-hovered-on': '']">
                                    <v-card class="store-item-card"
                                        :class="{isSelected: selectedStore === store.id}"
                                        @click.capture="onStoreClick(store.id)">
                                        <v-card-text>
                                            <router-link :to="{name: 'Store', params: {id: store.id}}">
                                                <div class="subheading font-weight-medium">{{ store.displayName}}</div>
                                            </router-link>
                                            <div>{{ store.address.address}}</div>
                                            <div>{{ store.address.city}}, {{store.address.state}} {{store.address.postalCode}}</div>
                                            <div>
                                                <span><a :href="'tel:'+store.phone">{{ store.phone }}</a></span>
                                                <span class="store-hours">{{ getStoreHoursDesc(store) }}</span>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-flex>

                            </template>
                        </v-layout>
                    </v-container>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>
<script>
import {mapActions} from 'vuex'
import moment from 'moment'
import EventBus from '../eventBus'

export default {
    data () {
        return {
            isSelectedLocationEdited: false,
            editedLocation: null,
            ignoreScrollToSelectedStore: false,
            hoveredOnStore: null
        }
    },
    props: {
        userLocation: { type: Object, default: () => { return {state: 'FL', city: 'Orlando', postalCode: '32821'} } }
    },
    computed: {
        selectedLocation: {
            get () {
                const location = this.$store.getters.selectedLocation
                return location.city + ', ' + location.state
            },
            set (newValue) {
                // store the edited location in temp variable before confirming and commit to vuex store
                this.editedLocation = newValue
            }
        },
        fullSelectedLocation () {
            return this.$store.getters.selectedLocation
        },
        selectedStore: {
            get () {
                return this.$store.getters.selectedStore
            },
            set (value) {
                this.updateSelectedStore(value)
            }
        },
        availableLocations () {
            return this.$store.getters.availableLocationsShort
        },
        stores () {
            return this.$store.getters.stores
        },
        storesCount () {
            return this.stores.length
        }
    },
    watch: {
        selectedStore (newValue, oldValue) {
            // need to wait until the selected store class changes
            if (this.ignoreScrollToSelectedStore) {
                this.ignoreScrollToSelectedStore = false
            } else {
                // triger the auto scroll only if the selection is triggered from outside the list
                setTimeout(() => {
                    this.scrollToSelectedStore()
                }, 50)
            }
        }
    },
    methods: {
        ...mapActions(['updateSelectedLocation', 'updateSelectedStore']),
        // -------------------
        // events
        // -------------------
        onEditSelectedLocation () {
            this.isSelectedLocationEdited = !this.isSelectedLocationEdited
            setTimeout(() => {
                this.$refs.locationCombobox.focus()
            }, 100)
        },
        onStoreClick (storeId) {
            this.ignoreScrollToSelectedStore = true
            this.selectedStore = storeId
        },
        onRecenterMapLocation () {
            // need to emit the event to parent component
            // we can either use the event bus
            // or we can use vuex
            EventBus.recenterMapLocation()
        },
        onLocationChange () {
            if (this.editedLocation) {
                const location = this.editedLocation.split(', ')
                this.updateSelectedLocation({state: location[1], city: location[0].toUpperCase(), postalCode: ''})
                this.resetComponentData()
            }
        },
        onLocationBlur () {
            // clear the combobox edit mode if no changes.
            if (this.isSelectedLocationEdited && !this.editedLocation) {
                this.editedLocation = null
                this.isSelectedLocationEdited = false
            }
        },
        // -------------------
        // other methods
        // -------------------
        getStoreHoursDesc (store) {
            if (store.operationalHours.open24Hours) {
                return 'Open 24 hours'
            } else if (store.operationalHours.todayHrs) {
                return 'Open until: ' + moment(store.operationalHours.todayHrs.endHr, 'hh:mm').format('hh:mm a')
            } else if (store.operationalHours.monToFriHrs) {
                return 'Open until: ' + moment(store.operationalHours.monToFriHrs.endHr, 'hh:mm').format('hh:mm a')
            } else {
                return '(call for store hours)'
            }
        },
        scrollToSelectedStore () {
            // scroll to the selected store
            const storesList = this.$el.querySelector('.container.stores-list-container')
            const selectedStore = this.$el.querySelector('.store-item-card.v-card.isSelected')
            if (storesList && selectedStore) {
                storesList.scrollTop = selectedStore.offsetTop - selectedStore.offsetHeight
            }
        },
        scrollToStoresListTop () {
            const storesList = this.$el.querySelector('.container.stores-list-container')
            if (storesList) {
                storesList.scrollTop = 0
            }
        },
        resetComponentData () {
            this.editedLocation = null
            this.isSelectedLocationEdited = false
            this.selectedStore = null
            this.ignoreScrollToSelectedStore = false
            this.scrollToStoresListTop()
        }
    }
}
</script>
<style>
.location-edit .inline-input {
    display: inline-flex;
    width: 70%;
}
.location-edit .inline-button {
    margin-left: 0;
    margin-right: 0;
}
.stores-list-container {
    padding-left: 0;
    padding-right: 0;
    height: 60vh;
    overflow: auto;
    padding-top: 10px;
}
.store-container {
    /*padding-left: 0!important;
    padding-right: 0!important;*/
}
.store-container.store-hovered-on .store-item-card {
    outline: 5px solid #9FA8DA;
    background-color: #BBDEFB;
}
.store-hours {
    padding-left: 20px;
}
.store-item-card {
    cursor: pointer;
}
.store-item-card.isSelected {
    border: 4px solid #5C6BC0;
    background-color: #BBDEFB;
}
.recenter-map-icon {
    cursor: pointer;
}
</style>
