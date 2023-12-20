import { App, LogLevel } from '@slack/bolt';

import {
  SlackBoltAppNode,
  SlackBoltAppNodeDef,
} from '../slack-bolt-app/modules/types';

const DefaultPort: string = '3000';

const connect = (config: SlackBoltAppNodeDef): App => {
  // signingSecret needed for Auth0
  const configuration = {
    token: config.token,
    // signingSecret: config.signingSecret,
    appToken: config.appToken,
    socketMode: config.socketMode,
    logLevel: LogLevel.ERROR,
  };

  return new App(configuration);
};

const start = (node: SlackBoltAppNode, config: SlackBoltAppNodeDef) => {
  (async () => {
    await node.client.start(config.port ? config.port : DefaultPort);
    node.log('⚡️ Bolt app is running!');
  })();
};

const stop = (node: SlackBoltAppNode, config: SlackBoltAppNodeDef) => {
  (async () => {
    await node.client.stop(config.port ? config.port : DefaultPort);
    node.log('All workers closed');
    console.log('⚡️ Bolt app stopped!');
  })();
};

export const Client = {
  connect,
  start,
  stop,
};
