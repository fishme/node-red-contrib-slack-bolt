import { Node, NodeDef } from 'node-red';

import { SlackBoltRegistryOptions } from '../shared/types';

export interface SlackBoltRegistryNodeDef
  extends NodeDef,
    SlackBoltRegistryOptions {
  client: string;
}

// export interface SlackBoltRegistryNode extends Node {}
export type SlackBoltRegistryNode = Node;
