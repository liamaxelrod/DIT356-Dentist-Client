<template class="test">
  <div class="background">
    <div class="div1">
      <b-row>
      <b-col md="auto">
        <b-calendar v-model="value" locale="en-EU"></b-calendar>
      </b-col>
      </b-row>
      <div>
        <div class="card border-info mb-3" style="width: 17rem;">
          <div class="card-header text-info">
            Appointment information
          </div>
            <ul class="list-group list-group-flush text-info">
              <li class="list-group-item" v-bind="userid">Client ID: {{ userid.slice(0,-2) }}</li>
              <li class="list-group-item" v-bind="date">Date: {{ date.slice(0,-2) }}</li>
              <li class="list-group-item" v-bind="time">Time: {{ time.slice(0,-2) }}</li>
              <li class="list-group-item" v-bind="issuance">Issuance ID: {{ issuance.slice(0,-2) }}</li>
            </ul>
            <b class="btn btn-dark" @click="appointments" style= "width: 17rem;">Get appointments</b>
            <h4>{{ this.noAppointments }}</h4>
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
        <div class="card-group" style="width: 45rem;">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Working hours</h5>
                <ul class="list-group list-group-flush text-info">
                  <li class="list-group-item" >Monday: {{ this.workTime.monday }}</li>
                  <li class="list-group-item" >Tuesday: {{ this.workTime.tuesday }}</li>
                  <li class="list-group-item" >Wednesday: {{ this.workTime.wednesday }}</li>
                  <li class="list-group-item" >Thursday:{{ this.workTime.thursday }}</li>
                  <li class="list-group-item" >Friday: {{ this.workTime.friday }}</li>
                  <li class="list-group-item" >Saturday: {{ this.workTime.saturday }}</li>
                  <li class="list-group-item" >Sunday: {{ this.workTime.sunday }}</li>
                </ul>
                <ul class="list-group list-group-flush text-dark">
                  <li class="list-group-item" >{{ this.DisplayedLunchBreak }}</li>
                  <li class="list-group-item" >{{ this.DisplayedFikaBreak }}</li>
               </ul>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Create / Delete break</h5>
              <p>{{ this.successfulBreak }}</p>
              <input type="date" v-model='breakData'>
              <input type="time" v-model='breakTime'>
              <p>selected Data: {{ this.breakData }}</p>
              <p>selected time: {{ this.breakTime }}</p>
              <button class="btn btn-primary" id="buttonFikaBreak" @click="makeFikaBreak">make fika break</button>
              <button class="btn btn-danger" id="buttonFikaBreak" @click="deleteFikaBreak">delete fika break</button>
              <p></p>
              <button class="btn btn-primary" id="buttonLunchBreak" @click="makeLunchBreak">make lunch break</button>
              <button class="btn btn-danger" id="buttonLunchBreak" @click="deleteLunchBreak">delete lunch break</button>
            </div>
          </div>
          <!--
        <p class="text-center" id="h1"> working hours </p>
        <p> Monday: {{ this.workTime.monday }} </p>
        <p> Tuesday: {{ this.workTime.tuesday }}</p>
        <p> Wednesday: {{ this.workTime.wednesday }}</p>
        <p> Thursday: {{ this.workTime.thursday }}</p>
        <p> Friday: {{ this.workTime.friday }}</p>
        <p> Saturday: {{ this.workTime.saturday }}</p>
        <p> Sunday: {{ this.workTime.sunday }}</p>
        <p></p>
        <p id="breakDisplayed">{{ this.DisplayedFikaBreak }}</p>
        <p id="breakDisplayed">{{ this.DisplayedLunchBreak }}</p>
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
         -->
      </div>
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
      issuance: '',
      cancelIssuance: '',
      news: 'none',
      subscription: {
        topic: 'dentistimo/dentist-appointment/all-appointments-day',
        qos: 2
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
    if (this.workTime.monday === '') {
      this.getSchedule()
    }
    const msgCallback = (topic, message) => {
      // console.log('message received' + message.toString())
      this.noAppointments = ''
      this.successfulBreak = ''
      if (message.includes('coordinate')) {
        console.log('contains office message')
        this.loadSchedule(message)
      }
      const obj = JSON.parse(message.toString())
      this.userid = ''
      this.date = ''
      this.time = ''
      this.issuance = ''
      this.lunchDate = ''
      this.lunchTime = ''
      this.fikaDate = ''
      this.fikaTime = ''
      this.DisplayedFikaBreak = ''
      this.DisplayedLunchBreak = ''
      for (let i = 0; i < obj.length; i++) {
        const element = obj[i]
        if (element.appointmentType === 'appointment') {
          console.log('appointment')
          this.userid += (element.userid) + ', '
          this.date += (element.date) + ', '
          this.time += (element.time) + ', '
          this.issuance += (element.issuance) + ', '
        } else if (element.appointmentType === 'lunch') {
          console.log('lunch')
          this.lunchDate = (element.date)
          this.lunchTime = (element.time)
          this.DisplayedLunchBreak += 'Lunch break: ' + this.lunchDate + ' ' + this.lunchTime + ' \n '
        } else if (element.appointmentType === 'fika') {
          console.log('fika')
          this.fikaDate = (element.date)
          this.fikaTime = (element.time)
          this.DisplayedFikaBreak += 'Fika break: ' + this.fikaDate + ' ' + this.fikaTime + ' \n '
        }
      }
      // console.log({ topic: topic, message: message.toString() })
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
  methods: {
    appointments() {
      const dentistID = JSON.parse(localStorage.getItem('accountInfo')).dentistId
      const payload = JSON.stringify({
        dentistid: dentistID,
        date: this.value
      })
      this.noAppointments = 'No bookings this date'
      this.userid = ''
      this.date = ''
      this.time = ''
      this.issuance = ''
      const topic = 'dentistimo/dentist-appointment/get-all-appointments-day'
      this.mqtt_client.publish(topic, payload, 2)
    },
    cancelAppointments() {
      // Display when an appointment is cancelled or not.
      const payload = JSON.stringify({
        issuance: this.cancelIssuance
      })
      const topic = 'dentistimo/booking/delete-booking'
      this.mqtt_client.publish(topic, payload, 2)
      this.cancelIssuance = ''
      location.reload()
    },
    makeFikaBreak() {
      if (this.checkInputTime()) {
        // this.successfulBreak = 'please insert date and time'
        const dentistID = JSON.parse(localStorage.getItem('accountInfo')).dentistId
        const payload = JSON.stringify({
          dentistid: dentistID,
          date: this.breakData,
          time: this.breakTime,
          appointmentType: 'fika'
        })
        this.publishReceive(payload, this.topicBreaks, this.topicBreaks)
      }
    },
    makeLunchBreak() {
      if (this.checkInputTime()) {
        // this.successfulBreak = 'please insert date and time'
        const dentistID = JSON.parse(localStorage.getItem('accountInfo')).dentistId
        const payload = JSON.stringify({
          dentistid: dentistID,
          date: this.breakData,
          time: this.breakTime,
          appointmentType: 'lunch'
        })
        this.publishReceive(payload, this.topicBreaks, this.topicBreaks)
      }
    },
    deleteFikaBreak() {
      if (this.checkInputTime()) {
        // this.successfulBreak = 'please insert date and time'
        const dentistID = JSON.parse(localStorage.getItem('accountInfo')).dentistId
        const payload = JSON.stringify({
          dentistid: dentistID,
          date: this.breakData,
          time: this.breakTime
        })
        this.publishReceive(payload, this.topicDelete, this.topicDelete)
      }
    },
    deleteLunchBreak() {
      if (this.checkInputTime()) {
        // this.successfulBreak = 'please insert date and time'
        const dentistID = JSON.parse(localStorage.getItem('accountInfo')).dentistId
        const payload = JSON.stringify({
          dentistid: dentistID,
          date: this.breakData,
          time: this.breakTime
        })
        this.publishReceive(payload, this.topicDelete, this.topicDelete)
      }
    },
    publishReceive(payload, publishTopic, subscribeTopic) {
      this.mqtt_client.subscribe(subscribeTopic, { qos: 2 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = publishTopic
      const qos = 2
      this.mqtt_client.publish(topic, payload, qos)
    },
    getSchedule() {
      const officeId = JSON.parse(localStorage.getItem('accountInfo')).officeId
      const payload = JSON.stringify({
        id: officeId
      })
      this.publishReceive(payload, 'dentistimo/dentist-office/fetch-one', 'dentistimo/dentist-office/one-office')
    },
    loadSchedule(message) {
      const dentistOffice = JSON.parse(message).openinghours
      this.workTime.monday = dentistOffice.monday
      this.workTime.tuesday = dentistOffice.tuesday
      this.workTime.wednesday = dentistOffice.wednesday
      this.workTime.thursday = dentistOffice.thursday
      this.workTime.friday = dentistOffice.friday
      this.workTime.saturday = 'no working hours'
      this.workTime.sunday = 'no working hours'
    },
    checkInputTime() {
      const time = this.breakTime
      const timeArray = time.split(':')
      const minute = timeArray[1]
      if (minute === '00' || minute === '30') {
        return true
      } else {
        this.successfulBreak = 'every hour or half hour'
        return false
      }
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
  /*
 border: 10px
  solid rgb(0, 255, 106); */
}

.div2 {
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 10px
  /*
  solid rgb(221, 255, 0);
  */
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

#buttonFikaBreak, #buttonLunchBreak {
  /*
  width: 160px;
  margin: 3px;
  /* color: rgb(0, 255, 106); */
}
.h4{
  font-family: "Segoe UI", Tahoma, Verdana, sans-serif;
}

</style>

<!--
  mounted() {
    this.mqtt_client = mymqtt.createClient()
    this.thisDentistid = JSON.parse(localStorage.getItem('accountInfo')).dentistId
    this.getSchedule()
    const msgCallback = (topic, message) => {
      this.noAppointments = ''
      const obj = JSON.parse(message.toString())
      this.userid = ''
      this.date = ''
      this.time = ''
      this.issuance = ''
      for (let i = 0; i < obj.length; i++) {
        const element = obj[i]
        console.log(element)
      }
      obj.forEach(bookingInformation => {
        if (bookingInformation.appointmentType === 'appointment') {
          console.log('appointment')
          this.userid += (bookingInformation.userid) + ', '
          this.date += (bookingInformation.date) + ', '
          this.time += (bookingInformation.time) + ', '
          this.issuance += (bookingInformation.issuance) + ', '
        } else if (bookingInformation.appointmentType === 'lunch') {
          console.log('lunch')
          console.log(bookingInformation)
          this.lunchDate = (bookingInformation.date)
          this.lunchTime = (bookingInformation.time)
          this.DisplayedLunchBreak = 'Lunch break: ' + this.lunchDate + ' ' + this.lunchTime
        } else if (bookingInformation.appointmentType === 'fika') {
          console.log('fika')
        }
      })
      if (message.includes('coordinate')) {
        console.log('contains office message')
        this.loadSchedule(message)
      }
      // console.log({ topic: topic, message: message.toString() })
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
 -->
