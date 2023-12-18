import { NodeInitializer, NodeMessage } from 'node-red';

import { NONE_REGISTRATIONS, registryMethods } from '../shared/registry';
import { status } from '../shared/utils/nodeStatus';
import { SlackBoltAppNode } from '../slack-bolt-app/modules/types';
import {
  SlackBoltRegistryNode,
  SlackBoltRegistryNodeDef,
} from './modules/types';

const nodeInit: NodeInitializer = (RED): void => {
  function SlackBoltRegistryNodeConstructor(
    this: SlackBoltRegistryNode,
    config: SlackBoltRegistryNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.on('input', (msg: NodeMessage, send, done) => {
      const SlackConfig: SlackBoltAppNode = <SlackBoltAppNode>(
        RED.nodes.getNode(config.client)
      );

      const registrations: string = registryMethods(
        SlackConfig.client,
        msg,
        send,
        done
      );
      if (registrations !== NONE_REGISTRATIONS) {
        status.success(this, registrations);
      } else {
        status.warning(this, NONE_REGISTRATIONS);
      }
    });
  }

  RED.nodes.registerType(
    'slack-bolt-registry',
    SlackBoltRegistryNodeConstructor
  );
};

export = nodeInit;
