.load simpleChain.js

backend.resetWorld();

let blockchain = new Blockchain();

blockchain.init()

blockchain.generateBlocks(10);

blockchain.getBlockHeight();

blockchain.validateChain();

abc = blockchain.getBlock(0);

blockchain.validateBlock(0);

