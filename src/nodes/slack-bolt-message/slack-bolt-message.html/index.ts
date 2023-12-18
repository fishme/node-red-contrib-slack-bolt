import { EditorRED } from 'node-red';

import { SlackBoltMessageEditorNodeProperties } from './modules/types';

declare const RED: EditorRED;

RED.nodes.registerType<SlackBoltMessageEditorNodeProperties>(
  'slack-bolt-message',
  {
    category: 'slack',
    color: '#5BB381',
    defaults: {
      name: { value: '' },
      client: { type: 'slack-bolt-app', value: '' },
      channel: { value: '' },
      blocks: { value: '' },
      property: { value: '' },
      propertyType: { value: '' },
      propertySendType: { value: '' },
      text: { value: '' },

      attachments: { value: '' },
    },
    inputs: 1,
    outputs: 1,
    icon: 'font-awesome/fa-commenting-o',
    paletteLabel: 'message',
    label: function () {
      return this.name || 'message';
    },
    oneditprepare: function () {
      $('#node-input-blocks').typedInput({
        types: ['json'],
      });

      $('#node-input-attachments').typedInput({
        types: ['json'],
      });

      $('#node-input-property').typedInput({
        types: ['msg', 'flow', 'global'],
        typeField: '#node-input-propertyType',
      });

      $('#node-input-propertySendType').typedInput({
        typeField: '',
        types: [
          {
            value: 'textmode',
            options: ['blocks', 'text', 'attachments'],
          },
        ],
      });
    },
  }
);
