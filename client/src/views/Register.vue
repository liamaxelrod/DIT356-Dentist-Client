<template>
    <div class="center">
        <div class="aboveButtons">
            <p  id="pop-up">{{this.stateIfSuccessful}}</p>
            <P></P>
            <input id="inputpassword" v-model='changePasswordText' placeholder="enter new password">
            <P></P>
            <input id="checkPassword" v-model='changeSamePasswordText' placeholder="reenter your password">
            <P></P>
            <input id="inputCompany" v-model='changecompanyText' placeholder="enter new Company">
            <P></P>
            <input id="inputeEmail" v-model='changeEmailText' placeholder="enter new Email">
            <P></P>
            <button id="registerButton" @click="register" class="btn btn-success btn-lg">register</button>
            <p onchange="myFunction" >| {{this.receive}} |</p>

        </div>
    </div>
</template>

<script>
// import App from '../App.vue'
import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      receive: mymqtt.receiveNews,
      news: 'none',
      changePasswordText: '',
      changeSamePasswordText: '',
      changecompanyText: '',
      changeEmailText: '',
      stateIfSuccessful: 'successful/failed to register',
      subscription: {
        topic: 'test',
        qos: 0
      },
      publish: {
        topic: 'test',
        qos: 0,
        payload: '{"userid": ' + this.changeIDText + ', "password": ' + this.changePasswordText + ', "company name": ' + this.changecompanyText + ', "email": ' + this.changeEmailText + ' }'
      }
    }
  },
  mounted() {
    console.log('test -> 1')
    mymqtt.createConnection()
    console.log('test -> 2')
    mymqtt.subscribe()
    console.log('test -> 3')
  },
  methods: {
    containsSpecialChars(str) {
      const specialChars = '[`!@#$%^&*()_+-=[]{};\':"\\|,.<>/?~]/'
      return specialChars.split('')
        .some((specialChar) => str.includes(specialChar))
    },
    containsNumbers(str) {
      const specialChars = '1234567890'
      return specialChars.split('')
        .some((specialChar) => str.includes(specialChar))
    },
    checkStringLength(str) {
      if (str.length >= 8 && str.length <= 16) {
        return true
      } else {
        return false
      }
    },
    checkForSamePasswords() {
      if (this.changePasswordText === this.changeSamePasswordText) {
        return true
      } else {
        return false
      }
    },
    checkPassword() {
      const result1 = this.containsSpecialChars(this.changePasswordText)
      const result2 = this.containsNumbers(this.changePasswordText)
      const result3 = this.checkStringLength(this.changePasswordText)
      if (result1 === true && result2 === true && result3 === true) {
        return true
      } else {
        return false
      }
    },
    checkCompany() {
      /* blank for now */
    },
    checkEmail() {
      /* blank for now */
    },
    register() {
      const message = {
        payload: '{"password": ' + this.changePasswordText + ', "company name": ' + this.changecompanyText + ', "email": ' + this.changeEmailText + ' }',
        topic: 'test',
        qos: 0
      }
      mymqtt.publish(message.topic, message.payload, message.qos)
    },
    myFunction() {
      console.log('do something')
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
