const SHA256 = require('crypto-js/sha256');
var crypto = require("crypto");
var WAValidator = require('wallet-address-validator');
const bitcoinMessage = require('bitcoinjs-message');

// This can be changed for testing the requestTimeout functionality for the mempool
// Value is in seconds
const timeout = 300;


class Mempool{
    constructor(data){
        this.mempool = [];
        this.timeoutRequests = [];
        this.mempoolValid = [];
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

    async validateRequestByWallet(input){
        var address = input['address'];
        var signature = input['signature'];
        var obj = this.mempool[address];

        // If obj is falsey, this address isn't in the mempool
        if (!obj) {
            return false;
        }

        console.log(obj['message']);
        console.log(address);
        console.log(signature);
        let isValid = bitcoinMessage.verify(obj['message'], address, signature);
        console.log(isValid);

        let timely = ((Math.floor(new Date() / 1000) - obj["requestTimeStamp"]) < obj['validationWindow'])

        // If message not valid or outside the specified timeframe, return false
        if (!isValid || !timely) {
            return false;
        };

        var res = {};
        res.registerStar = true;
        res.status = {
            "address": address,
            "requestTimeStamp": obj['requestTimeStamp'],
            "message": obj['message'],
            "validationWindow": obj['validationWindow'],
            "messageSignature": "valid"
        };

        // Save the new object to the valid array
        this.mempoolValid[address] = res;

        // Ensure the auth records get queued for removal
        this.removeValidationRequest(address);

        return res;
    };
}

module.exports = { Mempool }