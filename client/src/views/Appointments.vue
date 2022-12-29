<template class="test">
  <div class="background">
    <div class="div1">
      <b-row>
        <b-col md="auto">
          <!-- ADD INFORMATION IF THERE IS NO APPOINTMENT THAT DAY -->
          <b-calendar v-model="value" locale="en-EU"></b-calendar>
        </b-col>
        <b-col>
          <p>Value: <b>'{{ value }}'</b></p>
        </b-col>
      </b-row>
      <p onchange="myFunction" >| {{this.receive}} |</p>
      <b class="btn btn-dark" @click="appointments" style= "width: 17rem;">Get appointments</b>
      <div class="card border-info mb-3" style="width: 17rem;">
        <div class="card-header text-info">
          Appointment information
        </div>
        <ul class="list-group list-group-flush text-info">
          <li class="list-group-item">Client ID</li>
          <li class="list-group-item">Date</li>
          <li class="list-group-item">Time</li>
        </ul>
      </div>
      <!-- <div class="card border-danger mb-3" style="width: 17rem;">
        <div class="card-header text-danger">
          Cancel Appointment
        </div>
        <ul class="list-group list-group-flush text-info">
          <input id="inputDate" v-model="cancelDate" placeholder="Date of appointment YYYY-MM-DD"/>
          <input id="inputTime" v-model="cancelTime" placeholder="Time of appointment 00:00"/>
        </ul>
      </div> -->
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
      <p>{{ this.unsuccessfulBreakChange }}</p>
      <input type="date" v-model='displayData'>
      <p>selected date: { {{ this.displayData }} }</p>
      <div class="timeBreak">
        <input type="time" v-model='displayTime'>
        <p>selected time: { {{ this.displayTime }} }</p>
        <button class="btn btn-primary" id="buttonFikaBreak" @click="changeFikaBreak">change fika break</button>
        <p></p>
        <input type="time" v-model='displayTime'>
        <p>selected time: { {{ this.displayTime }} }</p>
        <button class="btn btn-primary" id="buttonLunchBreak" @click="changeLunchBreak">change lunch break</button>
      </div>
    </div>
  </div>
</template>

<script>
import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      unsuccessfulBreakChange: '',
      displayData: '',
      selectFika: '',
      displayTime: '',
      mqtt_client: null,
      value: '',
      receive: '',
      context: '',
      news: 'none',
      subscription: {
        topic: 'dentistimo/dentist-appointment/all-appointments-day',
        qos: 0
      },
      workTime: {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: ''
      }
    }
  },
  mounted() {
    this.mqtt_client = mymqtt.createClient()
    const msgCallback = (topic, message) => {
      this.receive = message.toString()
      this.context = message.toString()
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
    changeFikaBreak() {
      const payload = JSON.stringify({
        dentistid: 'need dentistid',
        breakType: 'Fika',
        date: 'null',
        time: this.displayTime
      })
      const topic = 'dentistimo/dentist/breaks'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    },
    changeLunchBreak() {
      const payload = JSON.stringify({
        dentistid: 'need dentistid',
        breakType: 'lunch',
        date: 'null',
        time: this.displayTime
      })
      const topic = 'dentistimo/dentist/breaks'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    }
  }
}
</script>

<style scoped>
/*
Change so it covers 100% not PX
*/
@media (max-width: 800px) {}
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 100%;
  width: 100%;
}
.div1 {
border: 10px
solid rgb(0, 255, 106);
}
.div2 {
border: 10px
solid rgb(221, 255, 0);
}
#h1 {
  /* float: center; */
  font-size: 20px;
  font-weight: bold;
  text-align: right;
  /* color: rgb(0, 255, 106); */
}

</style>
