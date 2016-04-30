console.log("running module: util.js");

var util = function() {

	var logAjax = false;
	var timeoutMessageShown = false;
	var offline = false;

	Array.prototype.clone = function() {
		return this.slice(0);
	};

	Array.prototype.indexOfItemByProp = function(propName, propVal) {
		var len = this.length;
		for (var i = 0; i < len; i++) {
			if (this[i][propName] === propVal) {
				return i;
			}
		}
		return -1;
	};

	Array.prototype.arrayMoveItem = function(fromIndex, toIndex) {
		this.splice(toIndex, 0, this.splice(fromIndex, 1)[0]);
	};

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
			(new MessageDlg("Variable not found: " + varName)).open()
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

		/*
		 * Sets up an inheritance relationship so that child inherits from
		 * parent, and then returns the prototype of the child so that methods
		 * can be added to it, which will behave like member functions in
		 * classic OOP with inheritance hierarchies.
		 */
		inherit : function(parent, child) {
			child.prototype.constructor = child;
			child.prototype = Object.create(parent.prototype);
			return child.prototype;
		},

		/*
		 * If the callback function needs a 'this' context for the call, then
		 * pass the 'this' in the callbackThis parameter.
		 * 
		 * callbackPayload is passed to callback as its last parameter
		 * 
		 * todo-3: this method got too long. Need to not inline these function
		 * definitions
		 */
		json : function(postName, postData, callback, callbackThis, callbackPayload) {

			var ironAjax;
			var ironRequest;

			try {
				if (offline) {
					console.log("offline: ignoring call for " + postName);
					return;
				}

				if (logAjax) {
					console.log("JSON-POST: [" + postName + "]" + JSON.stringify(postData));
				}

				/* Do not delete, research this way... */
				// var ironAjax = this.$$("#myIronAjax");
				ironAjax = Polymer.dom(this.root).querySelector("#ironAjax");

				ironAjax.url = postTargetUrl + postName;
				ironAjax.verbose = true;
				ironAjax.body = JSON.stringify(postData);
				ironAjax.method = "POST";
				ironAjax.contentType = "application/json";

				// specify any url params this way:
				// ironAjax.params='{"alt":"json", "q":"chrome"}';

				ironAjax.handleAs = "json"; // handle-as (is prop)

				/* This not a required property */
				// ironAjax.onResponse = "util.ironAjaxResponse"; // on-response
				// (is
				// prop)
				ironAjax.debounceDuration = "300"; // debounce-duration (is
				// prop)

				_ajaxCounter++;
				ironRequest = ironAjax.generateRequest();
			} catch (ex) {
				throw "Failed starting request: " + postName;
			}

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
				try {
					_ajaxCounter--;
					if (logAjax) {
						console.log("    JSON-RESULT: " + postName + "\n    JSON-RESULT-DATA: "
								+ JSON.stringify(ironRequest.response));
					}

					if (typeof callback == "function") {
						/*
						 * This is ugly because it covers all four cases based
						 * on two booleans, but it's still the simplest way to
						 * do this
						 */
						if (callbackPayload) {
							if (callbackThis) {
								callback.call(callbackThis, ironRequest.response, callbackPayload);
							} else {
								callback(ironRequest.response, callbackPayload);
							}
						} else {
							if (callbackThis) {
								callback.call(callbackThis, ironRequest.response);
							} else {
								callback(ironRequest.response);
							}
						}
					}
				} catch (ex) {
					throw "Failed handling result of: " + postName;
				}

			},
			// Handle Fail
			function() {
				try {
					_ajaxCounter--;
					console.log("Error in util.json");

					if (ironRequest.status == "403") {
						console.log("Not logged in detected in util.");
						offline = true;

						if (!timeoutMessageShown) {
							timeoutMessageShown = true;
							(new MessageDlg("Session timed out. Page will refresh.")).open();
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
					 * This was showing "classCastException" when I threw a
					 * regular "Exception" from server so for now I'm just
					 * turning this off since its' not displaying the correct
					 * message.
					 */
					// try {
					// msg += "Response: " +
					// JSON.parse(xhr.responseText).exception;
					// } catch (ex) {
					// }
					(new MessageDlg(msg)).open();
				} catch (ex) {
					throw "Failed processing server-side fail of: " + postName;
				}

			});

			return ironRequest;
		},

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
				(new MessageDlg(opFriendlyName + " failed: " + res.message)).open();
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

		getInputVal : function(id) {
			return _.polyElm(id).node.value;
		},

		/* returns true if element was found, or false if element not found */
		setInputVal : function(id, val) {
			if (val == null) {
				val = "";
			}
			var elm = _.polyElm(id);
			if (elm) {
				elm.node.value = val;
			}
			return elm != null;
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
				(new MessageDlg(msg)).open();
				return false;
			}
			return true;
		},

		/* sets html and returns DOM element */
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

			return elm;
		},

		setHtml : function(id, content) {
			if (content == null) {
				content = "";
			}

			var elm = _.domElm(id);
			var polyElm = Polymer.dom(elm);
			polyElm.node.innerHTML = content;
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
			if (!obj) {
				return "null";
			}

			try {
				var count = 0;
				for (prop in obj) {
					if (obj.hasOwnProperty(prop)) {
						console.log("Property[" + count + "]");
						count++;
					}
				}

				var val = '';
				$.each(obj, function(k, v) {
					val += k + " , " + v + "\n";
				});
			} catch (err) {
				return "err";
			}
			return val;
		},

		/* iterates over an object creating a string containing it's keys */
		printKeys : function(obj) {
			if (!obj)
				return "null";

			var val = '';
			$.each(obj, function(k, v) {
				if (!k) {
					k = "null";
				}

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
				// console.log("Enabling element: " + elmId);
				domElm.disabled = true;
			} else {
				// console.log("Disabling element: " + elmId);
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
				// console.log("Showing element: " + elmId);
				domElm.style.display = 'block';
			} else {
				// console.log("hiding element: " + elmId);
				domElm.style.display = 'none';
			}
		}
	};

	console.log("Module ready: util.js");
	return _;
}();

// # sourceURL=util.js

