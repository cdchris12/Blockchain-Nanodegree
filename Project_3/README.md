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

## Testing the API:

1. Open a command prompt after installing node and the required dependencies

