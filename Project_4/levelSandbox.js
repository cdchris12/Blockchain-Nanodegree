const level = require('level')
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addData(key,value){
  return db.put(key, value)
};

// Get data from levelDB with key
function getData(key){
  return db.get(key)
};

// Remove specific key from leveDB
function rmData(key){
  return db.del(key)
};

// Clear all data in levelDB
async function resetWorld() {
  getAllKeys().then(function(keys){
    for (var key in keys) {
      console.log('Removing block #' + key);
      db.del(key, function(err) {
        if (err) return console.log('Block ' + key + ' deletion failed', err);
      });
    }
    if (keys.length == 0) console.log('The chain has no nodes!')
  });
};

// Generate test data
async function makeSampleData(j=10) {
  for (var i=0; i<j; i++) {    
    console.log('Block #' + i);
    await addData(i, new Date().getTime().toString());
  }
  console.log('Finished generating test data!!');
  return
};

function getAllKeys(value) {
  let dataArray = []
  return new Promise(function(resolve, reject){
    db.createReadStream()
      .on('data', function (data) {
        dataArray.push(data.key)
      })
      .on('error', function (err) {
        reject(err)
      })
      .on('close', function () {
        resolve(dataArray);
      });
  });
};

function getDataByHash(hash) {
  let block = null;
  return new Promise(function(resolve, reject){
      db.createReadStream()
      .on('data', function (data) {
          if(JSON.parse(data).hash === hash){
              block = data;
          };
      })
      .on('error', function (err) {
          reject(err)
      })
      .on('close', function () {
          resolve(block);
      });
  });
}

function getDataByWalletAddress(address) {
  let dataArray = []
  return new Promise(function(resolve, reject){
      db.createReadStream()
      .on('data', function (data) {
          if(JSON.parse(data).body.address === address){
              dataArray.push(data.key)
          };
      })
      .on('error', function (err) {
          reject(err)
      })
      .on('close', function () {
          resolve(dataArray);
      });
  });
}

function getAllData(value) {
  let obj = {}
  return new Promise(function(resolve, reject){
    db.createReadStream()
      .on('data', function (data) {
        obj[data.key] = data.value;
      })
      .on('error', function (err) {
        reject(err)
      })
      .on('close', function () {
        resolve(obj);
      });
  });
};
// End testing data block

// Setup functions that should be exported
module.exports = { addData, getData, rmData, resetWorld, makeSampleData, getAllKeys, getAllData, getDataByHash, getDataByWalletAddress }
