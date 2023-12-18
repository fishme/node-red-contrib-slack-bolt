import { NodeInitializer } from 'node-red';

import { Client } from '../shared/client';
import { SlackBoltAppNode, SlackBoltAppNodeDef } from './modules/types';

const nodeInit: NodeInitializer = (RED) => {
  function SlackBoltAppNodeConstructor(
    this: SlackBoltAppNode,
    config: SlackBoltAppNodeDef
  ) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.client = Client.connect(config);
    Client.start(node, config);

    node.on('close', (done: any) => {
      Client.stop(node, config);

      done();
    });
  }

  RED.nodes.registerType('slack-bolt-app', SlackBoltAppNodeConstructor);
};

export = nodeInit;
