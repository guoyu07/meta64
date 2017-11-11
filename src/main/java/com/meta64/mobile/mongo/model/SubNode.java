package com.meta64.mobile.mongo.model;

import java.util.Date;
import java.util.HashMap;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.meta64.mobile.mongo.MongoThreadLocal;
import com.meta64.mobile.service.Sha256Service;
import com.meta64.mobile.util.XString;

/**
 * Node paths are like:
 * 
 * /id1/id2/id2
 * 
 * Any nodes that are 'named' can have friendly names right in the path in leu of any or all IDs.
 * Requirement for a successful insert is merely that the parent must exist.
 * 
 * Forward slash delimited ids.
 * 
 * Basic path strategy:
 * 
 * https://docs.mongodb.com/manual/applications/data-models-tree-structures/
 * 
 * Node ordering of child nodes is done via 'ordinal' which is child position index.
 * 
 * todo-1: One enhancement here would be to let all the 'setter' methods check to see if it is
 * genuinely CHANGING the value as opposed to keeping same value, and in that case avoid the call to
 * MongoSession.dirty(this);
 * 
 * todo-1: Also similar to above node, a 'dirty' flag right inside this object would be good, to set
 * so that even direct calls to api.save(node) would bypass any actual saving if the object is known
 * to not be dirty. (Don't forget to default to 'dirty==true' for all new objects created, but not
 * ones loaded from DB. Be carful with this! This would be a very LATE STAGE optimization.)
 */
@Document(collection = "nodes")
@TypeAlias("n1")
@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({ SubNode.FIELD_PATH, SubNode.FIELD_PATH_HASH, SubNode.FIELD_TYPE, SubNode.FIELD_ID, SubNode.FIELD_MAX_CHILD_ORDINAL, SubNode.FIELD_ORDINAL,
		SubNode.FIELD_OWNER, SubNode.FIELD_CREATE_TIME, SubNode.FIELD_MODIFY_TIME, SubNode.FIELD_ACL, SubNode.FIELD_PROPERTIES })
public class SubNode {
	public static final String FIELD_ID = "_id";
	private boolean updateModTimeOnSave = true;

	private static final Logger log = LoggerFactory.getLogger(SubNode.class);

	@Id
	@Field(FIELD_ID)
	private ObjectId id;

	public static final String FIELD_ORDINAL = "ord";
	@Field(FIELD_ORDINAL)
	private Long ordinal;

	public static final String FIELD_MAX_CHILD_ORDINAL = "mco";
	@Field(FIELD_MAX_CHILD_ORDINAL)
	private Long maxChildOrdinal;

	public static final String FIELD_PATH = "pth";
	@Field(FIELD_PATH)
	private String path;

	public static final String FIELD_PATH_HASH = "phash";
	@Field(FIELD_PATH_HASH)
	private String pathHash;

	public static final String FIELD_TYPE = "typ";
	@Field(FIELD_TYPE)
	private String type;

	public static final String FIELD_OWNER = "own";
	@Field(FIELD_OWNER)
	private ObjectId owner;

	public static final String FIELD_CREATE_TIME = "ctm";
	@Field(FIELD_CREATE_TIME)
	private Date createTime;

	public static final String FIELD_MODIFY_TIME = "mtm";
	@Field(FIELD_MODIFY_TIME)
	private Date modifyTime;

	public static final String FIELD_PROPERTIES = "prp";
	@Field(FIELD_PROPERTIES)
	private SubNodePropertyMap properties;

	// ACL=Access Control List
	// Keys are userNodeIds, and values is a comma delimited list of any of PrivilegeType.java
	// values. However in addition to userNodeIds identifying
	// users the additional key of "public" is allowed as a key which indicates privileges granted
	// to everyone (the entire public)
	public static final String FIELD_ACL = "acl";
	@Field(FIELD_ACL)
	private HashMap<String, String> acl;

	private boolean disableParentCheck;
	private boolean writing;
	private boolean deleted;

	@PersistenceConstructor
	public SubNode() {
		MongoThreadLocal.dirty(this);
	}

