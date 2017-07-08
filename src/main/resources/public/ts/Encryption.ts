console.log("Encryption.ts");

import { EncryptionKeyPair } from "./EncryptionKeyPair";

/* This class is for proof-of-concept work related to doing Public Key Encryption on the client using the
Web Crypto API, for a "Secure Messaging" feature of SubNode. Currently the way this test is run is simply via
a call to 'new Encryption().test()' from an admin option
*/
export class Encryption {

    static ENC_ALGO = "RSA-OAEP";
    static HASH_ALGO = "SHA-256";

    crypto = window.crypto || (<any>window).msCrypto;
    vector = null;
    keyPair = new EncryptionKeyPair(null, null);

    data = "space aliens have landed. we are not alone.";
    encrypted_data = null;
    decrypted_data = null;

    constructor() {
        if (!this.crypto || !this.crypto.subtle) {
            throw "WebCryptoAPI not enabled";
        }
        this.vector = this.crypto.getRandomValues(new Uint8Array(16));
    }

    test = () => {
        /* NOTE: These parameters are all production-quality */
        let promise = this.crypto.subtle.generateKey({ //
            name: Encryption.ENC_ALGO, //
            modulusLength: 2048, //
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]), //
            hash: { name: Encryption.HASH_ALGO }
        }, false, ["encrypt", "decrypt"]);

        promise.then(
            (key) => {
                this.keyPair.privateKey = key.privateKey;
                this.keyPair.publicKey = key.publicKey;
                this.encrypt();
            });

        promise.catch = function(e) {
            console.log(e.message);
        }
    }

    convertStringToArrayBufferView = (str) => {
        var bytes = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        return bytes;
    }

    convertArrayBufferViewtoString = (buffer) => {
        var str = "";
        for (var i = 0; i < buffer.byteLength; i++) {
            str += String.fromCharCode(buffer[i]);
        }
        return str;
    }

    encrypt = () => {
        let promise = this.crypto.subtle.encrypt({ name: Encryption.ENC_ALGO, iv: this.vector }, this.keyPair.publicKey, this.convertStringToArrayBufferView(this.data));

        promise.then(
            (result) => {
                this.encrypted_data = new Uint8Array(result);
                console.log("Encrpted data: " + this.convertArrayBufferViewtoString(this.encrypted_data));
                this.decrypt();
            },
            function(e) {
                console.log(e.message);
            }
        );
    }

    decrypt = () => {
        let promise = this.crypto.subtle.decrypt({ name: Encryption.ENC_ALGO, iv: this.vector }, this.keyPair.privateKey, this.encrypted_data);

        promise.then(
            (result) => {
                this.decrypted_data = new Uint8Array(result);
                console.log("Decrypted data: " + this.convertArrayBufferViewtoString(this.decrypted_data));
            },
            function(e) {
                console.log(e.message);
            }
        );
    }
}
