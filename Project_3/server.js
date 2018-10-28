const Hapi=require('hapi');

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
            "<ul>" + "<li>" + "<h4>GET /block/{block_num}</h4>" +
            "<ul>" + "<li>" + "To retrieve the contents of a particular block from the chain." + "</li>" + "</ul>" + "</li>" +
            "<li>" + "<h4>POST {something}</h4>" +
            "<ul>" + "<li>" + "To do some stuff." + "</li>" + "</ul>" + "</li>" +
            "</ul>"
        );
    }
});

// Add the route
server.route({
    method:'GET',
    path:'/block/{b_num}',
    handler:function(request,h) {
        //request.params.b_num

        return "You asked for block #" + request.params.b_num + "!!";
    }
});

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();