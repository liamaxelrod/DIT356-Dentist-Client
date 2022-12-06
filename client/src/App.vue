<template>
  <div id="app">
    <Logo_Dentistimo/>
    <div>
      <div>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand href="/">Dentistimo</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="/appointments">Appointments</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
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
    </div>
    <router-view />
  <div id="footer">
      <p class="copy">© 2022 Dentistimo</p>
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
  #footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}

</style>
