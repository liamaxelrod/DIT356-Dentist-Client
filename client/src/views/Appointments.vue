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
        <p>{{ this.unsuccessfulBreak }}</p>
      </div>
      <div class="div2-2">
        <p>{{ this.unsuccessfulBreak }}{{ this.successfulBreak }}</p>
        <input type="date" v-model='breakData'>
        <p>selected Data: {{ this.breakData }}</p>
        <input type="time" v-model='breakTime'>
        <p>selected time: {{ this.breakTime }}</p>
        <button class="btn btn-primary" id="buttonFikaBreak" @click="makeFikaBreak">make fika break</button>
        <button class="btn btn-primary" id="buttonFikaBreak" @click="changeFikaBreak">change fika break</button>
        <button class="btn btn-danger" id="buttonFikaBreak" @click="deleteFikaBreak">delete</button>
        <p></p>
        <input type="time" v-model='breakTime'>
        <p>selected time: {{ this.breakTime }}</p>
        <button class="btn btn-primary" id="buttonLunchBreak" @click="makeLunchBreak">make lunch break</button>
        <button class="btn btn-primary" id="buttonLunchBreak" @click="changeLunchBreak">change lunch break</button>
        <button class="btn btn-danger" id="buttonLunchBreak" @click="deleteLunchBreak">delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import checkingInputs from '../checkingInputs'
import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      topicBreaks: 'dentistimo/dentist/breaks',
      topicBreaksError: 'dentistimo/dentist/breaks/error/',
      unsuccessfulBreak: '',
      successfulBreak: '',
      breakData: '',
      breakTime: '',
      mqtt_client: null,
      receive: '',
      value: '',
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
    this.Usetoken = JSON.parse(localStorage.getItem('accountInfo')).token
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
      const payload = JSON.stringify({
        issuance: this.cancelIssuance
      })
      console.log(payload)
      // const topic = 'dentistimo/booking/delete-booking'
      // const qos = 0
      // this.mqtt_client.publish(topic, payload, qos)
    },
    changeFikaBreak() {
      const payload = JSON.stringify({
        idToken: 'need dentistid',
        breakType: 'Fika',
        date: this.breakData,
        time: this.breakTime
      })
      this.publishMessage(payload, this.topicBreaks, this.topicBreaksError)
    },
    changeLunchBreak() {
      const payload = JSON.stringify({
        idToken: 'need dentistid',
        breakType: 'lunch',
        date: this.breakData,
        time: this.breakTime
      })
      const topic = 'dentistimo/dentist/breaks'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    },
    publishMessage(payload, publishTopic, subscribeTopic) {
      this.Usetoken = checkingInputs.makeRandomId(10)
      this.mqtt_client.subscribe(subscribeTopic + this.Usetoken, { qos: 0 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = publishTopic
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
/* @media (max-width: 800px) {}
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
} */
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 100%;
  width: 100%;
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
  height: 100%;
  width: 100%;
}
#h1 {
  /* float: center; */
  font-size: 20px;
  font-weight: bold;
  text-align: right;
  /* color: rgb(0, 255, 106); */
}
#buttonFikaBreak, #buttonLunchBreak {
  /* float: center; */
  margin: 3px;
  /* color: rgb(0, 255, 106); */
}

</style>
