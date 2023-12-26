import { EditorNodeProperties } from 'node-red';

import { SlackBoltAppOptions } from '../../shared/types';

export interface SlackBoltAppEditorNodeProperties
  extends EditorNodeProperties,
    SlackBoltAppOptions {
  token: string;
  signingSecret: string;
  socketMode: boolean;

  port: number;
  appToken: string;
  logLevel: string;
}
