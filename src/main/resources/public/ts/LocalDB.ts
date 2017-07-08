console.log("LocalDB.ts");

/* Wraps a transaction of the CRUD operations for access to JavaScript local storage IndexedDB API

Instantiate a new instance of this object for each operation you perform.

The following is a sample use-case (test):
    //This code will write an object and then read it back, by looking it up by name.
    let localDB = new LocalDB();
    localDB.writeObject({ name: "clayskey", val: "testValue" });
    localDB.readObject("clayskey", (val) => {
        console.log("Readback: " + util.toJson(val));
    });
*/
export class LocalDB {

    /* DB and Store names */
    static STORE_NAME = "SubNodeObjStore";
    static DB_NAME = "SubNodeDB";

    /* WARNING: boosting the version will WIPE OUT the old database, and create a brand new one */
    static VERSION = 1;

    static ACCESS_READWRITE = "readwrite";
    static ACCESS_READONLY = "readonly";
    static KEY_NAME = "name";

    indexedDB = window.indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB || (<any>window).shimIndexedDB;

    openDB = (): IDBOpenDBRequest => {
        if (!this.indexedDB) {
            throw "IndexedDB API not available in browser.";
        }
        let open = indexedDB.open(LocalDB.DB_NAME, LocalDB.VERSION);

        open.onupgradeneeded = () => {
            let db = open.result;
            let store = db.createObjectStore(LocalDB.STORE_NAME, { keyPath: LocalDB.KEY_NAME });
        };
        return open;
    }

    /* Runs a transaction by first opening the database, and then running the transaction */
    runTrans = (access: string, runner: (store: any) => void) => {
        let open = this.openDB();
        open.onsuccess = () => {
            this.runTransWithDb(open.result, access, runner);
        }
    }

    /* Runs a transaction on the database provided */
    runTransWithDb = (db: any, access: string, runner: (store: any) => void) => {
        let tx = db.transaction(LocalDB.STORE_NAME, access);
        let store = tx.objectStore(LocalDB.STORE_NAME);

        runner(store);

        tx.oncomplete = () => {
            db.close();
        };
    }

    /* Saves an object under the specified name. Basically emulating a simple "map" with string key. */
    writeObject = (val: Object): any => {
        this.runTrans(LocalDB.ACCESS_READWRITE,
            (store: any) => {
                store.put(val);
            });
    }

    /* Reads an object by key/name and asynchronously sends it to the callback as the 'val' parameter */
    readObject = (name: string, dataSuccessCallback: (val: Object) => void): any => {
        this.runTrans(LocalDB.ACCESS_READONLY,
            (store: any) => {
                //NOTE: name is the "keyPath" value.
                let promise = store.get(name);

                promise.onsuccess = () => {
                    dataSuccessCallback(promise.result);
                };
            });
    }
}
