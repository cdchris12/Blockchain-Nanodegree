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
   * Register a star on the blockchain.
     * Requires an input in the form of `{"address": "BTC_wallet_address", "star": { "dec": "68° 52' 56.9", "ra": "16h 29m 1.0s", "mag": "star_magnitude", "cen": "star_centaurus", "story": "Found star using https://www.google.com/sky/"}}"`
     * Returns a value in the form of `{"hash": "block_hash", "height": 57, "body": { "address": "BTC_wallet_address", "star": { "ra": "16h 29m 1.0s", "dec": "-26° 29' 24.9", "mag": "", "cen": "", "story": "story_encoded", "storyDecoded": "Found star using https://www.google.com/sky/"}}, "time": 1532296234, "previousBlockHash": "previous_hash"}`

 * GET `/stars/hash:{block_hash}`
   * Return a specific block's JSON data, identified by the block's hash.
     * Returns a value in the form of `{"hash": "block_hash", "height": 57, "body": { "address": "BTC_wallet_address", "star": { "ra": "16h 29m 1.0s", "dec": "-26° 29' 24.9", "mag": "", "cen": "", "story": "story_encoded", "storyDecoded": "Found star using https://www.google.com/sky/"}}, "time": 1532296234, "previousBlockHash": "previous_hash"}`

 * GET `/stars/address:{wallet_address}`
   * Return an array of any stars' data that are registered to the supplied wallet address.
     * Returns a value in the form of `[{"hash": "block_hash", "height": 57, "body": { "address": "BTC_wallet_address", "star": { "ra": "16h 29m 1.0s", "dec": "-26° 29' 24.9", "mag": "", "cen": "", "story": "story_encoded", "storyDecoded": "Found star using https://www.google.com/sky/"}}, "time": 1532296234, "previousBlockHash": "previous_hash"}, {"hash": "block_hash", "height": 58, "body": { "address": "BTC_wallet_address", "star": { "ra": "16h 29m 1.0s", "dec": "-26° 29' 24.9", "mag": "", "cen": "", "story": "story_encoded", "storyDecoded": "Found star using https://www.google.com/sky/"}}, "time": 1532296234, "previousBlockHash": "previous_hash"}]`

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

 1. Install the required dependencies:
   * `npm install`

 2. Open a command prompt and run the webserver:
   * You can run the interpreter one of two ways:
     * `node server.js` or 
     * `node` followed by `.load server.js`

 3. Reset the blockchain to zero to create a stable testing environment:
   * `curl "http://localhost:8000/resetWorld" -D - `

 4. Populate the blockchain with some testing data:
   * `curl "http://localhost:8000/makeTestData" -D - `

 5. Send an authentication request using BTC address `15VrsbfEWbbRAePTY5rqutRvD6otRw421C`:
   * `curl -X POST http://localhost:8000/requestValidation -H 'Content-Type: application/json' -H 'cache-control: no-cache' -d '{"address": "15VrsbfEWbbRAePTY5rqutRvD6otRw421C"}'`

 6. Go to https://ordinarydude.github.io/offline-bitcoin-signer/ and sign the message returned by your last curl command using the private key `Ky2w1AqJZAu5hshZJDs8GGFjhREYi7yQVrdCYwyLgFM9jeZ5jRwE`
   * ***FOR TESTING ONLY!!!! DO NOT USE THIS TOOL TO SIGN MESSAGES WITH ANY ADDRESS YOU DO NOT WANT TO EXPOSE THE PRIVATE KEY FOR***

 7. Authenticate to the chain with the signature you just generated:
   * `curl -X POST http://localhost:8000/message-signature/validate -H 'Content-Type: application/json' -H 'cache-control: no-cache' -d '{ "address": "15VrsbfEWbbRAePTY5rqutRvD6otRw421C", "signature": "<insert_signature_here>"}'`

 8. Submit a new star for registration:
   * `curl -X POST http://localhost:8000/block -H 'Content-Type: application/json' -H 'cache-control: no-cache' -d '{ "address": "15VrsbfEWbbRAePTY5rqutRvD6otRw421C", "star": { "dec": "68° 52'\'' 56.9", "ra": "16h 29m 1.0s", "story": "Found star using https://www.google.com/sky/"}}'`

 9. Attempt to resubmit the same registration:
   * `curl -X POST http://localhost:8000/block -H 'Content-Type: application/json' -H 'cache-control: no-cache' -d '{ "address": "15VrsbfEWbbRAePTY5rqutRvD6otRw421C", "star": { "dec": "68° 52'\'' 56.9", "ra": "16h 29m 1.0s", "story": "Found star using https://www.google.com/sky/"}}'`
     * You should see an `HTTP/401` response here, indicating you are not authorized to submit another star registration, as registrations are only valid for a single star.

 10. Using the block hash you obtained in the response from step 7, request the block data for that specific block hash:
   * `curl "http://localhost:8000/stars/hash:<block_hash>"`

 11. Check for all stars registered to this specific wallet address:
   * `curl "http://localhost:8000/stars/address:15VrsbfEWbbRAePTY5rqutRvD6otRw421C"`
