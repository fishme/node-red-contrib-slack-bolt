import { EditorRED } from 'node-red';

import { SlackBoltAppEditorNodeProperties } from './modules/types';

declare const RED: EditorRED;

RED.nodes.registerType<SlackBoltAppEditorNodeProperties>('slack-bolt-app', {
  category: 'config',
  defaults: {
    name: { value: '' },
    token: { value: '', required: true },
    signingSecret: { value: '' },
    logLevel: { value: '' },
    socketMode: { value: true },
    port: { value: 3000 },
    appToken: { value: '' },
  },
  label: function () {
    return this.name || 'Slack Bolt app';
  },
  oneditprepare: function () {
    $('#node-input-logLevel').typedInput({
      typeField: '',
      types: [
        {
          value: 'logmode',
          options: ['error', 'warn', 'info', 'debug'],
        },
      ],
    });
  },
});
