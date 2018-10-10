/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');


backend = require('./levelSandbox');

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    // We can easily check for a genesis block by checking the BlockHeight.
    // If it is >0, we can safely assume there is a genesis block.
  }

  // Initialize a new Blockchain object
  async init(){
    let Height = await this.getBlockHeight(true);
    if (Height == 0) {
      this.addBlock(new Block("First block in the chain - Genesis block"));
    } else {
      console.log(Height);
    }
  }

  // Add new block
  async addBlock(newBlock){
    let Height = await this.getBlockHeight(true);

    // Block height
    newBlock.height = Height;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(newBlock.height>0){
      newBlock.previousBlockHash = await this.getBlock(newBlock.height -1).hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

    // Add block to levelDB
    //console.log(newBlock)
    await backend.addData(newBlock.height, JSON.stringify(newBlock))
  }

  // Get block height
  async getBlockHeight(ret=false){
    let keys = await backend.getAllKeys();

    if (ret) {
      return keys.length;
    }
    else {
      console.log(keys.length);
    };
  }

  async getChain(ret=false){
    let obj = await backend.getAllData();
    console.log( 'The chain currently contains: \n\n');
    console.log(obj);

    //TODO
    // Print out the blocks, and their data, in order?
  }

  // get block
  async getBlock(blockHeight){
    // return object as a single string
    //console.log(blockHeight);
    let value = await backend.getData(blockHeight);
    //console.log(value)
    return JSON.parse(value);
  }

  async generateBlocks(num) {
    for (var i = 0; i <= 10; i++) {
      await this.addBlock(new Block("test data " + i));
    }
  }

  async modifyBlocks(arr=[2,4,7]){
    for (var i = 0; i < arr.length; i++) {
      let oldBlock = await this.getBlock(arr[i]);
      oldBlock.data = 'induced chain error';
      await backend.rmData(arr[i]);
      await backend.addData(arr[i], JSON.stringify(oldBlock));
    }
  }

  // validate block
  async validateBlock(blockHeight){
    // get block object
    let block = await this.getBlock(blockHeight);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash===validBlockHash) {
        console.log('Block #' + blockHeight + ' is valid!');
        return true;
      } else {
        console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
        return false;
      }
  }

 // Validate blockchain
  async validateChain(){
    let Height = await this.getBlockHeight(true)

    let errorLog = [];
    for (var i = 0; i < Height-1; i++) {
      // validate block
      if (! await this.validateBlock(i))errorLog.push(i);
      // compare blocks hash link
      let blockHash = await this.getBlock(i).hash;
      let previousHash = await this.getBlock(i+1).previousBlockHash;
      if (blockHash!==previousHash) {
        errorLog.push(i);
      }
    }
    if (errorLog.length>0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: '+errorLog);
    } else {
      console.log('No errors detected');
    }
  }
}
