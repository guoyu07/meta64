package com.meta64.mobile.model;

import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Primary object passed back to client to represent a 'node'. Client sees the JSON version of this,
 * in javascript.
 */
public class NodeInfo {
	private static final Logger log = LoggerFactory.getLogger(NodeInfo.class);

	private String id;
	private String path;
	private String name;
	private String primaryTypeName;
	private List<PropertyInfo> properties;
	private boolean hasChildren;
	private boolean hasBinary;
	private boolean binaryIsImage;
	private long binVer;
	private int width;
	private int height;

	/* true if parent is "orderable" node */
	private boolean childrenOrdered;

	/*
	 * These next four are set on Client Side only but I need to probably set them on server side
	 * instead or else completely generate dynamically if based on properties.
	 */
	// todo-0: uid probably would have been better as, and is used on client as an integer
	private String uid;
	private String createdBy;
	private Date lastModified;
	private String imgId;
	private String owner;

	public NodeInfo() {
	}

	public NodeInfo(String id, String path, String name, List<PropertyInfo> properties, boolean hasChildren, boolean childrenOrdered, boolean hasBinary,
			boolean binaryIsImage, long binVer, int width, int height, String primaryTypeName) {
		this.id = id;
		this.path = path;
		this.name = name;
		this.properties = properties;
		this.hasChildren = hasChildren;
		this.childrenOrdered = childrenOrdered;
		this.hasBinary = hasBinary;
		this.binaryIsImage = binaryIsImage;
		this.binVer = binVer;
		this.width = width;
		this.height = height;
		this.primaryTypeName = primaryTypeName;
	}

	public boolean isChildrenOrdered() {
		return childrenOrdered;
	}

	public void setChildrenOrdered(boolean childrenOrdered) {
		this.childrenOrdered = childrenOrdered;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<PropertyInfo> getProperties() {
		return properties;
	}

	public void setProperties(List<PropertyInfo> properties) {
		this.properties = properties;
	}

	public boolean isHasChildren() {
		return hasChildren;
	}

	public void setHasChildren(boolean hasChildren) {
		this.hasChildren = hasChildren;
	}

	public boolean isHasBinary() {
		return hasBinary;
	}

	public void setHasBinary(boolean hasBinary) {
		this.hasBinary = hasBinary;
	}

	public boolean isBinaryIsImage() {
		return binaryIsImage;
	}

	public void setBinaryIsImage(boolean binaryIsImage) {
		this.binaryIsImage = binaryIsImage;
	}

	public long getBinVer() {
		return binVer;
	}

	public void setBinVer(long binVer) {
		this.binVer = binVer;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public String getPrimaryTypeName() {
		return primaryTypeName;
	}

	public void setPrimaryTypeName(String primaryTypeName) {
		this.primaryTypeName = primaryTypeName;
	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public Date getLastModified() {
		return lastModified;
	}

	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}

	public String getImgId() {
		return imgId;
	}

	public void setImgId(String imgId) {
		this.imgId = imgId;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}
}
