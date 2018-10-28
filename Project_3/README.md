# Description

This project implements a simple blockchain, written in NodeJS. It uses the hapi.js framework for API accessibility and LevelDB to maintain the chain's state.

## API Endpoints

 * GET `/`
   * Show a list of all available endpoints.

 * GET `/block/(block_number}`
   * Retrieve the contents of a particular block from the chain.

 * POST `/block`
   * Add a block to the chain, using the request's payload as the data to be stored in the new block.

 * GET `/resetWorld`
   * Completely reset the blockchain to zero.

 * GET `/makeTestData`
   * Generate example blocks for testing.

 * GET `/getBlockHeight`
    * Return the current block height of the chain.

## Testing the API:

 1. Open a command prompt after installing node and the required dependencies

 2. Reset the blockchain to zero to create a stable testing environment:
   * `curl "http://localhost:8000/resetWorld" -D - `

 3. Populate the blockchain with some testing data:
   * `curl "http://localhost:8000/makeTestData" -D - `

 4. Add a block to the chain with a custom payload:
   * `curl "http://localhost:8000/block" -D - -X POST -d "This is a test block; 123 testing" -H "Content-Type: text/html"`
   * Take note that this endpoint will return the `JSON.stringify()` version of the newly created block

 5. Retrieve the contents of that newly created block:
   * First, we need to know the current block height:
     * `curl "http://localhost:8000/getBlockHeight"`
   * Then, we can use that to retrieve the newest block on the chain:
   	 * `curl "http://localhost:8000/block/{block_height}"`

 6. Retrieve the genesis block:
   * `curl "http://localhost:8000/block/0"`
