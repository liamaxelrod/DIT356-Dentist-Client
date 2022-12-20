<template>
    <div class="center">
        <div class="warning">
          <p id="pop-up">{{this.unsuccessful}}</p>
        </div>
        <div class="inputAndButton">
            <input id="inputID" v-model='changeIDText' placeholder="enter new ID">
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
      changeIDText: '',
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
    checkID() {
      /* blank for now */
    },
    checkPassword() {
      /* blank for now */
    },
    login() {
      const payload = '{"ID": ' + this.changeIDText + ', "password": ' + this.changePasswordText + ' }'
      this.mqtt_client.publish(this.topic, payload, this.qos)
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
