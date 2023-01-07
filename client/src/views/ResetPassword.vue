<template>
  <div class="center">
    <div class="warning">
      <p id="pop-up">{{ this.unsuccessful }}</p>
    </div>
    <div class="card" style="width: 25rareem;">
      <img class="card-img-top" src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">resetting your password</h5>
        <p class="card-text">Enter your email and password to login or click register to be redirected to registration.</p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><input id="inputEmail" v-model='emailText' placeholder="Email"> <button id="requestCode" @click="emailCode" class="btn btn-info">email code</button></li>
        <li class="list-group-item"><input id="inputcode" v-model='codeText' placeholder="insert code"></li>
        <li class="list-group-item"><input id="inputnewPassword" v-model='newPasswordText' placeholder="new password"></li>
        <li class="list-group-item"><input id="inputconfirmPassword" v-model='confirmPasswordText' placeholder="confirm password"></li>
      </ul>
      <div class="card-body">
        <button id="buttonResetPassword" @click="resetPassword" class="btn btn-secondary">resent password</button>
      </div>
    </div>
  </div>
</template>

<script>
import mymqtt from '../mymqtt'
import checkingInputs from '../checkingInputs'

export default {
  data() {
    return {
      qos: 2,
      topicEmail: 'dentistimo/send-email-code/dentist',
      topicSubscribeEmail: 'dentistimo/send-email-code/dentist/',
      topicReset: 'dentistimo/reset-password/dentist',
      topicSubscribeReset: 'dentistimo/reset-password/dentist/',
      topicError: 'dentistimo/reset-password/error',
      topicSubscribeError: 'dentistimo/reset-password/error/',
      mqtt_client: null,
      requestID: '',
      receive: '',
      unsuccessful: '',
      emailText: '',
      codeText: '',
      newPasswordText: '',
      confirmPasswordText: ''
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
      } else if (topic.includes('success')) {
        console.log('success')
        console.log(this.receive)
      }
    // console.log({ topic: topic, message: message.toString() })
    }
    this.mqtt_client.on('message', msgCallback)
    this.mqtt_client.on('subscribe', (topic) => {
      console.log('Subscribed too: ', topic)
    })
  },
  methods: {
    emailCode() {
      this.requestID = checkingInputs.makeRandomId(10)
      const payload = JSON.stringify({
        email: this.emailText,
        requestId: this.requestID
      })
      console.log(payload)
      this.publishReceive(payload, this.topicEmail, this.topicSubscribeEmail)
    },
    resetPassword() {
      const result = this.checkPassword()
      const result2 = checkingInputs.checkSameString(this.newPasswordText, this.confirmPasswordText)
      if (result === true) {
        this.requestID = checkingInputs.makeRandomId(10)
        const payload = JSON.stringify({
          email: this.emailText,
          userCode: this.codeText,
          newPassword: this.newPasswordText,
          requestId: this.requestID
        })
        this.publishReceive(payload, this.topicReset, this.topicSubscribeReset)
      } else if (result2 === false) {
        this.unsuccessful = 'passwords do not match'
      }
    },
    publishReceive(payload, publishTopic, subscribeTopic) {
      this.mqtt_client.subscribe(subscribeTopic + this.requestID, { qos: this.qos }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      this.mqtt_client.publish(publishTopic, payload, this.qos)
    },
    checkPassword() {
      const result1 = checkingInputs.containsSpecialChars(this.newPasswordText)
      const result2 = checkingInputs.strinContainsNumbers(this.newPasswordText)
      const result3 = checkingInputs.checkStringLength(this.newPasswordText)
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
min-height: 1100px;
}
.card {
  height: 100%;
  width: 30%;
}
#requestCode {
position: relative;
left: 20px;
padding: 5px;
}

</style>
