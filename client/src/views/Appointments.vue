<template>
  <div class ="background">
    <div>
      <b-button class="btn_message" variant="primary" @click="appointmens" >Get all appointments</b-button>
    </div>
  </div>
</template>

<script>

import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      mymqtt: mymqtt.receiveNews,
      news: 'none',
      appointments: '',
      subscription: {
        topic: 'dentistimo/dentist-appointment/get-all-appointments',
        qos: 0
      },
      publish: {
        topic: 'dentistimo/dentist-appointment/all-appointments',
        qos: 0,
        payload: ''
      }
    }
  },
  mounted() {
    mymqtt.createConnection()
    mymqtt.subscribe(['dentistimo/dentist-appointment/get-all-appointments'], () => {
      console.log('got message')
    })
  },
  methods: {
    appointmens() {
      const message = {
        payload: '',
        topic: 'dentistimo/dentist-appointment/get-all-appointments',
        qos: this.publish.qos
      }
      console.log(message.topic + ' Hello Hello')
      console.log(message)
      mymqtt.publish(message.topic, message.payload, message.qos)
      console.log('Button clicked')
      this.appointments = this.mymqtt
    }
  }
}
</script>

<style scoped>
.background{

  height: 575px;
  background-color:#80BAB2
}

</style>
