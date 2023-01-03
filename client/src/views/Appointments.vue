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
              <li class="list-group-item">Client ID: {{ userid.slice(0,-2) }}</li>
              <li class="list-group-item">Date: {{ date.slice(0,-2) }}</li>
              <li class="list-group-item">Time: {{ time.slice(0,-2) }}</li>
              <li class="list-group-item">Issuance ID: {{ issuance.slice(0,-2) }}</li>
            </ul>
            <b class="btn btn-dark" @click="appointments" style= "width: 17rem;">Get appointments</b>
            <p>{{ this.noAppointments }}</p>
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
      thisDentistId: '',
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
      lunchDate: '',
      lunchTime: '',
      fikaDate: '',
      fikaTime: '',
      issuance: '',
      noAppointments: '',
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
    this.thisDentistid = JSON.parse(localStorage.getItem('accountInfo')).dentistId
    this.getSchedule()
    const msgCallback = (topic, message) => {
      if (message.includes('coordinate')) {
        console.log('contains office message')
        this.loadSchedule(message)
      } else {
        console.log('does not contain office')
        this.noAppointments = ''
        const obj = JSON.parse(message.toString())
        this.userid = ''
        this.date = ''
        this.time = ''
        this.issuance = ''
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
            this.lunchDate += (bookingInformation.date)
            this.lunchTime += (bookingInformation.time)
            this.DisplayedLunchBreak = 'Lunch break: ' + this.lunchDate + ' ' + this.lunchTime
          } else if (bookingInformation.appointmentType === 'fika') {
            console.log('fika')
          }
        })
        // console.log({ topic: topic, message: message.toString() })
      }
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
      const thisDentistid = JSON.parse(localStorage.getItem('accountInfo')).dentistId
      const payload = JSON.stringify({
        dentistid: thisDentistid,
        date: this.value
      })
      this.noAppointments = 'no appointments'
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
      const payload = JSON.stringify({
        dentistid: this.thisDentistId,
        date: this.breakData,
        time: this.breakTime,
        appointmentType: 'fika'
      })
      this.publishMessageNoCheck(payload, this.topicBreaks, this.topicBreaks)
    },
    makeLunchBreak() {
      const payload = JSON.stringify({
        dentistid: this.thisDentistId,
        date: this.breakData,
        time: this.breakTime,
        appointmentType: 'lunch'
      })
      this.publishMessageNoCheck(payload, this.topicBreaks, this.topicBreaks)
    },
    deleteFikaBreak() {
      const payload = JSON.stringify({
        dentistid: this.thisDentistId,
        date: this.breakData,
        time: this.breakTime
      })
      this.publishMessageNoCheck(payload, this.topicDelete, this.topicDelete)
    },
    deleteLunchBreak() {
      const payload = JSON.stringify({
        dentistid: this.thisDentistId,
        date: this.breakData,
        time: this.breakTime
      })
      this.publishMessageNoCheck(payload, this.topicDelete, this.topicDelete)
      // this.publishMessageNoCheck(payload, this.topicDelete, this.topicDelete)
    },
    publishMessage(payload, publishTopic, subscribeTopic) {
      console.log('payload = ', payload)
      this.mqtt_client.subscribe(subscribeTopic + JSON.parse(localStorage.getItem('accountInfo')).token, { qos: 2 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = publishTopic
      const qos = 2
      this.mqtt_client.publish(topic, payload, qos)
    },
    publishMessageNoCheck(payload, publishTopic, subscribeTopic) {
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
      this.publishMessageNoCheck(payload, 'dentistimo/dentist-office/fetch-one', 'dentistimo/dentist-office/one-office')
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
