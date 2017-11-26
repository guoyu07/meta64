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
import { DialogBaseImpl } from "./DialogBaseImpl";
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

export class Factory {
    /* We could have implemented the
    singleton pattern in every one of these modules, but I like this better, where we centralize the
    control (sort of Inversion of Control, IoC) and make it where the objects themselves don't even 
    know they are being used as singletons (instantated only once) */
    private meta64: Meta64;
    private tag: Tag;
    private util: Util;
    private edit: Edit;
    private attachment: Attachment;
    private encryption: Encryption;
    private nav: Nav;
    private props: Props;
    private render: Render;
    private srch: Search;
    private share: Share;
    private user: User;
    private view: View;
    private podcast: Podcast;
    private systemFolder: SystemFolder;
    private domBind: DomBind;
    private rssPlugin: RssPlugin;
    private coreTypesPlugin: CoreTypesPlugin;

    /*
     * Just like in a SpringContext, we init all singletons up front and this allows circular references 
     * to exist with no problems. 
     */
    constructAll = (): void => {
        this.getMeta64();
        this.getTag();
        this.getUtil();
        this.getEdit();
        this.getAttachment();
        this.getEncryption();
        this.getNav();
        this.getProps();
        this.getRender();
        this.getSearch();
        this.getShare();
        this.getUser();
        this.getView();
        this.getPodcast();
        this.getSystemFolder();
        this.getDomBind();
        this.getRssPlugin();
        this.getCoreTypesPlugin();

        //hack for now. Constants isn't even a singleton
        (<any>window).cnst = Constants;

        (<any>window).factory = this;

        this.postConstructAll();

        PubSub.pub(Constants.PUBSUB_SingletonsReady, {
            meta64: this.meta64,
            tag: this.tag,
            util: this.util,
            edit: this.edit,
            attachment: this.attachment,
            encryption: this.encryption,
            nav: this.nav,
            props: this.props,
            render: this.render,
            srch: this.srch,
            share: this.share,
            user: this.user,
            view: this.view,
            podcast: this.podcast,
            systemFolder: this.systemFolder,
            domBind: this.domBind,
            rssPlugin: this.rssPlugin,
            coreTypesPlugin: this.coreTypesPlugin
        });

        console.log("Factory.constructAll complete.");
    }

    postConstructAll = (): void => {
        this.meta64.postConstruct(this);
        this.tag.postConstruct(this);
        this.util.postConstruct(this);
        this.edit.postConstruct(this);
        this.attachment.postConstruct(this);
        this.encryption.postConstruct(this);
        this.nav.postConstruct(this);
        this.props.postConstruct(this);
        this.render.postConstruct(this);
        this.srch.postConstruct(this);
        this.share.postConstruct(this);
        this.user.postConstruct(this);
        this.view.postConstruct(this);
        this.podcast.postConstruct(this);
        this.domBind.postConstruct(this);
        // private systemFolder: SystemFolder;
        // private rssPlugin: RssPlugin;
        // private coreTypesPlugin: CoreTypesPlugin;
    }

    /* todo-0: once refactoring is complete we can remove the setting of the window variables in global scope 
    for every one of the following getters. 
    */
    getMeta64 = (): Meta64 => {
        return this.meta64 || ((<any>window).meta64 = this.meta64 = new Meta64());
    }

    getTag = (): Tag => {
        return this.tag || ((<any>window).tag = this.tag = new Tag());
    }

    getUtil = (): Util => {
        return this.util || ((<any>window).util = this.util = new Util());
    }

    getEdit = (): Edit => {
        return this.edit || ((<any>window).edit = this.edit = new Edit());
    }

    getAttachment = (): Attachment => {
        return this.attachment || ((<any>window).attachment = this.attachment = new Attachment());
    }

    getEncryption = (): Encryption => {
        return this.encryption || ((<any>window).encryption = this.encryption = new Encryption());
    }

    getNav = (): Nav => {
        return this.nav || ((<any>window).nav = this.nav = new Nav());
    }

    getProps = (): Props => {
        return this.props || ((<any>window).props = this.props = new Props());
    }

    getRender = (): Render => {
        return this.render || ((<any>window).render = this.render = new Render());
    }

    getSearch = (): Search => {
        return this.srch || ((<any>window).srch = this.srch = new Search());
    }

    getShare = (): Share => {
        return this.share || ((<any>window).share = this.share = new Share());
    }

    getUser = (): User => {
        return this.user || ((<any>window).user = this.user = new User());
    }

    getView = (): View => {
        return this.view || ((<any>window).view = this.view = new View());
    }

    getPodcast = (): Podcast => {
        return this.podcast || ((<any>window).podcast = this.podcast = new Podcast());
    }

    getSystemFolder = (): SystemFolder => {
        return this.systemFolder || ((<any>window).systemFolder = this.systemFolder = new SystemFolder());
    }

    getDomBind = (): DomBind => {
        return this.domBind || ((<any>window).domBind = this.domBind = new DomBind());
    }

    getRssPlugin = (): RssPlugin => {
        return this.rssPlugin || ((<any>window).rssPlugin = this.rssPlugin = new RssPlugin());
    }

    getCoreTypesPlugin = (): CoreTypesPlugin => {
        return this.coreTypesPlugin || ((<any>window).coreTypesPlugin = this.coreTypesPlugin = new CoreTypesPlugin());
    }
}