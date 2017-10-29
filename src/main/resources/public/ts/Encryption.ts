console.log("Encryption.ts");

import { util } from "./Util";
import { EncryptionKeyPair } from "./EncryptionKeyPair";
import { LocalDB } from "./LocalDB";

/*
Currently there are both 1) PublicKey Encryption as well as 2) Symmetric password-based encryption in this 
class but i'll probably be splitting it into two classes:

PUBLIC KEY ENCRYPTION
--------------------
This class is for proof-of-concept work related to doing Public Key Encryption on the client using the
WebCryptoAPI, for a "Secure Messaging" feature of SubNode. Currently the way this test is run is simply via
a call to 'encryption.test()' from an admin option

We will be using LocalDB.ts implementation to store the keys in the browser, but we will also support
allowing the user to cut-n-paste they Key JSON, so that of something goes wrong with the
browser storage they user will not loose their keys (and therefore data) because they wil be able
to reimport the JSON key text back in at any time in the future, and even onto another machine or
browser installation.

At no point in time does the users Private Key ever leave their own machine. Is never sent down the wire, and
not even any encrypted copy is ever sent down the wire either for the best-practices that are available for
Secure Messaging, short of special-purpose hardware key-storage

SYMMETRIC ENCRYPTION
--------------------
Code complete except for we have a hardcoded password instead of prompting user for the password. This feature
will be complete once we prompt user for password.

*/
class Encryption {

    /* jwk = JSON Format */
    static KEY_SAVE_FORMAT = "jwk";

    static PK_ENC_ALGO = "RSA-OAEP";
    static HASH_ALGO = "SHA-256";

    static ALGO_OPERATIONS = ["encrypt", "decrypt"];
    static OP_ENCRYPT: string[] = ["encrypt"];
    static OP_DECRYPT: string[] = ["decrypt"];

    crypto = window.crypto || (<any>window).msCrypto;
    subtle = null;
    vector: Uint8Array = null;
    keyPair = new EncryptionKeyPair(null, null);

    publicKeyJson: string = null;
    privateKeyJson: string = null;

    data = "space aliens have landed. we are not alone.";
    encrypted_data = null;
    decrypted_data = null;

    /* Object/Map where properties are passwords, and values are the Symmetric key for the password, which is basically
    a cache of keys to avoid calling crypto library redundantly for work already done. */
    passwordKeys = {};

    public masterPassword: string;

