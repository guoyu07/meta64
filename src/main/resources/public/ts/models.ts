
namespace m64 {
    /* These are Client-side only models, and are not seen on the server side ever */
    
    export class PropEntry {
        constructor(public id: string, //
            public property: json.PropertyInfo, //
            public multi: boolean, //
            public readOnly: boolean, //
            public binary: boolean, //
            public subProps: SubProp[]) {
        }
    }

    export class SubProp {
        constructor(public id: string, //
            public val: string) {
        }
    }
}
