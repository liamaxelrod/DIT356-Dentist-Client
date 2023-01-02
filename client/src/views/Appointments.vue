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
          <div class="card border-danger mb-3" style="width: 17rem;">
            <div class="card-header text-danger">
              Cancel Appointment
            </div>
            <ul class="list-group list-group-flush text-info">
              <li class="list-group-item" v-bind="userid">Client ID: {{ userid }}</li>
              <li class="list-group-item" v-bind="date">Date: {{ date }}</li>
              <li class="list-group-item" v-bind="time">Time: {{ time }}</li>
              <li class="list-group-item" v-bind="issuance">Issuance ID: {{ issuance }}</li>
            </ul>
          </div>
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
      <div class="div2-1">
        <p class="text-center" id="h1"> working hours </p>
        <p> Monday: {{ this.workTime.monday }} </p>
        <p> Tuesday: {{ this.workTime.tuesday }}</p>
        <p> Wednesday: {{ this.workTime.wednesday }}</p>
        <p> Thursday: {{ this.workTime.thursday }}</p>
        <p> Friday: {{ this.workTime.friday }}</p>
        <p> Saturday: {{ this.workTime.saturday }}</p>
        <p> Sunday: {{ this.workTime.sunday }}</p>
        <p></p>
        <p id="breakDisplayed">|{{ this.DisplayedFikaBreak }}|</p>
        <p id="breakDisplayed">|{{ this.DisplayedLunchBreak }}|</p>
      </div>
      <div class="div2-2">
        <p>{{ this.successfulBreak }}</p>
        <input type="date" v-model='breakData'>
        <p>selected Data: {{ this.breakData }}</p>
        <input type="time" v-model='breakTime'>
        <p>selected time: {{ this.breakTime }}</p>
        <button class="btn btn-primary" id="buttonFikaBreak" @click="makeFikaBreak">make fika break</button>
        <button class="btn btn-danger" id="buttonFikaBreak" @click="deleteFikaBreak">delete fika break</button>
        <p></p>
        <button class="btn btn-primary" id="buttonLunchBreak" @click="makeLunchBreak">make lunch break</button>
        <button class="btn btn-danger" id="buttonLunchBreak" @click="deleteLunchBreak">delete lunch break</button>
      </div>
    </div>
  </div>
</template>

<script>
import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      topicSchedule: 'dentistimo/dentist-office/fetch-one',
      topicBreaks: 'dentistimo/dentist/breaks',
      topicDelete: 'dentistimo/booking/delete-break',
      successfulBreak: '',
      DisplayedFikaBreak: '',
      DisplayedLunchBreak: '',
      breakData: '',
      breakTime: '',
      mqtt_client: null,
      receive: '',
      value: '',
      userid: '',
      date: '',
      time: '',
      issuance: '', // this was instanceID but when I moved the idea I got rid of the errors
      cancelIssuance: '',
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
      console.log(message)
      const obj = JSON.parse(message.toString())
      this.userid = obj[0].userid
      this.date = obj[0].date
      this.time = obj[0].time
      this.issuance = obj[0].issuance
      // this.DisplayedFikaBreak = this.receive
      // this.DisplayedLunchBreak = this.receive
      console.log({ topic: topic, message: message.toString() })
    }
    this.mqtt_client.on('message', msgCallback)
    this.mqtt_client.on('subscribe', (topic) => {
      console.log('Subscribed too: ', topic)
    })
    this.mqtt_client.subscribe('dentistimo/dentist-appointment/all-appointments-day', { qos: 2 }, (error, res) => {
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
      const thisDentistid = JSON.parse(localStorage.getItem('accountInfo')).dentistid
      const payload = JSON.stringify({
        dentistid: thisDentistid,
        date: this.value
      })
      const topic = 'dentistimo/dentist-appointment/get-all-appointments-day'
      const qos = 2
      this.mqtt_client.publish(topic, payload, qos)
    },
    cancelAppointments() {
      const payload = JSON.stringify({
        issuance: this.cancelIssuance
      })
      console.log(payload)
      // const topic = 'dentistimo/booking/delete-booking'
      // const qos = 2
      // this.mqtt_client.publish(topic, payload, qos)
    },
    makeFikaBreak() {
      const thisDentistid = JSON.parse(localStorage.getItem('accountInfo')).dentistid
      console.log(thisDentistid + ' this is the dentistid')
      const payload = JSON.stringify({
        dentistid: thisDentistid,
        date: this.breakData,
        time: this.breakTime,
        appointmentType: 'fika'
      })
      this.publishMessageSameTopic(payload, this.topicBreaks, this.topicBreaks)
    },
    makeLunchBreak() {
      const thisDentistid = JSON.parse(localStorage.getItem('accountInfo')).dentistid
      const payload = JSON.stringify({
        dentistid: thisDentistid,
        date: this.breakData,
        time: this.breakTime,
        appointmentType: 'lunch'
      })
      this.publishMessageSameTopic(payload, this.topicBreaks, this.topicBreaks)
    },
    deleteFikaBreak() {
      const thisDentistid = JSON.parse(localStorage.getItem('accountInfo')).dentistid
      const payload = JSON.stringify({
        dentistid: thisDentistid,
        date: this.breakData,
        time: this.breakTime
      })
      this.publishMessageSameTopic(payload, this.topicDelete, this.topicDelete)
    },
    deleteLunchBreak() {
      const thisDentistid = JSON.parse(localStorage.getItem('accountInfo')).dentistid
      const payload = JSON.stringify({
        dentistid: thisDentistid,
        date: this.breakData,
        time: this.breakTime
      })
      this.publishMessageSameTopic(payload, this.topicDelete, this.topicDelete)
      // this.publishMessageSameTopic(payload, this.topicDelete, this.topicDelete)
    },
    publishMessage(payload, publishTopic, subscribeTopic) {
      console.log('payload = ', payload)
      this.mqtt_client.subscribe(subscribeTopic + JSON.parse(localStorage.getItem('accountInfo')).token, { qos: 2 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = publishTopic
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    },
    publishMessageSameTopic(payload, publishTopic, subscribeTopic) {
      console.log('payload = ', payload)
      this.mqtt_client.subscribe(subscribeTopic, { qos: 2 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = publishTopic
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    },
    receiveSchedule() {
      const officeId = JSON.parse(localStorage.getItem('accountInfo')).officeId
      const payload = JSON.stringify({
        id: officeId
      })
      this.publishMessageSameTopic(payload, this.topicSchedule, 'dentistimo/dentist-office/one-office')
    }
  }
}
</script>

<style scoped>
  .background {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 100%;
  width: 100%;
  min-width: 700px;
  min-height: 900px;
}
.div1 {
  /* border: 10px
  solid rgb(0, 255, 106); */
}
.div2 {
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* border: 10px
  solid rgb(221, 255, 0); */
}

.div2-1 {
  height: 100%;
  width: 100%;
}
.div2-2 {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* border: 10px
  solid rgb(221, 255, 0); */
}
#h1 {
  /* float: center; */
  font-size: 20px;
  font-weight: bold;
  text-align: right;
  /* color: rgb(0, 255, 106); */
}
#buttonFikaBreak, #buttonLunchBreak {
  width: 160px;
  margin: 3px;
  /* color: rgb(0, 255, 106); */
}

</style>
