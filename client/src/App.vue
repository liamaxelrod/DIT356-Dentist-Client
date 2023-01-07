<template>
  <div id="app">
    <Logo_Dentistimo/>
    <div>
      <div class="NavigationBar">
        <b-navbar id="fullNavbar" toggleable="lg" type="dark" variant="dark">
          <b-navbar-brand href="/">Dentistimo  {{ this.accountStatus }}{{ this.name }} </b-navbar-brand>
          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
             <b-nav-item href="/userProfile"></b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
              <b-navbar-nav>
                <b-nav-item v-if="this.login === false" href="/login">Login</b-nav-item>
                <b-nav-item v-else></b-nav-item>
                <b-nav-item v-if="this.login === false" href="/register">Register</b-nav-item>
                <b-nav-item v-else></b-nav-item>
                <b-nav-item v-if="this.login === true" @click="appointments">Appointments</b-nav-item> <!-- moved to the far right -->
                <b-nav-item v-else></b-nav-item>
              </b-navbar-nav>
              <b-nav-item-dropdown v-if="this.login === true" right>
                <template v-if="this.login === true" #button-content>
                  <em>User</em>
                </template>
                <b-dropdown-item @click="userProfile" >User Profile</b-dropdown-item>
                <b-dropdown-item @click="logout" >Sign Out</b-dropdown-item>
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
 <!-- <div id="footer">
      <p class="copy">© 2022 Dentistimo</p>
    </div>
     -->
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
      page: '',
      login: false,
      accountStatus: '',
      name: ''
    }
  },
  mounted() {
    this.page = this.$route.path
    console.log(this.page)
    if (!this.checkIfLogin()) {
      console.log('not logged in ' + this.login)
      this.login = false
    } else {
      this.accountStatus = 'Welcome'
      this.name = ' ' + JSON.parse(localStorage.getItem('accountInfo')).firstName
      this.login = true
      console.log(this.name)
      console.log('logged in ' + this.login)
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('accountInfo')
      // check if it's already on our page
      if (this.$route.path === '/') {
        console.log('already on home page')
      } else {
        this.$router.push('/')
      }
      location.reload()
    },
    userProfile() {
      if (!this.checkIfLogin()) {
        // do something
      } else {
        this.$router.push('/userProfile')
        location.reload()
      }
    },
    appointments() {
      if (!this.checkIfLogin()) {
        // do something
      } else {
        this.$router.push('/appointments')
        location.reload()
      }
    },
    checkIfLogin() {
      const checkOfExists = localStorage.getItem('accountInfo')
      if (checkOfExists === null) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  width: 100%;
  min-width: 1100px;
  min-height: 800px;
}
/* #fullNavbar {
  min-width: 1100px;
} */
  #footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}
</style>
