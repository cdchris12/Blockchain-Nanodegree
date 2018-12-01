# Description

This project implements a simple blockchain, written in NodeJS. It uses the hapi.js framework for API accessibility and LevelDB to maintain the chain's state.

## API Endpoints

 * POST `/requestValidation`
   * Request a validation string.
      * Requires an input in the form of `{"address": "BTC_wallet_address"}`
      * Returns a value in the form of `{"walletAddress": "BTC_wallet_address", "requestTimeStamp": 1541605128, "message": "validation_message", "validationWindow": 300}`

 * POST `/message-signature/validate`
   * Request a validation string.
      * Requires an input in the form of `{"address": "BTC_wallet_address", "signature": "message_signature"}"`
      * Returns a value in the form of `{"registerStar": true, "status": {"address": "BTC_wallet_address", "requestTimeStamp": 1541605128, "message": "validation_message", "validationWindow": 200, "messageSignature": true}}`

 * POST `/block`
   * Add a block to the chain, using the request's payload as the data to be stored in the new block.

 * GET `/`
   * Show a list of all available endpoints.

 * GET `/block/(block_number}`
   * Retrieve the contents of a particular block from the chain.
     * Returns a value in the form of `{"hash": "block_hash", "height": 45, "body": "block_body_text", "time": 1543699602, "previousBlockHash": "previous_hash"}`

 * GET `/resetWorld`
   * Completely reset the blockchain to zero.

 * GET `/makeTestData`
   * Generate example blocks for testing.

 * GET `/getBlockHeight`
    * Return the current block height of the chain.

## Testing the API:

 1. Open a command prompt after installing node and the required dependencies, and run the webserver:
   * `node server.js`

 2. Reset the blockchain to zero to create a stable testing environment:
   * `curl "http://localhost:8000/resetWorld" -D - `

 3. Populate the blockchain with some testing data:
   * `curl "http://localhost:8000/makeTestData" -D - `

 4. Send an authentication request using BTC address `15VrsbfEWbbRAePTY5rqutRvD6otRw421C`:
   * `curl -X POST http://localhost:8000/requestValidation -H 'Content-Type: application/json' -H 'cache-control: no-cache' -d '{"address": "15VrsbfEWbbRAePTY5rqutRvD6otRw421C"}'`

 5. Go to https://ordinarydude.github.io/offline-bitcoin-signer/ and sign the message returned by your last curl command using the private key `Ky2w1AqJZAu5hshZJDs8GGFjhREYi7yQVrdCYwyLgFM9jeZ5jRwE`
   * ***FOR TESTING ONLY!!!! DO NOT USE THIS TOOL TO SIGN MESSAGES WITH ANY ADDRESS YOU DO NOT WANT TO EXPOSE THE PRIVATE KEY FOR***

 6. Authenticate to the chain with the signature you just generated:
   * `curl -X POST http://localhost:8000/message-signature/validate -H 'Content-Type: application/json' -H 'cache-control: no-cache' -d '{ "address": "15VrsbfEWbbRAePTY5rqutRvD6otRw421C", "signature": "<insert_signature_here>"}'`
