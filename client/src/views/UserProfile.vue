<template>
  <div>
    <div>
      <p></p> <!-- learn to move this div to the side of the page-->
      <input v-model='textChange' placeholder="enter new ID">
      <!-- <label> Value: {{accoountInfo.ID}} </label> -->
      <p>Dentists ID: {{accoountInfo.ID}}</p>
      <button id="changeIDButton" @click="changeID">changeID</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textChange: '',
      accoountInfo: {
        ID: 'username',
        password: 'password',
        company: 'company',
        aboutDentist: 'about dentist'
      },
      price: {
        teethCleaning: 'teeth cleaning',
        cavityRemoval: 'cavity removal',
        xRay: 'x-ray'
      }
    }
  },
  mounted() {},
  methods: {
    changeID() {
      this.accoountInfo.ID = this.textChange
    }
  }
}
</script>

<style>
</style>
