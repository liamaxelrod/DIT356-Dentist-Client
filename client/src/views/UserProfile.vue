<template>
  <div class="container">
    <div class="leftSide">
      <div>
        <p></p>
        <input v-model='textChange' placeholder="enter new ID">
        <p>Dentists ID: {{accoountInfo.ID}}</p>
        <button id="changeIDButton" @click="changeID">changeID</button>
      </div>
    </div>
    <div class="rightSide">
      <div>
        <p>dddd
        </p>
      </div>
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

<style scoped>
.container {
  margin: 0 0 0 0;
  border: 0 0 0 0;
  padding: 0 0 0 0;
  width: 100%;
  height: 100%;
}
.leftSide {
  position: fixed;
  width: 25%;
  height: 100%;
  left: 0;
  background-color: #80BAB2;
}
.rightSide {
  position: fixed;
  width: 75%;
  height: 100%;
  right: 0;
  background-color: #ba8081;
}
</style>
