console.log("EncryptionIntf.ts");

export interface EncryptionIntf {

    postConstruct(_f: any);

    KEY_SAVE_FORMAT: string;
    PK_ENC_ALGO: string;
    HASH_ALGO: string;

    ALGO_OPERATIONS;
    OP_ENCRYPT: string[];
    OP_DECRYPT: string[];

    crypto: any;
    subtle: any;
    vector: Uint8Array;
    keyPair: any;

    publicKeyJson: string;
    privateKeyJson: string;

    data: string;
    encrypted_data: any;
    decrypted_data: any;

    passwordKeys: Object;

    masterPassword: string;

    test();
    exportKeys(keyPair /* : EncryptionKeyPair todo: add type-safety here*/);
    importKey(algoOp: string[], keyName: string, key: string);
    encrypt();
    decrypt();
    passwordDecryptString(input: string, passwordPromise: Promise<string>): Promise<string>;
    getSymmetricKey(password: string): Promise<CryptoKey>;
    passwordEncryptString(input: string, passwordPromise: Promise<string>): Promise<string>;
    convertStringToArrayBufferView(str);
    convertArrayBufferViewtoString(buffer);
}