	public SubNode(ObjectId owner, String path, String type, Long ordinal) {
		MongoThreadLocal.dirty(this);
		this.owner = owner;
		this.type = type;
		this.ordinal = ordinal;

		// always user setter, because we are taking a hash of this
		setPath(path);
	}

	// we don't annotate this because we have a custom getter.
	// @JsonProperty(FIELD_ID)
	public ObjectId getId() {
		return id;
	}

	@JsonProperty(FIELD_ID)
	public void setId(ObjectId id) {
		MongoThreadLocal.dirty(this);
		this.id = id;
	}

	@JsonGetter(FIELD_ID)
	public String jsonId() {
		return id != null ? id.toHexString() : null;
	}

	@JsonProperty(FIELD_PATH)
	public String getPath() {
		return path;
	}

	@JsonProperty(FIELD_PATH_HASH)
	public String getPathHash() {
		return pathHash;
	}

	@Transient
	@JsonIgnore
	public String getParentPath() {
		if (getPath() == null) return null;
		return XString.truncateAfterLast(getPath(), "/");
	}

	@Transient
	@JsonIgnore
	public String getName() {
		if (getPath() == null) return null;
		return XString.parseAfterLast(getPath(), "/");
	}

	@JsonProperty(FIELD_PATH)
	public void setPath(String path) {
		MongoThreadLocal.dirty(this);
		if (path == null) {
			pathHash = "";
		}
		/* todo-0: need to add smarts to have this not update the pathHash if it's already going to match, but not sure how to ensure that. */
		else { //if (this.path == null || pathHash==null || !this.path.equals(path)) {
			pathHash = Sha256Service.getHashOfString(path);
		}
		//log.debug("Generated PathHash: "+pathHash);
		this.path = path;
	}

	public void forcePathHashUpdate() {
		if (path == null) {
			pathHash = "";
		}
		else { //if (this.path == null || pathHash==null || !this.path.equals(path)) {
			pathHash = Sha256Service.getHashOfString(path);
		}
		//log.debug("force Generated PathHash: "+pathHash);
		MongoThreadLocal.dirty(this);
	}
	
	@JsonProperty(FIELD_PATH_HASH)
	public void setPathHash(String pathHash) {
		MongoThreadLocal.dirty(this);
		this.pathHash = pathHash;
	}

	@JsonProperty(FIELD_ORDINAL)
	public Long getOrdinal() {
		return ordinal;
	}

	@JsonProperty(FIELD_ORDINAL)
	public void setOrdinal(Long ordinal) {
		MongoThreadLocal.dirty(this);
		this.ordinal = ordinal;
	}

	@JsonProperty(FIELD_MAX_CHILD_ORDINAL)
	public Long getMaxChildOrdinal() {
		return maxChildOrdinal;
	}

	@JsonProperty(FIELD_MAX_CHILD_ORDINAL)
	public void setMaxChildOrdinal(Long maxChildOrdinal) {
		MongoThreadLocal.dirty(this);
		this.maxChildOrdinal = maxChildOrdinal;
	}

	// we don't annotate this because we have a custom getter
	// @JsonProperty(FIELD_OWNER)
	public ObjectId getOwner() {
		return owner;
	}

	@JsonProperty(FIELD_OWNER)
	public void setOwner(ObjectId owner) {
		MongoThreadLocal.dirty(this);
		this.owner = owner;
	}

	@JsonGetter(FIELD_OWNER)
	public String jsonOwner() {
		return owner != null ? owner.toHexString() : null;
	}

	@JsonProperty(FIELD_CREATE_TIME)
	public Date getCreateTime() {
		return createTime;
	}

	@JsonProperty(FIELD_CREATE_TIME)
	public void setCreateTime(Date createTime) {
		MongoThreadLocal.dirty(this);
		this.createTime = createTime;
	}

	@JsonProperty(FIELD_MODIFY_TIME)
	public Date getModifyTime() {
		return modifyTime;
	}

	@JsonProperty(FIELD_MODIFY_TIME)
	public void setModifyTime(Date modifyTime) {
		MongoThreadLocal.dirty(this);
		this.modifyTime = modifyTime;
	}

	@JsonProperty(FIELD_ACL)
	public HashMap<String, String> getAcl() {
		return acl;
	}

