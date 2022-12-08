<template>
  <div class="container">
    <div class="leftSide">
      <div>
        <p></p>
        <p>Dentists ID: {{accoountInfo.ID}}</p>
        <p>password: {{accoountInfo.password}}</p>
        <p>company: {{accoountInfo.company}}</p>
      </div>
    </div>
    <div class="rightSide">
      <div class="changeID">
        <p></p>
        <input v-model='changeIDText' placeholder="enter new ID">
        <p></p>
        <button id="changeIDButton" @click="changeID">changeID</button>
      </div>
      <div class="password">
        <p></p>
        <input v-model='changePasswordText' placeholder="enter new password">
        <p></p>
        <button id="changePassword" @click="changePassword">changeID</button>
      </div>
      <div class="company">
        <p></p>
        <input v-model='changeCompanyText' placeholder="enter new company name">
        <p></p>
        <button id="changeCompany" @click="changeCompany">changeID</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      changeIDText: '',
      changePasswordText: '',
      changeCompanyText: '',
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
      this.accoountInfo.ID = this.changeIDText
    },
    changePassword() {
      this.accoountInfo.password = this.changePasswordText
    },
    changeCompany() {
      this.accoountInfo.company = this.changeCompanyText
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
  /* background-color: #ba8081; */
}
.changeID,
.password,
.company {
  float: left, center;
  display: inline-block;
  margin: 10px;
}
</style>
