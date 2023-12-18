import { App } from '@slack/bolt';

import { IConfiguration } from '../modules/types';

export const shortcuts = (
  SlackApp: App,
  configuration: IConfiguration[],
  send: any,
  done: any
) => {
  configuration.forEach((item: IConfiguration) => {
    SlackApp.shortcut(item.id, async (params) => {
      // Acknowledge the action
      const payload = await item.callback(params);
      send({ topic: item.id, payload });
      done();
    });
  });
  return configuration.length;
};
