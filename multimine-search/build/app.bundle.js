/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );;//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);
;//     Backbone.js 1.1.0

//     (c) 2010-2011 Jeremy Ashkenas, DocumentCloud Inc.
//     (c) 2011-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.1.0';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = root.jQuery || root.Zepto || root.ender || root.$;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models);
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i] = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : _.clone(models);
      var i, l, id, model, attrs, existing, sort;
      var at = options.at;
      var targetModel = this.model;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i];
        if (attrs instanceof Model) {
          id = model = attrs;
        } else {
          id = attrs[targetModel.prototype.idAttribute];
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(id)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge) {
            attrs = attrs === model ? model.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);

          // Listen to added models' events, and index models for lookup by
          // `id` and by `cid`.
          model.on('all', this._onModelEvent, this);
          this._byId[model.cid] = model;
          if (model.id != null) this._byId[model.id] = model;
        }
        if (order) order.push(existing || model);
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || (order && order.length)) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (i = 0, l = toAdd.length; i < l; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (i = 0, l = orderedModels.length; i < l; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          (model = toAdd[i]).trigger('add', model, this, options);
        }
        if (sort || (order && order.length)) this.trigger('sort', this, options);
      }
      
      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj.id] || this._byId[obj.cid] || this._byId[obj];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp, options) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  var noXhrPatch = typeof window !== 'undefined' && !!window.ActiveXObject && !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        callback && callback.apply(router, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash and query.
  var pathStripper = /[?#].*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !atRoot) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + this.location.search + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && atRoot && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the fragment of the query and hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

}).call(this);
;// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /* jshint strict: false */

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else {
        Q = definition();
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;

    function flush() {
        /* jshint loopfunc: true */

        while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }

            try {
                task();

            } catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!

                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

                    throw e;

                } else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function() {
                       throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        flushing = false;
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process !== "undefined" && process.nextTick) {
        // Node.js before 0.9. Note that some fake-Node environments, like the
        // Mocha test runner, introduce a `process` global without a `nextTick`.
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }

    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this does have the nice side-effect of reducing the size
// of the code by reducing x.call() to merely x(), eliminating many
// hard-to-minify characters.
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
// engine that has a deployed base of browsers that support generators.
// However, SM's generators use the Python-inspired semantics of
// outdated ES6 drafts.  We would like to support ES6, but we'd also
// like to make it possible to use generators in deployed browsers, so
// we also support Python-style generators.  At some point we can remove
// this block.
var hasES6Generators;
try {
    /* jshint evil: true, nonew: false */
    new Function("(function* (){ yield 1; })");
    hasES6Generators = true;
} catch (e) {
    hasES6Generators = false;
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(value)) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = deprecate(function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    }, "valueOf", "inspect");

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become fulfilled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be fulfilled
 */
Q.race = race;
function race(answerPs) {
    return promise(function(resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function(answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = deprecate(function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        });
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var unhandledReasonsDisplayed = false;
var trackUnhandledRejections = true;
function displayUnhandledReasons() {
    if (
        !unhandledReasonsDisplayed &&
        typeof window !== "undefined" &&
        !window.Touch &&
        window.console
    ) {
        console.warn("[Q] Unhandled rejection reasons (should be empty):",
                     unhandledReasons);
    }

    unhandledReasonsDisplayed = true;
}

function logUnhandledReasons() {
    for (var i = 0; i < unhandledReasons.length; i++) {
        var reason = unhandledReasons[i];
        console.warn("Unhandled rejection reason:", reason);
    }
}

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;
    unhandledReasonsDisplayed = false;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;

        // Show unhandled rejection reasons if Node exits without handling an
        // outstanding rejection.  (Note that Browserify presently produces a
        // `process` global without the `EventEmitter` `on` method.)
        if (typeof process !== "undefined" && process.on) {
            process.on("exit", logUnhandledReasons);
        }
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
    displayUnhandledReasons();
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    if (typeof process !== "undefined" && process.on) {
        process.removeListener("exit", logUnhandledReasons);
    }
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;
            if (hasES6Generators) {
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return exception.value;
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++countDown;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, message) {
    return Q(object).timeout(ms, message);
};

Promise.prototype.timeout = function (ms, message) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(message || "Timed out after " + ms + " ms"));
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});
;/*! imjs - v3.0.0-beta - 2013-12-11 */

// This library is open source software according to the definition of the
// GNU Lesser General Public Licence, Version 3, (LGPLv3) a copy of which is
// included with this software. All use of this software is covered according to
// the terms of the LGPLv3.
// 
// The copyright is held by InterMine (www.intermine.org) and Alex Kalderimis (alex@intermine.org).

(function() {
  var HAS_CONSOLE, HAS_JSON, NOT_ENUM, hasDontEnumBug, hasOwnProperty, head, m, script, _fn, _i, _len, _ref, _ref1, _ref2, _ref3;

  HAS_CONSOLE = typeof console !== 'undefined';

  HAS_JSON = typeof JSON !== 'undefined';

  NOT_ENUM = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];

  if (!HAS_JSON) {
    script = document.createElement('script');
    script.src = 'http://cdn.intermine.org/js/json3/3.2.2/json3.min.js';
    script.type = 'text/javascript';
    head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  }

  if (Object.keys == null) {
    hasOwnProperty = Object.prototype.hasOwnProperty;
    hasDontEnumBug = !{
      toString: null
    }.propertyIsEnumerable("toString");
    Object.keys = function(o) {
      var keys, name, nonEnum, _i, _len;
      if (typeof o !== "object" && typeof o !== "" || o === null) {
        throw new TypeError("Object.keys called on a non-object");
      }
      keys = (function() {
        var _results;
        _results = [];
        for (name in o) {
          if (hasOwnProperty.call(o, name)) {
            _results.push(name);
          }
        }
        return _results;
      })();
      if (hasDontEnumBug) {
        for (_i = 0, _len = NOT_ENUM.length; _i < _len; _i++) {
          nonEnum = NOT_ENUM[_i];
          if (hasOwnProperty.call(o, nonEnum)) {
            keys.push(nonEnum);
          }
        }
      }
      return keys;
    };
  }

  if (Array.prototype.map == null) {
    Array.prototype.map = function(f) {
      var x, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        x = this[_i];
        _results.push(f(x));
      }
      return _results;
    };
  }

  if (Array.prototype.filter == null) {
    Array.prototype.filter = function(f) {
      var x, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        x = this[_i];
        if (f(x)) {
          _results.push(x);
        }
      }
      return _results;
    };
  }

  if (Array.prototype.reduce == null) {
    Array.prototype.reduce = function(f, initValue) {
      var ret, x, xs, _i, _len;
      xs = this.slice();
      ret = arguments.length < 2 ? xs.pop() : initValue;
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        ret = f(ret, x);
      }
      return ret;
    };
  }

  if (Array.prototype.forEach == null) {
    Array.prototype.forEach = function(f, ctx) {
      var i, x, _i, _len, _results;
      if (!f) {
        throw new Error("No function provided");
      }
      _results = [];
      for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
        x = this[i];
        _results.push(f.call(ctx != null ? ctx : this, x, i, this));
      }
      return _results;
    };
  }

  if (!HAS_CONSOLE) {
    this.console = {
      log: (function() {}),
      error: (function() {}),
      debug: (function() {})
    };
    if (typeof window !== "undefined" && window !== null) {
      window.console = this.console;
    }
  }

  if ((_ref = console.log) == null) {
    console.log = function() {};
  }

  if ((_ref1 = console.error) == null) {
    console.error = function() {};
  }

  if ((_ref2 = console.debug) == null) {
    console.debug = function() {};
  }

  if (console.log.apply == null) {
    console.log("Your console needs patching.");
    _ref3 = ['log', 'error', 'debug'];
    _fn = function(m) {
      var oldM;
      oldM = console[m];
      return console[m] = function(args) {
        return oldM(args);
      };
    };
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      m = _ref3[_i];
      _fn(m);
    }
  }

}).call(this);

!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.intermine=e():"undefined"!=typeof global?global.intermine=e():"undefined"!=typeof self&&(self.intermine=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*/


(function() {
  var char, keyChar, keyStr, utf8_encode;

  keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  char = String.fromCharCode;

  keyChar = function(idx) {
    return keyStr.charAt(idx);
  };

  utf8_encode = function(string) {
    var c, chars, code, i;
    string = string.replace(/\r\n/g, '\n');
    chars = (function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = string.length; _i < _len; i = ++_i) {
        c = string[i];
        code = string.charCodeAt(i);
        if (code < 128) {
          _results.push(c);
        } else if (code < 2048) {
          _results.push(char((code >> 6) | 192) + char((code & 63) | 128));
        } else {
          _results.push(char((code >> 12) | 224) + char(((char >> 6) & 63) | 128) + char((code & 63) | 128));
        }
      }
      return _results;
    })();
    return chars.join('');
  };

  exports.encode = function(input) {
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4, i, output;
    output = "";
    i = 0;
    input = utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output += [enc1, enc2, enc3, enc4].map(keyChar).join('');
    }
    return output;
  };

}).call(this);

},{}],2:[function(require,module,exports){
(function() {
  var constants;

  constants = exports;

  constants.ACCEPT_HEADER = {
    'xml': 'application/xml',
    'json': 'application/json',
    'jsonobjects': 'application/json;type=objects',
    'jsontable': 'application/json;type=table',
    'jsonrows': 'application/json;type=rows',
    'jsoncount': 'application/json;type=count',
    'jsonp': 'application/javascript',
    'jsonpobjects': 'application/javascript;type=objects',
    'jsonptable': 'application/javascript;type=table',
    'jsonprows': 'application/javascript;type=rows',
    'jsonpcount': 'application/javascript;type=count'
  };

}).call(this);

},{}],"./http":[function(require,module,exports){
module.exports=require('zlU5Ni');
},{}],"zlU5Ni":[function(require,module,exports){
(function() {
  var ACCEPT_HEADER, CHARSET, CONVERTERS, IE_VERSION, PESKY_COMMA, Promise, URLENC, annotateError, check, error, httpinvoke, matches, merge, re, streaming, success, ua, utils, withCB, _ref;

  httpinvoke = require('httpinvoke');

  Promise = require('./promise');

  ACCEPT_HEADER = require('./constants').ACCEPT_HEADER;

  _ref = utils = require('./util'), withCB = _ref.withCB, success = _ref.success, error = _ref.error, merge = _ref.merge;

  PESKY_COMMA = /,\s*$/;

  URLENC = "application/x-www-form-urlencoded";

  IE_VERSION = -1;

  if (navigator.appName === 'Microsoft Internet Explorer') {
    ua = navigator.userAgent;
    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (matches = ua.match(re)) {
      IE_VERSION = parseFloat(matches[1]);
    }
  }

  exports.getMethod = function(x) {
    switch (x) {
      case "PUT":
        return "POST";
      case "DELETE":
        return "GET";
      default:
        return x;
    }
  };

  exports.supports = function(x) {
    if (((0 < IE_VERSION && IE_VERSION < 10)) && (x === 'PUT' || x === 'DELETE')) {
      return false;
    } else {
      return true;
    }
  };

  streaming = function(data) {
    return {
      resume: (function() {}),
      pause: (function() {}),
      on: function(evt, cb) {
        var res, _i, _len, _ref1, _results;
        switch (evt) {
          case 'data':
            _ref1 = data.results;
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              res = _ref1[_i];
              _results.push(cb(res));
            }
            return _results;
          case 'end':
            return cb();
        }
      }
    };
  };

  exports.iterReq = function(method, path, format) {
    return function(q, page, cb, eb, onEnd) {
      var attach, req, _ref1;
      if (page == null) {
        page = {};
      }
      if (utils.isFunction(page)) {
        _ref1 = [{}, page, cb, eb], page = _ref1[0], cb = _ref1[1], eb = _ref1[2], onEnd = _ref1[3];
      }
      req = merge({
        format: format
      }, page, {
        query: q.toXML()
      });
      attach = function(stream) {
        console.log("Attaching");
        if (cb != null) {
          stream.on('data', cb);
        }
        if (onEnd != null) {
          stream.on('end', onEnd);
        }
        return stream;
      };
      return withCB(eb, this.makeRequest(method, path, req, null, true).then(attach));
    };
  };

  check = function(response) {
    var e, err, msg, sc, _ref1, _ref2;
    sc = response != null ? response.statusCode : void 0;
    if (((sc != null) && (200 <= sc && sc < 400)) || ((!(sc != null)) && ((response != null ? response.body : void 0) != null))) {
      return response.body;
    } else {
      msg = "Bad response: " + sc;
      err = ((_ref1 = response.body) != null ? _ref1.error : void 0) ? response.body.error : (e = (_ref2 = response.body) != null ? typeof _ref2.match === "function" ? _ref2.match(/\[ERROR\] (\d+)([\s\S]*)/) : void 0 : void 0) ? e[2] : void 0;
      if (err != null) {
        msg += ": " + err;
      }
      return error(new Error(msg));
    }
  };

  CHARSET = "; charset=UTF-8";

  CONVERTERS = {
    'text json': JSON.parse
  };

  annotateError = function(url) {
    return function(err) {
      throw new Error("Request to " + url + " failed: " + err);
    };
  };

  exports.doReq = function(opts, iter) {
    var headers, isJSON, method, options, postdata, resp, sep, url, _ref1, _ref2;
    method = opts.type;
    url = opts.url;
    headers = (_ref1 = opts.headers) != null ? _ref1 : {};
    headers.Accept = ACCEPT_HEADER[opts.dataType];
    isJSON = /json/.test(opts.dataType) || /json/.test((_ref2 = opts.data) != null ? _ref2.format : void 0);
    if (opts.data != null) {
      postdata = typeof opts.data === 'string' ? opts.data : "application/json" === opts.contentType ? JSON.stringify(opts.data) : utils.querystring(opts.data);
      if ((method === 'GET' || method === 'DELETE') && (postdata != null ? postdata.length : void 0)) {
        sep = /\?/.test(url) ? '&' : '?';
        url += sep + postdata;
        postdata = void 0;
      } else {
        headers['Content-Type'] = (opts.contentType || URLENC) + CHARSET;
      }
    }
    options = {
      timeout: opts.timeout,
      headers: headers,
      outputType: isJSON ? 'json' : 'text',
      corsExposedHeaders: ['Content-Type'],
      converters: CONVERTERS
    };
    if (postdata != null) {
      options.inputType = 'text';
      options.input = postdata;
    }
    resp = Promise.from(httpinvoke(url, method, options)).then(check, annotateError(url));
    resp.then(opts.success, opts.error);
    if (iter) {
      return resp.then(streaming);
    }
    return resp;
  };

}).call(this);

},{"./constants":2,"./promise":9,"./util":14,"httpinvoke":19}],5:[function(require,module,exports){
(function() {
  var CategoryResults, IDResolutionJob, IdResults, ONE_MINUTE, concatMap, defer, difference, fold, funcutils, get, id, intermine, uniqBy, withCB,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  funcutils = require('./util');

  intermine = exports;

  uniqBy = funcutils.uniqBy, difference = funcutils.difference, defer = funcutils.defer, withCB = funcutils.withCB, id = funcutils.id, get = funcutils.get, fold = funcutils.fold, concatMap = funcutils.concatMap;

  ONE_MINUTE = 60 * 1000;

  CategoryResults = (function() {
    var getIssueMatches;

    function CategoryResults(results) {
      var k, v;
      for (k in results) {
        if (!__hasProp.call(results, k)) continue;
        v = results[k];
        this[k] = v;
      }
    }

    CategoryResults.prototype.getStats = function(type) {
      if (type != null) {
        return this.stats[type];
      } else {
        return this.stats;
      }
    };

    getIssueMatches = concatMap(get('matches'));

    CategoryResults.prototype.getMatches = function(k) {
      var _ref;
      if (k === 'MATCH') {
        return this.matches[k];
      } else {
        return (_ref = getIssueMatches(this.matches[k])) != null ? _ref : [];
      }
    };

    CategoryResults.prototype.getMatchIds = function(k) {
      if (k != null) {
        return this.getMatches(k).map(get('id'));
      } else {
        return this.allMatchIds();
      }
    };

    CategoryResults.prototype.goodMatchIds = function() {
      return this.getMatchIds('MATCH');
    };

    CategoryResults.prototype.allMatchIds = function() {
      var combineIds,
        _this = this;
      combineIds = fold(function(res, issueSet) {
        return res.concat(_this.getMatchIds(issueSet));
      });
      return combineIds(this.goodMatchIds(), ['DUPLICATE', 'WILDCARD', 'TYPE_CONVERTED', 'OTHER']);
    };

    return CategoryResults;

  })();

  IdResults = (function() {
    var flatten, getReasons, isGood, unique;

    unique = uniqBy(id);

    flatten = concatMap(id);

    getReasons = function(match) {
      var k, vals;
      return flatten((function() {
        var _ref, _results;
        _ref = match.identifiers;
        _results = [];
        for (k in _ref) {
          vals = _ref[k];
          _results.push(vals);
        }
        return _results;
      })());
    };

    isGood = function(match, k) {
      return !(k != null) || __indexOf.call(getReasons(match), k) >= 0;
    };

    function IdResults(results) {
      var k, v;
      for (k in results) {
        if (!__hasProp.call(results, k)) continue;
        v = results[k];
        this[k] = v;
      }
    }

    IdResults.prototype.getStats = function(type) {
      switch (type) {
        case 'objects':
          return this.getObjectStats();
        case 'identifiers':
          return this.getIdentifierStats();
        default:
          return {
            objects: this.getObjectStats(),
            identifiers: this.getIdentifierStats()
          };
      }
    };

    IdResults.prototype.getIdentifierStats = function() {
      var all, allIdents, issues, matchIdents, matches, toIdents;
      toIdents = function(ms) {
        var ident, match;
        return unique(flatten((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = ms.length; _i < _len; _i++) {
            match = ms[_i];
            _results.push((function() {
              var _results1;
              _results1 = [];
              for (ident in match != null ? match.identifiers : void 0) {
                _results1.push(ident);
              }
              return _results1;
            })());
          }
          return _results;
        })()));
      };
      matchIdents = toIdents(this.getMatches('MATCH'));
      allIdents = toIdents(this.getMatches());
      matches = matchIdents.length;
      all = allIdents.length;
      issues = (difference(allIdents, matchIdents)).length;
      return {
        matches: matches,
        all: all,
        issues: issues
      };
    };

    IdResults.prototype.getObjectStats = function() {
      var all, issues, match, matches;
      matches = this.goodMatchIds().length;
      all = this.allMatchIds().length;
      issues = ((function() {
        var _results;
        _results = [];
        for (id in this) {
          if (!__hasProp.call(this, id)) continue;
          match = this[id];
          if (__indexOf.call(getReasons(match), 'MATCH') < 0) {
            _results.push(id);
          }
        }
        return _results;
      }).call(this)).length;
      return {
        matches: matches,
        all: all,
        issues: issues
      };
    };

    IdResults.prototype.getMatches = function(k) {
      var match, _results;
      _results = [];
      for (id in this) {
        if (!__hasProp.call(this, id)) continue;
        match = this[id];
        if (isGood(match, k)) {
          _results.push(match);
        }
      }
      return _results;
    };

    IdResults.prototype.getMatchIds = function(k) {
      var match, _results;
      _results = [];
      for (id in this) {
        if (!__hasProp.call(this, id)) continue;
        match = this[id];
        if (isGood(match, k)) {
          _results.push(id);
        }
      }
      return _results;
    };

    IdResults.prototype.goodMatchIds = function() {
      return this.getMatchIds('MATCH');
    };

    IdResults.prototype.allMatchIds = function() {
      return this.getMatchIds();
    };

    return IdResults;

  })();

  IDResolutionJob = (function() {

    function IDResolutionJob(uid, service) {
      this.uid = uid;
      this.service = service;
      this.del = __bind(this.del, this);

      this.fetchResults = __bind(this.fetchResults, this);

      this.fetchErrorMessage = __bind(this.fetchErrorMessage, this);

      this.fetchStatus = __bind(this.fetchStatus, this);

    }

    IDResolutionJob.prototype.fetchStatus = function(cb) {
      return withCB(cb, this.service.get("ids/" + this.uid + "/status").then(get('status')));
    };

    IDResolutionJob.prototype.fetchErrorMessage = function(cb) {
      return withCB(cb, this.service.get("ids/" + this.uid + "/status").then(get('message')));
    };

    IDResolutionJob.prototype.fetchResults = function(cb) {
      var gettingRes, gettingVer;
      gettingRes = this.service.get("ids/" + this.uid + "/result").then(get('results'));
      gettingVer = this.service.fetchVersion();
      return gettingVer.then(function(v) {
        return gettingRes.then(function(results) {
          if (v >= 16) {
            return new CategoryResults(results);
          } else {
            return new IdResults(results);
          }
        });
      });
    };

    IDResolutionJob.prototype.del = function(cb) {
      return this.service.makeRequest('DELETE', "ids/" + this.uid, {}, cb);
    };

    IDResolutionJob.prototype.decay = 50;

    IDResolutionJob.prototype.poll = function(onSuccess, onError, onProgress) {
      var backOff, notify, promise, reject, resolve, resp, _ref,
        _this = this;
      _ref = defer(), promise = _ref.promise, resolve = _ref.resolve, reject = _ref.reject;
      promise.then(onSuccess, onError);
      notify = onProgress != null ? onProgress : (function() {});
      resp = this.fetchStatus();
      resp.then(null, reject);
      backOff = this.decay;
      this.decay = Math.min(ONE_MINUTE, backOff * 1.25);
      resp.then(function(status) {
        notify(status);
        switch (status) {
          case 'SUCCESS':
            return _this.fetchResults().then(resolve, reject);
          case 'ERROR':
            return _this.fetchErrorMessage().then(reject, reject);
          default:
            return setTimeout((function() {
              return _this.poll(resolve, reject, notify);
            }), backOff);
        }
      });
      return promise;
    };

    return IDResolutionJob;

  })();

  IDResolutionJob.prototype.wait = IDResolutionJob.prototype.poll;

  IDResolutionJob.create = function(service) {
    return function(uid) {
      return new IDResolutionJob(uid, service);
    };
  };

  intermine.IDResolutionJob = IDResolutionJob;

  intermine.CategoryResults = CategoryResults;

  intermine.IdResults = IdResults;

}).call(this);

},{"./util":14}],6:[function(require,module,exports){
(function() {
  var INVITES, List, REQUIRES_VERSION, SHARES, TAGS_PATH, dejoin, get, getFolderName, intermine, invoke, isFolder, merge, set, utils, withCB,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  utils = require('./util');

  intermine = exports;

  merge = utils.merge, withCB = utils.withCB, get = utils.get, invoke = utils.invoke, REQUIRES_VERSION = utils.REQUIRES_VERSION, set = utils.set, dejoin = utils.dejoin;

  TAGS_PATH = "list/tags";

  SHARES = "lists/shares";

  INVITES = 'lists/invitations';

  isFolder = function(t) {
    return t.substr(0, t.indexOf(':')) === '__folder__';
  };

  getFolderName = function(t) {
    return t.substr(t.indexOf(':') + 1);
  };

  List = (function() {
    var getTags;

    function List(properties, service) {
      var k, v;
      this.service = service;
      this._updateTags = __bind(this._updateTags, this);

      this.hasTag = __bind(this.hasTag, this);

      for (k in properties) {
        if (!__hasProp.call(properties, k)) continue;
        v = properties[k];
        this[k] = v;
      }
      this.dateCreated = (this.dateCreated != null) ? new Date(this.dateCreated) : null;
      this.folders = this.tags.filter(isFolder).map(getFolderName);
    }

    List.prototype.hasTag = function(t) {
      return __indexOf.call(this.tags, t) >= 0;
    };

    List.prototype.query = function(view) {
      if (view == null) {
        view = ['*'];
      }
      return this.service.query({
        select: view,
        from: this.type,
        where: [[this.type, 'IN', this.name]]
      });
    };

    List.prototype.del = function(cb) {
      return this.service.makeRequest('DELETE', 'lists', {
        name: this.name
      }, cb);
    };

    getTags = function(_arg) {
      var tags;
      tags = _arg.tags;
      return tags;
    };

    List.prototype._updateTags = function(err, tags) {
      if (err != null) {
        return;
      }
      this.tags = tags.slice();
      return this.folders = this.tags.filter(isFolder).map(getFolderName);
    };

    List.prototype.fetchTags = function(cb) {
      return withCB(this._updateTags, cb, this.service.makeRequest('GET', 'list/tags', {
        name: this.name
      }).then(getTags));
    };

    List.prototype.addTags = function(tags, cb) {
      var req;
      req = {
        name: this.name,
        tags: tags
      };
      return withCB(this._updateTags, cb, this.service.makeRequest('POST', 'list/tags', req).then(getTags));
    };

    List.prototype.removeTags = function(tags, cb) {
      var req;
      req = {
        name: this.name,
        tags: tags
      };
      return withCB(this._updateTags, cb, this.service.makeRequest('DELETE', 'list/tags', req).then(getTags));
    };

    List.prototype.contents = function(cb) {
      return withCB(cb, this.query().then(dejoin).then(invoke('records')));
    };

    List.prototype.rename = function(newName, cb) {
      var req,
        _this = this;
      req = {
        oldname: this.name,
        newname: newName
      };
      return withCB(cb, this.service.post('lists/rename', req).then(get('listName')).then(function(n) {
        return _this.name = n;
      }).then(this.service.fetchList));
    };

    List.prototype.copy = function(opts, cb) {
      var baseName, name, query, tags, _ref, _ref1, _ref2,
        _this = this;
      if (opts == null) {
        opts = {};
      }
      if (cb == null) {
        cb = (function() {});
      }
      if (arguments.length === 1 && utils.isFunction(opts)) {
        _ref = [{}, opts], opts = _ref[0], cb = _ref[1];
      }
      if (typeof opts === 'string') {
        opts = {
          name: opts
        };
      }
      name = baseName = (_ref1 = opts.name) != null ? _ref1 : "" + this.name + "_copy";
      tags = this.tags.concat((_ref2 = opts.tags) != null ? _ref2 : []);
      query = this.query(['id']);
      return withCB(cb, this.service.fetchLists().then(invoke('map', get('name'))).then(function(names) {
        var c;
        c = 1;
        while (__indexOf.call(names, name) >= 0) {
          name = "" + baseName + "-" + (c++);
        }
        return query.then(invoke('saveAsList', {
          name: name,
          tags: tags,
          description: _this.description
        }));
      }));
    };

    List.prototype.enrichment = function(opts, cb) {
      return this.service.enrichment(merge({
        list: this.name
      }, opts), cb);
    };

    List.prototype.shareWithUser = function(recipient, cb) {
      return withCB(cb, this.service.post(SHARES, {
        'list': this.name,
        'with': recipient
      }));
    };

    List.prototype.inviteUserToShare = function(recipient, notify, cb) {
      if (notify == null) {
        notify = true;
      }
      if (cb == null) {
        cb = (function() {});
      }
      return withCB(cb, this.service.post(INVITES, {
        list: this.name,
        to: recipient,
        notify: !!notify
      }));
    };

    return List;

  })();

  intermine.List = List;

}).call(this);

},{"./util":14}],7:[function(require,module,exports){
(function() {
  var Model, PathInfo, Table, error, find, flatten, intermine, liftToTable, omap, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Table = require('./table').Table;

  PathInfo = require('./path').PathInfo;

  _ref = require('./util'), flatten = _ref.flatten, find = _ref.find, error = _ref.error, omap = _ref.omap;

  intermine = exports;

  liftToTable = omap(function(k, v) {
    return [k, new Table(v)];
  });

  Model = (function() {

    function Model(_arg) {
      var classes;
      this.name = _arg.name, classes = _arg.classes;
      this.findCommonType = __bind(this.findCommonType, this);

      this.findSharedAncestor = __bind(this.findSharedAncestor, this);

      this.getAncestorsOf = __bind(this.getAncestorsOf, this);

      this.getSubclassesOf = __bind(this.getSubclassesOf, this);

      this.getPathInfo = __bind(this.getPathInfo, this);

      this.classes = liftToTable(classes);
    }

    Model.prototype.getPathInfo = function(path, subcls) {
      return PathInfo.parse(this, path, subcls);
    };

    Model.prototype.getSubclassesOf = function(cls) {
      var cd, clazz, ret, _, _ref1, _ref2;
      clazz = cls && cls.name ? cls : this.classes[cls];
      if (clazz == null) {
        throw new Error("" + cls + " is not a table");
      }
      ret = [clazz.name];
      _ref1 = this.classes;
      for (_ in _ref1) {
        cd = _ref1[_];
        if (_ref2 = clazz.name, __indexOf.call(cd.parents(), _ref2) >= 0) {
          ret = ret.concat(this.getSubclassesOf(cd));
        }
      }
      return ret;
    };

    Model.prototype.getAncestorsOf = function(cls) {
      var ancestors, clazz, superC, _i, _len;
      clazz = cls && cls.name ? cls : this.classes[cls];
      if (clazz == null) {
        throw new Error("" + cls + " is not a table");
      }
      ancestors = clazz.parents();
      for (_i = 0, _len = ancestors.length; _i < _len; _i++) {
        superC = ancestors[_i];
        ancestors.push(this.getAncestorsOf(superC));
      }
      return flatten(ancestors);
    };

    Model.prototype.findSharedAncestor = function(classA, classB) {
      var a_ancestry, b_ancestry, firstCommon;
      if (classB === null || classA === null) {
        return null;
      }
      if (classA === classB) {
        return classA;
      }
      a_ancestry = this.getAncestorsOf(classA);
      if (__indexOf.call(a_ancestry, classB) >= 0) {
        return classB;
      }
      b_ancestry = this.getAncestorsOf(classB);
      if (__indexOf.call(b_ancestry, classA) >= 0) {
        return classA;
      }
      firstCommon = find(a_ancestry, function(a) {
        return __indexOf.call(b_ancestry, a) >= 0;
      });
      return firstCommon;
    };

    Model.prototype.findCommonType = function(xs) {
      if (xs == null) {
        xs = [];
      }
      return xs.reduce(this.findSharedAncestor);
    };

    return Model;

  })();

  Model.prototype.makePath = Model.prototype.getPathInfo;

  Model.prototype.findCommonTypeOfMultipleClasses = Model.prototype.findCommonType;

  Model.load = function(data) {
    try {
      return new Model(data);
    } catch (e) {
      throw new Error("Error loading model: " + e);
    }
  };

  Model.INTEGRAL_TYPES = ["int", "Integer", "long", "Long"];

  Model.FRACTIONAL_TYPES = ["double", "Double", "float", "Float"];

  Model.NUMERIC_TYPES = Model.INTEGRAL_TYPES.concat(Model.FRACTIONAL_TYPES);

  Model.BOOLEAN_TYPES = ["boolean", "Boolean"];

  intermine.Model = Model;

}).call(this);

},{"./path":8,"./table":12,"./util":14}],8:[function(require,module,exports){
(function() {
  var NAMES, PARSED, PathInfo, any, concatMap, copy, error, get, intermine, makeKey, set, success, utils, withCB,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  intermine = exports;

  utils = require('./util');

  withCB = utils.withCB, concatMap = utils.concatMap, get = utils.get, any = utils.any, set = utils.set, copy = utils.copy, success = utils.success, error = utils.error;

  NAMES = {};

  PARSED = {};

  makeKey = function(model, path, subclasses) {
    var k, v, _ref;
    return "" + (model != null ? model.name : void 0) + "|" + (model != null ? (_ref = model.service) != null ? _ref.root : void 0 : void 0) + "|" + path + ":" + ((function() {
      var _results;
      _results = [];
      for (k in subclasses) {
        v = subclasses[k];
        _results.push("" + k + "=" + v);
      }
      return _results;
    })());
  };

  PathInfo = (function() {

    function PathInfo(_arg) {
      var _ref;
      this.root = _arg.root, this.model = _arg.model, this.descriptors = _arg.descriptors, this.subclasses = _arg.subclasses, this.displayName = _arg.displayName, this.ident = _arg.ident;
      this.allDescriptors = __bind(this.allDescriptors, this);

      this.getChildNodes = __bind(this.getChildNodes, this);

      this.getDisplayName = __bind(this.getDisplayName, this);

      this.isa = __bind(this.isa, this);

      this.append = __bind(this.append, this);

      this.getParent = __bind(this.getParent, this);

      this.getEndClass = __bind(this.getEndClass, this);

      this.containsCollection = __bind(this.containsCollection, this);

      this.isCollection = __bind(this.isCollection, this);

      this.isReference = __bind(this.isReference, this);

      this.isClass = __bind(this.isClass, this);

      this.isAttribute = __bind(this.isAttribute, this);

      this.isRoot = __bind(this.isRoot, this);

      this.end = this.descriptors[this.descriptors.length - 1];
      if ((_ref = this.ident) == null) {
        this.ident = makeKey(this.model, this, this.subclasses);
      }
    }

    PathInfo.prototype.isRoot = function() {
      return this.descriptors.length === 0;
    };

    PathInfo.prototype.isAttribute = function() {
      return (this.end != null) && !(this.end.referencedType != null);
    };

    PathInfo.prototype.isClass = function() {
      return this.isRoot() || (this.end.referencedType != null);
    };

    PathInfo.prototype.isReference = function() {
      var _ref;
      return ((_ref = this.end) != null ? _ref.referencedType : void 0) != null;
    };

    PathInfo.prototype.isCollection = function() {
      var _ref, _ref1;
      return (_ref = (_ref1 = this.end) != null ? _ref1.isCollection : void 0) != null ? _ref : false;
    };

    PathInfo.prototype.containsCollection = function() {
      return any(this.descriptors, function(x) {
        return x.isCollection;
      });
    };

    PathInfo.prototype.getEndClass = function() {
      var _ref;
      return this.model.classes[this.subclasses[this.toString()] || ((_ref = this.end) != null ? _ref.referencedType : void 0)] || this.root;
    };

    PathInfo.prototype.getParent = function() {
      var data;
      if (this.isRoot()) {
        throw new Error("Root paths do not have parents");
      }
      data = {
        root: this.root,
        model: this.model,
        descriptors: this.descriptors.slice(0, this.descriptors.length - 1),
        subclasses: this.subclasses
      };
      return new PathInfo(data);
    };

    PathInfo.prototype.append = function(attr) {
      var data, fld;
      if (this.isAttribute()) {
        throw new Error("" + this + " is an attribute.");
      }
      fld = typeof attr === 'string' ? this.getType().fields[attr] : attr;
      if (fld == null) {
        throw new Error("" + attr + " is not a field of " + (this.getType()));
      }
      data = {
        root: this.root,
        model: this.model,
        descriptors: this.descriptors.concat([fld]),
        subclasses: this.subclasses
      };
      return new PathInfo(data);
    };

    PathInfo.prototype.isa = function(clazz) {
      var name, type;
      if (this.isAttribute()) {
        return this.getType() === clazz;
      } else {
        name = clazz.name ? clazz.name : '' + clazz;
        type = this.getType();
        return (name === type.name) || (__indexOf.call(this.model.getAncestorsOf(type), name) >= 0);
      }
    };

    PathInfo.prototype.getDisplayName = function(cb) {
      var cached, custom, params, path, _ref,
        _this = this;
      if (custom = this.displayName) {
        return success(custom);
      }
      if ((_ref = this.namePromise) == null) {
        this.namePromise = (cached = NAMES[this.ident]) ? success(cached) : !(this.model.service != null) ? error("No service") : (path = 'model' + (concatMap(function(d) {
          return '/' + d.name;
        }))(this.allDescriptors()), params = (set({
          format: 'json'
        }))(copy(this.subclasses)), this.model.service.get(path, params).then(get('display')).then(function(n) {
          var _name, _ref1;
          return (_ref1 = NAMES[_name = _this.ident]) != null ? _ref1 : NAMES[_name] = n;
        }));
      }
      return withCB(cb, this.namePromise);
    };

    PathInfo.prototype.getChildNodes = function() {
      var fld, name, _ref, _ref1, _results;
      _ref1 = ((_ref = this.getEndClass()) != null ? _ref.fields : void 0) || {};
      _results = [];
      for (name in _ref1) {
        fld = _ref1[name];
        _results.push(this.append(fld));
      }
      return _results;
    };

    PathInfo.prototype.allDescriptors = function() {
      return [this.root].concat(this.descriptors);
    };

    PathInfo.prototype.toString = function() {
      return this.allDescriptors().map(get('name')).join('.');
    };

    PathInfo.prototype.equals = function(other) {
      return other && (other.ident != null) && this.ident === other.ident;
    };

    PathInfo.prototype.getType = function() {
      var _ref, _ref1;
      return ((_ref = this.end) != null ? (_ref1 = _ref.type) != null ? _ref1.replace(/java\.lang\./, '') : void 0 : void 0) || this.getEndClass();
    };

    return PathInfo;

  })();

  PathInfo.prototype.toPathString = PathInfo.prototype.toString;

  PathInfo.parse = function(model, path, subclasses) {
    var cached, cd, descriptors, fld, ident, keyPath, part, parts, root;
    if (subclasses == null) {
      subclasses = {};
    }
    ident = makeKey(model, path, subclasses);
    if (cached = PARSED[ident]) {
      return cached;
    }
    parts = (path + '').split('.');
    root = cd = model.classes[parts.shift()];
    keyPath = root.name;
    descriptors = (function() {
      var _i, _len, _ref, _results;
      _results = [];
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        fld = (cd != null ? cd.fields[part] : void 0) || ((_ref = (cd = model.classes[subclasses[keyPath]])) != null ? _ref.fields[part] : void 0);
        if (!fld) {
          throw new Error("Could not find " + part + " in " + cd + " when parsing " + path);
        }
        keyPath += "." + part;
        cd = model.classes[fld.type || fld.referencedType];
        _results.push(fld);
      }
      return _results;
    })();
    return PARSED[ident] = new PathInfo({
      root: root,
      model: model,
      descriptors: descriptors,
      subclasses: subclasses,
      ident: ident
    });
  };

  PathInfo.flushCache = function() {
    PARSED = {};
    return NAMES = {};
  };

  intermine.PathInfo = PathInfo;

}).call(this);

},{"./util":14}],9:[function(require,module,exports){
(function() {

  module.exports = require('promise');

}).call(this);

},{"promise":21}],10:[function(require,module,exports){
(function() {
  var BASIC_ATTRS, CODES, LIST_PIPE, Query, REQUIRES_VERSION, RESULTS_METHODS, SIMPLE_ATTRS, conAttrs, conStr, conToJSON, conValStr, concatMap, copyCon, decapitate, didntRemove, f, filter, fold, get, get_canonical_op, headLess, id, idConStr, intermine, interpretConArray, interpretConstraint, invoke, merge, mth, multiConStr, noUndefVals, noValueConStr, partition, removeIrrelevantSortOrders, simpleConStr, stringToSortOrder, toQueryString, typeConStr, union, utils, withCB, _fn, _get_data_fetcher, _i, _j, _len, _len1, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  intermine = exports;

  intermine.xml = require('./xml');

  utils = require('./util');

  REQUIRES_VERSION = utils.REQUIRES_VERSION, withCB = utils.withCB, merge = utils.merge, filter = utils.filter, partition = utils.partition, fold = utils.fold, concatMap = utils.concatMap, id = utils.id, get = utils.get, invoke = utils.invoke;

  toQueryString = utils.querystring;

  get_canonical_op = function(orig) {
    var canonical;
    canonical = (orig != null ? orig.toLowerCase : void 0) != null ? Query.OP_DICT[orig.toLowerCase()] : null;
    if (!canonical) {
      throw new Error("Illegal constraint operator: " + orig);
    }
    return canonical;
  };

  BASIC_ATTRS = ['path', 'op', 'code'];

  SIMPLE_ATTRS = BASIC_ATTRS.concat(['value', 'extraValue']);

  RESULTS_METHODS = ['rowByRow', 'eachRow', 'recordByRecord', 'eachRecord', 'records', 'rows', 'table', 'tableRows', 'values'];

  LIST_PIPE = function(service) {
    return utils.compose(service.fetchList, get('listName'));
  };

  CODES = [null, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  decapitate = function(x) {
    if (x == null) {
      x = '';
    }
    return x.substr(x.indexOf('.'));
  };

  conValStr = function(v) {
    if (v != null) {
      return "<value>" + (utils.escape(v)) + "</value>";
    } else {
      return "<nullValue/>";
    }
  };

  conAttrs = function(c, names) {
    var k, v;
    return ((function() {
      var _results;
      _results = [];
      for (k in c) {
        v = c[k];
        if ((__indexOf.call(names, k) >= 0)) {
          _results.push("" + k + "=\"" + (utils.escape(v)) + "\" ");
        }
      }
      return _results;
    })()).join('');
  };

  noValueConStr = function(c) {
    return "<constraint " + (conAttrs(c, BASIC_ATTRS)) + "/>";
  };

  typeConStr = function(c) {
    return "<constraint " + (conAttrs(c, ['path', 'type'])) + "/>";
  };

  simpleConStr = function(c) {
    return "<constraint " + (conAttrs(c, SIMPLE_ATTRS)) + "/>";
  };

  multiConStr = function(c) {
    return "<constraint " + (conAttrs(c, BASIC_ATTRS)) + ">" + (concatMap(conValStr)(c.values)) + "</constraint>";
  };

  idConStr = function(c) {
    return "<constraint " + (conAttrs(c, BASIC_ATTRS)) + "ids=\"" + (c.ids.join(',')) + "\"/>";
  };

  conStr = function(c) {
    var _ref;
    if (c.values != null) {
      return multiConStr(c);
    } else if (c.ids != null) {
      return idConStr(c);
    } else if (!(c.op != null)) {
      return typeConStr(c);
    } else if (_ref = c.op, __indexOf.call(Query.NULL_OPS, _ref) >= 0) {
      return noValueConStr(c);
    } else {
      return simpleConStr(c);
    }
  };

  headLess = function(path) {
    return path.replace(/^[^\.]+\./, '');
  };

  copyCon = function(con) {
    var code, extraValue, ids, op, path, type, value, values;
    path = con.path, type = con.type, op = con.op, value = con.value, values = con.values, extraValue = con.extraValue, ids = con.ids, code = con.code;
    ids = ids != null ? ids.slice() : void 0;
    values = values != null ? values.slice() : void 0;
    return noUndefVals({
      path: path,
      type: type,
      op: op,
      value: value,
      values: values,
      extraValue: extraValue,
      ids: ids,
      code: code
    });
  };

  conToJSON = function(con) {
    var copy;
    copy = copyCon(con);
    copy.path = headLess(copy.path);
    return copy;
  };

  noUndefVals = function(x) {
    var k, v;
    for (k in x) {
      v = x[k];
      if (v == null) {
        delete x[k];
      }
    }
    return x;
  };

  didntRemove = function(orig, reduced) {
    return "Did not remove a single constraint. original = " + orig + ", reduced = " + reduced;
  };

  interpretConstraint = function(path, con) {
    var constraint, k, keys, v, x, _ref, _ref1;
    constraint = {
      path: path
    };
    if (con === null) {
      constraint.op = 'IS NULL';
    } else if (utils.isArray(con)) {
      constraint.op = 'ONE OF';
      constraint.values = con;
    } else if ((_ref = typeof con) === 'string' || _ref === 'number') {
      if (_ref1 = typeof con.toUpperCase === "function" ? con.toUpperCase() : void 0, __indexOf.call(Query.NULL_OPS, _ref1) >= 0) {
        constraint.op = con;
      } else {
        constraint.op = '=';
        constraint.value = con;
      }
    } else {
      keys = (function() {
        var _results;
        _results = [];
        for (k in con) {
          x = con[k];
          _results.push(k);
        }
        return _results;
      })();
      if (__indexOf.call(keys, 'isa') >= 0) {
        if (utils.isArray(con.isa)) {
          constraint.op = k;
          constraint.values = con.isa;
        } else {
          constraint.type = con.isa;
        }
      } else {
        if (__indexOf.call(keys, 'extraValue') >= 0) {
          constraint.extraValue = con.extraValue;
        }
        for (k in con) {
          v = con[k];
          if (!(k !== 'extraValue')) {
            continue;
          }
          constraint.op = k;
          if (utils.isArray(v)) {
            constraint.values = v;
          } else {
            constraint.value = v;
          }
        }
      }
    }
    return constraint;
  };

  interpretConArray = function(conArgs) {
    var a0, constraint, v, _ref;
    conArgs = conArgs.slice();
    constraint = {
      path: conArgs.shift()
    };
    if (conArgs.length === 1) {
      a0 = conArgs[0];
      if (_ref = typeof a0.toUpperCase === "function" ? a0.toUpperCase() : void 0, __indexOf.call(Query.NULL_OPS, _ref) >= 0) {
        constraint.op = a0;
      } else {
        constraint.type = a0;
      }
    } else if (conArgs.length >= 2) {
      constraint.op = conArgs[0];
      v = conArgs[1];
      if (utils.isArray(v)) {
        constraint.values = v;
      } else {
        constraint.value = v;
      }
      if (conArgs.length === 3) {
        constraint.extraValue = conArgs[2];
      }
    }
    return constraint;
  };

  stringToSortOrder = function(str) {
    var i, parts, pathIndices, x, _i, _len, _results;
    if (str == null) {
      return [];
    }
    parts = str.split(/\s+/);
    pathIndices = (function() {
      var _i, _ref, _results;
      _results = [];
      for (x = _i = 0, _ref = parts.length / 2; 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
        _results.push(x * 2);
      }
      return _results;
    })();
    _results = [];
    for (_i = 0, _len = pathIndices.length; _i < _len; _i++) {
      i = pathIndices[_i];
      _results.push([parts[i], parts[i + 1]]);
    }
    return _results;
  };

  removeIrrelevantSortOrders = function() {
    var oe, oldOrder;
    oldOrder = this.sortOrder;
    this.sortOrder = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = oldOrder.length; _i < _len; _i++) {
        oe = oldOrder[_i];
        if (this.isRelevant(oe.path)) {
          _results.push(oe);
        }
      }
      return _results;
    }).call(this);
    if (oldOrder.length !== this.sortOrder.length) {
      return this.trigger('change:sortorder change:orderby', this.sortOrder.slice());
    }
  };

  Query = (function() {
    var addPI, cAttrs, kids, parseSummary, qAttrs, scFold, toAttrPairs, toPathAndType, xmlAttr;

    Query.JOIN_STYLES = ['INNER', 'OUTER'];

    Query.BIO_FORMATS = ['gff3', 'fasta', 'bed'];

    Query.NULL_OPS = ['IS NULL', 'IS NOT NULL'];

    Query.ATTRIBUTE_VALUE_OPS = ["=", "!=", ">", ">=", "<", "<=", "CONTAINS", "LIKE", "NOT LIKE"];

    Query.MULTIVALUE_OPS = ['ONE OF', 'NONE OF'];

    Query.TERNARY_OPS = ['LOOKUP'];

    Query.LOOP_OPS = ['=', '!='];

    Query.LIST_OPS = ['IN', 'NOT IN'];

    Query.OP_DICT = {
      '=': '=',
      '==': '==',
      'eq': '=',
      'eqq': '==',
      '!=': '!=',
      'ne': '!=',
      '>': '>',
      'gt': '>',
      '>=': '>=',
      'ge': '>=',
      '<': '<',
      'lt': '<',
      '<=': '<=',
      'le': '<=',
      'contains': 'CONTAINS',
      'CONTAINS': 'CONTAINS',
      'like': 'LIKE',
      'LIKE': 'LIKE',
      'not like': 'NOT LIKE',
      'NOT LIKE': 'NOT LIKE',
      'lookup': 'LOOKUP',
      'IS NULL': 'IS NULL',
      'is null': 'IS NULL',
      'IS NOT NULL': 'IS NOT NULL',
      'is not null': 'IS NOT NULL',
      'ONE OF': 'ONE OF',
      'one of': 'ONE OF',
      'NONE OF': 'NONE OF',
      'none of': 'NONE OF',
      'in': 'IN',
      'not in': 'NOT IN',
      'IN': 'IN',
      'NOT IN': 'NOT IN',
      'WITHIN': 'WITHIN',
      'within': 'WITHIN',
      'OVERLAPS': 'OVERLAPS',
      'overlaps': 'OVERLAPS',
      'ISA': 'ISA',
      'isa': 'ISA'
    };

    Query.prototype.on = function(events, callback, context) {
      var calls, ev, list, tail, _ref, _ref1, _ref2;
      events = events.split(/\s+/);
      calls = ((_ref = this._callbacks) != null ? _ref : this._callbacks = {});
      while (ev = events.shift()) {
        list = ((_ref1 = calls[ev]) != null ? _ref1 : calls[ev] = {});
        tail = ((_ref2 = list.tail) != null ? _ref2 : list.tail = (list.next = {}));
        tail.callback = callback;
        tail.context = context;
        list.tail = tail.next = {};
      }
      return this;
    };

    Query.prototype.bind = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.on.apply(this, args);
    };

    Query.prototype.off = function(events, callback, context) {
      var calls, current, ev, last, linkedList, node, remove, _i, _len, _ref;
      if (events == null) {
        this._callbacks = {};
        return this;
      }
      events = events.split(/\s+/);
      calls = ((_ref = this._callbacks) != null ? _ref : this._callbacks = {});
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        ev = events[_i];
        if (callback != null) {
          current = linkedList = calls[ev] || {};
          last = linkedList.tail;
          while ((node = current.next) !== last) {
            remove = (!(context != null) || node.context === context) && (callback === node.callback);
            if (remove) {
              current.next = node.next || last;
              node = current;
            } else {
              current = node;
            }
          }
        } else {
          delete calls[ev];
        }
      }
      return this;
    };

    Query.prototype.unbind = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.off.apply(this, args);
    };

    Query.prototype.once = function(events, callback, context) {
      var f,
        _this = this;
      f = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        callback.apply(context, args);
        return _this.off(events, f);
      };
      return this.on(events, f);
    };

    Query.prototype.emit = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.trigger.apply(this, args);
    };

    Query.prototype.trigger = function() {
      var all, args, calls, event, events, node, rest, tail;
      events = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      calls = this._callbacks;
      if (!calls) {
        return this;
      }
      all = calls['all'];
      (events = events.split(/\s+/)).push(null);
      while (event = events.shift()) {
        if (all) {
          events.push({
            next: all.next,
            tail: all.tail,
            event: event
          });
        }
        if (!(node = calls[event])) {
          continue;
        }
        events.push({
          next: node.next,
          tail: node.tail
        });
      }
      while (node = events.pop()) {
        tail = node.tail;
        args = node.event ? [node.event].concat(rest) : rest;
        while ((node = node.next) !== tail) {
          node.callback.apply(node.context || this, args);
        }
      }
      return this;
    };

    qAttrs = ['name', 'view', 'sortOrder', 'constraintLogic', 'title', 'description', 'comment'];

    cAttrs = ['path', 'type', 'op', 'code', 'value', 'ids'];

    toAttrPairs = function(el, attrs) {
      var x, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = attrs.length; _i < _len; _i++) {
        x = attrs[_i];
        if (el.hasAttribute(x)) {
          _results.push([x, el.getAttribute(x)]);
        }
      }
      return _results;
    };

    kids = function(el, name) {
      var kid, _i, _len, _ref, _results;
      _ref = el.getElementsByTagName(name);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        kid = _ref[_i];
        _results.push(kid);
      }
      return _results;
    };

    xmlAttr = function(name) {
      return function(el) {
        return el.getAttribute(name);
      };
    };

    Query.fromXML = function(xml) {
      var con, dom, j, pathOf, q, query, styleOf;
      dom = intermine.xml.parse(xml);
      query = kids(dom, 'query')[0] || kids(dom, 'template')[0];
      if (!query) {
        throw new Error("no query in xml");
      }
      pathOf = xmlAttr('path');
      styleOf = xmlAttr('style');
      q = utils.pairsToObj(toAttrPairs(query, qAttrs));
      q.view = q.view.split(/\s+/);
      q.sortOrder = stringToSortOrder(q.sortOrder);
      q.joins = (function() {
        var _i, _len, _ref, _results;
        _ref = kids(query, 'join');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          j = _ref[_i];
          if (styleOf(j) === 'OUTER') {
            _results.push(pathOf(j));
          }
        }
        return _results;
      })();
      q.constraints = (function() {
        var _i, _len, _ref, _results;
        _ref = kids(query, 'constraint');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          con = _ref[_i];
          _results.push((function(con) {
            var c, tn, v, values, x;
            c = utils.pairsToObj(toAttrPairs(con, cAttrs));
            if (c.ids != null) {
              c.ids = (function() {
                var _j, _len1, _ref1, _results1;
                _ref1 = c.ids.split(',');
                _results1 = [];
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  x = _ref1[_j];
                  _results1.push(parseInt(x, 10));
                }
                return _results1;
              })();
            }
            values = kids(con, 'value');
            if (values.length) {
              c.values = (function() {
                var _j, _len1, _results1;
                _results1 = [];
                for (_j = 0, _len1 = values.length; _j < _len1; _j++) {
                  v = values[_j];
                  _results1.push(((function() {
                    var _k, _len2, _ref1, _results2;
                    _ref1 = v.childNodes;
                    _results2 = [];
                    for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                      tn = _ref1[_k];
                      _results2.push(tn.data);
                    }
                    return _results2;
                  })()).join(''));
                }
                return _results1;
              })();
            }
            return c;
          })(con));
        }
        return _results;
      })();
      return q;
    };

    Query.prototype.constraints = [];

    Query.prototype.views = [];

    Query.prototype.joins = {};

    Query.prototype.constraintLogic = '';

    Query.prototype.sortOrder = '';

    Query.prototype.name = null;

    Query.prototype.title = null;

    Query.prototype.comment = null;

    Query.prototype.description = null;

    function Query(properties, service) {
      this.addConstraint = __bind(this.addConstraint, this);

      this.expandStar = __bind(this.expandStar, this);

      this.adjustPath = __bind(this.adjustPath, this);

      this.select = __bind(this.select, this);

      var prop, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (properties == null) {
        properties = {};
      }
      this.constraints = [];
      this.views = [];
      this.joins = {};
      this.displayNames = utils.copy((_ref = (_ref1 = properties.displayNames) != null ? _ref1 : properties.aliases) != null ? _ref : {});
      _ref2 = ['name', 'title', 'comment', 'description', 'type'];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        prop = _ref2[_i];
        if (properties[prop] != null) {
          this[prop] = properties[prop];
        }
      }
      this.service = service != null ? service : {};
      this.model = (_ref3 = properties.model) != null ? _ref3 : {};
      this.summaryFields = (_ref4 = properties.summaryFields) != null ? _ref4 : {};
      this.root = (_ref5 = properties.root) != null ? _ref5 : properties.from;
      this.maxRows = (_ref6 = (_ref7 = properties.size) != null ? _ref7 : properties.limit) != null ? _ref6 : properties.maxRows;
      this.start = (_ref8 = (_ref9 = properties.start) != null ? _ref9 : properties.offset) != null ? _ref8 : 0;
      this.select(properties.views || properties.view || properties.select || []);
      this.addConstraints(properties.constraints || properties.where || []);
      this.addJoins(properties.joins || properties.join || []);
      this.orderBy(properties.sortOrder || properties.orderBy || []);
      if (properties.constraintLogic != null) {
        this.constraintLogic = properties.constraintLogic;
      }
      this.on('change:views', removeIrrelevantSortOrders, this);
    }

    Query.prototype.removeFromSelect = function(unwanted) {
      var mapFn, so, uw, v;
      if (unwanted == null) {
        unwanted = [];
      }
      unwanted = utils.stringList(unwanted);
      mapFn = utils.compose(this.expandStar, this.adjustPath);
      unwanted = utils.flatten((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = unwanted.length; _i < _len; _i++) {
          uw = unwanted[_i];
          _results.push(mapFn(uw));
        }
        return _results;
      })());
      this.sortOrder = (function() {
        var _i, _len, _ref, _ref1, _results;
        _ref = this.sortOrder;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          so = _ref[_i];
          if (!(_ref1 = so.path, __indexOf.call(unwanted, _ref1) >= 0)) {
            _results.push(so);
          }
        }
        return _results;
      }).call(this);
      this.views = (function() {
        var _i, _len, _ref, _results;
        _ref = this.views;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          if (!(__indexOf.call(unwanted, v) >= 0)) {
            _results.push(v);
          }
        }
        return _results;
      }).call(this);
      this.trigger('remove:view', unwanted);
      return this.trigger('change:views', this.views);
    };

    Query.prototype.removeConstraint = function(con, silent) {
      var c, iscon, orig, reduced;
      if (silent == null) {
        silent = false;
      }
      orig = this.constraints;
      iscon = typeof con === 'string' ? (function(c) {
        return c.code === con;
      }) : (function(c) {
        var _ref, _ref1;
        return (c.path === con.path) && (c.op === con.op) && (c.value === con.value) && (c.extraValue === con.extraValue) && (con.type === c.type) && (((_ref = c.values) != null ? _ref.join('%%') : void 0) === ((_ref1 = con.values) != null ? _ref1.join('%%') : void 0));
      });
      reduced = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = orig.length; _i < _len; _i++) {
          c = orig[_i];
          if (!iscon(c)) {
            _results.push(c);
          }
        }
        return _results;
      })();
      if (reduced.length !== orig.length - 1) {
        throw new Error(didntRemove(orig, reduced));
      }
      this.constraints = reduced;
      if (!silent) {
        this.trigger('change:constraints');
        return this.trigger('removed:constraint', utils.find(orig, iscon));
      }
    };

    Query.prototype.addToSelect = function(views) {
      var dups, mapFn, p, toAdd, v, x, _ref;
      if (views == null) {
        views = [];
      }
      views = utils.stringList(views);
      mapFn = utils.compose(this.expandStar, this.adjustPath);
      toAdd = utils.flatten((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = views.length; _i < _len; _i++) {
          v = views[_i];
          _results.push(mapFn(v));
        }
        return _results;
      })());
      dups = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = toAdd.length; _i < _len; _i++) {
          p = toAdd[_i];
          if (__indexOf.call(this.views, p) >= 0) {
            _results.push(p);
          }
        }
        return _results;
      }).call(this);
      if (dups.length) {
        throw new Error("" + dups + " already in the select list");
      }
      dups = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = toAdd.length; _i < _len; _i++) {
          p = toAdd[_i];
          if (((function() {
            var _j, _len1, _results1;
            _results1 = [];
            for (_j = 0, _len1 = toAdd.length; _j < _len1; _j++) {
              x = toAdd[_j];
              if (x === p) {
                _results1.push(x);
              }
            }
            return _results1;
          })()).length > 1) {
            _results.push(p);
          }
        }
        return _results;
      })();
      if (dups.length) {
        throw new Error("" + dups + " specified multiple times as arguments to addToSelect");
      }
      (_ref = this.views).push.apply(_ref, toAdd);
      return this.trigger('add:view change:views', toAdd);
    };

    Query.prototype.select = function(views) {
      var oldViews;
      oldViews = this.views.slice();
      try {
        this.views = [];
        this.addToSelect(views);
      } catch (e) {
        this.views = oldViews;
        utils.error(e);
      }
      return this;
    };

    Query.prototype.adjustPath = function(path) {
      path = path && path.name ? path.name : "" + path;
      if (this.root != null) {
        if (!path.match("^" + this.root)) {
          path = this.root + "." + path;
        }
      } else {
        this.root = path.split('.')[0];
      }
      return path;
    };

    Query.prototype.getPossiblePaths = function(depth) {
      var getPaths, _base, _ref, _ref1,
        _this = this;
      if (depth == null) {
        depth = 3;
      }
      getPaths = function(root, d) {
        var cd, field, name, others, path, ret, subPaths;
        ret = [root];
        path = _this.getPathInfo(root);
        if (path.isAttribute()) {
          return ret;
        } else {
          cd = _this.getPathInfo(root).getType();
          subPaths = concatMap(function(ref) {
            return getPaths("" + root + "." + ref.name, d - 1);
          });
          others = cd && (d > 0) ? subPaths((function() {
            var _ref, _results;
            _ref = cd.fields;
            _results = [];
            for (name in _ref) {
              field = _ref[name];
              _results.push(field);
            }
            return _results;
          })()) : [];
          return ret.concat(others);
        }
      };
      if ((_ref = this._possiblePaths) == null) {
        this._possiblePaths = {};
      }
      return (_ref1 = (_base = this._possiblePaths)[depth]) != null ? _ref1 : _base[depth] = getPaths(this.root, depth);
    };

    Query.prototype.getPathInfo = function(path) {
      var adjusted, pi, _ref;
      adjusted = this.adjustPath(path);
      pi = (_ref = this.model) != null ? typeof _ref.getPathInfo === "function" ? _ref.getPathInfo(adjusted, this.getSubclasses()) : void 0 : void 0;
      if (pi && adjusted in this.displayNames) {
        pi.displayName = this.displayNames[adjusted];
      }
      return pi;
    };

    Query.prototype.makePath = Query.prototype.getPathInfo;

    toPathAndType = function(c) {
      return [c.path, c.type];
    };

    scFold = utils.compose(utils.pairsToObj, utils.map(toPathAndType), filter(get('type')));

    Query.prototype.getSubclasses = function() {
      return scFold(this.constraints);
    };

    Query.prototype.getType = function(path) {
      return this.getPathInfo(path).getType();
    };

    Query.prototype.getViewNodes = function() {
      var p, toParentNode,
        _this = this;
      toParentNode = function(v) {
        return _this.getPathInfo(v).getParent();
      };
      return utils.uniqBy(String, (function() {
        var _i, _len, _ref, _results;
        _ref = this.views;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          _results.push(toParentNode(p));
        }
        return _results;
      }).call(this));
    };

    Query.prototype.isInView = function(path) {
      var pi, pstr, _ref;
      pi = this.getPathInfo(path);
      if (!pi) {
        throw new Error("Invalid path: " + path);
      }
      if (pi.isAttribute()) {
        return _ref = pi.toString(), __indexOf.call(this.views, _ref) >= 0;
      } else {
        pstr = pi.toString();
        return utils.any(this.getViewNodes(), function(n) {
          return n.toString() === pstr;
        });
      }
    };

    Query.prototype.isConstrained = function(path, includeAttrs) {
      var pi, test,
        _this = this;
      if (includeAttrs == null) {
        includeAttrs = false;
      }
      pi = this.getPathInfo(path);
      if (!pi) {
        throw new Error("Invalid path: " + path);
      }
      test = function(c) {
        return (c.op != null) && c.path === pi.toString();
      };
      if ((!pi.isAttribute()) && includeAttrs) {
        test = function(c) {
          return (c.op != null) && (c.path === pi.toString() || pi.equals(_this.getPathInfo(c.path).getParent()));
        };
      }
      return utils.any(this.constraints, test);
    };

    Query.prototype.canHaveMultipleValues = function(path) {
      return this.getPathInfo(path).containsCollection();
    };

    Query.prototype.getQueryNodes = function() {
      var c, constrainedNodes, pi, viewNodes;
      viewNodes = this.getViewNodes();
      constrainedNodes = (function() {
        var _i, _len, _ref, _results;
        _ref = this.constraints;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          if (!(!(c.type != null))) {
            continue;
          }
          pi = this.getPathInfo(c.path);
          if (pi.isAttribute()) {
            _results.push(pi.getParent());
          } else {
            _results.push(pi);
          }
        }
        return _results;
      }).call(this);
      return utils.uniqBy(String, viewNodes.concat(constrainedNodes));
    };

    Query.prototype.isInQuery = function(p) {
      var c, pi, pstr, _i, _len, _ref;
      pi = this.getPathInfo(p);
      if (pi) {
        pstr = pi.toPathString();
        _ref = this.views.concat((function() {
          var _j, _len, _ref, _results;
          _ref = this.constraints;
          _results = [];
          for (_j = 0, _len = _ref.length; _j < _len; _j++) {
            c = _ref[_j];
            if (!(c.type != null)) {
              _results.push(c.path);
            }
          }
          return _results;
        }).call(this));
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          if (0 === p.indexOf(pstr)) {
            return true;
          }
        }
        return false;
      }
      return true;
    };

    Query.prototype.isRelevant = function(path) {
      var nodes, pi, sought;
      pi = this.getPathInfo(path);
      if (pi.isAttribute()) {
        pi = pi.getParent();
      }
      sought = pi.toString();
      nodes = this.getViewNodes();
      return utils.any(nodes, function(n) {
        return n.toPathString() === sought;
      });
    };

    Query.prototype.expandStar = function(path) {
      var attrViews, cd, expand, fn, n, name, pathStem, starViews;
      if (/\*$/.test(path)) {
        pathStem = path.substr(0, path.lastIndexOf('.'));
        expand = function(x) {
          return pathStem + x;
        };
        cd = this.getType(pathStem);
        if (/\.\*$/.test(path)) {
          if (cd && this.summaryFields[cd.name]) {
            fn = utils.compose(expand, decapitate);
            return (function() {
              var _i, _len, _ref, _results;
              _ref = this.summaryFields[cd.name];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                n = _ref[_i];
                if (!this.hasView(n)) {
                  _results.push(fn(n));
                }
              }
              return _results;
            }).call(this);
          }
        } else if (/\.\*\*$/.test(path)) {
          starViews = this.expandStar(pathStem + '.*');
          attrViews = (function() {
            var _results;
            _results = [];
            for (name in cd.attributes) {
              _results.push(expand("." + name));
            }
            return _results;
          })();
          return utils.uniqBy(id, starViews.concat(attrViews));
        }
      }
      return path;
    };

    Query.prototype.isOuterJoin = function(p) {
      return this.joins[this.adjustPath(p)] === 'OUTER';
    };

    Query.prototype.hasView = function(v) {
      var _ref;
      return this.views && (_ref = this.adjustPath(v), __indexOf.call(this.views, _ref) >= 0);
    };

    Query.prototype.count = function(cont) {
      if (this.service.count) {
        return this.service.count(this, cont);
      } else {
        throw new Error("This query has no service with count functionality attached.");
      }
    };

    Query.prototype.appendToList = function(target, cb) {
      var name, processor, req, toRun, updateTarget;
      if (target != null ? target.name : void 0) {
        name = target.name;
        updateTarget = function(err, list) {
          if (err == null) {
            return target.size = list.size;
          }
        };
      } else {
        name = String(target);
        updateTarget = null;
      }
      toRun = this.makeListQuery();
      req = {
        listName: name,
        query: toRun.toXML()
      };
      processor = LIST_PIPE(this.service);
      return withCB(updateTarget, cb, this.service.post('query/append/tolist', req).then(processor));
    };

    Query.prototype.makeListQuery = function() {
      var n, toRun, _i, _len, _ref;
      toRun = this.clone();
      if (toRun.views.length !== 1 || toRun.views[0] === null || !toRun.views[0].match(/\.id$/)) {
        toRun.select(['id']);
      }
      _ref = this.getViewNodes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        if (!this.isOuterJoined(n)) {
          if (!(toRun.isInView(n || toRun.isConstrained(n))) && (n.getEndClass().fields.id != null)) {
            toRun.addConstraint([n.append('id'), 'IS NOT NULL']);
          }
        }
      }
      return toRun;
    };

    Query.prototype.saveAsList = function(options, cb) {
      var req, toRun;
      toRun = this.makeListQuery();
      req = utils.copy(options);
      req.listName = req.listName || req.name;
      req.query = toRun.toXML();
      if (options.tags) {
        req.tags = options.tags.join(';');
      }
      return withCB(cb, this.service.post('query/tolist', req).then(LIST_PIPE(this.service)));
    };

    Query.prototype.summarise = function(path, limit, cont) {
      return this.filterSummary(path, '', limit, cont);
    };

    Query.prototype.summarize = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.summarise.apply(this, args);
    };

    parseSummary = function(data) {
      var isNumeric, r, stats, _i, _len, _ref, _ref1;
      isNumeric = ((_ref = data.results[0]) != null ? _ref.max : void 0) != null;
      _ref1 = data.results;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        r = _ref1[_i];
        r.count = parseInt(r.count, 10);
      }
      stats = {
        uniqueValues: data.uniqueValues,
        filteredCount: data.filteredCount
      };
      if (isNumeric) {
        stats = merge(stats, data.results[0]);
      }
      data.stats = stats;
      return data;
    };

    Query.prototype.filterSummary = function(path, term, limit, cont) {
      var req, toRun, _ref;
      if (cont == null) {
        cont = (function() {});
      }
      if (utils.isFunction(limit)) {
        _ref = [limit, null], cont = _ref[0], limit = _ref[1];
      }
      path = this.adjustPath(path);
      toRun = this.clone();
      if (__indexOf.call(toRun.views, path) < 0) {
        toRun.views.push(path);
      }
      req = {
        query: toRun.toXML(),
        summaryPath: path,
        format: 'jsonrows'
      };
      if (limit) {
        req.size = limit;
      }
      if (term) {
        req.filterTerm = term;
      }
      return withCB(cont, this.service.post('query/results', req).then(parseSummary));
    };

    Query.prototype.clone = function(cloneEvents) {
      var cloned, k, v, _ref, _ref1;
      cloned = new Query(this, this.service);
      if ((_ref = cloned._callbacks) == null) {
        cloned._callbacks = {};
      }
      if (cloneEvents) {
        _ref1 = this._callbacks;
        for (k in _ref1) {
          if (!__hasProp.call(_ref1, k)) continue;
          v = _ref1[k];
          cloned._callbacks[k] = v;
        }
        cloned.off('change:views', removeIrrelevantSortOrders, this);
      }
      return cloned;
    };

    Query.prototype.next = function() {
      var clone;
      clone = this.clone();
      if (this.maxRows) {
        clone.start = this.start + this.maxRows;
      }
      return clone;
    };

    Query.prototype.previous = function() {
      var clone;
      clone = this.clone();
      if (this.maxRows) {
        clone.start = this.start - this.maxRows;
      } else {
        clone.start = 0;
      }
      return clone;
    };

    Query.prototype.getSortDirection = function(sorted) {
      var a, so;
      a = this.adjustPath(sorted);
      if (!(this.isInQuery(a) || this.isRelevant(a))) {
        throw new Error("" + sorted + " is not in the query");
      }
      so = utils.find(this.sortOrder, function(_arg) {
        var path;
        path = _arg.path;
        return a === path;
      });
      return so != null ? so.direction : void 0;
    };

    Query.prototype.isOuterJoined = function(path) {
      var dir, jp, _ref;
      path = this.adjustPath(path);
      _ref = this.joins;
      for (jp in _ref) {
        dir = _ref[jp];
        if (dir === 'OUTER' && path.indexOf(jp) === 0) {
          return true;
        }
      }
      return false;
    };

    Query.prototype.getOuterJoin = function(path) {
      var joinPaths, k,
        _this = this;
      path = this.adjustPath(path);
      joinPaths = ((function() {
        var _results;
        _results = [];
        for (k in this.joins) {
          _results.push(k);
        }
        return _results;
      }).call(this)).sort(function(a, b) {
        return b.length - a.length;
      });
      return utils.find(joinPaths, function(p) {
        return _this.joins[p] === 'OUTER' && path.indexOf(p) === 0;
      });
    };

    Query.prototype._parse_sort_order = function(input) {
      var direction, k, path, so, v, _ref;
      so = input;
      if (typeof input === 'string') {
        so = {
          path: input,
          direction: 'ASC'
        };
      } else if (utils.isArray(input)) {
        path = input[0], direction = input[1];
        so = {
          path: path,
          direction: direction
        };
      } else if (!(input.path != null)) {
        for (k in input) {
          v = input[k];
          _ref = [k, v], path = _ref[0], direction = _ref[1];
        }
        so = {
          path: path,
          direction: direction
        };
      }
      so.path = this.adjustPath(so.path);
      so.direction = so.direction.toUpperCase();
      return so;
    };

    Query.prototype.addOrSetSortOrder = function(so) {
      var currentDirection, oe;
      so = this._parse_sort_order(so);
      currentDirection = this.getSortDirection(so.path);
      if (!(currentDirection != null)) {
        this.addSortOrder(so);
      } else if (currentDirection !== so.direction) {
        oe = utils.find(this.sortOrder, function(_arg) {
          var path;
          path = _arg.path;
          return path === so.path;
        });
        oe.direction = so.direction;
        this.trigger('change:sortorder', this.sortOrder);
      }
      return this;
    };

    Query.prototype.addSortOrder = function(so) {
      this.sortOrder.push(this._parse_sort_order(so));
      this.trigger('add:sortorder', so);
      return this.trigger('change:sortorder', this.sortOrder);
    };

    Query.prototype.orderBy = function(oes) {
      var oe, _i, _len;
      this.sortOrder = [];
      for (_i = 0, _len = oes.length; _i < _len; _i++) {
        oe = oes[_i];
        this.addSortOrder(this._parse_sort_order(oe));
      }
      return this.trigger('set:sortorder change:sortorder', this.sortOrder);
    };

    Query.prototype.addJoins = function(joins) {
      var j, k, v, _i, _len, _results, _results1;
      if (utils.isArray(joins)) {
        _results = [];
        for (_i = 0, _len = joins.length; _i < _len; _i++) {
          j = joins[_i];
          _results.push(this.addJoin(j));
        }
        return _results;
      } else {
        _results1 = [];
        for (k in joins) {
          v = joins[k];
          _results1.push(this.addJoin({
            path: k,
            style: v
          }));
        }
        return _results1;
      }
    };

    Query.prototype.addJoin = function(join) {
      if (typeof join === 'string') {
        join = {
          path: join,
          style: 'OUTER'
        };
      }
      return this.setJoinStyle(join.path, join.style);
    };

    Query.prototype.setJoinStyle = function(path, style) {
      if (style == null) {
        style = 'OUTER';
      }
      path = this.adjustPath(path);
      style = style.toUpperCase();
      if (__indexOf.call(Query.JOIN_STYLES, style) < 0) {
        throw new Error("Invalid join style: " + style);
      }
      if (this.joins[path] !== style) {
        this.joins[path] = style;
        this.trigger('change:joins', {
          path: path,
          style: style
        });
      }
      return this;
    };

    Query.prototype.addConstraints = function(constraints) {
      var c, con, path, _fn, _i, _len,
        _this = this;
      this.__silent__ = true;
      if (utils.isArray(constraints)) {
        for (_i = 0, _len = constraints.length; _i < _len; _i++) {
          c = constraints[_i];
          this.addConstraint(c);
        }
      } else {
        _fn = function(path, con) {
          return _this.addConstraint(interpretConstraint(path, con));
        };
        for (path in constraints) {
          con = constraints[path];
          _fn(path, con);
        }
      }
      this.__silent__ = false;
      this.trigger('add:constraint');
      return this.trigger('change:constraints');
    };

    Query.prototype.addConstraint = function(constraint) {
      if (utils.isArray(constraint)) {
        constraint = interpretConArray(constraint);
      } else {
        constraint = copyCon(constraint);
      }
      constraint.path = this.adjustPath(constraint.path);
      if (constraint.type == null) {
        try {
          constraint.op = get_canonical_op(constraint.op);
        } catch (error) {
          throw new Error("Illegal operator: " + constraint.op);
        }
      }
      this.constraints.push(constraint);
      if ((this.constraintLogic != null) && this.constraintLogic !== '') {
        this.constraintLogic = "(" + this.constraintLogic + ") and " + CODES[this.constraints.length];
      }
      if (!this.__silent__) {
        this.trigger('add:constraint', constraint);
        this.trigger('change:constraints');
      }
      return this;
    };

    Query.prototype.getSorting = function() {
      var oe;
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = this.sortOrder;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          oe = _ref[_i];
          _results.push("" + oe.path + " " + oe.direction);
        }
        return _results;
      }).call(this)).join(' ');
    };

    Query.prototype.getConstraintXML = function() {
      var c, toSerialise;
      toSerialise = (function() {
        var _i, _len, _ref, _results;
        _ref = this.constraints;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          if (!(c.type != null) || this.isInQuery(c.path)) {
            _results.push(c);
          }
        }
        return _results;
      }).call(this);
      if (toSerialise.length) {
        return concatMap(conStr)(concatMap(id)(partition(function(c) {
          return c.type != null;
        })(toSerialise)));
      } else {
        return '';
      }
    };

    Query.prototype.getJoinXML = function() {
      var p, s, strs;
      strs = (function() {
        var _ref, _results;
        _ref = this.joins;
        _results = [];
        for (p in _ref) {
          s = _ref[p];
          if (this.isInQuery(p) && s === 'OUTER') {
            _results.push("<join path=\"" + p + "\" style=\"OUTER\"/>");
          }
        }
        return _results;
      }).call(this);
      return strs.join('');
    };

    Query.prototype.toXML = function() {
      var attrs, headAttrs, k, v;
      attrs = {
        model: this.model.name,
        view: this.views.join(' '),
        sortOrder: this.getSorting(),
        constraintLogic: this.constraintLogic
      };
      if (this.name != null) {
        attrs.name = this.name;
      }
      headAttrs = ((function() {
        var _results;
        _results = [];
        for (k in attrs) {
          v = attrs[k];
          if (v) {
            _results.push(k + '="' + v + '"');
          }
        }
        return _results;
      })()).join(' ');
      return "<query " + headAttrs + " >" + (this.getJoinXML()) + (this.getConstraintXML()) + "</query>";
    };

    Query.prototype.toJSON = function() {
      var c, direction, path, style, v;
      return noUndefVals({
        name: this.name,
        title: this.title,
        comment: this.comment,
        description: this.description,
        constraintLogic: this.constraintLogic,
        from: this.root,
        select: (function() {
          var _i, _len, _ref, _results;
          _ref = this.views;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            v = _ref[_i];
            _results.push(headLess(v));
          }
          return _results;
        }).call(this),
        orderBy: (function() {
          var _i, _len, _ref, _ref1, _results;
          _ref = this.sortOrder;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            _ref1 = _ref[_i], path = _ref1.path, direction = _ref1.direction;
            _results.push({
              path: headLess(path),
              direction: direction
            });
          }
          return _results;
        }).call(this),
        joins: (function() {
          var _ref, _results;
          _ref = this.joins;
          _results = [];
          for (path in _ref) {
            style = _ref[path];
            if (style === 'OUTER') {
              _results.push(headLess(path));
            }
          }
          return _results;
        }).call(this),
        where: (function() {
          var _i, _len, _ref, _results;
          _ref = this.constraints;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            c = _ref[_i];
            _results.push(conToJSON(c));
          }
          return _results;
        }).call(this)
      });
    };

    Query.prototype.fetchCode = function(lang, cb) {
      var req;
      req = {
        query: this.toXML(),
        lang: lang
      };
      return withCB(cb, this.service.post('query/code', req).then(this.service.VERIFIER).then(get('code')));
    };

    Query.prototype.setName = function(name) {
      this.name = name;
    };

    Query.prototype.save = function(name, cb) {
      var _this = this;
      return REQUIRES_VERSION(this.service, 16, function() {
        var req, _ref;
        if (utils.isFunction(name)) {
          _ref = [null, name], name = _ref[0], cb = _ref[1];
        }
        if (name != null) {
          _this.setName(name);
        }
        req = {
          type: 'PUT',
          path: 'user/queries',
          data: _this.toXML(),
          contentType: 'application/xml',
          dataType: 'json'
        };
        return withCB(cb, _this.service.authorise(req).then(function(authed) {
          return _this.service.doReq(authed);
        }).then(function(resp) {
          return resp.queries;
        }));
      });
    };

    Query.prototype.store = function(name, cb) {
      var _this = this;
      return REQUIRES_VERSION(this.service, 16, function() {
        var getName, req, updateName, _ref;
        if (utils.isFunction(name)) {
          _ref = [null, name], name = _ref[0], cb = _ref[1];
        }
        if (name != null) {
          _this.setName(name);
        }
        updateName = function(err, name) {
          if (err == null) {
            return _this.setName(name);
          }
        };
        getName = utils.compose(get(_this.name), get('queries'));
        req = {
          type: 'POST',
          path: 'user/queries',
          data: _this.toXML(),
          contentType: 'application/xml',
          dataType: 'json'
        };
        return withCB(cb, updateName, _this.service.authorise(req).then(function(authed) {
          return _this.service.doReq(authed);
        }).then(getName));
      });
    };

    Query.prototype.saveAsTemplate = function(name, cb) {
      var _this = this;
      return REQUIRES_VERSION(this.service, 16, function() {
        var req, _ref;
        if (utils.isFunction(name)) {
          _ref = [null, name], name = _ref[0], cb = _ref[1];
        }
        if (name != null) {
          _this.setName(name);
        }
        if (!_this.name) {
          throw new Error("Templates must have a name");
        }
        req = {
          type: 'POST',
          path: 'templates',
          data: "<template " + (conAttrs(_this, ['name', 'title', 'comment'])) + ">" + (_this.toXML()) + "</template>",
          contentType: 'application/xml',
          dataType: 'json'
        };
        return withCB(cb, _this.service.authorise(req).then(function(authed) {
          return _this.service.doReq(authed);
        }));
      });
    };

    Query.prototype.getCodeURI = function(lang) {
      var req, _ref;
      req = {
        query: this.toXML(),
        lang: lang,
        format: 'text'
      };
      if (((_ref = this.service) != null ? _ref.token : void 0) != null) {
        req.token = this.service.token;
      }
      return "" + this.service.root + "query/code?" + (toQueryString(req));
    };

    Query.prototype.getExportURI = function(format) {
      var req, _ref;
      if (format == null) {
        format = 'tab';
      }
      if (__indexOf.call(Query.BIO_FORMATS, format) >= 0) {
        return this["get" + (format.toUpperCase()) + "URI"]();
      }
      req = {
        query: this.toXML(),
        format: format
      };
      if (((_ref = this.service) != null ? _ref.token : void 0) != null) {
        req.token = this.service.token;
      }
      return "" + this.service.root + "query/results?" + (toQueryString(req));
    };

    Query.prototype.fetchQID = function(cb) {
      return withCB(cb, this.service.post('queries', {
        query: this.toXML()
      }).then(get('id')));
    };

    addPI = function(p) {
      return p.append('primaryIdentifier').toString();
    };

    Query.prototype.__bio_req = function(types, n) {
      var isSuitable, toRun;
      toRun = this.makeListQuery();
      isSuitable = function(p) {
        return utils.any(types, function(t) {
          return p.isa(t);
        });
      };
      toRun.views = utils.take(n)((function() {
        var _i, _len, _ref, _results;
        _ref = this.getViewNodes();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          if (isSuitable(n)) {
            _results.push(addPI(n));
          }
        }
        return _results;
      }).call(this));
      return {
        query: toRun.toXML(),
        format: 'text'
      };
    };

    Query.prototype._fasta_req = function() {
      return this.__bio_req(["SequenceFeature", 'Protein'], 1);
    };

    Query.prototype._gff3_req = function() {
      return this.__bio_req(['SequenceFeature']);
    };

    Query.prototype._bed_req = Query.prototype._gff3_req;

    return Query;

  })();

  union = fold(function(xs, ys) {
    return xs.concat(ys);
  });

  Query.ATTRIBUTE_OPS = union([Query.ATTRIBUTE_VALUE_OPS, Query.MULTIVALUE_OPS, Query.NULL_OPS]);

  Query.REFERENCE_OPS = union([Query.TERNARY_OPS, Query.LOOP_OPS, Query.LIST_OPS]);

  _ref = Query.BIO_FORMATS;
  _fn = function(f) {
    var getMeth, reqMeth, uriMeth;
    reqMeth = "_" + f + "_req";
    getMeth = "get" + (f.toUpperCase());
    uriMeth = getMeth + "URI";
    Query.prototype[getMeth] = function(opts, cb) {
      var req, v, _ref1;
      if (opts == null) {
        opts = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (utils.isFunction(opts)) {
        _ref1 = [{}, opts], opts = _ref1[0], cb = _ref1[1];
      }
      if ((opts != null ? opts.view : void 0) != null) {
        opts.view = (function() {
          var _j, _len1, _ref2, _results;
          _ref2 = opts.view;
          _results = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            v = _ref2[_j];
            _results.push(this.getPathInfo(v).toString());
          }
          return _results;
        }).call(this);
      }
      req = merge(this[reqMeth](), opts);
      return withCB(cb, this.service.post('query/results/' + f, req));
    };
    return Query.prototype[uriMeth] = function(opts, cb) {
      var req, v, _ref1;
      if (opts == null) {
        opts = {};
      }
      if (utils.isFunction(opts)) {
        _ref1 = [{}, opts], opts = _ref1[0], cb = _ref1[1];
      }
      if ((opts != null ? opts.view : void 0) != null) {
        opts.view = (function() {
          var _j, _len1, _ref2, _results;
          _ref2 = opts.view;
          _results = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            v = _ref2[_j];
            _results.push(this.getPathInfo(v).toString());
          }
          return _results;
        }).call(this);
      }
      req = merge(this[reqMeth](), opts);
      if (this.service.token != null) {
        req.token = this.service.token;
      }
      return "" + this.service.root + "query/results/" + f + "?" + (toQueryString(req));
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    f = _ref[_i];
    _fn(f);
  }

  _get_data_fetcher = function(server_fn) {
    return function() {
      var cbs, page, x, _ref1;
      page = arguments[0], cbs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (this.service[server_fn]) {
        if (!(page != null)) {
          page = {};
        } else if (utils.isFunction(page)) {
          page = {};
          cbs = (function() {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = arguments.length; _j < _len1; _j++) {
              x = arguments[_j];
              _results.push(x);
            }
            return _results;
          }).apply(this, arguments);
        }
        page = noUndefVals(merge({
          start: this.start,
          size: this.maxRows
        }, page));
        return (_ref1 = this.service)[server_fn].apply(_ref1, [this, page].concat(__slice.call(cbs)));
      } else {
        throw new Error("Service does not provide '" + server_fn + "'.");
      }
    };
  };

  for (_j = 0, _len1 = RESULTS_METHODS.length; _j < _len1; _j++) {
    mth = RESULTS_METHODS[_j];
    Query.prototype[mth] = _get_data_fetcher(mth);
  }

  intermine.Query = Query;

}).call(this);

},{"./util":14,"./xml":16}],11:[function(require,module,exports){
(function() {
  var CLASSKEYS, CLASSKEY_PATH, DEFAULT_ERROR_HANDLER, DEFAULT_PROTOCOL, ENRICHMENT_PATH, HAS_PROTOCOL, HAS_SUFFIX, IDResolutionJob, LISTS_PATH, LIST_OPERATION_PATHS, LIST_PIPE, List, MODELS, MODEL_PATH, Model, NEEDS_AUTH, NO_AUTH, PATH_VALUES_PATH, PREF_PATH, Promise, QUERY_RESULTS_PATH, QUICKSEARCH_PATH, Query, RELEASES, RELEASE_PATH, REQUIRES_VERSION, SUBTRACT_PATH, SUFFIX, SUMMARYFIELDS_PATH, SUMMARY_FIELDS, Service, TABLE_ROW_PATH, TEMPLATES_PATH, TO_NAMES, User, VERSIONS, VERSION_PATH, WHOAMI_PATH, WIDGETS, WIDGETS_PATH, WITH_OBJ_PATH, base64, dejoin, error, get, getListFinder, http, intermine, invoke, map, merge, p, set, success, to_query_string, utils, version, withCB, _get_or_fetch, _i, _len, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  Promise = require('./promise');

  Model = require('./model').Model;

  Query = require('./query').Query;

  List = require('./lists').List;

  User = require('./user').User;

  IDResolutionJob = require('./id-resolution-job').IDResolutionJob;

  base64 = require('./base64');

  version = require('./version');

  utils = require('./util');

  to_query_string = utils.querystring;

  http = require('./http');

  intermine = exports;

  withCB = utils.withCB, map = utils.map, merge = utils.merge, get = utils.get, set = utils.set, invoke = utils.invoke, success = utils.success, error = utils.error, REQUIRES_VERSION = utils.REQUIRES_VERSION, dejoin = utils.dejoin;

  VERSIONS = {};

  CLASSKEYS = {};

  RELEASES = {};

  MODELS = {};

  SUMMARY_FIELDS = {};

  WIDGETS = {};

  DEFAULT_PROTOCOL = "http://";

  VERSION_PATH = "version";

  TEMPLATES_PATH = "templates";

  RELEASE_PATH = "version/release";

  CLASSKEY_PATH = "classkeys";

  LISTS_PATH = "lists";

  MODEL_PATH = "model";

  SUMMARYFIELDS_PATH = "summaryfields";

  QUERY_RESULTS_PATH = "query/results";

  QUICKSEARCH_PATH = "search";

  WIDGETS_PATH = "widgets";

  ENRICHMENT_PATH = "list/enrichment";

  WITH_OBJ_PATH = "listswithobject";

  LIST_OPERATION_PATHS = {
    union: "lists/union",
    intersection: "lists/intersect",
    difference: "lists/diff"
  };

  SUBTRACT_PATH = 'lists/subtract';

  WHOAMI_PATH = "user/whoami";

  TABLE_ROW_PATH = QUERY_RESULTS_PATH + '/tablerows';

  PREF_PATH = 'user/preferences';

  PATH_VALUES_PATH = 'path/values';

  NO_AUTH = {};

  _ref = [VERSION_PATH, RELEASE_PATH, CLASSKEY_PATH, MODEL_PATH, SUMMARYFIELDS_PATH, QUICKSEARCH_PATH, PATH_VALUES_PATH];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    p = _ref[_i];
    NO_AUTH[p] = true;
  }

  NEEDS_AUTH = function(path) {
    return !NO_AUTH[path];
  };

  HAS_PROTOCOL = /^https?:\/\//i;

  HAS_SUFFIX = /service\/?$/i;

  SUFFIX = "/service/";

  DEFAULT_ERROR_HANDLER = function(e) {
    var f, _ref1;
    f = (_ref1 = console.error) != null ? _ref1 : console.log;
    return f(e);
  };

  _get_or_fetch = function(propName, store, path, key, cb) {
    var opts, promise, root, useCache, value, _ref1;
    root = this.root, useCache = this.useCache;
    promise = (_ref1 = this[propName]) != null ? _ref1 : this[propName] = useCache && (value = store[root]) ? success(value) : (opts = {
      type: 'GET',
      dataType: 'json',
      data: {
        format: 'json'
      }
    }, this.doReq(merge(opts, {
      url: this.root + path
    })).then(function(x) {
      return store[root] = x[key];
    }));
    return withCB(cb, promise);
  };

  getListFinder = function(name) {
    return function(lists) {
      return new Promise(function(resolve, reject) {
        var list;
        if (list = utils.find(lists, function(l) {
          return l.name === name;
        })) {
          return resolve(list);
        } else {
          return reject("List \"" + name + "\" not found among: " + (lists.map(get('name'))));
        }
      });
    };
  };

  LIST_PIPE = function(service, prop) {
    if (prop == null) {
      prop = 'listName';
    }
    return utils.compose(service.fetchList, get(prop));
  };

  TO_NAMES = function(xs) {
    var x, _j, _len1, _ref1, _ref2, _results;
    if (xs == null) {
      xs = [];
    }
    _ref1 = (utils.isArray(xs) ? xs : [xs]);
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      x = _ref1[_j];
      _results.push((_ref2 = x.name) != null ? _ref2 : x);
    }
    return _results;
  };

  Service = (function() {
    var FIVE_MIN, checkNameParam, getNewUserToken, loadQ, toMapByName;

    Service.prototype.doReq = http.doReq;

    function Service(_arg) {
      var noCache, _ref1, _ref2,
        _this = this;
      this.root = _arg.root, this.token = _arg.token, this.errorHandler = _arg.errorHandler, this.DEBUG = _arg.DEBUG, this.help = _arg.help, noCache = _arg.noCache;
      this.connectAs = __bind(this.connectAs, this);

      this.createList = __bind(this.createList, this);

      this.resolveIds = __bind(this.resolveIds, this);

      this.templateQuery = __bind(this.templateQuery, this);

      this.savedQuery = __bind(this.savedQuery, this);

      this.query = __bind(this.query, this);

      this.fetchRelease = __bind(this.fetchRelease, this);

      this.fetchClassKeys = __bind(this.fetchClassKeys, this);

      this.fetchVersion = __bind(this.fetchVersion, this);

      this.fetchSummaryFields = __bind(this.fetchSummaryFields, this);

      this.fetchModel = __bind(this.fetchModel, this);

      this.fetchWidgetMap = __bind(this.fetchWidgetMap, this);

      this.fetchWidgets = __bind(this.fetchWidgets, this);

      this.complement = __bind(this.complement, this);

      this.fetchListsContaining = __bind(this.fetchListsContaining, this);

      this.fetchList = __bind(this.fetchList, this);

      this.findLists = __bind(this.findLists, this);

      this.fetchLists = __bind(this.fetchLists, this);

      this.fetchTemplates = __bind(this.fetchTemplates, this);

      this.tableRows = __bind(this.tableRows, this);

      this.values = __bind(this.values, this);

      this.rows = __bind(this.rows, this);

      this.records = __bind(this.records, this);

      this.table = __bind(this.table, this);

      this.pathValues = __bind(this.pathValues, this);

      this.fetchUser = __bind(this.fetchUser, this);

      this.whoami = __bind(this.whoami, this);

      this.findById = __bind(this.findById, this);

      this.count = __bind(this.count, this);

      this.enrichment = __bind(this.enrichment, this);

      if (this.root == null) {
        throw new Error("No service root provided. This is required");
      }
      if (!HAS_PROTOCOL.test(this.root)) {
        this.root = DEFAULT_PROTOCOL + this.root;
      }
      if (!HAS_SUFFIX.test(this.root)) {
        this.root = this.root + SUFFIX;
      }
      this.root = this.root.replace(/ice$/, "ice/");
      if ((_ref1 = this.errorHandler) == null) {
        this.errorHandler = DEFAULT_ERROR_HANDLER;
      }
      if ((_ref2 = this.help) == null) {
        this.help = 'no.help.available@dev.null';
      }
      this.useCache = !noCache;
      this.getFormat = function(intended) {
        if (intended == null) {
          intended = 'json';
        }
        return intended;
      };
    }

    Service.prototype.post = function(path, data) {
      return this.makeRequest('POST', path, data);
    };

    Service.prototype.get = function(path, data) {
      return this.makeRequest('GET', path, data);
    };

    Service.prototype.makeRequest = function(method, path, data, cb, indiv) {
      var dataType, errBack, opts, timeout, _ref1, _ref2, _ref3,
        _this = this;
      if (method == null) {
        method = 'GET';
      }
      if (path == null) {
        path = '';
      }
      if (data == null) {
        data = {};
      }
      if (cb == null) {
        cb = (function() {});
      }
      if (indiv == null) {
        indiv = false;
      }
      if (utils.isArray(cb)) {
        _ref1 = cb, cb = _ref1[0], errBack = _ref1[1];
      }
      if (utils.isArray(data)) {
        data = utils.pairsToObj(data);
      }
      if (errBack == null) {
        errBack = this.errorHandler;
      }
      data = utils.copy(data);
      dataType = this.getFormat(data.format);
      if (!http.supports(method)) {
        _ref2 = [method, http.getMethod(method)], data.method = _ref2[0], method = _ref2[1];
      }
      opts = {
        data: data,
        dataType: dataType,
        success: cb,
        error: errBack,
        path: path,
        type: method
      };
      if ('headers' in data) {
        opts.headers = utils.copy(data.headers);
        delete opts.data.headers;
      }
      if (timeout = (_ref3 = data.timeout) != null ? _ref3 : this.timeout) {
        opts.timeout = timeout;
        delete data.timeout;
      }
      return this.authorise(opts).then(function(authed) {
        return _this.doReq(authed, indiv);
      });
    };

    Service.prototype.authorise = function(req) {
      var _this = this;
      return this.fetchVersion().then(function(version) {
        var opts, pathAdditions, _ref1;
        opts = utils.copy(req);
        opts.url = _this.root + opts.path;
        pathAdditions = [];
        if (version < 14) {
          if ('string' === typeof opts.data) {
            pathAdditions.push(['format', opts.dataType]);
          } else {
            opts.data.format = opts.dataType;
          }
        }
        if ((_this.token != null) && NEEDS_AUTH(req.path)) {
          if (version >= 14) {
            if ((_ref1 = opts.headers) == null) {
              opts.headers = {};
            }
            opts.headers.Authorization = "Token " + _this.token;
          } else if ('string' === typeof opts.data) {
            pathAdditions.push(['token', _this.token]);
          } else {
            opts.data.token = _this.token;
          }
        }
        if (pathAdditions.length) {
          opts.url += '?' + to_query_string(pathAdditions);
        }
        return opts;
      });
    };

    Service.prototype.enrichment = function(opts, cb) {
      var _this = this;
      return REQUIRES_VERSION(this, 8, function() {
        var req;
        req = merge({
          maxp: 0.05,
          correction: 'Holm-Bonferroni'
        }, opts);
        return _this.get(ENRICHMENT_PATH, req).then(get('results')).nodeify(cb);
      });
    };

    Service.prototype.search = function(options, cb) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = (function() {});
      }
      return REQUIRES_VERSION(this, 9, function() {
        var k, req, v, _ref1;
        if (utils.isFunction(options)) {
          _ref1 = [options, {}], cb = _ref1[0], options = _ref1[1];
        }
        if (typeof options === 'string') {
          req = {
            q: options
          };
        } else {
          req = {
            q: options.q
          };
          for (k in options) {
            if (!__hasProp.call(options, k)) continue;
            v = options[k];
            if (k !== 'q') {
              req["facet_" + k] = v;
            }
          }
        }
        return withCB(cb, _this.post(QUICKSEARCH_PATH, req));
      });
    };

    Service.prototype.count = function(q, cb) {
      var req;
      if (cb == null) {
        cb = (function() {});
      }
      return withCB(cb, !q ? error("Not enough arguments") : q.toPathString != null ? (p = q.isClass() ? q.append('id') : q, this.pathValues(p, 'count')) : q.toXML != null ? (req = {
        query: q.toXML(),
        format: 'jsoncount'
      }, this.post(QUERY_RESULTS_PATH, req).then(get('count'))) : typeof q === 'string' ? this.fetchModel().then(invoke('makePath', q.replace(/\.\*$/, '.id'))).then(this.count) : this.query(q).then(this.count));
    };

    Service.prototype.findById = function(type, id, cb) {
      return withCB(cb, this.query({
        from: type,
        select: ['**'],
        where: {
          id: id
        }
      }).then(dejoin).then(invoke('records')).then(get(0)));
    };

    Service.prototype.lookup = function(type, term, context, cb) {
      var _ref1;
      if (utils.isFunction(context)) {
        _ref1 = [null, context], context = _ref1[0], cb = _ref1[1];
      }
      return withCB(cb, this.query({
        from: type,
        select: ['**'],
        where: [[type, 'LOOKUP', term, context]]
      }).then(dejoin).then(invoke('records')));
    };

    Service.prototype.find = function(type, term, context, cb) {
      var _ref1;
      if (utils.isFunction(context)) {
        _ref1 = [null, context], context = _ref1[0], cb = _ref1[1];
      }
      return withCB(cb, this.lookup(type, term, context).then(function(found) {
        if (!(found != null) || found.length === 0) {
          return error("Nothing found");
        } else if (found.length > 1) {
          return error("Multiple items found: " + (found.slice(0, 3)) + "...");
        } else {
          return success(found[0]);
        }
      }));
    };

    Service.prototype.whoami = function(cb) {
      var _this = this;
      return REQUIRES_VERSION(this, 9, function() {
        return withCB(cb, _this.get(WHOAMI_PATH).then(get('user')).then(function(x) {
          return new User(_this, x);
        }));
      });
    };

    Service.prototype.fetchUser = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.whoami.apply(this, args);
    };

    Service.prototype.pathValues = function(path, typeConstraints, cb) {
      var _this = this;
      if (typeConstraints == null) {
        typeConstraints = {};
      }
      return REQUIRES_VERSION(this, 6, function() {
        var wanted, _pathValues, _ref1, _ref2;
        if (typeof typeConstraints === 'string') {
          wanted = typeConstraints;
          typeConstraints = {};
        }
        if (utils.isFunction(typeConstraints)) {
          _ref1 = [cb, typeConstraints], typeConstraints = _ref1[0], cb = _ref1[1];
        }
        if (wanted !== 'count') {
          wanted = 'results';
        }
        _pathValues = function(path) {
          var format, req;
          format = wanted === 'count' ? 'jsoncount' : 'json';
          req = {
            format: format,
            path: path.toString(),
            typeConstraints: JSON.stringify(path.subclasses)
          };
          return _this.post(PATH_VALUES_PATH, req).then(get(wanted));
        };
        try {
          return withCB(cb, _this.fetchModel().then(invoke('makePath', path, (_ref2 = path.subclasses) != null ? _ref2 : typeConstraints)).then(_pathValues));
        } catch (e) {
          return error(e);
        }
      });
    };

    Service.prototype.doPagedRequest = function(q, path, page, format, cb) {
      var req, _ref1,
        _this = this;
      if (page == null) {
        page = {};
      }
      if (cb == null) {
        cb = (function() {});
      }
      if (q.toXML != null) {
        if (utils.isFunction(page)) {
          _ref1 = [page, {}], cb = _ref1[0], page = _ref1[1];
        }
        req = merge(page, {
          query: q.toXML(),
          format: format
        });
        return withCB(cb, this.post(path, req).then(get('results')));
      } else {
        return this.query(q).then(function(query) {
          return _this.doPagedRequest(query, path, page, format, cb);
        });
      }
    };

    Service.prototype.table = function(q, page, cb) {
      return this.doPagedRequest(q, QUERY_RESULTS_PATH, page, 'jsontable', cb);
    };

    Service.prototype.records = function(q, page, cb) {
      return this.doPagedRequest(q, QUERY_RESULTS_PATH, page, 'jsonobjects', cb);
    };

    Service.prototype.rows = function(q, page, cb) {
      return this.doPagedRequest(q, QUERY_RESULTS_PATH, page, 'json', cb);
    };

    Service.prototype.values = function(q, opts, cb) {
      var resp, _ref1,
        _this = this;
      if (utils.isFunction(opts)) {
        _ref1 = [opts, cb], cb = _ref1[0], opts = _ref1[1];
      }
      resp = !(q != null) ? error("No query term supplied") : (q.descriptors != null) || typeof q === 'string' ? this.pathValues(q, opts).then(map(get('value'))) : q.toXML != null ? q.views.length !== 1 ? error("Expected one column, got " + q.views.length) : this.rows(q, opts).then(map(get(0))) : this.query(q).then(function(query) {
        return _this.values(query, opts);
      });
      return withCB(cb, resp);
    };

    Service.prototype.tableRows = function(q, page, cb) {
      return this.doPagedRequest(q, TABLE_ROW_PATH, page, 'json', cb);
    };

    Service.prototype.fetchTemplates = function(cb) {
      return withCB(cb, this.get(TEMPLATES_PATH).then(get('templates')));
    };

    Service.prototype.fetchLists = function(cb) {
      return this.findLists('', cb);
    };

    Service.prototype.findLists = function(name, cb) {
      var _this = this;
      if (name == null) {
        name = '';
      }
      if (cb == null) {
        cb = (function() {});
      }
      return this.fetchVersion().then(function(v) {
        var fn;
        return withCB(cb, name && v < 13 ? error("Finding lists by name on the server requires version 13. This is only " + v) : (fn = function(ls) {
          var data, _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = ls.length; _j < _len1; _j++) {
            data = ls[_j];
            _results.push(new List(data, _this));
          }
          return _results;
        }, _this.get(LISTS_PATH, {
          name: name
        }).then(get('lists')).then(fn)));
      });
    };

    Service.prototype.fetchList = function(name, cb) {
      var _this = this;
      return this.fetchVersion().then(function(v) {
        return withCB(cb, v < 13 ? _this.findLists().then(getListFinder(name)) : _this.findLists(name).then(get(0)));
      });
    };

    Service.prototype.fetchListsContaining = function(opts, cb) {
      var fn,
        _this = this;
      fn = function(xs) {
        var x, _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = xs.length; _j < _len1; _j++) {
          x = xs[_j];
          _results.push(new List(x, _this));
        }
        return _results;
      };
      return withCB(cb, this.get(WITH_OBJ_PATH, opts).then(get('lists')).then(fn));
    };

    Service.prototype.combineLists = function(operation, options, cb) {
      var description, lists, name, req, tags, _ref1, _ref2;
      _ref1 = merge({
        lists: [],
        tags: []
      }, options), name = _ref1.name, lists = _ref1.lists, tags = _ref1.tags, description = _ref1.description;
      req = {
        name: name,
        description: description
      };
      if ((_ref2 = req.description) == null) {
        req.description = "" + operation + " of " + (lists.join(', '));
      }
      req.tags = tags.join(';');
      req.lists = lists.join(';');
      return withCB(cb, this.get(LIST_OPERATION_PATHS[operation], req).then(LIST_PIPE(this)));
    };

    Service.prototype.merge = function() {
      return this.combineLists.apply(this, ['union'].concat(__slice.call(arguments)));
    };

    Service.prototype.intersect = function() {
      return this.combineLists.apply(this, ['intersection'].concat(__slice.call(arguments)));
    };

    Service.prototype.diff = function() {
      return this.combineLists.apply(this, ['difference'].concat(__slice.call(arguments)));
    };

    Service.prototype.complement = function(options, cb) {
      var defaultDesc, description, exclude, from, lists, name, references, req, tags;
      if (options == null) {
        options = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      from = options.from, exclude = options.exclude, name = options.name, description = options.description, tags = options.tags;
      defaultDesc = function() {
        return "Relative complement of " + (lists.join(' and ')) + " in " + (references.join(' and '));
      };
      references = TO_NAMES(from);
      lists = TO_NAMES(exclude);
      if (name == null) {
        name = defaultDesc();
      }
      if (description == null) {
        description = defaultDesc();
      }
      if (tags == null) {
        tags = [];
      }
      req = {
        name: name,
        description: description,
        tags: tags,
        lists: lists,
        references: references
      };
      return withCB(cb, this.post(SUBTRACT_PATH, req).then(LIST_PIPE(this)));
    };

    Service.prototype.fetchWidgets = function(cb) {
      var _this = this;
      return REQUIRES_VERSION(this, 8, function() {
        return _get_or_fetch.call(_this, 'widgets', WIDGETS, WIDGETS_PATH, 'widgets', cb);
      });
    };

    toMapByName = utils.omap(function(w) {
      return [w.name, w];
    });

    Service.prototype.fetchWidgetMap = function(cb) {
      var _this = this;
      return REQUIRES_VERSION(this, 8, function() {
        var _ref1;
        return withCB(cb, ((_ref1 = _this.__wmap__) != null ? _ref1 : _this.__wmap__ = _this.fetchWidgets().then(toMapByName)));
      });
    };

    Service.prototype.fetchModel = function(cb) {
      return _get_or_fetch.call(this, 'model', MODELS, MODEL_PATH, 'model').then(Model.load).then(set({
        service: this
      })).nodeify(cb);
    };

    Service.prototype.fetchSummaryFields = function(cb) {
      return _get_or_fetch.call(this, 'summaryFields', SUMMARY_FIELDS, SUMMARYFIELDS_PATH, 'classes', cb);
    };

    Service.prototype.fetchVersion = function(cb) {
      return _get_or_fetch.call(this, 'version', VERSIONS, VERSION_PATH, 'version', cb);
    };

    Service.prototype.fetchClassKeys = function(cb) {
      return _get_or_fetch.call(this, 'classkeys', CLASSKEYS, CLASSKEY_PATH, 'classes', cb);
    };

    Service.prototype.fetchRelease = function(cb) {
      return _get_or_fetch.call(this, 'release', RELEASES, RELEASE_PATH, 'version', cb);
    };

    Service.prototype.query = function(options, cb) {
      var buildQuery,
        _this = this;
      buildQuery = function(_arg) {
        var model, summaryFields;
        model = _arg[0], summaryFields = _arg[1];
        return new Query(merge(options, {
          model: model,
          summaryFields: summaryFields
        }), _this);
      };
      return withCB(cb, Promise.all(this.fetchModel(), this.fetchSummaryFields()).then(buildQuery));
    };

    loadQ = function(service, name) {
      return function(q) {
        if (!q) {
          return error("No query found called " + name);
        }
        return service.query(q);
      };
    };

    checkNameParam = function(name) {
      if (name) {
        if ('string' === typeof name) {
          return success();
        } else {
          return error("Name must be a string");
        }
      } else {
        return error("Name not provided");
      }
    };

    Service.prototype.savedQuery = function(name, cb) {
      var _this = this;
      return REQUIRES_VERSION(this, 16, function() {
        return checkNameParam(name).then(function() {
          return withCB(cb, _this.get('user/queries', {
            filter: name
          }).then(function(r) {
            return r.queries[name];
          }).then(loadQ(_this, name)));
        });
      });
    };

    Service.prototype.templateQuery = function(name, cb) {
      var _this = this;
      return checkNameParam(name).then(function() {
        return withCB(cb, _this.fetchTemplates().then(get(name)).then(set('type', 'TEMPLATE')).then(loadQ(_this, name)));
      });
    };

    Service.prototype.manageUserPreferences = function(method, data, cb) {
      var _this = this;
      return REQUIRES_VERSION(this, 11, function() {
        return withCB(cb, _this.makeRequest(method, PREF_PATH, data).then(get('preferences')));
      });
    };

    Service.prototype.resolveIds = function(opts, cb) {
      var _this = this;
      return REQUIRES_VERSION(this, 10, function() {
        var req;
        req = {
          type: 'POST',
          url: _this.root + 'ids',
          contentType: 'application/json',
          data: JSON.stringify(opts),
          dataType: 'json'
        };
        return withCB(cb, _this.doReq(req).then(get('uid')).then(IDResolutionJob.create(_this)));
      });
    };

    Service.prototype.createList = function(opts, ids, cb) {
      var adjust, req,
        _this = this;
      if (opts == null) {
        opts = {};
      }
      if (ids == null) {
        ids = '';
      }
      if (cb == null) {
        cb = function() {};
      }
      adjust = function(x) {
        return merge(x, {
          token: _this.token,
          tags: opts.tags || []
        });
      };
      req = {
        data: utils.isArray(ids) ? ids.map(function(x) {
          return "\"" + x + "\"";
        }).join("\n") : ids,
        dataType: 'json',
        url: "" + this.root + "lists?" + (to_query_string(adjust(opts))),
        type: 'POST',
        contentType: 'text/plain'
      };
      return withCB(cb, this.doReq(req).then(LIST_PIPE(this)));
    };

    getNewUserToken = function(resp) {
      return resp.user.temporaryToken;
    };

    Service.prototype.connectAs = function(token) {
      return Service.connect(merge(this, {
        token: token,
        noCache: !this.useCache
      }));
    };

    Service.prototype.register = function(name, password, cb) {
      var _this = this;
      return REQUIRES_VERSION(this, 9, function() {
        return withCB(cb, _this.post('users', {
          name: name,
          password: password
        }).then(getNewUserToken).then(_this.connectAs));
      });
    };

    FIVE_MIN = 5 * 60;

    Service.prototype.getDeregistrationToken = function(validity, cb) {
      var _this = this;
      if (validity == null) {
        validity = FIVE_MIN;
      }
      return REQUIRES_VERSION(this, 16, function() {
        var promise;
        promise = _this.token != null ? _this.post('user/deregistration', {
          validity: validity
        }).then(get('token')) : error("Not registered");
        return withCB(cb, promise);
      });
    };

    Service.prototype.deregister = function(token, cb) {
      var _this = this;
      return REQUIRES_VERSION(this, 16, function() {
        return withCB(cb, _this.makeRequest('DELETE', 'user', {
          deregistrationToken: token,
          format: 'xml'
        }));
      });
    };

    Service.prototype.login = function(name, password, cb) {
      var _this = this;
      return REQUIRES_VERSION(this, 9, function() {
        var headers;
        headers = {
          'Authorization': "Basic " + base64.encode("" + name + ":" + password)
        };
        return withCB(cb, _this.logout().then(function(service) {
          return service.get('user/token', {
            headers: headers
          });
        }).then(get('token')).then(_this.connectAs));
      });
    };

    Service.prototype.logout = function(cb) {
      return withCB(cb, success(this.connectAs()));
    };

    return Service;

  })();

  Service.prototype.rowByRow = function() {
    var args, f, q,
      _this = this;
    q = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    f = http.iterReq('POST', QUERY_RESULTS_PATH, 'json');
    if (q.toXML != null) {
      return f.apply(this, arguments);
    } else {
      return this.query(q).then(function(query) {
        return _this.rowByRow.apply(_this, [query].concat(__slice.call(args)));
      });
    }
  };

  Service.prototype.eachRow = Service.prototype.rowByRow;

  Service.prototype.recordByRecord = function() {
    var args, f, q,
      _this = this;
    q = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    f = http.iterReq('POST', QUERY_RESULTS_PATH, 'jsonobjects');
    if (q.toXML != null) {
      return f.apply(this, arguments);
    } else {
      return this.query(q).then(function(query) {
        return _this.recordByRecord.apply(_this, [query].concat(__slice.call(args)));
      });
    }
  };

  Service.prototype.eachRecord = Service.prototype.recordByRecord;

  Service.prototype.union = Service.prototype.merge;

  Service.prototype.difference = Service.prototype.diff;

  Service.prototype.symmetricDifference = Service.prototype.diff;

  Service.prototype.relativeComplement = Service.prototype.complement;

  Service.prototype.subtract = Service.prototype.complement;

  Service.flushCaches = function() {
    MODELS = {};
    VERSIONS = {};
    RELEASES = {};
    CLASSKEYS = {};
    SUMMARY_FIELDS = {};
    return WIDGETS = {};
  };

  Service.connect = function(opts) {
    if ((opts != null ? opts.root : void 0) == null) {
      throw new Error("Invalid options provided: " + (JSON.stringify(opts)));
    }
    return new Service(opts);
  };

  intermine.Service = Service;

  intermine.Model = Model;

  intermine.Query = Query;

  intermine.imjs = version;

}).call(this);

},{"./base64":1,"./http":"zlU5Ni","./id-resolution-job":5,"./lists":6,"./model":7,"./promise":9,"./query":10,"./user":13,"./util":14,"./version":15}],12:[function(require,module,exports){
(function() {
  var Table, merge, properties;

  merge = function(src, dest) {
    var k, v, _results;
    _results = [];
    for (k in src) {
      v = src[k];
      _results.push(dest[k] = v);
    }
    return _results;
  };

  properties = ['attributes', 'references', 'collections'];

  Table = (function() {

    function Table(_arg) {
      var c, prop, _, _i, _len, _ref, _ref1;
      this.name = _arg.name, this.attributes = _arg.attributes, this.references = _arg.references, this.collections = _arg.collections;
      this.fields = {};
      this.__parents__ = (_ref = arguments[0]['extends']) != null ? _ref : [];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        if (this[prop] == null) {
          throw new Error("Bad model data: missing " + prop);
        }
        merge(this[prop], this.fields);
      }
      _ref1 = this.collections;
      for (_ in _ref1) {
        c = _ref1[_];
        c.isCollection = true;
      }
    }

    Table.prototype.toString = function() {
      var n, _;
      return "[Table name=" + this.name + ", fields=[" + ((function() {
        var _ref, _results;
        _ref = this.fields;
        _results = [];
        for (n in _ref) {
          _ = _ref[n];
          _results.push(n);
        }
        return _results;
      }).call(this)) + "]]";
    };

    Table.prototype.parents = function() {
      var _ref;
      return ((_ref = this.__parents__) != null ? _ref : []).slice();
    };

    return Table;

  })();

  exports.Table = Table;

}).call(this);

},{}],13:[function(require,module,exports){
(function() {
  var User, any, do_pref_req, error, get, intermine, isFunction, withCB, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('./util'), withCB = _ref.withCB, get = _ref.get, isFunction = _ref.isFunction, any = _ref.any, error = _ref.error;

  intermine = exports;

  do_pref_req = function(user, data, method, cb) {
    return user.service.manageUserPreferences(method, data, cb).then(function(prefs) {
      return user.preferences = prefs;
    });
  };

  User = (function() {

    function User(service, _arg) {
      var _ref1;
      this.service = service;
      this.username = _arg.username, this.preferences = _arg.preferences;
      this.refresh = __bind(this.refresh, this);

      this.clearPreferences = __bind(this.clearPreferences, this);

      this.clearPreference = __bind(this.clearPreference, this);

      this.setPreferences = __bind(this.setPreferences, this);

      this.setPreference = __bind(this.setPreference, this);

      this.hasPreferences = this.preferences != null;
      if ((_ref1 = this.preferences) == null) {
        this.preferences = {};
      }
    }

    User.prototype.setPreference = function(key, value, cb) {
      var data, _ref1;
      if (isFunction(value)) {
        _ref1 = [null, value], value = _ref1[0], cb = _ref1[1];
      }
      if (typeof key === 'string') {
        data = {};
        data[key] = value;
      } else if (!(value != null)) {
        data = key;
      } else {
        return withCB(cb, error("Incorrect arguments to setPreference"));
      }
      return this.setPreferences(data, cb);
    };

    User.prototype.setPreferences = function(prefs, cb) {
      return do_pref_req(this, prefs, 'POST', cb);
    };

    User.prototype.clearPreference = function(key, cb) {
      return do_pref_req(this, {
        key: key
      }, 'DELETE', cb);
    };

    User.prototype.clearPreferences = function(cb) {
      return do_pref_req(this, {}, 'DELETE', cb);
    };

    User.prototype.refresh = function(cb) {
      return do_pref_req(this, {}, 'GET', cb);
    };

    User.prototype.createToken = function(type, message, cb) {
      var _ref1, _ref2;
      if (type == null) {
        type = 'day';
      }
      if (!(cb != null) && any([type, message], isFunction)) {
        if (isFunction(type)) {
          _ref1 = [null, null, type], type = _ref1[0], message = _ref1[1], cb = _ref1[2];
        } else if (isFunction(message)) {
          _ref2 = [null, message], message = _ref2[0], cb = _ref2[1];
        }
      }
      return withCB(cb, this.service.post('user/tokens', {
        type: type,
        message: message
      }).then(get('token')));
    };

    User.prototype.fetchCurrentTokens = function(cb) {
      return withCB(cb, this.service.get('user/tokens').then(get('tokens')));
    };

    User.prototype.revokeAllTokens = function(cb) {
      return withCB(cb, this.service.makeRequest('DELETE', 'user/tokens'));
    };

    User.prototype.revokeToken = function(token, cb) {
      return withCB(cb, this.service.makeRequest('DELETE', "user/tokens/" + token));
    };

    return User;

  })();

  intermine.User = User;

}).call(this);

},{"./util":14}],14:[function(require,module,exports){
(function() {
  var Promise, REQUIRES, comp, curry, entities, error, flatten, fold, id, invoke, invokeWith, isArray, merge, pairFold, qsFromList, root, success, thenFold, _ref,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty;

  Promise = require('./promise');

  root = exports;

  root.defer = function() {
    var deferred;
    deferred = {};
    deferred.promise = new Promise(function(resolve, reject) {
      deferred.resolve = resolve;
      return deferred.reject = reject;
    });
    return deferred;
  };

  qsFromList = function(pairs) {
    var pair;
    return ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = pairs.length; _i < _len; _i++) {
        pair = pairs[_i];
        _results.push(pair.map(encodeURIComponent).join('='));
      }
      return _results;
    })()).join('&');
  };

  root.querystring = function(obj) {
    var k, p, pairs, subList, sv, v;
    if (isArray(obj)) {
      pairs = obj.slice();
    } else {
      pairs = [];
      for (k in obj) {
        v = obj[k];
        if (isArray(v)) {
          subList = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = v.length; _i < _len; _i++) {
              sv = v[_i];
              _results.push([k, sv]);
            }
            return _results;
          })();
          pairs = pairs.concat(subList);
        } else {
          pairs.push([k, v]);
        }
      }
    }
    return qsFromList((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = pairs.length; _i < _len; _i++) {
        p = pairs[_i];
        if (p[1] != null) {
          _results.push(p);
        }
      }
      return _results;
    })());
  };

  root.curry = curry = function() {
    var args, f;
    f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return function() {
      var rest;
      rest = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return f.apply(null, args.concat(rest));
    };
  };

  root.error = error = function(e) {
    return new Promise(function(_, reject) {
      return reject(new Error(e));
    });
  };

  root.success = success = Promise.from;

  root.parallel = Promise.all;

  root.withCB = function() {
    var f, fs, p, _i, _j, _len;
    fs = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), p = arguments[_i++];
    for (_j = 0, _len = fs.length; _j < _len; _j++) {
      f = fs[_j];
      if (f != null) {
        (function(f) {
          var onErr, onSucc;
          onSucc = function(res) {
            return f(null, res);
          };
          onErr = function(err) {
            return f(err);
          };
          return p.then(onSucc, onErr);
        })(f);
      }
    }
    return p;
  };

  root.fold = fold = function(f) {
    return function(init, xs) {
      var k, ret, v;
      if (arguments.length === 1) {
        xs = (init != null ? init.slice() : void 0) || init;
        init = (xs != null ? xs.shift() : void 0) || {};
      }
      if (xs == null) {
        throw new Error("xs is null");
      }
      if (xs.reduce != null) {
        return xs.reduce(f, init);
      } else {
        ret = init;
        for (k in xs) {
          v = xs[k];
          ret = ret != null ? f(ret, k, v) : {
            k: v
          };
        }
        return ret;
      }
    };
  };

  root.take = function(n) {
    return function(xs) {
      if (n != null) {
        return xs.slice(0, (n - 1) + 1 || 9e9);
      } else {
        return xs.slice();
      }
    };
  };

  root.filter = function(f) {
    return function(xs) {
      var x, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        if (f(x)) {
          _results.push(x);
        }
      }
      return _results;
    };
  };

  root.uniqBy = function(f, xs) {
    var k, keys, values, x, _i, _len;
    if (arguments.length === 1) {
      return curry(root.uniqBy, f);
    }
    keys = [];
    values = [];
    if (xs == null) {
      return values;
    }
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      k = f(x);
      if (__indexOf.call(keys, k) < 0) {
        keys.push(k);
        values.push(x);
      }
    }
    return values;
  };

  root.find = function(xs, f) {
    var x, _i, _len;
    if (arguments.length === 1) {
      f = xs;
      return function(xs) {
        return root.find(xs, f);
      };
    }
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      if (f(x)) {
        return x;
      }
    }
    return null;
  };

  isArray = (_ref = Array.isArray) != null ? _ref : function(xs) {
    return ((xs != null ? xs.splice : void 0) != null) && ((xs != null ? xs.push : void 0) != null) && ((xs != null ? xs.pop : void 0) != null) && ((xs != null ? xs.slice : void 0) != null);
  };

  root.isArray = isArray;

  root.isFunction = typeof /./ !== 'function' ? function(f) {
    return typeof f === 'function';
  } : function(f) {
    return (f != null) && (f.call != null) && (f.apply != null) && f.toString() === '[object Function]';
  };

  entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };

  root.escape = function(str) {
    if (!(str != null)) {
      return '';
    }
    return String(str).replace(/[&<>"']/g, function(entity) {
      return entities[entity];
    });
  };

  root.omap = function(f) {
    var merger;
    merger = fold(function(a, oldk, oldv) {
      var newk, newv, _ref1;
      _ref1 = f(oldk, oldv), newk = _ref1[0], newv = _ref1[1];
      a[newk] = newv;
      return a;
    });
    return function(xs) {
      return merger({}, xs);
    };
  };

  root.copy = root.omap(function(k, v) {
    return [k, v];
  });

  root.partition = function(f) {
    return function(xs) {
      var divide;
      divide = fold(function(_arg, x) {
        var falses, trues;
        trues = _arg[0], falses = _arg[1];
        if (f(x)) {
          return [trues.concat([x]), falses];
        } else {
          return [trues, falses.concat([x])];
        }
      });
      return divide([[], []], xs);
    };
  };

  root.id = id = function(x) {
    return x;
  };

  root.concatMap = function(f) {
    return function(xs) {
      var fx, ret, x, _i, _len;
      ret = void 0;
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        fx = f(x);
        ret = ret === void 0 ? fx : typeof ret === 'number' ? ret + fx : ret.concat != null ? ret.concat(fx) : merge(ret, fx);
      }
      return ret;
    };
  };

  root.map = function(f) {
    return invoke('map', f);
  };

  comp = fold(function(f, g) {
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return f(g.apply(null, args));
    };
  });

  root.compose = function() {
    var fs;
    fs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return comp(fs);
  };

  root.flatMap = root.concatMap;

  root.difference = function(xs, remove) {
    var x, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      if (__indexOf.call(remove, x) < 0) {
        _results.push(x);
      }
    }
    return _results;
  };

  root.stringList = function(x) {
    if (typeof x === 'string') {
      return [x];
    } else {
      return x;
    }
  };

  root.flatten = flatten = function() {
    var ret, x, xs, xx, _i, _j, _len, _len1, _ref1;
    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    ret = [];
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      if (isArray(x)) {
        _ref1 = flatten.apply(null, x);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          xx = _ref1[_j];
          ret.push(xx);
        }
      } else {
        ret.push(x);
      }
    }
    return ret;
  };

  root.sum = root.concatMap(id);

  root.merge = merge = function() {
    var k, newObj, o, objs, v, _i, _len;
    objs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    newObj = {};
    for (_i = 0, _len = objs.length; _i < _len; _i++) {
      o = objs[_i];
      for (k in o) {
        if (!__hasProp.call(o, k)) continue;
        v = o[k];
        newObj[k] = v;
      }
    }
    return newObj;
  };

  root.any = function(xs, f) {
    var x, _i, _len;
    if (f == null) {
      f = id;
    }
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      if (f(x)) {
        return true;
      }
    }
    return false;
  };

  root.invoke = invoke = function() {
    var args, name;
    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return invokeWith(name, args);
  };

  root.invokeWith = invokeWith = function(name, args, ctx) {
    if (args == null) {
      args = [];
    }
    if (ctx == null) {
      ctx = null;
    }
    return function(o) {
      if (!(o != null)) {
        throw new Error("Cannot call method \"" + name + "\" of null");
      }
      if (!o[name]) {
        throw new Error("Cannot call undefined method \"" + name + " of " + o);
      } else {
        return o[name].apply(ctx || o, args);
      }
    };
  };

  root.get = function(name) {
    return function(obj) {
      return obj[name];
    };
  };

  root.set = function(name, value) {
    return function(obj) {
      var k, v;
      if (arguments.length === 2) {
        obj[name] = value;
      } else {
        for (k in name) {
          if (!__hasProp.call(name, k)) continue;
          v = name[k];
          obj[k] = v;
        }
      }
      return obj;
    };
  };

  REQUIRES = function(required, got) {
    return "This service requires a service at version " + required + " or above. This one is at " + got;
  };

  root.REQUIRES_VERSION = function(s, n, f) {
    return s.fetchVersion().then(function(v) {
      if (v >= n) {
        return f();
      } else {
        return error(REQUIRES(n, v));
      }
    });
  };

  root.dejoin = function(q) {
    var parts, view, _i, _len, _ref1;
    _ref1 = q.views;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      view = _ref1[_i];
      parts = view.split('.');
      if (parts.length > 2) {
        q.addJoin(parts.slice(1, -1).join('.'));
      }
    }
    return q;
  };

  thenFold = fold(function(p, f) {
    return p.then(f);
  });

  root.sequence = function() {
    var fns;
    fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return thenFold(success(), fns);
  };

  pairFold = fold(function(o, _arg) {
    var k, v;
    k = _arg[0], v = _arg[1];
    if (o[k] != null) {
      throw new Error("Duplicate key: " + k);
    }
    o[k] = v;
    return o;
  });

  root.pairsToObj = function(pairs) {
    return pairFold({}, pairs);
  };

}).call(this);

},{"./promise":9}],15:[function(require,module,exports){
(function() {

  exports.VERSION = '3.0.0-beta';

}).call(this);

},{}],16:[function(require,module,exports){
(function() {
  var DOMParser, sanitize;

  try {
    DOMParser = window.DOMParser;
  } catch (e) {
    DOMParser = require('xmldom').DOMParser;
  }

  sanitize = function(xml) {
    xml = xml.replace(/^\s*/g, '');
    xml = xml.replace(/\s$/g, '');
    if (xml.length === 0) {
      return xml;
    } else if (xml[xml.length - 1] !== '>') {
      return xml + '>';
    } else {
      return xml;
    }
  };

  exports.parse = function(xml) {
    var dom, parser;
    if (typeof xml !== 'string') {
      throw new Error("Expected a string - got " + xml);
    }
    xml = sanitize(xml);
    if (!xml) {
      throw new Error("Expected content - got empty string");
    }
    dom = (function() {
      try {
        parser = new DOMParser();
        return parser.parseFromString(xml, 'text/xml');
      } catch (_error) {}
    })();
    if ((!dom) || (!dom.documentElement) || dom.getElementsByTagName('parsererror').length) {
      throw new Error("Invalid XML: " + xml);
    }
    return dom;
  };

}).call(this);

},{"xmldom":17}],17:[function(require,module,exports){

},{}],18:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],19:[function(require,module,exports){
if(typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.node !== 'undefined') {
/* jshint unused:true */
    ;var http = require('http');
var url = require('url');
var zlib = require('zlib');

/* jshint unused:true */
;;var resolve = 0, reject = 1, progress = 2, chain = function(a, b) {
    /* jshint expr:true */
    a && a.then && a.then(function() {
        b[resolve].apply(null, arguments);
    }, function() {
        b[reject].apply(null, arguments);
    }, function() {
        b[progress].apply(null, arguments);
    });
    /* jshint expr:false */
}, nextTick = (global.process && global.process.nextTick) || global.setImmediate || global.setTimeout, mixInPromise = function(o) {
    var value, queue = [], state = progress;
    var makeState = function(newstate) {
        o[newstate] = function(newvalue) {
            var i, p;
            if(queue) {
                value = newvalue;
                state = newstate;

                for(i = 0; i < queue.length; i++) {
                    if(typeof queue[i][state] === 'function') {
                        try {
                            p = queue[i][state].call(null, value);
                            if(state < progress) {
                                chain(p, queue[i]._);
                            }
                        } catch(err) {
                            queue[i]._[reject](err);
                        }
                    } else if(state < progress) {
                        queue[i]._[state](value);
                    }
                }
                if(state < progress) {
                    queue = null;
                }
            }
        };
    };
    makeState(progress);
    makeState(resolve);
    makeState(reject);
    o.then = function() {
        var item = [].slice.call(arguments);
        item._ = mixInPromise({});
        if(queue) {
            queue.push(item);
        } else if(typeof item[state] === 'function') {
            nextTick(function() {
                chain(item[state](value), item._);
            });
        }
        return item._;
    };
    return o;
}, isArrayBufferView = /* jshint undef:false */function(input) {
    return typeof input === 'object' && input !== null && (
        (global.ArrayBufferView && input instanceof ArrayBufferView) ||
        (global.Int8Array && input instanceof Int8Array) ||
        (global.Uint8Array && input instanceof Uint8Array) ||
        (global.Uint8ClampedArray && input instanceof Uint8ClampedArray) ||
        (global.Int16Array && input instanceof Int16Array) ||
        (global.Uint16Array && input instanceof Uint16Array) ||
        (global.Int32Array && input instanceof Int32Array) ||
        (global.Uint32Array && input instanceof Uint32Array) ||
        (global.Float32Array && input instanceof Float32Array) ||
        (global.Float64Array && input instanceof Float64Array)
    );
}/* jshint undef:true */, isArray = function(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
}, isFormData = function(input) {
    return typeof input === 'object' && input !== null && global.FormData &&
        input instanceof global.FormData;
}, isByteArray = /* jshint undef:false */function(input) {
    return typeof input === 'object' && input !== null && (
        (global.Buffer && input instanceof Buffer) ||
        (global.Blob && input instanceof Blob) ||
        (global.File && input instanceof File) ||
        (global.ArrayBuffer && input instanceof ArrayBuffer) ||
        isArrayBufferView(input) ||
        isArray(input)
    );
}/* jshint undef:true */, supportedMethods = ',GET,HEAD,PATCH,POST,PUT,DELETE,', pass = function(value) {
    return value;
}, _undefined;
;
/* jshint unused:false */

// http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader()-method
var forbiddenInputHeaders = ['accept-charset', 'accept-encoding', 'access-control-request-headers', 'access-control-request-method', 'connection', 'content-length', 'content-transfer-encoding', 'cookie', 'cookie2', 'date', 'dnt', 'expect', 'host', 'keep-alive', 'origin', 'referer', 'te', 'trailer', 'transfer-encoding', 'upgrade', 'user-agent', 'via'];
var validateInputHeaders = function(headers) {
    'use strict';
    for(var header in headers) {
        if(headers.hasOwnProperty(header)) {
            var headerl = header.toLowerCase();
            if(forbiddenInputHeaders.indexOf(headerl) >= 0) {
                throw [14, header];
            }
            if(headerl.substr(0, 'proxy-'.length) === 'proxy-') {
                throw [15, header];
            }
            if(headerl.substr(0, 'sec-'.length) === 'sec-') {
                throw [16, header];
            }
        }
    }
};

var copy = function(from, to) {
    'use strict';
    Object.keys(from).forEach(function(key) {
        to[key] = from[key];
    });
    return to;
};

var emptyBuffer = new Buffer([]);

var utf8CharacterSizeFromHeaderByte = function(b) {
    'use strict';
    if(b < 128) {
        // one byte, ascii character
        return 1;
    }
    /* jshint bitwise:false */
    var mask = (1 << 7) | (1 << 6);
    var test = 128;
    if((b & mask) === test) {
        // b is not a header byte
        return 0;
    }
    for(var length = 1; (b & mask) !== test; length += 1) {
        mask = (mask >> 1) | 128;
        test = (test >> 1) | 128;
    }
    /* jshint bitwise:true */
    // multi byte utf8 character
    return length;
};

var httpinvoke = function(uri, method, options, cb) {
    'use strict';
    /* jshint unused:true */
    ;/* global httpinvoke, url, method, options, cb */
/* global nextTick, mixInPromise, pass, progress, reject, resolve, supportedMethods, isArray, isArrayBufferView, isFormData, isByteArray, _undefined */
/* global setTimeout */
/* global crossDomain */// this one is a hack, because when in nodejs this is not really defined, but it is never needed
/* jshint -W020 */
var promise, failWithoutRequest, uploadProgressCb, downloadProgressCb, inputLength, inputHeaders, statusCb, outputHeaders, exposedHeaders, status, outputBinary, input, outputLength, outputConverter;
/*************** COMMON initialize parameters **************/
var downloadTimeout, uploadTimeout, timeout;
if(!method) {
    // 1 argument
    // method, options, cb skipped
    method = 'GET';
    options = {};
} else if(!options) {
    // 2 arguments
    if(typeof method === 'string') {
        // options. cb skipped
        options = {};
    } else if(typeof method === 'object') {
        // method, cb skipped
        options = method;
        method = 'GET';
    } else {
        // method, options skipped
        options = {
            finished: method
        };
        method = 'GET';
    }
} else if(!cb) {
    // 3 arguments
    if(typeof method === 'object') {
        // method skipped
        method.finished = options;
        options = method;
        method = 'GET';
    } else if(typeof options === 'function') {
        // options skipped
        options = {
            finished: options
        };
    }
    // cb skipped
} else {
    // 4 arguments
    options.finished = cb;
}
var safeCallback = function(name, aspectBefore, aspectAfter) {
    return function(a, b, c, d) {
        aspectBefore(a, b, c, d);
        try {
            options[name](a, b, c, d);
        } catch(_) {
        }
        aspectAfter(a, b, c, d);
    };
};
failWithoutRequest = function(cb, err) {
    if(!(err instanceof Error)) {
        // create error here, instead of nextTick, to preserve stack
        err = new Error('Error code #' + err +'. See https://github.com/jakutis/httpinvoke#error-codes');
    }
    nextTick(function() {
        if(cb === null) {
            return;
        }
        cb(err);
    });
    promise = function() {
    };
    return mixInPromise(promise);
};

uploadProgressCb = safeCallback('uploading', pass, function(current, total) {
    promise[progress]({
        type: 'upload',
        current: current,
        total: total
    });
});
downloadProgressCb = safeCallback('downloading', pass, function(current, total, partial) {
    promise[progress]({
        type: 'download',
        current: current,
        total: total,
        partial: partial
    });
});
statusCb = safeCallback('gotStatus', function() {
    statusCb = null;
    if(downloadTimeout) {
        setTimeout(function() {
            if(cb) {
                cb(new Error('download timeout'));
                promise();
            }
        }, downloadTimeout);
    }
}, function(statusCode, headers) {
    promise[progress]({
        type: 'headers',
        statusCode: statusCode,
        headers: headers
    });
});
cb = safeCallback('finished', function() {
    cb = null;
    promise();
}, function(err, body, statusCode, headers) {
    if(err) {
        return promise[reject](err);
    }
    promise[resolve]({
        body: body,
        statusCode: statusCode,
        headers: headers
    });
});
var fixPositiveOpt = function(opt) {
    if(options[opt] === _undefined) {
        options[opt] = 0;
    } else if(typeof options[opt] === 'number') {
        if(options[opt] < 0) {
            return failWithoutRequest(cb, [1, opt]);
        }
    } else {
        return failWithoutRequest(cb, [2, opt]);
    }
};
var converters = options.converters || {};
var inputConverter;
inputHeaders = options.headers || {};
outputHeaders = {};
exposedHeaders = options.corsExposedHeaders || [];
exposedHeaders.push.apply(exposedHeaders, ['Cache-Control', 'Content-Language', 'Content-Type', 'Content-Length', 'Expires', 'Last-Modified', 'Pragma', 'Content-Range', 'Content-Encoding']);
/*************** COMMON convert and validate parameters **************/
var partialOutputMode = options.partialOutputMode || 'disabled';
if(partialOutputMode.indexOf(',') >= 0 || ',disabled,chunked,joined,'.indexOf(',' + partialOutputMode + ',') < 0) {
    return failWithoutRequest(cb, [3]);
}
if(method.indexOf(',') >= 0 || supportedMethods.indexOf(',' + method + ',') < 0) {
    return failWithoutRequest(cb, [4, method]);
}
var optionsOutputType = options.outputType;
outputBinary = optionsOutputType === 'bytearray';
if(!optionsOutputType || optionsOutputType === 'text' || outputBinary) {
    outputConverter = pass;
} else if(converters['text ' + optionsOutputType]) {
    outputConverter = converters['text ' + optionsOutputType];
    outputBinary = false;
} else if(converters['bytearray ' + optionsOutputType]) {
    outputConverter = converters['bytearray ' + optionsOutputType];
    outputBinary = true;
} else {
    return failWithoutRequest(cb, [5, optionsOutputType]);
}
inputConverter = pass;
var optionsInputType = options.inputType;
input = options.input;
if(input !== _undefined) {
    if(!optionsInputType || optionsInputType === 'auto') {
        if(typeof input !== 'string' && !isByteArray(input) && !isFormData(input)) {
            return failWithoutRequest(cb, [6]);
        }
    } else if(optionsInputType === 'text') {
        if(typeof input !== 'string') {
            return failWithoutRequest(cb, [7]);
        }
    } else if (optionsInputType === 'formdata') {
        if(!isFormData(input)) {
            return failWithoutRequest(cb, [8]);
        }
    } else if (optionsInputType === 'bytearray') {
        if(!isByteArray(input)) {
            return failWithoutRequest(cb, [9]);
        }
    } else if(converters[optionsInputType + ' text']) {
        inputConverter = converters[optionsInputType + ' text'];
    } else if(converters[optionsInputType + ' bytearray']) {
        inputConverter = converters[optionsInputType + ' bytearray'];
    } else if(converters[optionsInputType + ' formdata']) {
        inputConverter = converters[optionsInputType + ' formdata'];
    } else {
        return failWithoutRequest(cb, [10, optionsInputType]);
    }
    if(typeof input === 'object' && !isFormData(input)) {
        if(global.ArrayBuffer && input instanceof global.ArrayBuffer) {
            input = new global.Uint8Array(input);
        } else if(isArrayBufferView(input)) {
            input = new global.Uint8Array(input.buffer, input.byteOffset, input.byteLength);
        }
    }
    try {
        input = inputConverter(input);
    } catch(err) {
        return failWithoutRequest(cb, err);
    }
} else {
    if(optionsInputType && optionsInputType !== 'auto') {
        return failWithoutRequest(cb, [11]);
    }
    if(inputHeaders['Content-Type']) {
        return failWithoutRequest(cb, [12]);
    }
}
var isValidTimeout = function(timeout) {
    return timeout > 0 && timeout < 1073741824;
};
var optionsTimeout = options.timeout;
if(optionsTimeout !== _undefined) {
    if(typeof optionsTimeout === 'number' && isValidTimeout(optionsTimeout)) {
        timeout = optionsTimeout;
    } else if(isArray(optionsTimeout) && optionsTimeout.length === 2 && isValidTimeout(optionsTimeout[0]) && isValidTimeout(optionsTimeout[1])) {
        if(httpinvoke.corsFineGrainedTimeouts || !crossDomain) {
            uploadTimeout = optionsTimeout[0];
            downloadTimeout = optionsTimeout[1];
        } else {
            timeout = optionsTimeout[0] + optionsTimeout[1];
        }
    } else {
        return failWithoutRequest(cb, [13]);
    }
}
if(uploadTimeout) {
    setTimeout(function() {
        if(statusCb) {
            cb(new Error('upload timeout'));
            promise();
        }
    }, uploadTimeout);
}
if(timeout) {
    setTimeout(function() {
        if(cb) {
            cb(new Error('timeout'));
            promise();
        }
    }, timeout);
}

;
    /* jshint unused:false */
    /*************** initialize helper variables **************/
    try {
        validateInputHeaders(inputHeaders);
    } catch(err) {
        return failWithoutRequest(cb, err);
    }
    inputHeaders = copy(inputHeaders, {});
    inputHeaders['Accept-Encoding'] = 'gzip, deflate, identity';

    var ignorantlyConsume = function(res) {
        res.on('data', pass);
        res.on('end', pass);
    };
    uri = url.parse(uri);
    var req = http.request({
        hostname: uri.hostname,
        port: Number(uri.port),
        path: uri.path,
        method: method,
        headers: inputHeaders
    }, function(res) {
        var contentEncoding;
        if(!cb) {
            return ignorantlyConsume(res);
        }

        outputHeaders = res.headers;
        if('content-encoding' in outputHeaders) {
            contentEncoding = outputHeaders['content-encoding'];
            if(['identity', 'gzip', 'deflate'].indexOf(contentEncoding) < 0) {
                cb(new Error('unsupported Content-Encoding ' + contentEncoding));
                cb = null;
                return ignorantlyConsume(res);
            }
            delete outputHeaders['content-encoding'];
        } else {
            contentEncoding = 'identity';
        }

        status = res.statusCode;

        uploadProgressCb(inputLength, inputLength);
        if(!cb) {
            return ignorantlyConsume(res);
        }

        statusCb(status, outputHeaders);
        if(!cb) {
            return ignorantlyConsume(res);
        }

        if(contentEncoding === 'identity' && 'content-length' in outputHeaders) {
            outputLength = Number(outputHeaders['content-length']);
        }

        var partial = partialOutputMode === 'disabled' ? _undefined : (outputBinary ? [] : '');

        downloadProgressCb(0, outputLength, partial);
        if(!cb) {
            return ignorantlyConsume(res);
        }
        if(method === 'HEAD') {
            ignorantlyConsume(res);
            downloadProgressCb(0, 0, partial);
            return cb && cb(null, _undefined, status, outputHeaders);
        }

        var inputStream;
        if(contentEncoding === 'identity') {
            inputStream = res;
        } else {
            inputStream = zlib['create' + (contentEncoding === 'gzip' ? 'Gunzip' : 'InflateRaw')]();
            res.pipe(inputStream);
        }

        var output = [], downloaded = 0, leftover = emptyBuffer;
        inputStream.on('data', function(chunk) {
            if(!cb) {
                return;
            }

            if(partialOutputMode !== 'disabled' && !outputBinary) {
                chunk = Buffer.concat([leftover, chunk]);
                var charsize = 0, newLeftoverLength = 0;
                while(charsize === 0 && newLeftoverLength < chunk.length) {
                    newLeftoverLength += 1;
                    charsize = utf8CharacterSizeFromHeaderByte(chunk[chunk.length - newLeftoverLength]);
                }
                if(newLeftoverLength === charsize) {
                    leftover = emptyBuffer;
                } else {
                    leftover = chunk.slice(chunk.length - newLeftoverLength);
                    chunk = chunk.slice(0, chunk.length - newLeftoverLength);
                }
            }

            downloaded += chunk.length;
            output.push(chunk);

            var partial;

            if(partialOutputMode !== 'disabled') {
                partial = partialOutputMode === 'chunked' ? chunk : Buffer.concat(output);
                if(!outputBinary) {
                    partial = partial.toString('utf8');
                }
            }

            downloadProgressCb(downloaded, outputLength, partial);
        });
        inputStream.on('error', cb);
        inputStream.on('end', function() {
            if(!cb) {
                return;
            }

            // just in case the utf8 text stream was damaged, and there is leftover
            output.push(leftover);
            downloaded += leftover.length;

            if(typeof outputLength === 'undefined') {
                outputLength = downloaded;
            }

            if(downloaded !== outputLength) {
                return cb(new Error('network error'));
            }

            output = Buffer.concat(output, downloaded);
            if(!outputBinary) {
                output = output.toString('utf8');
            }

            var partial;
            if(partialOutputMode === 'chunked') {
                partial = outputBinary ? leftover : leftover.toString('utf8');
            } else if(partialOutputMode === 'joined') {
                partial = outputBinary ? output : output.toString('utf8');
            }

            downloadProgressCb(outputLength, outputLength, partial);
            if(!cb) {
                return;
            }

            if(outputLength === 0 && typeof outputHeaders['content-type'] === 'undefined') {
                return cb(null, _undefined, status, outputHeaders);
            }

            try {
                cb(null, outputConverter(output), status, outputHeaders);
            } catch(err) {
                cb(err);
            }
        });
    });

    nextTick(function() {
        if(!cb) {
            return;
        }
        uploadProgressCb(0, inputLength);
    });
    if(typeof input !== 'undefined') {
        input = new Buffer(input);
        inputLength = input.length;
        req.write(input);
    } else {
        inputLength = 0;
    }
    req.on('error', function() {
        if(!cb) {
            return;
        }
        cb(new Error('network error'));
    });
    req.end();
    promise = function() {
        if(!cb) {
            return;
        }
        cb(new Error('abort'));
    };
    return mixInPromise(promise);
};
httpinvoke.corsResponseContentTypeOnly = false;
httpinvoke.corsRequestHeaders = true;
httpinvoke.corsCredentials = true;
httpinvoke.cors = true;
httpinvoke.corsDELETE = true;
httpinvoke.corsHEAD = true;
httpinvoke.corsPATCH = true;
httpinvoke.corsPUT = true;
httpinvoke.corsStatus = true;
httpinvoke.corsResponseTextOnly = false;
httpinvoke.requestTextOnly = false;
httpinvoke.PATCH = true;
httpinvoke.corsFineGrainedTimeouts = true;

module.exports = httpinvoke;
;
/* jshint unused:false */
} else {
/* jshint unused:true */
    ;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.httpinvoke = factory();
  }
}(this, /* jshint -W030 */
/* jshint -W033 */
/* jshint -W068 */
(function() {
/* jshint +W030 */
/* jshint +W033 */
/* jshint +W068 */
    'use strict';
    var global;
    /* jshint unused:true */
    ;global = window;;var resolve = 0, reject = 1, progress = 2, chain = function(a, b) {
    /* jshint expr:true */
    a && a.then && a.then(function() {
        b[resolve].apply(null, arguments);
    }, function() {
        b[reject].apply(null, arguments);
    }, function() {
        b[progress].apply(null, arguments);
    });
    /* jshint expr:false */
}, nextTick = (global.process && global.process.nextTick) || global.setImmediate || global.setTimeout, mixInPromise = function(o) {
    var value, queue = [], state = progress;
    var makeState = function(newstate) {
        o[newstate] = function(newvalue) {
            var i, p;
            if(queue) {
                value = newvalue;
                state = newstate;

                for(i = 0; i < queue.length; i++) {
                    if(typeof queue[i][state] === 'function') {
                        try {
                            p = queue[i][state].call(null, value);
                            if(state < progress) {
                                chain(p, queue[i]._);
                            }
                        } catch(err) {
                            queue[i]._[reject](err);
                        }
                    } else if(state < progress) {
                        queue[i]._[state](value);
                    }
                }
                if(state < progress) {
                    queue = null;
                }
            }
        };
    };
    makeState(progress);
    makeState(resolve);
    makeState(reject);
    o.then = function() {
        var item = [].slice.call(arguments);
        item._ = mixInPromise({});
        if(queue) {
            queue.push(item);
        } else if(typeof item[state] === 'function') {
            nextTick(function() {
                chain(item[state](value), item._);
            });
        }
        return item._;
    };
    return o;
}, isArrayBufferView = /* jshint undef:false */function(input) {
    return typeof input === 'object' && input !== null && (
        (global.ArrayBufferView && input instanceof ArrayBufferView) ||
        (global.Int8Array && input instanceof Int8Array) ||
        (global.Uint8Array && input instanceof Uint8Array) ||
        (global.Uint8ClampedArray && input instanceof Uint8ClampedArray) ||
        (global.Int16Array && input instanceof Int16Array) ||
        (global.Uint16Array && input instanceof Uint16Array) ||
        (global.Int32Array && input instanceof Int32Array) ||
        (global.Uint32Array && input instanceof Uint32Array) ||
        (global.Float32Array && input instanceof Float32Array) ||
        (global.Float64Array && input instanceof Float64Array)
    );
}/* jshint undef:true */, isArray = function(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
}, isFormData = function(input) {
    return typeof input === 'object' && input !== null && global.FormData &&
        input instanceof global.FormData;
}, isByteArray = /* jshint undef:false */function(input) {
    return typeof input === 'object' && input !== null && (
        (global.Buffer && input instanceof Buffer) ||
        (global.Blob && input instanceof Blob) ||
        (global.File && input instanceof File) ||
        (global.ArrayBuffer && input instanceof ArrayBuffer) ||
        isArrayBufferView(input) ||
        isArray(input)
    );
}/* jshint undef:true */, supportedMethods = ',GET,HEAD,PATCH,POST,PUT,DELETE,', pass = function(value) {
    return value;
}, _undefined;
;
    /* jshint unused:false */
    // this could be a simple map, but with this "compression" we save about 100 bytes, if minified (50 bytes, if also gzipped)
    var statusTextToCode = (function() {
        for(var group = arguments.length, map = {};group--;) {
            for(var texts = arguments[group].split(','), index = texts.length;index--;) {
                map[texts[index]] = (group + 1) * 100 + index;
            }
        }
        return map;
    })(
        'Continue,Switching Protocols',
        'OK,Created,Accepted,Non-Authoritative Information,No Content,Reset Content,Partial Content',
        'Multiple Choices,Moved Permanently,Found,See Other,Not Modified,Use Proxy,_,Temporary Redirect',
        'Bad Request,Unauthorized,Payment Required,Forbidden,Not Found,Method Not Allowed,Not Acceptable,Proxy Authentication Required,Request Timeout,Conflict,Gone,Length Required,Precondition Failed,Request Entity Too Large,Request-URI Too Long,Unsupported Media Type,Requested Range Not Satisfiable,Expectation Failed',
        'Internal Server Error,Not Implemented,Bad Gateway,Service Unavailable,Gateway Time-out,HTTP Version Not Supported'
    );
    var upgradeByteArray = global.Uint8Array ? function(array) {
        return new Uint8Array(array);
    } : pass;
    var binaryStringToByteArray = function(str, bytearray) {
        for(var i = bytearray.length; i < str.length;) {
            /* jshint bitwise:false */
            bytearray.push(str.charCodeAt(i++) & 255);
            /* jshint bitwise:true */
        }
        return bytearray;
    };
    var countStringBytes = function(string) {
        for(var c, n = 0, i = string.length;i--;) {
            c = string.charCodeAt(i);
            n += c < 128 ? 1 : (c < 2048 ? 2 : 3);
        }
        return n;
    };
    var responseBodyToBytes, responseBodyLength;
    try {
        /* jshint evil:true */
        execScript('Function httpinvoke0(B,A,C)\r\nDim i\r\nFor i=C to LenB(B)\r\nA.push(AscB(MidB(B,i,1)))\r\nNext\r\nEnd Function\r\nFunction httpinvoke1(B)\r\nhttpinvoke1=LenB(B)\r\nEnd Function', 'vbscript');
        /* jshint evil:false */
        responseBodyToBytes = function(binary, bytearray) {
            // that vbscript counts from 1, not from 0
            httpinvoke0(binary, bytearray, bytearray.length + 1);
            return bytearray;
        };
        // cannot just assign the function, because httpinvoke1 is not a javascript 'function'
        responseBodyLength = function(binary) {
            return httpinvoke1(binary);
        };
    } catch(err) {
    }
    var responseByteArray = function(xhr, bytearray) {
        // If response body has bytes out of printable ascii character range, then
        // accessing xhr.responseText on Internet Explorer throws "Could not complete the operation due to error c00ce514".
        // Therefore, try getting the bytearray from xhr.responseBody.
        // Also responseBodyToBytes on some Internet Explorers is not defined, because of removed vbscript support.
        return 'responseBody' in xhr && responseBodyToBytes ? responseBodyToBytes(xhr.responseBody, bytearray) : binaryStringToByteArray(xhr.responseText, bytearray);
    };
    var responseByteArrayLength = function(xhr) {
        return 'responseBody' in xhr && responseBodyLength ? responseBodyLength(xhr.responseBody) : xhr.responseText.length;
    };
    var fillOutputHeaders = function(xhr, outputHeaders) {
        var headers = xhr.getAllResponseHeaders().split(/\r?\n/);
        var atLeastOne = false;
        for(var i = headers.length, colon, header; i--;) {
            if((colon = headers[i].indexOf(':')) >= 0) {
                outputHeaders[headers[i].substr(0, colon).toLowerCase()] = headers[i].substr(colon + 2);
                atLeastOne = true;
            }
        }
        return atLeastOne;
    };

    var urlPartitioningRegExp = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
    var isCrossDomain = function(location, uri) {
        uri = urlPartitioningRegExp.exec(uri.toLowerCase());
        location = urlPartitioningRegExp.exec(location.toLowerCase()) || [];
        return !!(uri && (uri[1] !== location[1] || uri[2] !== location[2] || (uri[3] || (uri[1] === 'http:' ? '80' : '443')) !== (location[3] || (location[1] === 'http:' ? '80' : '443'))));
    };
    var createXHR;
    var httpinvoke = function(uri, method, options, cb) {
        /* jshint unused:true */
        ;/* global httpinvoke, url, method, options, cb */
/* global nextTick, mixInPromise, pass, progress, reject, resolve, supportedMethods, isArray, isArrayBufferView, isFormData, isByteArray, _undefined */
/* global setTimeout */
/* global crossDomain */// this one is a hack, because when in nodejs this is not really defined, but it is never needed
/* jshint -W020 */
var promise, failWithoutRequest, uploadProgressCb, downloadProgressCb, inputLength, inputHeaders, statusCb, outputHeaders, exposedHeaders, status, outputBinary, input, outputLength, outputConverter;
/*************** COMMON initialize parameters **************/
var downloadTimeout, uploadTimeout, timeout;
if(!method) {
    // 1 argument
    // method, options, cb skipped
    method = 'GET';
    options = {};
} else if(!options) {
    // 2 arguments
    if(typeof method === 'string') {
        // options. cb skipped
        options = {};
    } else if(typeof method === 'object') {
        // method, cb skipped
        options = method;
        method = 'GET';
    } else {
        // method, options skipped
        options = {
            finished: method
        };
        method = 'GET';
    }
} else if(!cb) {
    // 3 arguments
    if(typeof method === 'object') {
        // method skipped
        method.finished = options;
        options = method;
        method = 'GET';
    } else if(typeof options === 'function') {
        // options skipped
        options = {
            finished: options
        };
    }
    // cb skipped
} else {
    // 4 arguments
    options.finished = cb;
}
var safeCallback = function(name, aspectBefore, aspectAfter) {
    return function(a, b, c, d) {
        aspectBefore(a, b, c, d);
        try {
            options[name](a, b, c, d);
        } catch(_) {
        }
        aspectAfter(a, b, c, d);
    };
};
failWithoutRequest = function(cb, err) {
    if(!(err instanceof Error)) {
        // create error here, instead of nextTick, to preserve stack
        err = new Error('Error code #' + err +'. See https://github.com/jakutis/httpinvoke#error-codes');
    }
    nextTick(function() {
        if(cb === null) {
            return;
        }
        cb(err);
    });
    promise = function() {
    };
    return mixInPromise(promise);
};

uploadProgressCb = safeCallback('uploading', pass, function(current, total) {
    promise[progress]({
        type: 'upload',
        current: current,
        total: total
    });
});
downloadProgressCb = safeCallback('downloading', pass, function(current, total, partial) {
    promise[progress]({
        type: 'download',
        current: current,
        total: total,
        partial: partial
    });
});
statusCb = safeCallback('gotStatus', function() {
    statusCb = null;
    if(downloadTimeout) {
        setTimeout(function() {
            if(cb) {
                cb(new Error('download timeout'));
                promise();
            }
        }, downloadTimeout);
    }
}, function(statusCode, headers) {
    promise[progress]({
        type: 'headers',
        statusCode: statusCode,
        headers: headers
    });
});
cb = safeCallback('finished', function() {
    cb = null;
    promise();
}, function(err, body, statusCode, headers) {
    if(err) {
        return promise[reject](err);
    }
    promise[resolve]({
        body: body,
        statusCode: statusCode,
        headers: headers
    });
});
var fixPositiveOpt = function(opt) {
    if(options[opt] === _undefined) {
        options[opt] = 0;
    } else if(typeof options[opt] === 'number') {
        if(options[opt] < 0) {
            return failWithoutRequest(cb, [1, opt]);
        }
    } else {
        return failWithoutRequest(cb, [2, opt]);
    }
};
var converters = options.converters || {};
var inputConverter;
inputHeaders = options.headers || {};
outputHeaders = {};
exposedHeaders = options.corsExposedHeaders || [];
exposedHeaders.push.apply(exposedHeaders, ['Cache-Control', 'Content-Language', 'Content-Type', 'Content-Length', 'Expires', 'Last-Modified', 'Pragma', 'Content-Range', 'Content-Encoding']);
/*************** COMMON convert and validate parameters **************/
var partialOutputMode = options.partialOutputMode || 'disabled';
if(partialOutputMode.indexOf(',') >= 0 || ',disabled,chunked,joined,'.indexOf(',' + partialOutputMode + ',') < 0) {
    return failWithoutRequest(cb, [3]);
}
if(method.indexOf(',') >= 0 || supportedMethods.indexOf(',' + method + ',') < 0) {
    return failWithoutRequest(cb, [4, method]);
}
var optionsOutputType = options.outputType;
outputBinary = optionsOutputType === 'bytearray';
if(!optionsOutputType || optionsOutputType === 'text' || outputBinary) {
    outputConverter = pass;
} else if(converters['text ' + optionsOutputType]) {
    outputConverter = converters['text ' + optionsOutputType];
    outputBinary = false;
} else if(converters['bytearray ' + optionsOutputType]) {
    outputConverter = converters['bytearray ' + optionsOutputType];
    outputBinary = true;
} else {
    return failWithoutRequest(cb, [5, optionsOutputType]);
}
inputConverter = pass;
var optionsInputType = options.inputType;
input = options.input;
if(input !== _undefined) {
    if(!optionsInputType || optionsInputType === 'auto') {
        if(typeof input !== 'string' && !isByteArray(input) && !isFormData(input)) {
            return failWithoutRequest(cb, [6]);
        }
    } else if(optionsInputType === 'text') {
        if(typeof input !== 'string') {
            return failWithoutRequest(cb, [7]);
        }
    } else if (optionsInputType === 'formdata') {
        if(!isFormData(input)) {
            return failWithoutRequest(cb, [8]);
        }
    } else if (optionsInputType === 'bytearray') {
        if(!isByteArray(input)) {
            return failWithoutRequest(cb, [9]);
        }
    } else if(converters[optionsInputType + ' text']) {
        inputConverter = converters[optionsInputType + ' text'];
    } else if(converters[optionsInputType + ' bytearray']) {
        inputConverter = converters[optionsInputType + ' bytearray'];
    } else if(converters[optionsInputType + ' formdata']) {
        inputConverter = converters[optionsInputType + ' formdata'];
    } else {
        return failWithoutRequest(cb, [10, optionsInputType]);
    }
    if(typeof input === 'object' && !isFormData(input)) {
        if(global.ArrayBuffer && input instanceof global.ArrayBuffer) {
            input = new global.Uint8Array(input);
        } else if(isArrayBufferView(input)) {
            input = new global.Uint8Array(input.buffer, input.byteOffset, input.byteLength);
        }
    }
    try {
        input = inputConverter(input);
    } catch(err) {
        return failWithoutRequest(cb, err);
    }
} else {
    if(optionsInputType && optionsInputType !== 'auto') {
        return failWithoutRequest(cb, [11]);
    }
    if(inputHeaders['Content-Type']) {
        return failWithoutRequest(cb, [12]);
    }
}
var isValidTimeout = function(timeout) {
    return timeout > 0 && timeout < 1073741824;
};
var optionsTimeout = options.timeout;
if(optionsTimeout !== _undefined) {
    if(typeof optionsTimeout === 'number' && isValidTimeout(optionsTimeout)) {
        timeout = optionsTimeout;
    } else if(isArray(optionsTimeout) && optionsTimeout.length === 2 && isValidTimeout(optionsTimeout[0]) && isValidTimeout(optionsTimeout[1])) {
        if(httpinvoke.corsFineGrainedTimeouts || !crossDomain) {
            uploadTimeout = optionsTimeout[0];
            downloadTimeout = optionsTimeout[1];
        } else {
            timeout = optionsTimeout[0] + optionsTimeout[1];
        }
    } else {
        return failWithoutRequest(cb, [13]);
    }
}
if(uploadTimeout) {
    setTimeout(function() {
        if(statusCb) {
            cb(new Error('upload timeout'));
            promise();
        }
    }, uploadTimeout);
}
if(timeout) {
    setTimeout(function() {
        if(cb) {
            cb(new Error('timeout'));
            promise();
        }
    }, timeout);
}

;
        /* jshint unused:false */
        /*************** initialize helper variables **************/
        var xhr, i, j, currentLocation, crossDomain, output,
            uploadProgressCbCalled = false,
            partialPosition = 0,
            partialBuffer = partialOutputMode === 'disabled' ? _undefined : (outputBinary ? [] : ''),
            partial = partialBuffer,
            partialUpdate = function() {
                if(partialOutputMode === 'disabled') {
                    return;
                }
                if(outputBinary) {
                    responseByteArray(xhr, partialBuffer);
                } else {
                    partialBuffer = xhr.responseText;
                }
                partial = partialOutputMode === 'joined' ? partialBuffer : partialBuffer.slice(partialPosition);
                partialPosition = partialBuffer.length;
            };
        var uploadProgress = function(uploaded) {
            if(!uploadProgressCb) {
                return;
            }
            if(!uploadProgressCbCalled) {
                uploadProgressCbCalled = true;
                uploadProgressCb(0, inputLength);
                if(!cb) {
                    return;
                }
            }
            uploadProgressCb(uploaded, inputLength);
            if(uploaded === inputLength) {
                uploadProgressCb = null;
            }
        };
        try {
            // IE may throw an exception when accessing
            // a field from location if document.domain has been set
            currentLocation = location.href;
        } catch(_) {
            // Use the href attribute of an A element
            // since IE will modify it given document.location
            currentLocation = document.createElement('a');
            currentLocation.href = '';
            currentLocation = currentLocation.href;
        }
        crossDomain = isCrossDomain(currentLocation, uri);
        /*************** start XHR **************/
        if(typeof input === 'object' && !isFormData(input) && httpinvoke.requestTextOnly) {
            return failWithoutRequest(cb, [17]);
        }
        if(crossDomain && !httpinvoke.cors) {
            return failWithoutRequest(cb, [18]);
        }
        for(j = ['DELETE', 'PATCH', 'PUT', 'HEAD'], i = j.length;i-- > 0;) {
            if(crossDomain && method === j[i] && !httpinvoke['cors' + j[i]]) {
                return failWithoutRequest(cb, [19, method]);
            }
        }
        if(method === 'PATCH' && !httpinvoke.PATCH) {
            return failWithoutRequest(cb, [20]);
        }
        if(!createXHR) {
            return failWithoutRequest(cb, [21]);
        }
        xhr = createXHR(crossDomain);
        try {
            xhr.open(method, uri, true);
        } catch(e) {
            return failWithoutRequest(cb, [22, uri]);
        }
        if(options.corsCredentials && httpinvoke.corsCredentials && typeof xhr.withCredentials === 'boolean') {
            xhr.withCredentials = true;
        }
        if(crossDomain && options.corsOriginHeader) {
            // on some Android devices CORS implementations are buggy
            // that is why there needs to be two workarounds:
            // 1. custom header with origin has to be passed, because they do not send Origin header on the actual request
            // 2. caching must be avoided, because of unknown reasons
            // read more: http://www.kinvey.com/blog/107/how-to-build-a-service-that-supports-every-android-browser

            // workaraound for #1: sending origin in custom header, also see the server-side part of the workaround in dummyserver.js
            inputHeaders[options.corsOriginHeader] = location.protocol + '//' + location.host;
        }

        /*************** bind XHR event listeners **************/
        var onuploadprogress = function(progressEvent) {
            if(cb && progressEvent.lengthComputable) {
                if(inputLength === _undefined) {
                    inputLength = progressEvent.total || progressEvent.totalSize || 0;
                    uploadProgress(0);
                }
                uploadProgress(progressEvent.loaded || progressEvent.position || 0);
            }
        };
        if('upload' in xhr) {
            xhr.upload.onerror = function() {
                received.error = true;
                // must check, because some callbacks are called synchronously, thus throwing exceptions and breaking code
                /* jshint expr:true */
                cb && cb(new Error('network error'));
                /* jshint expr:false */
            };
            xhr.upload.onprogress = onuploadprogress;
        } else if('onuploadprogress' in xhr) {
            xhr.onuploadprogress = onuploadprogress;
        }

        if('onerror' in xhr) {
            xhr.onerror = function() {
                received.error = true;
                //inspect('onerror', arguments[0]);
                //dbg('onerror');
                // For 4XX and 5XX response codes Firefox 3.6 cross-origin request ends up here, but has correct statusText, but no status and headers
                onLoad();
            };
        }
        var ondownloadprogress = function(progressEvent) {
            onHeadersReceived(false);
            // There is a bug in Chrome 10 on 206 response with Content-Range=0-4/12 - total must be 5
            // 'total', 12, 'totalSize', 12, 'loaded', 5, 'position', 5, 'lengthComputable', true, 'status', 206
            // console.log('total', progressEvent.total, 'totalSize', progressEvent.totalSize, 'loaded', progressEvent.loaded, 'position', progressEvent.position, 'lengthComputable', progressEvent.lengthComputable, 'status', status);
            // httpinvoke does not work around this bug, because Chrome 10 is practically not used at all, as Chrome agressively auto-updates itself to latest version
            try {
                var current = progressEvent.loaded || progressEvent.position || 0;
                if(progressEvent.lengthComputable) {
                    outputLength = progressEvent.total || progressEvent.totalSize || 0;
                }

                // Opera 12 progress events has a bug - .loaded can be higher than .total
                // see http://dev.opera.com/articles/view/xhr2/#comment-96081222
                /* jshint expr:true */
                cb && current <= outputLength && !statusCb && (partialUpdate(), downloadProgressCb(current, outputLength, partial));
                /* jshint expr:false */
            } catch(_) {
            }
        };
        if('onloadstart' in xhr) {
            xhr.onloadstart = ondownloadprogress;
        }
        if('onloadend' in xhr) {
            xhr.onloadend = ondownloadprogress;
        }
        if('onprogress' in xhr) {
            xhr.onprogress = ondownloadprogress;
        }
        /*
        var inspect = function(name, obj) {
            return;
            console.log('INSPECT ----- ', name, uri);
            for(var i in obj) {
                try {
                    console.log(name, 'PASS', i, typeof obj[i], typeof obj[i] === 'function' ? '[code]' : obj[i]);
                } catch(_) {
                    console.log(name, 'FAIL', i);
                }
            }
        };
        var dbg = function(name) {
            console.log('DBG ----- ', name, uri);
            inspect('xhr', xhr);
            try {
                console.log('PASS', 'headers', xhr.getAllResponseHeaders());
            } catch(_) {
                console.log('FAIL', 'headers');
            }
            try {
                console.log('PASS', 'cache-control', xhr.getResponseHeader('Cache-Control'));
            } catch(_) {
                console.log('FAIL', 'cache-control');
            }
        };
        */
        var received = {};
        var mustBeIdentity;
        var tryHeadersAndStatus = function(lastTry) {
            try {
                if(xhr.status) {
                    received.status = true;
                }
            } catch(_) {
            }
            try {
                if(xhr.statusText) {
                    received.status = true;
                }
            } catch(_) {
            }
            try {
                if(xhr.responseText) {
                    received.entity = true;
                }
            } catch(_) {
            }
            try {
                if(xhr.response) {
                    received.entity = true;
                }
            } catch(_) {
            }
            try {
                if(responseBodyLength(xhr.responseBody)) {
                    received.entity = true;
                }
            } catch(_) {
            }

            if(!statusCb) {
                return;
            }

            if(received.status || received.entity || received.success || lastTry) {
                if(typeof xhr.contentType === 'string' && xhr.contentType) {
                    if(xhr.contentType !== 'text/html' || xhr.responseText !== '') {
                        // When no entity body and/or no Content-Type header is sent,
                        // XDomainRequest on IE-8 defaults to text/html xhr.contentType.
                        // Also, empty string is not a valid 'text/html' entity.
                        outputHeaders['content-type'] = xhr.contentType;
                        received.headers = true;
                    }
                }
                for(var i = 0; i < exposedHeaders.length; i++) {
                    var header;
                    try {
                        /* jshint boss:true */
                        if(header = xhr.getResponseHeader(exposedHeaders[i])) {
                        /* jshint boss:false */
                            outputHeaders[exposedHeaders[i].toLowerCase()] = header;
                            received.headers = true;
                        }
                    } catch(err) {
                    }
                }
                try {
                    // note - on Opera 11.10 and 11.50 calling getAllResponseHeaders may introduce side effects on xhr and responses will timeout when server responds with some HTTP status codes
                    if(fillOutputHeaders(xhr, outputHeaders)) {
                        received.headers = true;
                    }
                } catch(err) {
                }

                mustBeIdentity = outputHeaders['content-encoding'] === 'identity' || (!crossDomain && !outputHeaders['content-encoding']);
                if(mustBeIdentity && 'content-length' in outputHeaders) {
                    outputLength = Number(outputHeaders['content-length']);
                }

                if(!status && (!crossDomain || httpinvoke.corsStatus)) {
                    // Sometimes on IE 9 accessing .status throws an error, but .statusText does not.
                    try {
                        if(xhr.status) {
                            status = xhr.status;
                        }
                    } catch(_) {
                    }
                    if(!status) {
                        try {
                            status = statusTextToCode[xhr.statusText];
                        } catch(_) {
                        }
                    }
                    // sometimes IE returns 1223 when it should be 204
                    if(status === 1223) {
                        status = 204;
                    }
                    // IE (at least version 6) returns various detailed network
                    // connection error codes (concretely - WinInet Error Codes).
                    // For references of their meaning, see http://support.microsoft.com/kb/193625
                    if(status >= 12001 && status <= 12156) {
                        status = _undefined;
                    }
                }
            }
        };
        var onHeadersReceived = function(lastTry) {
            if(!cb) {
                return;
            }

            if(!lastTry) {
                tryHeadersAndStatus(false);
            }

            if(!statusCb || (!lastTry && !(received.status && received.headers))) {
                return;
            }

            if(inputLength === _undefined) {
                inputLength = 0;
                uploadProgress(0);
            }
            uploadProgress(inputLength);
            if(!cb) {
                return;
            }

            statusCb(status, outputHeaders);
            if(!cb) {
                return;
            }

            downloadProgressCb(0, outputLength, partial);
            if(!cb) {
                return;
            }
            if(method === 'HEAD') {
                downloadProgressCb(0, 0, partial);
                return cb && cb(null, _undefined, status, outputHeaders);
            }
        };
        var onLoad = function() {
            if(!cb) {
                return;
            }

            tryHeadersAndStatus(true);

            var length;
            try {
                length =
                    partialOutputMode !== 'disabled' ?
                    responseByteArrayLength(xhr) :
                    (
                        outputBinary ?
                        (
                            'response' in xhr ?
                            (
                                xhr.response ?
                                xhr.response.byteLength :
                                0
                            ) :
                            responseByteArrayLength(xhr)
                        ) :
                        countStringBytes(xhr.responseText)
                    );
            } catch(_) {
                length = 0;
            }
            if(outputLength !== _undefined) {
                if(mustBeIdentity) {
                    if(length !== outputLength && method !== 'HEAD') {
                        return cb(new Error('network error'));
                    }
                } else {
                    if(received.error) {
                        return cb(new Error('network error'));
                    }
                }
            } else {
                outputLength = length;
            }

            var noentity = !received.entity && outputLength === 0 && outputHeaders['content-type'] === _undefined;

            if((noentity && status === 200) || (!received.success && !status && (received.error || ('onreadystatechange' in xhr && !received.readyStateLOADING)))) {
                /*
                 * Note: on Opera 10.50, TODO there is absolutely no difference
                 * between a non 2XX response and an immediate socket closing on
                 * server side - both give no headers, no status, no entity, and
                 * end up in 'onload' event. Thus some network errors will end
                 * up calling "finished" without Error.
                 */
                return cb(new Error('network error'));
            }

            onHeadersReceived(true);
            if(!cb) {
                return;
            }

            if(noentity) {
                downloadProgressCb(0, 0, partial);
                return cb(null, _undefined, status, outputHeaders);
            }

            partialUpdate();
            downloadProgressCb(outputLength, outputLength, partial);
            if(!cb) {
                return;
            }

            try {
                // If XHR2 (there is xhr.response), then there must also be Uint8Array.
                // But Uint8Array might exist even if not XHR2 (on Firefox 4).
                cb(null, outputConverter(
                    partialBuffer || (
                        outputBinary ?
                        upgradeByteArray(
                            'response' in xhr ?
                            xhr.response || [] :
                            responseByteArray(xhr, [])
                        ) :
                        xhr.responseText
                    )
                ), status, outputHeaders);
            } catch(err) {
                cb(err);
            }
        };
        var onloadBound = 'onload' in xhr;
        if(onloadBound) {
            xhr.onload = function() {
                received.success = true;
                //dbg('onload');
                onLoad();
            };
        }
        if('onreadystatechange' in xhr) {
            xhr.onreadystatechange = function() {
                //dbg('onreadystatechange ' + xhr.readyState);
                if(xhr.readyState === 2) {
                    // HEADERS_RECEIVED
                    onHeadersReceived(false);
                } else if(xhr.readyState === 3) {
                    // LOADING
                    received.readyStateLOADING = true;
                    onHeadersReceived(false);
                // Instead of 'typeof xhr.onload === "undefined"', we must use
                // onloadBound variable, because otherwise Firefox 3.5 synchronously
                // throws a "Permission denied for <> to create wrapper for
                // object of class UnnamedClass" error
                } else if(xhr.readyState === 4 && !onloadBound) {
                    // DONE
                    onLoad();
                }
            };
        }

        /*************** set XHR request headers **************/
        if(!crossDomain || httpinvoke.corsRequestHeaders) {
            for(var inputHeaderName in inputHeaders) {
                if(inputHeaders.hasOwnProperty(inputHeaderName)) {
                    try {
                        xhr.setRequestHeader(inputHeaderName, inputHeaders[inputHeaderName]);
                    } catch(err) {
                        return failWithoutRequest(cb, [23, inputHeaderName]);
                    }
                }
            }
        }
        /*************** invoke XHR request process **************/
        nextTick(function() {
            if(!cb) {
                return;
            }
            if(outputBinary) {
                try {
                    if(partialOutputMode === 'disabled' && 'response' in xhr) {
                        xhr.responseType = 'arraybuffer';
                    } else {
                        // mime type override must be done before receiving headers - at least for Safari 5.0.4
                        xhr.overrideMimeType('text/plain; charset=x-user-defined');
                    }
                } catch(_) {
                }
            }
            if(isFormData(input)) {
                try {
                    xhr.send(input);
                } catch(err) {
                    return failWithoutRequest(cb, [24]);
                }
            } else if(typeof input === 'object') {
                var triedSendArrayBufferView = false;
                var triedSendBlob = false;
                var triedSendBinaryString = false;

                var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MozBlobBuilder || global.MSBlobBuilder;
                if(isArray(input)) {
                    input = global.Uint8Array ? new Uint8Array(input) : String.fromCharCode.apply(String, input);
                }
                var toBlob = BlobBuilder ? function() {
                    var bb = new BlobBuilder();
                    bb.append(input);
                    input = bb.getBlob(inputHeaders['Content-Type'] || 'application/octet-stream');
                } : function() {
                    try {
                        input = new Blob([input], {
                            type: inputHeaders['Content-Type'] || 'application/octet-stream'
                        });
                    } catch(_) {
                        triedSendBlob = true;
                    }
                };
                var go = function() {
                    var reader;
                    if(triedSendBlob && triedSendArrayBufferView && triedSendBinaryString) {
                        return failWithoutRequest(cb, [24]);
                    }
                    if(isArrayBufferView(input)) {
                        if(triedSendArrayBufferView) {
                            if(!triedSendBinaryString) {
                                try {
                                    input = String.fromCharCode.apply(String, input);
                                } catch(_) {
                                    triedSendBinaryString = true;
                                }
                            } else if(!triedSendBlob) {
                                toBlob();
                            }
                        } else {
                            inputLength = input.byteLength;
                            try {
                                // if there is ArrayBufferView, then the browser supports sending instances of subclasses of ArayBufferView, otherwise we must send an ArrayBuffer
                                xhr.send(
                                    global.ArrayBufferView ?
                                    input :
                                    (
                                        input.byteOffset === 0 && input.length === input.buffer.byteLength ?
                                        input.buffer :
                                        (
                                            input.buffer.slice ?
                                            input.buffer.slice(input.byteOffset, input.byteOffset + input.length) :
                                            new Uint8Array([].slice.call(new Uint8Array(input.buffer), input.byteOffset, input.byteOffset + input.length)).buffer
                                        )
                                    )
                                );
                                return;
                            } catch(_) {
                            }
                            triedSendArrayBufferView = true;
                        }
                    } else if(global.Blob && input instanceof Blob) {
                        if(triedSendBlob) {
                            if(!triedSendArrayBufferView) {
                                try {
                                    reader = new FileReader();
                                    reader.onerror = function() {
                                        triedSendArrayBufferView = true;
                                        go();
                                    };
                                    reader.onload = function() {
                                        try {
                                            input = new Uint8Array(reader.result);
                                        } catch(_) {
                                            triedSendArrayBufferView = true;
                                        }
                                        go();
                                    };
                                    reader.readAsArrayBuffer(input);
                                    return;
                                } catch(_) {
                                    triedSendArrayBufferView = true;
                                }
                            } else if(!triedSendBinaryString) {
                                try {
                                    reader = new FileReader();
                                    reader.onerror = function() {
                                        triedSendBinaryString = true;
                                        go();
                                    };
                                    reader.onload = function() {
                                        input = reader.result;
                                        go();
                                    };
                                    reader.readAsBinaryString(input);
                                    return;
                                } catch(_) {
                                    triedSendBinaryString = true;
                                }
                            }
                        } else {
                            try {
                                inputLength = input.size;
                                xhr.send(input);
                                return;
                            } catch(_) {
                                triedSendBlob = true;
                            }
                        }
                    } else {
                        if(triedSendBinaryString) {
                            if(!triedSendArrayBufferView) {
                                try {
                                    input = binaryStringToByteArray(input, []);
                                } catch(_) {
                                    triedSendArrayBufferView = true;
                                }
                            } else if(!triedSendBlob) {
                                toBlob();
                            }
                        } else {
                            try {
                                inputLength = input.length;
                                xhr.sendAsBinary(input);
                                return;
                            } catch(_) {
                                triedSendBinaryString = true;
                            }
                        }
                    }
                    nextTick(go);
                };
                go();
                uploadProgress(0);
            } else {
                try {
                    if(typeof input === 'string') {
                        inputLength = countStringBytes(input);
                        xhr.send(input);
                    } else {
                        inputLength = 0;
                        xhr.send(null);
                    }
                } catch(err) {
                    return failWithoutRequest(cb, [24]);
                }
                uploadProgress(0);
            }
        });

        /*************** return "abort" function **************/
        promise = function() {
            /* jshint expr:true */
            cb && cb(new Error('abort'));
            /* jshint expr:false */
            try {
                xhr.abort();
            } catch(err){
            }
        };
        return mixInPromise(promise);
    };
    httpinvoke.corsResponseContentTypeOnly = false;
    httpinvoke.corsRequestHeaders = false;
    httpinvoke.corsCredentials = false;
    httpinvoke.cors = false;
    httpinvoke.corsDELETE = false;
    httpinvoke.corsHEAD = false;
    httpinvoke.corsPATCH = false;
    httpinvoke.corsPUT = false;
    httpinvoke.corsStatus = false;
    httpinvoke.corsResponseTextOnly = false;
    httpinvoke.corsFineGrainedTimeouts = true;
    httpinvoke.requestTextOnly = false;
    (function() {
        try {
            createXHR = function() {
                return new XMLHttpRequest();
            };
            var tmpxhr = createXHR();
            httpinvoke.requestTextOnly = !global.Uint8Array && !tmpxhr.sendAsBinary;
            httpinvoke.cors = 'withCredentials' in tmpxhr;
            if(httpinvoke.cors) {
                httpinvoke.corsRequestHeaders = true;
                httpinvoke.corsCredentials = true;
                httpinvoke.corsDELETE = true;
                httpinvoke.corsPATCH = true;
                httpinvoke.corsPUT = true;
                httpinvoke.corsHEAD = true;
                httpinvoke.corsStatus = true;
                return;
            }
        } catch(err) {
        }
        try {
            if(global.XDomainRequest === _undefined) {
                createXHR = function() {
                    return new XMLHttpRequest();
                };
                createXHR();
            } else {
                createXHR = function(cors) {
                    return cors ? new XDomainRequest() : new XMLHttpRequest();
                };
                createXHR(true);
                httpinvoke.cors = true;
                httpinvoke.corsResponseContentTypeOnly = true;
                httpinvoke.corsResponseTextOnly = true;
                httpinvoke.corsFineGrainedTimeouts = false;
            }
            return;
        } catch(err) {
        }
        try {
            createXHR();
            return;
        } catch(err) {
        }
        var candidates = ['Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP'];
        for(var i = candidates.length; i--;) {
            try {
                /* jshint loopfunc:true */
                createXHR = function() {
                    return new ActiveXObject(candidates[i]);
                };
                /* jshint loopfunc:true */
                createXHR();
                httpinvoke.requestTextOnly = true;
                return;
            } catch(err) {
            }
        }
        createXHR = _undefined;
    })();
    httpinvoke.PATCH = !!(function() {
        try {
            createXHR().open('PATCH', location.href, true);
            return 1;
        } catch(_) {
        }
    })();

    return httpinvoke;
})
));
;
/* jshint unused:false */
}

},{}],20:[function(require,module,exports){
'use strict'

var nextTick = require('./lib/next-tick')

module.exports = Promise
function Promise(fn) {
  if (!(this instanceof Promise)) return new Promise(fn)
  if (typeof fn !== 'function') throw new TypeError('not a function')
  var state = null
  var delegating = false
  var value = null
  var deferreds = []
  var self = this

  this.then = function(onFulfilled, onRejected) {
    return new Promise(function(resolve, reject) {
      handle(new Handler(onFulfilled, onRejected, resolve, reject))
    })
  }

  function handle(deferred) {
    if (state === null) {
      deferreds.push(deferred)
      return
    }
    nextTick(function() {
      var cb = state ? deferred.onFulfilled : deferred.onRejected
      if (cb === null) {
        (state ? deferred.resolve : deferred.reject)(value)
        return
      }
      var ret
      try {
        ret = cb(value)
      }
      catch (e) {
        deferred.reject(e)
        return
      }
      deferred.resolve(ret)
    })
  }

  function resolve(newValue) {
    if (delegating)
      return
    resolve_(newValue)
  }

  function resolve_(newValue) {
    if (state !== null)
      return
    try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.')
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then
        if (typeof then === 'function') {
          delegating = true
          then.call(newValue, resolve_, reject_)
          return
        }
      }
      state = true
      value = newValue
      finale()
    } catch (e) { reject_(e) }
  }

  function reject(newValue) {
    if (delegating)
      return
    reject_(newValue)
  }

  function reject_(newValue) {
    if (state !== null)
      return
    state = false
    value = newValue
    finale()
  }

  function finale() {
    for (var i = 0, len = deferreds.length; i < len; i++)
      handle(deferreds[i])
    deferreds = null
  }

  try { fn(resolve, reject) }
  catch(e) { reject(e) }
}


function Handler(onFulfilled, onRejected, resolve, reject){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
  this.resolve = resolve
  this.reject = reject
}

},{"./lib/next-tick":22}],21:[function(require,module,exports){
'use strict'

//This file contains then/promise specific extensions to the core promise API

var Promise = require('./core.js')
var nextTick = require('./lib/next-tick')

module.exports = Promise

/* Static Functions */

Promise.from = function (value) {
  if (value instanceof Promise) return value
  return new Promise(function (resolve) { resolve(value) })
}
Promise.denodeify = function (fn) {
  return function () {
    var self = this
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      args.push(function (err, res) {
        if (err) reject(err)
        else resolve(res)
      })
      fn.apply(self, args)
    })
  }
}
Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
    try {
      return fn.apply(this, arguments).nodeify(callback)
    } catch (ex) {
      if (callback == null) {
        return new Promise(function (resolve, reject) { reject(ex) })
      } else {
        nextTick(function () {
          callback(ex)
        })
      }
    }
  }
}

Promise.all = function () {
  var args = Array.prototype.slice.call(arguments.length === 1 && Array.isArray(arguments[0]) ? arguments[0] : arguments)

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    var remaining = args.length
    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then
          if (typeof then === 'function') {
            then.call(val, function (val) { res(i, val) }, reject)
            return
          }
        }
        args[i] = val
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex)
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}

/* Prototype Methods */

Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this
  self.then(null, function (err) {
    nextTick(function () {
      throw err
    })
  })
}
Promise.prototype.nodeify = function (callback) {
  if (callback == null) return this

  this.then(function (value) {
    nextTick(function () {
      callback(null, value)
    })
  }, function (err) {
    nextTick(function () {
      callback(err)
    })
  })
}
},{"./core.js":20,"./lib/next-tick":22}],22:[function(require,module,exports){
var process=require("__browserify_process");'use strict'

if (typeof setImmediate === 'function') { // IE >= 10 & node.js >= 0.10
  module.exports = function(fn){ setImmediate(fn) }
} else if (typeof process !== 'undefined' && process && typeof process.nextTick === 'function') { // node.js before 0.10
  module.exports = function(fn){ process.nextTick(fn) }
} else {
  module.exports = function(fn){ setTimeout(fn, 0) }
}

},{"__browserify_process":18}]},{},[11])
(11)
});
;;d3=function(){function n(n){return null!=n&&!isNaN(n)}function t(n){return n.length}function e(n){for(var t=1;n*t%1;)t*=10;return t}function r(n,t){try{for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}catch(r){n.prototype=t}}function u(){}function i(){}function o(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}}function a(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.substring(1);for(var e=0,r=fa.length;r>e;++e){var u=fa[e]+t;if(u in n)return u}}function c(){}function s(){}function l(n){function t(){for(var t,r=e,u=-1,i=r.length;++u<i;)(t=r[u].on)&&t.apply(this,arguments);return n}var e=[],r=new u;return t.on=function(t,u){var i,o=r.get(t);return arguments.length<2?o&&o.on:(o&&(o.on=null,e=e.slice(0,i=e.indexOf(o)).concat(e.slice(i+1)),r.remove(t)),u&&e.push(r.set(t,{on:u})),n)},t}function f(){Bo.event.preventDefault()}function h(){for(var n,t=Bo.event;n=t.sourceEvent;)t=n;return t}function g(n){for(var t=new s,e=0,r=arguments.length;++e<r;)t[arguments[e]]=l(t);return t.of=function(e,r){return function(u){try{var i=u.sourceEvent=Bo.event;u.target=n,Bo.event=u,t[u.type].apply(e,r)}finally{Bo.event=i}}},t}function p(n){return ga(n,ya),n}function v(n){return"function"==typeof n?n:function(){return pa(n,this)}}function d(n){return"function"==typeof n?n:function(){return va(n,this)}}function m(n,t){function e(){this.removeAttribute(n)}function r(){this.removeAttributeNS(n.space,n.local)}function u(){this.setAttribute(n,t)}function i(){this.setAttributeNS(n.space,n.local,t)}function o(){var e=t.apply(this,arguments);null==e?this.removeAttribute(n):this.setAttribute(n,e)}function a(){var e=t.apply(this,arguments);null==e?this.removeAttributeNS(n.space,n.local):this.setAttributeNS(n.space,n.local,e)}return n=Bo.ns.qualify(n),null==t?n.local?r:e:"function"==typeof t?n.local?a:o:n.local?i:u}function y(n){return n.trim().replace(/\s+/g," ")}function x(n){return new RegExp("(?:^|\\s+)"+Bo.requote(n)+"(?:\\s+|$)","g")}function M(n){return n.trim().split(/^|\s+/)}function _(n,t){function e(){for(var e=-1;++e<u;)n[e](this,t)}function r(){for(var e=-1,r=t.apply(this,arguments);++e<u;)n[e](this,r)}n=M(n).map(b);var u=n.length;return"function"==typeof t?r:e}function b(n){var t=x(n);return function(e,r){if(u=e.classList)return r?u.add(n):u.remove(n);var u=e.getAttribute("class")||"";r?(t.lastIndex=0,t.test(u)||e.setAttribute("class",y(u+" "+n))):e.setAttribute("class",y(u.replace(t," ")))}}function w(n,t,e){function r(){this.style.removeProperty(n)}function u(){this.style.setProperty(n,t,e)}function i(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}return null==t?r:"function"==typeof t?i:u}function S(n,t){function e(){delete this[n]}function r(){this[n]=t}function u(){var e=t.apply(this,arguments);null==e?delete this[n]:this[n]=e}return null==t?e:"function"==typeof t?u:r}function k(n){return"function"==typeof n?n:(n=Bo.ns.qualify(n)).local?function(){return this.ownerDocument.createElementNS(n.space,n.local)}:function(){return this.ownerDocument.createElementNS(this.namespaceURI,n)}}function E(n){return{__data__:n}}function A(n){return function(){return ma(this,n)}}function C(n){return arguments.length||(n=Bo.ascending),function(t,e){return t&&e?n(t.__data__,e.__data__):!t-!e}}function N(n,t){for(var e=0,r=n.length;r>e;e++)for(var u,i=n[e],o=0,a=i.length;a>o;o++)(u=i[o])&&t(u,o,e);return n}function L(n){return ga(n,Ma),n}function T(n){var t,e;return function(r,u,i){var o,a=n[i].update,c=a.length;for(i!=e&&(e=i,t=0),u>=t&&(t=u+1);!(o=a[t])&&++t<c;);return o}}function q(){var n=this.__transition__;n&&++n.active}function z(n,t,e){function r(){var t=this[o];t&&(this.removeEventListener(n,t,t.$),delete this[o])}function u(){var u=s(t,Jo(arguments));r.call(this),this.addEventListener(n,this[o]=u,u.$=e),u._=t}function i(){var t,e=new RegExp("^__on([^.]+)"+Bo.requote(n)+"$");for(var r in this)if(t=r.match(e)){var u=this[r];this.removeEventListener(t[1],u,u.$),delete this[r]}}var o="__on"+n,a=n.indexOf("."),s=R;a>0&&(n=n.substring(0,a));var l=ba.get(n);return l&&(n=l,s=D),a?t?u:r:t?c:i}function R(n,t){return function(e){var r=Bo.event;Bo.event=e,t[0]=this.__data__;try{n.apply(this,t)}finally{Bo.event=r}}}function D(n,t){var e=R(n,t);return function(n){var t=this,r=n.relatedTarget;r&&(r===t||8&r.compareDocumentPosition(t))||e.call(t,n)}}function P(){var n=".dragsuppress-"+ ++Sa,t="click"+n,e=Bo.select(Qo).on("touchmove"+n,f).on("dragstart"+n,f).on("selectstart"+n,f);if(wa){var r=Ko.style,u=r[wa];r[wa]="none"}return function(i){function o(){e.on(t,null)}e.on(n,null),wa&&(r[wa]=u),i&&(e.on(t,function(){f(),o()},!0),setTimeout(o,0))}}function U(n,t){t.changedTouches&&(t=t.changedTouches[0]);var e=n.ownerSVGElement||n;if(e.createSVGPoint){var r=e.createSVGPoint();if(0>ka&&(Qo.scrollX||Qo.scrollY)){e=Bo.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var u=e[0][0].getScreenCTM();ka=!(u.f||u.e),e.remove()}return ka?(r.x=t.pageX,r.y=t.pageY):(r.x=t.clientX,r.y=t.clientY),r=r.matrixTransform(n.getScreenCTM().inverse()),[r.x,r.y]}var i=n.getBoundingClientRect();return[t.clientX-i.left-n.clientLeft,t.clientY-i.top-n.clientTop]}function j(n){return n>0?1:0>n?-1:0}function H(n){return n>1?0:-1>n?Ea:Math.acos(n)}function F(n){return n>1?Ca:-1>n?-Ca:Math.asin(n)}function O(n){return((n=Math.exp(n))-1/n)/2}function Y(n){return((n=Math.exp(n))+1/n)/2}function I(n){return((n=Math.exp(2*n))-1)/(n+1)}function Z(n){return(n=Math.sin(n/2))*n}function V(){}function X(n,t,e){return new $(n,t,e)}function $(n,t,e){this.h=n,this.s=t,this.l=e}function B(n,t,e){function r(n){return n>360?n-=360:0>n&&(n+=360),60>n?i+(o-i)*n/60:180>n?o:240>n?i+(o-i)*(240-n)/60:i}function u(n){return Math.round(255*r(n))}var i,o;return n=isNaN(n)?0:(n%=360)<0?n+360:n,t=isNaN(t)?0:0>t?0:t>1?1:t,e=0>e?0:e>1?1:e,o=.5>=e?e*(1+t):e+t-e*t,i=2*e-o,at(u(n+120),u(n),u(n-120))}function W(n,t,e){return new J(n,t,e)}function J(n,t,e){this.h=n,this.c=t,this.l=e}function G(n,t,e){return isNaN(n)&&(n=0),isNaN(t)&&(t=0),K(e,Math.cos(n*=Ta)*t,Math.sin(n)*t)}function K(n,t,e){return new Q(n,t,e)}function Q(n,t,e){this.l=n,this.a=t,this.b=e}function nt(n,t,e){var r=(n+16)/116,u=r+t/500,i=r-e/200;return u=et(u)*Ya,r=et(r)*Ia,i=et(i)*Za,at(ut(3.2404542*u-1.5371385*r-.4985314*i),ut(-.969266*u+1.8760108*r+.041556*i),ut(.0556434*u-.2040259*r+1.0572252*i))}function tt(n,t,e){return n>0?W(Math.atan2(e,t)*qa,Math.sqrt(t*t+e*e),n):W(0/0,0/0,n)}function et(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function rt(n){return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function ut(n){return Math.round(255*(.00304>=n?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}function it(n){return at(n>>16,255&n>>8,255&n)}function ot(n){return it(n)+""}function at(n,t,e){return new ct(n,t,e)}function ct(n,t,e){this.r=n,this.g=t,this.b=e}function st(n){return 16>n?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}function lt(n,t,e){var r,u,i,o=0,a=0,c=0;if(r=/([a-z]+)\((.*)\)/i.exec(n))switch(u=r[2].split(","),r[1]){case"hsl":return e(parseFloat(u[0]),parseFloat(u[1])/100,parseFloat(u[2])/100);case"rgb":return t(pt(u[0]),pt(u[1]),pt(u[2]))}return(i=$a.get(n))?t(i.r,i.g,i.b):(null!=n&&"#"===n.charAt(0)&&(4===n.length?(o=n.charAt(1),o+=o,a=n.charAt(2),a+=a,c=n.charAt(3),c+=c):7===n.length&&(o=n.substring(1,3),a=n.substring(3,5),c=n.substring(5,7)),o=parseInt(o,16),a=parseInt(a,16),c=parseInt(c,16)),t(o,a,c))}function ft(n,t,e){var r,u,i=Math.min(n/=255,t/=255,e/=255),o=Math.max(n,t,e),a=o-i,c=(o+i)/2;return a?(u=.5>c?a/(o+i):a/(2-o-i),r=n==o?(t-e)/a+(e>t?6:0):t==o?(e-n)/a+2:(n-t)/a+4,r*=60):(r=0/0,u=c>0&&1>c?0:r),X(r,u,c)}function ht(n,t,e){n=gt(n),t=gt(t),e=gt(e);var r=rt((.4124564*n+.3575761*t+.1804375*e)/Ya),u=rt((.2126729*n+.7151522*t+.072175*e)/Ia),i=rt((.0193339*n+.119192*t+.9503041*e)/Za);return K(116*u-16,500*(r-u),200*(u-i))}function gt(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function pt(n){var t=parseFloat(n);return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}function vt(n){return"function"==typeof n?n:function(){return n}}function dt(n){return n}function mt(n){return function(t,e,r){return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),yt(t,e,n,r)}}function yt(n,t,e,r){function u(){var n,t=c.status;if(!t&&c.responseText||t>=200&&300>t||304===t){try{n=e.call(i,c)}catch(r){return o.error.call(i,r),void 0}o.load.call(i,n)}else o.error.call(i,c)}var i={},o=Bo.dispatch("beforesend","progress","load","error"),a={},c=new XMLHttpRequest,s=null;return!Qo.XDomainRequest||"withCredentials"in c||!/^(http(s)?:)?\/\//.test(n)||(c=new XDomainRequest),"onload"in c?c.onload=c.onerror=u:c.onreadystatechange=function(){c.readyState>3&&u()},c.onprogress=function(n){var t=Bo.event;Bo.event=n;try{o.progress.call(i,c)}finally{Bo.event=t}},i.header=function(n,t){return n=(n+"").toLowerCase(),arguments.length<2?a[n]:(null==t?delete a[n]:a[n]=t+"",i)},i.mimeType=function(n){return arguments.length?(t=null==n?null:n+"",i):t},i.responseType=function(n){return arguments.length?(s=n,i):s},i.response=function(n){return e=n,i},["get","post"].forEach(function(n){i[n]=function(){return i.send.apply(i,[n].concat(Jo(arguments)))}}),i.send=function(e,r,u){if(2===arguments.length&&"function"==typeof r&&(u=r,r=null),c.open(e,n,!0),null==t||"accept"in a||(a.accept=t+",*/*"),c.setRequestHeader)for(var l in a)c.setRequestHeader(l,a[l]);return null!=t&&c.overrideMimeType&&c.overrideMimeType(t),null!=s&&(c.responseType=s),null!=u&&i.on("error",u).on("load",function(n){u(null,n)}),o.beforesend.call(i,c),c.send(null==r?null:r),i},i.abort=function(){return c.abort(),i},Bo.rebind(i,o,"on"),null==r?i:i.get(xt(r))}function xt(n){return 1===n.length?function(t,e){n(null==t?e:null)}:n}function Mt(){var n=_t(),t=bt()-n;t>24?(isFinite(t)&&(clearTimeout(Ga),Ga=setTimeout(Mt,t)),Ja=0):(Ja=1,Qa(Mt))}function _t(){var n=Date.now();for(Ka=Ba;Ka;)n>=Ka.t&&(Ka.f=Ka.c(n-Ka.t)),Ka=Ka.n;return n}function bt(){for(var n,t=Ba,e=1/0;t;)t.f?t=n?n.n=t.n:Ba=t.n:(t.t<e&&(e=t.t),t=(n=t).n);return Wa=n,e}function wt(n,t){var e=Math.pow(10,3*ca(8-t));return{scale:t>8?function(n){return n/e}:function(n){return n*e},symbol:n}}function St(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}function kt(n){return n+""}function Et(){}function At(n,t,e){var r=e.s=n+t,u=r-n,i=r-u;e.t=n-i+(t-u)}function Ct(n,t){n&&fc.hasOwnProperty(n.type)&&fc[n.type](n,t)}function Nt(n,t,e){var r,u=-1,i=n.length-e;for(t.lineStart();++u<i;)r=n[u],t.point(r[0],r[1],r[2]);t.lineEnd()}function Lt(n,t){var e=-1,r=n.length;for(t.polygonStart();++e<r;)Nt(n[e],t,1);t.polygonEnd()}function Tt(){function n(n,t){n*=Ta,t=t*Ta/2+Ea/4;var e=n-r,o=Math.cos(t),a=Math.sin(t),c=i*a,s=u*o+c*Math.cos(e),l=c*Math.sin(e);gc.add(Math.atan2(l,s)),r=n,u=o,i=a}var t,e,r,u,i;pc.point=function(o,a){pc.point=n,r=(t=o)*Ta,u=Math.cos(a=(e=a)*Ta/2+Ea/4),i=Math.sin(a)},pc.lineEnd=function(){n(t,e)}}function qt(n){var t=n[0],e=n[1],r=Math.cos(e);return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function zt(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function Rt(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function Dt(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function Pt(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function Ut(n){var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function jt(n){return[Math.atan2(n[1],n[0]),F(n[2])]}function Ht(n,t){return ca(n[0]-t[0])<Na&&ca(n[1]-t[1])<Na}function Ft(n,t){n*=Ta;var e=Math.cos(t*=Ta);Ot(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}function Ot(n,t,e){++vc,mc+=(n-mc)/vc,yc+=(t-yc)/vc,xc+=(e-xc)/vc}function Yt(){function n(n,u){n*=Ta;var i=Math.cos(u*=Ta),o=i*Math.cos(n),a=i*Math.sin(n),c=Math.sin(u),s=Math.atan2(Math.sqrt((s=e*c-r*a)*s+(s=r*o-t*c)*s+(s=t*a-e*o)*s),t*o+e*a+r*c);dc+=s,Mc+=s*(t+(t=o)),_c+=s*(e+(e=a)),bc+=s*(r+(r=c)),Ot(t,e,r)}var t,e,r;Ec.point=function(u,i){u*=Ta;var o=Math.cos(i*=Ta);t=o*Math.cos(u),e=o*Math.sin(u),r=Math.sin(i),Ec.point=n,Ot(t,e,r)}}function It(){Ec.point=Ft}function Zt(){function n(n,t){n*=Ta;var e=Math.cos(t*=Ta),o=e*Math.cos(n),a=e*Math.sin(n),c=Math.sin(t),s=u*c-i*a,l=i*o-r*c,f=r*a-u*o,h=Math.sqrt(s*s+l*l+f*f),g=r*o+u*a+i*c,p=h&&-H(g)/h,v=Math.atan2(h,g);wc+=p*s,Sc+=p*l,kc+=p*f,dc+=v,Mc+=v*(r+(r=o)),_c+=v*(u+(u=a)),bc+=v*(i+(i=c)),Ot(r,u,i)}var t,e,r,u,i;Ec.point=function(o,a){t=o,e=a,Ec.point=n,o*=Ta;var c=Math.cos(a*=Ta);r=c*Math.cos(o),u=c*Math.sin(o),i=Math.sin(a),Ot(r,u,i)},Ec.lineEnd=function(){n(t,e),Ec.lineEnd=It,Ec.point=Ft}}function Vt(){return!0}function Xt(n,t,e,r,u){var i=[],o=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(Ht(e,r)){u.lineStart();for(var a=0;t>a;++a)u.point((e=n[a])[0],e[1]);return u.lineEnd(),void 0}var c=new Bt(e,n,null,!0),s=new Bt(e,null,c,!1);c.o=s,i.push(c),o.push(s),c=new Bt(r,n,null,!1),s=new Bt(r,null,c,!0),c.o=s,i.push(c),o.push(s)}}),o.sort(t),$t(i),$t(o),i.length){for(var a=0,c=e,s=o.length;s>a;++a)o[a].e=c=!c;for(var l,f,h=i[0];;){for(var g=h,p=!0;g.v;)if((g=g.n)===h)return;l=g.z,u.lineStart();do{if(g.v=g.o.v=!0,g.e){if(p)for(var a=0,s=l.length;s>a;++a)u.point((f=l[a])[0],f[1]);else r(g.x,g.n.x,1,u);g=g.n}else{if(p){l=g.p.z;for(var a=l.length-1;a>=0;--a)u.point((f=l[a])[0],f[1])}else r(g.x,g.p.x,-1,u);g=g.p}g=g.o,l=g.z,p=!p}while(!g.v);u.lineEnd()}}}function $t(n){if(t=n.length){for(var t,e,r=0,u=n[0];++r<t;)u.n=e=n[r],e.p=u,u=e;u.n=e=n[0],e.p=u}}function Bt(n,t,e,r){this.x=n,this.z=t,this.o=e,this.e=r,this.v=!1,this.n=this.p=null}function Wt(n,t,e,r){return function(u,i){function o(t,e){var r=u(t,e);n(t=r[0],e=r[1])&&i.point(t,e)}function a(n,t){var e=u(n,t);d.point(e[0],e[1])}function c(){y.point=a,d.lineStart()}function s(){y.point=o,d.lineEnd()}function l(n,t){v.push([n,t]);var e=u(n,t);M.point(e[0],e[1])}function f(){M.lineStart(),v=[]}function h(){l(v[0][0],v[0][1]),M.lineEnd();var n,t=M.clean(),e=x.buffer(),r=e.length;if(v.pop(),p.push(v),v=null,r){if(1&t){n=e[0];var u,r=n.length-1,o=-1;for(i.lineStart();++o<r;)i.point((u=n[o])[0],u[1]);return i.lineEnd(),void 0}r>1&&2&t&&e.push(e.pop().concat(e.shift())),g.push(e.filter(Jt))}}var g,p,v,d=t(i),m=u.invert(r[0],r[1]),y={point:o,lineStart:c,lineEnd:s,polygonStart:function(){y.point=l,y.lineStart=f,y.lineEnd=h,g=[],p=[],i.polygonStart()},polygonEnd:function(){y.point=o,y.lineStart=c,y.lineEnd=s,g=Bo.merge(g);var n=Qt(m,p);g.length?Xt(g,Kt,n,e,i):n&&(i.lineStart(),e(null,null,1,i),i.lineEnd()),i.polygonEnd(),g=p=null},sphere:function(){i.polygonStart(),i.lineStart(),e(null,null,1,i),i.lineEnd(),i.polygonEnd()}},x=Gt(),M=t(x);return y}}function Jt(n){return n.length>1}function Gt(){var n,t=[];return{lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:c,buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))}}}function Kt(n,t){return((n=n.x)[0]<0?n[1]-Ca-Na:Ca-n[1])-((t=t.x)[0]<0?t[1]-Ca-Na:Ca-t[1])}function Qt(n,t){var e=n[0],r=n[1],u=[Math.sin(e),-Math.cos(e),0],i=0,o=0;gc.reset();for(var a=0,c=t.length;c>a;++a){var s=t[a],l=s.length;if(l)for(var f=s[0],h=f[0],g=f[1]/2+Ea/4,p=Math.sin(g),v=Math.cos(g),d=1;;){d===l&&(d=0),n=s[d];var m=n[0],y=n[1]/2+Ea/4,x=Math.sin(y),M=Math.cos(y),_=m-h,b=ca(_)>Ea,w=p*x;if(gc.add(Math.atan2(w*Math.sin(_),v*M+w*Math.cos(_))),i+=b?_+(_>=0?Aa:-Aa):_,b^h>=e^m>=e){var S=Rt(qt(f),qt(n));Ut(S);var k=Rt(u,S);Ut(k);var E=(b^_>=0?-1:1)*F(k[2]);(r>E||r===E&&(S[0]||S[1]))&&(o+=b^_>=0?1:-1)}if(!d++)break;h=m,p=x,v=M,f=n}}return(-Na>i||Na>i&&0>gc)^1&o}function ne(n){var t,e=0/0,r=0/0,u=0/0;return{lineStart:function(){n.lineStart(),t=1},point:function(i,o){var a=i>0?Ea:-Ea,c=ca(i-e);ca(c-Ea)<Na?(n.point(e,r=(r+o)/2>0?Ca:-Ca),n.point(u,r),n.lineEnd(),n.lineStart(),n.point(a,r),n.point(i,r),t=0):u!==a&&c>=Ea&&(ca(e-u)<Na&&(e-=u*Na),ca(i-a)<Na&&(i-=a*Na),r=te(e,r,i,o),n.point(u,r),n.lineEnd(),n.lineStart(),n.point(a,r),t=0),n.point(e=i,r=o),u=a},lineEnd:function(){n.lineEnd(),e=r=0/0},clean:function(){return 2-t}}}function te(n,t,e,r){var u,i,o=Math.sin(n-e);return ca(o)>Na?Math.atan((Math.sin(t)*(i=Math.cos(r))*Math.sin(e)-Math.sin(r)*(u=Math.cos(t))*Math.sin(n))/(u*i*o)):(t+r)/2}function ee(n,t,e,r){var u;if(null==n)u=e*Ca,r.point(-Ea,u),r.point(0,u),r.point(Ea,u),r.point(Ea,0),r.point(Ea,-u),r.point(0,-u),r.point(-Ea,-u),r.point(-Ea,0),r.point(-Ea,u);else if(ca(n[0]-t[0])>Na){var i=n[0]<t[0]?Ea:-Ea;u=e*i/2,r.point(-i,u),r.point(0,u),r.point(i,u)}else r.point(t[0],t[1])}function re(n){function t(n,t){return Math.cos(n)*Math.cos(t)>i}function e(n){var e,i,c,s,l;return{lineStart:function(){s=c=!1,l=1},point:function(f,h){var g,p=[f,h],v=t(f,h),d=o?v?0:u(f,h):v?u(f+(0>f?Ea:-Ea),h):0;if(!e&&(s=c=v)&&n.lineStart(),v!==c&&(g=r(e,p),(Ht(e,g)||Ht(p,g))&&(p[0]+=Na,p[1]+=Na,v=t(p[0],p[1]))),v!==c)l=0,v?(n.lineStart(),g=r(p,e),n.point(g[0],g[1])):(g=r(e,p),n.point(g[0],g[1]),n.lineEnd()),e=g;else if(a&&e&&o^v){var m;d&i||!(m=r(p,e,!0))||(l=0,o?(n.lineStart(),n.point(m[0][0],m[0][1]),n.point(m[1][0],m[1][1]),n.lineEnd()):(n.point(m[1][0],m[1][1]),n.lineEnd(),n.lineStart(),n.point(m[0][0],m[0][1])))}!v||e&&Ht(e,p)||n.point(p[0],p[1]),e=p,c=v,i=d},lineEnd:function(){c&&n.lineEnd(),e=null},clean:function(){return l|(s&&c)<<1}}}function r(n,t,e){var r=qt(n),u=qt(t),o=[1,0,0],a=Rt(r,u),c=zt(a,a),s=a[0],l=c-s*s;if(!l)return!e&&n;var f=i*c/l,h=-i*s/l,g=Rt(o,a),p=Pt(o,f),v=Pt(a,h);Dt(p,v);var d=g,m=zt(p,d),y=zt(d,d),x=m*m-y*(zt(p,p)-1);if(!(0>x)){var M=Math.sqrt(x),_=Pt(d,(-m-M)/y);if(Dt(_,p),_=jt(_),!e)return _;var b,w=n[0],S=t[0],k=n[1],E=t[1];w>S&&(b=w,w=S,S=b);var A=S-w,C=ca(A-Ea)<Na,N=C||Na>A;if(!C&&k>E&&(b=k,k=E,E=b),N?C?k+E>0^_[1]<(ca(_[0]-w)<Na?k:E):k<=_[1]&&_[1]<=E:A>Ea^(w<=_[0]&&_[0]<=S)){var L=Pt(d,(-m+M)/y);return Dt(L,p),[_,jt(L)]}}}function u(t,e){var r=o?n:Ea-n,u=0;return-r>t?u|=1:t>r&&(u|=2),-r>e?u|=4:e>r&&(u|=8),u}var i=Math.cos(n),o=i>0,a=ca(i)>Na,c=Te(n,6*Ta);return Wt(t,e,c,o?[0,-n]:[-Ea,n-Ea])}function ue(n,t,e,r){return function(u){var i,o=u.a,a=u.b,c=o.x,s=o.y,l=a.x,f=a.y,h=0,g=1,p=l-c,v=f-s;if(i=n-c,p||!(i>0)){if(i/=p,0>p){if(h>i)return;g>i&&(g=i)}else if(p>0){if(i>g)return;i>h&&(h=i)}if(i=e-c,p||!(0>i)){if(i/=p,0>p){if(i>g)return;i>h&&(h=i)}else if(p>0){if(h>i)return;g>i&&(g=i)}if(i=t-s,v||!(i>0)){if(i/=v,0>v){if(h>i)return;g>i&&(g=i)}else if(v>0){if(i>g)return;i>h&&(h=i)}if(i=r-s,v||!(0>i)){if(i/=v,0>v){if(i>g)return;i>h&&(h=i)}else if(v>0){if(h>i)return;g>i&&(g=i)}return h>0&&(u.a={x:c+h*p,y:s+h*v}),1>g&&(u.b={x:c+g*p,y:s+g*v}),u}}}}}}function ie(n,t,e,r){function u(r,u){return ca(r[0]-n)<Na?u>0?0:3:ca(r[0]-e)<Na?u>0?2:1:ca(r[1]-t)<Na?u>0?1:0:u>0?3:2}function i(n,t){return o(n.x,t.x)}function o(n,t){var e=u(n,1),r=u(t,1);return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}return function(a){function c(n){for(var t=0,e=m.length,r=n[1],u=0;e>u;++u)for(var i,o=1,a=m[u],c=a.length,l=a[0];c>o;++o)i=a[o],l[1]<=r?i[1]>r&&s(l,i,n)>0&&++t:i[1]<=r&&s(l,i,n)<0&&--t,l=i;return 0!==t}function s(n,t,e){return(t[0]-n[0])*(e[1]-n[1])-(e[0]-n[0])*(t[1]-n[1])}function l(i,a,c,s){var l=0,f=0;if(null==i||(l=u(i,c))!==(f=u(a,c))||o(i,a)<0^c>0){do s.point(0===l||3===l?n:e,l>1?r:t);while((l=(l+c+4)%4)!==f)}else s.point(a[0],a[1])}function f(u,i){return u>=n&&e>=u&&i>=t&&r>=i}function h(n,t){f(n,t)&&a.point(n,t)}function g(){L.point=v,m&&m.push(y=[]),k=!0,S=!1,b=w=0/0}function p(){d&&(v(x,M),_&&S&&C.rejoin(),d.push(C.buffer())),L.point=h,S&&a.lineEnd()}function v(n,t){n=Math.max(-Cc,Math.min(Cc,n)),t=Math.max(-Cc,Math.min(Cc,t));var e=f(n,t);if(m&&y.push([n,t]),k)x=n,M=t,_=e,k=!1,e&&(a.lineStart(),a.point(n,t));else if(e&&S)a.point(n,t);else{var r={a:{x:b,y:w},b:{x:n,y:t}};N(r)?(S||(a.lineStart(),a.point(r.a.x,r.a.y)),a.point(r.b.x,r.b.y),e||a.lineEnd(),E=!1):e&&(a.lineStart(),a.point(n,t),E=!1)}b=n,w=t,S=e}var d,m,y,x,M,_,b,w,S,k,E,A=a,C=Gt(),N=ue(n,t,e,r),L={point:h,lineStart:g,lineEnd:p,polygonStart:function(){a=C,d=[],m=[],E=!0},polygonEnd:function(){a=A,d=Bo.merge(d);var t=c([n,r]),e=E&&t,u=d.length;(e||u)&&(a.polygonStart(),e&&(a.lineStart(),l(null,null,1,a),a.lineEnd()),u&&Xt(d,i,t,l,a),a.polygonEnd()),d=m=y=null}};return L}}function oe(n,t){function e(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),e}function ae(n){var t=0,e=Ea/3,r=we(n),u=r(t,e);return u.parallels=function(n){return arguments.length?r(t=n[0]*Ea/180,e=n[1]*Ea/180):[180*(t/Ea),180*(e/Ea)]},u}function ce(n,t){function e(n,t){var e=Math.sqrt(i-2*u*Math.sin(t))/u;return[e*Math.sin(n*=u),o-e*Math.cos(n)]}var r=Math.sin(n),u=(r+Math.sin(t))/2,i=1+r*(2*u-r),o=Math.sqrt(i)/u;return e.invert=function(n,t){var e=o-t;return[Math.atan2(n,e)/u,F((i-(n*n+e*e)*u*u)/(2*u))]},e}function se(){function n(n,t){Lc+=u*n-r*t,r=n,u=t}var t,e,r,u;Dc.point=function(i,o){Dc.point=n,t=r=i,e=u=o},Dc.lineEnd=function(){n(t,e)}}function le(n,t){Tc>n&&(Tc=n),n>zc&&(zc=n),qc>t&&(qc=t),t>Rc&&(Rc=t)}function fe(){function n(n,t){o.push("M",n,",",t,i)}function t(n,t){o.push("M",n,",",t),a.point=e}function e(n,t){o.push("L",n,",",t)}function r(){a.point=n}function u(){o.push("Z")}var i=he(4.5),o=[],a={point:n,lineStart:function(){a.point=t},lineEnd:r,polygonStart:function(){a.lineEnd=u},polygonEnd:function(){a.lineEnd=r,a.point=n},pointRadius:function(n){return i=he(n),a},result:function(){if(o.length){var n=o.join("");return o=[],n}}};return a}function he(n){return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}function ge(n,t){mc+=n,yc+=t,++xc}function pe(){function n(n,r){var u=n-t,i=r-e,o=Math.sqrt(u*u+i*i);Mc+=o*(t+n)/2,_c+=o*(e+r)/2,bc+=o,ge(t=n,e=r)}var t,e;Uc.point=function(r,u){Uc.point=n,ge(t=r,e=u)}}function ve(){Uc.point=ge}function de(){function n(n,t){var e=n-r,i=t-u,o=Math.sqrt(e*e+i*i);Mc+=o*(r+n)/2,_c+=o*(u+t)/2,bc+=o,o=u*n-r*t,wc+=o*(r+n),Sc+=o*(u+t),kc+=3*o,ge(r=n,u=t)}var t,e,r,u;Uc.point=function(i,o){Uc.point=n,ge(t=r=i,e=u=o)},Uc.lineEnd=function(){n(t,e)}}function me(n){function t(t,e){n.moveTo(t,e),n.arc(t,e,o,0,Aa)}function e(t,e){n.moveTo(t,e),a.point=r}function r(t,e){n.lineTo(t,e)}function u(){a.point=t}function i(){n.closePath()}var o=4.5,a={point:t,lineStart:function(){a.point=e},lineEnd:u,polygonStart:function(){a.lineEnd=i},polygonEnd:function(){a.lineEnd=u,a.point=t},pointRadius:function(n){return o=n,a},result:c};return a}function ye(n){function t(n){return(a?r:e)(n)}function e(t){return _e(t,function(e,r){e=n(e,r),t.point(e[0],e[1])})}function r(t){function e(e,r){e=n(e,r),t.point(e[0],e[1])}function r(){x=0/0,S.point=i,t.lineStart()}function i(e,r){var i=qt([e,r]),o=n(e,r);u(x,M,y,_,b,w,x=o[0],M=o[1],y=e,_=i[0],b=i[1],w=i[2],a,t),t.point(x,M)}function o(){S.point=e,t.lineEnd()}function c(){r(),S.point=s,S.lineEnd=l}function s(n,t){i(f=n,h=t),g=x,p=M,v=_,d=b,m=w,S.point=i}function l(){u(x,M,y,_,b,w,g,p,f,v,d,m,a,t),S.lineEnd=o,o()}var f,h,g,p,v,d,m,y,x,M,_,b,w,S={point:e,lineStart:r,lineEnd:o,polygonStart:function(){t.polygonStart(),S.lineStart=c},polygonEnd:function(){t.polygonEnd(),S.lineStart=r}};return S}function u(t,e,r,a,c,s,l,f,h,g,p,v,d,m){var y=l-t,x=f-e,M=y*y+x*x;if(M>4*i&&d--){var _=a+g,b=c+p,w=s+v,S=Math.sqrt(_*_+b*b+w*w),k=Math.asin(w/=S),E=ca(ca(w)-1)<Na||ca(r-h)<Na?(r+h)/2:Math.atan2(b,_),A=n(E,k),C=A[0],N=A[1],L=C-t,T=N-e,q=x*L-y*T;(q*q/M>i||ca((y*L+x*T)/M-.5)>.3||o>a*g+c*p+s*v)&&(u(t,e,r,a,c,s,C,N,E,_/=S,b/=S,w,d,m),m.point(C,N),u(C,N,E,_,b,w,l,f,h,g,p,v,d,m))}}var i=.5,o=Math.cos(30*Ta),a=16;return t.precision=function(n){return arguments.length?(a=(i=n*n)>0&&16,t):Math.sqrt(i)},t}function xe(n){var t=ye(function(t,e){return n([t*qa,e*qa])});return function(n){return Se(t(n))}}function Me(n){this.stream=n}function _e(n,t){return{point:t,sphere:function(){n.sphere()},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}}}function be(n){return we(function(){return n})()}function we(n){function t(n){return n=a(n[0]*Ta,n[1]*Ta),[n[0]*h+c,s-n[1]*h]}function e(n){return n=a.invert((n[0]-c)/h,(s-n[1])/h),n&&[n[0]*qa,n[1]*qa]}function r(){a=oe(o=Ae(m,y,x),i);var n=i(v,d);return c=g-n[0]*h,s=p+n[1]*h,u()}function u(){return l&&(l.valid=!1,l=null),t}var i,o,a,c,s,l,f=ye(function(n,t){return n=i(n,t),[n[0]*h+c,s-n[1]*h]}),h=150,g=480,p=250,v=0,d=0,m=0,y=0,x=0,M=Ac,_=dt,b=null,w=null;return t.stream=function(n){return l&&(l.valid=!1),l=Se(M(o,f(_(n)))),l.valid=!0,l},t.clipAngle=function(n){return arguments.length?(M=null==n?(b=n,Ac):re((b=+n)*Ta),u()):b},t.clipExtent=function(n){return arguments.length?(w=n,_=n?ie(n[0][0],n[0][1],n[1][0],n[1][1]):dt,u()):w},t.scale=function(n){return arguments.length?(h=+n,r()):h},t.translate=function(n){return arguments.length?(g=+n[0],p=+n[1],r()):[g,p]},t.center=function(n){return arguments.length?(v=n[0]%360*Ta,d=n[1]%360*Ta,r()):[v*qa,d*qa]},t.rotate=function(n){return arguments.length?(m=n[0]%360*Ta,y=n[1]%360*Ta,x=n.length>2?n[2]%360*Ta:0,r()):[m*qa,y*qa,x*qa]},Bo.rebind(t,f,"precision"),function(){return i=n.apply(this,arguments),t.invert=i.invert&&e,r()}}function Se(n){return _e(n,function(t,e){n.point(t*Ta,e*Ta)})}function ke(n,t){return[n,t]}function Ee(n,t){return[n>Ea?n-Aa:-Ea>n?n+Aa:n,t]}function Ae(n,t,e){return n?t||e?oe(Ne(n),Le(t,e)):Ne(n):t||e?Le(t,e):Ee}function Ce(n){return function(t,e){return t+=n,[t>Ea?t-Aa:-Ea>t?t+Aa:t,e]}}function Ne(n){var t=Ce(n);return t.invert=Ce(-n),t}function Le(n,t){function e(n,t){var e=Math.cos(t),a=Math.cos(n)*e,c=Math.sin(n)*e,s=Math.sin(t),l=s*r+a*u;return[Math.atan2(c*i-l*o,a*r-s*u),F(l*i+c*o)]}var r=Math.cos(n),u=Math.sin(n),i=Math.cos(t),o=Math.sin(t);return e.invert=function(n,t){var e=Math.cos(t),a=Math.cos(n)*e,c=Math.sin(n)*e,s=Math.sin(t),l=s*i-c*o;return[Math.atan2(c*i+s*o,a*r+l*u),F(l*r-a*u)]},e}function Te(n,t){var e=Math.cos(n),r=Math.sin(n);return function(u,i,o,a){var c=o*t;null!=u?(u=qe(e,u),i=qe(e,i),(o>0?i>u:u>i)&&(u+=o*Aa)):(u=n+o*Aa,i=n-.5*c);for(var s,l=u;o>0?l>i:i>l;l-=c)a.point((s=jt([e,-r*Math.cos(l),-r*Math.sin(l)]))[0],s[1])}}function qe(n,t){var e=qt(t);e[0]-=n,Ut(e);var r=H(-e[1]);return((-e[2]<0?-r:r)+2*Math.PI-Na)%(2*Math.PI)}function ze(n,t,e){var r=Bo.range(n,t-Na,e).concat(t);return function(n){return r.map(function(t){return[n,t]})}}function Re(n,t,e){var r=Bo.range(n,t-Na,e).concat(t);return function(n){return r.map(function(t){return[t,n]})}}function De(n){return n.source}function Pe(n){return n.target}function Ue(n,t,e,r){var u=Math.cos(t),i=Math.sin(t),o=Math.cos(r),a=Math.sin(r),c=u*Math.cos(n),s=u*Math.sin(n),l=o*Math.cos(e),f=o*Math.sin(e),h=2*Math.asin(Math.sqrt(Z(r-t)+u*o*Z(e-n))),g=1/Math.sin(h),p=h?function(n){var t=Math.sin(n*=h)*g,e=Math.sin(h-n)*g,r=e*c+t*l,u=e*s+t*f,o=e*i+t*a;return[Math.atan2(u,r)*qa,Math.atan2(o,Math.sqrt(r*r+u*u))*qa]}:function(){return[n*qa,t*qa]};return p.distance=h,p}function je(){function n(n,u){var i=Math.sin(u*=Ta),o=Math.cos(u),a=ca((n*=Ta)-t),c=Math.cos(a);jc+=Math.atan2(Math.sqrt((a=o*Math.sin(a))*a+(a=r*i-e*o*c)*a),e*i+r*o*c),t=n,e=i,r=o}var t,e,r;Hc.point=function(u,i){t=u*Ta,e=Math.sin(i*=Ta),r=Math.cos(i),Hc.point=n},Hc.lineEnd=function(){Hc.point=Hc.lineEnd=c}}function He(n,t){function e(t,e){var r=Math.cos(t),u=Math.cos(e),i=n(r*u);return[i*u*Math.sin(t),i*Math.sin(e)]}return e.invert=function(n,e){var r=Math.sqrt(n*n+e*e),u=t(r),i=Math.sin(u),o=Math.cos(u);return[Math.atan2(n*i,r*o),Math.asin(r&&e*i/r)]},e}function Fe(n,t){function e(n,t){var e=ca(ca(t)-Ca)<Na?0:o/Math.pow(u(t),i);return[e*Math.sin(i*n),o-e*Math.cos(i*n)]}var r=Math.cos(n),u=function(n){return Math.tan(Ea/4+n/2)},i=n===t?Math.sin(n):Math.log(r/Math.cos(t))/Math.log(u(t)/u(n)),o=r*Math.pow(u(n),i)/i;return i?(e.invert=function(n,t){var e=o-t,r=j(i)*Math.sqrt(n*n+e*e);return[Math.atan2(n,e)/i,2*Math.atan(Math.pow(o/r,1/i))-Ca]},e):Ye}function Oe(n,t){function e(n,t){var e=i-t;return[e*Math.sin(u*n),i-e*Math.cos(u*n)]}var r=Math.cos(n),u=n===t?Math.sin(n):(r-Math.cos(t))/(t-n),i=r/u+n;return ca(u)<Na?ke:(e.invert=function(n,t){var e=i-t;return[Math.atan2(n,e)/u,i-j(u)*Math.sqrt(n*n+e*e)]},e)}function Ye(n,t){return[n,Math.log(Math.tan(Ea/4+t/2))]}function Ie(n){var t,e=be(n),r=e.scale,u=e.translate,i=e.clipExtent;return e.scale=function(){var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.translate=function(){var n=u.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){var o=i.apply(e,arguments);if(o===e){if(t=null==n){var a=Ea*r(),c=u();i([[c[0]-a,c[1]-a],[c[0]+a,c[1]+a]])}}else t&&(o=null);return o},e.clipExtent(null)}function Ze(n,t){return[Math.log(Math.tan(Ea/4+t/2)),-n]}function Ve(n){return n[0]}function Xe(n){return n[1]}function $e(n,t,e,r){var u,i,o,a,c,s,l;return u=r[n],i=u[0],o=u[1],u=r[t],a=u[0],c=u[1],u=r[e],s=u[0],l=u[1],(l-o)*(a-i)-(c-o)*(s-i)>0}function Be(n,t,e){return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function We(n,t,e,r){var u=n[0],i=e[0],o=t[0]-u,a=r[0]-i,c=n[1],s=e[1],l=t[1]-c,f=r[1]-s,h=(a*(c-s)-f*(u-i))/(f*o-a*l);return[u+h*o,c+h*l]}function Je(n){var t=n[0],e=n[n.length-1];return!(t[0]-e[0]||t[1]-e[1])}function Ge(){yr(this),this.edge=this.site=this.circle=null}function Ke(n){var t=Gc.pop()||new Ge;return t.site=n,t}function Qe(n){sr(n),Bc.remove(n),Gc.push(n),yr(n)}function nr(n){var t=n.circle,e=t.x,r=t.cy,u={x:e,y:r},i=n.P,o=n.N,a=[n];Qe(n);for(var c=i;c.circle&&ca(e-c.circle.x)<Na&&ca(r-c.circle.cy)<Na;)i=c.P,a.unshift(c),Qe(c),c=i;a.unshift(c),sr(c);for(var s=o;s.circle&&ca(e-s.circle.x)<Na&&ca(r-s.circle.cy)<Na;)o=s.N,a.push(s),Qe(s),s=o;a.push(s),sr(s);var l,f=a.length;for(l=1;f>l;++l)s=a[l],c=a[l-1],vr(s.edge,c.site,s.site,u);c=a[0],s=a[f-1],s.edge=gr(c.site,s.site,null,u),cr(c),cr(s)}function tr(n){for(var t,e,r,u,i=n.x,o=n.y,a=Bc._;a;)if(r=er(a,o)-i,r>Na)a=a.L;else{if(u=i-rr(a,o),!(u>Na)){r>-Na?(t=a.P,e=a):u>-Na?(t=a,e=a.N):t=e=a;break}if(!a.R){t=a;break}a=a.R}var c=Ke(n);if(Bc.insert(t,c),t||e){if(t===e)return sr(t),e=Ke(t.site),Bc.insert(c,e),c.edge=e.edge=gr(t.site,c.site),cr(t),cr(e),void 0;if(!e)return c.edge=gr(t.site,c.site),void 0;sr(t),sr(e);var s=t.site,l=s.x,f=s.y,h=n.x-l,g=n.y-f,p=e.site,v=p.x-l,d=p.y-f,m=2*(h*d-g*v),y=h*h+g*g,x=v*v+d*d,M={x:(d*y-g*x)/m+l,y:(h*x-v*y)/m+f};vr(e.edge,s,p,M),c.edge=gr(s,n,null,M),e.edge=gr(n,p,null,M),cr(t),cr(e)}}function er(n,t){var e=n.site,r=e.x,u=e.y,i=u-t;if(!i)return r;var o=n.P;if(!o)return-1/0;e=o.site;var a=e.x,c=e.y,s=c-t;if(!s)return a;var l=a-r,f=1/i-1/s,h=l/s;return f?(-h+Math.sqrt(h*h-2*f*(l*l/(-2*s)-c+s/2+u-i/2)))/f+r:(r+a)/2}function rr(n,t){var e=n.N;if(e)return er(e,t);var r=n.site;return r.y===t?r.x:1/0}function ur(n){this.site=n,this.edges=[]}function ir(n){for(var t,e,r,u,i,o,a,c,s,l,f=n[0][0],h=n[1][0],g=n[0][1],p=n[1][1],v=$c,d=v.length;d--;)if(i=v[d],i&&i.prepare())for(a=i.edges,c=a.length,o=0;c>o;)l=a[o].end(),r=l.x,u=l.y,s=a[++o%c].start(),t=s.x,e=s.y,(ca(r-t)>Na||ca(u-e)>Na)&&(a.splice(o,0,new dr(pr(i.site,l,ca(r-f)<Na&&p-u>Na?{x:f,y:ca(t-f)<Na?e:p}:ca(u-p)<Na&&h-r>Na?{x:ca(e-p)<Na?t:h,y:p}:ca(r-h)<Na&&u-g>Na?{x:h,y:ca(t-h)<Na?e:g}:ca(u-g)<Na&&r-f>Na?{x:ca(e-g)<Na?t:f,y:g}:null),i.site,null)),++c)}function or(n,t){return t.angle-n.angle}function ar(){yr(this),this.x=this.y=this.arc=this.site=this.cy=null}function cr(n){var t=n.P,e=n.N;if(t&&e){var r=t.site,u=n.site,i=e.site;if(r!==i){var o=u.x,a=u.y,c=r.x-o,s=r.y-a,l=i.x-o,f=i.y-a,h=2*(c*f-s*l);if(!(h>=-La)){var g=c*c+s*s,p=l*l+f*f,v=(f*g-s*p)/h,d=(c*p-l*g)/h,f=d+a,m=Kc.pop()||new ar;m.arc=n,m.site=u,m.x=v+o,m.y=f+Math.sqrt(v*v+d*d),m.cy=f,n.circle=m;for(var y=null,x=Jc._;x;)if(m.y<x.y||m.y===x.y&&m.x<=x.x){if(!x.L){y=x.P;break}x=x.L}else{if(!x.R){y=x;break}x=x.R}Jc.insert(y,m),y||(Wc=m)}}}}function sr(n){var t=n.circle;t&&(t.P||(Wc=t.N),Jc.remove(t),Kc.push(t),yr(t),n.circle=null)}function lr(n){for(var t,e=Xc,r=ue(n[0][0],n[0][1],n[1][0],n[1][1]),u=e.length;u--;)t=e[u],(!fr(t,n)||!r(t)||ca(t.a.x-t.b.x)<Na&&ca(t.a.y-t.b.y)<Na)&&(t.a=t.b=null,e.splice(u,1))}function fr(n,t){var e=n.b;if(e)return!0;var r,u,i=n.a,o=t[0][0],a=t[1][0],c=t[0][1],s=t[1][1],l=n.l,f=n.r,h=l.x,g=l.y,p=f.x,v=f.y,d=(h+p)/2,m=(g+v)/2;
if(v===g){if(o>d||d>=a)return;if(h>p){if(i){if(i.y>=s)return}else i={x:d,y:c};e={x:d,y:s}}else{if(i){if(i.y<c)return}else i={x:d,y:s};e={x:d,y:c}}}else if(r=(h-p)/(v-g),u=m-r*d,-1>r||r>1)if(h>p){if(i){if(i.y>=s)return}else i={x:(c-u)/r,y:c};e={x:(s-u)/r,y:s}}else{if(i){if(i.y<c)return}else i={x:(s-u)/r,y:s};e={x:(c-u)/r,y:c}}else if(v>g){if(i){if(i.x>=a)return}else i={x:o,y:r*o+u};e={x:a,y:r*a+u}}else{if(i){if(i.x<o)return}else i={x:a,y:r*a+u};e={x:o,y:r*o+u}}return n.a=i,n.b=e,!0}function hr(n,t){this.l=n,this.r=t,this.a=this.b=null}function gr(n,t,e,r){var u=new hr(n,t);return Xc.push(u),e&&vr(u,n,t,e),r&&vr(u,t,n,r),$c[n.i].edges.push(new dr(u,n,t)),$c[t.i].edges.push(new dr(u,t,n)),u}function pr(n,t,e){var r=new hr(n,null);return r.a=t,r.b=e,Xc.push(r),r}function vr(n,t,e,r){n.a||n.b?n.l===e?n.b=r:n.a=r:(n.a=r,n.l=t,n.r=e)}function dr(n,t,e){var r=n.a,u=n.b;this.edge=n,this.site=t,this.angle=e?Math.atan2(e.y-t.y,e.x-t.x):n.l===t?Math.atan2(u.x-r.x,r.y-u.y):Math.atan2(r.x-u.x,u.y-r.y)}function mr(){this._=null}function yr(n){n.U=n.C=n.L=n.R=n.P=n.N=null}function xr(n,t){var e=t,r=t.R,u=e.U;u?u.L===e?u.L=r:u.R=r:n._=r,r.U=u,e.U=r,e.R=r.L,e.R&&(e.R.U=e),r.L=e}function Mr(n,t){var e=t,r=t.L,u=e.U;u?u.L===e?u.L=r:u.R=r:n._=r,r.U=u,e.U=r,e.L=r.R,e.L&&(e.L.U=e),r.R=e}function _r(n){for(;n.L;)n=n.L;return n}function br(n,t){var e,r,u,i=n.sort(wr).pop();for(Xc=[],$c=new Array(n.length),Bc=new mr,Jc=new mr;;)if(u=Wc,i&&(!u||i.y<u.y||i.y===u.y&&i.x<u.x))(i.x!==e||i.y!==r)&&($c[i.i]=new ur(i),tr(i),e=i.x,r=i.y),i=n.pop();else{if(!u)break;nr(u.arc)}t&&(lr(t),ir(t));var o={cells:$c,edges:Xc};return Bc=Jc=Xc=$c=null,o}function wr(n,t){return t.y-n.y||t.x-n.x}function Sr(n,t,e){return(n.x-e.x)*(t.y-n.y)-(n.x-t.x)*(e.y-n.y)}function kr(n){return n.x}function Er(n){return n.y}function Ar(){return{leaf:!0,nodes:[],point:null,x:null,y:null}}function Cr(n,t,e,r,u,i){if(!n(t,e,r,u,i)){var o=.5*(e+u),a=.5*(r+i),c=t.nodes;c[0]&&Cr(n,c[0],e,r,o,a),c[1]&&Cr(n,c[1],o,r,u,a),c[2]&&Cr(n,c[2],e,a,o,i),c[3]&&Cr(n,c[3],o,a,u,i)}}function Nr(n,t){n=Bo.rgb(n),t=Bo.rgb(t);var e=n.r,r=n.g,u=n.b,i=t.r-e,o=t.g-r,a=t.b-u;return function(n){return"#"+st(Math.round(e+i*n))+st(Math.round(r+o*n))+st(Math.round(u+a*n))}}function Lr(n,t){var e,r={},u={};for(e in n)e in t?r[e]=zr(n[e],t[e]):u[e]=n[e];for(e in t)e in n||(u[e]=t[e]);return function(n){for(e in r)u[e]=r[e](n);return u}}function Tr(n,t){return t-=n=+n,function(e){return n+t*e}}function qr(n,t){var e,r,u,i,o,a=0,c=0,s=[],l=[];for(n+="",t+="",ns.lastIndex=0,r=0;e=ns.exec(t);++r)e.index&&s.push(t.substring(a,c=e.index)),l.push({i:s.length,x:e[0]}),s.push(null),a=ns.lastIndex;for(a<t.length&&s.push(t.substring(a)),r=0,i=l.length;(e=ns.exec(n))&&i>r;++r)if(o=l[r],o.x==e[0]){if(o.i)if(null==s[o.i+1])for(s[o.i-1]+=o.x,s.splice(o.i,1),u=r+1;i>u;++u)l[u].i--;else for(s[o.i-1]+=o.x+s[o.i+1],s.splice(o.i,2),u=r+1;i>u;++u)l[u].i-=2;else if(null==s[o.i+1])s[o.i]=o.x;else for(s[o.i]=o.x+s[o.i+1],s.splice(o.i+1,1),u=r+1;i>u;++u)l[u].i--;l.splice(r,1),i--,r--}else o.x=Tr(parseFloat(e[0]),parseFloat(o.x));for(;i>r;)o=l.pop(),null==s[o.i+1]?s[o.i]=o.x:(s[o.i]=o.x+s[o.i+1],s.splice(o.i+1,1)),i--;return 1===s.length?null==s[0]?(o=l[0].x,function(n){return o(n)+""}):function(){return t}:function(n){for(r=0;i>r;++r)s[(o=l[r]).i]=o.x(n);return s.join("")}}function zr(n,t){for(var e,r=Bo.interpolators.length;--r>=0&&!(e=Bo.interpolators[r](n,t)););return e}function Rr(n,t){var e,r=[],u=[],i=n.length,o=t.length,a=Math.min(n.length,t.length);for(e=0;a>e;++e)r.push(zr(n[e],t[e]));for(;i>e;++e)u[e]=n[e];for(;o>e;++e)u[e]=t[e];return function(n){for(e=0;a>e;++e)u[e]=r[e](n);return u}}function Dr(n){return function(t){return 0>=t?0:t>=1?1:n(t)}}function Pr(n){return function(t){return 1-n(1-t)}}function Ur(n){return function(t){return.5*(.5>t?n(2*t):2-n(2-2*t))}}function jr(n){return n*n}function Hr(n){return n*n*n}function Fr(n){if(0>=n)return 0;if(n>=1)return 1;var t=n*n,e=t*n;return 4*(.5>n?e:3*(n-t)+e-.75)}function Or(n){return function(t){return Math.pow(t,n)}}function Yr(n){return 1-Math.cos(n*Ca)}function Ir(n){return Math.pow(2,10*(n-1))}function Zr(n){return 1-Math.sqrt(1-n*n)}function Vr(n,t){var e;return arguments.length<2&&(t=.45),arguments.length?e=t/Aa*Math.asin(1/n):(n=1,e=t/4),function(r){return 1+n*Math.pow(2,-10*r)*Math.sin((r-e)*Aa/t)}}function Xr(n){return n||(n=1.70158),function(t){return t*t*((n+1)*t-n)}}function $r(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}function Br(n,t){n=Bo.hcl(n),t=Bo.hcl(t);var e=n.h,r=n.c,u=n.l,i=t.h-e,o=t.c-r,a=t.l-u;return isNaN(o)&&(o=0,r=isNaN(r)?t.c:r),isNaN(i)?(i=0,e=isNaN(e)?t.h:e):i>180?i-=360:-180>i&&(i+=360),function(n){return G(e+i*n,r+o*n,u+a*n)+""}}function Wr(n,t){n=Bo.hsl(n),t=Bo.hsl(t);var e=n.h,r=n.s,u=n.l,i=t.h-e,o=t.s-r,a=t.l-u;return isNaN(o)&&(o=0,r=isNaN(r)?t.s:r),isNaN(i)?(i=0,e=isNaN(e)?t.h:e):i>180?i-=360:-180>i&&(i+=360),function(n){return B(e+i*n,r+o*n,u+a*n)+""}}function Jr(n,t){n=Bo.lab(n),t=Bo.lab(t);var e=n.l,r=n.a,u=n.b,i=t.l-e,o=t.a-r,a=t.b-u;return function(n){return nt(e+i*n,r+o*n,u+a*n)+""}}function Gr(n,t){return t-=n,function(e){return Math.round(n+t*e)}}function Kr(n){var t=[n.a,n.b],e=[n.c,n.d],r=nu(t),u=Qr(t,e),i=nu(tu(e,t,-u))||0;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,u*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*qa,this.translate=[n.e,n.f],this.scale=[r,i],this.skew=i?Math.atan2(u,i)*qa:0}function Qr(n,t){return n[0]*t[0]+n[1]*t[1]}function nu(n){var t=Math.sqrt(Qr(n,n));return t&&(n[0]/=t,n[1]/=t),t}function tu(n,t,e){return n[0]+=e*t[0],n[1]+=e*t[1],n}function eu(n,t){var e,r=[],u=[],i=Bo.transform(n),o=Bo.transform(t),a=i.translate,c=o.translate,s=i.rotate,l=o.rotate,f=i.skew,h=o.skew,g=i.scale,p=o.scale;return a[0]!=c[0]||a[1]!=c[1]?(r.push("translate(",null,",",null,")"),u.push({i:1,x:Tr(a[0],c[0])},{i:3,x:Tr(a[1],c[1])})):c[0]||c[1]?r.push("translate("+c+")"):r.push(""),s!=l?(s-l>180?l+=360:l-s>180&&(s+=360),u.push({i:r.push(r.pop()+"rotate(",null,")")-2,x:Tr(s,l)})):l&&r.push(r.pop()+"rotate("+l+")"),f!=h?u.push({i:r.push(r.pop()+"skewX(",null,")")-2,x:Tr(f,h)}):h&&r.push(r.pop()+"skewX("+h+")"),g[0]!=p[0]||g[1]!=p[1]?(e=r.push(r.pop()+"scale(",null,",",null,")"),u.push({i:e-4,x:Tr(g[0],p[0])},{i:e-2,x:Tr(g[1],p[1])})):(1!=p[0]||1!=p[1])&&r.push(r.pop()+"scale("+p+")"),e=u.length,function(n){for(var t,i=-1;++i<e;)r[(t=u[i]).i]=t.x(n);return r.join("")}}function ru(n,t){return t=t-(n=+n)?1/(t-n):0,function(e){return(e-n)*t}}function uu(n,t){return t=t-(n=+n)?1/(t-n):0,function(e){return Math.max(0,Math.min(1,(e-n)*t))}}function iu(n){for(var t=n.source,e=n.target,r=au(t,e),u=[t];t!==r;)t=t.parent,u.push(t);for(var i=u.length;e!==r;)u.splice(i,0,e),e=e.parent;return u}function ou(n){for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}function au(n,t){if(n===t)return n;for(var e=ou(n),r=ou(t),u=e.pop(),i=r.pop(),o=null;u===i;)o=u,u=e.pop(),i=r.pop();return o}function cu(n){n.fixed|=2}function su(n){n.fixed&=-7}function lu(n){n.fixed|=4,n.px=n.x,n.py=n.y}function fu(n){n.fixed&=-5}function hu(n,t,e){var r=0,u=0;if(n.charge=0,!n.leaf)for(var i,o=n.nodes,a=o.length,c=-1;++c<a;)i=o[c],null!=i&&(hu(i,t,e),n.charge+=i.charge,r+=i.charge*i.cx,u+=i.charge*i.cy);if(n.point){n.leaf||(n.point.x+=Math.random()-.5,n.point.y+=Math.random()-.5);var s=t*e[n.point.index];n.charge+=n.pointCharge=s,r+=s*n.point.x,u+=s*n.point.y}n.cx=r/n.charge,n.cy=u/n.charge}function gu(n,t){return Bo.rebind(n,t,"sort","children","value"),n.nodes=n,n.links=mu,n}function pu(n){return n.children}function vu(n){return n.value}function du(n,t){return t.value-n.value}function mu(n){return Bo.merge(n.map(function(n){return(n.children||[]).map(function(t){return{source:n,target:t}})}))}function yu(n){return n.x}function xu(n){return n.y}function Mu(n,t,e){n.y0=t,n.y=e}function _u(n){return Bo.range(n.length)}function bu(n){for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function wu(n){for(var t,e=1,r=0,u=n[0][1],i=n.length;i>e;++e)(t=n[e][1])>u&&(r=e,u=t);return r}function Su(n){return n.reduce(ku,0)}function ku(n,t){return n+t[1]}function Eu(n,t){return Au(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}function Au(n,t){for(var e=-1,r=+n[0],u=(n[1]-r)/t,i=[];++e<=t;)i[e]=u*e+r;return i}function Cu(n){return[Bo.min(n),Bo.max(n)]}function Nu(n,t){return n.parent==t.parent?1:2}function Lu(n){var t=n.children;return t&&t.length?t[0]:n._tree.thread}function Tu(n){var t,e=n.children;return e&&(t=e.length)?e[t-1]:n._tree.thread}function qu(n,t){var e=n.children;if(e&&(u=e.length))for(var r,u,i=-1;++i<u;)t(r=qu(e[i],t),n)>0&&(n=r);return n}function zu(n,t){return n.x-t.x}function Ru(n,t){return t.x-n.x}function Du(n,t){return n.depth-t.depth}function Pu(n,t){function e(n,r){var u=n.children;if(u&&(o=u.length))for(var i,o,a=null,c=-1;++c<o;)i=u[c],e(i,a),a=i;t(n,r)}e(n,null)}function Uu(n){for(var t,e=0,r=0,u=n.children,i=u.length;--i>=0;)t=u[i]._tree,t.prelim+=e,t.mod+=e,e+=t.shift+(r+=t.change)}function ju(n,t,e){n=n._tree,t=t._tree;var r=e/(t.number-n.number);n.change+=r,t.change-=r,t.shift+=e,t.prelim+=e,t.mod+=e}function Hu(n,t,e){return n._tree.ancestor.parent==t.parent?n._tree.ancestor:e}function Fu(n,t){return n.value-t.value}function Ou(n,t){var e=n._pack_next;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function Yu(n,t){n._pack_next=t,t._pack_prev=n}function Iu(n,t){var e=t.x-n.x,r=t.y-n.y,u=n.r+t.r;return.999*u*u>e*e+r*r}function Zu(n){function t(n){l=Math.min(n.x-n.r,l),f=Math.max(n.x+n.r,f),h=Math.min(n.y-n.r,h),g=Math.max(n.y+n.r,g)}if((e=n.children)&&(s=e.length)){var e,r,u,i,o,a,c,s,l=1/0,f=-1/0,h=1/0,g=-1/0;if(e.forEach(Vu),r=e[0],r.x=-r.r,r.y=0,t(r),s>1&&(u=e[1],u.x=u.r,u.y=0,t(u),s>2))for(i=e[2],Bu(r,u,i),t(i),Ou(r,i),r._pack_prev=i,Ou(i,u),u=r._pack_next,o=3;s>o;o++){Bu(r,u,i=e[o]);var p=0,v=1,d=1;for(a=u._pack_next;a!==u;a=a._pack_next,v++)if(Iu(a,i)){p=1;break}if(1==p)for(c=r._pack_prev;c!==a._pack_prev&&!Iu(c,i);c=c._pack_prev,d++);p?(d>v||v==d&&u.r<r.r?Yu(r,u=a):Yu(r=c,u),o--):(Ou(r,i),u=i,t(i))}var m=(l+f)/2,y=(h+g)/2,x=0;for(o=0;s>o;o++)i=e[o],i.x-=m,i.y-=y,x=Math.max(x,i.r+Math.sqrt(i.x*i.x+i.y*i.y));n.r=x,e.forEach(Xu)}}function Vu(n){n._pack_next=n._pack_prev=n}function Xu(n){delete n._pack_next,delete n._pack_prev}function $u(n,t,e,r){var u=n.children;if(n.x=t+=r*n.x,n.y=e+=r*n.y,n.r*=r,u)for(var i=-1,o=u.length;++i<o;)$u(u[i],t,e,r)}function Bu(n,t,e){var r=n.r+e.r,u=t.x-n.x,i=t.y-n.y;if(r&&(u||i)){var o=t.r+e.r,a=u*u+i*i;o*=o,r*=r;var c=.5+(r-o)/(2*a),s=Math.sqrt(Math.max(0,2*o*(r+a)-(r-=a)*r-o*o))/(2*a);e.x=n.x+c*u+s*i,e.y=n.y+c*i-s*u}else e.x=n.x+r,e.y=n.y}function Wu(n){return 1+Bo.max(n,function(n){return n.y})}function Ju(n){return n.reduce(function(n,t){return n+t.x},0)/n.length}function Gu(n){var t=n.children;return t&&t.length?Gu(t[0]):n}function Ku(n){var t,e=n.children;return e&&(t=e.length)?Ku(e[t-1]):n}function Qu(n){return{x:n.x,y:n.y,dx:n.dx,dy:n.dy}}function ni(n,t){var e=n.x+t[3],r=n.y+t[0],u=n.dx-t[1]-t[3],i=n.dy-t[0]-t[2];return 0>u&&(e+=u/2,u=0),0>i&&(r+=i/2,i=0),{x:e,y:r,dx:u,dy:i}}function ti(n){var t=n[0],e=n[n.length-1];return e>t?[t,e]:[e,t]}function ei(n){return n.rangeExtent?n.rangeExtent():ti(n.range())}function ri(n,t,e,r){var u=e(n[0],n[1]),i=r(t[0],t[1]);return function(n){return i(u(n))}}function ui(n,t){var e,r=0,u=n.length-1,i=n[r],o=n[u];return i>o&&(e=r,r=u,u=e,e=i,i=o,o=e),n[r]=t.floor(i),n[u]=t.ceil(o),n}function ii(n){return n?{floor:function(t){return Math.floor(t/n)*n},ceil:function(t){return Math.ceil(t/n)*n}}:ls}function oi(n,t,e,r){var u=[],i=[],o=0,a=Math.min(n.length,t.length)-1;for(n[a]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++o<=a;)u.push(e(n[o-1],n[o])),i.push(r(t[o-1],t[o]));return function(t){var e=Bo.bisect(n,t,1,a)-1;return i[e](u[e](t))}}function ai(n,t,e,r){function u(){var u=Math.min(n.length,t.length)>2?oi:ri,c=r?uu:ru;return o=u(n,t,c,e),a=u(t,n,c,zr),i}function i(n){return o(n)}var o,a;return i.invert=function(n){return a(n)},i.domain=function(t){return arguments.length?(n=t.map(Number),u()):n},i.range=function(n){return arguments.length?(t=n,u()):t},i.rangeRound=function(n){return i.range(n).interpolate(Gr)},i.clamp=function(n){return arguments.length?(r=n,u()):r},i.interpolate=function(n){return arguments.length?(e=n,u()):e},i.ticks=function(t){return fi(n,t)},i.tickFormat=function(t,e){return hi(n,t,e)},i.nice=function(t){return si(n,t),u()},i.copy=function(){return ai(n,t,e,r)},u()}function ci(n,t){return Bo.rebind(n,t,"range","rangeRound","interpolate","clamp")}function si(n,t){return ui(n,ii(li(n,t)[2]))}function li(n,t){null==t&&(t=10);var e=ti(n),r=e[1]-e[0],u=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),i=t/r*u;return.15>=i?u*=10:.35>=i?u*=5:.75>=i&&(u*=2),e[0]=Math.ceil(e[0]/u)*u,e[1]=Math.floor(e[1]/u)*u+.5*u,e[2]=u,e}function fi(n,t){return Bo.range.apply(Bo,li(n,t))}function hi(n,t,e){var r=li(n,t);return Bo.format(e?e.replace(ic,function(n,t,e,u,i,o,a,c,s,l){return[t,e,u,i,o,a,c,s||"."+pi(l,r),l].join("")}):",."+gi(r[2])+"f")}function gi(n){return-Math.floor(Math.log(n)/Math.LN10+.01)}function pi(n,t){var e=gi(t[2]);return n in fs?Math.abs(e-gi(Math.max(Math.abs(t[0]),Math.abs(t[1]))))+ +("e"!==n):e-2*("%"===n)}function vi(n,t,e,r){function u(n){return(e?Math.log(0>n?0:n):-Math.log(n>0?0:-n))/Math.log(t)}function i(n){return e?Math.pow(t,n):-Math.pow(t,-n)}function o(t){return n(u(t))}return o.invert=function(t){return i(n.invert(t))},o.domain=function(t){return arguments.length?(e=t[0]>=0,n.domain((r=t.map(Number)).map(u)),o):r},o.base=function(e){return arguments.length?(t=+e,n.domain(r.map(u)),o):t},o.nice=function(){var t=ui(r.map(u),e?Math:gs);return n.domain(t),r=t.map(i),o},o.ticks=function(){var n=ti(r),o=[],a=n[0],c=n[1],s=Math.floor(u(a)),l=Math.ceil(u(c)),f=t%1?2:t;if(isFinite(l-s)){if(e){for(;l>s;s++)for(var h=1;f>h;h++)o.push(i(s)*h);o.push(i(s))}else for(o.push(i(s));s++<l;)for(var h=f-1;h>0;h--)o.push(i(s)*h);for(s=0;o[s]<a;s++);for(l=o.length;o[l-1]>c;l--);o=o.slice(s,l)}return o},o.tickFormat=function(n,t){if(!arguments.length)return hs;arguments.length<2?t=hs:"function"!=typeof t&&(t=Bo.format(t));var r,a=Math.max(.1,n/o.ticks().length),c=e?(r=1e-12,Math.ceil):(r=-1e-12,Math.floor);return function(n){return n/i(c(u(n)+r))<=a?t(n):""}},o.copy=function(){return vi(n.copy(),t,e,r)},ci(o,n)}function di(n,t,e){function r(t){return n(u(t))}var u=mi(t),i=mi(1/t);return r.invert=function(t){return i(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain((e=t.map(Number)).map(u)),r):e},r.ticks=function(n){return fi(e,n)},r.tickFormat=function(n,t){return hi(e,n,t)},r.nice=function(n){return r.domain(si(e,n))},r.exponent=function(o){return arguments.length?(u=mi(t=o),i=mi(1/t),n.domain(e.map(u)),r):t},r.copy=function(){return di(n.copy(),t,e)},ci(r,n)}function mi(n){return function(t){return 0>t?-Math.pow(-t,n):Math.pow(t,n)}}function yi(n,t){function e(e){return o[((i.get(e)||"range"===t.t&&i.set(e,n.push(e)))-1)%o.length]}function r(t,e){return Bo.range(n.length).map(function(n){return t+e*n})}var i,o,a;return e.domain=function(r){if(!arguments.length)return n;n=[],i=new u;for(var o,a=-1,c=r.length;++a<c;)i.has(o=r[a])||i.set(o,n.push(o));return e[t.t].apply(e,t.a)},e.range=function(n){return arguments.length?(o=n,a=0,t={t:"range",a:arguments},e):o},e.rangePoints=function(u,i){arguments.length<2&&(i=0);var c=u[0],s=u[1],l=(s-c)/(Math.max(1,n.length-1)+i);return o=r(n.length<2?(c+s)/2:c+l*i/2,l),a=0,t={t:"rangePoints",a:arguments},e},e.rangeBands=function(u,i,c){arguments.length<2&&(i=0),arguments.length<3&&(c=i);var s=u[1]<u[0],l=u[s-0],f=u[1-s],h=(f-l)/(n.length-i+2*c);return o=r(l+h*c,h),s&&o.reverse(),a=h*(1-i),t={t:"rangeBands",a:arguments},e},e.rangeRoundBands=function(u,i,c){arguments.length<2&&(i=0),arguments.length<3&&(c=i);var s=u[1]<u[0],l=u[s-0],f=u[1-s],h=Math.floor((f-l)/(n.length-i+2*c)),g=f-l-(n.length-i)*h;return o=r(l+Math.round(g/2),h),s&&o.reverse(),a=Math.round(h*(1-i)),t={t:"rangeRoundBands",a:arguments},e},e.rangeBand=function(){return a},e.rangeExtent=function(){return ti(t.a[0])},e.copy=function(){return yi(n,t)},e.domain(n)}function xi(n,t){function e(){var e=0,i=t.length;for(u=[];++e<i;)u[e-1]=Bo.quantile(n,e/i);return r}function r(n){return isNaN(n=+n)?void 0:t[Bo.bisect(u,n)]}var u;return r.domain=function(t){return arguments.length?(n=t.filter(function(n){return!isNaN(n)}).sort(Bo.ascending),e()):n},r.range=function(n){return arguments.length?(t=n,e()):t},r.quantiles=function(){return u},r.invertExtent=function(e){return e=t.indexOf(e),0>e?[0/0,0/0]:[e>0?u[e-1]:n[0],e<u.length?u[e]:n[n.length-1]]},r.copy=function(){return xi(n,t)},e()}function Mi(n,t,e){function r(t){return e[Math.max(0,Math.min(o,Math.floor(i*(t-n))))]}function u(){return i=e.length/(t-n),o=e.length-1,r}var i,o;return r.domain=function(e){return arguments.length?(n=+e[0],t=+e[e.length-1],u()):[n,t]},r.range=function(n){return arguments.length?(e=n,u()):e},r.invertExtent=function(t){return t=e.indexOf(t),t=0>t?0/0:t/i+n,[t,t+1/i]},r.copy=function(){return Mi(n,t,e)},u()}function _i(n,t){function e(e){return e>=e?t[Bo.bisect(n,e)]:void 0}return e.domain=function(t){return arguments.length?(n=t,e):n},e.range=function(n){return arguments.length?(t=n,e):t},e.invertExtent=function(e){return e=t.indexOf(e),[n[e-1],n[e]]},e.copy=function(){return _i(n,t)},e}function bi(n){function t(n){return+n}return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=e.map(t),t):n},t.ticks=function(t){return fi(n,t)},t.tickFormat=function(t,e){return hi(n,t,e)},t.copy=function(){return bi(n)},t}function wi(n){return n.innerRadius}function Si(n){return n.outerRadius}function ki(n){return n.startAngle}function Ei(n){return n.endAngle}function Ai(n){function t(t){function o(){s.push("M",i(n(l),a))}for(var c,s=[],l=[],f=-1,h=t.length,g=vt(e),p=vt(r);++f<h;)u.call(this,c=t[f],f)?l.push([+g.call(this,c,f),+p.call(this,c,f)]):l.length&&(o(),l=[]);return l.length&&o(),s.length?s.join(""):null}var e=Ve,r=Xe,u=Vt,i=Ci,o=i.key,a=.7;return t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.defined=function(n){return arguments.length?(u=n,t):u},t.interpolate=function(n){return arguments.length?(o="function"==typeof n?i=n:(i=Ms.get(n)||Ci).key,t):o},t.tension=function(n){return arguments.length?(a=n,t):a},t}function Ci(n){return n.join("L")}function Ni(n){return Ci(n)+"Z"}function Li(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);return e>1&&u.push("H",r[0]),u.join("")}function Ti(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("V",(r=n[t])[1],"H",r[0]);return u.join("")}function qi(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("H",(r=n[t])[0],"V",r[1]);return u.join("")}function zi(n,t){return n.length<4?Ci(n):n[1]+Pi(n.slice(1,n.length-1),Ui(n,t))}function Ri(n,t){return n.length<3?Ci(n):n[0]+Pi((n.push(n[0]),n),Ui([n[n.length-2]].concat(n,[n[1]]),t))}function Di(n,t){return n.length<3?Ci(n):n[0]+Pi(n,Ui(n,t))}function Pi(n,t){if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return Ci(n);var e=n.length!=t.length,r="",u=n[0],i=n[1],o=t[0],a=o,c=1;if(e&&(r+="Q"+(i[0]-2*o[0]/3)+","+(i[1]-2*o[1]/3)+","+i[0]+","+i[1],u=n[1],c=2),t.length>1){a=t[1],i=n[c],c++,r+="C"+(u[0]+o[0])+","+(u[1]+o[1])+","+(i[0]-a[0])+","+(i[1]-a[1])+","+i[0]+","+i[1];for(var s=2;s<t.length;s++,c++)i=n[c],a=t[s],r+="S"+(i[0]-a[0])+","+(i[1]-a[1])+","+i[0]+","+i[1]}if(e){var l=n[c];r+="Q"+(i[0]+2*a[0]/3)+","+(i[1]+2*a[1]/3)+","+l[0]+","+l[1]}return r}function Ui(n,t){for(var e,r=[],u=(1-t)/2,i=n[0],o=n[1],a=1,c=n.length;++a<c;)e=i,i=o,o=n[a],r.push([u*(o[0]-e[0]),u*(o[1]-e[1])]);return r}function ji(n){if(n.length<3)return Ci(n);var t=1,e=n.length,r=n[0],u=r[0],i=r[1],o=[u,u,u,(r=n[1])[0]],a=[i,i,i,r[1]],c=[u,",",i,"L",Yi(ws,o),",",Yi(ws,a)];for(n.push(n[e-1]);++t<=e;)r=n[t],o.shift(),o.push(r[0]),a.shift(),a.push(r[1]),Ii(c,o,a);return n.pop(),c.push("L",r),c.join("")}function Hi(n){if(n.length<4)return Ci(n);for(var t,e=[],r=-1,u=n.length,i=[0],o=[0];++r<3;)t=n[r],i.push(t[0]),o.push(t[1]);for(e.push(Yi(ws,i)+","+Yi(ws,o)),--r;++r<u;)t=n[r],i.shift(),i.push(t[0]),o.shift(),o.push(t[1]),Ii(e,i,o);return e.join("")}function Fi(n){for(var t,e,r=-1,u=n.length,i=u+4,o=[],a=[];++r<4;)e=n[r%u],o.push(e[0]),a.push(e[1]);for(t=[Yi(ws,o),",",Yi(ws,a)],--r;++r<i;)e=n[r%u],o.shift(),o.push(e[0]),a.shift(),a.push(e[1]),Ii(t,o,a);return t.join("")}function Oi(n,t){var e=n.length-1;if(e)for(var r,u,i=n[0][0],o=n[0][1],a=n[e][0]-i,c=n[e][1]-o,s=-1;++s<=e;)r=n[s],u=s/e,r[0]=t*r[0]+(1-t)*(i+u*a),r[1]=t*r[1]+(1-t)*(o+u*c);return ji(n)}function Yi(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]}function Ii(n,t,e){n.push("C",Yi(_s,t),",",Yi(_s,e),",",Yi(bs,t),",",Yi(bs,e),",",Yi(ws,t),",",Yi(ws,e))}function Zi(n,t){return(t[1]-n[1])/(t[0]-n[0])}function Vi(n){for(var t=0,e=n.length-1,r=[],u=n[0],i=n[1],o=r[0]=Zi(u,i);++t<e;)r[t]=(o+(o=Zi(u=i,i=n[t+1])))/2;return r[t]=o,r}function Xi(n){for(var t,e,r,u,i=[],o=Vi(n),a=-1,c=n.length-1;++a<c;)t=Zi(n[a],n[a+1]),ca(t)<Na?o[a]=o[a+1]=0:(e=o[a]/t,r=o[a+1]/t,u=e*e+r*r,u>9&&(u=3*t/Math.sqrt(u),o[a]=u*e,o[a+1]=u*r));for(a=-1;++a<=c;)u=(n[Math.min(c,a+1)][0]-n[Math.max(0,a-1)][0])/(6*(1+o[a]*o[a])),i.push([u||0,o[a]*u||0]);return i}function $i(n){return n.length<3?Ci(n):n[0]+Pi(n,Xi(n))}function Bi(n){for(var t,e,r,u=-1,i=n.length;++u<i;)t=n[u],e=t[0],r=t[1]+ys,t[0]=e*Math.cos(r),t[1]=e*Math.sin(r);return n}function Wi(n){function t(t){function c(){v.push("M",a(n(m),f),l,s(n(d.reverse()),f),"Z")}for(var h,g,p,v=[],d=[],m=[],y=-1,x=t.length,M=vt(e),_=vt(u),b=e===r?function(){return g}:vt(r),w=u===i?function(){return p}:vt(i);++y<x;)o.call(this,h=t[y],y)?(d.push([g=+M.call(this,h,y),p=+_.call(this,h,y)]),m.push([+b.call(this,h,y),+w.call(this,h,y)])):d.length&&(c(),d=[],m=[]);return d.length&&c(),v.length?v.join(""):null}var e=Ve,r=Ve,u=0,i=Xe,o=Vt,a=Ci,c=a.key,s=a,l="L",f=.7;return t.x=function(n){return arguments.length?(e=r=n,t):r},t.x0=function(n){return arguments.length?(e=n,t):e},t.x1=function(n){return arguments.length?(r=n,t):r},t.y=function(n){return arguments.length?(u=i=n,t):i},t.y0=function(n){return arguments.length?(u=n,t):u},t.y1=function(n){return arguments.length?(i=n,t):i},t.defined=function(n){return arguments.length?(o=n,t):o},t.interpolate=function(n){return arguments.length?(c="function"==typeof n?a=n:(a=Ms.get(n)||Ci).key,s=a.reverse||a,l=a.closed?"M":"L",t):c},t.tension=function(n){return arguments.length?(f=n,t):f},t}function Ji(n){return n.radius}function Gi(n){return[n.x,n.y]}function Ki(n){return function(){var t=n.apply(this,arguments),e=t[0],r=t[1]+ys;return[e*Math.cos(r),e*Math.sin(r)]}}function Qi(){return 64}function no(){return"circle"}function to(n){var t=Math.sqrt(n/Ea);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function eo(n,t){return ga(n,Ns),n.id=t,n}function ro(n,t,e,r){var u=n.id;return N(n,"function"==typeof e?function(n,i,o){n.__transition__[u].tween.set(t,r(e.call(n,n.__data__,i,o)))}:(e=r(e),function(n){n.__transition__[u].tween.set(t,e)}))}function uo(n){return null==n&&(n=""),function(){this.textContent=n}}function io(n,t,e,r){var i=n.__transition__||(n.__transition__={active:0,count:0}),o=i[e];if(!o){var a=r.time;o=i[e]={tween:new u,time:a,ease:r.ease,delay:r.delay,duration:r.duration},++i.count,Bo.timer(function(r){function u(r){return i.active>e?s():(i.active=e,o.event&&o.event.start.call(n,l,t),o.tween.forEach(function(e,r){(r=r.call(n,l,t))&&v.push(r)}),Bo.timer(function(){return p.c=c(r||1)?Vt:c,1},0,a),void 0)}function c(r){if(i.active!==e)return s();for(var u=r/g,a=f(u),c=v.length;c>0;)v[--c].call(n,a);return u>=1?(o.event&&o.event.end.call(n,l,t),s()):void 0}function s(){return--i.count?delete i[e]:delete n.__transition__,1}var l=n.__data__,f=o.ease,h=o.delay,g=o.duration,p=Ka,v=[];return p.t=h+a,r>=h?u(r-h):(p.c=u,void 0)},0,a)}}function oo(n,t){n.attr("transform",function(n){return"translate("+t(n)+",0)"})}function ao(n,t){n.attr("transform",function(n){return"translate(0,"+t(n)+")"})}function co(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function so(n,t,e){function r(t){var e=n(t),r=i(e,1);return r-t>t-e?e:r}function u(e){return t(e=n(new Ps(e-1)),1),e}function i(n,e){return t(n=new Ps(+n),e),n}function o(n,r,i){var o=u(n),a=[];if(i>1)for(;r>o;)e(o)%i||a.push(new Date(+o)),t(o,1);else for(;r>o;)a.push(new Date(+o)),t(o,1);return a}function a(n,t,e){try{Ps=co;var r=new co;return r._=n,o(r,t,e)}finally{Ps=Date}}n.floor=n,n.round=r,n.ceil=u,n.offset=i,n.range=o;var c=n.utc=lo(n);return c.floor=c,c.round=lo(r),c.ceil=lo(u),c.offset=lo(i),c.range=a,n}function lo(n){return function(t,e){try{Ps=co;var r=new co;return r._=t,n(r,e)._}finally{Ps=Date}}}function fo(n){function t(t){for(var r,u,i,o=[],a=-1,c=0;++a<e;)37===n.charCodeAt(a)&&(o.push(n.substring(c,a)),null!=(u=tl[r=n.charAt(++a)])&&(r=n.charAt(++a)),(i=el[r])&&(r=i(t,null==u?"e"===r?" ":"0":u)),o.push(r),c=a+1);return o.push(n.substring(c,a)),o.join("")}var e=n.length;return t.parse=function(t){var e={y:1900,m:0,d:1,H:0,M:0,S:0,L:0,Z:null},r=ho(e,n,t,0);if(r!=t.length)return null;"p"in e&&(e.H=e.H%12+12*e.p);var u=null!=e.Z&&Ps!==co,i=new(u?co:Ps);return"j"in e?i.setFullYear(e.y,0,e.j):"w"in e&&("W"in e||"U"in e)?(i.setFullYear(e.y,0,1),i.setFullYear(e.y,0,"W"in e?(e.w+6)%7+7*e.W-(i.getDay()+5)%7:e.w+7*e.U-(i.getDay()+6)%7)):i.setFullYear(e.y,e.m,e.d),i.setHours(e.H+Math.floor(e.Z/100),e.M+e.Z%100,e.S,e.L),u?i._:i},t.toString=function(){return n},t}function ho(n,t,e,r){for(var u,i,o,a=0,c=t.length,s=e.length;c>a;){if(r>=s)return-1;if(u=t.charCodeAt(a++),37===u){if(o=t.charAt(a++),i=rl[o in tl?t.charAt(a++):o],!i||(r=i(n,e,r))<0)return-1}else if(u!=e.charCodeAt(r++))return-1}return r}function go(n){return new RegExp("^(?:"+n.map(Bo.requote).join("|")+")","i")}function po(n){for(var t=new u,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}function vo(n,t,e){var r=0>n?"-":"",u=(r?-n:n)+"",i=u.length;return r+(e>i?new Array(e-i+1).join(t)+u:u)}function mo(n,t,e){Bs.lastIndex=0;var r=Bs.exec(t.substring(e));return r?(n.w=Ws.get(r[0].toLowerCase()),e+r[0].length):-1}function yo(n,t,e){Xs.lastIndex=0;var r=Xs.exec(t.substring(e));return r?(n.w=$s.get(r[0].toLowerCase()),e+r[0].length):-1}function xo(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function Mo(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e));return r?(n.U=+r[0],e+r[0].length):-1}function _o(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e));return r?(n.W=+r[0],e+r[0].length):-1}function bo(n,t,e){Ks.lastIndex=0;var r=Ks.exec(t.substring(e));return r?(n.m=Qs.get(r[0].toLowerCase()),e+r[0].length):-1}function wo(n,t,e){Js.lastIndex=0;var r=Js.exec(t.substring(e));return r?(n.m=Gs.get(r[0].toLowerCase()),e+r[0].length):-1}function So(n,t,e){return ho(n,el.c.toString(),t,e)}function ko(n,t,e){return ho(n,el.x.toString(),t,e)}function Eo(n,t,e){return ho(n,el.X.toString(),t,e)}function Ao(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function Co(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e,e+2));return r?(n.y=Lo(+r[0]),e+r[0].length):-1}function No(n,t,e){return/^[+-]\d{4}$/.test(t=t.substring(e,e+5))?(n.Z=+t,e+5):-1}function Lo(n){return n+(n>68?1900:2e3)}function To(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function qo(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function zo(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e,e+3));return r?(n.j=+r[0],e+r[0].length):-1}function Ro(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function Do(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function Po(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function Uo(n,t,e){ul.lastIndex=0;var r=ul.exec(t.substring(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function jo(n,t,e){var r=il.get(t.substring(e,e+=2).toLowerCase());return null==r?-1:(n.p=r,e)}function Ho(n){var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=~~(ca(t)/60),u=ca(t)%60;return e+vo(r,"0",2)+vo(u,"0",2)}function Fo(n,t,e){nl.lastIndex=0;var r=nl.exec(t.substring(e,e+1));return r?e+r[0].length:-1}function Oo(n){function t(n){try{Ps=co;var t=new Ps;return t._=n,e(t)}finally{Ps=Date}}var e=fo(n);return t.parse=function(n){try{Ps=co;var t=e.parse(n);return t&&t._}finally{Ps=Date}},t.toString=e.toString,t}function Yo(n){return n.toISOString()}function Io(n,t,e){function r(t){return n(t)}function u(n,e){var r=n[1]-n[0],u=r/e,i=Bo.bisect(al,u);return i==al.length?[t.year,li(n.map(function(n){return n/31536e6}),e)[2]]:i?t[u/al[i-1]<al[i]/u?i-1:i]:[fl,li(n,e)[2]]}return r.invert=function(t){return Zo(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain(t),r):n.domain().map(Zo)},r.nice=function(n,t){function e(e){return!isNaN(e)&&!n.range(e,Zo(+e+1),t).length}var i=r.domain(),o=ti(i),a=null==n?u(o,10):"number"==typeof n&&u(o,n);return a&&(n=a[0],t=a[1]),r.domain(ui(i,t>1?{floor:function(t){for(;e(t=n.floor(t));)t=Zo(t-1);return t},ceil:function(t){for(;e(t=n.ceil(t));)t=Zo(+t+1);return t}}:n))},r.ticks=function(n,t){var e=ti(r.domain()),i=null==n?u(e,10):"number"==typeof n?u(e,n):!n.range&&[{range:n},t];return i&&(n=i[0],t=i[1]),n.range(e[0],Zo(+e[1]+1),1>t?1:t)},r.tickFormat=function(){return e},r.copy=function(){return Io(n.copy(),t,e)},ci(r,n)}function Zo(n){return new Date(n)}function Vo(n){return function(t){for(var e=n.length-1,r=n[e];!r[1](t);)r=n[--e];return r[0](t)}}function Xo(n){return JSON.parse(n.responseText)}function $o(n){var t=Go.createRange();return t.selectNode(Go.body),t.createContextualFragment(n.responseText)}var Bo={version:"3.3.13"};Date.now||(Date.now=function(){return+new Date});var Wo=[].slice,Jo=function(n){return Wo.call(n)},Go=document,Ko=Go.documentElement,Qo=window;try{Jo(Ko.childNodes)[0].nodeType}catch(na){Jo=function(n){for(var t=n.length,e=new Array(t);t--;)e[t]=n[t];return e}}try{Go.createElement("div").style.setProperty("opacity",0,"")}catch(ta){var ea=Qo.Element.prototype,ra=ea.setAttribute,ua=ea.setAttributeNS,ia=Qo.CSSStyleDeclaration.prototype,oa=ia.setProperty;ea.setAttribute=function(n,t){ra.call(this,n,t+"")},ea.setAttributeNS=function(n,t,e){ua.call(this,n,t,e+"")},ia.setProperty=function(n,t,e){oa.call(this,n,t+"",e)}}Bo.ascending=function(n,t){return t>n?-1:n>t?1:n>=t?0:0/0},Bo.descending=function(n,t){return n>t?-1:t>n?1:t>=n?0:0/0},Bo.min=function(n,t){var e,r,u=-1,i=n.length;if(1===arguments.length){for(;++u<i&&!(null!=(e=n[u])&&e>=e);)e=void 0;for(;++u<i;)null!=(r=n[u])&&e>r&&(e=r)}else{for(;++u<i&&!(null!=(e=t.call(n,n[u],u))&&e>=e);)e=void 0;for(;++u<i;)null!=(r=t.call(n,n[u],u))&&e>r&&(e=r)}return e},Bo.max=function(n,t){var e,r,u=-1,i=n.length;if(1===arguments.length){for(;++u<i&&!(null!=(e=n[u])&&e>=e);)e=void 0;for(;++u<i;)null!=(r=n[u])&&r>e&&(e=r)}else{for(;++u<i&&!(null!=(e=t.call(n,n[u],u))&&e>=e);)e=void 0;for(;++u<i;)null!=(r=t.call(n,n[u],u))&&r>e&&(e=r)}return e},Bo.extent=function(n,t){var e,r,u,i=-1,o=n.length;if(1===arguments.length){for(;++i<o&&!(null!=(e=u=n[i])&&e>=e);)e=u=void 0;for(;++i<o;)null!=(r=n[i])&&(e>r&&(e=r),r>u&&(u=r))}else{for(;++i<o&&!(null!=(e=u=t.call(n,n[i],i))&&e>=e);)e=void 0;for(;++i<o;)null!=(r=t.call(n,n[i],i))&&(e>r&&(e=r),r>u&&(u=r))}return[e,u]},Bo.sum=function(n,t){var e,r=0,u=n.length,i=-1;if(1===arguments.length)for(;++i<u;)isNaN(e=+n[i])||(r+=e);else for(;++i<u;)isNaN(e=+t.call(n,n[i],i))||(r+=e);return r},Bo.mean=function(t,e){var r,u=t.length,i=0,o=-1,a=0;if(1===arguments.length)for(;++o<u;)n(r=t[o])&&(i+=(r-i)/++a);else for(;++o<u;)n(r=e.call(t,t[o],o))&&(i+=(r-i)/++a);return a?i:void 0},Bo.quantile=function(n,t){var e=(n.length-1)*t+1,r=Math.floor(e),u=+n[r-1],i=e-r;
return i?u+i*(n[r]-u):u},Bo.median=function(t,e){return arguments.length>1&&(t=t.map(e)),t=t.filter(n),t.length?Bo.quantile(t.sort(Bo.ascending),.5):void 0},Bo.bisector=function(n){return{left:function(t,e,r,u){for(arguments.length<3&&(r=0),arguments.length<4&&(u=t.length);u>r;){var i=r+u>>>1;n.call(t,t[i],i)<e?r=i+1:u=i}return r},right:function(t,e,r,u){for(arguments.length<3&&(r=0),arguments.length<4&&(u=t.length);u>r;){var i=r+u>>>1;e<n.call(t,t[i],i)?u=i:r=i+1}return r}}};var aa=Bo.bisector(function(n){return n});Bo.bisectLeft=aa.left,Bo.bisect=Bo.bisectRight=aa.right,Bo.shuffle=function(n){for(var t,e,r=n.length;r;)e=0|Math.random()*r--,t=n[r],n[r]=n[e],n[e]=t;return n},Bo.permute=function(n,t){for(var e=t.length,r=new Array(e);e--;)r[e]=n[t[e]];return r},Bo.pairs=function(n){for(var t,e=0,r=n.length-1,u=n[0],i=new Array(0>r?0:r);r>e;)i[e]=[t=u,u=n[++e]];return i},Bo.zip=function(){if(!(u=arguments.length))return[];for(var n=-1,e=Bo.min(arguments,t),r=new Array(e);++n<e;)for(var u,i=-1,o=r[n]=new Array(u);++i<u;)o[i]=arguments[i][n];return r},Bo.transpose=function(n){return Bo.zip.apply(Bo,n)},Bo.keys=function(n){var t=[];for(var e in n)t.push(e);return t},Bo.values=function(n){var t=[];for(var e in n)t.push(n[e]);return t},Bo.entries=function(n){var t=[];for(var e in n)t.push({key:e,value:n[e]});return t},Bo.merge=function(n){for(var t,e,r,u=n.length,i=-1,o=0;++i<u;)o+=n[i].length;for(e=new Array(o);--u>=0;)for(r=n[u],t=r.length;--t>=0;)e[--o]=r[t];return e};var ca=Math.abs;Bo.range=function(n,t,r){if(arguments.length<3&&(r=1,arguments.length<2&&(t=n,n=0)),1/0===(t-n)/r)throw new Error("infinite range");var u,i=[],o=e(ca(r)),a=-1;if(n*=o,t*=o,r*=o,0>r)for(;(u=n+r*++a)>t;)i.push(u/o);else for(;(u=n+r*++a)<t;)i.push(u/o);return i},Bo.map=function(n){var t=new u;if(n instanceof u)n.forEach(function(n,e){t.set(n,e)});else for(var e in n)t.set(e,n[e]);return t},r(u,{has:function(n){return sa+n in this},get:function(n){return this[sa+n]},set:function(n,t){return this[sa+n]=t},remove:function(n){return n=sa+n,n in this&&delete this[n]},keys:function(){var n=[];return this.forEach(function(t){n.push(t)}),n},values:function(){var n=[];return this.forEach(function(t,e){n.push(e)}),n},entries:function(){var n=[];return this.forEach(function(t,e){n.push({key:t,value:e})}),n},forEach:function(n){for(var t in this)t.charCodeAt(0)===la&&n.call(this,t.substring(1),this[t])}});var sa="\x00",la=sa.charCodeAt(0);Bo.nest=function(){function n(t,a,c){if(c>=o.length)return r?r.call(i,a):e?a.sort(e):a;for(var s,l,f,h,g=-1,p=a.length,v=o[c++],d=new u;++g<p;)(h=d.get(s=v(l=a[g])))?h.push(l):d.set(s,[l]);return t?(l=t(),f=function(e,r){l.set(e,n(t,r,c))}):(l={},f=function(e,r){l[e]=n(t,r,c)}),d.forEach(f),l}function t(n,e){if(e>=o.length)return n;var r=[],u=a[e++];return n.forEach(function(n,u){r.push({key:n,values:t(u,e)})}),u?r.sort(function(n,t){return u(n.key,t.key)}):r}var e,r,i={},o=[],a=[];return i.map=function(t,e){return n(e,t,0)},i.entries=function(e){return t(n(Bo.map,e,0),0)},i.key=function(n){return o.push(n),i},i.sortKeys=function(n){return a[o.length-1]=n,i},i.sortValues=function(n){return e=n,i},i.rollup=function(n){return r=n,i},i},Bo.set=function(n){var t=new i;if(n)for(var e=0,r=n.length;r>e;++e)t.add(n[e]);return t},r(i,{has:function(n){return sa+n in this},add:function(n){return this[sa+n]=!0,n},remove:function(n){return n=sa+n,n in this&&delete this[n]},values:function(){var n=[];return this.forEach(function(t){n.push(t)}),n},forEach:function(n){for(var t in this)t.charCodeAt(0)===la&&n.call(this,t.substring(1))}}),Bo.behavior={},Bo.rebind=function(n,t){for(var e,r=1,u=arguments.length;++r<u;)n[e=arguments[r]]=o(n,t,t[e]);return n};var fa=["webkit","ms","moz","Moz","o","O"];Bo.dispatch=function(){for(var n=new s,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=l(n);return n},s.prototype.on=function(n,t){var e=n.indexOf("."),r="";if(e>=0&&(r=n.substring(e+1),n=n.substring(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t);if(2===arguments.length){if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}},Bo.event=null,Bo.requote=function(n){return n.replace(ha,"\\$&")};var ha=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,ga={}.__proto__?function(n,t){n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]},pa=function(n,t){return t.querySelector(n)},va=function(n,t){return t.querySelectorAll(n)},da=Ko[a(Ko,"matchesSelector")],ma=function(n,t){return da.call(n,t)};"function"==typeof Sizzle&&(pa=function(n,t){return Sizzle(n,t)[0]||null},va=function(n,t){return Sizzle.uniqueSort(Sizzle(n,t))},ma=Sizzle.matchesSelector),Bo.selection=function(){return _a};var ya=Bo.selection.prototype=[];ya.select=function(n){var t,e,r,u,i=[];n=v(n);for(var o=-1,a=this.length;++o<a;){i.push(t=[]),t.parentNode=(r=this[o]).parentNode;for(var c=-1,s=r.length;++c<s;)(u=r[c])?(t.push(e=n.call(u,u.__data__,c,o)),e&&"__data__"in u&&(e.__data__=u.__data__)):t.push(null)}return p(i)},ya.selectAll=function(n){var t,e,r=[];n=d(n);for(var u=-1,i=this.length;++u<i;)for(var o=this[u],a=-1,c=o.length;++a<c;)(e=o[a])&&(r.push(t=Jo(n.call(e,e.__data__,a,u))),t.parentNode=e);return p(r)};var xa={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};Bo.ns={prefix:xa,qualify:function(n){var t=n.indexOf(":"),e=n;return t>=0&&(e=n.substring(0,t),n=n.substring(t+1)),xa.hasOwnProperty(e)?{space:xa[e],local:n}:n}},ya.attr=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node();return n=Bo.ns.qualify(n),n.local?e.getAttributeNS(n.space,n.local):e.getAttribute(n)}for(t in n)this.each(m(t,n[t]));return this}return this.each(m(n,t))},ya.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node(),r=(n=M(n)).length,u=-1;if(t=e.classList){for(;++u<r;)if(!t.contains(n[u]))return!1}else for(t=e.getAttribute("class");++u<r;)if(!x(n[u]).test(t))return!1;return!0}for(t in n)this.each(_(t,n[t]));return this}return this.each(_(n,t))},ya.style=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t="");for(e in n)this.each(w(e,n[e],t));return this}if(2>r)return Qo.getComputedStyle(this.node(),null).getPropertyValue(n);e=""}return this.each(w(n,t,e))},ya.property=function(n,t){if(arguments.length<2){if("string"==typeof n)return this.node()[n];for(t in n)this.each(S(t,n[t]));return this}return this.each(S(n,t))},ya.text=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){this.textContent=""}:function(){this.textContent=n}):this.node().textContent},ya.html=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML},ya.append=function(n){return n=k(n),this.select(function(){return this.appendChild(n.apply(this,arguments))})},ya.insert=function(n,t){return n=k(n),t=v(t),this.select(function(){return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments)||null)})},ya.remove=function(){return this.each(function(){var n=this.parentNode;n&&n.removeChild(this)})},ya.data=function(n,t){function e(n,e){var r,i,o,a=n.length,f=e.length,h=Math.min(a,f),g=new Array(f),p=new Array(f),v=new Array(a);if(t){var d,m=new u,y=new u,x=[];for(r=-1;++r<a;)d=t.call(i=n[r],i.__data__,r),m.has(d)?v[r]=i:m.set(d,i),x.push(d);for(r=-1;++r<f;)d=t.call(e,o=e[r],r),(i=m.get(d))?(g[r]=i,i.__data__=o):y.has(d)||(p[r]=E(o)),y.set(d,o),m.remove(d);for(r=-1;++r<a;)m.has(x[r])&&(v[r]=n[r])}else{for(r=-1;++r<h;)i=n[r],o=e[r],i?(i.__data__=o,g[r]=i):p[r]=E(o);for(;f>r;++r)p[r]=E(e[r]);for(;a>r;++r)v[r]=n[r]}p.update=g,p.parentNode=g.parentNode=v.parentNode=n.parentNode,c.push(p),s.push(g),l.push(v)}var r,i,o=-1,a=this.length;if(!arguments.length){for(n=new Array(a=(r=this[0]).length);++o<a;)(i=r[o])&&(n[o]=i.__data__);return n}var c=L([]),s=p([]),l=p([]);if("function"==typeof n)for(;++o<a;)e(r=this[o],n.call(r,r.parentNode.__data__,o));else for(;++o<a;)e(r=this[o],n);return s.enter=function(){return c},s.exit=function(){return l},s},ya.datum=function(n){return arguments.length?this.property("__data__",n):this.property("__data__")},ya.filter=function(n){var t,e,r,u=[];"function"!=typeof n&&(n=A(n));for(var i=0,o=this.length;o>i;i++){u.push(t=[]),t.parentNode=(e=this[i]).parentNode;for(var a=0,c=e.length;c>a;a++)(r=e[a])&&n.call(r,r.__data__,a,i)&&t.push(r)}return p(u)},ya.order=function(){for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],u=r.length-1,i=r[u];--u>=0;)(e=r[u])&&(i&&i!==e.nextSibling&&i.parentNode.insertBefore(e,i),i=e);return this},ya.sort=function(n){n=C.apply(this,arguments);for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()},ya.each=function(n){return N(this,function(t,e,r){n.call(t,t.__data__,e,r)})},ya.call=function(n){var t=Jo(arguments);return n.apply(t[0]=this,t),this},ya.empty=function(){return!this.node()},ya.node=function(){for(var n=0,t=this.length;t>n;n++)for(var e=this[n],r=0,u=e.length;u>r;r++){var i=e[r];if(i)return i}return null},ya.size=function(){var n=0;return this.each(function(){++n}),n};var Ma=[];Bo.selection.enter=L,Bo.selection.enter.prototype=Ma,Ma.append=ya.append,Ma.empty=ya.empty,Ma.node=ya.node,Ma.call=ya.call,Ma.size=ya.size,Ma.select=function(n){for(var t,e,r,u,i,o=[],a=-1,c=this.length;++a<c;){r=(u=this[a]).update,o.push(t=[]),t.parentNode=u.parentNode;for(var s=-1,l=u.length;++s<l;)(i=u[s])?(t.push(r[s]=e=n.call(u.parentNode,i.__data__,s,a)),e.__data__=i.__data__):t.push(null)}return p(o)},Ma.insert=function(n,t){return arguments.length<2&&(t=T(this)),ya.insert.call(this,n,t)},ya.transition=function(){for(var n,t,e=ks||++Ls,r=[],u=Es||{time:Date.now(),ease:Fr,delay:0,duration:250},i=-1,o=this.length;++i<o;){r.push(n=[]);for(var a=this[i],c=-1,s=a.length;++c<s;)(t=a[c])&&io(t,c,e,u),n.push(t)}return eo(r,e)},ya.interrupt=function(){return this.each(q)},Bo.select=function(n){var t=["string"==typeof n?pa(n,Go):n];return t.parentNode=Ko,p([t])},Bo.selectAll=function(n){var t=Jo("string"==typeof n?va(n,Go):n);return t.parentNode=Ko,p([t])};var _a=Bo.select(Ko);ya.on=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t=!1);for(e in n)this.each(z(e,n[e],t));return this}if(2>r)return(r=this.node()["__on"+n])&&r._;e=!1}return this.each(z(n,t,e))};var ba=Bo.map({mouseenter:"mouseover",mouseleave:"mouseout"});ba.forEach(function(n){"on"+n in Go&&ba.remove(n)});var wa="onselectstart"in Go?null:a(Ko.style,"userSelect"),Sa=0;Bo.mouse=function(n){return U(n,h())};var ka=/WebKit/.test(Qo.navigator.userAgent)?-1:0;Bo.touches=function(n,t){return arguments.length<2&&(t=h().touches),t?Jo(t).map(function(t){var e=U(n,t);return e.identifier=t.identifier,e}):[]},Bo.behavior.drag=function(){function n(){this.on("mousedown.drag",o).on("touchstart.drag",a)}function t(){return Bo.event.changedTouches[0].identifier}function e(n,t){return Bo.touches(n).filter(function(n){return n.identifier===t})[0]}function r(n,t,e,r){return function(){function o(){var n=t(l,g),e=n[0]-v[0],r=n[1]-v[1];d|=e|r,v=n,f({type:"drag",x:n[0]+c[0],y:n[1]+c[1],dx:e,dy:r})}function a(){m.on(e+"."+p,null).on(r+"."+p,null),y(d&&Bo.event.target===h),f({type:"dragend"})}var c,s=this,l=s.parentNode,f=u.of(s,arguments),h=Bo.event.target,g=n(),p=null==g?"drag":"drag-"+g,v=t(l,g),d=0,m=Bo.select(Qo).on(e+"."+p,o).on(r+"."+p,a),y=P();i?(c=i.apply(s,arguments),c=[c.x-v[0],c.y-v[1]]):c=[0,0],f({type:"dragstart"})}}var u=g(n,"drag","dragstart","dragend"),i=null,o=r(c,Bo.mouse,"mousemove","mouseup"),a=r(t,e,"touchmove","touchend");return n.origin=function(t){return arguments.length?(i=t,n):i},Bo.rebind(n,u,"on")};var Ea=Math.PI,Aa=2*Ea,Ca=Ea/2,Na=1e-6,La=Na*Na,Ta=Ea/180,qa=180/Ea,za=Math.SQRT2,Ra=2,Da=4;Bo.interpolateZoom=function(n,t){function e(n){var t=n*y;if(m){var e=Y(v),o=i/(Ra*h)*(e*I(za*t+v)-O(v));return[r+o*s,u+o*l,i*e/Y(za*t+v)]}return[r+n*s,u+n*l,i*Math.exp(za*t)]}var r=n[0],u=n[1],i=n[2],o=t[0],a=t[1],c=t[2],s=o-r,l=a-u,f=s*s+l*l,h=Math.sqrt(f),g=(c*c-i*i+Da*f)/(2*i*Ra*h),p=(c*c-i*i-Da*f)/(2*c*Ra*h),v=Math.log(Math.sqrt(g*g+1)-g),d=Math.log(Math.sqrt(p*p+1)-p),m=d-v,y=(m||Math.log(c/i))/za;return e.duration=1e3*y,e},Bo.behavior.zoom=function(){function n(n){n.on(A,s).on(ja+".zoom",h).on(C,p).on("dblclick.zoom",v).on(L,l)}function t(n){return[(n[0]-S.x)/S.k,(n[1]-S.y)/S.k]}function e(n){return[n[0]*S.k+S.x,n[1]*S.k+S.y]}function r(n){S.k=Math.max(E[0],Math.min(E[1],n))}function u(n,t){t=e(t),S.x+=n[0]-t[0],S.y+=n[1]-t[1]}function i(){_&&_.domain(M.range().map(function(n){return(n-S.x)/S.k}).map(M.invert)),w&&w.domain(b.range().map(function(n){return(n-S.y)/S.k}).map(b.invert))}function o(n){n({type:"zoomstart"})}function a(n){i(),n({type:"zoom",scale:S.k,translate:[S.x,S.y]})}function c(n){n({type:"zoomend"})}function s(){function n(){l=1,u(Bo.mouse(r),h),a(i)}function e(){f.on(C,Qo===r?p:null).on(N,null),g(l&&Bo.event.target===s),c(i)}var r=this,i=T.of(r,arguments),s=Bo.event.target,l=0,f=Bo.select(Qo).on(C,n).on(N,e),h=t(Bo.mouse(r)),g=P();q.call(r),o(i)}function l(){function n(){var n=Bo.touches(p);return g=S.k,n.forEach(function(n){n.identifier in d&&(d[n.identifier]=t(n))}),n}function e(){for(var t=Bo.event.changedTouches,e=0,i=t.length;i>e;++e)d[t[e].identifier]=null;var o=n(),c=Date.now();if(1===o.length){if(500>c-x){var s=o[0],l=d[s.identifier];r(2*S.k),u(s,l),f(),a(v)}x=c}else if(o.length>1){var s=o[0],h=o[1],g=s[0]-h[0],p=s[1]-h[1];m=g*g+p*p}}function i(){for(var n,t,e,i,o=Bo.touches(p),c=0,s=o.length;s>c;++c,i=null)if(e=o[c],i=d[e.identifier]){if(t)break;n=e,t=i}if(i){var l=(l=e[0]-n[0])*l+(l=e[1]-n[1])*l,f=m&&Math.sqrt(l/m);n=[(n[0]+e[0])/2,(n[1]+e[1])/2],t=[(t[0]+i[0])/2,(t[1]+i[1])/2],r(f*g)}x=null,u(n,t),a(v)}function h(){if(Bo.event.touches.length){for(var t=Bo.event.changedTouches,e=0,r=t.length;r>e;++e)delete d[t[e].identifier];for(var u in d)return void n()}b.on(M,null).on(_,null),w.on(A,s).on(L,l),k(),c(v)}var g,p=this,v=T.of(p,arguments),d={},m=0,y=Bo.event.changedTouches[0].identifier,M="touchmove.zoom-"+y,_="touchend.zoom-"+y,b=Bo.select(Qo).on(M,i).on(_,h),w=Bo.select(p).on(A,null).on(L,e),k=P();q.call(p),e(),o(v)}function h(){var n=T.of(this,arguments);y?clearTimeout(y):(q.call(this),o(n)),y=setTimeout(function(){y=null,c(n)},50),f();var e=m||Bo.mouse(this);d||(d=t(e)),r(Math.pow(2,.002*Pa())*S.k),u(e,d),a(n)}function p(){d=null}function v(){var n=T.of(this,arguments),e=Bo.mouse(this),i=t(e),s=Math.log(S.k)/Math.LN2;o(n),r(Math.pow(2,Bo.event.shiftKey?Math.ceil(s)-1:Math.floor(s)+1)),u(e,i),a(n),c(n)}var d,m,y,x,M,_,b,w,S={x:0,y:0,k:1},k=[960,500],E=Ua,A="mousedown.zoom",C="mousemove.zoom",N="mouseup.zoom",L="touchstart.zoom",T=g(n,"zoomstart","zoom","zoomend");return n.event=function(n){n.each(function(){var n=T.of(this,arguments),t=S;ks?Bo.select(this).transition().each("start.zoom",function(){S=this.__chart__||{x:0,y:0,k:1},o(n)}).tween("zoom:zoom",function(){var e=k[0],r=k[1],u=e/2,i=r/2,o=Bo.interpolateZoom([(u-S.x)/S.k,(i-S.y)/S.k,e/S.k],[(u-t.x)/t.k,(i-t.y)/t.k,e/t.k]);return function(t){var r=o(t),c=e/r[2];this.__chart__=S={x:u-r[0]*c,y:i-r[1]*c,k:c},a(n)}}).each("end.zoom",function(){c(n)}):(this.__chart__=S,o(n),a(n),c(n))})},n.translate=function(t){return arguments.length?(S={x:+t[0],y:+t[1],k:S.k},i(),n):[S.x,S.y]},n.scale=function(t){return arguments.length?(S={x:S.x,y:S.y,k:+t},i(),n):S.k},n.scaleExtent=function(t){return arguments.length?(E=null==t?Ua:[+t[0],+t[1]],n):E},n.center=function(t){return arguments.length?(m=t&&[+t[0],+t[1]],n):m},n.size=function(t){return arguments.length?(k=t&&[+t[0],+t[1]],n):k},n.x=function(t){return arguments.length?(_=t,M=t.copy(),S={x:0,y:0,k:1},n):_},n.y=function(t){return arguments.length?(w=t,b=t.copy(),S={x:0,y:0,k:1},n):w},Bo.rebind(n,T,"on")};var Pa,Ua=[0,1/0],ja="onwheel"in Go?(Pa=function(){return-Bo.event.deltaY*(Bo.event.deltaMode?120:1)},"wheel"):"onmousewheel"in Go?(Pa=function(){return Bo.event.wheelDelta},"mousewheel"):(Pa=function(){return-Bo.event.detail},"MozMousePixelScroll");V.prototype.toString=function(){return this.rgb()+""},Bo.hsl=function(n,t,e){return 1===arguments.length?n instanceof $?X(n.h,n.s,n.l):lt(""+n,ft,X):X(+n,+t,+e)};var Ha=$.prototype=new V;Ha.brighter=function(n){return n=Math.pow(.7,arguments.length?n:1),X(this.h,this.s,this.l/n)},Ha.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),X(this.h,this.s,n*this.l)},Ha.rgb=function(){return B(this.h,this.s,this.l)},Bo.hcl=function(n,t,e){return 1===arguments.length?n instanceof J?W(n.h,n.c,n.l):n instanceof Q?tt(n.l,n.a,n.b):tt((n=ht((n=Bo.rgb(n)).r,n.g,n.b)).l,n.a,n.b):W(+n,+t,+e)};var Fa=J.prototype=new V;Fa.brighter=function(n){return W(this.h,this.c,Math.min(100,this.l+Oa*(arguments.length?n:1)))},Fa.darker=function(n){return W(this.h,this.c,Math.max(0,this.l-Oa*(arguments.length?n:1)))},Fa.rgb=function(){return G(this.h,this.c,this.l).rgb()},Bo.lab=function(n,t,e){return 1===arguments.length?n instanceof Q?K(n.l,n.a,n.b):n instanceof J?G(n.l,n.c,n.h):ht((n=Bo.rgb(n)).r,n.g,n.b):K(+n,+t,+e)};var Oa=18,Ya=.95047,Ia=1,Za=1.08883,Va=Q.prototype=new V;Va.brighter=function(n){return K(Math.min(100,this.l+Oa*(arguments.length?n:1)),this.a,this.b)},Va.darker=function(n){return K(Math.max(0,this.l-Oa*(arguments.length?n:1)),this.a,this.b)},Va.rgb=function(){return nt(this.l,this.a,this.b)},Bo.rgb=function(n,t,e){return 1===arguments.length?n instanceof ct?at(n.r,n.g,n.b):lt(""+n,at,B):at(~~n,~~t,~~e)};var Xa=ct.prototype=new V;Xa.brighter=function(n){n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,u=30;return t||e||r?(t&&u>t&&(t=u),e&&u>e&&(e=u),r&&u>r&&(r=u),at(Math.min(255,~~(t/n)),Math.min(255,~~(e/n)),Math.min(255,~~(r/n)))):at(u,u,u)},Xa.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),at(~~(n*this.r),~~(n*this.g),~~(n*this.b))},Xa.hsl=function(){return ft(this.r,this.g,this.b)},Xa.toString=function(){return"#"+st(this.r)+st(this.g)+st(this.b)};var $a=Bo.map({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});$a.forEach(function(n,t){$a.set(n,it(t))}),Bo.functor=vt,Bo.xhr=mt(dt),Bo.dsv=function(n,t){function e(n,e,i){arguments.length<3&&(i=e,e=null);var o=yt(n,t,null==e?r:u(e),i);return o.row=function(n){return arguments.length?o.response(null==(e=n)?r:u(n)):e},o}function r(n){return e.parse(n.responseText)}function u(n){return function(t){return e.parse(t.responseText,n)}}function o(t){return t.map(a).join(n)}function a(n){return c.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}var c=new RegExp('["'+n+"\n]"),s=n.charCodeAt(0);return e.parse=function(n,t){var r;return e.parseRows(n,function(n,e){if(r)return r(n,e-1);var u=new Function("d","return {"+n.map(function(n,t){return JSON.stringify(n)+": d["+t+"]"}).join(",")+"}");r=t?function(n,e){return t(u(n),e)}:u})},e.parseRows=function(n,t){function e(){if(l>=c)return o;if(u)return u=!1,i;var t=l;if(34===n.charCodeAt(t)){for(var e=t;e++<c;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}l=e+2;var r=n.charCodeAt(e+1);return 13===r?(u=!0,10===n.charCodeAt(e+2)&&++l):10===r&&(u=!0),n.substring(t+1,e).replace(/""/g,'"')}for(;c>l;){var r=n.charCodeAt(l++),a=1;if(10===r)u=!0;else if(13===r)u=!0,10===n.charCodeAt(l)&&(++l,++a);else if(r!==s)continue;return n.substring(t,l-a)}return n.substring(t)}for(var r,u,i={},o={},a=[],c=n.length,l=0,f=0;(r=e())!==o;){for(var h=[];r!==i&&r!==o;)h.push(r),r=e();(!t||(h=t(h,f++)))&&a.push(h)}return a},e.format=function(t){if(Array.isArray(t[0]))return e.formatRows(t);var r=new i,u=[];return t.forEach(function(n){for(var t in n)r.has(t)||u.push(r.add(t))}),[u.map(a).join(n)].concat(t.map(function(t){return u.map(function(n){return a(t[n])}).join(n)})).join("\n")},e.formatRows=function(n){return n.map(o).join("\n")},e},Bo.csv=Bo.dsv(",","text/csv"),Bo.tsv=Bo.dsv("	","text/tab-separated-values");var Ba,Wa,Ja,Ga,Ka,Qa=Qo[a(Qo,"requestAnimationFrame")]||function(n){setTimeout(n,17)};Bo.timer=function(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now());var u=e+t,i={c:n,t:u,f:!1,n:null};Wa?Wa.n=i:Ba=i,Wa=i,Ja||(Ga=clearTimeout(Ga),Ja=1,Qa(Mt))},Bo.timer.flush=function(){_t(),bt()};var nc=".",tc=",",ec=[3,3],rc="$",uc=["y","z","a","f","p","n","\xb5","m","","k","M","G","T","P","E","Z","Y"].map(wt);Bo.formatPrefix=function(n,t){var e=0;return n&&(0>n&&(n*=-1),t&&(n=Bo.round(n,St(n,t))),e=1+Math.floor(1e-12+Math.log(n)/Math.LN10),e=Math.max(-24,Math.min(24,3*Math.floor((0>=e?e+1:e-1)/3)))),uc[8+e/3]},Bo.round=function(n,t){return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)},Bo.format=function(n){var t=ic.exec(n),e=t[1]||" ",r=t[2]||">",u=t[3]||"",i=t[4]||"",o=t[5],a=+t[6],c=t[7],s=t[8],l=t[9],f=1,h="",g=!1;switch(s&&(s=+s.substring(1)),(o||"0"===e&&"="===r)&&(o=e="0",r="=",c&&(a-=Math.floor((a-1)/4))),l){case"n":c=!0,l="g";break;case"%":f=100,h="%",l="f";break;case"p":f=100,h="%",l="r";break;case"b":case"o":case"x":case"X":"#"===i&&(i="0"+l.toLowerCase());case"c":case"d":g=!0,s=0;break;case"s":f=-1,l="r"}"#"===i?i="":"$"===i&&(i=rc),"r"!=l||s||(l="g"),null!=s&&("g"==l?s=Math.max(1,Math.min(21,s)):("e"==l||"f"==l)&&(s=Math.max(0,Math.min(20,s)))),l=oc.get(l)||kt;var p=o&&c;return function(n){if(g&&n%1)return"";var t=0>n||0===n&&0>1/n?(n=-n,"-"):u;if(0>f){var v=Bo.formatPrefix(n,s);n=v.scale(n),h=v.symbol}else n*=f;n=l(n,s);var d=n.lastIndexOf("."),m=0>d?n:n.substring(0,d),y=0>d?"":nc+n.substring(d+1);!o&&c&&(m=ac(m));var x=i.length+m.length+y.length+(p?0:t.length),M=a>x?new Array(x=a-x+1).join(e):"";return p&&(m=ac(M+m)),t+=i,n=m+y,("<"===r?t+n+M:">"===r?M+t+n:"^"===r?M.substring(0,x>>=1)+t+n+M.substring(x):t+(p?n:M+n))+h}};var ic=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,oc=Bo.map({b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},f:function(n,t){return n.toFixed(t)},r:function(n,t){return(n=Bo.round(n,St(n,t))).toFixed(Math.max(0,Math.min(20,St(n*(1+1e-15),t))))}}),ac=dt;if(ec){var cc=ec.length;ac=function(n){for(var t=n.length,e=[],r=0,u=ec[0];t>0&&u>0;)e.push(n.substring(t-=u,t+u)),u=ec[r=(r+1)%cc];return e.reverse().join(tc)}}Bo.geo={},Et.prototype={s:0,t:0,add:function(n){At(n,this.t,sc),At(sc.s,this.s,this),this.s?this.t+=sc.t:this.s=sc.t},reset:function(){this.s=this.t=0},valueOf:function(){return this.s}};var sc=new Et;Bo.geo.stream=function(n,t){n&&lc.hasOwnProperty(n.type)?lc[n.type](n,t):Ct(n,t)};var lc={Feature:function(n,t){Ct(n.geometry,t)},FeatureCollection:function(n,t){for(var e=n.features,r=-1,u=e.length;++r<u;)Ct(e[r].geometry,t)}},fc={Sphere:function(n,t){t.sphere()},Point:function(n,t){n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)n=e[r],t.point(n[0],n[1],n[2])},LineString:function(n,t){Nt(n.coordinates,t,0)},MultiLineString:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)Nt(e[r],t,0)},Polygon:function(n,t){Lt(n.coordinates,t)},MultiPolygon:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)Lt(e[r],t)},GeometryCollection:function(n,t){for(var e=n.geometries,r=-1,u=e.length;++r<u;)Ct(e[r],t)}};Bo.geo.area=function(n){return hc=0,Bo.geo.stream(n,pc),hc};var hc,gc=new Et,pc={sphere:function(){hc+=4*Ea},point:c,lineStart:c,lineEnd:c,polygonStart:function(){gc.reset(),pc.lineStart=Tt},polygonEnd:function(){var n=2*gc;hc+=0>n?4*Ea+n:n,pc.lineStart=pc.lineEnd=pc.point=c}};Bo.geo.bounds=function(){function n(n,t){x.push(M=[l=n,h=n]),f>t&&(f=t),t>g&&(g=t)}function t(t,e){var r=qt([t*Ta,e*Ta]);if(m){var u=Rt(m,r),i=[u[1],-u[0],0],o=Rt(i,u);Ut(o),o=jt(o);var c=t-p,s=c>0?1:-1,v=o[0]*qa*s,d=ca(c)>180;if(d^(v>s*p&&s*t>v)){var y=o[1]*qa;y>g&&(g=y)}else if(v=(v+360)%360-180,d^(v>s*p&&s*t>v)){var y=-o[1]*qa;f>y&&(f=y)}else f>e&&(f=e),e>g&&(g=e);d?p>t?a(l,t)>a(l,h)&&(h=t):a(t,h)>a(l,h)&&(l=t):h>=l?(l>t&&(l=t),t>h&&(h=t)):t>p?a(l,t)>a(l,h)&&(h=t):a(t,h)>a(l,h)&&(l=t)}else n(t,e);m=r,p=t}function e(){_.point=t}function r(){M[0]=l,M[1]=h,_.point=n,m=null}function u(n,e){if(m){var r=n-p;y+=ca(r)>180?r+(r>0?360:-360):r}else v=n,d=e;pc.point(n,e),t(n,e)}function i(){pc.lineStart()}function o(){u(v,d),pc.lineEnd(),ca(y)>Na&&(l=-(h=180)),M[0]=l,M[1]=h,m=null}function a(n,t){return(t-=n)<0?t+360:t}function c(n,t){return n[0]-t[0]}function s(n,t){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}var l,f,h,g,p,v,d,m,y,x,M,_={point:n,lineStart:e,lineEnd:r,polygonStart:function(){_.point=u,_.lineStart=i,_.lineEnd=o,y=0,pc.polygonStart()},polygonEnd:function(){pc.polygonEnd(),_.point=n,_.lineStart=e,_.lineEnd=r,0>gc?(l=-(h=180),f=-(g=90)):y>Na?g=90:-Na>y&&(f=-90),M[0]=l,M[1]=h}};return function(n){g=h=-(l=f=1/0),x=[],Bo.geo.stream(n,_);var t=x.length;if(t){x.sort(c);for(var e,r=1,u=x[0],i=[u];t>r;++r)e=x[r],s(e[0],u)||s(e[1],u)?(a(u[0],e[1])>a(u[0],u[1])&&(u[1]=e[1]),a(e[0],u[1])>a(u[0],u[1])&&(u[0]=e[0])):i.push(u=e);for(var o,e,p=-1/0,t=i.length-1,r=0,u=i[t];t>=r;u=e,++r)e=i[r],(o=a(u[1],e[0]))>p&&(p=o,l=e[0],h=u[1])}return x=M=null,1/0===l||1/0===f?[[0/0,0/0],[0/0,0/0]]:[[l,f],[h,g]]}}(),Bo.geo.centroid=function(n){vc=dc=mc=yc=xc=Mc=_c=bc=wc=Sc=kc=0,Bo.geo.stream(n,Ec);var t=wc,e=Sc,r=kc,u=t*t+e*e+r*r;return La>u&&(t=Mc,e=_c,r=bc,Na>dc&&(t=mc,e=yc,r=xc),u=t*t+e*e+r*r,La>u)?[0/0,0/0]:[Math.atan2(e,t)*qa,F(r/Math.sqrt(u))*qa]};var vc,dc,mc,yc,xc,Mc,_c,bc,wc,Sc,kc,Ec={sphere:c,point:Ft,lineStart:Yt,lineEnd:It,polygonStart:function(){Ec.lineStart=Zt},polygonEnd:function(){Ec.lineStart=Yt}},Ac=Wt(Vt,ne,ee,[-Ea,-Ea/2]),Cc=1e9;Bo.geo.clipExtent=function(){var n,t,e,r,u,i,o={stream:function(n){return u&&(u.valid=!1),u=i(n),u.valid=!0,u},extent:function(a){return arguments.length?(i=ie(n=+a[0][0],t=+a[0][1],e=+a[1][0],r=+a[1][1]),u&&(u.valid=!1,u=null),o):[[n,t],[e,r]]}};return o.extent([[0,0],[960,500]])},(Bo.geo.conicEqualArea=function(){return ae(ce)}).raw=ce,Bo.geo.albers=function(){return Bo.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)},Bo.geo.albersUsa=function(){function n(n){var i=n[0],o=n[1];return t=null,e(i,o),t||(r(i,o),t)||u(i,o),t}var t,e,r,u,i=Bo.geo.albers(),o=Bo.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),a=Bo.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),c={point:function(n,e){t=[n,e]}};return n.invert=function(n){var t=i.scale(),e=i.translate(),r=(n[0]-e[0])/t,u=(n[1]-e[1])/t;return(u>=.12&&.234>u&&r>=-.425&&-.214>r?o:u>=.166&&.234>u&&r>=-.214&&-.115>r?a:i).invert(n)},n.stream=function(n){var t=i.stream(n),e=o.stream(n),r=a.stream(n);return{point:function(n,u){t.point(n,u),e.point(n,u),r.point(n,u)},sphere:function(){t.sphere(),e.sphere(),r.sphere()},lineStart:function(){t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},n.precision=function(t){return arguments.length?(i.precision(t),o.precision(t),a.precision(t),n):i.precision()},n.scale=function(t){return arguments.length?(i.scale(t),o.scale(.35*t),a.scale(t),n.translate(i.translate())):i.scale()},n.translate=function(t){if(!arguments.length)return i.translate();var s=i.scale(),l=+t[0],f=+t[1];return e=i.translate(t).clipExtent([[l-.455*s,f-.238*s],[l+.455*s,f+.238*s]]).stream(c).point,r=o.translate([l-.307*s,f+.201*s]).clipExtent([[l-.425*s+Na,f+.12*s+Na],[l-.214*s-Na,f+.234*s-Na]]).stream(c).point,u=a.translate([l-.205*s,f+.212*s]).clipExtent([[l-.214*s+Na,f+.166*s+Na],[l-.115*s-Na,f+.234*s-Na]]).stream(c).point,n},n.scale(1070)};var Nc,Lc,Tc,qc,zc,Rc,Dc={point:c,lineStart:c,lineEnd:c,polygonStart:function(){Lc=0,Dc.lineStart=se},polygonEnd:function(){Dc.lineStart=Dc.lineEnd=Dc.point=c,Nc+=ca(Lc/2)}},Pc={point:le,lineStart:c,lineEnd:c,polygonStart:c,polygonEnd:c},Uc={point:ge,lineStart:pe,lineEnd:ve,polygonStart:function(){Uc.lineStart=de},polygonEnd:function(){Uc.point=ge,Uc.lineStart=pe,Uc.lineEnd=ve}};Bo.geo.path=function(){function n(n){return n&&("function"==typeof a&&i.pointRadius(+a.apply(this,arguments)),o&&o.valid||(o=u(i)),Bo.geo.stream(n,o)),i.result()}function t(){return o=null,n}var e,r,u,i,o,a=4.5;return n.area=function(n){return Nc=0,Bo.geo.stream(n,u(Dc)),Nc},n.centroid=function(n){return mc=yc=xc=Mc=_c=bc=wc=Sc=kc=0,Bo.geo.stream(n,u(Uc)),kc?[wc/kc,Sc/kc]:bc?[Mc/bc,_c/bc]:xc?[mc/xc,yc/xc]:[0/0,0/0]},n.bounds=function(n){return zc=Rc=-(Tc=qc=1/0),Bo.geo.stream(n,u(Pc)),[[Tc,qc],[zc,Rc]]},n.projection=function(n){return arguments.length?(u=(e=n)?n.stream||xe(n):dt,t()):e},n.context=function(n){return arguments.length?(i=null==(r=n)?new fe:new me(n),"function"!=typeof a&&i.pointRadius(a),t()):r},n.pointRadius=function(t){return arguments.length?(a="function"==typeof t?t:(i.pointRadius(+t),+t),n):a},n.projection(Bo.geo.albersUsa()).context(null)},Bo.geo.transform=function(n){return{stream:function(t){var e=new Me(t);for(var r in n)e[r]=n[r];return e}}},Me.prototype={point:function(n,t){this.stream.point(n,t)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()
},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}},Bo.geo.projection=be,Bo.geo.projectionMutator=we,(Bo.geo.equirectangular=function(){return be(ke)}).raw=ke.invert=ke,Bo.geo.rotation=function(n){function t(t){return t=n(t[0]*Ta,t[1]*Ta),t[0]*=qa,t[1]*=qa,t}return n=Ae(n[0]%360*Ta,n[1]*Ta,n.length>2?n[2]*Ta:0),t.invert=function(t){return t=n.invert(t[0]*Ta,t[1]*Ta),t[0]*=qa,t[1]*=qa,t},t},Ee.invert=ke,Bo.geo.circle=function(){function n(){var n="function"==typeof r?r.apply(this,arguments):r,t=Ae(-n[0]*Ta,-n[1]*Ta,0).invert,u=[];return e(null,null,1,{point:function(n,e){u.push(n=t(n,e)),n[0]*=qa,n[1]*=qa}}),{type:"Polygon",coordinates:[u]}}var t,e,r=[0,0],u=6;return n.origin=function(t){return arguments.length?(r=t,n):r},n.angle=function(r){return arguments.length?(e=Te((t=+r)*Ta,u*Ta),n):t},n.precision=function(r){return arguments.length?(e=Te(t*Ta,(u=+r)*Ta),n):u},n.angle(90)},Bo.geo.distance=function(n,t){var e,r=(t[0]-n[0])*Ta,u=n[1]*Ta,i=t[1]*Ta,o=Math.sin(r),a=Math.cos(r),c=Math.sin(u),s=Math.cos(u),l=Math.sin(i),f=Math.cos(i);return Math.atan2(Math.sqrt((e=f*o)*e+(e=s*l-c*f*a)*e),c*l+s*f*a)},Bo.geo.graticule=function(){function n(){return{type:"MultiLineString",coordinates:t()}}function t(){return Bo.range(Math.ceil(i/d)*d,u,d).map(h).concat(Bo.range(Math.ceil(s/m)*m,c,m).map(g)).concat(Bo.range(Math.ceil(r/p)*p,e,p).filter(function(n){return ca(n%d)>Na}).map(l)).concat(Bo.range(Math.ceil(a/v)*v,o,v).filter(function(n){return ca(n%m)>Na}).map(f))}var e,r,u,i,o,a,c,s,l,f,h,g,p=10,v=p,d=90,m=360,y=2.5;return n.lines=function(){return t().map(function(n){return{type:"LineString",coordinates:n}})},n.outline=function(){return{type:"Polygon",coordinates:[h(i).concat(g(c).slice(1),h(u).reverse().slice(1),g(s).reverse().slice(1))]}},n.extent=function(t){return arguments.length?n.majorExtent(t).minorExtent(t):n.minorExtent()},n.majorExtent=function(t){return arguments.length?(i=+t[0][0],u=+t[1][0],s=+t[0][1],c=+t[1][1],i>u&&(t=i,i=u,u=t),s>c&&(t=s,s=c,c=t),n.precision(y)):[[i,s],[u,c]]},n.minorExtent=function(t){return arguments.length?(r=+t[0][0],e=+t[1][0],a=+t[0][1],o=+t[1][1],r>e&&(t=r,r=e,e=t),a>o&&(t=a,a=o,o=t),n.precision(y)):[[r,a],[e,o]]},n.step=function(t){return arguments.length?n.majorStep(t).minorStep(t):n.minorStep()},n.majorStep=function(t){return arguments.length?(d=+t[0],m=+t[1],n):[d,m]},n.minorStep=function(t){return arguments.length?(p=+t[0],v=+t[1],n):[p,v]},n.precision=function(t){return arguments.length?(y=+t,l=ze(a,o,90),f=Re(r,e,y),h=ze(s,c,90),g=Re(i,u,y),n):y},n.majorExtent([[-180,-90+Na],[180,90-Na]]).minorExtent([[-180,-80-Na],[180,80+Na]])},Bo.geo.greatArc=function(){function n(){return{type:"LineString",coordinates:[t||r.apply(this,arguments),e||u.apply(this,arguments)]}}var t,e,r=De,u=Pe;return n.distance=function(){return Bo.geo.distance(t||r.apply(this,arguments),e||u.apply(this,arguments))},n.source=function(e){return arguments.length?(r=e,t="function"==typeof e?null:e,n):r},n.target=function(t){return arguments.length?(u=t,e="function"==typeof t?null:t,n):u},n.precision=function(){return arguments.length?n:0},n},Bo.geo.interpolate=function(n,t){return Ue(n[0]*Ta,n[1]*Ta,t[0]*Ta,t[1]*Ta)},Bo.geo.length=function(n){return jc=0,Bo.geo.stream(n,Hc),jc};var jc,Hc={sphere:c,point:c,lineStart:je,lineEnd:c,polygonStart:c,polygonEnd:c},Fc=He(function(n){return Math.sqrt(2/(1+n))},function(n){return 2*Math.asin(n/2)});(Bo.geo.azimuthalEqualArea=function(){return be(Fc)}).raw=Fc;var Oc=He(function(n){var t=Math.acos(n);return t&&t/Math.sin(t)},dt);(Bo.geo.azimuthalEquidistant=function(){return be(Oc)}).raw=Oc,(Bo.geo.conicConformal=function(){return ae(Fe)}).raw=Fe,(Bo.geo.conicEquidistant=function(){return ae(Oe)}).raw=Oe;var Yc=He(function(n){return 1/n},Math.atan);(Bo.geo.gnomonic=function(){return be(Yc)}).raw=Yc,Ye.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-Ca]},(Bo.geo.mercator=function(){return Ie(Ye)}).raw=Ye;var Ic=He(function(){return 1},Math.asin);(Bo.geo.orthographic=function(){return be(Ic)}).raw=Ic;var Zc=He(function(n){return 1/(1+n)},function(n){return 2*Math.atan(n)});(Bo.geo.stereographic=function(){return be(Zc)}).raw=Zc,Ze.invert=function(n,t){return[-t,2*Math.atan(Math.exp(n))-Ca]},(Bo.geo.transverseMercator=function(){var n=Ie(Ze),t=n.center,e=n.rotate;return n.center=function(n){return n?t([-n[1],n[0]]):(n=t(),[-n[1],n[0]])},n.rotate=function(n){return n?e([n[0],n[1],n.length>2?n[2]+90:90]):(n=e(),[n[0],n[1],n[2]-90])},n.rotate([0,0])}).raw=Ze,Bo.geom={},Bo.geom.hull=function(n){function t(n){if(n.length<3)return[];var t,u,i,o,a,c,s,l,f,h,g,p,v=vt(e),d=vt(r),m=n.length,y=m-1,x=[],M=[],_=0;if(v===Ve&&r===Xe)t=n;else for(i=0,t=[];m>i;++i)t.push([+v.call(this,u=n[i],i),+d.call(this,u,i)]);for(i=1;m>i;++i)(t[i][1]<t[_][1]||t[i][1]==t[_][1]&&t[i][0]<t[_][0])&&(_=i);for(i=0;m>i;++i)i!==_&&(c=t[i][1]-t[_][1],a=t[i][0]-t[_][0],x.push({angle:Math.atan2(c,a),index:i}));for(x.sort(function(n,t){return n.angle-t.angle}),g=x[0].angle,h=x[0].index,f=0,i=1;y>i;++i){if(o=x[i].index,g==x[i].angle){if(a=t[h][0]-t[_][0],c=t[h][1]-t[_][1],s=t[o][0]-t[_][0],l=t[o][1]-t[_][1],a*a+c*c>=s*s+l*l){x[i].index=-1;continue}x[f].index=-1}g=x[i].angle,f=i,h=o}for(M.push(_),i=0,o=0;2>i;++o)x[o].index>-1&&(M.push(x[o].index),i++);for(p=M.length;y>o;++o)if(!(x[o].index<0)){for(;!$e(M[p-2],M[p-1],x[o].index,t);)--p;M[p++]=x[o].index}var b=[];for(i=p-1;i>=0;--i)b.push(n[M[i]]);return b}var e=Ve,r=Xe;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t)},Bo.geom.polygon=function(n){return ga(n,Vc),n};var Vc=Bo.geom.polygon.prototype=[];Vc.area=function(){for(var n,t=-1,e=this.length,r=this[e-1],u=0;++t<e;)n=r,r=this[t],u+=n[1]*r[0]-n[0]*r[1];return.5*u},Vc.centroid=function(n){var t,e,r=-1,u=this.length,i=0,o=0,a=this[u-1];for(arguments.length||(n=-1/(6*this.area()));++r<u;)t=a,a=this[r],e=t[0]*a[1]-a[0]*t[1],i+=(t[0]+a[0])*e,o+=(t[1]+a[1])*e;return[i*n,o*n]},Vc.clip=function(n){for(var t,e,r,u,i,o,a=Je(n),c=-1,s=this.length-Je(this),l=this[s-1];++c<s;){for(t=n.slice(),n.length=0,u=this[c],i=t[(r=t.length-a)-1],e=-1;++e<r;)o=t[e],Be(o,l,u)?(Be(i,l,u)||n.push(We(i,o,l,u)),n.push(o)):Be(i,l,u)&&n.push(We(i,o,l,u)),i=o;a&&n.push(n[0]),l=u}return n};var Xc,$c,Bc,Wc,Jc,Gc=[],Kc=[];ur.prototype.prepare=function(){for(var n,t=this.edges,e=t.length;e--;)n=t[e].edge,n.b&&n.a||t.splice(e,1);return t.sort(or),t.length},dr.prototype={start:function(){return this.edge.l===this.site?this.edge.a:this.edge.b},end:function(){return this.edge.l===this.site?this.edge.b:this.edge.a}},mr.prototype={insert:function(n,t){var e,r,u;if(n){if(t.P=n,t.N=n.N,n.N&&(n.N.P=t),n.N=t,n.R){for(n=n.R;n.L;)n=n.L;n.L=t}else n.R=t;e=n}else this._?(n=_r(this._),t.P=null,t.N=n,n.P=n.L=t,e=n):(t.P=t.N=null,this._=t,e=null);for(t.L=t.R=null,t.U=e,t.C=!0,n=t;e&&e.C;)r=e.U,e===r.L?(u=r.R,u&&u.C?(e.C=u.C=!1,r.C=!0,n=r):(n===e.R&&(xr(this,e),n=e,e=n.U),e.C=!1,r.C=!0,Mr(this,r))):(u=r.L,u&&u.C?(e.C=u.C=!1,r.C=!0,n=r):(n===e.L&&(Mr(this,e),n=e,e=n.U),e.C=!1,r.C=!0,xr(this,r))),e=n.U;this._.C=!1},remove:function(n){n.N&&(n.N.P=n.P),n.P&&(n.P.N=n.N),n.N=n.P=null;var t,e,r,u=n.U,i=n.L,o=n.R;if(e=i?o?_r(o):i:o,u?u.L===n?u.L=e:u.R=e:this._=e,i&&o?(r=e.C,e.C=n.C,e.L=i,i.U=e,e!==o?(u=e.U,e.U=n.U,n=e.R,u.L=n,e.R=o,o.U=e):(e.U=u,u=e,n=e.R)):(r=n.C,n=e),n&&(n.U=u),!r){if(n&&n.C)return n.C=!1,void 0;do{if(n===this._)break;if(n===u.L){if(t=u.R,t.C&&(t.C=!1,u.C=!0,xr(this,u),t=u.R),t.L&&t.L.C||t.R&&t.R.C){t.R&&t.R.C||(t.L.C=!1,t.C=!0,Mr(this,t),t=u.R),t.C=u.C,u.C=t.R.C=!1,xr(this,u),n=this._;break}}else if(t=u.L,t.C&&(t.C=!1,u.C=!0,Mr(this,u),t=u.L),t.L&&t.L.C||t.R&&t.R.C){t.L&&t.L.C||(t.R.C=!1,t.C=!0,xr(this,t),t=u.L),t.C=u.C,u.C=t.L.C=!1,Mr(this,u),n=this._;break}t.C=!0,n=u,u=u.U}while(!n.C);n&&(n.C=!1)}}},Bo.geom.voronoi=function(n){function t(n){var t=new Array(n.length),r=a[0][0],u=a[0][1],i=a[1][0],o=a[1][1];return br(e(n),a).cells.forEach(function(e,a){var c=e.edges,s=e.site,l=t[a]=c.length?c.map(function(n){var t=n.start();return[t.x,t.y]}):s.x>=r&&s.x<=i&&s.y>=u&&s.y<=o?[[r,o],[i,o],[i,u],[r,u]]:[];l.point=n[a]}),t}function e(n){return n.map(function(n,t){return{x:Math.round(i(n,t)/Na)*Na,y:Math.round(o(n,t)/Na)*Na,i:t}})}var r=Ve,u=Xe,i=r,o=u,a=Qc;return n?t(n):(t.links=function(n){return br(e(n)).edges.filter(function(n){return n.l&&n.r}).map(function(t){return{source:n[t.l.i],target:n[t.r.i]}})},t.triangles=function(n){var t=[];return br(e(n)).cells.forEach(function(e,r){for(var u,i,o=e.site,a=e.edges.sort(or),c=-1,s=a.length,l=a[s-1].edge,f=l.l===o?l.r:l.l;++c<s;)u=l,i=f,l=a[c].edge,f=l.l===o?l.r:l.l,r<i.i&&r<f.i&&Sr(o,i,f)<0&&t.push([n[r],n[i.i],n[f.i]])}),t},t.x=function(n){return arguments.length?(i=vt(r=n),t):r},t.y=function(n){return arguments.length?(o=vt(u=n),t):u},t.clipExtent=function(n){return arguments.length?(a=null==n?Qc:n,t):a===Qc?null:a},t.size=function(n){return arguments.length?t.clipExtent(n&&[[0,0],n]):a===Qc?null:a&&a[1]},t)};var Qc=[[-1e6,-1e6],[1e6,1e6]];Bo.geom.delaunay=function(n){return Bo.geom.voronoi().triangles(n)},Bo.geom.quadtree=function(n,t,e,r,u){function i(n){function i(n,t,e,r,u,i,o,a){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var c=n.x,l=n.y;if(null!=c)if(ca(c-e)+ca(l-r)<.01)s(n,t,e,r,u,i,o,a);else{var f=n.point;n.x=n.y=n.point=null,s(n,f,c,l,u,i,o,a),s(n,t,e,r,u,i,o,a)}else n.x=e,n.y=r,n.point=t}else s(n,t,e,r,u,i,o,a)}function s(n,t,e,r,u,o,a,c){var s=.5*(u+a),l=.5*(o+c),f=e>=s,h=r>=l,g=(h<<1)+f;n.leaf=!1,n=n.nodes[g]||(n.nodes[g]=Ar()),f?u=s:a=s,h?o=l:c=l,i(n,t,e,r,u,o,a,c)}var l,f,h,g,p,v,d,m,y,x=vt(a),M=vt(c);if(null!=t)v=t,d=e,m=r,y=u;else if(m=y=-(v=d=1/0),f=[],h=[],p=n.length,o)for(g=0;p>g;++g)l=n[g],l.x<v&&(v=l.x),l.y<d&&(d=l.y),l.x>m&&(m=l.x),l.y>y&&(y=l.y),f.push(l.x),h.push(l.y);else for(g=0;p>g;++g){var _=+x(l=n[g],g),b=+M(l,g);v>_&&(v=_),d>b&&(d=b),_>m&&(m=_),b>y&&(y=b),f.push(_),h.push(b)}var w=m-v,S=y-d;w>S?y=d+w:m=v+S;var k=Ar();if(k.add=function(n){i(k,n,+x(n,++g),+M(n,g),v,d,m,y)},k.visit=function(n){Cr(n,k,v,d,m,y)},g=-1,null==t){for(;++g<p;)i(k,n[g],f[g],h[g],v,d,m,y);--g}else n.forEach(k.add);return f=h=n=l=null,k}var o,a=Ve,c=Xe;return(o=arguments.length)?(a=kr,c=Er,3===o&&(u=e,r=t,e=t=0),i(n)):(i.x=function(n){return arguments.length?(a=n,i):a},i.y=function(n){return arguments.length?(c=n,i):c},i.extent=function(n){return arguments.length?(null==n?t=e=r=u=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],u=+n[1][1]),i):null==t?null:[[t,e],[r,u]]},i.size=function(n){return arguments.length?(null==n?t=e=r=u=null:(t=e=0,r=+n[0],u=+n[1]),i):null==t?null:[r-t,u-e]},i)},Bo.interpolateRgb=Nr,Bo.interpolateObject=Lr,Bo.interpolateNumber=Tr,Bo.interpolateString=qr;var ns=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;Bo.interpolate=zr,Bo.interpolators=[function(n,t){var e=typeof t;return("string"===e?$a.has(t)||/^(#|rgb\(|hsl\()/.test(t)?Nr:qr:t instanceof V?Nr:"object"===e?Array.isArray(t)?Rr:Lr:Tr)(n,t)}],Bo.interpolateArray=Rr;var ts=function(){return dt},es=Bo.map({linear:ts,poly:Or,quad:function(){return jr},cubic:function(){return Hr},sin:function(){return Yr},exp:function(){return Ir},circle:function(){return Zr},elastic:Vr,back:Xr,bounce:function(){return $r}}),rs=Bo.map({"in":dt,out:Pr,"in-out":Ur,"out-in":function(n){return Ur(Pr(n))}});Bo.ease=function(n){var t=n.indexOf("-"),e=t>=0?n.substring(0,t):n,r=t>=0?n.substring(t+1):"in";return e=es.get(e)||ts,r=rs.get(r)||dt,Dr(r(e.apply(null,Wo.call(arguments,1))))},Bo.interpolateHcl=Br,Bo.interpolateHsl=Wr,Bo.interpolateLab=Jr,Bo.interpolateRound=Gr,Bo.transform=function(n){var t=Go.createElementNS(Bo.ns.prefix.svg,"g");return(Bo.transform=function(n){if(null!=n){t.setAttribute("transform",n);var e=t.transform.baseVal.consolidate()}return new Kr(e?e.matrix:us)})(n)},Kr.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var us={a:1,b:0,c:0,d:1,e:0,f:0};Bo.interpolateTransform=eu,Bo.layout={},Bo.layout.bundle=function(){return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(iu(n[e]));return t}},Bo.layout.chord=function(){function n(){var n,s,f,h,g,p={},v=[],d=Bo.range(i),m=[];for(e=[],r=[],n=0,h=-1;++h<i;){for(s=0,g=-1;++g<i;)s+=u[h][g];v.push(s),m.push(Bo.range(i)),n+=s}for(o&&d.sort(function(n,t){return o(v[n],v[t])}),a&&m.forEach(function(n,t){n.sort(function(n,e){return a(u[t][n],u[t][e])})}),n=(Aa-l*i)/n,s=0,h=-1;++h<i;){for(f=s,g=-1;++g<i;){var y=d[h],x=m[y][g],M=u[y][x],_=s,b=s+=M*n;p[y+"-"+x]={index:y,subindex:x,startAngle:_,endAngle:b,value:M}}r[y]={index:y,startAngle:f,endAngle:s,value:(s-f)/n},s+=l}for(h=-1;++h<i;)for(g=h-1;++g<i;){var w=p[h+"-"+g],S=p[g+"-"+h];(w.value||S.value)&&e.push(w.value<S.value?{source:S,target:w}:{source:w,target:S})}c&&t()}function t(){e.sort(function(n,t){return c((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)})}var e,r,u,i,o,a,c,s={},l=0;return s.matrix=function(n){return arguments.length?(i=(u=n)&&u.length,e=r=null,s):u},s.padding=function(n){return arguments.length?(l=n,e=r=null,s):l},s.sortGroups=function(n){return arguments.length?(o=n,e=r=null,s):o},s.sortSubgroups=function(n){return arguments.length?(a=n,e=null,s):a},s.sortChords=function(n){return arguments.length?(c=n,e&&t(),s):c},s.chords=function(){return e||n(),e},s.groups=function(){return r||n(),r},s},Bo.layout.force=function(){function n(n){return function(t,e,r,u){if(t.point!==n){var i=t.cx-n.x,o=t.cy-n.y,a=1/Math.sqrt(i*i+o*o);if(v>(u-e)*a){var c=t.charge*a*a;return n.px-=i*c,n.py-=o*c,!0}if(t.point&&isFinite(a)){var c=t.pointCharge*a*a;n.px-=i*c,n.py-=o*c}}return!t.charge}}function t(n){n.px=Bo.event.x,n.py=Bo.event.y,a.resume()}var e,r,u,i,o,a={},c=Bo.dispatch("start","tick","end"),s=[1,1],l=.9,f=is,h=os,g=-30,p=.1,v=.8,d=[],m=[];return a.tick=function(){if((r*=.99)<.005)return c.end({type:"end",alpha:r=0}),!0;var t,e,a,f,h,v,y,x,M,_=d.length,b=m.length;for(e=0;b>e;++e)a=m[e],f=a.source,h=a.target,x=h.x-f.x,M=h.y-f.y,(v=x*x+M*M)&&(v=r*i[e]*((v=Math.sqrt(v))-u[e])/v,x*=v,M*=v,h.x-=x*(y=f.weight/(h.weight+f.weight)),h.y-=M*y,f.x+=x*(y=1-y),f.y+=M*y);if((y=r*p)&&(x=s[0]/2,M=s[1]/2,e=-1,y))for(;++e<_;)a=d[e],a.x+=(x-a.x)*y,a.y+=(M-a.y)*y;if(g)for(hu(t=Bo.geom.quadtree(d),r,o),e=-1;++e<_;)(a=d[e]).fixed||t.visit(n(a));for(e=-1;++e<_;)a=d[e],a.fixed?(a.x=a.px,a.y=a.py):(a.x-=(a.px-(a.px=a.x))*l,a.y-=(a.py-(a.py=a.y))*l);c.tick({type:"tick",alpha:r})},a.nodes=function(n){return arguments.length?(d=n,a):d},a.links=function(n){return arguments.length?(m=n,a):m},a.size=function(n){return arguments.length?(s=n,a):s},a.linkDistance=function(n){return arguments.length?(f="function"==typeof n?n:+n,a):f},a.distance=a.linkDistance,a.linkStrength=function(n){return arguments.length?(h="function"==typeof n?n:+n,a):h},a.friction=function(n){return arguments.length?(l=+n,a):l},a.charge=function(n){return arguments.length?(g="function"==typeof n?n:+n,a):g},a.gravity=function(n){return arguments.length?(p=+n,a):p},a.theta=function(n){return arguments.length?(v=+n,a):v},a.alpha=function(n){return arguments.length?(n=+n,r?r=n>0?n:0:n>0&&(c.start({type:"start",alpha:r=n}),Bo.timer(a.tick)),a):r},a.start=function(){function n(n,r){if(!e){for(e=new Array(c),a=0;c>a;++a)e[a]=[];for(a=0;s>a;++a){var u=m[a];e[u.source.index].push(u.target),e[u.target.index].push(u.source)}}for(var i,o=e[t],a=-1,s=o.length;++a<s;)if(!isNaN(i=o[a][n]))return i;return Math.random()*r}var t,e,r,c=d.length,l=m.length,p=s[0],v=s[1];for(t=0;c>t;++t)(r=d[t]).index=t,r.weight=0;for(t=0;l>t;++t)r=m[t],"number"==typeof r.source&&(r.source=d[r.source]),"number"==typeof r.target&&(r.target=d[r.target]),++r.source.weight,++r.target.weight;for(t=0;c>t;++t)r=d[t],isNaN(r.x)&&(r.x=n("x",p)),isNaN(r.y)&&(r.y=n("y",v)),isNaN(r.px)&&(r.px=r.x),isNaN(r.py)&&(r.py=r.y);if(u=[],"function"==typeof f)for(t=0;l>t;++t)u[t]=+f.call(this,m[t],t);else for(t=0;l>t;++t)u[t]=f;if(i=[],"function"==typeof h)for(t=0;l>t;++t)i[t]=+h.call(this,m[t],t);else for(t=0;l>t;++t)i[t]=h;if(o=[],"function"==typeof g)for(t=0;c>t;++t)o[t]=+g.call(this,d[t],t);else for(t=0;c>t;++t)o[t]=g;return a.resume()},a.resume=function(){return a.alpha(.1)},a.stop=function(){return a.alpha(0)},a.drag=function(){return e||(e=Bo.behavior.drag().origin(dt).on("dragstart.force",cu).on("drag.force",t).on("dragend.force",su)),arguments.length?(this.on("mouseover.force",lu).on("mouseout.force",fu).call(e),void 0):e},Bo.rebind(a,c,"on")};var is=20,os=1;Bo.layout.hierarchy=function(){function n(t,o,a){var c=u.call(e,t,o);if(t.depth=o,a.push(t),c&&(s=c.length)){for(var s,l,f=-1,h=t.children=new Array(s),g=0,p=o+1;++f<s;)l=h[f]=n(c[f],p,a),l.parent=t,g+=l.value;r&&h.sort(r),i&&(t.value=g)}else delete t.children,i&&(t.value=+i.call(e,t,o)||0);return t}function t(n,r){var u=n.children,o=0;if(u&&(a=u.length))for(var a,c=-1,s=r+1;++c<a;)o+=t(u[c],s);else i&&(o=+i.call(e,n,r)||0);return i&&(n.value=o),o}function e(t){var e=[];return n(t,0,e),e}var r=du,u=pu,i=vu;return e.sort=function(n){return arguments.length?(r=n,e):r},e.children=function(n){return arguments.length?(u=n,e):u},e.value=function(n){return arguments.length?(i=n,e):i},e.revalue=function(n){return t(n,0),n},e},Bo.layout.partition=function(){function n(t,e,r,u){var i=t.children;if(t.x=e,t.y=t.depth*u,t.dx=r,t.dy=u,i&&(o=i.length)){var o,a,c,s=-1;for(r=t.value?r/t.value:0;++s<o;)n(a=i[s],e,c=a.value*r,u),e+=c}}function t(n){var e=n.children,r=0;if(e&&(u=e.length))for(var u,i=-1;++i<u;)r=Math.max(r,t(e[i]));return 1+r}function e(e,i){var o=r.call(this,e,i);return n(o[0],0,u[0],u[1]/t(o[0])),o}var r=Bo.layout.hierarchy(),u=[1,1];return e.size=function(n){return arguments.length?(u=n,e):u},gu(e,r)},Bo.layout.pie=function(){function n(i){var o=i.map(function(e,r){return+t.call(n,e,r)}),a=+("function"==typeof r?r.apply(this,arguments):r),c=(("function"==typeof u?u.apply(this,arguments):u)-a)/Bo.sum(o),s=Bo.range(i.length);null!=e&&s.sort(e===as?function(n,t){return o[t]-o[n]}:function(n,t){return e(i[n],i[t])});var l=[];return s.forEach(function(n){var t;l[n]={data:i[n],value:t=o[n],startAngle:a,endAngle:a+=t*c}}),l}var t=Number,e=as,r=0,u=Aa;return n.value=function(e){return arguments.length?(t=e,n):t},n.sort=function(t){return arguments.length?(e=t,n):e},n.startAngle=function(t){return arguments.length?(r=t,n):r},n.endAngle=function(t){return arguments.length?(u=t,n):u},n};var as={};Bo.layout.stack=function(){function n(a,c){var s=a.map(function(e,r){return t.call(n,e,r)}),l=s.map(function(t){return t.map(function(t,e){return[i.call(n,t,e),o.call(n,t,e)]})}),f=e.call(n,l,c);s=Bo.permute(s,f),l=Bo.permute(l,f);var h,g,p,v=r.call(n,l,c),d=s.length,m=s[0].length;for(g=0;m>g;++g)for(u.call(n,s[0][g],p=v[g],l[0][g][1]),h=1;d>h;++h)u.call(n,s[h][g],p+=l[h-1][g][1],l[h][g][1]);return a}var t=dt,e=_u,r=bu,u=Mu,i=yu,o=xu;return n.values=function(e){return arguments.length?(t=e,n):t},n.order=function(t){return arguments.length?(e="function"==typeof t?t:cs.get(t)||_u,n):e},n.offset=function(t){return arguments.length?(r="function"==typeof t?t:ss.get(t)||bu,n):r},n.x=function(t){return arguments.length?(i=t,n):i},n.y=function(t){return arguments.length?(o=t,n):o},n.out=function(t){return arguments.length?(u=t,n):u},n};var cs=Bo.map({"inside-out":function(n){var t,e,r=n.length,u=n.map(wu),i=n.map(Su),o=Bo.range(r).sort(function(n,t){return u[n]-u[t]}),a=0,c=0,s=[],l=[];for(t=0;r>t;++t)e=o[t],c>a?(a+=i[e],s.push(e)):(c+=i[e],l.push(e));return l.reverse().concat(s)},reverse:function(n){return Bo.range(n.length).reverse()},"default":_u}),ss=Bo.map({silhouette:function(n){var t,e,r,u=n.length,i=n[0].length,o=[],a=0,c=[];for(e=0;i>e;++e){for(t=0,r=0;u>t;t++)r+=n[t][e][1];r>a&&(a=r),o.push(r)}for(e=0;i>e;++e)c[e]=(a-o[e])/2;return c},wiggle:function(n){var t,e,r,u,i,o,a,c,s,l=n.length,f=n[0],h=f.length,g=[];for(g[0]=c=s=0,e=1;h>e;++e){for(t=0,u=0;l>t;++t)u+=n[t][e][1];for(t=0,i=0,a=f[e][0]-f[e-1][0];l>t;++t){for(r=0,o=(n[t][e][1]-n[t][e-1][1])/(2*a);t>r;++r)o+=(n[r][e][1]-n[r][e-1][1])/a;i+=o*n[t][e][1]}g[e]=c-=u?i/u*a:0,s>c&&(s=c)}for(e=0;h>e;++e)g[e]-=s;return g},expand:function(n){var t,e,r,u=n.length,i=n[0].length,o=1/u,a=[];for(e=0;i>e;++e){for(t=0,r=0;u>t;t++)r+=n[t][e][1];if(r)for(t=0;u>t;t++)n[t][e][1]/=r;else for(t=0;u>t;t++)n[t][e][1]=o}for(e=0;i>e;++e)a[e]=0;return a},zero:bu});Bo.layout.histogram=function(){function n(n,i){for(var o,a,c=[],s=n.map(e,this),l=r.call(this,s,i),f=u.call(this,l,s,i),i=-1,h=s.length,g=f.length-1,p=t?1:1/h;++i<g;)o=c[i]=[],o.dx=f[i+1]-(o.x=f[i]),o.y=0;if(g>0)for(i=-1;++i<h;)a=s[i],a>=l[0]&&a<=l[1]&&(o=c[Bo.bisect(f,a,1,g)-1],o.y+=p,o.push(n[i]));return c}var t=!0,e=Number,r=Cu,u=Eu;return n.value=function(t){return arguments.length?(e=t,n):e},n.range=function(t){return arguments.length?(r=vt(t),n):r},n.bins=function(t){return arguments.length?(u="number"==typeof t?function(n){return Au(n,t)}:vt(t),n):u},n.frequency=function(e){return arguments.length?(t=!!e,n):t},n},Bo.layout.tree=function(){function n(n,i){function o(n,t){var r=n.children,u=n._tree;if(r&&(i=r.length)){for(var i,a,s,l=r[0],f=l,h=-1;++h<i;)s=r[h],o(s,a),f=c(s,a,f),a=s;Uu(n);var g=.5*(l._tree.prelim+s._tree.prelim);t?(u.prelim=t._tree.prelim+e(n,t),u.mod=u.prelim-g):u.prelim=g}else t&&(u.prelim=t._tree.prelim+e(n,t))}function a(n,t){n.x=n._tree.prelim+t;var e=n.children;if(e&&(r=e.length)){var r,u=-1;for(t+=n._tree.mod;++u<r;)a(e[u],t)}}function c(n,t,r){if(t){for(var u,i=n,o=n,a=t,c=n.parent.children[0],s=i._tree.mod,l=o._tree.mod,f=a._tree.mod,h=c._tree.mod;a=Tu(a),i=Lu(i),a&&i;)c=Lu(c),o=Tu(o),o._tree.ancestor=n,u=a._tree.prelim+f-i._tree.prelim-s+e(a,i),u>0&&(ju(Hu(a,n,r),n,u),s+=u,l+=u),f+=a._tree.mod,s+=i._tree.mod,h+=c._tree.mod,l+=o._tree.mod;a&&!Tu(o)&&(o._tree.thread=a,o._tree.mod+=f-l),i&&!Lu(c)&&(c._tree.thread=i,c._tree.mod+=s-h,r=n)}return r}var s=t.call(this,n,i),l=s[0];Pu(l,function(n,t){n._tree={ancestor:n,prelim:0,mod:0,change:0,shift:0,number:t?t._tree.number+1:0}}),o(l),a(l,-l._tree.prelim);var f=qu(l,Ru),h=qu(l,zu),g=qu(l,Du),p=f.x-e(f,h)/2,v=h.x+e(h,f)/2,d=g.depth||1;return Pu(l,u?function(n){n.x*=r[0],n.y=n.depth*r[1],delete n._tree}:function(n){n.x=(n.x-p)/(v-p)*r[0],n.y=n.depth/d*r[1],delete n._tree}),s}var t=Bo.layout.hierarchy().sort(null).value(null),e=Nu,r=[1,1],u=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(u=null==(r=t),n):u?null:r},n.nodeSize=function(t){return arguments.length?(u=null!=(r=t),n):u?r:null},gu(n,t)},Bo.layout.pack=function(){function n(n,i){var o=e.call(this,n,i),a=o[0],c=u[0],s=u[1],l=null==t?Math.sqrt:"function"==typeof t?t:function(){return t};if(a.x=a.y=0,Pu(a,function(n){n.r=+l(n.value)}),Pu(a,Zu),r){var f=r*(t?1:Math.max(2*a.r/c,2*a.r/s))/2;Pu(a,function(n){n.r+=f}),Pu(a,Zu),Pu(a,function(n){n.r-=f})}return $u(a,c/2,s/2,t?1:1/Math.max(2*a.r/c,2*a.r/s)),o}var t,e=Bo.layout.hierarchy().sort(Fu),r=0,u=[1,1];return n.size=function(t){return arguments.length?(u=t,n):u},n.radius=function(e){return arguments.length?(t=null==e||"function"==typeof e?e:+e,n):t},n.padding=function(t){return arguments.length?(r=+t,n):r},gu(n,e)},Bo.layout.cluster=function(){function n(n,i){var o,a=t.call(this,n,i),c=a[0],s=0;Pu(c,function(n){var t=n.children;t&&t.length?(n.x=Ju(t),n.y=Wu(t)):(n.x=o?s+=e(n,o):0,n.y=0,o=n)});var l=Gu(c),f=Ku(c),h=l.x-e(l,f)/2,g=f.x+e(f,l)/2;return Pu(c,u?function(n){n.x=(n.x-c.x)*r[0],n.y=(c.y-n.y)*r[1]}:function(n){n.x=(n.x-h)/(g-h)*r[0],n.y=(1-(c.y?n.y/c.y:1))*r[1]}),a}var t=Bo.layout.hierarchy().sort(null).value(null),e=Nu,r=[1,1],u=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(u=null==(r=t),n):u?null:r},n.nodeSize=function(t){return arguments.length?(u=null!=(r=t),n):u?r:null},gu(n,t)},Bo.layout.treemap=function(){function n(n,t){for(var e,r,u=-1,i=n.length;++u<i;)r=(e=n[u]).value*(0>t?0:t),e.area=isNaN(r)||0>=r?0:r}function t(e){var i=e.children;if(i&&i.length){var o,a,c,s=f(e),l=[],h=i.slice(),p=1/0,v="slice"===g?s.dx:"dice"===g?s.dy:"slice-dice"===g?1&e.depth?s.dy:s.dx:Math.min(s.dx,s.dy);for(n(h,s.dx*s.dy/e.value),l.area=0;(c=h.length)>0;)l.push(o=h[c-1]),l.area+=o.area,"squarify"!==g||(a=r(l,v))<=p?(h.pop(),p=a):(l.area-=l.pop().area,u(l,v,s,!1),v=Math.min(s.dx,s.dy),l.length=l.area=0,p=1/0);l.length&&(u(l,v,s,!0),l.length=l.area=0),i.forEach(t)}}function e(t){var r=t.children;if(r&&r.length){var i,o=f(t),a=r.slice(),c=[];for(n(a,o.dx*o.dy/t.value),c.area=0;i=a.pop();)c.push(i),c.area+=i.area,null!=i.z&&(u(c,i.z?o.dx:o.dy,o,!a.length),c.length=c.area=0);r.forEach(e)}}function r(n,t){for(var e,r=n.area,u=0,i=1/0,o=-1,a=n.length;++o<a;)(e=n[o].area)&&(i>e&&(i=e),e>u&&(u=e));return r*=r,t*=t,r?Math.max(t*u*p/r,r/(t*i*p)):1/0}function u(n,t,e,r){var u,i=-1,o=n.length,a=e.x,s=e.y,l=t?c(n.area/t):0;if(t==e.dx){for((r||l>e.dy)&&(l=e.dy);++i<o;)u=n[i],u.x=a,u.y=s,u.dy=l,a+=u.dx=Math.min(e.x+e.dx-a,l?c(u.area/l):0);u.z=!0,u.dx+=e.x+e.dx-a,e.y+=l,e.dy-=l}else{for((r||l>e.dx)&&(l=e.dx);++i<o;)u=n[i],u.x=a,u.y=s,u.dx=l,s+=u.dy=Math.min(e.y+e.dy-s,l?c(u.area/l):0);u.z=!1,u.dy+=e.y+e.dy-s,e.x+=l,e.dx-=l}}function i(r){var u=o||a(r),i=u[0];return i.x=0,i.y=0,i.dx=s[0],i.dy=s[1],o&&a.revalue(i),n([i],i.dx*i.dy/i.value),(o?e:t)(i),h&&(o=u),u}var o,a=Bo.layout.hierarchy(),c=Math.round,s=[1,1],l=null,f=Qu,h=!1,g="squarify",p=.5*(1+Math.sqrt(5));return i.size=function(n){return arguments.length?(s=n,i):s},i.padding=function(n){function t(t){var e=n.call(i,t,t.depth);return null==e?Qu(t):ni(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){return ni(t,n)}if(!arguments.length)return l;var r;return f=null==(l=n)?Qu:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],e):e,i},i.round=function(n){return arguments.length?(c=n?Math.round:Number,i):c!=Number},i.sticky=function(n){return arguments.length?(h=n,o=null,i):h},i.ratio=function(n){return arguments.length?(p=n,i):p},i.mode=function(n){return arguments.length?(g=n+"",i):g},gu(i,a)},Bo.random={normal:function(n,t){var e=arguments.length;return 2>e&&(t=1),1>e&&(n=0),function(){var e,r,u;do e=2*Math.random()-1,r=2*Math.random()-1,u=e*e+r*r;while(!u||u>1);return n+t*e*Math.sqrt(-2*Math.log(u)/u)}},logNormal:function(){var n=Bo.random.normal.apply(Bo,arguments);return function(){return Math.exp(n())}},bates:function(n){var t=Bo.random.irwinHall(n);return function(){return t()/n}},irwinHall:function(n){return function(){for(var t=0,e=0;n>e;e++)t+=Math.random();return t}}},Bo.scale={};var ls={floor:dt,ceil:dt};Bo.scale.linear=function(){return ai([0,1],[0,1],zr,!1)};var fs={s:1,g:1,p:1,r:1,e:1};Bo.scale.log=function(){return vi(Bo.scale.linear().domain([0,1]),10,!0,[1,10])};var hs=Bo.format(".0e"),gs={floor:function(n){return-Math.ceil(-n)},ceil:function(n){return-Math.floor(-n)}};Bo.scale.pow=function(){return di(Bo.scale.linear(),1,[0,1])},Bo.scale.sqrt=function(){return Bo.scale.pow().exponent(.5)},Bo.scale.ordinal=function(){return yi([],{t:"range",a:[[]]})},Bo.scale.category10=function(){return Bo.scale.ordinal().range(ps)},Bo.scale.category20=function(){return Bo.scale.ordinal().range(vs)},Bo.scale.category20b=function(){return Bo.scale.ordinal().range(ds)},Bo.scale.category20c=function(){return Bo.scale.ordinal().range(ms)};var ps=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(ot),vs=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(ot),ds=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(ot),ms=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(ot);Bo.scale.quantile=function(){return xi([],[])},Bo.scale.quantize=function(){return Mi(0,1,[0,1])},Bo.scale.threshold=function(){return _i([.5],[0,1])},Bo.scale.identity=function(){return bi([0,1])},Bo.svg={},Bo.svg.arc=function(){function n(){var n=t.apply(this,arguments),i=e.apply(this,arguments),o=r.apply(this,arguments)+ys,a=u.apply(this,arguments)+ys,c=(o>a&&(c=o,o=a,a=c),a-o),s=Ea>c?"0":"1",l=Math.cos(o),f=Math.sin(o),h=Math.cos(a),g=Math.sin(a);return c>=xs?n?"M0,"+i+"A"+i+","+i+" 0 1,1 0,"+-i+"A"+i+","+i+" 0 1,1 0,"+i+"M0,"+n+"A"+n+","+n+" 0 1,0 0,"+-n+"A"+n+","+n+" 0 1,0 0,"+n+"Z":"M0,"+i+"A"+i+","+i+" 0 1,1 0,"+-i+"A"+i+","+i+" 0 1,1 0,"+i+"Z":n?"M"+i*l+","+i*f+"A"+i+","+i+" 0 "+s+",1 "+i*h+","+i*g+"L"+n*h+","+n*g+"A"+n+","+n+" 0 "+s+",0 "+n*l+","+n*f+"Z":"M"+i*l+","+i*f+"A"+i+","+i+" 0 "+s+",1 "+i*h+","+i*g+"L0,0"+"Z"}var t=wi,e=Si,r=ki,u=Ei;return n.innerRadius=function(e){return arguments.length?(t=vt(e),n):t},n.outerRadius=function(t){return arguments.length?(e=vt(t),n):e},n.startAngle=function(t){return arguments.length?(r=vt(t),n):r},n.endAngle=function(t){return arguments.length?(u=vt(t),n):u},n.centroid=function(){var n=(t.apply(this,arguments)+e.apply(this,arguments))/2,i=(r.apply(this,arguments)+u.apply(this,arguments))/2+ys;return[Math.cos(i)*n,Math.sin(i)*n]},n};var ys=-Ca,xs=Aa-Na;Bo.svg.line=function(){return Ai(dt)};var Ms=Bo.map({linear:Ci,"linear-closed":Ni,step:Li,"step-before":Ti,"step-after":qi,basis:ji,"basis-open":Hi,"basis-closed":Fi,bundle:Oi,cardinal:Di,"cardinal-open":zi,"cardinal-closed":Ri,monotone:$i});Ms.forEach(function(n,t){t.key=n,t.closed=/-closed$/.test(n)});var _s=[0,2/3,1/3,0],bs=[0,1/3,2/3,0],ws=[0,1/6,2/3,1/6];Bo.svg.line.radial=function(){var n=Ai(Bi);return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n},Ti.reverse=qi,qi.reverse=Ti,Bo.svg.area=function(){return Wi(dt)},Bo.svg.area.radial=function(){var n=Wi(Bi);return n.radius=n.x,delete n.x,n.innerRadius=n.x0,delete n.x0,n.outerRadius=n.x1,delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,delete n.y0,n.endAngle=n.y1,delete n.y1,n},Bo.svg.chord=function(){function n(n,a){var c=t(this,i,n,a),s=t(this,o,n,a);return"M"+c.p0+r(c.r,c.p1,c.a1-c.a0)+(e(c,s)?u(c.r,c.p1,c.r,c.p0):u(c.r,c.p1,s.r,s.p0)+r(s.r,s.p1,s.a1-s.a0)+u(s.r,s.p1,c.r,c.p0))+"Z"}function t(n,t,e,r){var u=t.call(n,e,r),i=a.call(n,u,r),o=c.call(n,u,r)+ys,l=s.call(n,u,r)+ys;return{r:i,a0:o,a1:l,p0:[i*Math.cos(o),i*Math.sin(o)],p1:[i*Math.cos(l),i*Math.sin(l)]}}function e(n,t){return n.a0==t.a0&&n.a1==t.a1}function r(n,t,e){return"A"+n+","+n+" 0 "+ +(e>Ea)+",1 "+t}function u(n,t,e,r){return"Q 0,0 "+r}var i=De,o=Pe,a=Ji,c=ki,s=Ei;return n.radius=function(t){return arguments.length?(a=vt(t),n):a},n.source=function(t){return arguments.length?(i=vt(t),n):i},n.target=function(t){return arguments.length?(o=vt(t),n):o},n.startAngle=function(t){return arguments.length?(c=vt(t),n):c},n.endAngle=function(t){return arguments.length?(s=vt(t),n):s},n},Bo.svg.diagonal=function(){function n(n,u){var i=t.call(this,n,u),o=e.call(this,n,u),a=(i.y+o.y)/2,c=[i,{x:i.x,y:a},{x:o.x,y:a},o];return c=c.map(r),"M"+c[0]+"C"+c[1]+" "+c[2]+" "+c[3]}var t=De,e=Pe,r=Gi;return n.source=function(e){return arguments.length?(t=vt(e),n):t},n.target=function(t){return arguments.length?(e=vt(t),n):e},n.projection=function(t){return arguments.length?(r=t,n):r},n},Bo.svg.diagonal.radial=function(){var n=Bo.svg.diagonal(),t=Gi,e=n.projection;return n.projection=function(n){return arguments.length?e(Ki(t=n)):t},n},Bo.svg.symbol=function(){function n(n,r){return(Ss.get(t.call(this,n,r))||to)(e.call(this,n,r))}var t=no,e=Qi;return n.type=function(e){return arguments.length?(t=vt(e),n):t},n.size=function(t){return arguments.length?(e=vt(t),n):e},n};var Ss=Bo.map({circle:to,cross:function(n){var t=Math.sqrt(n/5)/2;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"},diamond:function(n){var t=Math.sqrt(n/(2*Cs)),e=t*Cs;return"M0,"+-t+"L"+e+",0"+" 0,"+t+" "+-e+",0"+"Z"},square:function(n){var t=Math.sqrt(n)/2;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"
},"triangle-down":function(n){var t=Math.sqrt(n/As),e=t*As/2;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){var t=Math.sqrt(n/As),e=t*As/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}});Bo.svg.symbolTypes=Ss.keys();var ks,Es,As=Math.sqrt(3),Cs=Math.tan(30*Ta),Ns=[],Ls=0;Ns.call=ya.call,Ns.empty=ya.empty,Ns.node=ya.node,Ns.size=ya.size,Bo.transition=function(n){return arguments.length?ks?n.transition():n:_a.transition()},Bo.transition.prototype=Ns,Ns.select=function(n){var t,e,r,u=this.id,i=[];n=v(n);for(var o=-1,a=this.length;++o<a;){i.push(t=[]);for(var c=this[o],s=-1,l=c.length;++s<l;)(r=c[s])&&(e=n.call(r,r.__data__,s,o))?("__data__"in r&&(e.__data__=r.__data__),io(e,s,u,r.__transition__[u]),t.push(e)):t.push(null)}return eo(i,u)},Ns.selectAll=function(n){var t,e,r,u,i,o=this.id,a=[];n=d(n);for(var c=-1,s=this.length;++c<s;)for(var l=this[c],f=-1,h=l.length;++f<h;)if(r=l[f]){i=r.__transition__[o],e=n.call(r,r.__data__,f,c),a.push(t=[]);for(var g=-1,p=e.length;++g<p;)(u=e[g])&&io(u,g,o,i),t.push(u)}return eo(a,o)},Ns.filter=function(n){var t,e,r,u=[];"function"!=typeof n&&(n=A(n));for(var i=0,o=this.length;o>i;i++){u.push(t=[]);for(var e=this[i],a=0,c=e.length;c>a;a++)(r=e[a])&&n.call(r,r.__data__,a,i)&&t.push(r)}return eo(u,this.id)},Ns.tween=function(n,t){var e=this.id;return arguments.length<2?this.node().__transition__[e].tween.get(n):N(this,null==t?function(t){t.__transition__[e].tween.remove(n)}:function(r){r.__transition__[e].tween.set(n,t)})},Ns.attr=function(n,t){function e(){this.removeAttribute(a)}function r(){this.removeAttributeNS(a.space,a.local)}function u(n){return null==n?e:(n+="",function(){var t,e=this.getAttribute(a);return e!==n&&(t=o(e,n),function(n){this.setAttribute(a,t(n))})})}function i(n){return null==n?r:(n+="",function(){var t,e=this.getAttributeNS(a.space,a.local);return e!==n&&(t=o(e,n),function(n){this.setAttributeNS(a.space,a.local,t(n))})})}if(arguments.length<2){for(t in n)this.attr(t,n[t]);return this}var o="transform"==n?eu:zr,a=Bo.ns.qualify(n);return ro(this,"attr."+n,t,a.local?i:u)},Ns.attrTween=function(n,t){function e(n,e){var r=t.call(this,n,e,this.getAttribute(u));return r&&function(n){this.setAttribute(u,r(n))}}function r(n,e){var r=t.call(this,n,e,this.getAttributeNS(u.space,u.local));return r&&function(n){this.setAttributeNS(u.space,u.local,r(n))}}var u=Bo.ns.qualify(n);return this.tween("attr."+n,u.local?r:e)},Ns.style=function(n,t,e){function r(){this.style.removeProperty(n)}function u(t){return null==t?r:(t+="",function(){var r,u=Qo.getComputedStyle(this,null).getPropertyValue(n);return u!==t&&(r=zr(u,t),function(t){this.style.setProperty(n,r(t),e)})})}var i=arguments.length;if(3>i){if("string"!=typeof n){2>i&&(t="");for(e in n)this.style(e,n[e],t);return this}e=""}return ro(this,"style."+n,t,u)},Ns.styleTween=function(n,t,e){function r(r,u){var i=t.call(this,r,u,Qo.getComputedStyle(this,null).getPropertyValue(n));return i&&function(t){this.style.setProperty(n,i(t),e)}}return arguments.length<3&&(e=""),this.tween("style."+n,r)},Ns.text=function(n){return ro(this,"text",n,uo)},Ns.remove=function(){return this.each("end.transition",function(){var n;this.__transition__.count<2&&(n=this.parentNode)&&n.removeChild(this)})},Ns.ease=function(n){var t=this.id;return arguments.length<1?this.node().__transition__[t].ease:("function"!=typeof n&&(n=Bo.ease.apply(Bo,arguments)),N(this,function(e){e.__transition__[t].ease=n}))},Ns.delay=function(n){var t=this.id;return N(this,"function"==typeof n?function(e,r,u){e.__transition__[t].delay=+n.call(e,e.__data__,r,u)}:(n=+n,function(e){e.__transition__[t].delay=n}))},Ns.duration=function(n){var t=this.id;return N(this,"function"==typeof n?function(e,r,u){e.__transition__[t].duration=Math.max(1,n.call(e,e.__data__,r,u))}:(n=Math.max(1,n),function(e){e.__transition__[t].duration=n}))},Ns.each=function(n,t){var e=this.id;if(arguments.length<2){var r=Es,u=ks;ks=e,N(this,function(t,r,u){Es=t.__transition__[e],n.call(t,t.__data__,r,u)}),Es=r,ks=u}else N(this,function(r){var u=r.__transition__[e];(u.event||(u.event=Bo.dispatch("start","end"))).on(n,t)});return this},Ns.transition=function(){for(var n,t,e,r,u=this.id,i=++Ls,o=[],a=0,c=this.length;c>a;a++){o.push(n=[]);for(var t=this[a],s=0,l=t.length;l>s;s++)(e=t[s])&&(r=Object.create(e.__transition__[u]),r.delay+=r.duration,io(e,s,i,r)),n.push(e)}return eo(o,i)},Bo.svg.axis=function(){function n(n){n.each(function(){var n,s=Bo.select(this),l=this.__chart__||e,f=this.__chart__=e.copy(),h=null==c?f.ticks?f.ticks.apply(f,a):f.domain():c,g=null==t?f.tickFormat?f.tickFormat.apply(f,a):dt:t,p=s.selectAll(".tick").data(h,f),v=p.enter().insert("g",".domain").attr("class","tick").style("opacity",Na),d=Bo.transition(p.exit()).style("opacity",Na).remove(),m=Bo.transition(p).style("opacity",1),y=ei(f),x=s.selectAll(".domain").data([0]),M=(x.enter().append("path").attr("class","domain"),Bo.transition(x));v.append("line"),v.append("text");var _=v.select("line"),b=m.select("line"),w=p.select("text").text(g),S=v.select("text"),k=m.select("text");switch(r){case"bottom":n=oo,_.attr("y2",u),S.attr("y",Math.max(u,0)+o),b.attr("x2",0).attr("y2",u),k.attr("x",0).attr("y",Math.max(u,0)+o),w.attr("dy",".71em").style("text-anchor","middle"),M.attr("d","M"+y[0]+","+i+"V0H"+y[1]+"V"+i);break;case"top":n=oo,_.attr("y2",-u),S.attr("y",-(Math.max(u,0)+o)),b.attr("x2",0).attr("y2",-u),k.attr("x",0).attr("y",-(Math.max(u,0)+o)),w.attr("dy","0em").style("text-anchor","middle"),M.attr("d","M"+y[0]+","+-i+"V0H"+y[1]+"V"+-i);break;case"left":n=ao,_.attr("x2",-u),S.attr("x",-(Math.max(u,0)+o)),b.attr("x2",-u).attr("y2",0),k.attr("x",-(Math.max(u,0)+o)).attr("y",0),w.attr("dy",".32em").style("text-anchor","end"),M.attr("d","M"+-i+","+y[0]+"H0V"+y[1]+"H"+-i);break;case"right":n=ao,_.attr("x2",u),S.attr("x",Math.max(u,0)+o),b.attr("x2",u).attr("y2",0),k.attr("x",Math.max(u,0)+o).attr("y",0),w.attr("dy",".32em").style("text-anchor","start"),M.attr("d","M"+i+","+y[0]+"H0V"+y[1]+"H"+i)}if(f.rangeBand){var E=f,A=E.rangeBand()/2;l=f=function(n){return E(n)+A}}else l.rangeBand?l=f:d.call(n,f);v.call(n,l),m.call(n,f)})}var t,e=Bo.scale.linear(),r=Ts,u=6,i=6,o=3,a=[10],c=null;return n.scale=function(t){return arguments.length?(e=t,n):e},n.orient=function(t){return arguments.length?(r=t in qs?t+"":Ts,n):r},n.ticks=function(){return arguments.length?(a=arguments,n):a},n.tickValues=function(t){return arguments.length?(c=t,n):c},n.tickFormat=function(e){return arguments.length?(t=e,n):t},n.tickSize=function(t){var e=arguments.length;return e?(u=+t,i=+arguments[e-1],n):u},n.innerTickSize=function(t){return arguments.length?(u=+t,n):u},n.outerTickSize=function(t){return arguments.length?(i=+t,n):i},n.tickPadding=function(t){return arguments.length?(o=+t,n):o},n.tickSubdivide=function(){return arguments.length&&n},n};var Ts="bottom",qs={top:1,right:1,bottom:1,left:1};Bo.svg.brush=function(){function n(i){i.each(function(){var i=Bo.select(this).style("pointer-events","all").style("-webkit-tap-highlight-color","rgba(0,0,0,0)").on("mousedown.brush",u).on("touchstart.brush",u),o=i.selectAll(".background").data([0]);o.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),i.selectAll(".extent").data([0]).enter().append("rect").attr("class","extent").style("cursor","move");var a=i.selectAll(".resize").data(d,dt);a.exit().remove(),a.enter().append("g").attr("class",function(n){return"resize "+n}).style("cursor",function(n){return zs[n]}).append("rect").attr("x",function(n){return/[ew]$/.test(n)?-3:null}).attr("y",function(n){return/^[ns]/.test(n)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),a.style("display",n.empty()?"none":null);var l,f=Bo.transition(i),h=Bo.transition(o);c&&(l=ei(c),h.attr("x",l[0]).attr("width",l[1]-l[0]),e(f)),s&&(l=ei(s),h.attr("y",l[0]).attr("height",l[1]-l[0]),r(f)),t(f)})}function t(n){n.selectAll(".resize").attr("transform",function(n){return"translate("+l[+/e$/.test(n)]+","+h[+/^s/.test(n)]+")"})}function e(n){n.select(".extent").attr("x",l[0]),n.selectAll(".extent,.n>rect,.s>rect").attr("width",l[1]-l[0])}function r(n){n.select(".extent").attr("y",h[0]),n.selectAll(".extent,.e>rect,.w>rect").attr("height",h[1]-h[0])}function u(){function u(){32==Bo.event.keyCode&&(C||(x=null,L[0]-=l[1],L[1]-=h[1],C=2),f())}function g(){32==Bo.event.keyCode&&2==C&&(L[0]+=l[1],L[1]+=h[1],C=0,f())}function d(){var n=Bo.mouse(_),u=!1;M&&(n[0]+=M[0],n[1]+=M[1]),C||(Bo.event.altKey?(x||(x=[(l[0]+l[1])/2,(h[0]+h[1])/2]),L[0]=l[+(n[0]<x[0])],L[1]=h[+(n[1]<x[1])]):x=null),E&&m(n,c,0)&&(e(S),u=!0),A&&m(n,s,1)&&(r(S),u=!0),u&&(t(S),w({type:"brush",mode:C?"move":"resize"}))}function m(n,t,e){var r,u,a=ei(t),c=a[0],s=a[1],f=L[e],g=e?h:l,d=g[1]-g[0];return C&&(c-=f,s-=d+f),r=(e?v:p)?Math.max(c,Math.min(s,n[e])):n[e],C?u=(r+=f)+d:(x&&(f=Math.max(c,Math.min(s,2*x[e]-r))),r>f?(u=r,r=f):u=f),g[0]!=r||g[1]!=u?(e?o=null:i=null,g[0]=r,g[1]=u,!0):void 0}function y(){d(),S.style("pointer-events","all").selectAll(".resize").style("display",n.empty()?"none":null),Bo.select("body").style("cursor",null),T.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),N(),w({type:"brushend"})}var x,M,_=this,b=Bo.select(Bo.event.target),w=a.of(_,arguments),S=Bo.select(_),k=b.datum(),E=!/^(n|s)$/.test(k)&&c,A=!/^(e|w)$/.test(k)&&s,C=b.classed("extent"),N=P(),L=Bo.mouse(_),T=Bo.select(Qo).on("keydown.brush",u).on("keyup.brush",g);if(Bo.event.changedTouches?T.on("touchmove.brush",d).on("touchend.brush",y):T.on("mousemove.brush",d).on("mouseup.brush",y),S.interrupt().selectAll("*").interrupt(),C)L[0]=l[0]-L[0],L[1]=h[0]-L[1];else if(k){var q=+/w$/.test(k),z=+/^n/.test(k);M=[l[1-q]-L[0],h[1-z]-L[1]],L[0]=l[q],L[1]=h[z]}else Bo.event.altKey&&(x=L.slice());S.style("pointer-events","none").selectAll(".resize").style("display",null),Bo.select("body").style("cursor",b.style("cursor")),w({type:"brushstart"}),d()}var i,o,a=g(n,"brushstart","brush","brushend"),c=null,s=null,l=[0,0],h=[0,0],p=!0,v=!0,d=Rs[0];return n.event=function(n){n.each(function(){var n=a.of(this,arguments),t={x:l,y:h,i:i,j:o},e=this.__chart__||t;this.__chart__=t,ks?Bo.select(this).transition().each("start.brush",function(){i=e.i,o=e.j,l=e.x,h=e.y,n({type:"brushstart"})}).tween("brush:brush",function(){var e=Rr(l,t.x),r=Rr(h,t.y);return i=o=null,function(u){l=t.x=e(u),h=t.y=r(u),n({type:"brush",mode:"resize"})}}).each("end.brush",function(){i=t.i,o=t.j,n({type:"brush",mode:"resize"}),n({type:"brushend"})}):(n({type:"brushstart"}),n({type:"brush",mode:"resize"}),n({type:"brushend"}))})},n.x=function(t){return arguments.length?(c=t,d=Rs[!c<<1|!s],n):c},n.y=function(t){return arguments.length?(s=t,d=Rs[!c<<1|!s],n):s},n.clamp=function(t){return arguments.length?(c&&s?(p=!!t[0],v=!!t[1]):c?p=!!t:s&&(v=!!t),n):c&&s?[p,v]:c?p:s?v:null},n.extent=function(t){var e,r,u,a,f;return arguments.length?(c&&(e=t[0],r=t[1],s&&(e=e[0],r=r[0]),i=[e,r],c.invert&&(e=c(e),r=c(r)),e>r&&(f=e,e=r,r=f),(e!=l[0]||r!=l[1])&&(l=[e,r])),s&&(u=t[0],a=t[1],c&&(u=u[1],a=a[1]),o=[u,a],s.invert&&(u=s(u),a=s(a)),u>a&&(f=u,u=a,a=f),(u!=h[0]||a!=h[1])&&(h=[u,a])),n):(c&&(i?(e=i[0],r=i[1]):(e=l[0],r=l[1],c.invert&&(e=c.invert(e),r=c.invert(r)),e>r&&(f=e,e=r,r=f))),s&&(o?(u=o[0],a=o[1]):(u=h[0],a=h[1],s.invert&&(u=s.invert(u),a=s.invert(a)),u>a&&(f=u,u=a,a=f))),c&&s?[[e,u],[r,a]]:c?[e,r]:s&&[u,a])},n.clear=function(){return n.empty()||(l=[0,0],h=[0,0],i=o=null),n},n.empty=function(){return!!c&&l[0]==l[1]||!!s&&h[0]==h[1]},Bo.rebind(n,a,"on")};var zs={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},Rs=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]],Ds=Bo.time={},Ps=Date,Us=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];co.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){js.setUTCDate.apply(this._,arguments)},setDay:function(){js.setUTCDay.apply(this._,arguments)},setFullYear:function(){js.setUTCFullYear.apply(this._,arguments)},setHours:function(){js.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){js.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){js.setUTCMinutes.apply(this._,arguments)},setMonth:function(){js.setUTCMonth.apply(this._,arguments)},setSeconds:function(){js.setUTCSeconds.apply(this._,arguments)},setTime:function(){js.setTime.apply(this._,arguments)}};var js=Date.prototype,Hs="%a %b %e %X %Y",Fs="%m/%d/%Y",Os="%H:%M:%S",Ys=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Is=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],Zs=["January","February","March","April","May","June","July","August","September","October","November","December"],Vs=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];Ds.year=so(function(n){return n=Ds.day(n),n.setMonth(0,1),n},function(n,t){n.setFullYear(n.getFullYear()+t)},function(n){return n.getFullYear()}),Ds.years=Ds.year.range,Ds.years.utc=Ds.year.utc.range,Ds.day=so(function(n){var t=new Ps(2e3,0);return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t},function(n,t){n.setDate(n.getDate()+t)},function(n){return n.getDate()-1}),Ds.days=Ds.day.range,Ds.days.utc=Ds.day.utc.range,Ds.dayOfYear=function(n){var t=Ds.year(n);return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)},Us.forEach(function(n,t){n=n.toLowerCase(),t=7-t;var e=Ds[n]=so(function(n){return(n=Ds.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n},function(n,t){n.setDate(n.getDate()+7*Math.floor(t))},function(n){var e=Ds.year(n).getDay();return Math.floor((Ds.dayOfYear(n)+(e+t)%7)/7)-(e!==t)});Ds[n+"s"]=e.range,Ds[n+"s"].utc=e.utc.range,Ds[n+"OfYear"]=function(n){var e=Ds.year(n).getDay();return Math.floor((Ds.dayOfYear(n)+(e+t)%7)/7)}}),Ds.week=Ds.sunday,Ds.weeks=Ds.sunday.range,Ds.weeks.utc=Ds.sunday.utc.range,Ds.weekOfYear=Ds.sundayOfYear,Ds.format=fo;var Xs=go(Ys),$s=po(Ys),Bs=go(Is),Ws=po(Is),Js=go(Zs),Gs=po(Zs),Ks=go(Vs),Qs=po(Vs),nl=/^%/,tl={"-":"",_:" ",0:"0"},el={a:function(n){return Is[n.getDay()]},A:function(n){return Ys[n.getDay()]},b:function(n){return Vs[n.getMonth()]},B:function(n){return Zs[n.getMonth()]},c:fo(Hs),d:function(n,t){return vo(n.getDate(),t,2)},e:function(n,t){return vo(n.getDate(),t,2)},H:function(n,t){return vo(n.getHours(),t,2)},I:function(n,t){return vo(n.getHours()%12||12,t,2)},j:function(n,t){return vo(1+Ds.dayOfYear(n),t,3)},L:function(n,t){return vo(n.getMilliseconds(),t,3)},m:function(n,t){return vo(n.getMonth()+1,t,2)},M:function(n,t){return vo(n.getMinutes(),t,2)},p:function(n){return n.getHours()>=12?"PM":"AM"},S:function(n,t){return vo(n.getSeconds(),t,2)},U:function(n,t){return vo(Ds.sundayOfYear(n),t,2)},w:function(n){return n.getDay()},W:function(n,t){return vo(Ds.mondayOfYear(n),t,2)},x:fo(Fs),X:fo(Os),y:function(n,t){return vo(n.getFullYear()%100,t,2)},Y:function(n,t){return vo(n.getFullYear()%1e4,t,4)},Z:Ho,"%":function(){return"%"}},rl={a:mo,A:yo,b:bo,B:wo,c:So,d:qo,e:qo,H:Ro,I:Ro,j:zo,L:Uo,m:To,M:Do,p:jo,S:Po,U:Mo,w:xo,W:_o,x:ko,X:Eo,y:Co,Y:Ao,Z:No,"%":Fo},ul=/^\s*\d+/,il=Bo.map({am:0,pm:1});fo.utc=Oo;var ol=Oo("%Y-%m-%dT%H:%M:%S.%LZ");fo.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?Yo:ol,Yo.parse=function(n){var t=new Date(n);return isNaN(t)?null:t},Yo.toString=ol.toString,Ds.second=so(function(n){return new Ps(1e3*Math.floor(n/1e3))},function(n,t){n.setTime(n.getTime()+1e3*Math.floor(t))},function(n){return n.getSeconds()}),Ds.seconds=Ds.second.range,Ds.seconds.utc=Ds.second.utc.range,Ds.minute=so(function(n){return new Ps(6e4*Math.floor(n/6e4))},function(n,t){n.setTime(n.getTime()+6e4*Math.floor(t))},function(n){return n.getMinutes()}),Ds.minutes=Ds.minute.range,Ds.minutes.utc=Ds.minute.utc.range,Ds.hour=so(function(n){var t=n.getTimezoneOffset()/60;return new Ps(36e5*(Math.floor(n/36e5-t)+t))},function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))},function(n){return n.getHours()}),Ds.hours=Ds.hour.range,Ds.hours.utc=Ds.hour.utc.range,Ds.month=so(function(n){return n=Ds.day(n),n.setDate(1),n},function(n,t){n.setMonth(n.getMonth()+t)},function(n){return n.getMonth()}),Ds.months=Ds.month.range,Ds.months.utc=Ds.month.utc.range;var al=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],cl=[[Ds.second,1],[Ds.second,5],[Ds.second,15],[Ds.second,30],[Ds.minute,1],[Ds.minute,5],[Ds.minute,15],[Ds.minute,30],[Ds.hour,1],[Ds.hour,3],[Ds.hour,6],[Ds.hour,12],[Ds.day,1],[Ds.day,2],[Ds.week,1],[Ds.month,1],[Ds.month,3],[Ds.year,1]],sl=[[fo("%Y"),Vt],[fo("%B"),function(n){return n.getMonth()}],[fo("%b %d"),function(n){return 1!=n.getDate()}],[fo("%a %d"),function(n){return n.getDay()&&1!=n.getDate()}],[fo("%I %p"),function(n){return n.getHours()}],[fo("%I:%M"),function(n){return n.getMinutes()}],[fo(":%S"),function(n){return n.getSeconds()}],[fo(".%L"),function(n){return n.getMilliseconds()}]],ll=Vo(sl);cl.year=Ds.year,Ds.scale=function(){return Io(Bo.scale.linear(),cl,ll)};var fl={range:function(n,t,e){return Bo.range(+n,+t,e).map(Zo)},floor:dt,ceil:dt},hl=cl.map(function(n){return[n[0].utc,n[1]]}),gl=[[Oo("%Y"),Vt],[Oo("%B"),function(n){return n.getUTCMonth()}],[Oo("%b %d"),function(n){return 1!=n.getUTCDate()}],[Oo("%a %d"),function(n){return n.getUTCDay()&&1!=n.getUTCDate()}],[Oo("%I %p"),function(n){return n.getUTCHours()}],[Oo("%I:%M"),function(n){return n.getUTCMinutes()}],[Oo(":%S"),function(n){return n.getUTCSeconds()}],[Oo(".%L"),function(n){return n.getUTCMilliseconds()}]],pl=Vo(gl);return hl.year=Ds.year.utc,Ds.scale.utc=function(){return Io(Bo.scale.linear(),hl,pl)},Bo.text=mt(function(n){return n.responseText}),Bo.json=function(n,t){return yt(n,"application/json",Xo,t)},Bo.html=function(n,t){return yt(n,"text/html",$o,t)},Bo.xml=mt(function(n){return n.responseXML}),Bo}();;// A standalone CommonJS loader.
(function(root) {
  /**
   * Require the given path.
   *
   * @param {String} path
   * @return {Object} exports
   * @api public
   */
  var require = function(path, parent, orig) {
    var resolved = require.resolve(path);

    // lookup failed
    if (!resolved) {
      orig = orig || path;
      parent = parent || 'root';
      var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
      err.path = orig;
      err.parent = parent;
      err.require = true;
      throw err;
    }

    var module = require.modules[resolved];

    // perform real require()
    // by invoking the module's
    // registered function
    if (!module._resolving && !module.exports) {
      var mod = {};
      mod.exports = {};
      mod.client = mod.component = true;
      module._resolving = true;
      module.call(this, mod.exports, require.relative(resolved), mod);
      delete module._resolving;
      module.exports = mod.exports;
    }

    return module.exports;
  };

  /**
   * Registered modules.
   */

  require.modules = {};

  /**
   * Registered aliases.
   */

  require.aliases = {};

  /**
   * Resolve `path`.
   *
   * Lookup:
   *
   *   - PATH/index.js
   *   - PATH.js
   *   - PATH
   *
   * @param {String} path
   * @return {String} path or null
   * @api private
   */

  require.resolve = function(path) {
    if (path.charAt(0) === '/') path = path.slice(1);

    var paths = [
      path,
      path + '.js',
      path + '.json',
      path + '/index.js',
      path + '/index.json'
    ];

    for (var i = 0; i < paths.length; i++) {
      path = paths[i];
      if (require.modules.hasOwnProperty(path)) return path;
      if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
    }
  };

  /**
   * Normalize `path` relative to the current path.
   *
   * @param {String} curr
   * @param {String} path
   * @return {String}
   * @api private
   */

  require.normalize = function(curr, path) {
    var segs = [];

    if ('.' != path.charAt(0)) return path;

    curr = curr.split('/');
    path = path.split('/');

    for (var i = 0; i < path.length; ++i) {
      if ('..' == path[i]) {
        curr.pop();
      } else if ('.' !== path[i] && '' !== path[i]) {
        segs.push(path[i]);
      }
    }

    return curr.concat(segs).join('/');
  };

  /**
   * Register module at `path` with callback `definition`.
   *
   * @param {String} path
   * @param {Function} definition
   * @api private
   */

  require.register = function(path, definition) {
    require.modules[path] = definition;
  };

  /**
   * Alias a module definition.
   *
   * @param {String} from
   * @param {String} to
   * @api private
   */

  require.alias = function(from, to) {
    if (!require.modules.hasOwnProperty(from)) {
      throw new Error('Failed to alias "' + from + '", it does not exist');
    }
    require.aliases[to] = from;
  };

  /**
   * Return a require function relative to the `parent` path.
   *
   * @param {String} parent
   * @return {Function}
   * @api private
   */

  require.relative = function(parent) {
    var p = require.normalize(parent, '..');

    /**
     * lastIndexOf helper.
     */

    function lastIndexOf(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) return i;
      }
      return -1;
    }

    /**
     * The relative require() itself.
     */

    var localRequire = function(path) {
      var resolved = localRequire.resolve(path);
      return require(resolved, parent, path);
    };

    /**
     * Resolve relative to the parent.
     */

    localRequire.resolve = function(path) {
      var c = path.charAt(0);
      if ('/' == c) return path.slice(1);
      if ('.' == c) return require.normalize(p, path);

      // resolve deps by returning
      // the dep in the nearest "deps"
      // directory
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    };

    /**
     * Check if module is defined at `path`.
     */
    localRequire.exists = function(path) {
      return require.modules.hasOwnProperty(localRequire.resolve(path));
    };

    return localRequire;
  };

  // Do we already have require loader?
  root.require = (typeof root.require !== 'undefined') ? root.require : require;

})(this);
// Concat modules and export them as an app.
(function(root) {

  // All our modules will use global require.
  (function() {
    
    
    // main.js
    root.require.register('MultiMine/src/main.js', function(exports, require, module) {
    
      var AppView = require('./views/appview');
      
      var $ = require('./modules/dependencies').$;
      
      module.exports = function(params) {
      
      	var view = new AppView(params);
      	//if ($(params.target).length != 1) throw "Not found";
      	// console.log(params.input);
      	view.setElement($(params.target));
      	view.render();
      
      }
    });

    
    // FilterListCollection.coffee
    root.require.register('MultiMine/src/models/FilterListCollection.js', function(exports, require, module) {
    
      var FilterListCollection, FilterListItem, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      FilterListItem = require('./FilterListItem');
      
      FilterListCollection = (function(_super) {
        __extends(FilterListCollection, _super);
      
        function FilterListCollection() {
          _ref = FilterListCollection.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterListCollection.prototype.model = FilterListItem;
      
        FilterListCollection.prototype.initialize = function() {
          return console.log("FilterListCollection has been created.");
        };
      
        FilterListCollection.prototype.comparator = function(item) {
          return -item.get("count");
        };
      
        FilterListCollection.prototype.toggleAll = function(value) {
          console.log("FilterListemCollection.toggleAll called with", value);
          _.each(this.models, function(model) {
            return model.set({
              enabled: value
            });
          });
          return console.log("models now", this.models);
        };
      
        return FilterListCollection;
      
      })(Backbone.Collection);
      
      module.exports = FilterListCollection;
      
    });

    
    // FilterListItem.coffee
    root.require.register('MultiMine/src/models/FilterListItem.js', function(exports, require, module) {
    
      var FilterListItem, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterListItem = (function(_super) {
        var unCamelCase;
      
        __extends(FilterListItem, _super);
      
        function FilterListItem() {
          _ref = FilterListItem.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterListItem.prototype.defaults = {
          name: "generic",
          type: "not specified",
          enabled: true,
          count: 0,
          displayName: "tbd"
        };
      
        FilterListItem.prototype.initialize = function() {
          mediator.on('filter:togglecategory', this.get("enabled"));
          return this.set({
            displayName: unCamelCase(this.get("name"))
          });
        };
      
        unCamelCase = function(str) {
          return str.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3").replace(/^./, function(str) {
            return str.toUpperCase();
          });
        };
      
        FilterListItem.prototype.toggle = function() {
          if (this.get("enabled") === false) {
            this.set({
              enabled: true
            });
          } else {
            this.set({
              enabled: false
            });
          }
          return this.get("enabled");
        };
      
        return FilterListItem;
      
      })(Backbone.Model);
      
      module.exports = FilterListItem;
      
    });

    
    // OrganismCollection.coffee
    root.require.register('MultiMine/src/models/OrganismCollection.js', function(exports, require, module) {
    
      var OrganismCollection, OrganismItem, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      OrganismItem = require('./OrganismItem');
      
      OrganismCollection = (function(_super) {
        __extends(OrganismCollection, _super);
      
        function OrganismCollection() {
          _ref = OrganismCollection.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        OrganismCollection.prototype.model = OrganismItem;
      
        OrganismCollection.prototype.initialize = function() {};
      
        OrganismCollection.prototype.comparator = function(item) {
          return item.get("genus");
        };
      
        OrganismCollection.prototype.toggleAll = function(value) {
          return _.each(this.models, function(model) {
            return model.set({
              enabled: value
            });
          });
        };
      
        return OrganismCollection;
      
      })(Backbone.Collection);
      
      module.exports = OrganismCollection;
      
    });

    
    // OrganismItem.coffee
    root.require.register('MultiMine/src/models/OrganismItem.js', function(exports, require, module) {
    
      var OrganismItem, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      OrganismItem = (function(_super) {
        __extends(OrganismItem, _super);
      
        function OrganismItem() {
          _ref = OrganismItem.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        OrganismItem.prototype.defaults = {
          type: "not specified",
          enabled: true,
          count: 0,
          "class": "not specified",
          genus: "not specified",
          name: "not specified",
          species: "not specified",
          taxonId: "not specified"
        };
      
        OrganismItem.prototype.initialize = function() {
          return mediator.on('filter:togglecategory', this.get("enabled"));
        };
      
        OrganismItem.prototype.toggle = function() {
          if (this.get("enabled") === false) {
            this.set({
              enabled: true
            });
          } else {
            this.set({
              enabled: false
            });
          }
          return this.get("enabled");
        };
      
        return OrganismItem;
      
      })(Backbone.Model);
      
      module.exports = OrganismItem;
      
    });

    
    // ResultModel.coffee
    root.require.register('MultiMine/src/models/ResultModel.js', function(exports, require, module) {
    
      var ResultModel, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      ResultModel = (function(_super) {
        __extends(ResultModel, _super);
      
        function ResultModel() {
          this.toggleVisible = __bind(this.toggleVisible, this);
          this.filter = __bind(this.filter, this);
          _ref = ResultModel.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultModel.prototype.defaults = {
          id: 0,
          mineUrl: "",
          relevance: 0,
          type: "Generic",
          show: true
        };
      
        ResultModel.prototype.initialize = function() {
          var fields;
          fields = this.get("fields");
          if (this.get("relevance") > 1.0) {
            this.set({
              relevance: 1
            });
          }
          return mediator.on('filter:show', this.filter);
        };
      
        ResultModel.prototype.filter = function() {
          return this.toggleVisible();
        };
      
        ResultModel.prototype.toggleVisible = function() {
          return this.set({
            show: !this.get("show")
          });
        };
      
        return ResultModel;
      
      })(Backbone.Model);
      
      module.exports = ResultModel;
      
    });

    
    // ResultTypeCategory.coffee
    root.require.register('MultiMine/src/models/ResultTypeCategory.js', function(exports, require, module) {
    
      var ResultTypeCategory, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      ResultTypeCategory = (function(_super) {
        __extends(ResultTypeCategory, _super);
      
        function ResultTypeCategory() {
          _ref = ResultTypeCategory.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultTypeCategory.prototype.defaults = {
          name: "generic",
          type: "not specified",
          enabled: true,
          count: 0
        };
      
        ResultTypeCategory.prototype.initialize = function() {
          return mediator.on('filter:togglecategory', this.get("enabled"));
        };
      
        ResultTypeCategory.prototype.toggle = function() {
          if (this.get("enabled") === false) {
            this.set({
              enabled: true
            });
          } else {
            this.set({
              enabled: false
            });
          }
          return this.get("enabled");
        };
      
        return ResultTypeCategory;
      
      })(Backbone.Model);
      
      module.exports = ResultTypeCategory;
      
    });

    
    // ResultTypeCollection.coffee
    root.require.register('MultiMine/src/models/ResultTypeCollection.js', function(exports, require, module) {
    
      var ResultTypeCategory, ResultTypeCollection, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      ResultTypeCategory = require('./ResultTypeCategory');
      
      ResultTypeCollection = (function(_super) {
        __extends(ResultTypeCollection, _super);
      
        function ResultTypeCollection() {
          _ref = ResultTypeCollection.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultTypeCollection.prototype.model = ResultTypeCategory;
      
        ResultTypeCollection.prototype.initialize = function() {
          return this.collection.on("add", this.render, this);
        };
      
        ResultTypeCollection.prototype.render = function() {
          var $el, self;
          $el = $(this.el);
          self = this;
          return this.collection.each(function(item) {
            var filter;
            filter = new ResultTypeCategoryView({
              model: item
            });
            return $el.append(filter.render().el);
          });
        };
      
        return ResultTypeCollection;
      
      })(Backbone.Collection);
      
      module.exports = ResultTypeCollection;
      
    });

    
    // ResultsCollection.coffee
    root.require.register('MultiMine/src/models/ResultsCollection.js', function(exports, require, module) {
    
      var ResultModel, ResultsCollection, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
        __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
      
      mediator = require("../modules/mediator");
      
      ResultModel = require('./ResultModel');
      
      ResultsCollection = (function(_super) {
        __extends(ResultsCollection, _super);
      
        function ResultsCollection() {
          _ref = ResultsCollection.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultsCollection.prototype.model = ResultModel;
      
        ResultsCollection.prototype.globalFilter = {};
      
        ResultsCollection.prototype.initialize = function() {
          mediator.on("filter:removeGenus", this.filterRemoveGenus, this);
          mediator.on("filter:removeAllGenus", this.filterRemoveAllGenus, this);
          mediator.on("filter:addGenus", this.filterAddGenus, this);
          mediator.on("filter:removeType", this.filterRemoveType, this);
          mediator.on("filter:removeAllTypes", this.filterRemoveAllTypes, this);
          mediator.on("filter:addType", this.filterAddType, this);
          mediator.on("filter:addAllTypes", this.filterAddAllTypes, this);
          return mediator.on("filter:addAllGenus", this.filterAddAllGenus, this);
        };
      
        ResultsCollection.prototype.comparator = function(mod) {
          return -mod.get("relevance");
        };
      
        ResultsCollection.prototype.filterRemoveGenus = function(keypair) {
          delete this.globalFilter.genus[keypair.genus];
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterRemoveAllGenus = function() {
          var prop;
          for (prop in this.globalFilter.genus) {
            delete this.globalFilter.genus[prop];
          }
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterAddAllTypes = function(value) {
          var key, typeModels;
          typeModels = _.groupBy(this.models, function(item) {
            return item.get("type");
          });
          for (key in typeModels) {
            this.globalFilter.type.push(key);
          }
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterRemoveAllTypes = function(value) {
          this.globalFilter.type = [];
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterAddType = function(value) {
          this.globalFilter.type.push(value);
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterRemoveType = function(value) {
          this.globalFilter.type = _.without(this.globalFilter.type, value);
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterAddGenus = function(keypair) {
          var genusModels, model, taxonids, _i, _len, _ref1;
          console.log("filterAddGenus called", keypair.genus);
          taxonids = [];
          genusModels = _.groupBy(this.models, function(item) {
            return item.get("genus");
          });
          _ref1 = genusModels[keypair.genus];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            model = _ref1[_i];
            taxonids.push(model.get("taxonId"));
          }
          this.globalFilter.genus[keypair.genus] = _.uniq(taxonids);
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterAddAllGenus = function(keypair) {
          var eachGenus, genusModels, model, taxonids, _i, _len, _ref1;
          genusModels = _.groupBy(this.models, function(item) {
            return item.get("genus");
          });
          console.log("genusModels", genusModels);
          for (eachGenus in genusModels) {
            taxonids = [];
            _ref1 = genusModels[eachGenus];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              model = _ref1[_i];
              taxonids.push(model.get("taxonId"));
            }
            this.globalFilter.genus[eachGenus] = _.uniq(taxonids);
          }
          return this.filterTest();
        };
      
        ResultsCollection.prototype.buildFilter = function(filterObj) {
          var genusGroups, genusObj, nextgenus, obj, prop, taxonids, types;
          obj = {};
          types = _.countBy(this.models, function(model) {
            return model.get("type");
          });
          genusGroups = _.groupBy(this.models, function(item) {
            return item.get("genus");
          });
          this.globalFilter.genus = {};
          for (nextgenus in genusGroups) {
            if (nextgenus !== "undefined") {
              taxonids = _.map(genusGroups[nextgenus], function(model) {
                return model.get("taxonId");
              });
              genusObj = {};
              genusObj[nextgenus] = taxonids;
              this.globalFilter.genus[nextgenus] = _.uniq(taxonids);
            }
          }
          return this.globalFilter.type = (function() {
            var _results;
            _results = [];
            for (prop in types) {
              _results.push(prop);
            }
            return _results;
          })();
        };
      
        ResultsCollection.prototype.filterTest = function() {
          var filtered,
            _this = this;
          console.log("filterTest called with object: ", this.globalFilter);
          filtered = this.models.filter(function(model) {
            var _ref1;
            if (_ref1 = model.get("type"), __indexOf.call(_this.globalFilter.type, _ref1) < 0) {
              model.set({
                enabled: false
              });
              return false;
            }
            if ((model.get("genus")) === void 0) {
              model.set({
                enabled: true
              });
              return true;
            }
            if ((model.get("genus")) in _this.globalFilter.genus) {
              model.set({
                enabled: true
              });
              return true;
            } else {
              model.set({
                enabled: false
              });
              return false;
            }
          });
          console.log("filtered", filtered);
          return filtered;
        };
      
        ResultsCollection.prototype.filter = function(filterObj) {
          var filtered;
          console.log("filter called with object: ", filterObj);
          filtered = this.models.filter(function(model) {
            var key, value, _ref1;
            console.log("filtering using", filterObj);
            for (key in filterObj) {
              value = filterObj[key];
              if (_ref1 = model.get(key), __indexOf.call(value, _ref1) < 0) {
                return false;
              }
            }
            return true;
          });
          return filtered;
        };
      
        ResultsCollection.prototype.byType = function(name) {
          var filtered;
          filtered = this.filter(function(model) {
            return model.get("type") !== name;
          });
          return _.each(filtered, function(model) {});
        };
      
        ResultsCollection.prototype.filterType = function(typevalues, organismvalues) {
          var results, that;
          that = this;
          results = this.models.filter(function(model) {
            var fields, org, _ref1, _ref2, _ref3;
            fields = model.get("fields");
            org = model.get("taxonId");
            if (organismvalues.length > 0 && typevalues.length < 1) {
      
            } else if (organismvalues.length < 1 && typevalues.length > 0) {
              return _ref1 = model.get("type"), __indexOf.call(typevalues, _ref1) >= 0;
            } else if (organismvalues.length > 0 && typevalues.length > 0) {
              if (org === void 0) {
                return _ref2 = model.get("type"), __indexOf.call(typevalues, _ref2) >= 0;
              } else {
                return __indexOf.call(organismvalues, org) >= 0 && (_ref3 = model.get("type"), __indexOf.call(typevalues, _ref3) >= 0);
              }
            }
          });
          return results;
        };
      
        return ResultsCollection;
      
      })(Backbone.Collection);
      
      module.exports = ResultsCollection;
      
    });

    
    // MyHelper.coffee
    root.require.register('MultiMine/src/modules/MyHelper.js', function(exports, require, module) {
    
      var MyHelper, mediator,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
      
      mediator = require("./mediator");
      
      MyHelper = (function() {
        function MyHelper() {
          this.quickSearchEverything = __bind(this.quickSearchEverything, this);
          this.totalResults = {
            facets: {
              Category: {},
              organisms: {}
            },
            results: []
          };
          this.globalFilter = [];
          this.organismMap = {};
        }
      
        MyHelper.prototype.calcStats = function(responseArray) {
          var key, response, value,
            _this = this;
          return Q((function() {
            var _base, _base1, _i, _len, _ref, _ref1, _results;
            _results = [];
            for (_i = 0, _len = responseArray.length; _i < _len; _i++) {
              response = responseArray[_i];
              _ref = response.facets["organism.shortName"];
              for (key in _ref) {
                value = _ref[key];
                if ((_base = this.totalResults.facets.organisms)[key] == null) {
                  _base[key] = 0;
                }
                this.totalResults.facets.organisms[key] += value;
              }
              _ref1 = response.facets.Category;
              for (key in _ref1) {
                value = _ref1[key];
                if ((_base1 = this.totalResults.facets.Category)[key] == null) {
                  _base1[key] = 0;
                }
                this.totalResults.facets.Category[key] += value;
              }
              _results.push(this.totalResults.results = this.totalResults.results.concat(response.results));
            }
            return _results;
          }).call(this)).then(function(test) {});
        };
      
        MyHelper.prototype.quickSearchEverything = function(term) {
          var friendlyMines, listedMines, mine,
            _this = this;
          listedMines = {
            MouseMine: "www.mousemine.org/mousemine",
            ModMine: "http://intermine.modencode.org/query"
          };
          friendlyMines = [
            {
              name: "MouseMine",
              queryUrl: "www.mousemine.org/mousemine",
              baseUrl: "http://www.mousemine.org/mousemine/"
            }, {
              name: "ModMine",
              queryUrl: "http://intermine.modencode.org/query",
              baseUrl: "http://intermine.modencode.org/release-32/"
            }, {
              name: "FlyMine",
              queryUrl: "http://www.flymine.org/query",
              baseUrl: "http://www.flymine.org/release-38.0/"
            }, {
              name: "ZebraFishMine",
              queryUrl: "http://www.zebrafishmine.org",
              baseUrl: "http://www.zebrafishmine.org/"
            }
          ];
          return Q.all((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = friendlyMines.length; _i < _len; _i++) {
              mine = friendlyMines[_i];
              _results.push(this.runOne(mine.queryUrl, term, mine.name, mine.baseUrl));
            }
            return _results;
          }).call(this)).then(function(finished) {
            return _this.calcStats(finished);
          }).then(function(test) {
            var fields, found, obj, parsedSpecies, res, result, _i, _len, _ref;
            _ref = _this.totalResults.results;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              obj = _ref[_i];
              fields = obj.fields;
              if (fields["organism.name"] !== void 0) {
                found = _.findWhere(_this.organismMap, {
                  name: fields["organism.name"]
                });
                obj.taxonId = found.taxonId;
                obj.genus = found.genus;
                obj.species = found.species;
                obj.organismName = found.name;
                obj.shortName = found.genus.charAt(0) + ". " + found.species;
              } else if (fields["organism.shortName"] !== void 0) {
                res = fields["organism.shortName"].split(" ");
                parsedSpecies = res[1];
                found = _.findWhere(_this.organismMap, {
                  species: parsedSpecies
                });
                obj.taxonId = found.taxonId;
                obj.genus = found.genus;
                obj.species = found.species;
                obj.organismName = found.name;
                obj.shortName = found.genus.charAt(0) + ". " + found.species;
              } else {
      
              }
            }
            return result = {
              results: _this.totalResults,
              organisms: _this.organismMap
            };
          });
        };
      
        MyHelper.prototype.runOne = function(mineUrl, term, mineName, mineBase) {
          var def, service,
            _this = this;
          def = Q.defer();
          service = new intermine.Service({
            root: mineUrl
          });
          service.search(term).then(function(results) {
            _.map(results.results, function(res) {
              res.mineUrl = mineUrl;
              res.mineName = mineName;
              return res.mineBase = mineBase;
            });
            return def.resolve(results);
          });
          return def.promise.then(function(results) {
            var key, organismQuery, orgresults, queryOrganismArray, value, _ref;
            queryOrganismArray = [];
            _ref = results.facets["organism.shortName"];
            for (key in _ref) {
              value = _ref[key];
              queryOrganismArray.push(key);
            }
            if (queryOrganismArray.length > 0) {
              organismQuery = {
                select: ["Organism.name", "Organism.taxonId", "Organism.genus", "Organism.species"],
                where: {
                  "Organism.shortName": queryOrganismArray
                }
              };
              return orgresults = service.records(organismQuery);
            } else {
              return [];
            }
          }).then(function(results) {
            var organism, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = results.length; _i < _len; _i++) {
              organism = results[_i];
              if (organism.taxonId in _this.organismMap) {
      
              } else {
                _results.push(_this.organismMap[organism.taxonId] = organism);
              }
            }
            return _results;
          }).then(function() {
            return def.promise;
          });
        };
      
        MyHelper.prototype.sortData = function(response) {
          var arr, justGenes, totalResults, _i, _len;
          totalResults = [];
          for (_i = 0, _len = response.length; _i < _len; _i++) {
            arr = response[_i];
            totalResults = totalResults.concat(arr.results);
          }
          return justGenes = _.where(totalResults, {
            type: "Gene"
          });
        };
      
        MyHelper.prototype.logFailure = function(message) {};
      
        MyHelper.prototype.calcCategories = function(json) {
          var map, someData;
          map = {};
          someData = [];
          _.each(json.facets.Category, function(values, key, list) {
            var aMap;
            aMap = {};
            aMap.legendLabel = key;
            aMap.magnitude = values;
            return someData.push(aMap);
          });
          return someData;
        };
      
        MyHelper.prototype.calcOrganisms = function(json) {
          var map, someData;
          map = {};
          someData = [];
          _.each(json.facets["organism.shortName"], function(values, key, list) {
            var aMap;
            aMap = {};
            aMap.legendLabel = key;
            aMap.magnitude = values;
            return someData.push(aMap);
          });
          return someData;
        };
      
        MyHelper.prototype.buildChart = function(myvalues) {
          var angle, arc, arcs, canvasHeight, canvasWidth, color, dataSet, h, innerRadius, labelr, outerRadius, pie, r, vis, w;
          angle = function(d) {
            var a;
            a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            if (a > 90) {
              return a - 180;
            } else {
              return a;
            }
          };
          canvasWidth = 600;
          canvasHeight = 300;
          outerRadius = 150;
          innerRadius = 75;
          w = 300;
          h = 300;
          r = Math.min(w, h) / 2;
          labelr = r;
          color = d3.scale.category20();
          dataSet = myvalues;
          vis = d3.select("body").append("svg:svg").data([dataSet]).attr("width", canvasWidth).attr("height", canvasHeight).append("svg:g").attr("transform", "translate(" + 1.5 * outerRadius + "," + 1.5 * outerRadius + ")");
          arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);
          pie = d3.layout.pie().value(function(d) {
            return d.magnitude;
          }).sort(function(d) {
            return null;
          });
          arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
          arcs.append("svg:path").attr("fill", function(d, i) {
            return color(i);
          }).attr("d", arc);
          arcs.append("svg:text").attr("transform", function(d) {
            var c, x, y;
            c = arc.centroid(d);
            x = c[0];
            y = c[1];
            h = Math.sqrt(x * x + y * y);
            return "translate(" + (x / h * labelr) + "," + (y / h * labelr) + ")";
          }).attr("dy", ".35em").attr("text-anchor", function(d) {
            if ((d.endAngle + d.startAngle) / 2 > Math.PI) {
              return "end";
            } else {
              return "start";
            }
          }).text(function(d, i) {
            return dataSet[i].legendLabel;
          });
          return arcs.filter(function(d) {
            return d.endAngle - d.startAngle > .2;
          }).append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle").attr("transform", function(d) {
            d.outerRadius = outerRadius;
            d.innerRadius = outerRadius / 2;
            return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
          }).style("fill", "White").style("font", "bold 12px Arial").text(function(d) {
            return d.data.magnitude;
          });
        };
      
        MyHelper.prototype.callThisFunction = function(d, filter) {
          if (d.toggled === false || d.toggled === void 0) {
            d.toggled = true;
            mediator.trigger("filter:apply", [d.data[0], filter]);
          } else if (d.toggled === true) {
            d.toggled = false;
            mediator.trigger("filter:remove", [d.data[0], filter]);
          }
          return console.log("d.toggled has been set to ", d.toggled);
        };
      
        MyHelper.prototype.buildChartOrganisms = function(myvalues, filter) {
          var angle, arc, arcOver, arcs, canvasHeight, canvasWidth, color, dataSet, h, innerRadius, labelr, outerRadius, pie, r, that, vis, w;
          that = this;
          console.log("that", that);
          angle = function(d) {
            var a;
            a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            if (a > 90) {
              return a - 180;
            } else {
              return a;
            }
          };
          canvasWidth = 100;
          canvasHeight = 100;
          outerRadius = 50;
          innerRadius = 25;
          w = 75;
          h = 75;
          r = Math.min(w, h) / 2;
          labelr = r;
          color = d3.scale.category20();
          dataSet = myvalues;
          arcOver = d3.svg.arc().innerRadius(innerRadius + 30).outerRadius(r + 30);
          arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(r);
          vis = d3.select("#filter").append("svg:svg").data([dataSet]).attr("width", canvasWidth).attr("height", canvasHeight).append("svg:g").attr("transform", "translate(" + 1.5 * outerRadius + "," + 1.5 * outerRadius + ")");
          arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);
          pie = d3.layout.pie().value(function(d) {
            return d[1];
          });
          arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice").on("click", function(d) {
            if (d.toggled === false || d.toggled === void 0) {
              d3.select(this).classed("SOMETHING", true);
              d3.select(this).select("path").transition().duration(200).attr("d", arcOver);
              return that.callThisFunction(d, filter);
            } else if (d.toggled === true) {
              console.log("SHRINKING");
              d3.select(this).select("path").transition().duration(100).attr("d", arc);
              return that.callThisFunction(d, filter);
            }
          }).on("testing", function(d) {
            return d3.select(this).select("path").transition().duration(100).attr("d", arc);
          });
          arcs.append("svg:path").attr("fill", function(d, i) {
            return color(i);
          }).attr("d", arc);
          arcs.append("svg:text").attr("transform", function(d) {
            var c, x, y;
            c = arc.centroid(d);
            x = c[0];
            y = c[1];
            h = Math.sqrt(x * x + y * y);
            return "translate(" + (x / h * labelr) + "," + (y / h * labelr) + ")";
          }).attr("dy", ".35em").attr("text-anchor", function(d) {
            if ((d.endAngle + d.startAngle) / 2 > Math.PI) {
              return "end";
            } else {
              return "start";
            }
          }).style("fill", "White").style("font", "12px Arial").text(function(d, i) {
            return dataSet[i][0];
          });
          return arcs.filter(function(d) {
            return d.endAngle - d.startAngle > .2;
          }).append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle").attr("transform", function(d) {
            d.outerRadius = outerRadius;
            d.innerRadius = outerRadius / 2;
            return "translate(" + arc.centroid(d) + ")rotate(" + 0 + ")";
          }).style("fill", "White").style("font", "bold 12px Arial").text(function(d) {
            return d.data[1];
          });
        };
      
        MyHelper.prototype.buildBarChartNew = function(dataset) {
          var dataset2, h, key, svg, w, xScale, yScale;
          w = 200;
          h = 25;
          dataset2 = dataset;
          xScale = d3.scale.ordinal().domain(d3.range(dataset2.length)).rangeRoundBands([0, w], 0.05);
          yScale = d3.scale.linear().domain([
            0, d3.max(dataset2, function(d) {
              return d[1];
            })
          ]).range([0, h]);
          key = function(d) {
            return d[0];
          };
          svg = d3.select("#datatypechart").append("svg").attr("width", w).attr("height", h);
          return svg.selectAll("rect").data(dataset2).enter().append("rect").attr("x", function(d, i) {
            return xScale(i);
          }).attr("y", function(d) {
            return h - yScale(d[1]);
          }).attr("width", xScale.rangeBand()).attr("height", function(d) {
            return yScale(d[1]);
          }).attr("fill", "grey").on("mouseover", function(d) {
            var xPosition, yPosition;
            xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
            yPosition = parseFloat(d3.select(this).attr("y")) + 14;
            d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(d[1]);
            d3.select("#tooltip").classed("hidden", false);
          }).on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", true);
          });
        };
      
        MyHelper.prototype.buildBarChart = function(dataset, location) {
          var h, key, svg, w, xScale, yScale;
          w = 200;
          h = 25;
          xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([0, w], 0.05);
          yScale = d3.scale.linear().domain([
            0, d3.max(dataset, function(d) {
              return d.value;
            })
          ]).range([0, h]);
          key = function(d) {
            return d.key;
          };
          svg = d3.select(location).html('').append("svg").attr("width", w).attr("height", h);
          return svg.selectAll("rect").data(dataset, key).enter().append("rect").attr("x", function(d, i) {
            return xScale(i);
          }).attr("y", function(d) {
            return h - yScale(d.value);
          }).attr("width", xScale.rangeBand()).attr("height", function(d) {
            return yScale(d.value);
          }).attr("id", function(d) {
            return d.key;
          }).attr("class", function(d) {
            return "mychart";
          }).attr("fill", "grey").on("mouseover", function(d) {
            var xPosition, yPosition;
            xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
            yPosition = parseFloat(d3.select(this).attr("y")) + 14;
            d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(d.value);
            d3.select("#tooltip").classed("hidden", false);
          }).on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", true);
          });
        };
      
        MyHelper.prototype.buildLineChart = function(dataset) {
          var h, key, svg, w, xScale, yScale;
          w = 200;
          h = 25;
          xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([0, w], 0.05);
          yScale = d3.scale.linear().domain([
            0, d3.max(dataset, function(d) {
              return d.value;
            })
          ]).range([0, h]);
          key = function(d) {
            return d.key;
          };
          svg = d3.select("#datatypechart").append("svg").attr("width", w).attr("height", h);
          return svg.selectAll("rect").data(dataset, key).enter().append("rect").attr("x", function(d, i) {
            return xScale(i);
          }).attr("y", function(d) {
            return h - yScale(d.value);
          }).attr("width", xScale.rangeBand()).attr("height", function(d) {
            return yScale(d.value);
          }).attr("fill", "grey").on("mouseover", function(d) {
            var xPosition, yPosition;
            xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
            yPosition = parseFloat(d3.select(this).attr("y")) + 14;
            d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(d.value);
            d3.select("#tooltip").classed("hidden", false);
          }).on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", true);
          });
        };
      
        MyHelper.prototype.buildBarChart2 = function() {
          var dataset, h, key, svg, w, xScale, yScale;
          w = 200;
          h = 25;
          dataset = [
            {
              key: 0,
              value: 5
            }, {
              key: 1,
              value: 10
            }, {
              key: 2,
              value: 13
            }, {
              key: 3,
              value: 19
            }, {
              key: 4,
              value: 21
            }, {
              key: 5,
              value: 25
            }, {
              key: 6,
              value: 22
            }, {
              key: 7,
              value: 18
            }, {
              key: 8,
              value: 15
            }, {
              key: 9,
              value: 13
            }, {
              key: 10,
              value: 11
            }, {
              key: 11,
              value: 12
            }, {
              key: 12,
              value: 15
            }, {
              key: 13,
              value: 20
            }, {
              key: 14,
              value: 18
            }, {
              key: 15,
              value: 17
            }, {
              key: 16,
              value: 16
            }, {
              key: 17,
              value: 18
            }, {
              key: 18,
              value: 23
            }, {
              key: 19,
              value: 25
            }
          ];
          xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([0, w], 0.05);
          yScale = d3.scale.linear().domain([
            0, d3.max(dataset, function(d) {
              return d.value;
            })
          ]).range([0, h]);
          key = function(d) {
            return d.key;
          };
          svg = d3.select("#organismchart").append("svg").attr("width", w).attr("height", h);
          return svg.selectAll("rect").data(dataset, key).enter().append("rect").attr("x", function(d, i) {
            return xScale(i);
          }).attr("y", function(d) {
            return h - yScale(d.value);
          }).attr("width", xScale.rangeBand()).attr("height", function(d) {
            return yScale(d.value);
          }).attr("fill", "grey").on("mouseover", function(d) {
            var xPosition, yPosition;
            xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
            yPosition = parseFloat(d3.select(this).attr("y")) + 14;
            d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(d.value);
            d3.select("#tooltip").classed("hidden", false);
          }).on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", true);
          });
        };
      
        return MyHelper;
      
      })();
      
      module.exports = MyHelper;
      
    });

    
    // dependencies.js
    root.require.register('MultiMine/src/modules/dependencies.js', function(exports, require, module) {
    
      var $;
            
      $ = window.jQuery
            
      module.exports = {
              $: $,
              _: _,
              Backbone: Backbone,
      
      };
    });

    
    // fieldmappings.coffee
    root.require.register('MultiMine/src/modules/fieldmappings.js', function(exports, require, module) {
    
      
      
    });

    
    // globals.js
    root.require.register('MultiMine/src/modules/globals.js', function(exports, require, module) {
    
      var columns = [];
      exports.columns = columns;
    });

    
    // mediator.js
    root.require.register('MultiMine/src/modules/mediator.js', function(exports, require, module) {
    
        var mediator = _.extend({}, Backbone.Events);
        module.exports = mediator;
    });

    
    // FilterGenusOffTemplate.eco
    root.require.register('MultiMine/src/templates/FilterGenusOffTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<div></i>');
          
            __out.push(__sanitize(this.result.genus));
          
            __out.push('<i class="icon-down-circle showall expand"></i></div>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // FilterGenusTemplate.eco
    root.require.register('MultiMine/src/templates/FilterGenusTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<div><i class="icon-ok"></i>');
          
            __out.push(__sanitize(this.result.genus));
          
            __out.push('<i class="icon-down-circle showall expand"></i></div>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // FilterListItemOffTemplate.eco
    root.require.register('MultiMine/src/templates/FilterListItemOffTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push(__sanitize(this.result.name));
          
            __out.push(' (');
          
            __out.push(__sanitize(this.result.count));
          
            __out.push(')');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // FilterListItemTemplate.eco
    root.require.register('MultiMine/src/templates/FilterListItemTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<i class="icon-ok"></i>');
          
            __out.push(__sanitize(this.result.name));
          
            __out.push(' (');
          
            __out.push(__sanitize(this.result.count));
          
            __out.push(')');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // FilterSpeciesTemplate.eco
    root.require.register('MultiMine/src/templates/FilterSpeciesTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<i class="icon-ok"></i>');
          
            __out.push(__sanitize(this.result.species));
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // ResultTypeCategoryTemplate.eco
    root.require.register('MultiMine/src/templates/ResultTypeCategoryTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('Result2: ');
          
            __out.push(__sanitize(this.result.name));
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // apptemplate.eco
    root.require.register('MultiMine/src/templates/apptemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<div id="search-app">\n\t<div id="search-header"></div>\n\t<div id="search-results"></div>\n\t<div id="search-footer"></div>\n</div>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // results.eco
    root.require.register('MultiMine/src/templates/results.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            var result, _i, _len, _ref;
          
            __out.push('<ul>\n\n\t');
          
            console.log("results obj from templte: ", this.results);
          
            __out.push('\n\t');
          
            _ref = this.results;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              result = _ref[_i];
              __out.push('\n\t\t<li><span>Type: </span>');
              __out.push(__sanitize(result.type));
              __out.push('</li>\n\t');
            }
          
            __out.push('\n</ul>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // resultshead.eco
    root.require.register('MultiMine/src/templates/resultshead.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<thead>\n</thead>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // resultsrow.eco
    root.require.register('MultiMine/src/templates/resultsrow.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            var key, percentage, value, _ref;
          
            __out.push('<td class="TypeColumn">\n\t<a href="');
          
            __out.push(__sanitize(this.result.mineBase));
          
            __out.push('report.do?id=');
          
            __out.push(__sanitize(this.result.id));
          
            __out.push('" target="_blank">');
          
            __out.push(__sanitize(this.result.type));
          
            __out.push('</a>\n</td>\n<td>\n\t<ul>\n\t\t');
          
            _ref = this.result.fields;
            for (key in _ref) {
              value = _ref[key];
              __out.push('\n\t\t\t<li><strong>');
              __out.push(__sanitize("" + key + ": "));
              __out.push('</strong>');
              __out.push(__sanitize("" + value));
              __out.push('</li>\n\t\t');
            }
          
            __out.push('\n\t</ul>\n</td>\n<td class="Organism">\n\t');
          
            __out.push(__sanitize(this.result.shortName));
          
            __out.push('\n</td>\n<!-- <td class="RelevanceColumn">\n\t');
          
            percentage = (this.result.relevance / 1) * 100;
          
            __out.push('\n\t<div class="progress" style="width:');
          
            __out.push(__sanitize(percentage));
          
            __out.push('%"></div>\n</td> -->\n<td class="SourceColumn">\n\t<span>');
          
            __out.push(__sanitize(this.result.mineName));
          
            __out.push('</span>\n</td>\n');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // resultstable.eco
    root.require.register('MultiMine/src/templates/resultstable.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<thead>\n\t<tr>\n\t\t<th>Type</th>\n\t\t<th>Details</th>\n\t\t<th>Organism</th>\n\t\t<!-- <th>Relevance</th> -->\n\t\t<th>Source</th>\n\t</tr>\n</thead>\n<tbody>\n</tbody>\n');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // resultstbody.eco
    root.require.register('MultiMine/src/templates/resultstbody.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<tbody>\n</tbody>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // FilterGenusView.coffee
    root.require.register('MultiMine/src/views/FilterGenusView.js', function(exports, require, module) {
    
      var FilterGenusView, FilterSpeciesView, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterSpeciesView = require('./FilterSpeciesView');
      
      FilterGenusView = (function(_super) {
        __extends(FilterGenusView, _super);
      
        function FilterGenusView() {
          this.render = __bind(this.render, this);
          _ref = FilterGenusView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterGenusView.prototype.tagName = "li";
      
        FilterGenusView.prototype.className = "expandable";
      
        FilterGenusView.prototype.template = require('../templates/FilterGenusTemplate');
      
        FilterGenusView.prototype.templateOff = require('../templates/FilterGenusOffTemplate');
      
        FilterGenusView.prototype.enabled = true;
      
        FilterGenusView.prototype.events = function() {
          return {
            "click .expand": "showChildren",
            "click": "toggle"
          };
        };
      
        FilterGenusView.prototype.toggle = function() {
          if (this.enabled === true) {
            $(this.el).html(this.templateOff({
              result: this.options
            }));
            $(this.el).addClass("off");
            this.enabled = false;
            return mediator.trigger("filter:removeGenus", {
              genus: this.options.genus
            });
          } else {
            this.render();
            $(this.el).removeClass("off");
            this.enabled = true;
            return mediator.trigger("filter:addGenus", {
              genus: this.options.genus
            });
          }
        };
      
        FilterGenusView.prototype.showChildren = function() {
          var content;
          content = $(this.el).find('ul');
          return content.slideToggle(100, function() {});
        };
      
        FilterGenusView.prototype.filterAll = function() {};
      
        FilterGenusView.prototype.initialize = function(attr) {
          this.options = attr;
          mediator.on('display:hideAllOrganisms', this.toggleOff, this);
          return mediator.on('display:showAllOrganisms', this.toggleOn, this);
        };
      
        FilterGenusView.prototype.toggleOff = function() {
          $(this.el).html(this.templateOff({
            result: this.options
          }));
          $(this.el).addClass("off");
          return this.enabled = false;
        };
      
        FilterGenusView.prototype.toggleOn = function() {
          this.render();
          $(this.el).removeClass("off");
          return this.enabled = true;
        };
      
        FilterGenusView.prototype.render = function() {
          var nextModel, speciesView, ul, _i, _len, _ref1;
          $(this.el).html(this.template({
            result: this.options,
            count: this.options.models.length
          }));
          ul = $('<ul>');
          ul.addClass("content");
          _ref1 = this.options.models;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            nextModel = _ref1[_i];
            speciesView = new FilterSpeciesView({
              model: nextModel
            });
            ul.append(speciesView.render().$el);
          }
          $(this.el).append(ul);
          return this;
        };
      
        FilterGenusView.prototype.moused = function() {
          d3.selectAll(".mychart").style("fill", "#808080");
          return d3.select("#" + this.model.get("name")).style("fill", "white");
        };
      
        FilterGenusView.prototype.toggleMe = function() {};
      
        return FilterGenusView;
      
      })(Backbone.View);
      
      module.exports = FilterGenusView;
      
    });

    
    // FilterListItemView.coffee
    root.require.register('MultiMine/src/views/FilterListItemView.js', function(exports, require, module) {
    
      var FilterListItemView, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterListItemView = (function(_super) {
        __extends(FilterListItemView, _super);
      
        function FilterListItemView() {
          this.render = __bind(this.render, this);
          _ref = FilterListItemView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterListItemView.prototype.tagName = "li";
      
        FilterListItemView.prototype.template = require('../templates/FilterListItemTemplate');
      
        FilterListItemView.prototype.templateOff = require('../templates/FilterListItemOffTemplate');
      
        FilterListItemView.prototype.events = function() {
          return {
            "click": "toggleMe",
            "mouseover": "moused"
          };
        };
      
        FilterListItemView.prototype.initialize = function() {
          return this.model.on('change:enabled', this.render);
        };
      
        FilterListItemView.prototype.render = function() {
          if (this.model.get("enabled") === true) {
            $(this.el).html(this.template({
              result: this.model.toJSON()
            }));
            $(this.el).removeClass("off");
            mediator.trigger("filter:apply", [this.model.get("name"), "type"]);
          } else {
            $(this.el).html(this.templateOff({
              result: this.model.toJSON()
            }));
            $(this.el).addClass("off");
            mediator.trigger("filter:remove", [this.model.get("name"), "type"]);
          }
          return this;
        };
      
        FilterListItemView.prototype.moused = function() {
          d3.selectAll(".mychart").style("fill", "#808080");
          return d3.select("#" + this.model.get("name")).style("fill", "white");
        };
      
        FilterListItemView.prototype.toggleMe = function() {
          if (this.model.get("enabled") === true) {
            $(this.el).html(this.templateOff({
              result: this.model.toJSON()
            }));
            $(this.el).addClass("off");
            this.model.set({
              enabled: false
            });
            return mediator.trigger("filter:removeType", this.model.get("name"));
          } else {
            $(this.el).html(this.template({
              result: this.model.toJSON()
            }));
            this.model.set({
              enabled: true
            });
            $(this.el).removeClass("off");
            return mediator.trigger("filter:addType", this.model.get("name"));
          }
        };
      
        return FilterListItemView;
      
      })(Backbone.View);
      
      module.exports = FilterListItemView;
      
    });

    
    // FilterListView.coffee
    root.require.register('MultiMine/src/views/FilterListView.js', function(exports, require, module) {
    
      var FilterListItemView, FilterListView, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterListItemView = require('./FilterListItemView');
      
      FilterListView = (function(_super) {
        __extends(FilterListView, _super);
      
        function FilterListView() {
          _ref = FilterListView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterListView.prototype.tagName = "ul";
      
        FilterListView.prototype.initialize = function() {
          return $(this.el).mouseleave(function() {
            return mediator.trigger("charts:clear", {});
          });
        };
      
        FilterListView.prototype.render = function() {
          var $el;
          $el = $(this.el);
          this.collection.each(function(nextModel) {
            var itemView;
            itemView = new FilterListItemView({
              model: nextModel
            });
            return $el.append(itemView.render().$el);
          });
          return this;
        };
      
        return FilterListView;
      
      })(Backbone.View);
      
      module.exports = FilterListView;
      
    });

    
    // FilterOrganismItemView.coffee
    root.require.register('MultiMine/src/views/FilterOrganismItemView.js', function(exports, require, module) {
    
      var FilterOrganismItemView, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterOrganismItemView = (function(_super) {
        __extends(FilterOrganismItemView, _super);
      
        function FilterOrganismItemView() {
          this.render = __bind(this.render, this);
          _ref = FilterOrganismItemView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterOrganismItemView.prototype.tagName = "li";
      
        FilterOrganismItemView.prototype.template = require('../templates/FilterListItemTemplate');
      
        FilterOrganismItemView.prototype.templateOff = require('../templates/FilterListItemOffTemplate');
      
        FilterOrganismItemView.prototype.events = function() {
          return {
            "click": "toggleMe",
            "mouseover": "moused"
          };
        };
      
        FilterOrganismItemView.prototype.initialize = function() {
          return this.model.on('change:enabled', this.render);
        };
      
        FilterOrganismItemView.prototype.render = function() {
          if (this.model.get("enabled") === true) {
            $(this.el).html(this.template({
              result: this.model.toJSON()
            }));
            $(this.el).removeClass("off");
            mediator.trigger("filter:apply", [this.model.get("taxonId"), "organism"]);
          } else {
            $(this.el).html(this.templateOff({
              result: this.model.toJSON()
            }));
            $(this.el).addClass("off");
            mediator.trigger("filter:remove", [this.model.get("taxonId"), "organism"]);
          }
          return this;
        };
      
        FilterOrganismItemView.prototype.moused = function() {
          d3.selectAll(".mychart").style("fill", "#808080");
          return d3.select("#" + this.model.get("name")).style("fill", "white");
        };
      
        FilterOrganismItemView.prototype.toggleMe = function() {
          if (this.model.get("enabled") === true) {
            $(this.el).html(this.templateOff({
              result: this.model.toJSON()
            }));
            $(this.el).addClass("off");
            this.model.set({
              enabled: false
            });
            return mediator.trigger("filter:remove", [this.model.get("taxonId"), "organism"]);
          } else {
            $(this.el).html(this.template({
              result: this.model.toJSON()
            }));
            this.model.set({
              enabled: true
            });
            $(this.el).removeClass("off");
            return mediator.trigger("filter:apply", [this.model.get("taxonId"), "organism"]);
          }
        };
      
        return FilterOrganismItemView;
      
      })(Backbone.View);
      
      module.exports = FilterOrganismItemView;
      
    });

    
    // FilterOrganismView.coffee
    root.require.register('MultiMine/src/views/FilterOrganismView.js', function(exports, require, module) {
    
      var FilterGenusView, FilterOrganismView, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterGenusView = require('./FilterGenusView');
      
      FilterOrganismView = (function(_super) {
        __extends(FilterOrganismView, _super);
      
        function FilterOrganismView() {
          this.render = __bind(this.render, this);
          _ref = FilterOrganismView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterOrganismView.prototype.tagName = "ul";
      
        FilterOrganismView.prototype.className = "expandable";
      
        FilterOrganismView.prototype.childViews = [];
      
        FilterOrganismView.prototype.templateOff = require('../templates/FilterListItemOffTemplate');
      
        FilterOrganismView.prototype.events = function() {
          return {
            "click": "describe"
          };
        };
      
        FilterOrganismView.prototype.showChildren = function() {
          var content;
          content = $(this.el).find('ul');
          return content.slideToggle(100, function() {});
        };
      
        FilterOrganismView.prototype.describe = function() {
          return console.log(this);
        };
      
        FilterOrganismView.prototype.filterAll = function() {
          return console.log("Toggling children.");
        };
      
        FilterOrganismView.prototype.initialize = function(attr) {
          return this.options = attr;
        };
      
        FilterOrganismView.prototype.render = function() {
          var group, groups, nextGenus;
          groups = this.options.collection.groupBy(function(model) {
            return model.get("genus");
          });
          for (group in groups) {
            nextGenus = new FilterGenusView({
              models: groups[group],
              genus: group
            });
            $(this.el).append(nextGenus.render().$el);
          }
          return this;
        };
      
        FilterOrganismView.prototype.moused = function() {
          d3.selectAll(".mychart").style("fill", "#808080");
          return d3.select("#" + this.model.get("name")).style("fill", "white");
        };
      
        FilterOrganismView.prototype.toggleMe = function() {
          return console.log("clicked");
        };
      
        return FilterOrganismView;
      
      })(Backbone.View);
      
      module.exports = FilterOrganismView;
      
    });

    
    // FilterSpeciesView.coffee
    root.require.register('MultiMine/src/views/FilterSpeciesView.js', function(exports, require, module) {
    
      var FilterSpeciesView, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterSpeciesView = (function(_super) {
        __extends(FilterSpeciesView, _super);
      
        function FilterSpeciesView() {
          this.render = __bind(this.render, this);
          _ref = FilterSpeciesView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterSpeciesView.prototype.tagName = "li";
      
        FilterSpeciesView.prototype.template = require('../templates/FilterSpeciesTemplate');
      
        FilterSpeciesView.prototype.events = function() {
          return {
            "click": "filterAll"
          };
        };
      
        FilterSpeciesView.prototype.filterAll = function() {
          mediator.trigger("filter:remove", [this.model.get("taxonId"), "organism"]);
          return console.log(this.model.get("species") + " has been clicked");
        };
      
        FilterSpeciesView.prototype.initialize = function(attr) {
          this.options = attr;
          return console.log("FilterSpeciesView initialized", this);
        };
      
        FilterSpeciesView.prototype.render = function() {
          console.log("Rendering a FilterSpeciesView");
          $(this.el).html(this.template({
            result: this.model.toJSON()
          }));
          return this;
        };
      
        return FilterSpeciesView;
      
      })(Backbone.View);
      
      module.exports = FilterSpeciesView;
      
    });

    
    // OrganismListView.coffee
    root.require.register('MultiMine/src/views/OrganismListView.js', function(exports, require, module) {
    
      var FilterOrganismItemView, OrganismListView, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterOrganismItemView = require('./FilterOrganismItemView');
      
      OrganismListView = (function(_super) {
        __extends(OrganismListView, _super);
      
        function OrganismListView() {
          _ref = OrganismListView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        OrganismListView.prototype.tagName = "ul";
      
        OrganismListView.prototype.childViews = [];
      
        OrganismListView.prototype.initialize = function() {
          return $(this.el).mouseleave(function() {
            return mediator.trigger("charts:clear", {});
          });
        };
      
        OrganismListView.prototype.render = function() {
          var $el;
          $el = $(this.el);
          this.collection.each(function(nextModel) {
            var itemView;
            itemView = new FilterOrganismItemView({
              model: nextModel
            });
            this.childViews.push(itemView);
            return $el.append(itemView.render().$el);
          });
          return this;
        };
      
        return OrganismListView;
      
      })(Backbone.View);
      
      module.exports = OrganismListView;
      
    });

    
    // ResultView.coffee
    root.require.register('MultiMine/src/views/ResultView.js', function(exports, require, module) {
    
      var ResultView, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      ResultView = (function(_super) {
        __extends(ResultView, _super);
      
        function ResultView() {
          _ref = ResultView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultView.prototype.tagName = "tr";
      
        ResultView.prototype.className = "test";
      
        ResultView.prototype.template = require('../templates/resultsrow');
      
        ResultView.prototype.initialize = function() {
          return this.model.on('change:enabled', this.toggleVisible, this);
        };
      
        ResultView.prototype.toggleVisible = function() {
          console.log("CHANGING VISIBILITY");
          return $(this.el).toggleClass('hidden', !this.model.get("enabled"));
        };
      
        ResultView.prototype.render = function() {
          $(this.el).append(this.template({
            result: this.model.toJSON()
          }));
          return this;
        };
      
        return ResultView;
      
      })(Backbone.View);
      
      module.exports = ResultView;
      
    });

    
    // ResultsTableView.coffee
    root.require.register('MultiMine/src/views/ResultsTableView.js', function(exports, require, module) {
    
      var ResultView, ResultsTableView, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      ResultView = require('./ResultView');
      
      ResultsTableView = (function(_super) {
        __extends(ResultsTableView, _super);
      
        function ResultsTableView() {
          _ref = ResultsTableView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultsTableView.prototype.tagName = "table";
      
        ResultsTableView.prototype.className = "ResultsTable";
      
        ResultsTableView.prototype.template = require('../templates/resultstable');
      
        ResultsTableView.prototype.initialize = function() {
          return ResultsTableView.__super__.initialize.apply(this, arguments);
        };
      
        ResultsTableView.prototype.render = function() {
          var _this = this;
          $(this.el).append(this.template({}));
          this.collection.each(function(aModel) {
            var resultView;
            resultView = new ResultView({
              model: aModel
            });
            return $(_this.el).append(resultView.render().el);
          });
          return this;
        };
      
        return ResultsTableView;
      
      })(Backbone.View);
      
      module.exports = ResultsTableView;
      
    });

    
    // appview.js
    root.require.register('MultiMine/src/views/appview.js', function(exports, require, module) {
    
        // Include helper functions:
        var mediator = require("../modules/mediator");
        var $ = require('../modules/dependencies').$;
        var Helper = require("../modules/MyHelper");
        var ResultModel = require("../models/ResultModel");
        var ResultsCollection = require("../models/ResultsCollection");
        var ResultView = require("../views/ResultView");
        var ResultsTableView = require("../views/ResultsTableView");
        var ResultTypeCategory = require("../models/ResultTypeCategory");
        var ResultTypeCollection = require("../models/ResultTypeCollection");
      
        // Collections
        var FilterListCollection = require("../models/FilterListCollection");
        var FilterListItem = require("../models/FilterListItem");
      
        var FilterListView = require("./FilterListView");
      
        var OrganismItem = require("../models/OrganismItem");
        var OrganismCollection = require("../models/OrganismCollection");
        var OrganismListView = require("../views/OrganismListView");
        var FilterGenusView = require("../views/FilterGenusView");
        var FilterOrganismView = require("../views/FilterOrganismView");
      
      
        var searchResultsCollection = {};
        var filterTypeArr = [];
        var filterOrganismArr = [];
        var typecat = new ResultTypeCategory();
      
      
        var myResultsCollection = new ResultsCollection();
      
      
        var categoryFilterListCollection = new FilterListCollection();
        var organismFilterListCollection = new FilterListCollection();
        var organismCollection = new OrganismCollection();
      
        var globalFilter = {};
      
      
        // The Application
        // --------------
        var AppView = Backbone.View.extend({
      
          el: '#search-results',
      
          initialize: function(params) {
      
            console.log("initialized");
      
      
            // Add the "ENTER" keypress to our search box:
      
            $('#' + params.input).on('keypress', function(e) {
      
              if (e.keyCode == 13) {
      
                value = $('#' + params.input).val()
                $("#minisearch").val(value);
                
                mediator.trigger('rand', {test: value});
                return false;
              }
            });
      
            $('#minisearch').on('keypress', function(e) {
      
              
              
             
              if (e.keyCode == 13) {
                
                mediator.trigger('rand', {test: $("#minisearch").val()});
                return false;
              }
            });
      
            $('#hideAllDataTypes').on('click', function(e) {
              mediator.trigger('filter:removeAllTypes', {});
              mediator.trigger('display:hideAllTypes', {});
            });
      
            $('#showAllDataTypes').on('click', function(e) {
              mediator.trigger('filter:addAllTypes', {});
              mediator.trigger('display:showAllTypes')
            });
      
            $('#hideAllOrganisms').on('click', function(e) {
              mediator.trigger('display:hideAllOrganisms', {});
            });
      
             $('#showAllOrganisms').on('click', function(e) {
              mediator.trigger('display:showAllOrganisms', {});
            });
      
      
      
      
            // Attach our listeners to the medaitor
      
            mediator.on('rand', this.rand, this);
            // mediator.on('column:add', this.addColumn, this);
            mediator.on('filter:apply', this.applyFilter, this);
            // mediator.on('filter:remove', this.removeFilter, this);
            mediator.on('filter:hello', this.test2, this);
            mediator.on('medTest', this.test, this);
      
            mediator.on('charts:clear', this.clearCharts, this);
      
            mediator.on('display:hideAllTypes', this.hideAllDataTypes, this);
            mediator.on('display:showAllTypes', this.showAllDataTypes, this);
            mediator.on('display:hideAllOrganisms', this.hideAllOrganisms, this);
            mediator.on('display:showAllOrganisms', this.showAllOrganisms, this);
      
            mediator.on('filter:newremove', this.newremove, this);
      
        
      
      
      
      
      
      
            
          },
      
          newremove: function(data) {
            alert(JSON.stringify(data));
          },
      
          hideAllDataTypes: function() {
      
      
            categoryFilterListCollection.toggleAll(false);
      
          },
      
          showAllDataTypes: function() {
      
            categoryFilterListCollection.toggleAll(true);
      
          },
      
          hideAllOrganisms: function() {
      
            mediator.trigger("filter:removeAllGenus", {});
            organismCollection.toggleAll(false);
      
          },
      
          showAllOrganisms: function() {
      
            organismFilterListCollection.toggleAll(true);
            mediator.trigger("filter:addAllGenus", {})
      
          },
      
      
      
      
      
          clearCharts: function() {
            d3.selectAll(".mychart").style("fill", "#808080")
          },
      
          removeFilter: function(value) {
      
      
            _.each(myResultsCollection.models, function(aModel) {
              console.log("nextModel", aModel);
              aModel.set({show: false});
            });
      
      
            if (value[1] === "type") {
              filterTypeArr = _.without(filterTypeArr, value[0]);
            } else if (value[1] === "organism") {
              filterOrganismArr = _.without(filterOrganismArr, value[0]);
            }
      
            var nResults = myResultsCollection.filterType(filterTypeArr, filterOrganismArr);
            console.log("filtered results", nResults);
            _.each(nResults, function(aModel) {
                aModel.set({show: true});
            });
      
      
      
      
          },
      
          applyFilter: function(value) {
      
      
      
            // Hide all of our results:
            _.each(myResultsCollection.models, function(aModel) {
              aModel.set({show: false});
            });
      
            if (value[1] === "type") {
              filterTypeArr.push(value[0]);
            } else if (value[1] === "organism") {
              filterOrganismArr.push(value[0]);
            }
            
      
            var nResults = myResultsCollection.filterType(filterTypeArr, filterOrganismArr);
            _.each(nResults, function(aModel) {
                aModel.set({show: true});
            });
      
          },
      
          test: function(val) {
            filterTypeArr.push(val[0]);
            var nResults = myResultsCollection.filterType(filterTypeArr);
            _.each(nResults, function(aModel) {
                aModel.set({show: true});
            });
          },
      
      
          rand: function(searchValue) {
      
      
            // Reset our collections
            myResultsCollection.reset();
      
      
            categoryFilterListCollection.reset();
            organismFilterListCollection.reset();
            organismCollection.reset();
      
            $("#searchbox").css("display", "none");
      
      
      
            that = this;
      
            // Get results from the quick search
            var aHelper = new Helper();
      
            value = searchValue.test;
      
      
            // value = $("#textsearch").val();
      
            var someResults = aHelper.quickSearchEverything(value);
      
            // Evaluate the results and render our items
            Q(someResults)
            .then(function(o) {
      
              var myOrganisms = o.organisms
              var myResults = o.results
      
      
              var countedTypes = _.countBy(myResults.results, function(result) {
      
                return result.type;
      
      
              });
      
      
              var o = o.results
      
              var x = 1;
              for(var propt in countedTypes){
                  var anotherModel = new FilterListItem({name: propt, count: countedTypes[propt] });
      
                  categoryFilterListCollection.add(anotherModel);
                  filterTypeArr.push(propt);
      
              }
      
              // Build our filter object:
      
      
      
              // Build a collection
              // var myResultsCollection = new ResultsCollection();
      
              // Add our models to our collection
      
              // Build our collections of filters
      
      
      
      
              // Create Views for our DATATYPES
              //var categoryFilterListCollection = new FilterListCollection();
              // var x = 1;
              // for(var propt in o.facets.Category){
              //     var anotherModel = new FilterListItem({name: propt, count: o.facets.Category[propt] });
      
      
              //     categoryFilterListCollection.add(anotherModel);
      
              //     console.log("ANOTHER MODEL", anotherModel);
              //     console.log(propt + ': ' + o.facets.Category[propt]);
              //     filterTypeArr.push(propt);
      
              // }
              var categoryFilterListView = new FilterListView({collection: categoryFilterListCollection, options: "test"});
      
              // Create Views for our ORGANISMS
              //var organismFilterListCollection = new FilterListCollection();
              // for(var propt in o.facets.organisms){
              //     var anotherModel = new FilterListItem({name: propt, count: o.facets.organisms[propt] });
              //     organismFilterListCollection.add(anotherModel);
              //     console.log("ORGANISM MODEL", anotherModel);
              //     console.log(propt + ': ' + o.facets.Category[propt]);
              // }
              
              
              // Create an ORGANISM COLLECTION
              for (var item in myOrganisms) {
                if (myOrganisms.hasOwnProperty(item)) {
                  var newOrganism = new OrganismItem(myOrganisms[item]);
                  organismCollection.add(newOrganism);
                }
               //console.log("next item", item);
              }
      
              var counted = _.countBy(organismCollection.models, function(model) {
      
                return model.get("genus");
      
      
              });
      
      
              // var organismFilterListView = new FilterListView({collection: organismFilterListCollection});
              var organismFilterListView = new OrganismListView({collection: organismCollection});
      
              
              $('#CategoryFilterList').html(categoryFilterListView.render().$el);
              // $('#CategoryFilterList').html("EMPTY");
      
      
              // $('#OrganismFilterList').append(organismFilterListView.render().$el);
      
      
      
              // Now map some data
              //var enabledCategories = _.where(categoryFilterListCollection, {enabled: false});
      
              //console.log("ENABLED CATEGORIES", enabledCategories);
      
              categoryValues = categoryFilterListCollection.map(function(model) {
      
                var test = {key: model.get("name"), value: model.get("count")};
                return test;
              });
      
              organismValues = organismFilterListCollection.map(function(model) {
      
                var test = {key: model.get("name"), value: model.get("count")};
                return test;
              });
      
              // categoryValues = categoryFilterListCollection.map(function(model) {
              //   console.log("HERE");
              //   var test = {key: model.get("name"), value: model.get("count")};
              //   return test;
              // });
      
              organismValues = organismFilterListCollection.map(function(model) {
      
                var test = {key: model.get("name"), value: model.get("count")};
                return test;
              });
      
      
      
              
      
      
      
              // Build chart
              aHelper.buildBarChart(categoryValues, "#datatypechart");
              aHelper.buildBarChart(organismValues, "#organismchart");
      
      
      //        d3.select("#Gene").style("fill", "red");
              _.each(o.results, function(x) {
                var aModel = new ResultModel(x);
                myResultsCollection.add(aModel);
      
              
      
      
      
      
              });
      
      
      
              that.searchResultsCollection = myResultsCollection;
              
              //console.log("filteredResults", filteredResults);
      
              var myResultsTableView = new ResultsTableView({collection: myResultsCollection});
              that.$el.html(myResultsTableView.render().el);
      
              $('#resultscount').html(myResultsCollection.length + " results");
      
      
              var nextvalues = _.groupBy(myResultsCollection, function(item) {
                console.log("next");
              })
      
      
      
      
              var catPairs = _.pairs(o.facets.Category);
              //aHelper.buildChartOrganisms(catPairs, "type");
      
              var pairs = _.pairs(o.facets.organisms);
      
      
              grouped = organismCollection.groupBy (function(model) {
                return model.get("genus");
              });
      
              //console.log("Grouped", grouped);
      
              // for (var group in grouped) {
              //   //console.log("group", grouped[group]);
              //   var aGenus = new FilterGenusView({models: grouped[group], genus: group, collection: organismCollection});
              //   aGenus.render();
              // }
      
              var orgView = new FilterOrganismView({collection: organismCollection});
      
              //console.log("renderedddddd", orgView.render().$el);
      
              $('#OrganismFilterList').html(orgView.render().$el);
      
      
      
              //var aGenus = new FilterGenusView({models: organismCollection.models, genus: "Drosophila"});
              //aGenus.render();
      
      
      
              // var customFilter = {type: ["Protein", "RNAiResult", "Gene"], taxonId: [7237]};
              // var filtered = myResultsCollection.filter(customFilter);
              // console.log("final filtered", filtered);
      
              myResultsCollection.buildFilter({});
              //myResultsCollection.filterTest();
              
              $(".toolbarLeft").removeClass("hidden");
      
      
      
            })
            .then(function() {
              console.log("I am finished");
      
      
            });
      
      
          },
      
      
      
          render: function() {
            return this;
          }
      
        });
      
      
        module.exports = AppView;
    });
  })();

  // Return the main app.
  var main = root.require("MultiMine/src/main.js");

  // AMD/RequireJS.
  if (typeof define !== 'undefined' && define.amd) {
  
    define("MultiMine", [ /* load deps ahead of time */ ], function () {
      return main;
    });
  
  }

  // CommonJS.
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  }

  // Globally exported.
  else {
  
    root["MultiMine"] = main;
  
  }

  // Alias our app.
  
  root.require.alias("MultiMine/src/main.js", "MultiMine/index.js");
  

})(this);