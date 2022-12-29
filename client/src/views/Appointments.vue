<template class="test">
  <div class ="background">
    <div class="div1">
      <!-- https://bootstrap-vue.org/docs/components/calendar#comp-ref-b-calendar-props -->
      <b-row>
    <b-col md="auto">
      <!-- ADD INFORMATION IF THERE IS NO APPOINTMENT THAT DAY -->
      <b-calendar v-model="value" locale="en-EU"></b-calendar>
    </b-col>
  </b-row>
  <b class="btn btn-dark" @click="appointments" style= "width: 17rem;">Get appointments</b>
  <div class="card border-info mb-3" style="width: 17rem;">
  <div class="card-header text-info">
    Appointment information </div>
        <ul class="list-group list-group-flush text-info">
          <li class="list-group-item" v-bind="userid">Client ID: {{ userid }}</li>
          <li class="list-group-item" v-bind="date">Date: {{ date }}</li>
          <li class="list-group-item" v-bind="time">Time: {{ time }}</li>
        </ul>
<!--<div class="card border-danger mb-3" style="width: 17rem;">
  <div class="card-header text-danger">
    Cancel Appointment </div>
  <ul class="list-group list-group-flush text-info">
    <input id="inputDate" v-model="cancelDate" placeholder="Date of appointment YYYY-MM-DD"/>
    <input id="inputTime" v-model="cancelTime" placeholder="Time of appointment 00:00"/>
    <b class="btn btn-danger" @click="cancelAppointments" style= "width: 17rem;">Cancel</b>
  </ul>
</div>
-->
    </div>
  </div>
</div>
</template>

<script>

import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      mqtt_client: null,
      value: '',
      receive: '',
      userid: '',
      date: '',
      time: '',
      news: 'none',
      subscription: {
        topic: 'dentistimo/dentist-appointment/all-appointments-day',
        qos: 0
      }
    }
  },
  mounted() {
    this.mqtt_client = mymqtt.createClient()
    const msgCallback = (topic, message) => {
      const obj = JSON.parse(message.toString())
      // console.log(obj)
      // console.log(obj[0].dentistid)
      this.userid = obj[0].userid
      this.date = obj[0].date
      this.time = obj[0].time
      console.log({ topic: topic, message: message.toString() })
    }
    this.mqtt_client.on('message', msgCallback)
    this.mqtt_client.on('subscribe', (topic) => {
      console.log('Subscribed too: ', topic)
    })
    this.mqtt_client.subscribe('dentistimo/dentist-appointment/all-appointments-day', { qos: 0 }, (error, res) => {
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
      const payload = JSON.stringify({
        dentistid: 2,
        date: this.value
      })
      const topic = 'dentistimo/dentist-appointment/get-all-appointments-day'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    },
    cancelAppointments() {

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
.background {
  display: flex;
  height: 100%;
  /* justify-content: center;
  align-items: center;
  flex-direction: column; */
  background-color:#80BAB2
}
.div1 {
  float:right;
}
.div2 {
  float:left;
}
textarea {
  background-color:#80BAB2;
}

</style>
