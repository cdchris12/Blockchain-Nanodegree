const Hapi=require('hapi');
backend = require('./levelSandbox');
chain = require('./simpleChain');

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});

// Add the route
server.route({
    method:'GET',
    path:'/',
    handler:function(request,h) {

        return(
            "<h1>This page intentionally left blank.</h1>" +
            "\n" +
            "\n" +
            "The following methods are currently available: " +
            "<ul>" + "<li>" + "<h4>" + "GET /block/{block_num}" + "</h4>" +
            "<ul>" + "<li>" + "To retrieve the contents of a particular block from the chain." + "</li>" + "</ul>" + "</li>" +
            "<li>" + "<h4>" + "POST {something}" + "</h4>" +
            "<ul>" + "<li>" + "To do some stuff." + "</li>" + "</ul>" + "</li>" +
            "</ul>"
        );
    }
});

// Add the route
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