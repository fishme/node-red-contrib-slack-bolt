# Node-RED Slack Bolt Integration

Control your Slack App via Node-Red! Slack Bolt integration.

What you can do with this node?

- send simple text messages
- send complex block messages
- events: You can listen to any [Slack Events](https://api.slack.com/events)
- actions: You can listen to user action and respond via Node-Red
- commands: Create your own commands with your Slack App and listen via Node-Red
- shortcuts: Create your own global or message based shortcuts and develop it with Node-Red
- views: Slack views
- messages: Listing for messages in a channel

Develop your [Slack app using Bolt](https://slack.dev/bolt-js/tutorial/getting-started) for JavaScript with Node-Red.

``This is an alpha version, no grarranty for productive mode!``

# Usage


## Setup Slack App

- open [Slack](https://api.slack.com/apps?new_app=1)
- [create new Slack App](https://api.slack.com/apps?new_app=1)
- Choose "from an app manifest"
- Choose your workspace
- Copy from /docs/Slack/manifest.yml or manifest below
- Paste into YAML section
- create app

Follow the Node-RED Slack App Configuration. 

<details><summary>Slack Manifest</summary>

```
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

## Node-RED Installation

open your folder via favourite shell

`npm i @headless-architecture/node-red-contrib-slack-bolt`

## Node-Red Configuration


After sucessfull installation of `@headless-architecture/node-red-contrib-slack-bolt` search in your Node-RED toolbar for `slack`

![Slack Bolt Nodes](https://raw.githubusercontent.com/fishme/node-red-contrib-slack-bolt/main/docs/img/node-red-slackbolt-nodes.png)

### Nodes
- message: send text and block messages
- registry: registration of slack actions, events, commands, messages, options, shortcuts and views

**Slack App Configuration**

![Slack App Configuration](https://raw.githubusercontent.com/fishme/node-red-contrib-slack-bolt/main/docs/img/slack-app-config.png)

| Name | Description |
| --- | --- |
| Bot Token *required* | Active Communciation Token OAuth/Permissions -> Bot User OAuth Token [your Slack App](https://api.slack.com/apps/) |
| Log Level | Slack log levels [more info](https://slack.dev/bolt-js/concepts#logging) |
| Socket | activate the socket mode, if you want to listen for changes in your channel. It is required for the registry nodes. |
| Port | default is 3000 [more info](https://slack.dev/bolt-js/concepts#socket-mode) |
| App Token | Basic information -> App-level-Token -> create new -> choose connections:write [slack app](https://api.slack.com/apps/) |

**Message**
With this node, Node-RED is able to send direct messages into a channel. Private message to a person is not possible (yet).

![Slack Message](https://raw.githubusercontent.com/fishme/node-red-contrib-slack-bolt/main/docs/img/message-config.png)

 Name | Description |
| --- | --- |
| Slack App | see Slack App Configuration above |
| Channel | slack channel, starts always with a hash (e.g. #main)  |
| Property | variable of the content for a message |
| Topic | text or block message  |
| Text | direct message (overwrite input stream)  |
| Blocks | JSON format, complext messages with interactions  |
<br />
<details><summary><b>Block Example</b></summary>
Simple Block for choosing a date

```
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

**Registry**

This node enalbe the following Slack functions.

- Actions
- Events
- Views
- Messages (listener, sending of messages see message node)
- Options
- Shortcuts
- Commands

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
e.g. Your App name @Node-Red-demo-app 

```
// write in your slack channel 
@Node-Red-demo-app What's up?
```
Slack will answer you with a button and if your press on the button the action will be exected with a short answer back.

![Active Communication](https://raw.githubusercontent.com/fishme/node-red-contrib-slack-bolt/main/docs/img/node-registry-example1.png)

```

// use the object to initialize your handlers. 
// if you don't need all, clean it. 
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




# Node-Red Example
copy paste into your
see `/examples/example.json`

<details><summary><b>Example</b></summary>
[Slack Bolt Integration](https://flows.nodered.org/flow/368f36cbacfeba00b253086438f9a74d)
</details>
<br /><br />

# Development

## Installation
 1. clone this repo `git clone git@github.com:fishme/node-red-contrib-slack-bolt.git`
 2. This project is designed to work with `yarn`. If you don't have `yarn` installed, you can install it with `npm install -g yarn`.
 3. Install dependencies: `yarn install`.

## Dependencies

Node version >= 18.0.0

## Developing Nodes

Build & Test in Watch mode:

```
yarn dev
```

## Building Node Set

Create a production build:

```
yarn build
```

## Testing Node Set in Node-RED

[Read Node-RED docs](https://nodered.org/docs/creating-nodes/first-node#testing-your-node-in-node-red) on how to install the node set into your Node-RED runtime.

## Common Errors

`Error: An API error occurred: channel_not_found`
**Solution:** Your Slack App is not installed in the channel.

`Error: An API error occurred: invalid_auth`
**Solution:** Token are wrong.

## Contact

**Issues:** [https://github.com/fishme/node-red-contrib-slack-bolt/issues](https://github.com/fishme/node-red-contrib-slack-bolt/issues)<br />
**Project Link:** [https://github.com/fishme/node-red-contrib-slack-bolt](https://github.com/fishme/node-red-contrib-slack-bolt)<br />
**Donate:** [Support the project](https://www.paypal.com/donate?hosted_button_id=JMAYYWR598V3G)

**LinkedIn:** [Go in touch with me](https://www.linkedin.com/in/david-hohl/)

## License

MIT © David Hohl


## Thank you

Alexk111 https://github.com/alexk111/node-red-node-typescript-starter.git for providing the Node-Red Typescript starter

