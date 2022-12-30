<template>
  <div class="background">
    <div class="div1">
      <p></p>
      <p id="firstName">first name: {{accoountInfo.firstName}}</p>
      <p id="lastName">last name: {{accoountInfo.lastName}}</p>
      <p id="company">company: {{accoountInfo.company}}</p>
      <p id="email">email: {{accoountInfo.email}}</p>
      <p id="popUp">{{ this.unsuccessful }}</p>
      <p id="popUp2">{{ this.successful }}</p>
    </div>
    <div class="div2">
      <div class="inDiv2Div1">
        <p id="checkPassword">insert current password</p>
        <p id="checkPassword">before making change</p>
        <input id="inputCheckPassword" v-model='checkPasswordText' placeholder="enter password">
        <button class="btn btn-success" id="buttonChange" @click="makeChange">make change</button>
      </div>
      <div class="inDiv2Div2">
        <p id="changeFirstName">change first name</p>
        <input id="inputFirstName" v-model='changeFirstNameText' placeholder="enter new first name">
        <p></p>
        <p id="changelastName">change last name</p>
        <input id="inputLastName" v-model='changeLastNameText' placeholder="enter new last name">
        <p></p>
        <p id="changeCompanyId">change company ID</p>
        <input id="inputCompany" v-model='changeCompanyIdText' placeholder="enter new company ID">
        <p></p>
        <p id="changeEmail">change email</p>
        <input id="inputEmail" v-model='changeEmailText' placeholder="enter new email">
        <p></p>
        <p id="changePassword">change password</p>
        <input id="inputpassword" v-model='changePasswordText' placeholder="enter new password">
      </div>
    </div>
  </div>
