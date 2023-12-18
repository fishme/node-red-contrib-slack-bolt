import { App } from '@slack/bolt';

import { IConfiguration } from '../modules/types';

export const views = (
  SlackApp: App,
  configuration: IConfiguration[],
  send: any,
  done: any
): number => {
  // { body, ack, say }
  configuration.forEach((item: IConfiguration) => {
    SlackApp.view(item.id, async (params) => {
      // Acknowledge the action
      const payload = await item.callback(params);
      send({ topic: item.id, payload });
      done();
    });
  });
  return configuration.length;
};
