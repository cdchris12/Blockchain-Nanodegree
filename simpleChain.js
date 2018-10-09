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
    let Height = this.getBlockHeight(true);
    if (Height == 0) {
      this.addBlock(new Block("First block in the chain - Genesis block"));
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
      newBlock.previousBlockHash = backend.getData[newBlock.height-1].hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

    // Add block to levelDB
    backend.addData(newBlock.height, newBlock)
  }

  // Get block height
  async getBlockHeight(ret=false){
    let keys = await backend.getAllKeys()

    if (ret) {
      return keys.length
    }
    else {
      console.log(keys.length)
    };
  }

  // get block
  getBlock(blockHeight){
    // return object as a single string
    return JSON.parse(JSON.stringify(backend.getData(blockHeight)));
  }

  // validate block
  validateBlock(blockHeight){
    // get block object
    let block = backend.getData(blockHeight);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash===validBlockHash) {
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
      if (!this.validateBlock(i))errorLog.push(i);
      // compare blocks hash link
      let blockHash = backend.getData[i].hash;
      let previousHash = backend.getData[i+1].previousBlockHash;
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
