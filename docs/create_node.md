
## Project Structure

```
node-red-contrib-slack-bolt/
 ├──src/                             * source files of the node set
 │   ├──__tests__/                   * tests for the node set (test file names should match *.test.ts glob pattern)
 │   │   └──transform-text.test.ts   * tests for the transform-text node
 │   │
 │   └──nodes/                       * node set folder, where subfolder names = node types
 │       ├──shared/                  * folder for .ts files shared across multiple nodes in the node set
 │       │
 │       └──transform-text/          * source files of the transform-text node
 │           ├──icons/               * custom icons used by the node set in the editor
 │           │
 │           ├──modules/             * .ts modules for the runtime side (transform-text.js file) of the node
 │           │
 │           ├──shared/              * folder for .ts files shared between the runtime side (.js file) and the editor side (.html file) of the node
 │           │
 │           ├──transform-text.html/ * files for compiling and bundling into the editor side (transform-text.html file) of the node
 │           │   ├──modules/         * .ts modules
 │           │   ├──editor.html      * html template for the edit dialog
 │           │   ├──help.html        * html template for the help in the info tab
 │           │   └──index.ts         * entry file
 │           │
 |           └──transform-text.ts    * entry file for the runtime side (transform-text.js file) of the node
 |
 ├──package.json                     * dependencies and node types for the Node-RED runtime to load
 |
 ├──rollup.config.editor.json        * rollup config for building the editor side of the nodes
 |
 ├──tsconfig.json                    * base typescript config, for the code editor
 ├──tsconfig.runtime.json            * config for creating a production build of the runtime side of the nodes
 └──tsconfig.runtime.watch.json      * config for watching and incremental building the runtime side of the nodes
```

## Getting Started

1. This project is designed to work with `yarn`. If you don't have `yarn` installed, you can install it with `npm install -g yarn`.
2. Install dependencies: `yarn install`.

## Adding Nodes

You can quickly scaffold a new node and add it to the node set. Use the following command to create `my-new-node-type` node:

```
yarn add-node my-new-node-type
```

The node generator is based on mustache templates. At the moment there are three templates available:

- `blank` (used by default) - basic node for Node-RED >=1.0
- `blank-0` - node with a backward compatibility for running on Node-RED <1.0
- `config` - configuration node

To generate a node using a template, specify it as the third argument:

```
yarn add-node my-new-node-type blank
```

or

```
yarn add-node my-new-node-config config
```

### Adding Node Templates

If you want to make your own template available, add it to `./utils/templates/`.