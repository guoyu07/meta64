console.log("RssPlugin.ts");

import { meta64 } from "../Meta64";
import * as I from "../Interfaces";
import { util } from "../Util";
import { props } from "../Props";
import { render } from "../Render";
import { tag } from "../Tag";
import { podcast } from "../Podcast";

class RssPlugin {

    init = () => {
        meta64.addTypeHandlers("meta64:rssfeed", rssPlugin.renderFeedNode, rssPlugin.propOrderingFeedNode);
        meta64.addTypeHandlers("meta64:rssitem", rssPlugin.renderItemNode, rssPlugin.propOrderingItemNode);
    }

    renderFeedNode = (node: I.NodeInfo, rowStyling: boolean): string => {
        let ret: string = "";
        let title: I.PropertyInfo = props.getNodeProperty("meta64:rssFeedTitle", node);
        let desc: I.PropertyInfo = props.getNodeProperty("meta64:rssFeedDesc", node);
        let imgUrl: I.PropertyInfo = props.getNodeProperty("meta64:rssFeedImageUrl", node);

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
        let rssTitle: I.PropertyInfo = props.getNodeProperty("meta64:rssItemTitle", node);
        let rssDesc: I.PropertyInfo = props.getNodeProperty("meta64:rssItemDesc", node);
        let rssAuthor: I.PropertyInfo = props.getNodeProperty("meta64:rssItemAuthor", node);
        let rssLink: I.PropertyInfo = props.getNodeProperty("meta64:rssItemLink", node);
        let rssUri: I.PropertyInfo = props.getNodeProperty("meta64:rssItemUri", node);

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
            "meta64:rssFeedTitle",
            "meta64:rssFeedDesc",
            "meta64:rssFeedLink",
            "meta64:rssFeedUri",
            "meta64:rssFeedSrc",
            "meta64:rssFeedImageUrl"];

        return props.orderProps(propOrder, properties);
    }

    propOrderingItemNode = (node: I.NodeInfo, properties: I.PropertyInfo[]): I.PropertyInfo[] => {
        let propOrder: string[] = [//
            "meta64:rssItemTitle",
            "meta64:rssItemDesc",
            "meta64:rssItemLink",
            "meta64:rssItemUri",
            "meta64:rssItemAuthor"];

        return props.orderProps(propOrder, properties);
    }
}

export let rssPlugin: RssPlugin = new RssPlugin();
export default rssPlugin;
