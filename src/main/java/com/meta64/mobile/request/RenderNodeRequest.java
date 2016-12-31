package com.meta64.mobile.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RenderNodeRequest {

	/* can be node id or path. server interprets correctly no matter which */
	private String nodeId;

	/*
	 * offset for render of a child node which works like OFFSET on RDBMS. It's the point at which
	 * we start gathering nodes to return (or the number to skip over), use for pagination support.
	 */
	private int offset;

	/*
	 * holds number of levels to move up the parent chain from 'nodeId' before rendering, or zero to
	 * render at nodeId itself
	 */
	private int upLevel;
	private boolean renderParentIfLeaf;
	
	private boolean goToLastPage;

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

	public int getUpLevel() {
		return upLevel;
	}

	public void setUpLevel(int upLevel) {
		this.upLevel = upLevel;
	}

	@JsonProperty(required = false)
	public boolean isRenderParentIfLeaf() {
		return renderParentIfLeaf;
	}

	public void setRenderParentIfLeaf(boolean renderParentIfLeaf) {
		this.renderParentIfLeaf = renderParentIfLeaf;
	}

	public int getOffset() {
		return offset;
	}

	public void setOffset(int offset) {
		this.offset = offset;
	}

	public boolean isGoToLastPage() {
		return goToLastPage;
	}

	public void setGoToLastPage(boolean goToLastPage) {
		this.goToLastPage = goToLastPage;
	}
}
