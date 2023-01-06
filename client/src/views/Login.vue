<template>
  <div class="center">
    <div class="warning">
      <p id="pop-up">{{ this.unsuccessful }}</p>
    </div>
    <div class="card" style="width: 25rem;">
      <img class="card-img-top" src="https://img.freepik.com/free-vector/dentists-holding-instruments-examining-teeth-decay-white_1308-92127.jpg?w=740&t=st=1672838470~exp=1672839070~hmac=777c39ac851efd86106686fe5038f27eded8653e9269275f9a251ff89c35cd83" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">Welcome back!</h5>
        <p class="card-text">Enter your email and password to login or click register to be redirected to registration.</p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><input id="inputEmail" v-model='changeEmailText' placeholder="Email"></li>
        <li class="list-group-item"><input id="inputPassword" v-model='changePasswordText' placeholder="Password"></li>
        <!-- <input id="inputEmail" v-model='changeEmailText' placeholder="Email">
        <input id="inputpassword" v-model='changePasswordText' placeholder="Password">
      -->
      </ul>
      <div class="card-body">
        <button id="bittpnLogin" @click="login" class="btn btn-info btn-lg">Login</button>
        <button id="bittpnRegister" @click="register" class="btn btn-dark btn-lg">Register</button>
        <button id="buttonResetPassword" @click="resetPassword" class="btn btn-secondary">resent password</button>
      </div>
    </div>
    <!--
    <div class="inputAndButton">
      <input id="inputEmail" v-model='changeEmailText' placeholder="enter new email">
      <P></P>
      <input id="inputpassword" v-model='changePasswordText' placeholder="enter new password">
      <P></P>
      <button id="bittpnLogin" @click="login" class="btn btn-success btn-lg">login</button>
      <button id="bittpnRegister" @click="register" class="btn btn-success btn-lg">register</button>
    </div>
     -->
  </div>
</template>

<script>
import mymqtt from '../mymqtt'
import checkingInputs from '../checkingInputs'

export default {
  data() {
    return {
      notOrLogin: '',
      mqtt_client: null,
      receive: '',
      requestID: '',
      qos: 2,
      topic: 'dentistimo/login/dentist',
      changeEmailText: '',
      changePasswordText: '',
      unsuccessful: ''
    }
  },
  mounted() {
    this.mqtt_client = mymqtt.createClient()
    const msgCallback = (topic, message) => {
      this.unsuccessful = ''
      this.receive = message.toString()
      if (topic.includes('error')) {
        this.unsuccessful = this.receive
        console.log('failure')
      } else {
        console.log('success')
        console.log(this.receive)
        if (this.receive.includes(this.changeEmailText)) {
          // localStorage.removeItem('accountInfo') // --> don't know if there will be an error if it doesn't existwhen you first login for the first time
          localStorage.setItem('accountInfo', this.receive)
          this.$router.push('/')
          location.reload()
        } else {
          console.log('Login failed')
          this.unsuccessful = 'Login failed' // not working figured out when Felix is programs not running with my
        }
      }
      // console.log({ topic: topic, message: message.toString() })
    }
    this.mqtt_client.on('message', msgCallback)
    this.mqtt_client.on('subscribe', (topic) => {
      console.log('Subscribed too: ', topic)
    })
  },
  methods: {
    checkPassword() {
      const result1 = checkingInputs.containsSpecialChars(this.changePasswordText)
      const result2 = checkingInputs.strinContainsNumbers(this.changePasswordText)
      const result3 = checkingInputs.checkStringLength(this.changePasswordText)
      if (result1 === false) {
        this.unsuccessful = 'password needs a special character'
        return false
      } else if (result2 === false) {
        this.unsuccessful = 'password needs a number'
        return false
      } else if (result3 === false) {
        this.unsuccessful = 'password needs to be between 8 and 99 characters'
        return false
      } else {
        this.unsuccessful = ''
        return true
      }
    },
    login() {
      // const test1 = JSON.stringify({
      //   token: '123QWE!@#',
      //   dentistId: 12345,
      //   email: 'liamaxelrod@gmail.com',
      //   firstName: 'liam',
      //   lastName: 'axelrod',
      //   officeId: 1
      // })
      // localStorage.setItem('accountInfo', test1)
      const check = this.checkPassword()
      const check2 = checkingInputs.checkEmail(this.changeEmailText)
      if (check2 === false) {
        this.unsuccessful = 'email needs to contain @'
      } else if (check === false) {
        // responses in checkPassword()
      } else {
        this.requestID = checkingInputs.makeRandomId(10)
        this.mqtt_client.subscribe('dentistimo/login/dentist/' + this.requestID, { qos: 2 }, (error, res) => {
          if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
        })
        this.mqtt_client.subscribe('dentistimo/login/error/' + this.requestID, { qos: 2 }, (error, res) => {
          if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
        })
        const payload = JSON.stringify({
          email: this.changeEmailText,
          password: this.changePasswordText,
          requestId: this.requestID
        })
        this.mqtt_client.publish(this.topic, payload, this.qos)
        this.unsuccessful = 'login error please try again later' // if a message is received this will return to being blank
      }
    },
    register() {
      this.$router.push('/register')
    },
    resetPassword() {
      this.$router.push('/resetPassword')
    }
  }
}

</script>

<style>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  background-color: #80BAB2;
  min-width: 700px;
  min-height: 800px;
}

#bittpnRegister {
  display: inline-block;
  margin: 10px;
}

</style>
