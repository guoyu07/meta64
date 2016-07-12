
namespace m64 {
    export class PropEntry {
        constructor(public id: string, //
            public property: PropertyInfo, //
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

    export class NodeInfo {
        constructor(public id: string, //
            public path: string, //
            public name: string, //
            public primaryTypeName: string, //
            public properties: PropertyInfo[], //
            public hasChildren: boolean,//
            public hasBinary: boolean,//
            public binaryIsImage: boolean, //
            public binVer: number, //
            public width: number, //
            public height: number, //
            public childrenOrdered: boolean,

            /* Client-Side added properties */
            public uid: string,
            public createdBy: string,
            public lastModified: Date,
            public imgId: string) {
        }
    }

    export class RenderNodeResponse {
        constructor(public node: NodeInfo, public children: NodeInfo[], public displayedParent: boolean) {
        }
    }
}

class PropertyInfo {
    constructor(public type: number, //
        public name: string, //
        public value: string, //
        public values: string[], //
        public htmlValue: string) {
    }
}
