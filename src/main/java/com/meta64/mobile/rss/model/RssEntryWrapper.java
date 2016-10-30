package com.meta64.mobile.rss.model;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sun.syndication.feed.synd.SyndContent;
import com.sun.syndication.feed.synd.SyndEntry;

public class RssEntryWrapper {
	private static final Logger log = LoggerFactory.getLogger(RssEntryWrapper.class);
	private SyndEntry entry;

	public RssEntryWrapper(SyndEntry entry) {
		this.entry = entry;
		StringBuilder sb = new StringBuilder();
		dump("  ", sb);
		log.debug(sb.toString());
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

	public SyndEntry getEntry() {
		return entry;
	}
}
