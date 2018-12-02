const Hapi=require('hapi');
backend = require('./levelSandbox');
chain = require('./simpleChain');
Mempool = require('./mempool');

mempool = new Mempool.Mempool()

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});

// The default route, which serves as a list of our currently available routes
server.route({
    method:'GET',
    path:'/',
    handler:function(request,h) {

        return(
            "<h1>" + "The following methods are currently available: " + "</h1>" +
            "\n" +
            "\n" +
            "<ul>" +
                "<li>" + 
                    "<h4>" + "POST /requestValidation" + "</h4>" +
                    "<ul>" + 
                        "<li>" + 
                            "Request a validation string." +
                            "<ul>" +
                                "<li>" + "Requires an input in the form of {\"address\": \"BTC_wallet_address\"}" + "</li>" +
                                "<li>" + "Returns a value in the form of {\"walletAddress\": \"BTC_wallet_address\", \"requestTimeStamp\": 1541605128, \"message\": \"validation_message\", \"validationWindow\": 300}" + "</li>" +
                            "</ul>" +
                        "</li>" +
                    "</ul>" +
                "</li>" +
                "<li>" + 
                    "<h4>" + "POST /message-signature/validate" + "</h4>" +
                    "<ul>" + 
                        "<li>" + 
                            "Attempt to authenticate to the API by submitting a signature proving ownership of a BTC address." +
                            "<ul>" +
                                "<li>" + "Requires an input in the form of {\"address\": \"BTC_wallet_address\", \"signature\": \"message_signature\"}" + "</li>" +
                                "<li>" + "Returns a value in the form of {\"registerStar\": true, \"status\": {\"address\": \"BTC_wallet_address\", \"requestTimeStamp\": 1541605128, \"message\": \"validation_message\", \"validationWindow\": 200, \"messageSignature\": true}}" + "</li>" +
                            "</ul>" +
                        "</li>" +
                    "</ul>" +
                "</li>" +
                "<li>" + 
                    "<h4>" + "POST /star/register" + "</h4>" +
                    "<ul>" + 
                        "<li>" + 
                            "Register a star on the blockchain." +
                            "<ul>" +
                                "<li>" + "Requires an input in the form of {\"address\": \"BTC_wallet_address\", \"star\": { \"dec\": \"68° 52' 56.9\", \"ra\": \"16h 29m 1.0s\", \"mag\": \"star_magnitude\", \"cen\": \"star_centaurus\", \"story\": \"Found star using https://www.google.com/sky/\"}}" + "</li>" +
                                "<li>" + "Returns a value in the form of {\"hash\": \"block_hash\", \"height\": 57, \"body\": { \"address\": \"BTC_wallet_address\", \"star\": { \"ra\": \"16h 29m 1.0s\", \"dec\": \"-26° 29' 24.9\", \"mag\": \"\", \"cen\": \"\", \"story\": \"story_encoded\", \"storyDecoded\": \"Found star using https://www.google.com/sky/\"}}, \"time\": \"1532296234\", \"previousBlockHash\": \"previous_hash\"}" + "</li>" +
                            "</ul>" +
                        "</li>" +
                    "</ul>" +
                "</li>" +
                "<li>" + 
                    "<h4>" + "POST /block" + "</h4>" +
                    "<ul>" + 
                        "<li>" + "Add a block to the chain, using the request's payload as the data to be stored in the new block." + "</li>" +
                    "</ul>" +
                "</li>" +
                "<li>" + 
                    "<h4>" + "GET /stars/hash:{block_hash}" + "</h4>" +
                    "<ul>" +
                        "<li>" + "Return a specific block's JSON data, identified by the block's hash." + "</li>" +
                    "</ul>" +
                "</li>" +
                "<li>" + 
                    "<h4>" + "GET /stars/address:{wallet_address}" + "</h4>" +
                    "<ul>" +
                        "<li>" + "Return an array of any stars' data that are registered to the supplied wallet address." + "</li>" +
                    "</ul>" +
                "</li>" +
                "<li>" + 
                    "<h4>" + "GET /block/{block_num}" + "</h4>" +
                    "<ul>" +
                        "<li>" + "Retrieve the contents of a particular block from the chain." + "</li>" +
                    "</ul>" +
                "</li>" +
                "<li>" + 
                    "<h4>" + "GET /resetWorld" + "</h4>" +
                    "<ul>"+ 
                        "<li>" + "Completely reset the blockchain to zero." + "</li>" +
                    "</ul>" +
                "</li>" +
                "<li>" + 
                    "<h4>" + "GET /makeTestData" + "</h4>" +
                    "<ul>" + 
                        "<li>" + "Generate example blocks for testing." + "</li>" + 
                    "</ul>" + 
                "</li>" +
                "<li>" + 
                    "<h4>" + "GET /getBlockHeight" + "</h4>" +
                    "<ul>" + 
                        "<li>" + "Return the current block height of the chain." + "</li>" + 
                    "</ul>" + 
                "</li>" +
            "</ul>"
        );
    }
});


