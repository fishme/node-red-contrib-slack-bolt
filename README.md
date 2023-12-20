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
`[{"id":"1fd29692524d1ecb","type":"tab","label":"Gateway","disabled":false,"info":"","env":[]},{"id":"9abaac9bbddc9bce","type":"group","z":"1fd29692524d1ecb","name":"","style":{"fill":"#bfc7d7","label":true},"nodes":["66d82a9b2adba28f","a1af82db52869929","2c5427b594cdc27d","b4ccc9f550d6192e","96f668735a340977","0be1a3a745d4345b","a8f863a194453f25","3701e2672d1605c0","ada60a61dc4363ca","abd1fa9196265fd6","e1bae9dec89865d5","222f70122d1d13d3","85f483cbc0729943","9326c16c34564ce9","509fc660e5a7454f","b9b5a6a13cde4552"],"x":134,"y":199,"w":1372,"h":682},{"id":"a1af82db52869929","type":"function","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"Events","func":"msg.SlackBolt = {\n    actions: [],\n    commands: [],\n    events: [],\n    shortcuts: [],\n    options: [],\n    messages: []\n};\nmsg.SlackBolt.actions.push(\n    {\n        'id': 'button_click',\n        'callback':\n            async ({ body, ack, say }) => {\n                // Acknowledge the action\n                await ack();\n                return await say(`<@${body.user.id}> clicked the button2x`);\n\n            }\n    }\n);\n\n\n\nmsg.SlackBolt.commands.push(\n    {\n        'id': '/node-red',\n        'callback':\n            async ({ command, ack, respond }) => {\n                // Acknowledge command request\n                await ack();\n\n                await respond(`${command.text}`);\n            }\n    }\n);\n\n\n\nmsg.SlackBolt.shortcuts.push({\n    'id': 'need_drink',\n    'callback':\n        async ({ shortcut, ack, client, logger }) => {\n            // Acknowledge shortcut request\n            await ack();\n\n            // Call the views.open method using one of the built-in WebClients\n            const result = await client.views.open({\n                trigger_id: shortcut.trigger_id,\n                view: {\n                    type: \"modal\",\n                    title: {\n                        type: \"plain_text\",\n                        text: \"My Node-Red Demo App\"\n                    },\n                    blocks: [\n                        {\n                            \"type\": \"section\",\n                            \"text\": {\n                                \"type\": \"mrkdwn\",\n                                \"text\": \"You have a new request:\\n*<fakeLink.toEmployeeProfile.com|Fred Enriquez - New device request>*\"\n                            }\n                        },\n                        {\n                            \"type\": \"section\",\n                            \"fields\": [\n                                {\n                                    \"type\": \"mrkdwn\",\n                                    \"text\": \"*Type:*\\nComputer (laptop)\"\n                                },\n                                {\n                                    \"type\": \"mrkdwn\",\n                                    \"text\": \"*When:*\\nSubmitted Aut 10\"\n                                },\n                                {\n                                    \"type\": \"mrkdwn\",\n                                    \"text\": \"*Last Update:*\\nMar 10, 2015 (3 years, 5 months)\"\n                                },\n                                {\n                                    \"type\": \"mrkdwn\",\n                                    \"text\": \"*Reason:*\\nAll vowel keys aren't working.\"\n                                },\n                                {\n                                    \"type\": \"mrkdwn\",\n                                    \"text\": \"*Specs:*\\n\\\"Cheetah Pro 15\\\" - Fast, really fast\\\"\"\n                                }\n                            ]\n                        },\n                        {\n                            \"type\": \"actions\",\n                            \"elements\": [\n                                {\n                                    \"type\": \"button\",\n                                    \"text\": {\n                                        \"type\": \"plain_text\",\n                                        \"emoji\": true,\n                                        \"text\": \"Approve\"\n                                    },\n                                    \"style\": \"primary\",\n                                    \"value\": \"drink_approve\"\n                                },\n                                {\n                                    \"type\": \"button\",\n                                    \"text\": {\n                                        \"type\": \"plain_text\",\n                                        \"emoji\": true,\n                                        \"text\": \"Deny\"\n                                    },\n                                    \"style\": \"danger\",\n                                    \"value\": \"drink_deny\"\n                                }\n                            ]\n                        }\n                    ]\n                }\n            });\n\n        }\n\n})\n\nmsg.SlackBolt.shortcuts.push({\n    'id': 'open_modal',\n    'callback':\n        async ({ shortcut, ack, client, logger }) => {\n            // Acknowledge shortcut request\n            await ack();\n\n            // Call the views.open method using one of the built-in WebClients\n            const result = await client.views.open({\n                trigger_id: shortcut.trigger_id,\n                view: {\n                    type: \"modal\",\n                    title: {\n                        type: \"plain_text\",\n                        text: \"My Node-Red Demo App\"\n                    },\n                    close: {\n                        type: \"plain_text\",\n                        text: \"Close\"\n                    },\n                    blocks: [\n                        {\n                            type: \"section\",\n                            text: {\n                                type: \"mrkdwn\",\n                                text: \"About the simplest modal you could conceive of :smile:\\n\\nMaybe <https://api.slack.com/reference/block-kit/interactive-components|*make the modal interactive*> or <https://api.slack.com/surfaces/modals/using#modifying|*learn more advanced modal use cases*>.\"\n                            }\n                        },\n                        {\n                            type: \"context\",\n                            elements: [\n                                {\n                                    type: \"mrkdwn\",\n                                    text: \"Psssst this modal was designed using <https://api.slack.com/tools/block-kit-builder|*Block Kit Builder*>\"\n                                }\n                            ]\n                        }\n                    ]\n                }\n            });\n\n        }\n\n})\n\n\nreturn msg;","outputs":1,"timeout":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":610,"y":620,"wires":[["a8f863a194453f25"]]},{"id":"66d82a9b2adba28f","type":"inject","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"Register Slack Actions and Events (once)","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":true,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":340,"y":620,"wires":[["a1af82db52869929"]]},{"id":"2c5427b594cdc27d","type":"debug","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"debug 3","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":1400,"y":600,"wires":[]},{"id":"b4ccc9f550d6192e","type":"switch","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"listener","property":"topic","propertyType":"msg","rules":[{"t":"eq","v":"button_click","vt":"str"},{"t":"else"}],"checkall":"true","repair":false,"outputs":2,"x":1160,"y":700,"wires":[["2c5427b594cdc27d"],["96f668735a340977"]]},{"id":"96f668735a340977","type":"debug","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"debug 4","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":1400,"y":780,"wires":[]},{"id":"0be1a3a745d4345b","type":"slack-bolt-registry","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"Slack Registration","client":"a2eb2e51b1167936","x":810,"y":700,"wires":[["b4ccc9f550d6192e"]]},{"id":"a8f863a194453f25","type":"function","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"Events","func":"\n\nmsg.SlackBolt.events.push(\n    {\n        'id': 'app_mention',\n        'callback':\n            async ({ event, context, client, say }) => {\n                try {\n                    const response = await say({\n                        blocks: [\n                            {\n                                type: 'section',\n                                text: {\n                                    type: 'mrkdwn',\n                                    text: `Thanks for the mention <@${event.user}>! Here's a button`,\n                                },\n                                accessory: {\n                                    type: 'button',\n                                    text: {\n                                        type: 'plain_text',\n                                        text: 'Approve me',\n                                        emoji: true,\n                                    },\n                                    value: 'button_click',\n                                    action_id: 'button_click',\n                                },\n                            },\n                        ],\n                    });\n                } catch (error) {\n                    console.error(error);\n                }\n            }\n    }\n);\n\n\n\nmsg.SlackBolt.actions.push(\n    {\n        'id': 'button_click',\n        'callback':\n            async ({ body, ack, say }) => {\n                // Acknowledge the action\n                await ack();\n                return await say(`<@${body.user.id}> clicked the button`);\n\n            }\n    }\n);\n\n\n\n\nreturn msg;","outputs":1,"timeout":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":610,"y":700,"wires":[["0be1a3a745d4345b"]]},{"id":"3701e2672d1605c0","type":"inject","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"Text via payload","props":[{"p":"payload"},{"p":"topic","vt":"str"},{"p":"xxxx","v":" test23","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"Hello World!12","payloadType":"str","x":340,"y":400,"wires":[["9326c16c34564ce9"]]},{"id":"ada60a61dc4363ca","type":"debug","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"debug 1","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":1160,"y":440,"wires":[]},{"id":"abd1fa9196265fd6","type":"inject","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"Block Message","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"blocks","payload":"[{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"Pick a date for me to remind you\"},\"accessory\":{\"type\":\"datepicker\",\"action_id\":\"datepicker_remind\",\"initial_date\":\"2019-04-28\",\"placeholder\":{\"type\":\"plain_text\",\"text\":\"Select a date\"}}}]","payloadType":"json","x":340,"y":500,"wires":[["9326c16c34564ce9"]]},{"id":"e1bae9dec89865d5","type":"inject","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"load via context","props":[{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":340,"y":300,"wires":[["222f70122d1d13d3"]]},{"id":"222f70122d1d13d3","type":"change","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"","rules":[{"t":"set","p":"slackFlowMessage","pt":"flow","to":"send a good flow message","tot":"str"},{"t":"set","p":"slackGlobalMessage","pt":"global","to":"send a good global message","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":680,"y":300,"wires":[["9326c16c34564ce9"]]},{"id":"85f483cbc0729943","type":"comment","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"flow.slackFlowMessage and global.slackGlobalMessage","info":"","x":830,"y":240,"wires":[]},{"id":"9326c16c34564ce9","type":"slack-bolt-message","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"","client":"a2eb2e51b1167936","channel":"#main","blocks":"","property":"payload","propertyType":"msg","propertySendType":"text","text":"","attachments":"","x":840,"y":460,"wires":[["ada60a61dc4363ca"]]},{"id":"509fc660e5a7454f","type":"catch","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"","scope":"group","uncaught":false,"x":270,"y":840,"wires":[["b9b5a6a13cde4552"]]},{"id":"b9b5a6a13cde4552","type":"debug","z":"1fd29692524d1ecb","g":"9abaac9bbddc9bce","name":"Group Error - Slack Bolt","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":530,"y":840,"wires":[]},{"id":"a2eb2e51b1167936","type":"slack-bolt-app","name":"Demo-app","token":"xoxb-6273178474546-6296269126880-ECspr3jlq6Hk6QdxtvuvJBsy","signingSecret":"799dfcf596754ed8a6692c5dc1e7e7d4","socketMode":true,"port":"3000","appToken":"xapp-1-A06814CKD51-6366200613638-e1cf3e87beb6956b5c5e9d8ed9e8421da4b42e4fbe5a6ab9493e6c553b26052a"}]
```
</details>
<br /><br />

# Development

## Installation
 1. clone this repo `git clone git@github.com:fishme/node-red-contrib-slack-bolt.git`
 2. This project is designed to work with `yarn`. If you don't have `yarn` installed, you can install it with `npm install -g yarn`.
 3. Install dependencies: `yarn install`.

## Dependencies

Node version > 18

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

