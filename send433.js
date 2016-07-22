const net = require('net');

module.exports = {

    send: function (hosts, code, nmbr, state, callback) {
        hosts.forEach(function (host) {
            var client = new net.Socket();
            client.on('error', function (err) {
                console.log("Warn: " + err.message);
            })
            client.connect(host.port, host.host, function () {
                client.write(code + nmbr + state);
                //wahrscheinlichen Status merken
                callback(true, state);
            });
        });
    }
}