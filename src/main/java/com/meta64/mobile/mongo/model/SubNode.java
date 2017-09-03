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
 * todo-0: One ehancement here would be to let all the 'setter' methods check to see if it is
 * genuinely CHANGING the value as opposed to keeping same value, and in that case avoid the call to
 * MongoSession.dirty(this);
 * 
 * todo-0: Also similar to above node, a 'dirty' flag right inside this object would be good, to set
 * so that even direct calls to api.save(node) would bypass any actual saving if the object is known
 * to not be dirty. (Don't forget to default to 'dirty==true' for all new objects created, but not
 * ones loaded from DB. Be carful with this! This would be a very LATE STAGE optimization.)
 */
@Document(collection = "nodes")
@TypeAlias("n1")
@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({ SubNode.FIELD_PATH, SubNode.FIELD_TYPE, SubNode.FIELD_ID, SubNode.FIELD_MAX_CHILD_ORDINAL, SubNode.FIELD_ORDINAL, SubNode.FIELD_OWNER,
		SubNode.FIELD_CREATE_TIME, SubNode.FIELD_MODIFY_TIME, SubNode.FIELD_PROPERTIES })
public class SubNode {
	public static final String FIELD_ID = "_id";

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
	
	//ACL=Access Control List
	//Keys are userNodeIds, and values is a comma delimited list of any of PrivilegeType.java values.
	public static final String FIELD_ACL = "acl";
	@Field(FIELD_ACL)
	private HashMap<String,String> acl;

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
		this.path = path;
		this.type = type;
		this.ordinal = ordinal;
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

	/* todo-0: need to add true naming of nodes */
	@Transient
	@JsonIgnore
	public String getParentPath() {
		if (getPath() == null) return null;
		return XString.truncateAfterLast(getPath(), "/");
	}

	/* todo-0: need to add true naming of nodes */
	@Transient
	@JsonIgnore
	public String getName() {
		if (getPath() == null) return null;
		return XString.parseAfterLast(getPath(), "/");
	}

	@JsonProperty(FIELD_PATH)
	public void setPath(String path) {
		MongoThreadLocal.dirty(this);
		this.path = path;
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
	public HashMap<String,String> getAcl() {
		return acl;
	}

	@JsonProperty(FIELD_ACL)
	public void setAcl(HashMap<String,String> acl) {
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

	// I'm getting "ConcurrentModificationException" whenever I enable any kind of implementation of
	// hashCode+equals,
	// and I haven't figured out why yet.
	// /*
	// * todo-0: I have not independently tested these hashCode+equals functions but found them on
	// * StackOverflow with 1293 upvotes
	// */
	// @Override
	// public int hashCode() {
	// if (id == null) return 0;
	//
	// int hashCode = id.hashCode();
	// log.debug("hashCode="+hashCode);
	// return hashCode;
	// }
	//
	// @Override
	// public boolean equals(Object obj) {
	// if (!(obj instanceof SubNode)) return false;
	// if (obj == this) return true;
	// if (((SubNode)obj).getId() == null && id == null) return true;
	// if (id==null && ((SubNode)obj).getId()!=null) return false;
	// if (((SubNode)obj).getId()==null && id!=null) return false;
	// boolean val = ((SubNode)obj).getId().equals(id);
	// log.debug("hashEquals="+val);
	// return val;
	// }
}
