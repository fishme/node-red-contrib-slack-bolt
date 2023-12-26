import { EditorRED } from 'node-red';

import { SlackBoltRegistryEditorNodeProperties } from './modules/types';

declare const RED: EditorRED;

RED.nodes.registerType<SlackBoltRegistryEditorNodeProperties>(
  'slack-bolt-registry',
  {
    category: 'Slack',
    color: '#5BB381',
    defaults: {
      name: { value: '' },
      client: { type: 'slack-bolt-app', value: '' },
    },
    inputs: 1,
    outputs: 1,
    icon: 'font-awesome/fa-commenting-o',
    paletteLabel: 'registry',
    label: function () {
      return this.name || 'registry';
    },
  }
);
