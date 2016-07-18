
namespace m64 {
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
