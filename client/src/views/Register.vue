<template>
    <div class="background">
        <div class="warning">
          <p id="pop-up" >{{this.unsuccessful}}</p>
        </div>
        <div class="aboveButtons">
            <input id="inputFirstName" v-model='changeFirstNameText' placeholder="enter your first name">
            <P></P>
            <input id="inputLastName" v-model='changeLastNameText' placeholder="enter your last name">
            <P></P>
            <input id="inputpassword" v-model='changePasswordText' placeholder="enter new password">
            <P></P>
            <input id="checkPassword" v-model='changeCheckPasswordText' placeholder="reenter your password">
            <P></P>
            <input id="inputCompany" v-model='changecompanyText' placeholder="enter new Company">
            <P></P>
            <input id="inputeEmail" v-model='changeEmailText' placeholder="enter new Email">
            <P></P>
            <button id="registerButton" @click="register" class="btn btn-success btn-lg">register</button>
        </div>
    </div>
</template>

<script>
// import App from '../App.vue'
import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      mqtt_client: null,
      receive: '', // receives messages
      requestID: '',
      qos: 0,
      topic: 'dentistimo/register/dentist',
      changeFirstNameText: '',
      changeLastNameText: '',
      changePasswordText: '',
      changeCheckPasswordText: '',
      changecompanyText: '',
      changeEmailText: '',
      unsuccessful: '',
      subscription: {
        topic: 'test',
        qos: 0
      }
    }
  },
  mounted() {
    this.mqtt_client = mymqtt.createClient()
    const msgCallback = (topic, message) => {
      this.receive = message.toString()
      console.log(topic)
      if (topic.includes('error')) {
        this.unsuccessful = this.receive
      } else {
        console.log('success')
      }
      // console.log({ topic: topic, message: message.toString() })
    }
    this.mqtt_client.on('message', msgCallback)
    this.mqtt_client.on('subscribe', (topic) => {
      console.log('Subscribed too: ', topic)
    })
    // this.mqtt_client.subscribe('dentistimo/register/dentist', { qos: 0 }, (error, res) => {
    //   if (error) {
    //     console.log('error = ', error)
    //   } else {
    //     console.log('res = ', res)
    //   }
    // })
  },
  methods: {
    makeid(n) {
      let text = ''
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < n; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return text
    },
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
      if (this.changePasswordText === this.changeCheckPasswordText) {
        return true
      } else {
        return false
      }
    },
    checkPassword() {
      const result1 = this.containsSpecialChars(this.changePasswordText)
      const result2 = this.containsNumbers(this.changePasswordText)
      const result3 = this.checkStringLength(this.changePasswordText)
      if (result1 === false) {
        this.unsuccessful = 'password needs a special character'
        return false
      } else if (result2 === false) {
        this.unsuccessful = 'password needs a number'
        return false
      } else if (result3 === false) {
        this.unsuccessful = 'password needs to be between 8 and 16 characters'
        return false
      } else {
        this.unsuccessful = ''
        return true
      }
    },
    register() {
      if (this.checkPassword() === false) {
        // responses are in checkPassword()
      } else if (this.checkForSamePasswords() === false) {
        this.unsuccessful = 'passwords are not the same'
      } else if (this.changeFirstNameText === '') {
        this.unsuccessful = 'first name is empty'
      } else if (this.changeLastNameText === '') {
        this.unsuccessful = 'last name is empty'
      } else if (this.changecompanyText === '') {
        this.unsuccessful = 'company is empty'
      } else if (this.changeEmailText === '') {
        this.unsuccessful = 'email is empty'
      } else {
        this.requestID = this.makeid(10)
        // console.log(this.requestID)
        this.mqtt_client.subscribe('dentistimo/register/dentist/' + this.requestID, { qos: 0 }, (error, res) => {
          if (error) {
            console.log('error = ', error)
          } else {
            console.log('res = ', res)
          }
        })
        this.mqtt_client.subscribe('dentistimo/register/error/' + this.requestID, { qos: 0 }, (error, res) => {
          if (error) {
            console.log('error = ', error)
          } else {
            console.log('res fail = ', res)
          }
        })
        const payload = JSON.stringify({
          firstName: this.changeFirstNameText,
          lastName: this.changeLastNameText,
          password: this.changePasswordText,
          passwordCheck: this.changeCheckPasswordText,
          companyName: this.changecompanyText,
          email: this.changeEmailText,
          requestId: this.requestID
        })
        this.mqtt_client.publish(this.topic, payload, this.qos)
      }
    }
  }
}
</script>

<style>
.background {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    background-color: #80BAB2;
}
#pop-up {
    color: red;
    font-size: 20px;
}
#registerButton {
    width: 100%;
}
</style>
