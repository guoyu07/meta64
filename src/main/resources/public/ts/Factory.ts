console.log("Factory.ts");

declare const System: any;

export class Factory {

    /*
     * This 'create' is used for createing our Dialogs, which follow a special pattern of using a 'default' export and
     * all having a class ending in "Impl" that's based of an interface
     *
     * todo-1: I will eventually use some form of a generic to reference an actual type for the args
     * object using the constructor function itself rather than a separately defined Interface
     * for the parameters, but i just haven't designed that code yet.
     */
    static create = function(className: string, callback?: any, args?: Object): void {
        System.import( /* "/js/" + */ className + "Impl").then(function(mod) {
            let obj = new (<any>mod).default(args || {});
            if (callback) {
                callback(obj);
            }
        });
    }

    /* todo-1: This is a bit confusing, the createPanel is same as 'create' but without expecting "Impl" suffix. It's just TechDebt and I
    know it's bad right now as I'm doing it.
    */
    static createPanel = function(className: string, callback?: any, args?: Object): void {
        System.import( /* "/js/" + */ className).then(function(mod) {
            let obj = new (<any>mod)[className](args || {});
            if (callback) {
                callback(obj);
            }
        });
    }
}
