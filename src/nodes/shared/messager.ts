import {
  SlackBoltMessageNode,
  SlackBoltMessageNodeDef,
} from '../slack-bolt-message/modules/types';

export class MessageTransporter {
  public nodeSetting: SlackBoltMessageNodeDef;

  public node: SlackBoltMessageNode;
  constructor(
    node: SlackBoltMessageNode,
    nodeSetting: SlackBoltMessageNodeDef
  ) {
    this.node = node;

    this.nodeSetting = nodeSetting;
  }

  setMessage = (msg: any) => {
    const message: any = {
      channel: this.nodeSetting.channel,
    };

    if (this.nodeSetting.property) {
      // use msg,flow,global context
      if (this.nodeSetting.propertySendType === 'text') {
        message.text = this.getByProperty(msg);
      } else if (this.nodeSetting.propertySendType === 'blocks') {
        message.blocks = this.getByProperty(msg);
      } else if (this.nodeSetting.propertySendType === 'attachments') {
        // missing
      }
    }

    // text, block, attachements will overwrite existing settings
    if (this.nodeSetting.text) {
      message.text = this.nodeSetting.text.toString();
    }
    if (this.nodeSetting.blocks) {
      message.blocks = this.nodeSetting.blocks;
    }
    return message;
  };

  getByProperty = (msg: any) => {
    let value: unknown;

    switch (this.nodeSetting.propertyType) {
      case 'msg':
        value = msg[this.nodeSetting.property];
        break;
      case 'flow':
        value = this.node.context().flow.get(this.nodeSetting.property);
        break;
      case 'global':
        value = this.node.context().global.get(this.nodeSetting.property);
        break;
    }

    return value;
  };
}
