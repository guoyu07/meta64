package com.meta64.mobile.rss;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.mongo.CreateNodeLocation;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.RunAsMongoAdmin;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.mongo.model.SubNodeTypes;
import com.meta64.mobile.rss.model.FeedNodeInfo;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.XString;
import com.sun.syndication.feed.synd.SyndEnclosureImpl;
import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.feed.synd.SyndImage;

/**
 * Utility methods related to writing RSS content pulled from online into the JCR Repository. The
 * RSS-engine is sort of a separate 'Plugin' built into SubNode as an experimental feature and is
 * not really a 'core part' of what SubNode is.
 * <p>
 * WARNING: To anyone who downloads meta64, beware the RSS stuff is a work in progress that I
 * started, and anything related to RSS is untested code and the commented code you see comes from
 * the older version of the software and is in the process of being converted. Bottom line, don't
 * try to use any RSS code or features yet.
 */
@Component
public class RssDbWriter {
	private static final Logger log = LoggerFactory.getLogger(RssDbWriter.class);

	@Autowired
	private RunAsMongoAdmin adminRunner;

	@Autowired
	private MongoApi api;

	//
	// private static ImageInfoSorter sorter = new ImageInfoSorter();
	//
	/*
	 * Write SyndFeed
	 *
	 * returns the Node of the new feed node created
	 */
	public void updateFeedNode(SyndFeed feed, FeedNodeInfo feedNodeInfo) {

		adminRunner.run(session -> {

			SubNode feedNode = api.getNode(session, feedNodeInfo.getNodeId());
			if (feedNode == null) {
				throw ExUtil.newEx("unable to find feed node id: " + feedNodeInfo.getNodeId());
			}

			// todo-1: need to check these and see if they are changed before we expend the cycles
			// to do an update/save. For now we just always resave.
			try {
				feedNode.setProp(NodeProp.RSS_FEED_TITLE, feed.getTitle());
				feedNode.setProp(NodeProp.RSS_FEED_DESC, feed.getDescription());
				feedNode.setProp(NodeProp.RSS_FEED_URI, feed.getUri());
				feedNode.setProp(NodeProp.RSS_FEED_LINK, feed.getLink());

				SyndImage image = feed.getImage();
				if (image != null) {
					if (image.getUrl() != null) {
						feedNode.setProp(NodeProp.RSS_FEED_IMAGE_URL, image.getUrl());
					}
				}

				//log.debug("Saving feedNode: "+XString.prettyPrint(feedNode));
				
				api.save(session, feedNode);
			}
			catch (Exception e) {
				throw ExUtil.newEx(e);
			}
		});
	}

	/*
	 * Write a specific SyndEntry
	 */
	public void write(MongoSession session, SubNode feedNode, final FeedNodeInfo feedNodeInfo, final SyndEntry entry) {
		try {
			SubNode newNode = api.createNode(session, feedNode, SubNodeTypes.TYPE_RSS_ITEM, 0L, CreateNodeLocation.FIRST);

			if (StringUtils.isEmpty(entry.getTitle())) {
				throw ExUtil.newEx("SyndEntry.title is empty.");
			}

			newNode.setProp(NodeProp.RSS_ITEM_TITLE, entry.getTitle());

			if (entry.getDescription() != null) {
				String desc = entry.getDescription().getValue();
				if (StringUtils.isEmpty(desc)) {
					throw ExUtil.newEx("SyndEntry.desc is empty.");
				}

				desc = desc.replaceAll("[^\\p{ASCII}]", "");
				newNode.setProp(NodeProp.RSS_ITEM_DESC, desc);
			}
			newNode.setProp(NodeProp.RSS_ITEM_URI, entry.getUri());
			newNode.setProp(NodeProp.RSS_ITEM_LINK, entry.getLink());
			newNode.setProp(NodeProp.RSS_ITEM_AUTHOR, entry.getAuthor());

			// entry.getPublishedDate();
			// entry.getUpdatedDate();

			for (Object encObj : entry.getEnclosures()) {
				if (encObj instanceof SyndEnclosureImpl) {
					SyndEnclosureImpl enc = (SyndEnclosureImpl) encObj;
					newNode.setProp(NodeProp.RSS_ITEM_ENC_TYPE, enc.getType());
					newNode.setProp(NodeProp.RSS_ITEM_ENC_LENGTH, enc.getLength());
					newNode.setProp(NodeProp.RSS_ITEM_ENC_URL, enc.getUrl());

					/*
					 * todo-1: for now we just support the first enclosure which will work for for
					 * all known situations, and will normally just be the pointer to the media
					 * content of a podcast.
					 */
					// break out of for loop
					break;
				}
			}
			
			//log.debug("Writing RSSItem: "+XString.prettyPrint(newNode));
			
			//todo-0: This works, with the save HERE, and i consider it a bug, because i called createNode above AND this is inside an admin runner
			//which SHOULD be triggering the save, so the fact that I have to force a save here, while it gets things working IS a bug.
			api.save(session,  newNode);
		}
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
	}

