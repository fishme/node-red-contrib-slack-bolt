import { App } from '@slack/bolt';

import { IConfiguration } from '../modules/types';

export const actions = (
  SlackApp: App,
  configuration: IConfiguration[],
  send: any,
  done: any
): number => {
  // { body, ack, say }
  configuration.forEach((item: IConfiguration) => {
    SlackApp.action(item.id, async (params) => {
      // Acknowledge the action
      const payload = await item.callback(params);
      send({ topic: item.id, payload });
      done();
    });
  });
  return configuration.length;
};
