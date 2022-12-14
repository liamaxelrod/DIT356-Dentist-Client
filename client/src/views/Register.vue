<template>
    <div class="center">
        <div class="aboveButtons">
            <p  id="pop-up">{{this.stateIfSuccessful}}</p>
            <input id="inputID" v-model='changeIDText' placeholder="enter new ID">
            <P></P>
            <input id="inputpassword" v-model='changePasswordText' placeholder="enter new password">
            <P></P>
            <input id="inputCompany" v-model='changecompanyText' placeholder="enter new Company">
            <P></P>
            <input id="inputeEmail" v-model='changeEmailText' placeholder="enter new Email">
            <P></P>
            <button id="registerButton" @click="register" class="btn btn-success btn-lg">register</button>
            <p></p>
            <button @click="a" class="btn btn-success btn-lg">1</button>
        </div>
    </div>
</template>

<script>
// import App from '../App.vue'
import mymqtt from '../mymqtt'

export default {
  data() {
    return {
      mymqtt: mymqtt.receiveNews,
      news: 'none',
      changeIDText: '',
      changePasswordText: '',
      changecompanyText: '',
      changeEmailText: '',
      stateIfSuccessful: 'successful/failed to register',
      subscription: {
        topic: 'dentistimo/dentistClient/test',
        qos: 0
      },
      publish: {
        topic: 'dentistimo/dentistClient/test',
        qos: 0,
        payload: '{"userid": ' + this.changeIDText + ', "password": ' + this.changePasswordText + ', "company name": ' + this.changecompanyText + ', "email": ' + this.changeEmailText + ' }'
      }
    }
  },
  mounted() {
    mymqtt.createConnection()
    mymqtt.subscribe()
  },
  methods: {
    checkID() {
      /* blank for now */
    },
    checkPassword() {
      /* blank for now */
    },
    checkCompany() {
      /* blank for now */
    },
    checkEmail() {
      /* blank for now */
    },
    register() {
      // const a = App.publish.payload
      const message = {
        payload: '{"userid": ' + this.changeIDText + ', "password": ' + this.changePasswordText + ', "company name": ' + this.changecompanyText + ', "email": ' + this.changeEmailText + ' }',
        topic: 'test',
        qos: this.publish.qos
      }
      console.log(message.topic + ' test!')
      mymqtt.publish(message.topic, message.payload, message.qos)
      console.log('register button clicked')
      this.changeIDText = this.mymqtt
    },
    a() {
      console.log('test button clicked')
    }
  }
}
</script>

<style>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    background-color: #80BAB2;
    /*
    height: 100%;
    width: 100%;
    problem with overall CSS app page I think for this part to work with the CSS
    */
}
/* .pop-up {blank for now}  */
#registerButton {
    height: 100%;
    width: 100%;
}
</style>
