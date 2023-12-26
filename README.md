# Node-RED Slack Bolt Integration

Control your Slack App via Node-Red! Slack Bolt integration.

What you can do with this [node-red](https://flows.nodered.org/node/@headless-architecture/node-red-contrib-slack-bolt) plugin?

- send simple text messages
- send complex block messages
- events: listen to any [Slack Events](https://api.slack.com/events)
- actions: listen to user action and respond via Node-Red
- commands: create your own commands with your Slack App and listen via Node-Red
- shortcuts: create your own global or message based shortcuts and develop it with Node-Red
- views: Slack views
- messages: listing for messages in a channel

Develop your [Slack app using Bolt](https://slack.dev/bolt-js/tutorial/getting-started) for JavaScript with Node-Red.

```shell
npm i @headless-architecture/node-red-contrib-slack-bolt
```

> [!IMPORTANT]
> This is an alpha version, no grarranty for productive mode!

## Usage

### Setup Slack App

- open [Slack App](https://api.slack.com/apps?new_app=1)
- [create new Slack App](https://api.slack.com/apps?new_app=1)
- Choose `from an app manifest`
- Choose your workspace
- Copy from [here](https://github.com/fishme/node-red-contrib-slack-bolt/blob/main/docs/Slack/manifest.yml) or manifest below
- Paste into YAML section
- create app
- optional: If you need the app for events, then you will need a App-Level Token (see under Basic Information) select scope `connection:write`

> [!TIP]
> Don't forget to install the app also into a channel.

> [!NOTE]
> Could be that the installation of your slack app takes longer than 60min.

<details><summary>Slack Manifest</summary>

```yaml
display_information:
  name: Node-Red-Integration
  description: Integrate Slack with Node-Red instance
  background_color: "#4f4e4b"
features:
  app_home:
    home_tab_enabled: true
    messages_tab_enabled: true
    messages_tab_read_only_enabled: false
  bot_user:
    display_name: Node-Red-demo-app
    always_online: true
  shortcuts:
    - name: need_drink
      type: global
      callback_id: need_drink
      description: modal view for approve and deny
    - name: open_modal
      type: global
      callback_id: open_modal
      description: open simple modal
  slash_commands:
    - command: /node-red
      description: test
      should_escape: false
oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - chat:write
      - commands
      - reactions:read
settings:
  event_subscriptions:
    bot_events:
      - app_mention
  interactivity:
    is_enabled: true
  org_deploy_enabled: false
  socket_mode_enabled: true
  token_rotation_enabled: false
```

</details>

### Node-RED Installation

open your folder via favourite shell<br />

```shell
npm i @headless-architecture/node-red-contrib-slack-bolt
```

### Node-Red Configuration

After the installation of `@headless-architecture/node-red-contrib-slack-bolt` search in your Node-RED toolbar for `slack`

![Slack Bolt Nodes](https://raw.githubusercontent.com/fishme/node-red-contrib-slack-bolt/main/docs/img/node-red-slackbolt-nodes.png)

#### Nodes

- message: send text and block messages
- registry: registration of slack actions, events, commands, messages, options, shortcuts and views

#### Slack App Configuration

![Slack App Configuration](https://raw.githubusercontent.com/fishme/node-red-contrib-slack-bolt/main/docs/img/slack-app-config.png)

| Name | Description |
| --- | --- |
| Bot Token *required* | communciation token (starts with xoxb-) see [Slack App](https://api.slack.com/apps/) "OAuth/Permissions" -> "Bot User OAuth Token" |
| Log Level | Slack log levels [more info](https://slack.dev/bolt-js/concepts#logging) |
| Socket | activate the socket mode, if you want to listen for changes in your channel. It is required for the registry nodes. see [Slack App](https://api.slack.com/apps/) "Socked Mode" |
| Port | default is 3000 [more info](https://slack.dev/bolt-js/concepts#socket-mode) |
| App Token | Slack App Token (starts with xapp-) see [slack app](https://api.slack.com/apps/) "Basic information" -> "App-level-Token" -> create new -> choose connections:write  |

#### Message

With this node, Node-RED is able to send direct messages into a channel. Private message to a person is not possible (yet).

![Slack Message](https://raw.githubusercontent.com/fishme/node-red-contrib-slack-bolt/main/docs/img/message-config.png)

 Name | Description |
| --- | --- |
| Slack App | see Slack App Configuration above |
| Channel | slack channel, starts always with a hash (e.g. #main)  |
| Property | variable of the content for a message |
| Topic | text or block message  |
| Text | direct message (overwrite input stream)  |
| Blocks | JSON format, complex messages with interactions (overwrite input stream)  |
<br />
<details><summary><b>Block Example</b></summary>
Simple Block for choosing a date

```json
[
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Pick a date for me to remind you"
        },
        "accessory": {
            "type": "datepicker",
            "action_id": "datepicker_remind",
            "initial_date": "2019-04-28",
            "placeholder": {
                "type": "plain_text",
                "text": "Select a date"
            }
        }
    }
]
```

</details>

- [Block Kit Builder](https://app.slack.com/block-kit-builder)
- [Formating Blocks](https://api.slack.com/reference/surfaces/formatting#rich-layouts)

#### Registry

This node enable the following Slack functions.

- Actions
- Events
- Views
- Messages (listener, sending of messages see message node)
- Options
- Shortcuts
- Commands

Below of the node, you can verify the registrations of your events.
A, E, V, M, O, S, C; Starting letter of the liste above.

![Node Registry Node-RED example](https://raw.githubusercontent.com/fishme/node-red-contrib-slack-bolt/main/docs/img/node-registry-example.png)
<br /><br />
All listener needs to add once. Therefor create a Infection with:
<br />
<br />
![Node Injection](https://raw.githubusercontent.com/fishme/node-red-contrib-slack-bolt/main/docs/img/injection.png)
<br />
Connect a function node with the following code.

Magic Slack Code.
This will listen for App mention in your channel.  <br />
e.g. Your App name @Node-Red-demo-app.

Write in your Slack channel:
`@Node-Red-demo-app What's up?`

Slack will answer you with a button and if your press on the button the action will send an answer back.

![Active Communication](https://raw.githubusercontent.com/fishme/node-red-contrib-slack-bolt/main/docs/img/node-registry-example1.png)

```javascript

// initialize your handlers. 
msg.SlackBolt = {
    actions: [],
    commands: [],
    events: [],
    shortcuts: [],
    options: [],
    messages: []
};

msg.SlackBolt.actions.push(
    {
        'id': 'button_click',
        'callback':
            async ({ body, ack, say }) => {
                // Acknowledge the action
                await ack();
                return await say(`<@${body.user.id}> clicked the button2x`);

            }
    }
);

msg.SlackBolt.events.push(
    {
        'id': 'app_mention',
        'callback':
            async ({ event, context, client, say }) => {
                try {
                    const response = await say({
                        blocks: [
                            {
                                type: 'section',
                                text: {
                                    type: 'mrkdwn',
                                    text: `Thanks for the mention <@${event.user}>! Here's a button`,
                                },
                                accessory: {
                                    type: 'button',
                                    text: {
                                        type: 'plain_text',
                                        text: 'Approve me',
                                        emoji: true,
                                    },
                                    value: 'button_click',
                                    action_id: 'button_click',
                                },
                            },
                        ],
                    });
                } catch (error) {
                    console.error(error);
                }
            }
    }
);

```

## Node-Red Example

Import into your project.
see [Examples](https://github.com/fishme/node-red-contrib-slack-bolt/blob/main/examples/example.json)

https://flows.nodered.org/flow/368f36cbacfeba00b253086438f9a74d

<br /><br />

## Common Errors

`Error: An API error occurred: channel_not_found`<br />
**Solution:** Your Slack App is not installed in the channel.

`Error: An API error occurred: invalid_auth`<br />
**Solution:** Token are wrong.

## Development

### Installation

 1. clone this repo `git clone git@github.com:fishme/node-red-contrib-slack-bolt.git`
 2. This project is designed to work with `yarn`. If you don't have `yarn` installed, you can install it with `npm install -g yarn`.
 3. Install dependencies: `yarn install`.

### Dependencies

Node version >= 18.0.0

### Developing Nodes

Link your project into your local Node-Red instance. 
```shell
cd /path-to-node-red/.node-red
npm install ./path-to-this-project
```

Build & Test in Watch mode:

```shell
yarn dev
```

### Building Node Set

Create a production build:

```shell
yarn build
```

### Roadmap

Not or not full implementented

#### Knowing not critical Bugs

- Slack App: Fix Logging selection (not working)

#### Slack Features

##### Basic concepts

- Workflow [](https://slack.dev/bolt-js/concepts#creating-steps)

##### Advanced concepts

- Slack Error Handling [](https://slack.dev/bolt-js/concepts#error-handling)
- Global Middleware [](https://slack.dev/bolt-js/concepts#global-middleware)
- Authorization [](https://slack.dev/bolt-js/concepts#authorization)
- Storage [](https://slack.dev/bolt-js/concepts#conversation-store)
- Middleware [](https://slack.dev/bolt-js/concepts#global-middleware)
- Customizing a receiver [](https://slack.dev/bolt-js/concepts#receiver)
- Custom HTTP routes: [](https://slack.dev/bolt-js/concepts#custom-routes)

##### Node Features

- automatic Jest tests
- typescript typings (remove any and unknown)
- add listener node (selection of listener mode and code block)

##### Documentation

- documentation page
- node documentation (improvment)
- code documentation
- Youtube tutorials (create slack app, configuration of slack bot by each listener)
- flow examples

##### Build

- replace rollup with webpack
- github action build (bring tests back)

 
### Testing Node Set in Node-RED

[Read Node-RED docs](https://nodered.org/docs/creating-nodes/first-node#testing-your-node-in-node-red) on how to install the node set into your Node-RED runtime.

### Contact

**Issues:** [https://github.com/fishme/node-red-contrib-slack-bolt/issues](https://github.com/fishme/node-red-contrib-slack-bolt/issues)<br />
**Project Link:** [https://github.com/fishme/node-red-contrib-slack-bolt](https://github.com/fishme/node-red-contrib-slack-bolt)<br />
**Donate:** [Support the project](https://www.paypal.com/donate?hosted_button_id=JMAYYWR598V3G)

**LinkedIn:** [Go in touch with me](https://www.linkedin.com/in/david-hohl/)

### License

MIT © David Hohl

### Thank you

Alexk111 for providing the Node-Red [Typescript starter](https://github.com/alexk111/node-red-node-typescript-starter.git).