// "/getBlockHeight" route to get the current block height.
server.route({
    method:'GET',
    path:'/getBlockHeight',
    handler: async function (request,h) {
        // request.payload or request.rawPayload
        // Input is a string, should return newly created block on success

        try {
            var blockchain = new chain.Blockchain();
            await blockchain.init();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }

        let height = await blockchain.getBlockHeight();

        const response = h.response(height);
        response.type('text/html; charset=utf-8');
        response.header('Creator', 'cdchris12');
        response.code(200);
        return response;
    }
});

// "/resetWorld" route to reset the blockchain to zero.
server.route({
    method:'GET',
    path:'/resetWorld',
    handler: async function (request,h) {
        try {
            var blockchain = new chain.Blockchain();
            await blockchain.init();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }

        await backend.resetWorld()

        const response = h.response("Blockchain has been reset!");
        response.type('text/html; charset=utf-8');
        response.header('Creator', 'cdchris12');
        response.code(200);
        return response;
    }
});

// "/makeTestData" route to generate test data for the blockchain
server.route({
    method:'GET',
    path:'/makeTestData',
    handler: async function (request,h) {
        try {
            var blockchain = new chain.Blockchain();
            await blockchain.init();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }

        await blockchain.generateBlocks();

        const response = h.response("Example data has been generated for the blockchain!");
        response.type('text/html; charset=utf-8');
        response.header('Creator', 'cdchris12');
        response.code(200);
        return response;
    }
});

// "/block" GET route to return a specific block's JSON data.
server.route({
    method:'GET',
    path:'/block/{b_num}',
    handler: async function (request,h) {
        //request.params.b_num

        try {
            var blockchain = new chain.Blockchain();
            await blockchain.init();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }

        let height = await blockchain.getBlockHeight();

        if (request.params.b_num <= height && request.params.b_num >= 0) {
            // Valid request; process it
            var res = JSON.stringify(await blockchain.getBlock(request.params.b_num));
            if ("star" in res.body) {
                res.body.star.storyDecoded = hex2ascii(res.body.star.story);
            }

            const response = h.response(res);
            response.type('application/json; charset=utf-8');
            response.header('Creator', 'cdchris12');
            response.code(200);
            return response;
        } else if (request.params.b_num < 0) {
            // Requested block number is invalid, because the blockchain always has, at least, 0 blocks
            // (with the genesis block being block #0)
            const response = h.response("Invalid block index!\nBlock indices start at `0`");
            response.type('text/html');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        } else if (request.params.b_num > height) {
            // Requested block does not yet exist
            const response = h.response("Invalid block index! The current block height is: " + height);
            response.type('text/html');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        } else {
            const response = h.response("Something's REALLY wrong here. You passed \"" + request.params.b_num.toString() + "\"in your request; is it an integer?");
            response.type('text/html');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        }

        //return(JSON.stringify(await blockchain.getBlock(request.params.b_num)));
    }
});

// "/requestValidation" POST route to allow requesting auth info from the chain.
server.route({
    method:'POST',
    path:'/requestValidation',
    config: {
        payload: {
            defaultContentType: 'application/json',
            parse: false
            //allow: 'multipart/form-data',
        }
    },
    handler: async function (request,h) {
        // Parse the input into JSON ourselves so we can return any errors ourselves
        try {
            var obj = JSON.parse(request.payload.toString('utf8'));
        }
        catch (err) {
            const response = h.response("Invalid JSON data supplied!\nYou POSTed:\n\n" + request.payload.toString('utf8'));
            response.type('text/plain; charset=utf-8');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        }

        // Process a valid JSON object
        if ('address' in obj && obj['address'] !== "") {
            var res = await mempool.requestAuth(obj["address"])

            if (res){
                const response = h.response(res);
                response.type('application/json; charset=utf-8');
                response.header('Creator', 'cdchris12');
                response.code(200);
                return response;
            } else {
                const response = h.response("Authentication string request failed for address: " + obj["address"] + "\n\nIs this a valid BTC address?");
                response.type('text/plain; charset=utf-8');
                response.header('Creator', 'cdchris12');
                response.code(400);
                return response;
            };
        } else {
            const response = h.response("Bad JSON data supplied!\nYou POSTed:\n\n" + obj.stringify());
            response.type('text/plain; charset=utf-8');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        };
    }
});

