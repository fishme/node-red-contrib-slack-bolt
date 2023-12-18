import { App } from '@slack/bolt';

export const events = (SlackApp: App, configuration: any): number => {
  configuration.forEach((item: any) => SlackApp.event(item.id, item.callback));
  return configuration.length;
};
