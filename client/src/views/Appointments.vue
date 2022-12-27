<template class="test">
  <div class="background">
    <div class="div1">
      <b-button class="btn_message" variant="primary" @click="appointments" >Get all appointments</b-button>
      <p onchange="myFunction" >| {{this.receive}} |</p>
      <!-- https://bootstrap-vue.org/docs/components/calendar#comp-ref-b-calendar-props -->
      <Calendar/>
      <AppointsmentsCard/>
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
import AppointsmentsCard from '../components/AppointmentsCard.vue'
import Calendar from '../components/Calendar.vue'
import mymqtt from '../mymqtt'

export default {
  components: {
    AppointsmentsCard,
    Calendar
  },
  data() {
    return {
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
    getValue() {
      this.displayTime = document.getElementById('selectFika').value
    },
    appointments() {
      const dateFormat = this.value
      const newDate = dateFormat.replace('2022', '22')
      const newFormat = newDate.replace('-', '.')
      const newFormat2 = newFormat.replace('-', '.')
      const text = newFormat2
      const result = text.substring(0, 2)
      const secondresult = text.substring(6, 8)
      const thirdresult = text.substring(2, 6)
      const finalresult = secondresult + thirdresult + result
      const payload = '{ "dentistid": 687181763' + ', "date": ' + '"' + finalresult + '"' + ' }'
      const topic = 'dentistimo/dentist-appointment/get-all-appointments-day'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
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
  height: 90%;
  width: 50%;
  padding: 20px;
  /* border: 10px
  solid rgb(0, 255, 106); */
}

.div2 {
  /* background: white; */
  height: 90%;
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
