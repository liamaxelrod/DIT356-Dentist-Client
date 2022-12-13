<template>
    <div class="center">
        <div class="aboveButtons">
            <p  id="pop-up">{{this.stateIfSuccessful}}</p>
            <input id="inputID" v-model='changeIDText' placeholder="enter new ID">
            <P></P>
            <input id="inputpassword" v-model='changePasswordText' placeholder="enter new password">
            <P></P>
            <button id="bittpnLogin" class="btn btn-success btn-lg">login</button>
            <button id="bittpnRegister" class="btn btn-success btn-lg">register</button>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      changeIDText: '',
      changePasswordText: '',
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
    /*
    height: 100%;
    width: 100%;
    problem with overall CSS app page I think for this part to work with the CSS
    */
}
/* .pop-up {blank for now}  */
/* #bittpnLogin {blank for now}  */
#bittpnRegister {
    display: inline-block;
    margin: 10px;
}
</style>
