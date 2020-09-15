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

You can now trigger a handler on incoming messages:
```js
twilioConnector.on({method: 'GET' | 'POST', path:'/sms'}, (event) => {
  const msg = event.context.res.end('Thanks for your message')
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

Example on how to use this connector can be [found here](https://github.com/reshufflehq/reshuffle/blob/master/examples/message/TwilioSendMessageExample.js).