// "/message-signature/validate" POST route to allow authenticating to the chain.
server.route({
    method:'POST',
    path:'/message-signature/validate',
    config: {
        payload: {
            defaultContentType: 'application/json',
            parse: false
            //allow: 'multipart/form-data',
        }
    },
    handler: async function (request,h) {
        // Parse the input into JSON ourselves so we can return any errors ourselves
        try {
            var obj = JSON.parse(request.payload.toString('utf8'));
        }
        catch (err) {
            const response = h.response("Invalid JSON data supplied!\nYou POSTed:\n\n" + request.payload.toString('utf8'));
            response.type('text/plain; charset=utf-8');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        }

        // Process a valid JSON object
        if (('address' in obj && obj['address'] !== "") && ('signature' in obj && obj['signature'] !== "")) {
            var res = await mempool.validateRequestByWallet(obj)

            if (res){
                const response = h.response(res);
                response.type('application/json; charset=utf-8');
                response.header('Creator', 'cdchris12');
                response.code(200);
                return response;
            } else {
                const response = h.response("Address validation failed!!");
                response.type('text/plain; charset=utf-8');
                response.header('Creator', 'cdchris12');
                response.code(400);
                return response;
            };
        } else {
            const response = h.response("Bad JSON data supplied!\nYou POSTed:\n\n" + obj.stringify());
            response.type('text/plain; charset=utf-8');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        };
    }
});

// "/star/register" POST route to allow registering a star to the chain.
server.route({
    method:'POST',
    path:'/star/register',
    config: {
        payload: {
            defaultContentType: 'application/json',
            parse: false
            //allow: 'multipart/form-data',
        }
    },
    handler: async function (request,h) {
        // Parse the input into JSON ourselves so we can return any errors ourselves
        try {
            var obj = JSON.parse(request.payload.toString('utf8'));
        }
        catch (err) {
            // Invalid JSON data, as parsing failed
            const response = h.response("Invalid JSON data supplied!\nYou POSTed:\n\n" + request.payload.toString('utf8'));
            response.type('text/plain; charset=utf-8');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        }

        // Verify content of JSON response
        if ('address' in obj && obj['address'] !== "") {
            var authenticated = await mempool.verifyAddressRequest(obj['address'])

            if (authenticated){
                // Address authenticated

                // Verify star data is seemingly valid
                if (
                    ("star" in obj) && 
                    ("dec" in obj["star"] && obj["star"]["dec"] != "") && 
                    ("ra" in obj["star"] && obj["star"]["ra"] != "") && 
                    ("story" in obj["star"])
                ) {
                    // Valid star data

                    // Encode star data into JSON
                    let body = {
                        address: obj.address,
                        star: {
                            ra: obj.star.ra,
                            dec: obj.star.dec,
                            mag: ("mag" in obj.star) ? obj.star.mag : "",
                            cen: ("cen" in obj.star) ? obj.star.cen : "",
                            story: Buffer(obj.star.story).toString('hex')
                        }
                    };
                } else {
                    // Invalid star data
                    const response = h.response("Bad JSON data supplied!\nYou POSTed:\n\n" + obj.stringify());
                    response.type('text/plain; charset=utf-8');
                    response.header('Creator', 'cdchris12');
                    response.code(400);
                    return response;
                };

                // Add block to chain
                try {
                    var blockchain = new chain.Blockchain();
                    await blockchain.init();
                }
                catch (err) {
                    console.log(err);
                    process.exit(1);
                }

                let newBlock = await blockchain.addBlock(new chain.Block(obj));
                newBlock.body.star["storyDecoded"] = obj.star.story;

                // Remove this wallet address' authentication
                let auth = await mempool.removeAddressValidation(obj['address']);

                // Return the created block
                const response = h.response(newBlock);
                response.type('application/json; charset=utf-8');
                response.header('Creator', 'cdchris12');
                response.code(201);
                return response;
            } else {
                // Not authenticated
                const response = h.response("Address not authenticated!!");
                response.type('text/plain; charset=utf-8');
                response.header('Creator', 'cdchris12');
                response.code(401);
                return response;
            };
        } else {
            // Request didn't contain an `address` field, or it was blank
            const response = h.response("Bad JSON data supplied!\nYou POSTed:\n\n" + obj.stringify());
            response.type('text/plain; charset=utf-8');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        };
    }
});

