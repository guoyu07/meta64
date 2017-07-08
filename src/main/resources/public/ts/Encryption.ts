console.log("Encryption.ts");

import { util } from "./Util";
import { EncryptionKeyPair } from "./EncryptionKeyPair";
import { LocalDB } from "./LocalDB";

/*
This class is for proof-of-concept work related to doing Public Key Encryption on the client using the
WebCryptoAPI, for a "Secure Messaging" feature of SubNode. Currently the way this test is run is simply via
a call to 'new Encryption().test()' from an admin option

We will be using LocalDB.ts implementation to store the keys in the browser, but we will also support
allowing the user to cut-n-paste they Key JSON, so that of something goes wrong with the
browser storage they user will not loose their keys (and therefore data) because they wil be able
to reimport teh JSON key text back in at any time in the future, and even onto another machine or
browser installation.

At no point in time does the users Private Key ever leave their own machine. Is never sent down the wire, and
not even any encrypted copy is ever sent down the wire either for the best-practices that are available for
Secure Messaging, short of special-purpose hardware key-storage
*/
export class Encryption {

    /* jwk = JSON Format */
    static KEY_SAVE_FORMAT = "jwk";

    static ENC_ALGO = "RSA-OAEP";
    static HASH_ALGO = "SHA-256";

    static ALGO_OPERATIONS = ["encrypt", "decrypt"];
    static OP_ENCRYPT: string[] = ["encrypt"];
    static OP_DECRYPT: string[] = ["decrypt"];

    crypto = window.crypto || (<any>window).msCrypto;
    subtle = null;
    vector = null;
    keyPair = new EncryptionKeyPair(null, null);

    publicKeyJson: string = null;
    privateKeyJson: string = null;

    data = "space aliens have landed. we are not alone.";
    encrypted_data = null;
    decrypted_data = null;

    constructor() {
        if (!this.crypto) {
            throw "WebCryptoAPI not available";
        }

        this.subtle = this.crypto.subtle;
        if (!this.subtle) {
            throw "WebCryptoAPI Subtle not available";
        }

        this.vector = this.crypto.getRandomValues(new Uint8Array(16));
    }

    test = () => {

        //NOTE: This little snippet of commented code was the first little test case to prove LocalDB is working!
        //(This will be the technique used to store the Asymmetric Keys in the Browser securely)
        // let localDB = new LocalDB();
        // localDB.writeObject({ name: "clayskey", val: "testValue" });
        // localDB.readObject("clayskey", (val) => {
        //     console.log("Readback: " + util.toJson(val));
        // });

        /* NOTE: These parameters are all production-quality */
        let promise = this.subtle.generateKey({ //
            name: Encryption.ENC_ALGO, //
            modulusLength: 2048, //
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]), //
            hash: { name: Encryption.HASH_ALGO }
        }, true, Encryption.ALGO_OPERATIONS);

        promise.then(
            (key) => {
                this.keyPair.privateKey = key.privateKey;
                this.keyPair.publicKey = key.publicKey;

                this.exportKeys(this.keyPair);
                this.encrypt();
            });

        promise.catch = (e) => {
            console.log(e.message);
        }
    }

    /*
     Verifies that both keys can be exported to text (JSON), and then successfully reimported back from that text to usable form
     */
    exportKeys = (keyPair: EncryptionKeyPair) => {
        this.subtle.exportKey(
            Encryption.KEY_SAVE_FORMAT,
            keyPair.publicKey
        )
            .then((keydata) => {
                this.publicKeyJson = util.toJson(keydata);
                console.log("PublicKey: " + this.publicKeyJson);
                this.importKey(Encryption.OP_ENCRYPT, "public", this.publicKeyJson);
            })
            .catch((err) => {
                console.error(err);
            });

        this.subtle.exportKey(
            Encryption.KEY_SAVE_FORMAT,
            keyPair.privateKey
        )
            .then((keydata) => {
                this.privateKeyJson = util.toJson(keydata);
                console.log("PrivateKey: " + this.privateKeyJson);
                this.importKey(Encryption.OP_DECRYPT, "private", this.privateKeyJson);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    importKey = (algoOp: string[], keyName: string, key: string) => {
        this.subtle.importKey(
            Encryption.KEY_SAVE_FORMAT,
            JSON.parse(key),
            {
                name: Encryption.ENC_ALGO,
                hash: { name: Encryption.HASH_ALGO },
            },
            true, algoOp
        )
            .then((publicKey) => {
                console.log(keyName + " key successfully imported.");
            })
            .catch((err) => {
                console.error("Error importing " + keyName + " key: " + err);
            });
    }

    encrypt = () => {
        let promise = this.subtle.encrypt({ name: Encryption.ENC_ALGO, iv: this.vector }, //
            this.keyPair.publicKey, this.convertStringToArrayBufferView(this.data));

        promise.then(
            (result) => {
                this.encrypted_data = new Uint8Array(result);
                console.log("Encrpted data: " + this.convertArrayBufferViewtoString(this.encrypted_data));
                this.decrypt();
            },
            (e) => {
                console.log(e.message);
            }
        );
    }

    decrypt = () => {
        let promise = this.subtle.decrypt({ name: Encryption.ENC_ALGO, iv: this.vector }, //
            this.keyPair.privateKey, this.encrypted_data);

        promise.then(
            (result) => {
                this.decrypted_data = new Uint8Array(result);
                console.log("Decrypted data: " + this.convertArrayBufferViewtoString(this.decrypted_data));
            },
            (e) => {
                console.log(e.message);
            }
        );
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
}
