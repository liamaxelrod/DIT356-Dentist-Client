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
            <input id="checkPassword" v-model='changeSamePasswordText' placeholder="reenter your password">
            <P></P>
            <input id="inputCompany" v-model='changecompanyText' placeholder="enter new Company">
            <P></P>
            <input id="inputeEmail" v-model='changeEmailText' placeholder="enter new Email">
            <P></P>
            <button id="registerButton" @click="register" class="btn btn-success btn-lg">register</button>
            <p> {{this.receive}} </p>
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
      receive: '',
      qos: 0,
      topic: 'dentist/client/register',
      topic2: 'test/dentistClient/register',
      changeFirstNameText: '',
      changeLastNameText: '',
      changePasswordText: '',
      changeSamePasswordText: '',
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
      console.log({ topic: topic, message: message.toString() })
    }
    this.mqtt_client.on('message', msgCallback)
    this.mqtt_client.on('subscribe', (topic) => {
      console.log('Subscribed too: ', topic)
    })
    this.mqtt_client.subscribe('dentist/client/register', { qos: 0 }, (error, res) => {
      if (error) {
        console.log('error = ', error)
      } else {
        console.log('res = ', res)
      }
    })
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
      console.log(result1)
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
        // nothing happens
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
        const payload = '{"firstName": ' + this.changeFirstNameText + ', "lastName": ' + this.changeLastNameText + ', "password": ' + this.changePasswordText + ', "companyName": ' + this.changecompanyText + ', "email": ' + this.changeEmailText + ' }'
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
    height: 70vh;
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