// "/stars/hash:{b_hash}" GET route to return a specific block's JSON data, identified by the block's hash.
server.route({
    method:'GET',
    path:'/stars/hash:{b_hash}',
    handler: async function (request,h) {

        try {
            var blockchain = new chain.Blockchain();
            await blockchain.init();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }

        if (request.params.b_hash) {
            // Valid request; process it
            var res = await blockchain.getBlockByHash(request.params.b_hash);

            if (res) {
                // Block was found
                
                // Inject the star story into the JSON object before returning it
                res.body.star.storyDecoded = hex2ascii(res.body.star.story);

                const response = h.response(res);
                response.type('application/json; charset=utf-8');
                response.header('Creator', 'cdchris12');
                response.code(200);
                return response;
            } else {
                // Block was not found in the chain
                const response = h.response("Block hash \"" + request.params.b_hash + "\" not found in the blockchain!");
                response.type('text/html');
                response.header('Creator', 'cdchris12');
                response.code(400);
                return response;
            };
        } else {
            // Block hash is an empty string
            const response = h.response("Something's REALLY wrong here. Did you pass a block hash to search for in your request?");
            response.type('text/html');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        }

        //return(JSON.stringify(await blockchain.getBlock(request.params.b_num)));
    }
});

// "/stars/address:{wallet_address}" GET route to return a specific block's JSON data, identified by the wallet address the star is registered to.
server.route({
    method:'GET',
    path:'/stars/address:{wallet_address}',
    handler: async function (request,h) {

        try {
            var blockchain = new chain.Blockchain();
            await blockchain.init();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }

        if (request.params.wallet_address) {
            // Valid request; process it

            // Ensure this is a valid BTC address
            var valid = WAValidator.validate(wallet_address, 'BTC');
            if(!valid){
                // Invalid address
                const response = h.response("The supplied wallet address \"" + request.params.wallet_address + "\" is not a valid BTC wallet address!!");
                response.type('text/html');
                response.header('Creator', 'cdchris12');
                response.code(400);
                return response;
            }

            var res = await blockchain.getBlocksByWalletAddress(request.params.wallet_address);

            if (res) {
                // Block(s) was/were found

                // Inject the star story into the JSON object before returning it
                for (var i = 0; i < res.length; i++) {
                    res[i].body.star.storyDecoded = hex2ascii(res[i].body.star.story);
                }

                const response = h.response(res);
                response.type('application/json; charset=utf-8');
                response.header('Creator', 'cdchris12');
                response.code(200);
                return response;
            } else {
                // Block was not found in the chain
                const response = h.response(res);
                response.type('application/json; charset=utf-8');
                response.header('Creator', 'cdchris12');
                response.code(204);
                return response;
            };
        } else {
            // Block hash is an empty string
            const response = h.response("Something's REALLY wrong here. Did you pass a block hash to search for in your request?");
            response.type('text/html');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        }

        //return(JSON.stringify(await blockchain.getBlock(request.params.b_num)));
    }
});

// "/block" POST route to allow adding a block to the chain.
server.route({
    method:'POST',
    path:'/block',
    config: {
        payload: {
            //defaultContentType: 'text/plain'
            parse: false
            //allow: 'multipart/form-data',
        }
    },
    handler: async function (request,h) {
        // request.payload or request.rawPayload
        // Input is a string, should return newly created block on success

        try {
            var blockchain = new chain.Blockchain();
            await blockchain.init();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }

        let height = await blockchain.getBlockHeight();
        txt = request.payload.toString('utf8')

        try {
            var obj = JSON.parse(request.payload.toString('utf8'));
        }
        catch (err) {
            const response = h.response("Invalid JSON data supplied!");
            response.type('text/html; charset=utf-8');
            response.header('Creator', 'cdchris12');
            response.code(400);
            return response;
        }

        if ('body' in obj && obj['body'] !== "") {
            let newBlock = await blockchain.addBlock(new chain.Block(obj['body']));
            const response = h.response(newBlock);
            response.type('application/json; charset=utf-8');
            response.header('Creator', 'cdchris12');
            response.code(200);
            return response;
        } else {
            const response = h.response("Invalid JSON data supplied!");
            response.type('text/html; charset=utf-8');
            response.header('Creator', 'cdchris12');
            response.code(418);
            return response;
        }
    }
});

// Start the server
async function start() {

    try {
        await server.start();
        const blockchain = new chain.Blockchain();
        await blockchain.init();
        let height = await blockchain.getBlockHeight();
        console.log('Current blockchain chain height is: ', height);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }


    console.log('Server running at:', server.info.uri);
};

start();