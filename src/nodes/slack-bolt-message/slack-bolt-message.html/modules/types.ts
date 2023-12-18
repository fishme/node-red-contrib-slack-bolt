import { EditorNodeProperties } from 'node-red';

import { SlackBoltMessageOptions } from '../../shared/types';

export interface SlackBoltMessageEditorNodeProperties
  extends EditorNodeProperties,
    SlackBoltMessageOptions {
  text: string;
  client: any;
  blocks: string;
  property: string;
  propertyType: string;
  propertySendType: string;
  attachments: string;
  channel: string;
}
