package com.meta64.mobile.request;

import com.meta64.mobile.request.base.RequestBase;

/* Request for inserting new node under the parentId, just below the targetId. TargetId can be null and the new node will just be appended
 * to the end of the child list, or may even be the first (i.e. only) child.
 */
public class RenameNodeRequest extends RequestBase {
	private String nodeId;
	private String newName;

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

	public String getNewName() {
		return newName;
	}

	public void setNewName(String newName) {
		this.newName = newName;
	}
}
