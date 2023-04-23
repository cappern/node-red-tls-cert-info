module.exports = function (RED) {
    function TlsCertInfoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        const tls = require("node:tls");
        const crypto = require("node:crypto");

        function toPem(rawCert) {
            const base64Cert = rawCert.toString("base64");
            const pem = `-----BEGIN CERTIFICATE-----\n${base64Cert.match(/.{1,64}/g).join("\n")}\n-----END CERTIFICATE-----\n`;
            return pem;
        }

        function setStatus(status) {
            node.status(status);
        }

        node.on('input', function (msg) {
            const options = {
                host: msg.host,
                servername: msg.host,
                port: msg.port || 443,
                rejectUnauthorized: false,
            };

            const socket = tls.connect(options, () => {
                
                // Henter ut sertifikatet til verten
                var certificate = socket.getPeerCertificate(true);
                //console.log("Sertifikat hentet:", certificate);

                // Konverterer sertifikatet til PEM-format
                const pem = toPem(certificate.raw);

                // Legger til informasjon om sertifikatet i msg.cert
                msg.payload = {
                    subject: certificate.subject,
                    keysize: certificate.bits,
                    serialnumber: certificate.serialNumber,
                    validFrom: certificate.valid_from,
                    validTo: certificate.valid_to,
                    san: certificate.subjectaltname,
                    pem: pem, // Legger til PEM-formatet av sertifikatet
                };
                msg.detailedCertInfo = certificate
                msg.host = msg.host
                setStatus({ fill: "green", shape: "dot", text: `Fetched SSL-CERT from ${msg.host}` });
                node.send(msg);


                // Avslutter TCP-tilkoblingen
                socket.end();
            });

            socket.on("error", (error) => {
                console.log("TCP connection error:", error);
                setStatus({ fill: "red", shape: "ring", text: `Error: ${error}` });
            });
        });

        node.on('close', function (done) {
            setStatus({ fill: "red", shape: "ring", text: "Disconnected" });
            done();
        });
    }

    RED.nodes.registerType("tls-cert-info", TlsCertInfoNode);
}
