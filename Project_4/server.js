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
                    "<h4>" + "POST /block" + "</h4>" +
                    "<ul>" + 
                        "<li>" + "Add a block to the chain, using the request's payload as the data to be stored in the new block." + "</li>" +
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
            const response = h.response(JSON.stringify(await blockchain.getBlock(request.params.b_num)));
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
            const response = h.response("Something's REALLY wrong here. Did you pass an integer in your request?");
            response.type('text/html');
            response.header('Creator', 'cdchris12');
            response.code(418);
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
            obj = JSON.parse(request.payload.toString('utf8'));
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
            obj = JSON.parse(request.payload.toString('utf8'));
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

        //console.log(request.payload.toString('utf8'));

        try {
            obj = JSON.parse(request.payload.toString('utf8'));
        }
        catch (err) {
            const response = h.response("Invalid JSON data supplied!");
            response.type('text/html; charset=utf-8');
            response.header('Creator', 'cdchris12');
            response.code(418);
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