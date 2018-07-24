import Vue from 'vue'

export default new Vue({
    methods: {
        recenterMapLocation () {
            this.$emit('recenterMapLocation')
        }
    }
})
