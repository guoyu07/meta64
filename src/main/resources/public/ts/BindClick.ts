console.log("BindClick.ts");

class BindClick {
    /* Binds DOM IDs to functions that should be called on "onClick" */
    private idToOnClickMap: { [key: string]: Function } = {};

    constructor() {
        /* I bet there's a better way to subscribe to DOM events than this timer, but i'm using the timer for now */
        setInterval(function() {
            if (bindClick) {
                bindClick.interval();
            }
        }, 500);
    }

    private interval = (): void => {
        for (var id in this.idToOnClickMap) {
            if (this.idToOnClickMap.hasOwnProperty(id)) {
                var e = document.getElementById(id);
                if (e) {
                    (<any>e).onclick = this.idToOnClickMap[id];

                    /* i'm just goint to try and see if this creates a concurrent-modification exception during looping or not */
                    delete this.idToOnClickMap[id];
                }
            }
        }
    }

    public addOnClick(domId:string, callback:Function) {
        this.idToOnClickMap[domId] = callback;
    }
}

export let bindClick: BindClick = new BindClick();
export default bindClick;
