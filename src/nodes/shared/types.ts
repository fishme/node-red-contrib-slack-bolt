export interface SlackBoltApp {
  credentials: SlackBoltAppCredentials;
}
export interface SlackBoltAppCredentials {
  signingSecret: string;
  token: string;
  appToken: string;
  socketMode: boolean;
  logLevel: string;
}
