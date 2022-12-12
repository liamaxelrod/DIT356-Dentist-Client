<template>
  <div id="app">
    <Logo_Dentistimo/>
    <div id="nav">
      <div></div>
      <router-link class ="nav" to="/appointments">Appointments</router-link> |
      <router-link class = "nav" to="/userProfile">Profile</router-link>
      <router-link class = "nav" to="/login">Login</router-link>
    </div>
    <div>

    </div>
    <div>
      <router-view v-bind:user="user"/>
    </div>
  </div>
</template>

<script>
import Logo from './components/Logo.vue'

export default {
  components: {
    Logo_Dentistimo: Logo
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 1rem 1.5rem;
  background-color: #0092CA;
}

</style>
