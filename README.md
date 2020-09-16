# reshuffle-twilio-connector

[Code](https://github.com/reshufflehq/reshuffle-twilio-connector) |  [npm](https://www.npmjs.com/package/reshuffle-twilio-connector)

`npm install reshuffle-twilio-connector`

### Reshuffle Twilio Connector

This connector provides Twilio send sms and send mms actions.

#### Configuration Options:
```typescript
interface TwilioConnectorConfigOptions {
    accountSid: string
    authToken: string
    opts?: Twilio.TwilioClientOptions
    twilioNumber?: string
}
```

#### Connector events

##### new messages
This event is fired when new messages are delivered to <twilioNumber>.

For setting up webhooks in Twilio:
- go to https://www.twilio.com/console/phone-numbers/incoming
- select the phone number you'd like to use
- scroll all the way down to messaging
- create a new webhook with method and path
- save

You can now trigger a handler on incoming messages.

##### Example:
```js
twilioConnector.on({method:'POST', path:'/sms'}, (event) => {
  console.log(event.context.req.body)
  // Example of console output for event.context.req.body:
  // {
  //   ToCountry = "US"
  //   ToState = "ID"
  //   SmsMessageSid = "SM9aca55a393c120f964cc49d91bfec52e"
  //   NumMedia = "0"
  //   ToCity = "DESMET"
  //   FromZip = "85004"
  //   SmsSid = "SM9aca55a393c120f964cc49d91bfec52e"
  //   FromState = "AZ"
  //   SmsStatus = "received"
  //   FromCity = "PHOENIX"
  //   Body = "msg line 1 line 2 line 3"
  //   FromCountry = "US"
  //   To = "+12082685987"
  //   ToZip = "99128"
  //   NumSegments = "1"
  //   MessageSid = "SM9aca55a393c120f964cc49d91bfec52e"
  //   AccountSid = "AC43820350f399443f2ab9a80ce59dc797"
  //   From = "+19282275501"
  //   ApiVersion = "2010-04-01"
  // }

  const messageReceived = event.context.req.body.Body
  const fromPhoneNumber = event.context.req.body.From
  console.log(`New SMS received from ${fromPhoneNumber}: ${messageReceived}`)

  if(messageReceived.includes('test')) {
    event.context.res.end("test successful")
  } else {
    event.context.res.end("Thanks for your message")
  }
})
```

#### Connector actions
This connector provides 2 type of actions for sending SMS or MMS via Twilio

##### sendSMS
send a message via Twilio:
```js
myTwilioConnector.sendSMS('<your-message>', '<to-phone-number>' )
```

##### sendMMS
send a media message via Twilio:
```js
myTwilioConnector.sendMMS('<your-message>', '<media-url>','<to-phone-number>' )
```

##### sdk
returns a Twilio client (using the connector config options)

See documentation in Twilio github: https://github.com/twilio/twilio-node

Example on how to use this connector can be [found here](https://github.com/reshufflehq/reshuffle/blob/master/examples/message/TwilioSendMessageExample.js).
