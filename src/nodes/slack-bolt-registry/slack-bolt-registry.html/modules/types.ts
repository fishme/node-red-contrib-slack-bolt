import { EditorNodeProperties } from 'node-red';

import { SlackBoltRegistryOptions } from '../../shared/types';

export interface SlackBoltRegistryEditorNodeProperties
  extends EditorNodeProperties,
    SlackBoltRegistryOptions {
  client: string;
}
