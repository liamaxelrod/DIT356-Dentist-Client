<template class="test">
  <div class="background">
    <div class="div1">
      <b-row>
    <b-col md="auto">
      <!-- ADD INFORMATION IF THERE IS NO APPOINTMENT THAT DAY -->
      <b-calendar v-model="value" locale="en-EU"></b-calendar>
    </b-col>
    </b-row>
  <div>
<div class="card border-info mb-3" style="width: 17rem;">
      <div class="card-header text-info">
        Appointment information
      </div>
        <ul class="list-group list-group-flush text-info">
          <li class="list-group-item" v-bind="userid">Client ID: {{ userid }}</li>
          <li class="list-group-item" v-bind="date">Date: {{ date }}</li>
          <li class="list-group-item" v-bind="time">Time: {{ time }}</li>
          <li class="list-group-item" v-bind="issuance">Issuance ID: {{ issuance }}</li>
        </ul>
<b class="btn btn-dark" @click="appointments" style= "width: 17rem;">Get appointments</b>
</div>
  <div class="card border-danger mb-3" style="width: 17rem;">
    <div class="card-header text-danger">
    Cancel Appointment
    </div>
    <ul class="list-group list-group-flush text-info">
    <input id="inputIssuance" v-model="cancelIssuance" placeholder="Issuance ID"/>
    <b class="btn btn-danger" @click="cancelAppointments" style= "width: 17rem;">Cancel</b>
    </ul>
  </div>
</div>
  </div>
    <div class="div2">
      <p class="text-center" id="h1"> working hours </p>
      <p> Monday: {{ this.workTime.monday }} </p>
      <p> Tuesday: {{ this.workTime.tuesday }}</p>
      <p> Wednesday: {{ this.workTime.wednesday }}</p>
      <p> Thursday: {{ this.workTime.thursday }}</p>
      <p> Friday: {{ this.workTime.friday }}</p>
      <p> Saturday: {{ this.workTime.saturday }}</p>
      <p> Sunday: {{ this.workTime.sunday }}</p>
      <select id="selectFika" v-model='displayTime'>
        <option selected>select time for fika break</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <h> selected time: { {{ this.displayTime }} } </h>
      <p></p>
      <button class="btn btn-primary" id="buttonChangeBreak" @click="changeBreak">change fika break</button>
    </div>
  </div>
</template>

<script>
import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      selectFika: '',
      displayTime: '',
      mqtt_client: null,
      value: '',
      receive: '',
      userid: '',
      date: '',
      time: '',
      issuanceID: '',
      cancelIssuance: '',
      news: 'none',
      subscription: {
        topic: 'dentistimo/dentist-appointment/all-appointments-day',
        qos: 0
      },
      workTime: {
        monday: 'monday',
        tuesday: 'tuesday',
        wednesday: 'wednesday',
        thursday: 'thursday',
        friday: 'friday',
        saturday: 'saturday',
        sunday: 'sunday'
      }
    }
  },
  mounted() {
    this.mqtt_client = mymqtt.createClient()
    const msgCallback = (topic, message) => {
      const obj = JSON.parse(message.toString())
      this.userid = obj[0].userid
      this.date = obj[0].date
      this.time = obj[0].time
      this.issuance = obj[0].issuance
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
    getValue() {
      this.displayTime = document.getElementById('selectFika').value
    },
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
      const payload = JSON.stringify({
        issuance: this.cancelIssuance
      })
      console.log(payload)
      // const topic = 'dentistimo/booking/delete-booking'
      // const qos = 0
      // this.mqtt_client.publish(topic, payload, qos)
    },
    changeBreak() {
      console.log('do something')
      // const payload = '{ "dentistid": 687181763' + ', "break": ' + '"' + this.displayTime + '"' + ' }'
      // const topic = 'dentistimo/dentist-appointment/change-break'
      // const qos = 0
      // this.mqtt_client.publish(topic, payload, qos)
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
  /* height: 100%;
  justify-content: center;
  align-items: center; */
  flex-direction: row;
}

.div1 {
  /* background:white; */
  height: 100%;
  width: 50%;
  padding: 20px;
  /* border: 10px
  solid rgb(0, 255, 106); */
}

.div2 {
  /* background: white; */
  height: 100%;
  width: 50%;
  padding: 20px;
  /* border: 10px
  solid rgb(221, 255, 0); */
}
#h1 {
  float: center;
  font-size: 20px;
  font-weight: bold;
  text-align: right;
  /* color: rgb(0, 255, 106); */
}
textarea {
  background-color:#80BAB2;
}

</style>
