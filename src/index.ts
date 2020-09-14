import { Reshuffle, EventConfiguration, BaseHttpConnector } from 'reshuffle-base-connector'
import twilio, { Twilio } from 'twilio'
import { NextFunction, Request, Response } from 'express'

const DEFAULT_WEBHOOK_PATH = '/twilio-msg-events'

export interface TwilioConnectorConfigOptions {
  accountSid?: string
  authToken?: string
  opts?: Twilio.TwilioClientOptions
  twilioNumber?: string
}

export interface TwilioConnectorEventOptions {
  path?: string
  method?: 'GET' | 'POST'
}

const sanitizePath = (path = DEFAULT_WEBHOOK_PATH) => {
  const pathNoQueryParam = path.split('?')[0]
  return pathNoQueryParam.startsWith('/') ? pathNoQueryParam : `/${pathNoQueryParam}`
}

export default class TwilioConnector extends BaseHttpConnector<
  TwilioConnectorConfigOptions,
  TwilioConnectorEventOptions
> {
  // Your class variables
  client: Twilio

  constructor(app: Reshuffle, options: TwilioConnectorConfigOptions, id?: string) {
    super(app, options, id)
    this.client = twilio(options.accountSid, options.authToken, options.opts)
  }

  // Your events
  on(options: TwilioConnectorEventOptions, handler: any, eventId: string): EventConfiguration {
    const optionsSanitized = { method: options.method || 'POST', path: sanitizePath(options.path) }

    if (!eventId) {
      eventId = `Twilio/${this.id}`
    }
    const event = new EventConfiguration(eventId, this, optionsSanitized)
    this.eventConfigurations[event.id] = event

    this.app.when(event, handler)
    this.app.registerHTTPDelegate(event.options.path, this)

    return event
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    const { method, params } = req
    const requestPath = params[0]
    let handled = false

    const eventConfiguration = Object.values(this.eventConfigurations).find(
      ({ options }) => options.path === requestPath && options.method === method,
    )

    if (eventConfiguration) {
      this.app.getLogger().info('Handling Twilio event')
      handled = await this.app.handleEvent(eventConfiguration.id, {
        ...eventConfiguration,
        context: { req, res },
      })
    } else {
      this.app.getLogger().warn(`No Twilio event configuration matching ${method} ${requestPath}`)
    }

    next()

    return handled
  }

  public async sendSMS(body: string, to: string): Promise<any | undefined> {
    try {
      const message = await this.client.messages.create({
        body,
        to, // Text this number
        from: this.configOptions?.twilioNumber, // From a valid Twilio number
      })
      this.app.getLogger().info(`Message with id: ${message.sid} was sent.`)

      return message
    } catch (err) {
      console.log(err)
    }
  }

  public async sendMMS(body: string, mediaUrl: string, to: string): Promise<any | undefined> {
    try {
      const message = await this.client.messages.create({
        body,
        mediaUrl: [mediaUrl],
        to, // Text this number
        from: this.configOptions?.twilioNumber, // From a valid Twilio number
      })
      this.app.getLogger().info(`MMS Message with id: ${message.sid} was sent.`)

      return message
    } catch (err) {
      this.app.getLogger().error(err)
    }
  }
}

export { TwilioConnector }
