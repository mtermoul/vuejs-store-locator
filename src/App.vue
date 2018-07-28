<template>
    <div id="app">
        <v-app id="app">
            <v-toolbar color="indigo darken-1" dark fixed app>
                <v-icon>location_on</v-icon>
                <v-toolbar-title>Walmart store locator</v-toolbar-title>
            </v-toolbar>
            <v-content>
                <router-view></router-view>
            </v-content>
            <v-footer color="indigo lighten-1" app inset>
                <span class="white--text">&copy; 2018 Proudly powered by Cosmic JS</span>
                <v-spacer></v-spacer>
                <span class="white--text">Attributions: <a class="white--text" href="https://pepsized.com/free-png-and-svg-location-icons-collection/">Joe Vains (map icons)</a></span>
            </v-footer>
        </v-app>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
html,
body,
#app {
    height: 100%;
}
</style>
