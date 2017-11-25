console.log("EncryptionIntf.ts");

export interface EncryptionIntf {
    
    postConstruct(_f : any) ;

    /* jwk = JSON Format */
    KEY_SAVE_FORMAT : string;

    PK_ENC_ALGO : string;
    HASH_ALGO : string;

    ALGO_OPERATIONS ;
    OP_ENCRYPT: string[] ;
    OP_DECRYPT: string[] ;

    crypto : any;
    subtle : any;
    vector: Uint8Array ;
    keyPair : any; 

    publicKeyJson: string ;
    privateKeyJson: string;

    data : string;
    encrypted_data : any;
    decrypted_data : any;

    /* Object/Map where properties are passwords, and values are the Symmetric key for the password, which is basically
    a cache of keys to avoid calling crypto library redundantly for work already done. */
    passwordKeys : Object;

    masterPassword: string;

 
    test () ;
    /* 
   ====================================================
   BEGIN: Asymmetric Public Key Encrypion
   ====================================================
   */

    /*
     Verifies that both keys can be exported to text (JSON), and then successfully reimported back from that text to usable form
     */
    exportKeys (keyPair /* : EncryptionKeyPair todo: add type-safety here*/) ;

    importKey (algoOp: string[], keyName: string, key: string) ;

    encrypt () ;

    decrypt () ;

    /* 
    ====================================================
    BEGIN: Symmetric Password-based Encrypion
    ====================================================
    */

    /* Takes a promise to a password */
    passwordDecryptString (input: string, passwordPromise: Promise<string>): Promise<string> ;
    getSymmetricKey (password: string): Promise<CryptoKey> ;
    /* Returns a Promise of the encrypted string */
    passwordEncryptString (input: string, passwordPromise: Promise<string>): Promise<string> ;

    convertStringToArrayBufferView (str) ;
    convertArrayBufferViewtoString (buffer) ;
}
