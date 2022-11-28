<template>
  <div id="app">
    <div id="nav">
      <router-link to="/appointments">Appointments</router-link> |
      <router-link to="/userProfile">UserProfile</router-link>
    </div>
    <div>app</div>
    <div>
      <router-view v-bind:user="user"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      placeholder: 'placeholder'
    }
  }
}
</script>

<style>

</style>
