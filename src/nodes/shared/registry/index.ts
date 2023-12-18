import { App } from '@slack/bolt';

import { actions } from './methods/actions';
import { commands } from './methods/commands';
import { events } from './methods/events';
import { messages } from './methods/messages';
import { options } from './methods/options';
import { shortcuts } from './methods/shortcuts';

const NONE_REGISTRATIONS = 'none registrations';
const registryMethods = (
  SlackApp: App,
  msg: any,
  send: any,
  done: any
): string => {
  const verifyMethod = (method: string) =>
    method in msg.SlackBolt && Array.isArray(msg.SlackBolt[method]);

  if ('SlackBolt' in msg) {
    const counter: any = {
      A: verifyMethod('actions')
        ? actions(SlackApp, msg.SlackBolt.actions, send, done)
        : 0,
      C: verifyMethod('commands')
        ? commands(SlackApp, msg.SlackBolt.commands, send, done)
        : 0,
      E: verifyMethod('events') ? events(SlackApp, msg.SlackBolt.events) : 0,
      M: verifyMethod('messages')
        ? messages(SlackApp, msg.SlackBolt.messages, send, done)
        : 0,
      O: verifyMethod('options')
        ? options(SlackApp, msg.SlackBolt.options, send, done)
        : 0,
      S: verifyMethod('shortcuts')
        ? shortcuts(SlackApp, msg.SlackBolt.shortcuts, send, done)
        : 0,
      V: verifyMethod('views')
        ? shortcuts(SlackApp, msg.SlackBolt.views, send, done)
        : 0,
    };
    let status: string = '';
    for (const item in counter) status += `${item}:${counter[item]}/`;

    return status;
  }
  return NONE_REGISTRATIONS;
};
export { NONE_REGISTRATIONS, registryMethods };
