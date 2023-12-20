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

    try {
      node.client = Client.connect(config);
      if (node.client) {
        Client.start(node, config);
      }
    } catch (err) {
      node.error(node.error);
    }

    node.on('close', (done: any) => {
      Client.stop(node, config);

      done();
    });
  }

  RED.nodes.registerType('slack-bolt-app', SlackBoltAppNodeConstructor);
};

export = nodeInit;
