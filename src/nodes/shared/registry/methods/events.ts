import { App } from '@slack/bolt';

import { IConfiguration } from '../modules/types';

export const events = (
  SlackApp: App,
  configuration: IConfiguration[]
): number => {
  configuration.forEach((item: IConfiguration) =>
    SlackApp.event(item.id, item.callback)
  );
  return configuration.length;
};