</template>
<script>
// import checkingInputs from '../checkingInputs'
import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      topic: 'dentistimo/modify-user',
      topicError: 'dentistimo/modify-user/error/',
      changeFirstNameText: '',
      changeLastNameText: '',
      changeCompanyIdText: '',
      changeEmailText: '',
      changePasswordText: '',
      checkPasswordText: '',
      mqtt_client: null,
      receive: '',
      unsuccessful: '',
      successful: '',
      Usetoken: '',
      accoountInfo: {
        firstName: '',
        lastName: '',
        company: '',
        officeId: '',
        email: ''
      }
    }
  },
  mounted() {
    this.mqtt_client = mymqtt.createClient()
    const msgCallback = (topic, message) => {
      this.receive = message.toString()
      this.context = message.toString()
      console.log({ topic: topic, message: message.toString() })
      this.buildNewLocalStorage()
    }
    this.mqtt_client.on('message', msgCallback)
    this.mqtt_client.on('subscribe', (topic) => {
      console.log('Subscribed too: ', topic)
    })
    this.updateDisplay()
  },
  methods: {
    attributesCheck() {
      if (this.changeFirstNameText === '' && this.changeLastNameText === '' && this.changeCompanyIdText === '' && this.changeEmailText === '' && this.changePasswordText === '') {
        this.unsuccessful = 'please enter at least one attribute to change'
      } else {
        return true
      }
    },
    makePayload() {
      const payload = {
        idToken: this.Usetoken,
        checkPassword: this.checkPasswordText
      }
      if (this.changeFirstNameText !== '') {
        payload.firstName = this.changeFirstNameText
        this.changeFirstNameText = ''
      }
      if (this.changeLastNameText !== '') {
        payload.lastName = this.changeLastNameText
        this.changeLastNameText = ''
      }
      if (this.changeCompanyIdText !== '') {
        payload.officeId = this.changeCompanyIdText
        this.changeCompanyIdText = ''
      }
      if (this.changeEmailText !== '') {
        payload.email = this.changeEmailText
        this.changeEmailText = ''
      }
      if (this.changePasswordText !== '') {
        payload.password = this.changePasswordText
        this.changePasswordText = ''
      }
      const JSONpayload = JSON.stringify(payload)
      return JSONpayload
    },
    makeChange() {
      if (this.attributesCheck()) {
        this.publish(this.makePayload(), this.topic, this.topicError)
      }
    },
    // deleteAccount() { //this feature was removed from the application
    //   const payload = JSON.stringify({
    //     idToken: this.Usetoken,
    //     password: this.checkPasswordText,
    //     delete: 'delete'
    //   })
    //   this.publish(payload, 'dentistimo/dentists/delete', 'dentistimo/dentists/delete/error/')
    // },
    publish(payload, publishTopic, subscribeTopic) {
      // this.Usetoken = checkingInputs.makeRandomId(10)
      this.mqtt_client.subscribe(publishTopic + '/' + this.Usetoken, { qos: 2 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      this.mqtt_client.subscribe(subscribeTopic + this.Usetoken, { qos: 2 }, (error, res) => {
        if (error) { console.log('error = ', error) } else { console.log('res = ', res) }
      })
      const qos = 2
      this.mqtt_client.publish(publishTopic, payload, qos)
      // location.reload()
      /*
      {topic: 'dentistimo/modify-user/eyJhbGciOiJIUzI1NiIsInR5cCI…udCJ9.5I8BgLecrrcL0qeOuy6NIstTie3yLqcjpjc6w9BK2nI',
      message: 'Update successful: {"firstName":"liam","lastName":…od",
      "email":"liamaxelrod@gmail.com",
      "officeId":1}'}
      */
    },
    buildNewLocalStorage() {
      if (this.receive.includes('Update successful')) {
        localStorage.setItem('temporary', this.receive)
        const newFirstName = JSON.parse(localStorage.getItem('temporary')).firstName
        const newLastName = JSON.parse(localStorage.getItem('temporary')).lastName
        const newOfficeId = JSON.parse(localStorage.getItem('temporary')).officeId
        const newEmail = JSON.parse(localStorage.getItem('temporary')).email
        const oldIdToken = JSON.parse(localStorage.getItem('accountInfo')).IdToken
        const oldDentistId = JSON.parse(localStorage.getItem('accountInfo')).dentistId
        const newAccountInfo = JSON.stringify({
          IdToken: oldIdToken,
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          officeId: newOfficeId,
          dentistId: oldDentistId
        })
        localStorage.setItem('accountInfo', newAccountInfo)
        localStorage.removeItem('temporary')
        this.updateDisplay()
      } else if (this.receive.includes('dentistimo/modify-user/error')) {
        this.unsuccessful = this.receive
      }
    },
    updateDisplay() {
      this.accoountInfo.firstName = JSON.parse(localStorage.getItem('accountInfo')).firstName
      this.accoountInfo.lastName = JSON.parse(localStorage.getItem('accountInfo')).lastName
      this.accoountInfo.officeId = JSON.parse(localStorage.getItem('accountInfo')).officeId
      this.accoountInfo.email = JSON.parse(localStorage.getItem('accountInfo')).email
      this.Usetoken = JSON.parse(localStorage.getItem('accountInfo')).IdToken
      if (this.accoountInfo.officeId === 1) {
        this.accoountInfo.company = 'Your Dentist'
      } else if (this.accoountInfo.officeId === 2) {
        this.accoountInfo.company = 'Tooth Fairy Dentist'
      } else if (this.accoountInfo.officeId === 3) {
        this.accoountInfo.company = 'The Crown'
      } else if (this.accoountInfo.officeId === 3) {
        this.accoountInfo.company = 'Lisebergs Dentists'
      }
    }
  }
}
</script>

<style>
.background{
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
height: 100%;
width: 100%;
}
.div1 {
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
height: 100%;
width: 100%;
padding: 20px;
/* border: 10px
solid rgb(0, 255, 106); */
}
.div2 {
display: flex;
flex-direction: row;
height: 100%;
width: 100%;
/* border: 10px
solid rgb(221, 255, 0); */
}
.inDiv2Div1 {
display: flex;
align-items: center;
flex-direction: column;
height: 100%;
width: 30%;
padding: 20px;
/* border: 10px
solid rgb(0, 255, 106); */
}
.inDiv2Div2 {
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
height: 100%;
width: 70%;
padding: 20px;
border: 10px
solid rgb(221, 255, 0);
}
/* .in2div3 {
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
height: 100%;
width: 33%;
padding: 20px;
/* border: 10px
solid rgb(0, 255, 106);
} */
#firstName, #lastName, #company, #email {
font-size: 20px;
}
#popUp {
font-size: 20px;
color: red;
}
#popUp2 {
font-size: 20px;
color: green;
}
#buttonChange {
width: 21vh;
margin: 5px;
}
#checkPassword {
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
}
</style>
