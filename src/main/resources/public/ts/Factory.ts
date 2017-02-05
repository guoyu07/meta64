console.log("Factory.ts");

declare const System: any;

export class Factory {

    /* Note that for running as un-bundles (individual files) afaik the filePrefix might need to be "/js/" which is the path where all the modules are located,
    but when running in single large bundle file the className along is suffixient without a path */
    private static filePrefix: string = "";

    /* Creates an instance of an object exported as 'default' */
    static createDefault = function(className: string, callback?: any, args?: Object): void {
        System.import(Factory.filePrefix + className).then(function(mod) {
            let obj = new (<any>mod).default(args || {});
            if (callback) {
                callback(obj);
            }
        });
    }

    /* Create an instance of an object assuming the naming convention is followed by having the module name be the same as the class name. */
    static create = function(className: string, callback?: any, args?: Object): void {
        System.import(Factory.filePrefix + className).then(function(mod) {
            let obj = new (<any>mod)[className](args || {});
            if (callback) {
                callback(obj);
            }
        });
    }
}
