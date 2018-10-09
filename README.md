# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```

## Testing

To test code:

1. Open a command prompt after installing node and the required dependencies

2. Enter a Node REPL session

```
node
```

3. Load the main JS file into the REPL session

```
.load simpleChain.js
```

4. (Optional) Reset the blockchain store to remove any previous blocks from it

```
backend.resetWorld();
```

5. Instantiate a new blockchain, named blockchain, and initialize it

```
let blockchain = new Blockchain();
```

```
blockchain.init();
```

6. Generate 10 new blocks

```
blockchain.generateBlocks(10);
```

7. Validate blockchain

```
blockchain.validateChain();
```

8. Induce Errors by modifying block data

```
let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}
```

9. Validate Blockchain

```
blockchain.validateChain();
```