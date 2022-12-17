<template>
  <div class="container">
    <div class="leftSide">
      <div>
        <p></p>
        <p id="infID">Dentists ID: {{accoountInfo.ID}}</p>
        <p id="infPas">password: {{accoountInfo.password}}</p>
        <p id="infCom">company: {{accoountInfo.company}}</p>
      </div>
      <div class="deleteAccount">
        <button class="btn btn-danger" id="buttonDeleteAccount" @click="deleteAccount">DELETE Account</button>
      </div>
    </div>
    <div class="rightSide">
      <div class="changeID">
        <p></p>
        <input v-model='changeIDText' placeholder="enter new ID">
        <p></p>
        <button class="btn btn-primary" id="buttonChangeIDButton" @click="changeID">changeID</button>
      </div>
      <div class="password">
        <p></p>
        <input v-model='changePasswordText' placeholder="enter new password">
        <p></p>
        <button class="btn btn-primary" id="buttonChangePassword" @click="changePassword">changeID</button>
      </div>
      <div class="company">
        <p></p>
        <input v-model='changeCompanyText' placeholder="enter new company name">
        <p></p>
        <button class="btn btn-primary" id="buttonChangeCompany" @click="changeCompany">changeID</button>
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
        company: 'company'
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
    },
    deleteAccount() {
      // delete account
    }
  }
}
</script>

<style scoped>
/* .container {} */
.leftSide {
  position: fixed;
  width: 25%;
  height: 100%;
  left: 0;
  background-color: #80BAB2;
}
.changeID,
.password,
.company {
  display: inline-block;
  margin: 10px;
}
#buttonChangeCompany,
#buttonChangePassword,
#buttonChangeIDButton {
  height: 100%;
  width: 100%;
}
.rightSide {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75%;
  height: 70vh;
  right: 0;
}
#infID,
#infPas,
#infCom {
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: rgb(255, 255, 255);
}
.deleteAccount {
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
#buttonDeleteAccount {
  color: rgb(255, 255, 255);
  background-color: #ff0000;
}
</style>
