console.log("running module: props.js");

var props = function() {

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

		deletePropertyFromLocalData : function(propertyName) {
			for (var i = 0; i < edit.editNode.properties.length; i++) {
				if (propertyName === edit.editNode.properties[i].name) {
					// splice is how you delete array elements in js.
					edit.editNode.properties.splice(i, 1);
					break;
				}
			}
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
