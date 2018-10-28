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

        const response = h.response(JSON.stringify(await blockchain.getBlock(request.params.b_num)));
        response.type('application/json');
        response.header('Creator', 'cdchris12');
        return response;

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