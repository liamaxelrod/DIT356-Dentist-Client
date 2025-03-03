import mqtt from 'mqtt'

const Mqtt = {}

Mqtt.settings = {
  connection: {
    protocol: 'ws',
    host: 'broker.emqx.io',
    port: 8083,
    endpoint: '/mqtt',
    keepalive: 60,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 4000,
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`
    // username: 'group6_dentistimo',
    // password: 'dentistimo123!'
  },
  subscription: {
    topic: 'dentistimo/dentist-appointment/all-appointments',
    qos: 0
  },
  publish: {
    topic: 'dentistimo/dentist-appointment/get-all-appointments',
    qos: 0,
    payload: '{ "msg": "Hello, I am browser." }'
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

Mqtt.createClient = () => {
  const settings = {
    protocol: 'ws',
    host: 'broker.emqx.io',
    port: 8083,
    endpoint: '/mqtt',
    keepalive: 60,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 4000,
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`
    // username: 'group6_dentistimo',
    // password: 'dentistimo123!'
  }
  const { protocol, host, port, endpoint, ...options } = settings
  return mqtt.connect(
    `${protocol}://${host}:${port}${endpoint}`,
    options
  )
}

Mqtt.createConnection = () => {
  try {
    Mqtt.settings.connecting = true
    const { protocol, host, port, endpoint, ...options } = Mqtt.settings.connection
    const connectUrl = `${protocol}://${host}:${port}${endpoint}`
    console.log(connectUrl)
    Mqtt.settings.client = mqtt.connect(connectUrl, options)
    console.log(Mqtt.settings.client)
    if (Mqtt.settings.client.on) {
      Mqtt.settings.client.on('connect', () => {
        Mqtt.settings.connecting = false
        console.log('Connection succeeded!')
      })
      Mqtt.settings.client.on('reconnect', Mqtt.settings.handleOnReConnect)
      Mqtt.settings.client.on('error', (error) => {
        console.log('Connection failed', error)
      })
      Mqtt.settings.client.on('message', (topic, message) => {
        Mqtt.settings.receiveNews = message
        console.log(`Received message ${message} from topic ${topic}`)
      })
    }
  } catch (error) {
    Mqtt.settings.connecting = false
    console.log('mqtt.connect error', error)
    return false
  }
  return true
}

Mqtt.subscribe = (topic, qos) => {
  Mqtt.settings.client.subscribe(topic, { qos }, (error, res) => {
    if (error) {
      console.log('Subscribe to topics error', error)
      return
    }
    Mqtt.settings.subscribeSuccess = true
    console.log('Subscribe to topics res', res)
  })
}

Mqtt.unsubscribe = (topic) => {
  Mqtt.settings.client.unsubscribe(topic, (error, res) => {
    if (error) {
      console.log('Unsubscribe to topics error', error)
      return
    }
    Mqtt.settings.subscribeSuccess = false
    console.log('Unsubscribe to topics res', res)
  })
}

Mqtt.publish = (topic, message, qos) => {
  Mqtt.settings.client.publish(topic, message, { qos }, (error, res) => {
    if (error) {
      console.log('Publish to topics error', error)
      return
    }
    console.log('Publish to topics res', res)
  })
}

Mqtt.handleOnReConnect = () => {
  console.log('Reconnect')
  Mqtt.settings.retryTimes += 1
  if (Mqtt.settings.retryTimes > 5) {
    try {
      Mqtt.settings.client.end()
      Mqtt.settings.initData()
      console.log('Connection maxReconnectTimes limit, stop retry')
    } catch (error) {
      console.log(error)
    }
  }
}

Mqtt.destroyConnection = () => {
  if (Mqtt.settings.client.connected) {
    try {
      Mqtt.settings.client.end(false, () => {
        Mqtt.settings.initData()
        console.log('Successfully disconnected!')
      })
    } catch (error) {
      console.log('Disconnect failed', error.toString())
    }
  }
}

// Mqtt.initData = () => {
//   this.client = {
//     connected: false
//   }
//   this.retryTimes = 0
//   this.connecting = false
//   this.subscribeSuccess = false
// } // was in the other version

export default Mqtt
