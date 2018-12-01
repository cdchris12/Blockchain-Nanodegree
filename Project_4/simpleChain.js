const SHA256 = require('crypto-js/sha256');

backend = require('./levelSandbox');

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

class Blockchain{
  constructor(){
    // This class is empty because this object cannot be constructed asyncronously. 
    // We must construct it, _then_ initialize it.
  }

  // Initialize a new Blockchain object
  async init(){
    let Height = await this.getBlockHeight(true);
    if (Height < 0) {
      await this.addBlock(new Block("First block in the chain - Genesis block"));
    } else {
      null
      //console.log(Height);
    }
  }

  // Add new block
  async addBlock(newBlock){
    let Height = await this.getBlockHeight(true);

    // Block height
    newBlock.height = Height+1;
    // UTC timestamp
    newBlock.time = Math.floor(new Date() / 1000)
    // previous block hash
    if(newBlock.height>0){
      let tmpBlock = await this.getBlock(newBlock.height -1);
      newBlock.previousBlockHash = tmpBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

    // Add block to levelDB
    //console.log(newBlock)
    await backend.addData(newBlock.height, JSON.stringify(newBlock))
    return JSON.stringify(newBlock);
  }

  // Get block height
  async getBlockHeight(ret=true){
    let val = 0;
    let keys = await backend.getAllKeys();
    val = keys.length-1;

    if (ret) {
      return val;
    } else {
      console.log(val);
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
    // return object as a JSON blob
    let value = await backend.getData(blockHeight);
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
    for (var i = 0; i < Height; i++) {
      // validate block
      if (! await this.validateBlock(i)) errorLog.push(i);

      // compare blocks hash links
      let tmpBlock = await this.getBlock(i);
      let blockHash = tmpBlock.hash;
      let tmpBlock2 = await this.getBlock(i+1);
      let previousHash = tmpBlock2.previousBlockHash;
      if (blockHash!==previousHash) {
        errorLog.push(i);
      }
    }

    // Cover testing the last block in the chain
    if (! await this.validateBlock(Height)) errorLog.push(Height);

    // Print out the error log
    if (errorLog.length>0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: '+errorLog);
    } else {
      console.log('No errors detected');
    }
  }
}

module.exports = { Blockchain, Block }

