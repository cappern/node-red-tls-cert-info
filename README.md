# node-red-contrib-tls-cert-info

A Node-RED node that retrieves SSL/TLS certificate information from a given host and port.

## Installation

To install this node, run the following command in your Node-RED user directory:

npm install @cappern/node-red-tls-cert-info


## Usage

The `tls-cert-info` node retrieves the SSL/TLS certificate information from the given host and port. The certificate details are returned in the `payload` object of the message.

### Inputs

| Property | Type    | Required | Description                                     |
| -------- | ------- | -------- | ----------------------------------------------- |
| host     | string  | yes      | Hostname to connect to.                          |
| port     | integer | no       | Port number to connect to (default is `443`).    |
| payload  | string  | yes      | The payload of the message to publish.           |

### Outputs

| Property | Type   | Description                                 |
| -------- | ------ | ------------------------------------------- |
| payload  | object | Object containing the certificate details.  |

The `payload` object has the following properties:

| Property      | Type    | Description                                                                      |
| ------------- | ------- | -------------------------------------------------------------------------------- |
| subject       | object  | Object containing the details of the subject of the certificate.                |
| keysize       | integer | The size of the key used in the certificate.                                    |
| serialnumber  | string  | The serial number of the certificate.                                           |
| validFrom     | string  | The date and time when the certificate becomes valid.                           |
| validTo       | string  | The date and time when the certificate expires.                                 |
| san           | string  | A list of Subject Alternative Names (SANs) present in the certificate.          |
| pem           | string  | The PEM-formatted certificate.                                                  |


The `hostname` and `port` values can be configured in the node's configuration or set by `msg.host` and `msg.port`, respectively.

### Example Flow

Here is an example flow that retrieves the SSL/TLS certificate information from `google.com` and outputs it to the debug console:

```json
[
    {
        "id": "99c1431f.4fa728",
        "type": "tls-cert-info",
        "z": "6cf16babd7098725",
        "name": "",
        "x": 770,
        "y": 1220,
        "wires": [
            [
                "78c9df9.88d968"
            ]
        ]
    },
    {
        "id": "78c9df9.88d968",
        "type": "debug",
        "z": "6cf16babd7098725",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 990,
        "y": 1220,
        "wires": []
    },
    {
        "id": "60eee8872b041bc2",
        "type": "inject",
        "z": "6cf16babd7098725",
        "name": "",
        "props": [
            {
                "p": "host",
                "v": "www.apple.com",
                "vt": "str"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "x": 510,
        "y": 1220,
        "wires": [
            [
                "99c1431f.4fa728"
            ]
        ]
    }
]
```

## References

- [Node-RED](https://nodered.org/)
- [MQTT](https://mqtt.org/)
- [SSL/TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
