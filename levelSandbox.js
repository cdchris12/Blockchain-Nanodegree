/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addData(key,value){
  db.put(key, value, function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  })
};

// Get data from levelDB with key
function getData(key){
  db.get(key, function(err, value) {
    if (err) return console.log('Not found!', err);
    console.log('Value = ' + value);
  })
};

// Clear all data in levelDB
function resetWorld() {
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
function makeSampleData(j=10) {
  for (var i=0; i<j; i++) {    
    console.log('Block #' + i);
    addData(i, new Date().getTime().toString());
  }
  console.log('Finished generating test data!!');
};

function getAllKeys(value) {
  let dataArray = []
  let new_data = []
  let keystream = new Promise(function(resolve, reject){
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

  keystream.then(function(data){
    console.log( 'The db currently contains: \n\n');
    console.log(data);
    new_data = JSON.parse(JSON.stringify(data));
  });

  return new_data;
};

function getAllData(value) {
  let obj = {}
  let datastream = new Promise(function(resolve, reject){
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

  datastream.then(function(obj){
    console.log( 'The db currently contains: \n\n');
    console.log(obj);
    return obj;
  });
};
// End testing data block

// Setup functions that should be exported
module.exports = { addData, getData, resetWorld, makeSampleData, getAllKeys, getAllData }

/*
// Add data to levelDB with value
function addDataToLevelDB(value) {
    db.createReadStream()
      .on('data', function(data) {
        i++;
      }).on('error', function(err) {
        return console.log('Unable to read data stream!', err)
      }).on('close', function() {
        console.log('Block #' + i);
        addData(i, new Date().getTime().toString());
      });
}
*/

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

/*
(function theLoop (i) {
  setTimeout(function () {
    addDataToLevelDB('Testing data');
    if (--i) theLoop(i);
  }, 100);
})(10);*/