    constructor() {
        
        /* WARNING: Crypto (or at least subtle) will not be available except on Secure Origin, which means a SSL (https) 
        web address plus also localhost */

        if (!this.crypto) {
            console.log("WebCryptoAPI not available");
            return;
        }

        this.subtle = this.crypto.subtle;
        if (!this.subtle) {
            console.log("WebCryptoAPI Subtle not available");
            return;
        }

        /* Note: This is not a mistake to have this vector publicly visible. It's not a security risk. This vector is merely required
        to be large enough and random enough, but is not required to be secret. 16 randomly chosen prime numbers. 
        
        WARNING: If you change this you will NEVER be able to recover any data encrypted with it in effect, even with the correct password
        */
        this.vector = new Uint8Array([71, 73, 79, 83, 89, 37, 41, 47, 53, 67, 97, 103, 107, 109, 127, 131]);
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
        let keyPromise = this.subtle.generateKey({ //
            name: Encryption.PK_ENC_ALGO, //
            modulusLength: 2048, //
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]), //
            hash: { name: Encryption.HASH_ALGO }
        }, true, Encryption.ALGO_OPERATIONS);

        keyPromise.then(
            (key) => {
                this.keyPair.privateKey = key.privateKey;
                this.keyPair.publicKey = key.publicKey;

                this.exportKeys(this.keyPair);
                this.encrypt();
            });

        keyPromise.catch = (e) => {
            console.log(e.message);
        }
    }

    /* 
   ====================================================
   BEGIN: Asymmetric Public Key Encrypion
   ====================================================
   */

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
                name: Encryption.PK_ENC_ALGO,
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
        let encryptedDataPromise = this.subtle.encrypt({ name: Encryption.PK_ENC_ALGO, iv: this.vector }, //
            this.keyPair.publicKey, this.convertStringToArrayBufferView(this.data));

        encryptedDataPromise.then(
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
        let decryptedDataPromise = this.subtle.decrypt({ name: Encryption.PK_ENC_ALGO, iv: this.vector }, //
            this.keyPair.privateKey, this.encrypted_data);

        decryptedDataPromise.then(
            (result) => {
                this.decrypted_data = new Uint8Array(result);
                console.log("Decrypted data: " + this.convertArrayBufferViewtoString(this.decrypted_data));
            },
            (e) => {
                console.log(e.message);
            }
        );
    }

    /* 
    ====================================================
    BEGIN: Symmetric Password-based Encrypion
    ====================================================
    */

    /* Takes a promise to a password */
    public passwordDecryptString = (input: string, passwordPromise: Promise<string>): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            passwordPromise.then((password) => {
                if (!util.startsWith(input, "|")) {
                    reject("data didn't start with '|' character and is assumed to not be encrypted.");
                    return;
                }
                /* strip the pipe char off the front */
                let decryptPart = input.substring(1);

                let keyPromise = this.getSymmetricKey(password);
                keyPromise.then((key) => {
                    let buf = util.hex2buf(decryptPart);
                    let decryptedDataPromise = this.subtle.decrypt({ name: "AES-CBC", iv: this.vector }, key, buf);
                    decryptedDataPromise.then(
                        (decryptedData) => {
                            let decryptedDataArr = new Uint8Array(decryptedData);
                            let decryptedStr = this.convertArrayBufferViewtoString(decryptedDataArr);
                            resolve(decryptedStr);
                        },
                        (err) => {
                            alert("Password failed.");
                            this.masterPassword = null;
                            console.log(err);
                            reject(err);
                        }
                    );
                });
            });
        });
    }

    public getSymmetricKey = (password: string): Promise<CryptoKey> => {

        /* if we already generated they key for this password return it, without calling crypto api */
        if (this.passwordKeys[password]) {
            return Promise.resolve(this.passwordKeys[password]);
        }

        return new Promise<CryptoKey>((resolve, reject) => {
            let hashPromise = this.subtle.digest({ name: "SHA-256" }, this.convertStringToArrayBufferView(password));

            hashPromise.then((hash) => {
                let keyPromise = this.subtle.importKey("raw", hash, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]);

                keyPromise.then((key) => {
                    /* cache this key for later use */
                    this.passwordKeys[password] = key;
                    resolve(key);
                },
                    (err) => {
                        console.log(err);
                        reject(err);
                    });
            },
                (err) => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    /* Returns a Promise of the encrypted string */
    public passwordEncryptString = (input: string, passwordPromise: Promise<string>): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            passwordPromise.then((password) => {
                let keyPromise = this.getSymmetricKey(password);

                keyPromise.then((key) => {
                    let hexPromise = this.passwordEncryptWithKey(input, key);
                    hexPromise.then((encHex) => {
                        resolve("|" + encHex);
                    },
                        (err) => {
                            console.log(err);
                            reject(err);
                        });
                },
                    (err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        });
    }

    /* Returns a promise to the encrypted string whose encrypted bytes are represented as hex string */
    private passwordEncryptWithKey = (data: string, key: any): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            let encryptedDataPromise = this.subtle.encrypt({ name: "AES-CBC", iv: this.vector }, key, this.convertStringToArrayBufferView(data));
            encryptedDataPromise.then(
                (encryptedData) => {
                    let arr = new Uint8Array(encryptedData);
                    let encHex = util.buf2hex(arr);
                    resolve(encHex);
                },
                (err) => {
                    console.log(err.message);
                    reject(err);
                }
            );
        });
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
export let encryption: Encryption = new Encryption();
export default encryption;
