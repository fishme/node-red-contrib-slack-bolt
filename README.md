# Node-RED Slack Bolt integration

Control your Slack App via Node-Red! Slack Bolt integration.

What you can do with this node?

- send simple text messages
- send complex block messages
- events: You can listen to any [Slack Events](https://api.slack.com/events)
- actions: You can listen to user action and respond via Node-Red
- commands: Create your own commands with your Slack App and listen via Node-Red
- shortcuts: Create your own global or message based shortcuts and develop it with Node-Red

Develop your [Slack app using Bolt](https://slack.dev/bolt-js/tutorial/getting-started) for JavaScript with Node-Red.

This is an alpha version, no grarranty for productive mode!

Create Blocks by your own: https://app.slack.com/block-kit-builder (copy paste result into node-red)


# Usage


Watch step by step videos on YouTube.

## Setup Slack App



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

## License

MIT © David Hohl


## Thank you

Alexk111 https://github.com/alexk111/node-red-node-typescript-starter.git for providing the Node-Red Typescript starter

