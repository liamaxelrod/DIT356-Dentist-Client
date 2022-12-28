<template>
  <div class="background">
   <div class="div1">
    <p></p>
      <p id="firstName">first name: {{accoountInfo.firstName}}</p>
      <p id="lastName">last name: {{accoountInfo.lastName}}</p>
      <p id="company">company: {{accoountInfo.company}}</p>
      <p id="email">email: {{accoountInfo.email}}</p>
    <div class="deleteAccount">
      <button class="btn btn-danger" id="buttonDeleteAccount" @click="deleteAccount">DELETE Account</button>
    </div>
   </div>
   <div class="div2">
    <p></p>
    <input id="inputFirstName" v-model='changeFirstNameText' placeholder="enter new first name">
    <input id="inputLastName" v-model='changeLastNameText' placeholder="enter new last name">
    <input id="inputPassword" v-model='changePasswordText' placeholder="enter new password">
    <input id="inputCompany" v-model='changeCompanyText' placeholder="enter new company">
    <input id="inputEmail" v-model='changeEmailText' placeholder="enter new email">
    <P></P>
    <button id="bittpnChangeFirstName" @click="changeFirstName" class="btn btn-success btn-lg">change first name</button>
    <button id="bittpnChangeLastName" @click="changeLastName" class="btn btn-success btn-lg">change last name</button>
    <button id="bittpnChangePassword" @click="changePassword" class="btn btn-success btn-lg">change password</button>
    <button id="bittpnChangeCompany" @click="changeCompany" class="btn btn-success btn-lg">change company</button>
    <button id="bittpnChangeEmail" @click="changeEmail" class="btn btn-success btn-lg">change email</button>
   </div>
  </div>
</template>

<script>
import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      topic1: 'dentistimo/dentist/account/changes/first/name',
      topic2: 'dentistimo/dentist/account/changes/last/name',
      topic3: 'dentistimo/dentist/account/changes/password',
      topic4: 'dentistimo/dentist/account/changes/company',
      topic5: 'dentistimo/dentist/account/changes/email',
      topic6: 'dentistimo/dentist/account/changes/delete',
      changeFirstNameText: '',
      changeLastNameText: '',
      changePasswordText: '',
      changeCompanyText: '',
      changeEmailText: '',
      mqtt_client: null,
      accoountInfo: {
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password',
        company: 'companyName',
        email: 'email'

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
    // this.mqtt_client.subscribe(this.topic, { qos: 0 }, (error, res) => {
    //   if (error) {
    //     console.log('error = ', error)
    //   } else {
    //     console.log('res = ', res)
    //   }
    // })
  },
  methods: {
    changeFirstName() {
      const payload = JSON.stringify({
        dentistId: 'need dentistid',
        category: 'first name',
        change: this.changeFirstNameText
      })
      this.mqtt_client.subscribe(this.topic1, { qos: 0 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = 'dentistimo/dentist/breaks'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    },
    changeLastName() {
      const payload = JSON.stringify({
        dentistId: 'need dentistid',
        category: 'last name',
        change: this.changeLastNameText
      })
      this.mqtt_client.subscribe(this.topic2, { qos: 0 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = 'dentistimo/dentist/breaks'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    },
    changePassword() {
      const payload = JSON.stringify({
        dentistId: 'need dentistid',
        category: 'password',
        change: this.changePasswordText
      })
      this.mqtt_client.subscribe(this.topic3, { qos: 0 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = 'dentistimo/dentist/breaks'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    },
    changeCompany() {
      const payload = JSON.stringify({
        dentistId: 'need dentistid',
        category: 'company',
        change: this.changeCompanyText
      })
      this.mqtt_client.subscribe(this.topic4, { qos: 0 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = 'dentistimo/dentist/breaks'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    },
    changeEmail() {
      const payload = JSON.stringify({
        dentistId: 'need dentistid',
        category: 'email',
        change: this.changeEmailText
      })
      this.mqtt_client.subscribe(this.topic5, { qos: 0 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = 'dentistimo/dentist/breaks'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    },
    deleteAccount() {
      const payload = JSON.stringify({
        dentistId: 'need dentistid',
        delete: 'delete'
      })
      this.mqtt_client.subscribe(this.topic6, { qos: 0 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const topic = 'dentistimo/dentist/breaks'
      const qos = 0
      this.mqtt_client.publish(topic, payload, qos)
    }
  }
}
</script>

<style>
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row; /* won't turn into a row */
  height: 100%;
  width: 100%;
}
.div1 {
  /* background:white; */
  height: 100%;
  width: 100%;
  padding: 20px;
  border: 10px
  solid rgb(0, 255, 106);
}
.div2 {
  /* background: white; */
  height: 100%;
  width: 100%;
  padding: 20px;
  border: 10px
  solid rgb(221, 255, 0);
}
</style>
