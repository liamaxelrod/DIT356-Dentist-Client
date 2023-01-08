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
              <li class="list-group-item" v-bind="visitReason">Reason: {{ visitReason.slice(0,-2) }}</li>
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
      <div class="card-group" style="width: 25rem;">
        <div id="card1" class="card">
          <div class="card-body">
            <h5 class="card-title">Working hours</h5>
            <ul class="list-group list-group-flush text-info">
              <li class="list-group-item" >Monday: {{ this.workTime.monday }}</li>
              <li class="list-group-item" >Tuesday: {{ this.workTime.tuesday }}</li>
              <li class="list-group-item" >Wednesday: {{ this.workTime.wednesday }}</li>
              <li class="list-group-item" >Thursday: {{ this.workTime.thursday }}</li>
              <li class="list-group-item" >Friday: {{ this.workTime.friday }}</li>
              <li class="list-group-item" >Saturday: {{ this.workTime.saturday }}</li>
              <li class="list-group-item" >Sunday: {{ this.workTime.sunday }}</li>
            </ul>
            <ul class="list-group list-group-flush text-dark">
              <li class="list-group-item" >{{ this.DisplayedLunchBreak }}</li>
              <li class="list-group-item" >{{ this.DisplayedFikaBreak }}</li>
            </ul>
            <h>Fika break is 30 minutes</h>
            <p>Lunch break is 1 hour</p>
            <h5 class="card-title">Create / Delete break</h5>
            <p>{{ this.successfulBreak }}</p>
            <input type="date" v-model='breakData'>
            <input type="time" v-model='breakTime'>
            <p>Selected Date: {{ this.breakData }}</p>
            <p>Selected Time: {{ this.breakTime }}</p>
            <button class="btn btn-primary" id="buttonFikaBreak" @click="makeFikaBreak">Add fika break</button>
            <button class="btn btn-danger" id="buttonFikaBreak" @click="deleteFikaBreak">Delete fika break</button>
            <p></p>
            <button class="btn btn-primary" id="buttonLunchBreak" @click="makeLunchBreak">Add lunch break</button>
            <button class="btn btn-danger" id="buttonLunchBreak" @click="deleteLunchBreak">Delete lunch break</button>
          </div>
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
      topicSubscribeDelete: 'dentistimo/booking/deleted-break',
      topicFika: 'dentistimo/dentist/fika-booked',
      topicLunch: 'dentistimo/dentist/lunch-booked',
      topicError: 'dentistimo/error',
      noAppointments: '',
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
      visitReason: '',
      cancelIssuance: '',
      lunchMessage: 0,
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
      console.log('get schedule')
      this.getSchedule()
    }
    const msgCallback = (topic, message) => {
      // console.log('topic received' + topic.toString())
      console.log('message received' + message.toString())
      this.noAppointments = ''
      this.successfulBreak = ''
      if (message.includes('coordinate')) {
        console.log('contains office message')
        this.loadSchedule(message)
      }
      if (message.includes('Successful break registered')) {
        // location.reload()
        this.successfulBreak = 'break made'
      }
      if (message.includes('break has succesfully been removed')) {
        // location.reload()
        this.successfulBreak = 'break deleted'
      }
      if (message.includes('You cannot book a break on a weekend')) {
        // location.reload()
        this.successfulBreak = 'You cannot book a break on a weekend'
      }
      if (topic.includes('dentistimo/dentist-appointment/all-appointments-day')) {
        const obj = JSON.parse(message.toString())
        this.userid = ''
        this.date = ''
        this.time = ''
        this.issuance = ''
        this.visitReason = ''
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
            this.visitReason += (element.visitReason) + ', '
            this.issuance += (element.issuance) + ', '
          } else if (element.appointmentType === 'lunch') {
            console.log('lunch')
            this.lunchMessage = this.lunchMessage + 1
            if (this.lunchMessage === 1) {
              this.lunchDate = (element.date)
              this.lunchTime = (element.time)
              this.DisplayedLunchBreak = 'Lunch break: ' + this.lunchDate + ' ' + this.lunchTime
              this.lunchMessage = 0
            }
          } else if (element.appointmentType === 'fika') {
            console.log('fika')
            this.fikaDate = (element.date)
            this.fikaTime = (element.time)
            this.DisplayedFikaBreak += 'Fika break: ' + this.fikaDate + ' ' + this.fikaTime + ' \n '
          }
        }
      }
      // console.log({ topic: topic, message: message.toString() })
    }
    this.mqtt_client.on('message', msgCallback)
    this.mqtt_client.on('subscribe', (topic) => {
      console.log('Subscribed too: ', topic)
    })
    this.mqtt_client.subscribe('dentistimo/dentist-appointment/all-appointments-day/' + JSON.parse(localStorage.getItem('accountInfo')).idToken, { qos: 2 }, (error, res) => {
      if (error) {
        console.log('error = ', error)
      } else {
        console.log('res = ', res)
      }
    })
    this.mqtt_client.subscribe('dentistimo/error' + '/' + JSON.parse(localStorage.getItem('accountInfo')).idToken, { qos: 2 }, (error, res) => {
      if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
    })
  },
  methods: {
    appointments() {
      const dentistID = JSON.parse(localStorage.getItem('accountInfo')).dentistId
      const payload = JSON.stringify({
        idToken: JSON.parse(localStorage.getItem('accountInfo')).idToken,
        dentistid: dentistID,
        date: this.value
      })
      this.noAppointments = 'No bookings this date'
      this.userid = ''
      this.date = ''
      this.time = ''
      this.issuance = ''
      this.DisplayedFikaBreak = 'No break'
      this.DisplayedLunchBreak = 'No break'
      const topic = 'dentistimo/dentist-appointment/get-all-appointments-day'
      this.mqtt_client.subscribe(topic + '/' + JSON.parse(localStorage.getItem('accountInfo')).idToken, { qos: 2 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      this.mqtt_client.publish(topic, payload, 2)
    },
    cancelAppointments() {
      // Display when an appointment is cancelled or not.
      const payload = JSON.stringify({
        idToken: JSON.parse(localStorage.getItem('accountInfo')).idToken,
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
        const officeId = JSON.parse(localStorage.getItem('accountInfo')).officeId
        const payload = JSON.stringify({
          idToken: JSON.parse(localStorage.getItem('accountInfo')).idToken,
          dentistOfficeId: officeId,
          dentistid: dentistID,
          date: this.breakData,
          time: this.breakTime,
          appointmentType: 'fika'
        })
        this.publishReceive(payload, this.topicBreaks, this.topicFika)
      }
    },
    makeLunchBreak() {
      if (this.checkInputTime()) {
        // this.successfulBreak = 'please insert date and time'
        const dentistID = JSON.parse(localStorage.getItem('accountInfo')).dentistId
        const officeId = JSON.parse(localStorage.getItem('accountInfo')).officeId
        const payload = JSON.stringify({
          idToken: JSON.parse(localStorage.getItem('accountInfo')).idToken,
          dentistOfficeId: officeId,
          dentistid: dentistID,
          date: this.breakData,
          time: this.breakTime,
          appointmentType: 'lunch'
        })
        this.publishReceive(payload, this.topicBreaks, this.topicLunch)
      }
    },
    deleteFikaBreak() {
      if (this.checkInputTime()) {
        this.DisplayedFikaBreak = ''
        // this.successfulBreak = 'please insert date and time'
        const dentistID = JSON.parse(localStorage.getItem('accountInfo')).dentistId
        const payload = JSON.stringify({
          idToken: JSON.parse(localStorage.getItem('accountInfo')).idToken,
          dentistid: dentistID,
          date: this.breakData,
          time: this.breakTime
        })
        this.publishReceive(payload, this.topicDelete, this.topicSubscribeDelete)
      }
    },
    deleteLunchBreak() {
      if (this.checkInputTime()) {
        this.DisplayedLunchBreak = ''
        // this.successfulBreak = 'please insert date and time'
        const dentistID = JSON.parse(localStorage.getItem('accountInfo')).dentistId
        const payload = JSON.stringify({
          idToken: JSON.parse(localStorage.getItem('accountInfo')).idToken,
          dentistid: dentistID,
          date: this.breakData,
          time: this.breakTime
        })
        this.publishReceive(payload, this.topicDelete, this.topicSubscribeDelete)
      }
    },
    publishReceive(payload, publishTopic, subscribeTopic) {
      this.mqtt_client.subscribe(subscribeTopic + '/' + JSON.parse(localStorage.getItem('accountInfo')).idToken, { qos: 2 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = publishTopic
      const qos = 2
      this.mqtt_client.publish(topic, payload, qos)
    },
    getSchedule() {
      const officeId = JSON.parse(localStorage.getItem('accountInfo')).officeId
      const payload = JSON.stringify({
        idToken: JSON.parse(localStorage.getItem('accountInfo')).idToken,
        dentistOfficeId: officeId
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
      this.workTime.saturday = 'No working hours'
      this.workTime.sunday = 'No working hours'
    },
    checkInputTime() {
      const time = this.breakTime
      const timeArray = time.split(':')
      const minute = timeArray[1]
      if (minute === '00' || minute === '30') {
        return true
      } else {
        this.successfulBreak = 'Only every whole or half hour'
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
  min-width: 1100px;
  min-height: 900px;
}
.div2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  /* border: 10px
  solid rgb(221, 255, 0); */
}

#card1 {
  height: 100%;
  width: 100%;
}

#card2 {
  height: 100%;
  width: 100%;
}

#buttonFikaBreak, #buttonLunchBreak {
  width: 160px;
  margin: 3px;
}

</style>
