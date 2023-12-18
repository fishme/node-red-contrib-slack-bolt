/**
 * collection of node status
 * original code by https://github.com/dfulgham
 * by https://github.com/dfulgham/node-red-contrib-zeebe under MIT
 *
 */
import { Node } from 'node-red';

export const status = {
  error: (node: Node, text: string): void => {
    node.status({
      fill: 'red',
      shape: 'dot',
      text: formatMsg(text),
    });
  },

  success: (node: Node, text: string): void => {
    node.status({
      fill: 'green',
      shape: 'dot',
      text,
    });
  },

  warning: (node: Node, text: string): void => {
    node.status({
      fill: 'yellow',
      shape: 'dot',
      text,
    });
  },

  clear: function (node: Node) {
    node.status({});
  },
};

function formatMsg(errorMsg: string): string {
  errorMsg = errorMsg || 'Unknown Error';
  let result = errorMsg.split(':')[0];
  if (result.length > 30) {
    result = result.substring(0, 30) + '...';
  }
  return result;
}
