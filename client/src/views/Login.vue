<template>
    <div class="center">
        <div class="warning">
          <p id="pop-up">{{this.unsuccessful}}</p>
        </div>
        <div class="inputAndButton">
            <input id="inputEmail" v-model='changeEmailText' placeholder="enter new email">
            <P></P>
            <input id="inputpassword" v-model='changePasswordText' placeholder="enter new password">
            <P></P>
            <button id="bittpnLogin" @click="login" class="btn btn-success btn-lg">login</button>
            <button id="bittpnRegister" @click="register" class="btn btn-success btn-lg">register</button>
        </div>
    </div>
</template>

<script>
import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      mqtt_client: null,
      receive: '',
      qos: 0,
      topic: 'dentist/client/login',
      changeEmailText: '',
      changePasswordText: '',
      unsuccessful: ''
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
    this.mqtt_client.subscribe('dentist/client/login', { qos: 0 }, (error, res) => {
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
    checkEmail(string) {
      const condition = string.includes('@')
      if (condition) {
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
    login() {
      const check = this.checkPassword()
      const check2 = this.checkEmail(this.changeEmailText)
      if (check2 === false) {
        this.unsuccessful = 'email needs to contain @'
      } else if (check === false) {
        // responses in checkPassword()
      } else {
        const payload = '{"email": ' + this.changeEmailText + ', "password": ' + this.changePasswordText + ' }'
        this.mqtt_client.publish(this.topic, payload, this.qos)
      }
    },
    register() {
      // not working
      this.$router.push('/register')
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
}
#bittpnRegister {
    display: inline-block;
    margin: 10px;
}
</style>
