<template>
  <div id="app">
    <Logo_Dentistimo/>
    <div>
      <div class="NavigationBar">
        <b-navbar toggleable="lg" type="dark" variant="dark">
          <b-navbar-brand href="/">Dentistimo</b-navbar-brand>
          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-item href="/appointments">Appointments</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
              <b-navbar-nav>
                <!-- TODO! If logged in change to logout button instead -->
                  <b-nav-item href="/login">Login</b-nav-item>
                  <b-nav-item href="/register">register</b-nav-item>
                </b-navbar-nav>
              <b-nav-item-dropdown right>
                <template #button-content>
                  <em>User</em>
                </template>
                <b-dropdown-item href="/userProfile">User Profile</b-dropdown-item>
                <b-dropdown-item href="/">Sign Out</b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
      <div class="image">
        <!-- <img src="https://i0.wp.com/thedentistsdorridge.co.uk/wp-content/uploads/2019/11/be_a_denist.jpg?fit=1024%2C683&ssl=1" style="width: 100%" /> -->
      </div>
    </div>
    <router-view />
  <div id="footer">
      <p class="copy">© 2022 Dentistimo</p>
    </div>
  </div>
</template>

<script>
import Logo from './components/Logo.vue'
//
// import mymqtt from './mymqtt'

export default {
  components: {
    Logo_Dentistimo: Logo
  },
  data() {
    return {
      message: 'none'
    }
  },
  mounted() {
  },
  methods: {
  }
}

</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100vh;
}
  #footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}
</style>
