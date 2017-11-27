console.log("Factory.ts");

/* 
This is a 'Factory', but the main thing it does is manage the singletons, somewhat analoglous to a SpringContext
but actually existing for mostly different reasons having to do with our need to support circular 
references.

WARNING: Singletons (just like in Spring) are not allowed to do any logic that requires other modules
inside their constructors becasue there is no guarantee that all (or any) of the other Singletons have
been constructed yet.

NOTE: This Factory is allowed to import anything it wants and the way we allow Circular Dependencies to exist without
being a problem is by having the rule that no other modules are allowed to import this Factory module, 
but only the interface of it.
*/
import { PubSub } from "./PubSub";
import { Meta64 } from "./Meta64";
import { SystemFolder } from "./SystemFolder";
import { Attachment } from "./Attachment";
import { Edit } from "./Edit";
import { Encryption } from "./Encryption";
import { Constants } from "./Constants";
import { DomBind } from "./DomBind";
import { Nav } from "./Nav";
import { Podcast } from "./Podcast";
import { Props } from "./Props";
import { Render } from "./Render";
import { Search } from "./Search";
import { Share } from "./Share";
import { Tag } from "./Tag";
import { User } from "./User";
import { Util } from "./Util";
import { View } from "./View";
import { RssPlugin } from "./plugins/RssPlugin";
import { CoreTypesPlugin } from "./plugins/CoreTypesPlugin";
import { Singletons } from "./Singletons";

export class Factory {
    /* 
    We could have implemented the
    singleton pattern in every one of these modules, but I like this better, where we centralize the
    control (sort of Inversion of Control, IoC) and make it where the objects themselves don't even 
    know they are being used as singletons (instantated only once).
    */
    singletons: Singletons;
    
    /*
     * Just like in a SpringContext, we init all singletons up front and this allows circular references 
     * to exist with no problems. 
     */
    constructAll = (): void => {
        this.singletons = {
            meta64: new Meta64(),
            tag: new Tag(),
            util: new Util(),
            edit: new Edit(),
            attachment: new Attachment(),
            encryption: new Encryption(),
            nav: new Nav(),
            props: new Props(),
            render: new Render(),
            srch: new Search(),
            share: new Share(),
            user: new User(),
            view: new View(),
            podcast: new Podcast(),
            //systemFolder: SystemFolderIntf;
            domBind: new DomBind(),
            rssPlugin: new RssPlugin(),
            coreTypesPlugin: new CoreTypesPlugin()
        };

        this.setGlobals();
        PubSub.pub(Constants.PUBSUB_SingletonsReady, this.singletons);
        console.log("Factory.constructAll complete.");
    }

    /* setting global variables for singletons is temporary just until the few remaining objects that
    need these are refactored over to using the new Factory pattern */
    setGlobals = (): void => {
        let w = <any>window;
        w.meta64 = this.singletons.meta64;
        w.tag = this.singletons.tag;
        w.util = this.singletons.util;
        w.edit = this.singletons.edit;
        w.attachment = this.singletons.attachment;
        w.encryption = this.singletons.encryption;
        w.nav = this.singletons.nav;
        w.props = this.singletons.props;
        w.render = this.singletons.render;
        w.srch = this.singletons.srch;
        w.share = this.singletons.share;
        w.user = this.singletons.user;
        w.view = this.singletons.view;
        w.podcast = this.singletons.podcast;
        w.domBind = this.singletons.domBind;
        w.rssPlugin = this.singletons.rssPlugin;
        w.coreTypesPlugin = this.singletons.coreTypesPlugin;

        //hack for now. Constants isn't even a singleton
        w.cnst = Constants;
        w.factory = this;
    }
}