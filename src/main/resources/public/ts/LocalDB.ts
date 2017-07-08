console.log("LocalDB.ts");

/* Wraps a transaction of the CRUD operations for access to JavaScript local storage IndexedDB API

Instantiate a new instance of this object for each operation you perform.
*/
export class LocalDB {

    static STORE_NAME = "SubNodeObjStore";
    static DB_NAME = "SubNodeDB";
    static VERSION = 1;
    static ACCESS_READWRITE = "readwrite";
    static ACCESS_READONLY = "readonly";

    //todo-0: provide proper error handling for when indexedDB cannot be initialized.
    //todo-0: I guess i'm missing the shim code. Do I need that? Need to check browser support.
    indexedDB = window.indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB || (<any>window).shimIndexedDB;

    openDB = (): IDBOpenDBRequest => {
        if (!this.indexedDB) {
            throw "IndexedDB API not available in browser.";
        }
        let open: IDBOpenDBRequest = indexedDB.open(LocalDB.DB_NAME, LocalDB.VERSION);

        open.onupgradeneeded = () => {
            let db = open.result;
            let store = db.createObjectStore(LocalDB.STORE_NAME, { keyPath: "name" });
        };
        return open;
    }

    /* Saves an object under the specified name. Basically emulating a simple "map" with string key. */
    writeObject = (val: Object): any => {
        let open = this.openDB();

        open.onsuccess = () => {
            let db = open.result;
            let tx = db.transaction(LocalDB.STORE_NAME, LocalDB.ACCESS_READWRITE);
            let store = tx.objectStore(LocalDB.STORE_NAME);

            store.put(val);

            tx.oncomplete = () => {
                db.close();
            };
        }
    }

    /* Reads an object by name and asynchronously sends it to the callback as the 'val' parameter */
    readObject = (name: string, dataSuccessCallback: (val: Object) => void): any => {
        let open = this.openDB();

        open.onsuccess = () => {
            let db = open.result;
            let tx = db.transaction(LocalDB.STORE_NAME, LocalDB.ACCESS_READONLY);
            let store = tx.objectStore(LocalDB.STORE_NAME);

            //NOTE: name is the "keyPath" value.
            let promise = store.get(name);

            promise.onsuccess = () => {
                dataSuccessCallback(promise.result);
            };

            tx.oncomplete = () => {
                db.close();
            };
        }
    }
}
