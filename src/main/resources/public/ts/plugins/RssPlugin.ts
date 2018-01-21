console.log("RssPlugin.ts");

import * as I from "../Interfaces";
import { RssPluginIntf } from "../intf/RssPluginIntf";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class RssPlugin implements RssPluginIntf {

    init = () => {
        S.meta64.addTypeHandlers("sn:rssfeed", this.renderFeedNode, this.propOrderingFeedNode);
        S.meta64.addTypeHandlers("sn:rssitem", this.renderItemNode, this.propOrderingItemNode);
    }

    renderFeedNode = (node: I.NodeInfo, rowStyling: boolean): string => {
        let ret: string = "";
        let title: I.PropertyInfo = S.props.getNodeProperty("sn:rssFeedTitle", node);
        let desc: I.PropertyInfo = S.props.getNodeProperty("sn:rssFeedDesc", node);
        let imgUrl: I.PropertyInfo = S.props.getNodeProperty("sn:rssFeedImageUrl", node);

        let feed: string = "";
        if (title) {
            feed += S.render.tag("h2", {
            }, title.value);
        }
        if (desc) {
            feed += S.render.tag("p", {
            }, desc.value);
        }

        if (rowStyling) {
            ret += S.tag.div({
                "class": "jcr-content"
            }, feed);
        } else {
            ret += S.tag.div({
                "class": "jcr-root-content"
            },
                feed);
        }

        if (imgUrl) {
            ret += S.render.tag("img", {
                "style": "max-width: 200px;",
                "src": imgUrl.value
            }, null, false);
        }

        return ret;
    }

    renderItemNode = (node: I.NodeInfo, rowStyling: boolean): string => {
        let ret: string = "";
        let rssTitle: I.PropertyInfo = S.props.getNodeProperty("sn:rssItemTitle", node);
        let rssDesc: I.PropertyInfo = S.props.getNodeProperty("sn:rssItemDesc", node);
        let rssAuthor: I.PropertyInfo = S.props.getNodeProperty("sn:rssItemAuthor", node);
        let rssLink: I.PropertyInfo = S.props.getNodeProperty("sn:rssItemLink", node);
        let rssUri: I.PropertyInfo = S.props.getNodeProperty("sn:rssItemUri", node);

        let entry: string = "";

        if (rssLink && rssLink.value && rssTitle && rssTitle.value) {
            entry += S.render.tag("a", {
                "href": rssLink.value
            }, S.render.tag("h3", {}, rssTitle.value));
        }

        let playerUrl = S.podcast.getMediaPlayerUrlFromNode(node);
        if (playerUrl) {
            entry += S.tag.button({
                "raised": "raised",
                "onclick": () => { S.podcast.openPlayerDialog(node.uid); },
                "class": "standardButton"
            }, //
                "Play");
        }

        if (rssDesc && rssDesc.value) {
            entry += S.render.tag("p", {
            }, rssDesc.value);
        }

        if (rssAuthor && rssAuthor.value) {
            entry += S.tag.div({
            }, "By: " + rssAuthor.value);
        }

        if (rowStyling) {
            ret += S.tag.div({
                "class": "jcr-content"
            }, entry);
        } else {
            ret += S.tag.div({
                "class": "jcr-root-content"
            },
                entry);
        }

        return ret;
    }

    propOrderingFeedNode = (node: I.NodeInfo, properties: I.PropertyInfo[]): I.PropertyInfo[] => {
        let propOrder: string[] = [//
            "sn:rssFeedTitle",
            "sn:rssFeedDesc",
            "sn:rssFeedLink",
            "sn:rssFeedUri",
            "sn:rssFeedSrc",
            "sn:rssFeedImageUrl"];

        return S.props.orderProps(propOrder, properties);
    }

    propOrderingItemNode = (node: I.NodeInfo, properties: I.PropertyInfo[]): I.PropertyInfo[] => {
        let propOrder: string[] = [//
            "sn:rssItemTitle",
            "sn:rssItemDesc",
            "sn:rssItemLink",
            "sn:rssItemUri",
            "sn:rssItemAuthor"];

        return S.props.orderProps(propOrder, properties);
    }
}
