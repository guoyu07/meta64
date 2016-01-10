console.log("running module: util.js");

var util = function() {

	var logAjax = false;
	var timeoutMessageShown = false;
	var offline = false;

	Date.prototype.stdTimezoneOffset = function() {
		var jan = new Date(this.getFullYear(), 0, 1);
		var jul = new Date(this.getFullYear(), 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	}

	Date.prototype.dst = function() {
		return this.getTimezoneOffset() < this.stdTimezoneOffset();
	}

	if (typeof String.prototype.startsWith != 'function') {
		String.prototype.startsWith = function(str) {
			return this.indexOf(str) === 0;
		};
	}

	if (typeof String.prototype.contains != 'function') {
		String.prototype.contains = function(str) {
			return this.indexOf(str) != -1;
		};
	}

	function escapeRegExp(string) {
		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}

	if (typeof String.prototype.replaceAll != 'function') {
		String.prototype.replaceAll = function(find, replace) {
			return this.replace(new RegExp(escapeRegExp(find), 'g'), replace);
		}
	}

	if (typeof String.prototype.escapeForAttrib != 'function') {
		String.prototype.escapeForAttrib = function() {
			return this.replaceAll("\"", "&quot;");
		}
	}

	if (typeof Array.prototype.indexOfObject != 'function') {
		Array.prototype.indexOfObject = function(obj) {
			for (var i = 0; i < this.length; i++) {
				if (this[i] === obj) {
					return i;
				}
			}
			return -1;
		}
	}

	var assertNotNull = function(varName) {
		if (typeof eval(varName) === 'undefined') {
			messagePg.alert("Variable not found: " + varName)
		}
	}

	/*
	 * We use this variable to determine if we are waiting for an ajax call, but
	 * the server also enforces that each session is only allowed one concurrent
	 * call and simultaneous calls would just "queue up".
	 */
	var _ajaxCounter = 0;

	var _ = {

		daylightSavingsTime : (new Date().dst()) ? true : false,

		json : function(postName, postData, callback) {

			if (offline) {
				console.log("offline: ignoring call for " + postName);
				return;
			}

			if (logAjax) {
				console.log("JSON-POST: [" + postName + "]" + JSON.stringify(postData));
			}

			/* Do not delete, research this way... */
			// var ironAjax = this.$$("#myIronAjax");
			var ironAjax = Polymer.dom(this.root).querySelector("#ironAjax");

			ironAjax.url = postTargetUrl + postName;
			ironAjax.verbose = true;
			ironAjax.body = JSON.stringify(postData);
			ironAjax.method = "POST";
			ironAjax.contentType = "application/json";

			// specify any url params this way:
			// ironAjax.params='{"alt":"json", "q":"chrome"}';

			ironAjax.handleAs = "json"; // handle-as (is prop)

			/* This not a required property */
			// ironAjax.onResponse = "util.ironAjaxResponse"; // on-response (is
			// prop)
			ironAjax.debounceDuration = "300"; // debounce-duration (is prop)

			_ajaxCounter++;
			var ironRequest = ironAjax.generateRequest();

			/**
			 * Notes
			 * <p>
			 * If using then function: promise.then(successFunction,
			 * failFunction);
			 * <p>
			 * I think the way these parameters get passed into done/fail
			 * functions, is because there are resolve/reject methods getting
			 * called with the parameters. Basically the parameters passed to
			 * 'resolve' get distributed to all the waiting methods just like as
			 * if they were subscribing in a pub/sub model. So the 'promise'
			 * pattern is sort of a pub/sub model in a way
			 * <p>
			 * The reason to return a 'promise.promise()' method is so no other
			 * code can call resolve/reject but can only react to a
			 * done/fail/complete.
			 * <p>
			 * deferred.when(promise1, promise2) creates a new promise that
			 * becomes 'resolved' only when all promises are resolved. It's a
			 * big "and condition" of resolvement, and if any of the promises
			 * passed to it end up failing, it fails this "ANDed" one also.
			 */
			ironRequest.completes.then(//

			// Handle Success
			function() {
				_ajaxCounter--;
				if (logAjax) {
					console.log("    JSON-RESULT: " + postName + "\n    JSON-RESULT-DATA: "
							+ JSON.stringify(ironRequest.response));
				}

				if (typeof callback == "function") {
					callback(ironRequest.response);
				}
			},
			// Handle Fail
			function() {
				_ajaxCounter--;
				console.log("Error in util.json");

				// poly-todo: this path is untested

				if (ironRequest.status == "403") {
					console.log("Not logged in detected in util.");
					offline = true;

					if (!timeoutMessageShown) {
						timeoutMessageShown = true;
						messagePg.alert("Session timed out. Page will refresh.");
					}

					$(window).off("beforeunload");
					window.location.href = window.location.origin;
					return;
				}

				var msg = "Server request failed.\n\n";

				/* catch block should fail silently */
				try {
					msg += "Status: " + ironRequest.statusText + "\n";
					msg += "Code: " + ironRequest.status + "\n";
				} catch (ex) {
				}

				/*
				 * this catch block should also fail silently
				 * 
				 * This was showing "classCastException" when I threw a regular
				 * "Exception" from server so for now I'm just turning this off
				 * since its' not displaying the correct message.
				 */
				// try {
				// msg += "Response: " +
				// JSON.parse(xhr.responseText).exception;
				// } catch (ex) {
				// }
				messagePg.alert(msg);
			});

			return ironRequest;
		},

//		/**
//		 * 
//		 * This is the original JQuery method no longer in use.
//		 * 
//		 * We use the convention that all calls to server are POSTs with a
//		 * 'postName' (like an RPC method name)
//		 * <p>
//		 * Note: 'callback' can be null, if you want to use the returned
//		 * 'promise' rather than passing in a function.
//		 * 
//		 */
//		jsonOrig_noLongerUsed : function(postName, postData, callback) {
//			if (offline) {
//				console.log("offline: ignoring call for " + postName);
//				return;
//			}
//
//			if (logAjax) {
//				console.log("JSON-POST: " + JSON.stringify(postData));
//			}
//
//			_ajaxCounter++;
//			var prms = $.ajax({
//				url : postTargetUrl + postName,
//				contentType : "application/json",
//				type : "post",
//				dataType : "json",
//				cache : false,
//				data : JSON.stringify(postData)
//			});
//
//			/**
//			 * Notes
//			 * <p>
//			 * If using then function: promise.then(successFunction,
//			 * failFunction);
//			 * <p>
//			 * I think the way these parameters get passed into done/fail
//			 * functions, is because there are resolve/reject methods getting
//			 * called with the parameters. Basically the parameters passed to
//			 * 'resolve' get distributed to all the waiting methods just like as
//			 * if they were subscribing in a pub/sub model. So the 'promose'
//			 * pattern is sort of a pub/sub model in a way
//			 * <p>
//			 * The reason to return a 'promise.promise()' method is so no other
//			 * code can call resolve/reject but can only react to a
//			 * done/fail/complete.
//			 * <p>
//			 * deferred.when(promise1, promise2) creates a new promise that
//			 * becomes 'resolved' only when all promises are resolved. It's a
//			 * big "and condition" of resolvement, and if any of the promises
//			 * passed to it end up failing, it fails this "ANDed" one also.
//			 */
//			prms.done(function(jqXHR) {
//				if (logAjax) {
//					console.log("JSON-RESULT: " + postName + "\nJSON-RESULT-DATA: " + JSON.stringify(jqXHR));
//				}
//
//				if (typeof callback == "function") {
//					callback(jqXHR);
//				}
//			});
//
//			prms.fail(function(xhr) {
//
//				if (xhr.status == "403") {
//					console.log("Not logged in detected in util.");
//					offline = true;
//
//					if (!timeoutMessageShown) {
//						timeoutMessageShown = true;
//						messagePg.alert("Session timed out. Page will refresh.");
//					}
//
//					$(window).off("beforeunload");
//					window.location.href = window.location.origin;
//					return;
//				}
//
//				var msg = "Server request failed.\n\n";
//
//				/* catch block should fail silently */
//				try {
//					msg += "Status: " + xhr.statusText + "\n";
//					msg += "Code: " + xhr.status + "\n";
//				} catch (ex) {
//				}
//
//				/*
//				 * this catch block should also fail silently
//				 * 
//				 * This was showing "classCastException" when I threw a regular
//				 * "Exception" from server so for now I'm just turning this off
//				 * since its' not displaying the correct message.
//				 */
//				// try {
//				// msg += "Response: " + JSON.parse(xhr.responseText).exception;
//				// } catch (ex) {
//				// }
//				messagePg.alert(msg);
//			});
//
//			prms.complete(function() {
//				_ajaxCounter--;
//			});
//
//			return prms;
//		},

		ajaxReady : function(requestName) {
			if (_ajaxCounter > 0) {
				console.log("Ignoring requests: " + requestName + ". Ajax currently in progress.");
				return false;
			}
			return true;
		},

		isAjaxWaiting : function() {
			return _ajaxCounter > 0;
		},

		/* set focus to element by id (id must start with #) */
		delayedFocus : function(id) {
			setTimeout(function() {
				$(id).focus();
			}, 1000);
		},

		/*
		 * We could have put this logic inside the json method itself, but I can
		 * forsee cases where we don't want a message to appear when the json
		 * response returns success==false, so we will have to call checkSuccess
		 * inside every response method instead, if we want that response to
		 * print a message to the user when fail happens.
		 * 
		 * requires: res.success res.message
		 */
		checkSuccess : function(opFriendlyName, res) {
			if (!res.success) {
				messagePg.alert(opFriendlyName + " failed: " + res.message);
			}
			return res.success;
		},

		/* adds all array objects to obj as a set */
		addAll : function(obj, a) {
			for (var i = 0; i < a.length; i++) {
				if (!a[i]) {
					console.error("null element in addAll at idx=" + i);
				} else {
					obj[a[i]] = true;
				}
			}
		},

		nullOrUndef : function(obj) {
			return obj === null || obj === undefined;
		},

		/*
		 * We have to be able to map any identifier to a uid, that will be
		 * repeatable, so we have to use a local 'hashset-type' implementation
		 */
		getUidForId : function(map, id) {
			/* look for uid in map */
			var uid = map[id];

			/* if not found, get next number, and add to map */
			if (!uid) {
				uid = meta64.nextUid++;
				map[id] = uid;
			}
			return uid;
		},

		elementExists : function(id) {
			if (id.startsWith("#")) {
				id = id.substring(1);
			}

			if (id.contains("#")) {
				console.log("Invalid # in domElm");
				return null;
			}

			var e = document.getElementById(id);
			return e != null;
		},

		/* Takes textarea dom Id (# optional) and returns its value */
		getTextAreaValById : function(id) {
			var domElm = _.domElm(id);
			return domElm.value;
		},

		/*
		 * Gets the RAW DOM element and displays an error message if it's not
		 * found. Do not prefix with "#"
		 */
		domElm : function(id) {
			if (id.startsWith("#")) {
				id = id.substring(1);
			}

			if (id.contains("#")) {
				console.log("Invalid # in domElm");
				return null;
			}

			var e = document.getElementById(id);
			if (!e || e.length == 0) {
				console.log("domElm Error. Required element id not found: " + id);
			}
			return e;
		},

		/*
		 * Gets the RAW DOM element and displays an error message if it's not
		 * found. Do not prefix with "#"
		 */
		polyElm : function(id) {

			if (id.startsWith("#")) {
				id = id.substring(1);
			}

			if (id.contains("#")) {
				console.log("Invalid # in domElm");
				return null;
			}
			var e = document.getElementById(id);
			if (!e || e.length == 0) {
				console.log("domElm Error. Required element id not found: " + id);
			}

			return Polymer.dom(e);
		},

		/*
		 * Gets the element and displays an error message if it's not found
		 */
		getRequiredElement : function(id) {
			var e = $(id);
			if (e == null) {
				console.log("getRequiredElement. Required element id not found: " + id);
			}
			return e;
		},

		setCheckboxVal : function(id, val) {
			$(id).prop("checked", val).checkboxradio("refresh");
		},

		isObject : function(obj) {
			return obj && obj.length != 0;
		},

		currentTimeMillis : function() {
			return new Date().getMilliseconds();
		},

		emptyString : function(val) {
			return !val || val.length == 0;
		},

		/* like jquery: $("#someId").val(); */
		getInputVal : function(id) {
			return _.polyElm(id).node.value;
		},
		
		hookSlider : function(id, func) {
			_.getRequiredElement(id).change(func);
			return true;
		},

		bindEnterKey : function(id, func) {
			_.bindKey(id, func, 13);
		},

		bindKey : function(id, func, keyCode) {
			$(id).keypress(function(e) {
				if (e.which == keyCode) { // 13==enter key code
					func();
					return false;
				}
			});
		},

		anyEmpty : function() {
			for (var i = 0; i < arguments.length; i++) {
				var val = arguments[i];
				if (!val || val.length == 0)
					return true;
			}
			return false;
		},

		/*
		 * Removed oldClass from element and replaces with newClass, and if
		 * oldClass is not present it simply adds newClass. If old class
		 * existed, in the list of classes, then the new class will now be at
		 * that position. If old class didn't exist, then new Class is added at
		 * end of class list.
		 */
		changeOrAddClass : function(elm, oldClass, newClass) {
			var elm = $(elm);
			elm.toggleClass(oldClass, false);
			elm.toggleClass(newClass, true);
		},

		/*
		 * displays message (msg) of object is not of specified type
		 */
		verifyType : function(obj, type, msg) {
			if (typeof obj !== type) {
				messagePg.alert(msg);
				return false;
			}
			return true;
		},

		setHtmlEnhanced : function(id, content) {
			if (content == null) {
				content = "";
			}

			var elm = _.domElm(id);
			var polyElm = Polymer.dom(elm);
			polyElm.node.innerHTML = content;
			
			// Not sure yet, if these two are required.
			Polymer.dom.flush();
			Polymer.updateStyles();
		},

		getPropertyCount : function(obj) {
			var count = 0;
			var prop;

			for (prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					count++;
				}
			}
			return count;
		},

		/*
		 * iterates over an object creating a string containing it's keys and
		 * values
		 */
		printObject : function(obj) {
			var val = '';
			$.each(obj, function(k, v) {
				val += k + " , " + v + "\n";
			});
			return val;
		},

		/*
		 * iterates over an object creating a string containing it's keys and
		 * values
		 */
		printProperties : function(obj) {
			if (!obj) {
				console.error("printProperties recieved null.");
				return;
			}
			var val = '';
			$.each(obj, function(k, v) {
				val += k + "\n";
			});
			return val;
		},

		/* iterates over an object creating a string containing it's keys */
		printKeys : function(obj) {
			var val = '';
			$.each(obj, function(k, v) {
				if (val.length > 0) {
					val += ',';
				}
				val += k;
			});
			return val;
		},

		/*
		 * Makes eleId enabled based on vis flag
		 * 
		 * eleId can be a DOM element or the ID of a dom element, with or
		 * without leading #
		 */
		setEnablement : function(elmId, enable) {

			var domElm = null;
			if (typeof elmId == "string") {
				domElm = _.domElm(elmId);
			} else {
				domElm = elmId;
			}

			if (domElm == null) {
				console.log("setVisibility couldn't find item: " + elmId);
				return;
			}

			if (!enable) {
				//console.log("Enabling element: " + elmId);
				domElm.disabled = true;
			} else {
				//console.log("Disabling element: " + elmId);
				domElm.disabled = false;
			}
		},

		/*
		 * Makes eleId visible based on vis flag
		 * 
		 * eleId can be a DOM element or the ID of a dom element, with or
		 * without leading #
		 */
		setVisibility : function(elmId, vis) {

			var domElm = null;
			if (typeof elmId == "string") {
				domElm = _.domElm(elmId);
			} else {
				domElm = elmId;
			}

			if (domElm == null) {
				console.log("setVisibility couldn't find item: " + elmId);
				return;
			}

			if (vis) {
				//console.log("Showing element: " + elmId);
				domElm.style.display = 'block';
			} else {
				//console.log("hiding element: " + elmId);
				domElm.style.display = 'none';
			}
		}
	};

	console.log("Module ready: util.js");
	return _;
}();

//# sourceURL=util.js

