<template>
    <v-container fluid fill-height grid-list-lg>
        <v-layout row wrap align-content-start >
            <v-flex xs4 sm3>
                <transition appear enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
                    <app-search-panel></app-search-panel>
                </transition>
            </v-flex>
            <v-flex xs8 sm9>
                <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
                    <app-map-panel></app-map-panel>
                </transition>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import SearchPanel from './SearchPanel'
import MapPanel from './MapPanel'

export default {
    data () {
        return {
            message: 'Welcome to the store locator'
        }
    },
    components: {
        'app-search-panel': SearchPanel,
        'app-map-panel': MapPanel
    }
}
</script>