	@JsonProperty(FIELD_ACL)
	public void setAcl(HashMap<String, String> acl) {
		MongoThreadLocal.dirty(this);
		this.acl = acl;
	}

	@JsonProperty(FIELD_PROPERTIES)
	public SubNodePropertyMap getProperties() {
		return properties;
	}

	@JsonProperty(FIELD_PROPERTIES)
	public void setProperties(SubNodePropertyMap properties) {
		MongoThreadLocal.dirty(this);
		this.properties = properties;
	}

	@JsonIgnore
	public void setProp(String key, SubNodePropVal val) {
		MongoThreadLocal.dirty(this);
		properties().put(key, val);
	}

	@JsonIgnore
	public void setProp(String key, String val) {
		MongoThreadLocal.dirty(this);
		properties().put(key, new SubNodePropVal(val));
	}

	@JsonIgnore
	public void setProp(String key, Date val) {
		MongoThreadLocal.dirty(this);
		properties().put(key, new SubNodePropVal(val));
	}

	@JsonIgnore
	public void setProp(String key, Double val) {
		MongoThreadLocal.dirty(this);
		properties().put(key, new SubNodePropVal(val));
	}

	@JsonIgnore
	public void setProp(String key, Boolean val) {
		MongoThreadLocal.dirty(this);
		properties().put(key, new SubNodePropVal(val));
	}

	@JsonIgnore
	public void setProp(String key, Long val) {
		MongoThreadLocal.dirty(this);
		properties().put(key, new SubNodePropVal(val));
	}

	@JsonIgnore
	public void setProp(String key, Integer val) {
		MongoThreadLocal.dirty(this);
		properties().put(key, new SubNodePropVal(val));
	}

	@JsonIgnore
	public void deleteProp(String key) {
		MongoThreadLocal.dirty(this);
		properties().remove(key);
	}

	@JsonIgnore
	public String getStringProp(String key) {
		SubNodePropVal v = properties().get(key);
		if (v == null) return null;
		return (String) v.getValue();
	}

	@JsonIgnore
	public Long getIntProp(String key) {
		SubNodePropVal v = properties().get(key);
		if (v == null) return 0L;
		return (Long) v.getValue();
	}

	@JsonIgnore
	public Date getDateProp(String key) {
		SubNodePropVal v = properties().get(key);
		if (v == null) return null;
		return (Date) v.getValue();
	}

	@JsonIgnore
	public Double getFloatProp(String key) {
		SubNodePropVal v = properties().get(key);
		if (v == null) return 0.0;
		return (Double) v.getValue();
	}

	@JsonIgnore
	public Boolean getBooleanProp(String key) {
		SubNodePropVal v = properties().get(key);
		if (v == null) return false;
		return (Boolean) v.getValue();
	}

	@JsonIgnore
	private SubNodePropertyMap properties() {
		if (properties == null) {
			properties = new SubNodePropertyMap();
		}
		return properties;
	}

	@JsonProperty(FIELD_TYPE)
	public String getType() {
		return type;
	}

	@JsonProperty(FIELD_TYPE)
	public void setType(String type) {
		MongoThreadLocal.dirty(this);
		this.type = type;
	}

	@Transient
	@JsonIgnore
	public boolean isDisableParentCheck() {
		return disableParentCheck;
	}

	@Transient
	@JsonIgnore
	public void setDisableParentCheck(boolean disableParentCheck) {
		this.disableParentCheck = disableParentCheck;
	}

	@Transient
	@JsonIgnore
	public boolean isWriting() {
		return writing;
	}

	@Transient
	@JsonIgnore
	public void setWriting(boolean writing) {
		this.writing = writing;
	}

	@Transient
	@JsonIgnore
	public boolean isDeleted() {
		return deleted;
	}

	@Transient
	@JsonIgnore
	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	@JsonIgnore
	public boolean isUpdateModTimeOnSave() {
		return updateModTimeOnSave;
	}

	@JsonIgnore
	public void setUpdateModTimeOnSave(boolean updateModTimeOnSave) {
		this.updateModTimeOnSave = updateModTimeOnSave;
	}
}
