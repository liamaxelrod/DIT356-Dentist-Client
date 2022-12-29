<template>
  <div class="background">
    <div class="div1">
      <p></p>
      <p id="firstName">first name: {{accoountInfo.firstName}}</p>
      <p id="lastName">last name: {{accoountInfo.lastName}}</p>
      <p id="company">company: {{accoountInfo.company}}</p>
      <p id="email">email: {{accoountInfo.email}}</p>
    </div>
    <div class="div2">
      <div class="in2div1">
        <p id="popUp">{{ this.unsuccessful }}</p>
        <p id="popUp2">{{ this.successful }}</p>
        <p id="checkPassword">check password</p>
        <input id="inputCheckPassword" v-model='checkPasswordText' placeholder="enter password">
        <button class="btn btn-success" id="buttonChange" @click="changeFirstName">change first name</button>
        <button class="btn btn-success" id="buttonChange" @click="changeLastName">change last name</button>
        <button class="btn btn-success" id="buttonChange" @click="changeCompanyName">change company</button>
        <button class="btn btn-success" id="buttonChange" @click="changeEmail">change email</button>
        <button class="btn btn-success" id="buttonChange" @click="changePassword">change password</button>    </div>
      <div class="in2div2">
        <p id="changeFirstName">change first name</p>
        <input id="inputFirstName" v-model='changeFirstNameText' placeholder="enter new first name">
        <p></p>
        <p id="changelastName">change last name</p>
        <input id="inputLastName" v-model='changeLastNameText' placeholder="enter new last name">
        <p></p>
        <p id="changeCompanyName">change company</p>
        <input id="inputCompany" v-model='changeCompanyNameText' placeholder="enter new company">
        </div>
      <div class="in2div3">
        <p id="changeEmail">change email</p>
        <input id="inputEmail" v-model='changeEmailText' placeholder="enter new email">
        <p></p>
        <p id="changePassword">change password</p>
        <input id="inputpassword" v-model='changePasswordText' placeholder="enter new password">
        <p></p>
        <p></p>
        <p></p>
        <button class="btn btn-danger" id="buttonChange" @click="deleteAccount">DELETE Account</button>
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
      topic: 'dentistimo/update-user',
      topicError: 'dentistimo/dentists/delete/error/',
      changeFirstNameText: '',
      changeLastNameText: '',
      changeCompanyNameText: '',
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
    }
    this.mqtt_client.on('message', msgCallback)
    this.mqtt_client.on('subscribe', (topic) => {
      console.log('Subscribed too: ', topic)
    })
    this.accoountInfo.firstName = JSON.parse(localStorage.getItem('accountInfo')).firstName
    this.accoountInfo.lastName = JSON.parse(localStorage.getItem('accountInfo')).lastName
    this.accoountInfo.company = JSON.parse(localStorage.getItem('accountInfo')).companyName
    this.accoountInfo.email = JSON.parse(localStorage.getItem('accountInfo')).email
  },
  methods: {
    checkifblank(input) {
      if (input === '') {
        return true
      } else {
        return false
      }
    },
    changeFirstName() {
      if (!this.checkifblank(this.changeFirstNameText)) {
        const payload = JSON.stringify({
          idToken: this.Usetoken,
          Attribute: 'firstName',
          newValue: this.changeFirstNameText,
          password: this.checkPasswordText
        })
        this.publish(payload, this.topic, this.topicError)
        this.changeFirstNameText = ''
      } else {
        this.unsuccessful = 'please enter new first name'
      }
    },
    changeLastName() {
      if (!this.checkifblank(this.changeLastNameText)) {
        const payload = JSON.stringify({
          idToken: this.Usetoken,
          Attribute: 'lastName',
          newValue: this.changeLastNameText,
          password: this.checkPasswordText
        })
        this.publish(payload, this.topic, this.topicError)
        this.changeLastNameText = ''
      } else {
        this.unsuccessful = 'please enter new last name'
      }
    },
    changePassword() {
      if (!this.checkifblank(this.changePasswordText)) {
        const payload = JSON.stringify({
          idToken: this.Usetoken,
          Attribute: 'password',
          newValue: this.changePasswordText,
          password: this.checkPasswordText
        })
        this.publish(payload, this.topic, this.topicError)
        this.changePasswordText = ''
      } else {
        this.unsuccessful = 'please enter new password'
      }
    },
    changeCompanyName() {
      if (!this.checkifblank(this.changeCompanyNameText)) {
        const payload = JSON.stringify({
          idToken: this.Usetoken,
          Attribute: 'companyName',
          newValue: this.changeCompanyNameText,
          password: this.checkPasswordText
        })
        this.publish(payload, this.topic, this.topicError)
        this.changeCompanyNameText = ''
      } else {
        this.unsuccessful = 'please enter new company name'
      }
    },
    changeEmail() {
      if (!this.checkifblank(this.changeEmailText)) {
        const payload = JSON.stringify({
          idToken: this.Usetoken,
          Attribute: 'email',
          newValue: this.changeEmailText,
          password: this.checkPasswordText
        })
        this.publish(payload, this.topic, this.topicError)
        this.changeEmailText = ''
      } else {
        this.unsuccessful = 'please enter new email'
      }
    },
    deleteAccount() {
      const payload = JSON.stringify({
        idToken: this.Usetoken,
        password: this.checkPasswordText,
        delete: 'delete'
      })
      this.publish(payload, 'dentistimo/dentists/delete', 'dentistimo/dentists/delete/error/')
    },
    publish(payload, publishTopic, subscribeTopic) {
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

<style>
background{
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
.in2div1 {
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
height: 100%;
width: 34%;
padding: 20px;
/* border: 10px
solid rgb(0, 255, 106); */
}
.in2div2 {
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
height: 100%;
width: 33%;
padding: 20px;
/* border: 10px
solid rgb(221, 255, 0); */
}
.in2div3 {
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
height: 100%;
width: 33%;
padding: 20px;
/* border: 10px
solid rgb(0, 255, 106); */
}
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
</style>