	//------------------------------------------------------------------------------
	// The rest of the code below commented out is from an older version of SubNode that had the ability to sample images
	// from each page that was linked to by an RSS feed item, and create a grid displaying the 6 largest images on that page, which
	// is a really awesome user experience for browsing the news, but I haven't gotten around to re-enabling this for the
	// current version of SubNode yet.
	//----------------------------------------------------------------------------
	//
	// /* construct the 6-pack of images */
	// StringBuilder imgBlock = new StringBuilder();
	// processEntryImages(entry, wFeed, imgBlock, description);
	// // if (Constants.debug_rssImages) {
	// // ALog.log("IMG BLOCK: "+imgBlock.toString());
	// // }
	// sb.append(imgBlock.toString());
	//
	// /* append all enclosures listed in the entry */
	// if (entry.getEnclosures().size() > 0) {
	//
	// int encCounter = 0;
	// for (Object encObj : entry.getEnclosures()) {
	// if (encObj instanceof SyndEnclosureImpl) {
	// SyndEnclosureImpl sei = (SyndEnclosureImpl) encObj;
	//
	// /* avoid outputting twice */
	// if (mediaUrls.contains(sei.getUrl())) {
	// continue;
	// }
	// /*
	// * add to set to avoid outputting twice, in case there is an
	// * enclosure for this same media content.
	// */
	// mediaUrls.add(sei.getUrl());
	//
	// if (Constants.debug_rssInternals) {
	// ALog.log("Enclosure Url: " + sei.getUrl());
	// }
	//
	// if (encCounter == 0) {
	// sb.append("<p>");
	// } else {
	// sb.append("<br>");
	// }
	//
	// sb.append(render(false, sei));
	// encCounter++;
	// }
	// }
	// }
	//
	// /* append footer at very bottom of each entry */
	// sb.append("<div class='rss-entry-footer'>");
	// sb.append(getEntryFooter(wFeed, entry));
	// sb.append("</div>");
	//
	// return sb.toString();
	// }
	//
	// private static void renderMediaModules(SyndEntry entry, MessageCollector msgCollector,
	// StringBuilder sb, HashSet<String> mediaUrls)
	// {
	// Module module = entry.getModule(MediaModule.URI);
	// if (module instanceof MediaEntryModule) {
	// MediaEntryModule mem = (MediaEntryModule) module;
	//
	// /* process media content */
	// int mediaCounter = 0;
	// for (MediaContent content : mem.getMediaContents()) {
	//
	// if (Constants.debug_rssMimes) {
	// ALog.log("mediaContent.type=" + content.getType());
	// }
	//
	// if (Constants.debug_rssInternals) {
	// ALog.log("Media reference: " + content.getReference().toString());
	// }
	//
	// if (content.getReference() != null) {
	//
	// /* avoid outputting twice */
	// if (mediaUrls.contains(content.getReference().toString())) {
	// continue;
	// }
	// mediaUrls.add(content.getReference().toString());
	//
	// String htm = renderMediaHtml(entry, msgCollector, content);
	// if (htm != null) {
	// if (mediaCounter > 0) {
	// sb.append("<br>");
	// }
	// sb.append(htm);
	// mediaCounter++;
	// }
	// }
	// }
	// }
	// }
	//
	// private static String renderMediaHtml(SyndEntry entry, MessageCollector msgCollector,
	// MediaContent content) {
	//
	// /* IMAGE */
	// if (MimeTypesMap.isImageType(content.getType())) {
	//
	// if (Constants.debug_rssMimes) {
	// ALog.log("content mime isImage=" + content.getReference().toString());
	// }
	// return "<img class='rss-media-image' src='" + content.getReference().toString() + "'>";
	// }
	// /* AUDIO Player Embedding */
	// else if (MimeTypesMap.isAudioType(content.getType())) {
	// if (Constants.debug_rssMimes) {
	// ALog.log("content mime isAudio=" + content.getReference().toString());
	// }
	// return "<a target='_blank' class='rss-enclosure-play' href='" +
	// content.getReference().toString() + "'><b>Play Audio:</b> "
	// + content.getReference().toString() + "</a>";
	// }
	// /* VIDEO Player Embedding */
	// else if (MimeTypesMap.isVideoType(content.getType())) {
	// if (Constants.debug_rssMimes) {
	// ALog.log("content mime isVideo=" + content.getReference().toString());
	// }
	// return "<a target='_blank' class='rss-enclosure-play' href='" +
	// content.getReference().toString() + "'><b>Play Video:</b> "
	// + content.getReference().toString() + "</a>";
	// } else {
	// if (content.getReference() != null && content.getType() != null &&
	//
	// /*
	// * I'm not sure where this string null is originating but I think it
	// * actually there, and I want to ignore it for now and not bother
	// * looking into this yet
	// */
	// !content.getType().equals("null")) {
	// msgCollector.addMessage("<br>Unhandled media content (" + content.getType() + ")-> " +
	// content.getReference()
	// + " in entry " + entry.getTitle());
	// }
	// return null;
	// }
	// }
	//
	// /*
	// * when processing images we specifically ignore any image urls that are
	// * contained in the 'description' text or else we could end up rendering
	// * that image twice.
	// *
	// * The description is the main display of the RSS entry. The main HTML
	// * content presented to user.
	// */
	// private static void processEntryImages(SyndEntry entry, RssFeedWrapper wFeed, StringBuilder
	 // imgBlock, String description) {
	 // try {
	 // if (Constants.debug_rssInternals) {
	 // ALog.log("===== Processing images for rss entry: " + entry.getTitle());
	 // }
	 //
	 // /*
	 // * build a list of all images referenced in the HTML at the link,
	 // * and they will all come back with their sizes known/determined
	 // */
	 // List<ImageInfo> imageList = null;
	 // int timeoutRetries = 4;
	 //
	 // while (imageList == null && --timeoutRetries > 0) {
	 // ThreadUtil.shortYield();
	 // // &&&& serviceCore.shutdownCheckException();
	 //
	 // try {
	 // imageList = SoupParser.parseImages(entry.getLink(), description);
	 // } catch (SocketTimeoutException timeout) {
	 // ALog.log("timed out reading: " + entry.getLink());
	 // }
	 //
	 // // &&&& (bring back block)
	 // // if (ServiceCore.isShuttingDown()) {
	 // // throw new
	 // // Exception("Rss processing interrupted by server shutdown");
	 // // }
	 // }
	 //
	 // if (imageList != null && imageList.size() > 0) {
	 //
	 // /* sorts images in descending order of size */
	 // Collections.sort(imageList, sorter);
	 //
	 // /*
	 // * allow for the possibility of many duplicates by only chopping
	 // * down sorted list to top 20
	 // */
	 // while (imageList.size() > 20) {
	 // imageList.remove(imageList.size() - 1);
	 // }
	 //
	 // /*
	 // * so now we have 20 to consider and we remove duplicates from
	 // * imageList, before processing
	 // */
	 // new DuplicateImageDetector().removeDuplicates(imageList);
	 //
	 // int imageCount = 0;
	 //
	 // /* WARNING: this must match width of css class 'rss-image-row' */
	 // int forcedWidth = Constants.LARGE_IMAGE_WIDTH;
	 // boolean divOpened = false;
	 //
	 // /*
	 // * scan images to build up a grid of them left to right, top to
	 // * bottom
	 // */
	 // for (ImageInfo info : imageList) {
	 // ThreadUtil.shortYield();
	 // if (Constants.debug_rssImages) {
	 // ALog.log("Building 6pack with image: " + info.getUrl());
	 // }
	 //
	 // /*
	 // * if we get down to tiny images we're done in this loop
	 // * because we are sorted by size and so we know the rest of
	 // * the images encountered in this loop will this size or
	 // * smaller
	 // */
	 // if (info.getWidth() < 170)
	 // break;
	 //
	 // String lcUrl = info.getUrl().toLowerCase();
	 //
	 // /*
	 // * SampledImageMap contains the map of images that have
	 // * actually been used on a 6-pack layout, on this feed,
	 // * during this cycle of RSS processing.
	 // *
	 // * if this url is not a sampled one then take it, basically
	 // * meaning that we won't display the same image that we have
	 // * already displayed in some known rss entry that we just
	 // * parsed. We end up showing more DIFFERENT images to the
	 // * user this way while also avoiding duplicates most of the
	 // * time.
	 // */
	 // if (wFeed.getSampledImageMap().contains(lcUrl))
	 // continue;
	 // wFeed.getSampledImageMap().add(lcUrl);
	 //
	 // /* do this lazily here and only one time */
	 // if (!divOpened) {
	 // divOpened = true;
	 //
	 // /*
	 // * putting images in divs to keep them from wrapping
	 // * automatically
	 // */
	 // imgBlock.append("<div class='rss-image-row'>");
	 // }
	 //
	 // int gap = 12;
	 //
	 // /*
	 // * we have a forced width so we scale the height so that
	 // * there is no warping of image (in other words we maintain
	 // * the same width to height ratio in our sizes
	 // */
	 // int height = forcedWidth * info.getHeight() / info.getWidth();
	 // imgBlock.append("<a target='_blank' href='" + info.getUrl() + "'>");
	 //
	 // /*
	 // * the -12 in these sizes is to bring down to where the
	 // * margins/padding has no bad effect
	 // */
	 // imgBlock.append("<img class='rss-packed-image' width='" + String.valueOf(forcedWidth -
	 //gap)+
	// "px' height='"
	// + String.valueOf(height - gap) + "px' src='" + info.getUrl() + "'>");
	//
	// imgBlock.append("</a>");
	//
	// if (++imageCount >= 6) {
	// break;
	// }
	//
	// switch (imageCount) {
	// case 1:
	// imgBlock.append("</div><div class='rss-image-row'>");
	// /* after first row, drop in half */
	// forcedWidth = Constants.LARGE_IMAGE_WIDTH / 2;
	// break;
	// case 3:
	// imgBlock.append("</div><div class='rss-image-row'>");
	// /* for last 4 images be quarter size */
	// forcedWidth = Constants.LARGE_IMAGE_WIDTH / 3;
	// break;
	// default:
	// break;
	// }
	//
	// // &&&&
	// // if (ServiceCore.isShuttingDown()) {
	// // throw new
	// // Exception("Rss processing interrupted by server shutdown");
	// // }
	// }
	//
	// if (divOpened) {
	// imgBlock.append("</div>"); // close row divs
	// }
	// }
	// } catch (UnsupportedMimeTypeException mimeEx) {
	// ALog.log("not processing images (likely media type): " + entry.getLink(), mimeEx);
	// } catch (Exception e) {
	// ALog.log("parsing images from link failed for url: " + entry.getLink(), e);
	// }
	// }
	//
	// private static String getEntryFooter(RssFeedWrapper wFeed, SyndEntry entry) {
	//
	// StringBuilder sb = new StringBuilder();
	//
	// boolean wroteText = false;
	//
	// if (!GuiUtil.isEmpty(entry.getAuthor())) {
	// wroteText = true;
	// sb.append("Author: ");
	// sb.append(entry.getAuthor());
	// }
	//
	// if (entry.getPublishedDate() != null) {
	// if (wroteText) {
	// sb.append(", ");
	// }
	// wroteText = true;
	// sb.append("Published: ");
	// sb.append(entry.getPublishedDate());
	// }
	//
	// /*
	// * updated kept jumping to a newline, so I'm just cramming it into the
	// * link. no time to mess with this piddly crap
	// */
	// if (entry.getUpdatedDate() != null) {
	// if (wroteText) {
	// sb.append(", ");
	// }
	// wroteText = true;
	// sb.append("Updated: ");
	// sb.append(entry.getUpdatedDate());
	// }
	//
	// if (wroteText) {
	// sb.append("<br>");
	// }
	// sb.append("Source: ");
	// sb.append(wFeed.getFeed().getTitle());
	// sb.append("<br>");
	// sb.append("RSS: ");
	// sb.append(wFeed.getUrl());
	//
	// return sb.toString();
	// }
	//
	// private static String makeTitleHtm(SyndEntry entry, RssFeedWrapper wFeed) {
	//
	// if (entry.getLink() != null) {
	// StringBuilder sb = new StringBuilder();
	// sb.append("<a target='_blank' class='rss-entry-title' href='");
	// sb.append(entry.getLink());
	// sb.append("'>");
	// sb.append(entry.getTitle());
	// sb.append("</a>");
	// return sb.toString();
	// }
	//
	// return null;
	// }
	//
	// /* builds a table out of the list. List can be anything of course */
	// public static String buildTableFromList(List<String> list, int maxCols) {
	// if (list.size() == 0 || maxCols == 0)
	// return "";
	// StringBuilder sb = new StringBuilder();
	//
	// boolean inRow = false;
	// sb.append("<table>");
	//
	// int colCounter = 0;
	// for (String item : list) {
	// colCounter++;
	//
	// if (colCounter > maxCols) {
	//
	// /* if in row, finish last row */
	// if (inRow) {
	// sb.append("</tr>");
	// inRow = false;
	// }
	//
	// sb.append("<tr>");
	// inRow = true;
	// colCounter = 1;
	// }
	//
	// sb.append("<td class='rss-title-table-data'>");
	// sb.append(item);
	// sb.append("</td>");
	// }
	//
	// if (inRow) {
	// sb.append("</tr>");
	// inRow = false;
	// }
	//
	// sb.append("</table>");
	// return sb.toString();
	// }
	//
	// public static String render(boolean simpleStyle, SyndEnclosureImpl enc) {
	// StringBuilder sb = new StringBuilder();
	//
	// if (simpleStyle) {
	// sb.append(enc.getUrl());
	// sb.append(", ");
	// sb.append(String.valueOf(enc.getLength()));
	// sb.append(", ");
	// sb.append(enc.getType());
	// } else {
	// if (enc.getUrl() != null) {
	//
	// /*
	// * if this is an image type, just display image inline without
	// * linking to it
	// */
	// if (MimeTypesMap.isImageType(enc.getType())) {
	// sb.append("<img src='" + enc.getUrl() + "'/>");
	// }
	// /*
	// * else need to link to this whatever it is, can say "0 MB"
	// * still, by design so far.
	// */
	// else {
	// // todo: bring this back some day. no time to do it now.
	// // sb.append("<img class='rss-icon' src='" +
	// // getIconForType(enc.getType()) +
	// // "'>");
	//
	// // anchor begin
	// {
	// sb.append("<a target='_blank' class='rss-enclosure-play' href='");
	// sb.append(enc.getUrl());
	// sb.append("'>");
	//
	// // anchor content
	// {
	// sb.append("<b>");
	// sb.append(getPlayPrompt(enc.getType()));
	// sb.append("</b>");
	//
	// sb.append(" (");
	// sb.append(XString.memoryFormat(enc.getLength()));
	//
	// if (enc.getType() != null) {
	// sb.append(" ");
	// sb.append(enc.getType());
	// }
	// sb.append(")");
	// }
	// sb.append("</a>");
	// }
	// }
	// } else {
	// // sb.append("[url not provided]");
	// }
	// }
	//
	// return sb.toString();
	// }
	//
	// public static String getIconForType(String type) {
	// String typeLc = type.toLowerCase();
	//
	// if (typeLc.startsWith("audio")) {
	// return Constants.ICON_RSS_AUDIO;
	// } else if (typeLc.startsWith("video")) {
	// return Constants.ICON_RSS_VIDEO;
	// } else if (typeLc.startsWith("image")) {
	// return Constants.ICON_RSS_IMAGE;
	// }
	// return Constants.ICON_RSS_BINARY;
	// }
	//
	// public static String getPlayPrompt(String type) {
	// String typeLc = type.toLowerCase();
	//
	// if (typeLc.startsWith("audio")) {
	// return "Play Audio";
	// } else if (typeLc.startsWith("video")) {
	// return "Play Video";
	// } else if (typeLc.startsWith("image")) {
	// return "Show Image";
	// }
	// return "View";
	// }
}
