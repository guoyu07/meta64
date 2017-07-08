console.log("LocalDB.ts");

/* Wraps a transaction of the CRUD operations for access to JavaScript local storage IndexedDB API

Instantiate a new instance of this object for each operation you perform.
*/
export class LocalDB {

    static STORE_NAME = "SubNodeObjStore";
    static DB_NAME = "SubNodeDB";
    static VERSION = 1;

    //todo-0: provide proper error handling for when indexedDB cannot be initialized.
    //todo-0: I guess i'm missing the shim code. Do I need that? Need to check browser support.
    indexedDB = window.indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB || (<any>window).shimIndexedDB;

    /* Saves an object under the specified name. Basically emulating a simple "map" with string key. */
    writeObject = (val: Object): any => {
        if (!this.indexedDB) {
            throw "IndexedDB API not available in browser.";
        }
        let open = indexedDB.open(LocalDB.DB_NAME, LocalDB.VERSION);

        open.onupgradeneeded = () => {
            let db = open.result;
            let store = db.createObjectStore(LocalDB.STORE_NAME, { keyPath: "name" });
        };

        open.onsuccess = () => {
            let db = open.result;
            let tx = db.transaction(LocalDB.STORE_NAME, "readwrite");
            let store = tx.objectStore(LocalDB.STORE_NAME);

            store.put(val);

            tx.oncomplete = () => {
                db.close();
            };
        }
    }

    /* Reads an object by name and asynchronously sends it to the callback as the 'val' parameter */
    readObject = (name: string, dataSuccessCallback: (val: Object) => void): any => {
        if (!this.indexedDB) {
            throw "IndexedDB API not available in browser.";
        }
        let open = indexedDB.open(LocalDB.DB_NAME, LocalDB.VERSION);

        open.onupgradeneeded = () => {
            let db = open.result;
            let store = db.createObjectStore(LocalDB.STORE_NAME, { keyPath: "name" });
        };

        open.onsuccess = () => {
            let db = open.result;
            let tx = db.transaction(LocalDB.STORE_NAME, "readonly");
            let store = tx.objectStore(LocalDB.STORE_NAME);

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
