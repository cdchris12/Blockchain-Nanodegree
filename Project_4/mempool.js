const SHA256 = require('crypto-js/sha256');
var crypto = require("crypto");
var WAValidator = require('wallet-address-validator');

// This can be changed for testing the requestTimeout functionality for the mempool
// Value is in seconds
const timeout = 5;


class Mempool{
    constructor(data){
        this.mempool = [];
        this.timeoutRequests = [];
    };

    removeValidationRequest(address, pool=null){
        if (pool){
            delete pool.mempool[address];
            delete pool.timeoutRequests[address];
        } else {
            delete this.mempool[address];
            delete this.timeoutRequests[address];
        };
        return;
    };

    async requestAuth(address){
        if (address in this.mempool){
            var req = this.mempool[address];
        } else{
            // Ensure this is a valid BTC address
            var valid = WAValidator.validate(address, 'BTC');
            if(!valid){
                return false
            }

            // Generate an auth value
            var auth = crypto.randomBytes(15).toString('hex');

            // Set the object `req`'s various values
            var req = {}
            req["requestTimeStamp"] = Math.floor(new Date() / 1000);
            req["message"] = auth + ":" + req["requestTimeStamp"].toString() + ":starRegistry";
            req["walletAddress"] = address
            req["validationWindow"] = timeout

            // Save the new request details to the actual mempool
            this.mempool[address] = req;

            // Set a timeout for the request to be removed from the mempool
            this.timeoutRequests[req.walletAddress]=setTimeout(this.removeValidationRequest, timeout * 1000, req.walletAddress, this);
        };

        return req;
    };
}

module.exports = { Mempool }