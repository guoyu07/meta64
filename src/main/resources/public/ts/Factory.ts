console.log("Factory.ts");

declare const System: any;

/*
Note that the only reason we have this Factory, instead of just using ES6 Imports everywhere throughout (as we do in most files), is because of the
fact that circular-dependencies are a problem for all known module loaders, and even the ones like SystemJS which make the claim that they support
circular references. None do in reality. Luckily however I was able to break most of the problematic circulrity in the meta64 codebase
by making mainly the dialogs themselves load asynchronously with 'System.import', so we ended up with very clearn code. Actually the way ES6 works
for module loading with imports it may indeed be a mathematical impossibility for circular loading to ever work, without using
interfaces the way we do here to break that circularity.
*/
export class Factory {

    /* Note that for running as un-bundled (individual files) afaik the filePrefix might need to be "/js/" which is the path where all the modules are located,
    but when running in single large bundle file the className along is suffixient without a path */
    private static filePrefix: string = "";

    /* Creates an instance of an object exported as 'default' */
    static createDefault(className: string, callback?: any, args?: Object): void {
        System.import(Factory.filePrefix + className).then((mod) => {
            let obj = new (<any>mod).default(args || {});
            if (callback) {
                callback(obj);
            }
        });
    }

    /* Create an instance of an object assuming the naming convention is followed by having the module name be the same as the class name. */
    static create(className: string, callback?: any, args?: Object): void {
        System.import(Factory.filePrefix + className).then((mod)=>  {
            let obj = new (<any>mod)[className](args || {});
            if (callback) {
                callback(obj);
            }
        });
    }
}
