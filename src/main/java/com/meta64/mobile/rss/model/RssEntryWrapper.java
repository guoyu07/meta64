package com.meta64.mobile.rss.model;

import java.util.List;

import com.sun.syndication.feed.synd.SyndContent;
import com.sun.syndication.feed.synd.SyndEntry;

public class RssEntryWrapper {
	private SyndEntry entry;

	public RssEntryWrapper(SyndEntry entry) {
		this.entry = entry;
		ensureUriExists();
	}

	public void dump(String indent, StringBuilder sb) {
		indent += "    ";
		sb.append(indent + "RssEntryWrapper Dump:\n");
		sb.append(indent + "Title: " + entry.getTitle() + "\n");
		sb.append(indent + "Link: " + entry.getLink() + "\n");

		dump(indent, entry.getDescription(), sb);

		if (entry.getForeignMarkup() != null) {
			sb.append(indent + "ForeignMarkup: class=" + entry.getForeignMarkup().getClass().getName());
		}

		if (entry.getWireEntry() != null) {
			sb.append(indent + "WireEntry: class=" + entry.getWireEntry().getClass().getName() + "\n");
		}

		/* recursively dump out more contents */
		List list = entry.getEnclosures();
		if (list != null) {
			sb.append(indent + "Enclosures:\n");
			for (Object obj : list) {
				sb.append(indent + "enclosure: class=" + obj.getClass().getName() + "\n");
				if (obj instanceof SyndEntry) {
					dump(indent, (SyndEntry) obj, sb);
				}
			}
		}

		/* recursively dump out more contents */
		list = entry.getContents();
		if (list != null) {
			sb.append(indent + "Contents:\n");
			for (Object obj : list) {
				sb.append(indent + "content: class=" + obj.getClass().getName() + "\n");
				if (obj instanceof SyndEntry) {
					dump(indent, (SyndEntry) obj, sb);
				}
			}
		}
	}

	public void dump(String indent, SyndContent syndContent, StringBuilder sb) {
		if (syndContent == null) return;
		indent += "    ";
		sb.append(indent + "SyndContent:\n");

		if (syndContent.getMode() != null) {
			sb.append(indent + "mode=" + syndContent.getMode() + "\n");
		}

		if (syndContent.getType() != null) {
			sb.append(indent + "type=" + syndContent.getType() + "\n");
		}

		if (syndContent.getValue() != null) {
			sb.append(indent + "value=" + syndContent.getValue() + "\n\n");
		}
	}

	public void dump(String indent, SyndEntry entry, StringBuilder sb) {
		indent += "    ";
		new RssEntryWrapper(entry).dump(indent, sb);
	}

	private void ensureUriExists() {
		// 2016 comment
		// String uri = entry.getUri();
		//
		// /*
		// * if feed entry has no uri, then force in one
		// *
		// * WARNING: you CANNOT change the format of this auto-built uri, because
		// * it is in the database, and you would also have to reformat all the
		// * database uris if you do this. But I have added 'auto-uri' as a tag
		// * that will make this at least possible if the need ever does arise,
		// * which actually should never happen
		// */
		// if (GuiUtil.isEmpty(uri)) {
		// String title = entry.getTitle();
		// String link = entry.getLink();
		//
		// if (title == null) {
		// title = "";
		// }
		//
		// if (link == null) {
		// link = "";
		// }
		//
		// if (GuiUtil.isEmpty(title) && GuiUtil.isEmpty(link)) {
		// throw new RuntimeException("malformed entry rejected.");
		// }
		//
		// entry.setUri("auto-uri:" + title + ":" + link);
		// }
	}

	public SyndEntry getEntry() {
		return entry;
	}
}
