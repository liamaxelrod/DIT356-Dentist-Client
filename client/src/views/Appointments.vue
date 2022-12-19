<template>
  <div class ="background">
    <div>
      <b-button class="btn_message" variant="primary" @click="appointments" >Get all appointments</b-button>
      <p onchange="myFunction" >| {{this.receive}} |</p>
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
      news: 'none',
      subscription: {
        topic: 'dentistimo/dentist-appointment/all-appointments',
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
    this.mqtt_client.subscribe('dentistimo/dentist-appointment/all-appointments', { qos: 0 }, (error, res) => {
      if (error) {
        console.log('error = ', error)
      } else {
        console.log('res = ', res)
      }
    })
  },
  /*
Fetching the appointments of dentistid "xxxx". Next step is to incoprate it so it knows what dentist is logged in and uses that dentist
  */
  methods: {
    appointments() {
      const payload = '{ "dentistid": 687181763 }'
      const topic = 'dentistimo/dentist-appointment/get-all-appointments'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    },
    myFunction() {
      console.log('do something')
    }
  }
}
</script>

<style scoped>
/*
Change so it covers 100% not PX
*/
.background{

  height: 575px;
  background-color:#80BAB2
}

</style>
