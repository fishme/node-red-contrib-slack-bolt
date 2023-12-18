import { Node, NodeDef } from 'node-red';

import { App, LogLevel } from '@slack/bolt';

import { SlackBoltAppOptions } from '../shared/types';

export interface SlackBoltAppNodeDef extends NodeDef, SlackBoltAppOptions {
  token: string;
  signingSecret: string;
  socketMode: boolean;
  port: number;
  appToken: string;
  logLevel: LogLevel;
}

export interface SlackBoltAppNode extends Node {
  client: App;
}
//export type SlackBoltAppNode = Node;
