console.log("running module: props.js");

var props = function() {

	var _savePropertyResponse = function(res) {
		util.checkSuccess("Save properties", res);

		edit.editNode.properties.push(res.propertySaved)
		meta64.changePage(editNodePg);
		meta64.treeDirty = true;
	}

	var _deletePropertyResponse = function(res, propertyToDelete) {

		if (util.checkSuccess("Delete property", res)) {

			/*
			 * remove deleted property from client side storage, so we can
			 * re-render screen without making another call to server
			 */
			props.deletePropertyFromLocalData(propertyToDelete);

			/* now just re-render screen from local variables */
			meta64.changePage(editNodePg);
			meta64.treeDirty = true;
		}
	}

	var _ = {
		/*
		 * Toggles display of properties in the gui.
		 */
		propsToggle : function() {
			meta64.showProperties = meta64.showProperties ? false : true;
			// setDataIconUsingId("#editModeButton", editMode ? "edit" :
			// "forbidden");

			// fix for polymer
			// var elm = $("#propsToggleButton");
			// elm.toggleClass("ui-icon-grid", meta64.showProperties);
			// elm.toggleClass("ui-icon-forbidden", !meta64.showProperties);

			render.renderPageFromData();
			view.scrollToSelectedNode();
			meta64.selectTab("mainTabName");
		},

		/*
		 * Deletes the property of the specified name on the node being edited,
		 * but first gets confirmation from user
		 */
		deleteProperty : function(propName) {

			(new ConfirmDlg("Confirm Delete", "Delete the Property", "Yes, delete.", function() {
				_.deletePropertyImmediate(propName);
			})).open();
		},

		deletePropertyImmediate : function(propName) {

			var ironRes = util.json("deleteProperty", {
				"nodeId" : edit.editNode.id,
				"propName" : propName
			});

			ironRes.completes.then(function() {
				_deletePropertyResponse(ironRes.response, propName);
			});
		},

		addProperty : function() {
			meta64.changePage(editPropertyPg);
		},

		populatePropertyEdit : function() {
			var field = '';

			/* Property Name Field */
			{
				var fieldPropNameId = "addPropertyNameTextContent";

				field += render.tag("paper-textarea", {
					"name" : fieldPropNameId,
					"id" : fieldPropNameId,
					"placeholder" : "Enter property name",
					"label" : "Name"
				}, "", true);
			}

			/* Property Value Field */
			{
				var fieldPropValueId = "addPropertyValueTextContent";

				field += render.tag("paper-textarea", {
					"name" : fieldPropValueId,
					"id" : fieldPropValueId,
					"placeholder" : "Enter property text",
					"label" : "Value"
				}, "", true);
			}

			/* display the node path at the top of the edit page */
			view.initEditPathDisplayById("#editPropertyPathDisplay");

			util.setHtmlEnhanced("addPropertyFieldContainer", field);
		},

		saveProperty : function() {
			var propertyNameData = util.getInputVal("addPropertyNameTextContent");
			var propertyValueData = util.getInputVal("addPropertyValueTextContent");

			var postData = {
				nodeId : edit.editNode.id,
				propertyName : propertyNameData,
				propertyValue : propertyValueData
			};
			util.json("saveProperty", postData, _savePropertyResponse);
		},

		addSubProperty : function(fieldId) {
			var prop = meta64.fieldIdToPropMap[fieldId];

			var isMulti = util.isObject(prop.values);

			/* convert to multi-type if we need to */
			if (!isMulti) {
				prop.values = [];
				prop.values.push(prop.value);
				prop.value = null;
			}

			/*
			 * now add new empty property and populate it onto the screen
			 * 
			 * TODO: for performance we could do something simpler than
			 * 'populateEditNodePg' here, but for now we just rerendering the
			 * entire edit page.
			 */
			prop.values.push('');
			edit.populateEditNodePg();
		},

		clearProperty : function(fieldId) {

			util.setInputVal(fieldId, "");

			/* scan for all multi-value property fields and clear them */
			var counter = 0;
			while (counter < 1000) {
				
				if (!util.setInputVal(fieldId + "_subProp" + counter, "")) {
					break;
				}
				counter++;
			}
		},

		deletePropertyFromLocalData : function(propertyName) {
			for (var i = 0; i < edit.editNode.properties.length; i++) {
				if (propertyName === edit.editNode.properties[i].name) {
					// splice is how you delete array elements in js.
					edit.editNode.properties.splice(i, 1);
					break;
				}
			}
		},

		makeMultiPropEditor : function(fieldId, prop, isReadOnlyProp, isBinaryProp) {
			console.log("************* Making Multi Editor: Property multi-type: name=" + prop.name + " count="
					+ prop.values.length);
			var fields = '';

			var propList = prop.values;
			if (!propList || propList.length == 0) {
				propList = [];
				propList.push("");
			}

			for (var i = 0; i < propList.length; i++) {
				console.log("prop multi-val[" + i + "]=" + propList[i]);
				var id = fieldId + "_subProp" + i;

				var propVal = isBinaryProp ? "[binary]" : propList[i];
				var propValStr = propVal ? propVal : '';
				propValStr = propVal.escapeForAttrib();
				var label = (i == 0 ? prop.name : "*") + "." + i;

				console.log("Creating textarea with id=" + id);

				if (isBinaryProp || isReadOnlyProp) {
					fields += render.tag("paper-textarea", {
						"id" : id,
						"readonly" : "readonly",
						"disabled" : "disabled",
						"label" : label,
						"value" : propValStr
					}, '', true);
				} else {
					fields += render.tag("paper-textarea", {
						"id" : id,
						"label" : label,
						"value" : propValStr
					}, '', true);
				}
			}
			return fields;
		},

		makeSinglePropEditor : function(fieldId, prop, isReadOnlyProp, isBinaryProp) {
			console.log("Property single-type: " + prop.name);

			var field = '';

			var propVal = isBinaryProp ? "[binary]" : prop.value;
			var label = render.sanitizePropertyName(prop.name);
			var propValStr = propVal ? propVal : '';
			propValStr = propValStr.escapeForAttrib();
			console.log("editing: prop[" + prop.name + "] val[" + prop.val + "]");

			if (isReadOnlyProp || isBinaryProp) {
				field += render.tag("paper-textarea", {
					"id" : fieldId,
					"readonly" : "readonly",
					"disabled" : "disabled",
					"label" : label,
					"value" : propValStr
				}, '', true);
			} else {
				field += render.tag("paper-textarea", {
					"id" : fieldId,
					"label" : label,
					"value" : propValStr
				}, '', true);
			}
			return field;
		},

		/*
		 * Orders properties in some consistent manor appropriate to display in
		 * gui. Currently all we are doing is moving any 'jcr:content' property
		 * to the beginning of the list
		 * 
		 * properties will be null or a list of PropertyInfo objects
		 */
		setPreferredPropertyOrder : function(properties) {
			if (!properties)
				return;

			var newList = [];
			$.each(properties, function(i, property) {
				if (property.name === jcrCnst.CONTENT) {
					/*
					 * unshift is how javascript adds an element to the head of
					 * an array shifting to the right any existing elements
					 */
					newList.unshift(property);
				} else {
					newList.push(property);
				}
			});
			return newList;
		},

		/*
		 * properties will be null or a list of PropertyInfo objects
		 */
		renderProperties : function(properties) {
			if (properties) {
				var ret = "<table class='property-text'>";
				var propCount = 0;

				/*
				 * We don't need or want a table header, but JQuery displays an
				 * error in the JS console if it can't find the <thead> element.
				 * So we provide empty tags here, just to make JQuery happy.
				 */
				ret += "<thead><tr><th></th><th></th></tr></thead>";

				ret += "<tbody>";
				$.each(properties, function(i, property) {
					if (render.allowPropertyToDisplay(property.name)) {
						var isBinaryProp = render.isBinaryProperty(property.name);

						propCount++;
						ret += "<tr class='prop-table-row'>";

						ret += "<td class='prop-table-name-col'>" + render.sanitizePropertyName(property.name)
								+ "</td>";

						if (isBinaryProp) {
							ret += "<td class='prop-table-val-col'>[binary]</td>";
						} else if (!property.values) {
							var val = property.htmlValue ? property.htmlValue : property.value;
							ret += "<td class='prop-table-val-col'>" + render.wrapHtml(val) + "</td>";
						} else {
							ret += "<td class='prop-table-val-col'>" + props.renderPropertyValues(property.values)
									+ "</td>";
						}
						ret += "</tr>";
					} else {
						console.log("Hiding property: " + property.name);
					}
				});

				if (propCount == 0) {
					return "";
				}

				ret += "</tbody></table>";
				return ret;
			} else {
				return undefined;
			}
		},

		/*
		 * does brute force search on node (NodeInfo.java) object properties
		 * list, and returns the first property (PropertyInfo.java) with name
		 * matching propertyName, else null.
		 */
		getNodeProperty : function(propertyName, node) {
			if (!node || !node.properties)
				return null;

			for (var i = 0; i < node.properties.length; i++) {
				var prop = node.properties[i];
				if (prop.name === propertyName) {
					return prop;
				}
			}
			return null;
		},

		getNodePropertyVal : function(propertyName, node) {
			var prop = _.getNodeProperty(propertyName, node);
			return prop ? prop.value : null;
		},

		/*
		 * Returns trus if this is a comment node, that the current user doesn't
		 * own. Used to disable "edit", "delete", etc. on the GUI.
		 */
		isNonOwnedNode : function(node) {
			var createdBy = _.getNodePropertyVal(jcrCnst.CREATED_BY, node);
			return createdBy != null && createdBy != meta64.userName;
		},

		/*
		 * Returns trus if this is a comment node, that the current user doesn't
		 * own. Used to disable "edit", "delete", etc. on the GUI.
		 */
		isNonOwnedCommentNode : function(node) {
			var commentBy = _.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
			return commentBy != null && commentBy != meta64.userName;
		},

		/*
		 * Returns string representation of property value, even if multiple
		 * properties
		 */
		renderProperty : function(property) {
			if (!property.values) {
				if (!property.value || property.value.length == 0) {
					return "";
				}
				return render.wrapHtml(property.htmlValue);
			} else {
				return _.renderPropertyValues(property.values);
			}
		},

		renderPropertyValues : function(values) {
			var ret = "<div>";
			$.each(values, function(i, value) {
				ret += render.wrapHtml(value) + cnst.BR;
			});
			ret += "</div>";
			return ret;
		}
	};

	console.log("Module ready: props.js");
	return _;
}();

//# sourceURL=props.js
