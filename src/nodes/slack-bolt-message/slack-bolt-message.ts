import { NodeInitializer } from 'node-red';

import { App } from '@slack/bolt';

import { MessageTransporter } from '../shared/messager';
import { status } from '../shared/utils/nodeStatus';
import { SlackBoltAppNode } from '../slack-bolt-app/modules/types';
import { SlackBoltMessageNode, SlackBoltMessageNodeDef } from './modules/types';

const nodeInit: NodeInitializer = (RED): void => {
  function SlackBoltMessageNodeConstructor(
    this: SlackBoltMessageNode,
    config: SlackBoltMessageNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    const _node = this;
    this.on('input', async (msg: any, send, done) => {
      const SlackConfig: SlackBoltAppNode = <SlackBoltAppNode>(
        RED.nodes.getNode(config.client)
      );
      const SlackApp: App = SlackConfig.client;

      const Transporter: MessageTransporter = new MessageTransporter(
        _node,
        config
      );

      try {
        msg.payload = await SlackApp.client.chat.postMessage(
          Transporter.setMessage(msg)
        );

        status.success(_node, 'sent message');
      } catch (err: any) {
        this.error(err);

        status.error(_node, err.message);
      }
      send(msg);
      done();
    });
  }
  RED.nodes.registerType('slack-bolt-message', SlackBoltMessageNodeConstructor);
};

export = nodeInit;
