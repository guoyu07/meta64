console.log("LocalDB.ts");

/* Wraps a transaction of the CRUD operations for access to JavaScript local storage IndexedDB API

Instantiate a new instance of this object for each operation you perform.
*/
export class LocalDB {

    static VERSION = 1;

    //todo-0: provide proper error handling for when indexedDB cannot be initialized.
    //todo-0: I guess i'm missing the shim code. Do I need that? Need to check browser support.
    indexedDB = window.indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB || (<any>window).shimIndexedDB;

    /* Saves an object under the specified name. Basically emulating a simple "map" with string key. */
    writeObject = (val: Object): any => {
        // Open (or create) the database
        let open = indexedDB.open("MyDatabase", LocalDB.VERSION);

        // Create the schema
        open.onupgradeneeded = () => {
            debugger;
            let db = open.result;
            let store = db.createObjectStore("MyObjectStore", { keyPath: "name" });
            //let index = store.createIndex("NameIndex", ["name.last", "name.first"]);
            //this.index = this.store.createIndex("NameIndex", ["name"]);
        };

        open.onsuccess = () => {
            debugger;
            // Start a new transaction
            let db = open.result;
            let tx = db.transaction("MyObjectStore", "readwrite");
            let store = tx.objectStore("MyObjectStore");
            //this.index = this.index || this.store.index("NameIndex");

            // // Add some data
            //store.put({ id: 12345, name: { first: "John", last: "Doe" }, age: 42 });
            store.put({ name : name, val : val});
            //
            // // Query the data
            // var getJohn = store.get(12345);
            // var getBob = index.get(["Smith", "Bob"]);
            //
            // getJohn.onsuccess = function() {
            //     console.log(getJohn.result.name.first);  // => "John"
            // };
            //
            // getBob.onsuccess = function() {
            //     console.log(getBob.result.name.first);   // => "Bob"
            // };

            // Close the db when the transaction is done
            tx.oncomplete = () => {
                db.close();
            };
        }
    }

    /* Reads an object by name and asynchronously sends it to the callback as the 'val' parameter */
    readObject = (name: string, dataSuccessCallback: (val: Object) => void): any => {
        // Open (or create) the database
        let open = indexedDB.open("MyDatabase", LocalDB.VERSION);

        // Create the schema
        open.onupgradeneeded = () => {
            debugger;
            let db = open.result;
            let store = db.createObjectStore("MyObjectStore", { keyPath: "name" });
            //let index = store.createIndex("NameIndex", ["name.last", "name.first"]);
            //this.index = this.store.createIndex("NameIndex", ["name"]);
        };

        open.onsuccess = () => {
            debugger;
            // Start a new transaction
            let db = open.result;
            let tx = db.transaction("MyObjectStore", "readwrite");
            let store = tx.objectStore("MyObjectStore");
            //this.index = this.index || this.store.index("NameIndex");

            // // Add some data
            //store.put({ id: 12345, name: { first: "John", last: "Doe" }, age: 42 });
            //this.store.put({ name : name, val : val});
            //
            // // Query the data
            let promise = store.get(name);
            // var getBob = index.get(["Smith", "Bob"]);
            //
            promise.onsuccess = () => {
                dataSuccessCallback(promise.result);
            };
            //
            // getBob.onsuccess = function() {
            //     console.log(getBob.result.name.first);   // => "Bob"
            // };

            // Close the db when the transaction is done
            tx.oncomplete = () => {
                db.close();
            };
        }
    }
}
