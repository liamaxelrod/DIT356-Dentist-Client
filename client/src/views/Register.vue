<template>
    <div class="center">
        <div class="aboveButtons">
            <p  id="pop-up">{{this.stateIfSuccessful}}</p>
            <input id="inputID" v-model='changeIDText' placeholder="enter new ID">
            <P></P>
            <input id="inputpassword" v-model='changePasswordText' placeholder="enter new password">
            <P></P>
            <input id="inputCompany" v-model='changecompanyText' placeholder="enter new Company">
            <P></P>
            <input id="inputeEmail" v-model='changeEmailText' placeholder="enter new Email">
            <P></P>
            <button id="registerButton" class="btn btn-success btn-lg">register</button>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      changeIDText: '',
      changePasswordText: '',
      changecompanyText: '',
      changeEmailText: '',
      stateIfSuccessful: 'successful/failed to register'
    }
  },
  mounted() {
    /* blank for now */
  },
  methods: {
    checkID() {
      /* blank for now */
    },
    checkPassword() {
      /* blank for now */
    },
    checkCompany() {
      /* blank for now */
    },
    checkEmail() {
      /* blank for now */
    }
  }
}
</script>

<style>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    background-color: #80BAB2;
    /*
    height: 100%;
    width: 100%;
    problem with overall CSS app page I think for this part to work with the CSS
    */
}
/* .pop-up {blank for now}  */
#registerButton {
    height: 100%;
    width: 100%;
}
</style>
