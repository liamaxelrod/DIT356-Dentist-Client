<template>
  <div id="app">
    <Logo_Dentistimo/>
    <div>
      <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
          <b-navbar-brand href="/">Dentistimo</b-navbar-brand>
          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-item href="/appointments">Appointments</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
              <b-navbar-nav>
                <!-- TODO! If logged in change to logout button instead -->
                  <b-nav-item href="/login">Login</b-nav-item>
                  <b-nav-item href="/register">register</b-nav-item>
                </b-navbar-nav>
              <b-nav-item-dropdown right>
                <template #button-content>
                  <em>User</em>
                </template>
                <b-dropdown-item href="/userProfile">User Profile</b-dropdown-item>
                <b-dropdown-item href="/">Sign Out</b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    </div>
    <router-view />
  <div id="footer">
      <p class="copy">© 2022 Dentistimo</p>
    </div>
  </div>
</template>

<script>
import Logo from './components/Logo.vue'
import mqtt from 'mqtt'

export default {
  components: {
    Logo_Dentistimo: Logo
  },
  data() {
    return {
      message: 'none',
      connection: {
        protocol: 'wss',
        host: 'e33e41c289ad4ac69ae5ef60f456e9c3.s2.eu.hivemq.cloud',
        port: 8884,
        endpoint: '/mqtt',
        keepalive: 60,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 4000,
        clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
        username: 'group6_dentistimo',
        password: 'dentistimo123!'
      },
      subscription: {
        topic: 'dentistimo/dentistClient/test',
        qos: 0
      },
      publish: {
        topic: 'dentistimo/dentistClient/test',
        qos: 0,
        payload: '{"userid": 6723, "requestid": 50981, "dentistid": 477612321726}'
      },
      receiveNews: '',
      qosList: [0, 1, 2],
      client: {
        connected: false
      },
      subscribeSuccess: false,
      connecting: false,
      retryTimes: 0
    }
  },
  mounted() {
    // mqtt.createConnection()
    this.createConnection()
    this.doSubscribe()
  },
  methods: {
    initData() {
      this.client = {
        connected: false
      }
      this.retryTimes = 0
      this.connecting = false
      this.subscribeSuccess = false
    },
    handleOnReConnect() {
      this.retryTimes += 1
      if (this.retryTimes > 5) {
        try {
          this.client.end()
          this.initData()
          this.$message.error('Connection maxReconnectTimes limit, stop retry')
        } catch (error) {
          // this.$message.error(error.toString())
          console.log(error)
        }
      }
    },
    createConnection() {
      try {
        this.connecting = true
        const { protocol, host, port, endpoint, ...options } = this.connection
        const connectUrl = `${protocol}://${host}:${port}${endpoint}`
        console.log(connectUrl)
        this.client = mqtt.connect(connectUrl, options)
        console.log(this.client)
        if (this.client.on) {
          this.client.on('connect', () => {
            this.connecting = false
            console.log('Connection succeeded!')
          })
          this.client.on('reconnect', this.handleOnReConnect)
          this.client.on('error', (error) => {
            console.log('Connection failed', error)
          })
          this.client.on('message', (topic, message) => {
            this.receiveNews = message
            console.log(`Received message ${message} from topic ${topic}`)
          })
        }
      } catch (error) {
        this.connecting = false
        console.log('mqtt.connect error', error)
      }
      console.log('hello') // console.log says hello
      console.log(this.client)
    },
    doSubscribe() {
      const { topic, qos } = this.subscription
      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        this.subscribeSuccess = true
        console.log('Subscribe to topics res', res)
      })
    },
    getClient() {
      return this.client
    },
    doUnSubscribe() {
      const { topic } = this.subscription
      this.client.unsubscribe(topic, error => {
        if (error) {
          console.log('Unsubscribe error', error)
        }
      })
    },
    doPublish({ topic, qos, payload }) {
      // const { topic, qos, payload } = this.publish
      this.client.publish(topic, payload, { qos }, error => {
        if (error) {
          console.log('Publish error', error)
        }
      })
    },
    destroyConnection() {
      if (this.client.connected) {
        try {
          this.client.end(false, () => {
            this.initData()
            console.log('Successfully disconnected!')
          })
        } catch (error) {
          console.log('Disconnect failed', error.toString())
        }
      }
    }
  }
}

</script>

<style>
  #footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}

</style>
