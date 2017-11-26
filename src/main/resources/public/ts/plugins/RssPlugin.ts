console.log("RssPlugin.ts");

import * as I from "../Interfaces";
import { RssPluginIntf } from "../intf/RssPluginIntf";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, util, props, render, tag, podcast;

export class RssPlugin implements RssPluginIntf {

    init = () => {
        meta64.addTypeHandlers("sn:rssfeed", this.renderFeedNode, this.propOrderingFeedNode);
        meta64.addTypeHandlers("sn:rssitem", this.renderItemNode, this.propOrderingItemNode);
    }

    renderFeedNode = (node: I.NodeInfo, rowStyling: boolean): string => {
        let ret: string = "";
        let title: I.PropertyInfo = props.getNodeProperty("sn:rssFeedTitle", node);
        let desc: I.PropertyInfo = props.getNodeProperty("sn:rssFeedDesc", node);
        let imgUrl: I.PropertyInfo = props.getNodeProperty("sn:rssFeedImageUrl", node);

        let feed: string = "";
        if (title) {
            feed += render.tag("h2", {
            }, title.value);
        }
        if (desc) {
            feed += render.tag("p", {
            }, desc.value);
        }

        if (rowStyling) {
            ret += tag.div({
                "class": "jcr-content"
            }, feed);
        } else {
            ret += tag.div({
                "class": "jcr-root-content"
            },
                feed);
        }

        if (imgUrl) {
            ret += render.tag("img", {
                "style": "max-width: 200px;",
                "src": imgUrl.value
            }, null, false);
        }

        return ret;
    }

    renderItemNode = (node: I.NodeInfo, rowStyling: boolean): string => {
        let ret: string = "";
        let rssTitle: I.PropertyInfo = props.getNodeProperty("sn:rssItemTitle", node);
        let rssDesc: I.PropertyInfo = props.getNodeProperty("sn:rssItemDesc", node);
        let rssAuthor: I.PropertyInfo = props.getNodeProperty("sn:rssItemAuthor", node);
        let rssLink: I.PropertyInfo = props.getNodeProperty("sn:rssItemLink", node);
        let rssUri: I.PropertyInfo = props.getNodeProperty("sn:rssItemUri", node);

        let entry: string = "";

        if (rssLink && rssLink.value && rssTitle && rssTitle.value) {
            entry += render.tag("a", {
                "href": rssLink.value
            }, render.tag("h3", {}, rssTitle.value));
        }

        let playerUrl = podcast.getMediaPlayerUrlFromNode(node);
        if (playerUrl) {
            entry += tag.button({
                "raised": "raised",
                "onclick": () => { podcast.openPlayerDialog(node.uid); },
                "class": "standardButton"
            }, //
                "Play");
        }

        if (rssDesc && rssDesc.value) {
            entry += render.tag("p", {
            }, rssDesc.value);
        }

        if (rssAuthor && rssAuthor.value) {
            entry += tag.div({
            }, "By: " + rssAuthor.value);
        }

        if (rowStyling) {
            ret += tag.div({
                "class": "jcr-content"
            }, entry);
        } else {
            ret += tag.div({
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

        return props.orderProps(propOrder, properties);
    }

    propOrderingItemNode = (node: I.NodeInfo, properties: I.PropertyInfo[]): I.PropertyInfo[] => {
        let propOrder: string[] = [//
            "sn:rssItemTitle",
            "sn:rssItemDesc",
            "sn:rssItemLink",
            "sn:rssItemUri",
            "sn:rssItemAuthor"];

        return props.orderProps(propOrder, properties);
    }
}
