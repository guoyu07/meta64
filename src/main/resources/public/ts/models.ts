
namespace m64 {
    /* These are Client-side only models, and are not seen on the server side ever */

    /* Models a time-range in some media where an AD starts and stops */
    export class AdSegment {
        constructor(public beginTime: number,//
            public endTime: number) {
        }
    }

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
