<template>
    <v-container>
        <v-layout justify-center align-center>
            <v-flex xs12 sm6>
                <transition appear enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
                <v-card class="text-xs-center elevation-6">
                    <v-card-media
                        height="240px"
                        :src="storeCardImage()">
                    </v-card-media>
                    <v-card-title primary-title class="justify-center">
                        <h3 class="headline mb-0">{{ storeData.displayName }}</h3>
                        <div>#{{ id }}</div>
                    </v-card-title>
                    <v-card-text>
                        <div>{{ storeData.address.address }}</div>
                        <div>{{ storeData.address.city}}, {{storeData.address.state}} {{storeData.address.postalCode}}</div>
                        <div><a :href="'tel:'+storeData.phone">{{ storeData.phone }}</a></div>
                        <div>{{ getStoreHoursDesc(storeData) }}</div>
                        <div><span>Mon - Sun</span><span class="span-pipe">|</span><span>{{ getStoreHoursDesc(storeData) }}</span></div>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-btn flat color="info" :to="{name: 'Home'}">Go back</v-btn>
                    </v-card-actions>
                </v-card>
                </transition>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import moment from 'moment'

export default {
    props: ['id'],
    data () {
        return {
            message: 'Welcome to the store details'
        }
    },
    computed: {
        storeData () {
            return this.$store.getters.getStoreById(this.id)
        }
    },
    methods: {
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
        getTimeStamp () {
            return moment().format('X')
        },
        storeCardImage () {
            let allImages = this.$store.getters.storeCardImages
            if (allImages.length) {
                const index = Math.floor(Math.random() * allImages.length)
                return allImages[index].imgix_url
            } else {
                // TODO: add local static image url here.
                return ''
            }
        }
    }
}
</script>
<style>
.span-pipe {
    padding-left: 10px;
    padding-right: 10px;
}
</style>
