import { Node, NodeDef } from 'node-red';

import { SlackBoltMessageOptions } from '../shared/types';

export interface SlackBoltMessageNodeDef
  extends NodeDef,
    SlackBoltMessageOptions {
  channel: string;
  client: string;
}

// export interface SlackBoltMessageNode extends Node {}
export type SlackBoltMessageNode = Node;
