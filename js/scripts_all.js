// document.body.onload = function(){
//     setTimeout(function(){
//         var preloader = document.getElementById('page-preloader');
//         if(!preloader.classList.contains('done')){
//             preloader.classList.add('done');
//         }
//     }, 1000);
// };

/*новый прелоудер*/
document.body.onload = function(){

    if(document.body.classList.contains('is-content-hidden')){
        document.body.classList.add('visible');
    }

    document.body.classList.add('onloadContent');

};



// функция подключения всех скриптов
// function dynamicallyLoadScript() {

//     var script,
//         listScripts = document.getElementById('listScripts'),
//         src = [
//             // 'https://api-maps.yandex.ru/2.1/?lang=ru_RU',
//             './js/custom-map.js',
//             './bower_components/jquery-mask-plugin/dist/jquery.mask.js',
//             './js/jscrollpane/jquery.mousewheel.js',
//             './js/jscrollpane/jquery.jscrollpane.min.js',
//             // 'https://abestuzhev.github.io/cafe-anderson/bower_components/tooltipster/dist/js/tooltipster.bundle.js',
//             './js/simplebar.js',
//             './js/owlcarousel/owl.carousel.js',
//             './bower_components/sumoselect/jquery.sumoselect.js',
//             './bower_components/fotorama/fotorama.js'
//         ];

//     for(var i = 0; i < src.length; i++){
//         script = document.createElement("script");
//         script.src = src[i];
//         listScripts.appendChild(script);
//     }  
// };

//   dynamicallyLoadScript();

/**
 * tooltipster http://iamceege.github.io/tooltipster/
 * A rockin' custom tooltip jQuery plugin
 * Developed by Caleb Jacob and Louis Ameline
 * MIT license
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(this, function ($) {

// This file will be UMDified by a build task.

var defaults = {
		animation: 'fade',
		animationDuration: 350,
		content: null,
		contentAsHTML: false,
		contentCloning: false,
		debug: true,
		delay: 300,
		delayTouch: [300, 500],
		functionInit: null,
		functionBefore: null,
		functionReady: null,
		functionAfter: null,
		functionFormat: null,
		IEmin: 6,
		interactive: false,
		multiple: false,
		// will default to document.body, or must be an element positioned at (0, 0)
		// in the document, typically like the very top views of an app.
		parent: null,
		plugins: ['sideTip'],
		repositionOnScroll: false,
		restoration: 'none',
		selfDestruction: true,
		theme: [],
		timer: 0,
		trackerInterval: 500,
		trackOrigin: false,
		trackTooltip: false,
		trigger: 'hover',
		triggerClose: {
			click: false,
			mouseleave: false,
			originClick: false,
			scroll: false,
			tap: false,
			touchleave: false
		},
		triggerOpen: {
			click: false,
			mouseenter: false,
			tap: false,
			touchstart: false
		},
		updateAnimation: 'rotate',
		zIndex: 9999999
	},
	// we'll avoid using the 'window' global as a good practice but npm's
	// jquery@<2.1.0 package actually requires a 'window' global, so not sure
	// it's useful at all
	win = (typeof window != 'undefined') ? window : null,
	// env will be proxied by the core for plugins to have access its properties
	env = {
		// detect if this device can trigger touch events. Better have a false
		// positive (unused listeners, that's ok) than a false negative.
		// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
		// http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
		hasTouchCapability: !!(
			win
			&&	(	'ontouchstart' in win
				||	(win.DocumentTouch && win.document instanceof win.DocumentTouch)
				||	win.navigator.maxTouchPoints
			)
		),
		hasTransitions: transitionSupport(),
		IE: false,
		// don't set manually, it will be updated by a build task after the manifest
		semVer: '4.2.5',
		window: win
	},
	core = function() {
		
		// core variables
		
		// the core emitters
		this.__$emitterPrivate = $({});
		this.__$emitterPublic = $({});
		this.__instancesLatestArr = [];
		// collects plugin constructors
		this.__plugins = {};
		// proxy env variables for plugins who might use them
		this._env = env;
	};

// core methods
core.prototype = {
	
	/**
	 * A function to proxy the public methods of an object onto another
	 *
	 * @param {object} constructor The constructor to bridge
	 * @param {object} obj The object that will get new methods (an instance or the core)
	 * @param {string} pluginName A plugin name for the console log message
	 * @return {core}
	 * @private
	 */
	__bridge: function(constructor, obj, pluginName) {
		
		// if it's not already bridged
		if (!obj[pluginName]) {
			
			var fn = function() {};
			fn.prototype = constructor;
			
			var pluginInstance = new fn();
			
			// the _init method has to exist in instance constructors but might be missing
			// in core constructors
			if (pluginInstance.__init) {
				pluginInstance.__init(obj);
			}
			
			$.each(constructor, function(methodName, fn) {
				
				// don't proxy "private" methods, only "protected" and public ones
				if (methodName.indexOf('__') != 0) {
					
					// if the method does not exist yet
					if (!obj[methodName]) {
						
						obj[methodName] = function() {
							return pluginInstance[methodName].apply(pluginInstance, Array.prototype.slice.apply(arguments));
						};
						
						// remember to which plugin this method corresponds (several plugins may
						// have methods of the same name, we need to be sure)
						obj[methodName].bridged = pluginInstance;
					}
					else if (defaults.debug) {
						
						console.log('The '+ methodName +' method of the '+ pluginName
							+' plugin conflicts with another plugin or native methods');
					}
				}
			});
			
			obj[pluginName] = pluginInstance;
		}
		
		return this;
	},
	
	/**
	 * For mockup in Node env if need be, for testing purposes
	 *
	 * @return {core}
	 * @private
	 */
	__setWindow: function(window) {
		env.window = window;
		return this;
	},
	
	/**
	 * Returns a ruler, a tool to help measure the size of a tooltip under
	 * various settings. Meant for plugins
	 * 
	 * @see Ruler
	 * @return {object} A Ruler instance
	 * @protected
	 */
	_getRuler: function($tooltip) {
		return new Ruler($tooltip);
	},
	
	/**
	 * For internal use by plugins, if needed
	 *
	 * @return {core}
	 * @protected
	 */
	_off: function() {
		this.__$emitterPrivate.off.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments));
		return this;
	},
	
	/**
	 * For internal use by plugins, if needed
	 *
	 * @return {core}
	 * @protected
	 */
	_on: function() {
		this.__$emitterPrivate.on.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments));
		return this;
	},
	
	/**
	 * For internal use by plugins, if needed
	 *
	 * @return {core}
	 * @protected
	 */
	_one: function() {
		this.__$emitterPrivate.one.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments));
		return this;
	},
	
	/**
	 * Returns (getter) or adds (setter) a plugin
	 *
	 * @param {string|object} plugin Provide a string (in the full form
	 * "namespace.name") to use as as getter, an object to use as a setter
	 * @return {object|core}
	 * @protected
	 */
	_plugin: function(plugin) {
		
		var self = this;
		
		// getter
		if (typeof plugin == 'string') {
			
			var pluginName = plugin,
				p = null;
			
			// if the namespace is provided, it's easy to search
			if (pluginName.indexOf('.') > 0) {
				p = self.__plugins[pluginName];
			}
			// otherwise, return the first name that matches
			else {
				$.each(self.__plugins, function(i, plugin) {
					
					if (plugin.name.substring(plugin.name.length - pluginName.length - 1) == '.'+ pluginName) {
						p = plugin;
						return false;
					}
				});
			}
			
			return p;
		}
		// setter
		else {
			
			// force namespaces
			if (plugin.name.indexOf('.') < 0) {
				throw new Error('Plugins must be namespaced');
			}
			
			self.__plugins[plugin.name] = plugin;
			
			// if the plugin has core features
			if (plugin.core) {
				
				// bridge non-private methods onto the core to allow new core methods
				self.__bridge(plugin.core, self, plugin.name);
			}
			
			return this;
		}
	},
	
	/**
	 * Trigger events on the core emitters
	 * 
	 * @returns {core}
	 * @protected
	 */
	_trigger: function() {
		
		var args = Array.prototype.slice.apply(arguments);
		
		if (typeof args[0] == 'string') {
			args[0] = { type: args[0] };
		}
		
		// note: the order of emitters matters
		this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, args);
		this.__$emitterPublic.trigger.apply(this.__$emitterPublic, args);
		
		return this;
	},
	
	/**
	 * Returns instances of all tooltips in the page or an a given element
	 *
	 * @param {string|HTML object collection} selector optional Use this
	 * parameter to restrict the set of objects that will be inspected
	 * for the retrieval of instances. By default, all instances in the
	 * page are returned.
	 * @return {array} An array of instance objects
	 * @public
	 */
	instances: function(selector) {
		
		var instances = [],
			sel = selector || '.tooltipstered';
		
		$(sel).each(function() {
			
			var $this = $(this),
				ns = $this.data('tooltipster-ns');
			
			if (ns) {
				
				$.each(ns, function(i, namespace) {
					instances.push($this.data(namespace));
				});
			}
		});
		
		return instances;
	},
	
	/**
	 * Returns the Tooltipster objects generated by the last initializing call
	 *
	 * @return {array} An array of instance objects
	 * @public
	 */
	instancesLatest: function() {
		return this.__instancesLatestArr;
	},
	
	/**
	 * For public use only, not to be used by plugins (use ::_off() instead)
	 *
	 * @return {core}
	 * @public
	 */
	off: function() {
		this.__$emitterPublic.off.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments));
		return this;
	},
	
	/**
	 * For public use only, not to be used by plugins (use ::_on() instead)
	 *
	 * @return {core}
	 * @public
	 */
	on: function() {
		this.__$emitterPublic.on.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments));
		return this;
	},
	
	/**
	 * For public use only, not to be used by plugins (use ::_one() instead)
	 * 
	 * @return {core}
	 * @public
	 */
	one: function() {
		this.__$emitterPublic.one.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments));
		return this;
	},
	
	/**
	 * Returns all HTML elements which have one or more tooltips
	 *
	 * @param {string} selector optional Use this to restrict the results
	 * to the descendants of an element
	 * @return {array} An array of HTML elements
	 * @public
	 */
	origins: function(selector) {
		
		var sel = selector ?
			selector +' ' :
			'';
		
		return $(sel +'.tooltipstered').toArray();
	},
	
	/**
	 * Change default options for all future instances
	 *
	 * @param {object} d The options that should be made defaults
	 * @return {core}
	 * @public
	 */
	setDefaults: function(d) {
		$.extend(defaults, d);
		return this;
	},
	
	/**
	 * For users to trigger their handlers on the public emitter
	 * 
	 * @returns {core}
	 * @public
	 */
	triggerHandler: function() {
		this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments));
		return this;
	}
};

// $.tooltipster will be used to call core methods
$.tooltipster = new core();

// the Tooltipster instance class (mind the capital T)
$.Tooltipster = function(element, options) {
	
	// list of instance variables
	
	// stack of custom callbacks provided as parameters to API methods
	this.__callbacks = {
		close: [],
		open: []
	};
	// the schedule time of DOM removal
	this.__closingTime;
	// this will be the user content shown in the tooltip. A capital "C" is used
	// because there is also a method called content()
	this.__Content;
	// for the size tracker
	this.__contentBcr;
	// to disable the tooltip after destruction
	this.__destroyed = false;
	// we can't emit directly on the instance because if a method with the same
	// name as the event exists, it will be called by jQuery. Se we use a plain
	// object as emitter. This emitter is for internal use by plugins,
	// if needed.
	this.__$emitterPrivate = $({});
	// this emitter is for the user to listen to events without risking to mess
	// with our internal listeners
	this.__$emitterPublic = $({});
	this.__enabled = true;
	// the reference to the gc interval
	this.__garbageCollector;
	// various position and size data recomputed before each repositioning
	this.__Geometry;
	// the tooltip position, saved after each repositioning by a plugin
	this.__lastPosition;
	// a unique namespace per instance
	this.__namespace = 'tooltipster-'+ Math.round(Math.random()*1000000);
	this.__options;
	// will be used to support origins in scrollable areas
	this.__$originParents;
	this.__pointerIsOverOrigin = false;
	// to remove themes if needed
	this.__previousThemes = [];
	// the state can be either: appearing, stable, disappearing, closed
	this.__state = 'closed';
	// timeout references
	this.__timeouts = {
		close: [],
		open: null
	};
	// store touch events to be able to detect emulated mouse events
	this.__touchEvents = [];
	// the reference to the tracker interval
	this.__tracker = null;
	// the element to which this tooltip is associated
	this._$origin;
	// this will be the tooltip element (jQuery wrapped HTML element).
	// It's the job of a plugin to create it and append it to the DOM
	this._$tooltip;
	
	// launch
	this.__init(element, options);
};

$.Tooltipster.prototype = {
	
	/**
	 * @param origin
	 * @param options
	 * @private
	 */
	__init: function(origin, options) {
		
		var self = this;
		
		self._$origin = $(origin);
		self.__options = $.extend(true, {}, defaults, options);
		
		// some options may need to be reformatted
		self.__optionsFormat();
		
		// don't run on old IE if asked no to
		if (	!env.IE
			||	env.IE >= self.__options.IEmin
		) {
			
			// note: the content is null (empty) by default and can stay that
			// way if the plugin remains initialized but not fed any content. The
			// tooltip will just not appear.
			
			// let's save the initial value of the title attribute for later
			// restoration if need be.
			var initialTitle = null;
			
			// it will already have been saved in case of multiple tooltips
			if (self._$origin.data('tooltipster-initialTitle') === undefined) {
				
				initialTitle = self._$origin.attr('title');
				
				// we do not want initialTitle to be "undefined" because
				// of how jQuery's .data() method works
				if (initialTitle === undefined) initialTitle = null;
				
				self._$origin.data('tooltipster-initialTitle', initialTitle);
			}
			
			// If content is provided in the options, it has precedence over the
			// title attribute.
			// Note: an empty string is considered content, only 'null' represents
			// the absence of content.
			// Also, an existing title="" attribute will result in an empty string
			// content
			if (self.__options.content !== null) {
				self.__contentSet(self.__options.content);
			}
			else {
				
				var selector = self._$origin.attr('data-tooltip-content'),
					$el;
				
				if (selector){
					$el = $(selector);
				}
				
				if ($el && $el[0]) {
					self.__contentSet($el.first());
				}
				else {
					self.__contentSet(initialTitle);
				}
			}
			
			self._$origin
				// strip the title off of the element to prevent the default tooltips
				// from popping up
				.removeAttr('title')
				// to be able to find all instances on the page later (upon window
				// events in particular)
				.addClass('tooltipstered');
			
			// set listeners on the origin
			self.__prepareOrigin();
			
			// set the garbage collector
			self.__prepareGC();
			
			// init plugins
			$.each(self.__options.plugins, function(i, pluginName) {
				self._plug(pluginName);
			});
			
			// to detect swiping
			if (env.hasTouchCapability) {
				$(env.window.document.body).on('touchmove.'+ self.__namespace +'-triggerOpen', function(event) {
					self._touchRecordEvent(event);
				});
			}
			
			self
				// prepare the tooltip when it gets created. This event must
				// be fired by a plugin
				._on('created', function() {
					self.__prepareTooltip();
				})
				// save position information when it's sent by a plugin
				._on('repositioned', function(e) {
					self.__lastPosition = e.position;
				});
		}
		else {
			self.__options.disabled = true;
		}
	},
	
	/**
	 * Insert the content into the appropriate HTML element of the tooltip
	 * 
	 * @returns {self}
	 * @private
	 */
	__contentInsert: function() {
		
		var self = this,
			$el = self._$tooltip.find('.tooltipster-content'),
			formattedContent = self.__Content,
			format = function(content) {
				formattedContent = content;
			};
		
		self._trigger({
			type: 'format',
			content: self.__Content,
			format: format
		});
		
		if (self.__options.functionFormat) {
			
			formattedContent = self.__options.functionFormat.call(
				self,
				self,
				{ origin: self._$origin[0] },
				self.__Content
			);
		}
		
		if (typeof formattedContent === 'string' && !self.__options.contentAsHTML) {
			$el.text(formattedContent);
		}
		else {
			$el
				.empty()
				.append(formattedContent);
		}
		
		return self;
	},
	
	/**
	 * Save the content, cloning it beforehand if need be
	 * 
	 * @param content
	 * @returns {self}
	 * @private
	 */
	__contentSet: function(content) {
		
		// clone if asked. Cloning the object makes sure that each instance has its
		// own version of the content (in case a same object were provided for several
		// instances)
		// reminder: typeof null === object
		if (content instanceof $ && this.__options.contentCloning) {
			content = content.clone(true);
		}
		
		this.__Content = content;
		
		this._trigger({
			type: 'updated',
			content: content
		});
		
		return this;
	},
	
	/**
	 * Error message about a method call made after destruction
	 * 
	 * @private
	 */
	__destroyError: function() {
		throw new Error('This tooltip has been destroyed and cannot execute your method call.');
	},
	
	/**
	 * Gather all information about dimensions and available space,
	 * called before every repositioning
	 * 
	 * @private
	 * @returns {object}
	 */
	__geometry: function() {
		
		var	self = this,
			$target = self._$origin,
			originIsArea = self._$origin.is('area');
		
		// if this._$origin is a map area, the target we'll need
		// the dimensions of is actually the image using the map,
		// not the area itself
		if (originIsArea) {
			
			var mapName = self._$origin.parent().attr('name');
			
			$target = $('img[usemap="#'+ mapName +'"]');
		}
		
		var bcr = $target[0].getBoundingClientRect(),
			$document = $(env.window.document),
			$window = $(env.window),
			$parent = $target,
			// some useful properties of important elements
			geo = {
				// available space for the tooltip, see down below
				available: {
					document: null,
					window: null
				},
				document: {
					size: {
						height: $document.height(),
						width: $document.width()
					}
				},
				window: {
					scroll: {
						// the second ones are for IE compatibility
						left: env.window.scrollX || env.window.document.documentElement.scrollLeft,
						top: env.window.scrollY || env.window.document.documentElement.scrollTop
					},
					size: {
						height: $window.height(),
						width: $window.width()
					}
				},
				origin: {
					// the origin has a fixed lineage if itself or one of its
					// ancestors has a fixed position
					fixedLineage: false,
					// relative to the document
					offset: {},
					size: {
						height: bcr.bottom - bcr.top,
						width: bcr.right - bcr.left
					},
					usemapImage: originIsArea ? $target[0] : null,
					// relative to the window
					windowOffset: {
						bottom: bcr.bottom,
						left: bcr.left,
						right: bcr.right,
						top: bcr.top
					}
				}
			},
			geoFixed = false;
		
		// if the element is a map area, some properties may need
		// to be recalculated
		if (originIsArea) {
			
			var shape = self._$origin.attr('shape'),
				coords = self._$origin.attr('coords');
			
			if (coords) {
				
				coords = coords.split(',');
				
				$.map(coords, function(val, i) {
					coords[i] = parseInt(val);
				});
			}
			
			// if the image itself is the area, nothing more to do
			if (shape != 'default') {
				
				switch(shape) {
					
					case 'circle':
						
						var circleCenterLeft = coords[0],
							circleCenterTop = coords[1],
							circleRadius = coords[2],
							areaTopOffset = circleCenterTop - circleRadius,
							areaLeftOffset = circleCenterLeft - circleRadius;
						
						geo.origin.size.height = circleRadius * 2;
						geo.origin.size.width = geo.origin.size.height;
						
						geo.origin.windowOffset.left += areaLeftOffset;
						geo.origin.windowOffset.top += areaTopOffset;
						
						break;
					
					case 'rect':
						
						var areaLeft = coords[0],
							areaTop = coords[1],
							areaRight = coords[2],
							areaBottom = coords[3];
						
						geo.origin.size.height = areaBottom - areaTop;
						geo.origin.size.width = areaRight - areaLeft;
						
						geo.origin.windowOffset.left += areaLeft;
						geo.origin.windowOffset.top += areaTop;
						
						break;
					
					case 'poly':
						
						var areaSmallestX = 0,
							areaSmallestY = 0,
							areaGreatestX = 0,
							areaGreatestY = 0,
							arrayAlternate = 'even';
						
						for (var i = 0; i < coords.length; i++) {
							
							var areaNumber = coords[i];
							
							if (arrayAlternate == 'even') {
								
								if (areaNumber > areaGreatestX) {
									
									areaGreatestX = areaNumber;
									
									if (i === 0) {
										areaSmallestX = areaGreatestX;
									}
								}
								
								if (areaNumber < areaSmallestX) {
									areaSmallestX = areaNumber;
								}
								
								arrayAlternate = 'odd';
							}
							else {
								if (areaNumber > areaGreatestY) {
									
									areaGreatestY = areaNumber;
									
									if (i == 1) {
										areaSmallestY = areaGreatestY;
									}
								}
								
								if (areaNumber < areaSmallestY) {
									areaSmallestY = areaNumber;
								}
								
								arrayAlternate = 'even';
							}
						}
						
						geo.origin.size.height = areaGreatestY - areaSmallestY;
						geo.origin.size.width = areaGreatestX - areaSmallestX;
						
						geo.origin.windowOffset.left += areaSmallestX;
						geo.origin.windowOffset.top += areaSmallestY;
						
						break;
				}
			}
		}
		
		// user callback through an event
		var edit = function(r) {
			geo.origin.size.height = r.height,
				geo.origin.windowOffset.left = r.left,
				geo.origin.windowOffset.top = r.top,
				geo.origin.size.width = r.width
		};
		
		self._trigger({
			type: 'geometry',
			edit: edit,
			geometry: {
				height: geo.origin.size.height,
				left: geo.origin.windowOffset.left,
				top: geo.origin.windowOffset.top,
				width: geo.origin.size.width
			}
		});
		
		// calculate the remaining properties with what we got
		
		geo.origin.windowOffset.right = geo.origin.windowOffset.left + geo.origin.size.width;
		geo.origin.windowOffset.bottom = geo.origin.windowOffset.top + geo.origin.size.height;
		
		geo.origin.offset.left = geo.origin.windowOffset.left + geo.window.scroll.left;
		geo.origin.offset.top = geo.origin.windowOffset.top + geo.window.scroll.top;
		geo.origin.offset.bottom = geo.origin.offset.top + geo.origin.size.height;
		geo.origin.offset.right = geo.origin.offset.left + geo.origin.size.width;
		
		// the space that is available to display the tooltip relatively to the document
		geo.available.document = {
			bottom: {
				height: geo.document.size.height - geo.origin.offset.bottom,
				width: geo.document.size.width
			},
			left: {
				height: geo.document.size.height,
				width: geo.origin.offset.left
			},
			right: {
				height: geo.document.size.height,
				width: geo.document.size.width - geo.origin.offset.right
			},
			top: {
				height: geo.origin.offset.top,
				width: geo.document.size.width
			}
		};
		
		// the space that is available to display the tooltip relatively to the viewport
		// (the resulting values may be negative if the origin overflows the viewport)
		geo.available.window = {
			bottom: {
				// the inner max is here to make sure the available height is no bigger
				// than the viewport height (when the origin is off screen at the top).
				// The outer max just makes sure that the height is not negative (when
				// the origin overflows at the bottom).
				height: Math.max(geo.window.size.height - Math.max(geo.origin.windowOffset.bottom, 0), 0),
				width: geo.window.size.width
			},
			left: {
				height: geo.window.size.height,
				width: Math.max(geo.origin.windowOffset.left, 0)
			},
			right: {
				height: geo.window.size.height,
				width: Math.max(geo.window.size.width - Math.max(geo.origin.windowOffset.right, 0), 0)
			},
			top: {
				height: Math.max(geo.origin.windowOffset.top, 0),
				width: geo.window.size.width
			}
		};
		
		while ($parent[0].tagName.toLowerCase() != 'html') {
			
			if ($parent.css('position') == 'fixed') {
				geo.origin.fixedLineage = true;
				break;
			}
			
			$parent = $parent.parent();
		}
		
		return geo;
	},
	
	/**
	 * Some options may need to be formated before being used
	 * 
	 * @returns {self}
	 * @private
	 */
	__optionsFormat: function() {
		
		if (typeof this.__options.animationDuration == 'number') {
			this.__options.animationDuration = [this.__options.animationDuration, this.__options.animationDuration];
		}
		
		if (typeof this.__options.delay == 'number') {
			this.__options.delay = [this.__options.delay, this.__options.delay];
		}
		
		if (typeof this.__options.delayTouch == 'number') {
			this.__options.delayTouch = [this.__options.delayTouch, this.__options.delayTouch];
		}
		
		if (typeof this.__options.theme == 'string') {
			this.__options.theme = [this.__options.theme];
		}
		
		// determine the future parent
		if (this.__options.parent === null) {
			this.__options.parent = $(env.window.document.body);
		}
		else if (typeof this.__options.parent == 'string') {
			this.__options.parent = $(this.__options.parent);
		}
		
		if (this.__options.trigger == 'hover') {
			
			this.__options.triggerOpen = {
				mouseenter: true,
				touchstart: true
			};
			
			this.__options.triggerClose = {
				mouseleave: true,
				originClick: true,
				touchleave: true
			};
		}
		else if (this.__options.trigger == 'click') {
			
			this.__options.triggerOpen = {
				click: true,
				tap: true
			};
			
			this.__options.triggerClose = {
				click: true,
				tap: true
			};
		}
		
		// for the plugins
		this._trigger('options');
		
		return this;
	},
	
	/**
	 * Schedules or cancels the garbage collector task
	 *
	 * @returns {self}
	 * @private
	 */
	__prepareGC: function() {
		
		var self = this;
		
		// in case the selfDestruction option has been changed by a method call
		if (self.__options.selfDestruction) {
			
			// the GC task
			self.__garbageCollector = setInterval(function() {
				
				var now = new Date().getTime();
				
				// forget the old events
				self.__touchEvents = $.grep(self.__touchEvents, function(event, i) {
					// 1 minute
					return now - event.time > 60000;
				});
				
				// auto-destruct if the origin is gone
				if (!bodyContains(self._$origin)) {
					
					self.close(function(){
						self.destroy();
					});
				}
			}, 20000);
		}
		else {
			clearInterval(self.__garbageCollector);
		}
		
		return self;
	},
	
	/**
	 * Sets listeners on the origin if the open triggers require them.
	 * Unlike the listeners set at opening time, these ones
	 * remain even when the tooltip is closed. It has been made a
	 * separate method so it can be called when the triggers are
	 * changed in the options. Closing is handled in _open()
	 * because of the bindings that may be needed on the tooltip
	 * itself
	 *
	 * @returns {self}
	 * @private
	 */
	__prepareOrigin: function() {
		
		var self = this;
		
		// in case we're resetting the triggers
		self._$origin.off('.'+ self.__namespace +'-triggerOpen');
		
		// if the device is touch capable, even if only mouse triggers
		// are asked, we need to listen to touch events to know if the mouse
		// events are actually emulated (so we can ignore them)
		if (env.hasTouchCapability) {
			
			self._$origin.on(
				'touchstart.'+ self.__namespace +'-triggerOpen ' +
				'touchend.'+ self.__namespace +'-triggerOpen ' +
				'touchcancel.'+ self.__namespace +'-triggerOpen',
				function(event){
					self._touchRecordEvent(event);
				}
			);
		}
		
		// mouse click and touch tap work the same way
		if (	self.__options.triggerOpen.click
			||	(self.__options.triggerOpen.tap && env.hasTouchCapability)
		) {
			
			var eventNames = '';
			if (self.__options.triggerOpen.click) {
				eventNames += 'click.'+ self.__namespace +'-triggerOpen ';
			}
			if (self.__options.triggerOpen.tap && env.hasTouchCapability) {
				eventNames += 'touchend.'+ self.__namespace +'-triggerOpen';
			}
			
			self._$origin.on(eventNames, function(event) {
				if (self._touchIsMeaningfulEvent(event)) {
					self._open(event);
				}
			});
		}
		
		// mouseenter and touch start work the same way
		if (	self.__options.triggerOpen.mouseenter
			||	(self.__options.triggerOpen.touchstart && env.hasTouchCapability)
		) {
			
			var eventNames = '';
			if (self.__options.triggerOpen.mouseenter) {
				eventNames += 'mouseenter.'+ self.__namespace +'-triggerOpen ';
			}
			if (self.__options.triggerOpen.touchstart && env.hasTouchCapability) {
				eventNames += 'touchstart.'+ self.__namespace +'-triggerOpen';
			}
			
			self._$origin.on(eventNames, function(event) {
				if (	self._touchIsTouchEvent(event)
					||	!self._touchIsEmulatedEvent(event)
				) {
					self.__pointerIsOverOrigin = true;
					self._openShortly(event);
				}
			});
		}
		
		// info for the mouseleave/touchleave close triggers when they use a delay
		if (	self.__options.triggerClose.mouseleave
			||	(self.__options.triggerClose.touchleave && env.hasTouchCapability)
		) {
			
			var eventNames = '';
			if (self.__options.triggerClose.mouseleave) {
				eventNames += 'mouseleave.'+ self.__namespace +'-triggerOpen ';
			}
			if (self.__options.triggerClose.touchleave && env.hasTouchCapability) {
				eventNames += 'touchend.'+ self.__namespace +'-triggerOpen touchcancel.'+ self.__namespace +'-triggerOpen';
			}
			
			self._$origin.on(eventNames, function(event) {
				
				if (self._touchIsMeaningfulEvent(event)) {
					self.__pointerIsOverOrigin = false;
				}
			});
		}
		
		return self;
	},
	
	/**
	 * Do the things that need to be done only once after the tooltip
	 * HTML element it has been created. It has been made a separate
	 * method so it can be called when options are changed. Remember
	 * that the tooltip may actually exist in the DOM before it is
	 * opened, and present after it has been closed: it's the display
	 * plugin that takes care of handling it.
	 * 
	 * @returns {self}
	 * @private
	 */
	__prepareTooltip: function() {
		
		var self = this,
			p = self.__options.interactive ? 'auto' : '';
		
		// this will be useful to know quickly if the tooltip is in
		// the DOM or not 
		self._$tooltip
			.attr('id', self.__namespace)
			.css({
				// pointer events
				'pointer-events': p,
				zIndex: self.__options.zIndex
			});
		
		// themes
		// remove the old ones and add the new ones
		$.each(self.__previousThemes, function(i, theme) {
			self._$tooltip.removeClass(theme);
		});
		$.each(self.__options.theme, function(i, theme) {
			self._$tooltip.addClass(theme);
		});
		
		self.__previousThemes = $.merge([], self.__options.theme);
		
		return self;
	},
	
	/**
	 * Handles the scroll on any of the parents of the origin (when the
	 * tooltip is open)
	 *
	 * @param {object} event
	 * @returns {self}
	 * @private
	 */
	__scrollHandler: function(event) {
		
		var self = this;
		
		if (self.__options.triggerClose.scroll) {
			self._close(event);
		}
		else {
			
			// if the origin or tooltip have been removed: do nothing, the tracker will
			// take care of it later
			if (bodyContains(self._$origin) && bodyContains(self._$tooltip)) {
				
				var geo = null;
				
				// if the scroll happened on the window
				if (event.target === env.window.document) {
					
					// if the origin has a fixed lineage, window scroll will have no
					// effect on its position nor on the position of the tooltip
					if (!self.__Geometry.origin.fixedLineage) {
						
						// we don't need to do anything unless repositionOnScroll is true
						// because the tooltip will already have moved with the window
						// (and of course with the origin)
						if (self.__options.repositionOnScroll) {
							self.reposition(event);
						}
					}
				}
				// if the scroll happened on another parent of the tooltip, it means
				// that it's in a scrollable area and now needs to have its position
				// adjusted or recomputed, depending ont the repositionOnScroll
				// option. Also, if the origin is partly hidden due to a parent that
				// hides its overflow, we'll just hide (not close) the tooltip.
				else {
					
					geo = self.__geometry();
					
					var overflows = false;
					
					// a fixed position origin is not affected by the overflow hiding
					// of a parent
					if (self._$origin.css('position') != 'fixed') {
						
						self.__$originParents.each(function(i, el) {
							
							var $el = $(el),
								overflowX = $el.css('overflow-x'),
								overflowY = $el.css('overflow-y');
							
							if (overflowX != 'visible' || overflowY != 'visible') {
								
								var bcr = el.getBoundingClientRect();
								
								if (overflowX != 'visible') {
									
									if (	geo.origin.windowOffset.left < bcr.left
										||	geo.origin.windowOffset.right > bcr.right
									) {
										overflows = true;
										return false;
									}
								}
								
								if (overflowY != 'visible') {
									
									if (	geo.origin.windowOffset.top < bcr.top
										||	geo.origin.windowOffset.bottom > bcr.bottom
									) {
										overflows = true;
										return false;
									}
								}
							}
							
							// no need to go further if fixed, for the same reason as above
							if ($el.css('position') == 'fixed') {
								return false;
							}
						});
					}
					
					if (overflows) {
						self._$tooltip.css('visibility', 'hidden');
					}
					else {
						
						self._$tooltip.css('visibility', 'visible');
						
						// reposition
						if (self.__options.repositionOnScroll) {
							self.reposition(event);
						}
						// or just adjust offset
						else {
							
							// we have to use offset and not windowOffset because this way,
							// only the scroll distance of the scrollable areas are taken into
							// account (the scrolltop value of the main window must be
							// ignored since the tooltip already moves with it)
							var offsetLeft = geo.origin.offset.left - self.__Geometry.origin.offset.left,
								offsetTop = geo.origin.offset.top - self.__Geometry.origin.offset.top;
							
							// add the offset to the position initially computed by the display plugin
							self._$tooltip.css({
								left: self.__lastPosition.coord.left + offsetLeft,
								top: self.__lastPosition.coord.top + offsetTop
							});
						}
					}
				}
				
				self._trigger({
					type: 'scroll',
					event: event,
					geo: geo
				});
			}
		}
		
		return self;
	},
	
	/**
	 * Changes the state of the tooltip
	 *
	 * @param {string} state
	 * @returns {self}
	 * @private
	 */
	__stateSet: function(state) {
		
		this.__state = state;
		
		this._trigger({
			type: 'state',
			state: state
		});
		
		return this;
	},
	
	/**
	 * Clear appearance timeouts
	 *
	 * @returns {self}
	 * @private
	 */
	__timeoutsClear: function() {
		
		// there is only one possible open timeout: the delayed opening
		// when the mouseenter/touchstart open triggers are used
		clearTimeout(this.__timeouts.open);
		this.__timeouts.open = null;
		
		// ... but several close timeouts: the delayed closing when the
		// mouseleave close trigger is used and the timer option
		$.each(this.__timeouts.close, function(i, timeout) {
			clearTimeout(timeout);
		});
		this.__timeouts.close = [];
		
		return this;
	},
	
	/**
	 * Start the tracker that will make checks at regular intervals
	 * 
	 * @returns {self}
	 * @private
	 */
	__trackerStart: function() {
		
		var self = this,
			$content = self._$tooltip.find('.tooltipster-content');
		
		// get the initial content size
		if (self.__options.trackTooltip) {
			self.__contentBcr = $content[0].getBoundingClientRect();
		}
		
		self.__tracker = setInterval(function() {
			
			// if the origin or tooltip elements have been removed.
			// Note: we could destroy the instance now if the origin has
			// been removed but we'll leave that task to our garbage collector
			if (!bodyContains(self._$origin) || !bodyContains(self._$tooltip)) {
				self._close();
			}
			// if everything is alright
			else {
				
				// compare the former and current positions of the origin to reposition
				// the tooltip if need be
				if (self.__options.trackOrigin) {
					
					var g = self.__geometry(),
						identical = false;
					
					// compare size first (a change requires repositioning too)
					if (areEqual(g.origin.size, self.__Geometry.origin.size)) {
						
						// for elements that have a fixed lineage (see __geometry()), we track the
						// top and left properties (relative to window)
						if (self.__Geometry.origin.fixedLineage) {
							if (areEqual(g.origin.windowOffset, self.__Geometry.origin.windowOffset)) {
								identical = true;
							}
						}
						// otherwise, track total offset (relative to document)
						else {
							if (areEqual(g.origin.offset, self.__Geometry.origin.offset)) {
								identical = true;
							}
						}
					}
					
					if (!identical) {
						
						// close the tooltip when using the mouseleave close trigger
						// (see https://github.com/iamceege/tooltipster/pull/253)
						if (self.__options.triggerClose.mouseleave) {
							self._close();
						}
						else {
							self.reposition();
						}
					}
				}
				
				if (self.__options.trackTooltip) {
					
					var currentBcr = $content[0].getBoundingClientRect();
					
					if (	currentBcr.height !== self.__contentBcr.height
						||	currentBcr.width !== self.__contentBcr.width
					) {
						self.reposition();
						self.__contentBcr = currentBcr;
					}
				}
			}
		}, self.__options.trackerInterval);
		
		return self;
	},
	
	/**
	 * Closes the tooltip (after the closing delay)
	 * 
	 * @param event
	 * @param callback
	 * @param force Set to true to override a potential refusal of the user's function
	 * @returns {self}
	 * @protected
	 */
	_close: function(event, callback, force) {
		
		var self = this,
			ok = true;
		
		self._trigger({
			type: 'close',
			event: event,
			stop: function() {
				ok = false;
			}
		});
		
		// a destroying tooltip (force == true) may not refuse to close
		if (ok || force) {
			
			// save the method custom callback and cancel any open method custom callbacks
			if (callback) self.__callbacks.close.push(callback);
			self.__callbacks.open = [];
			
			// clear open/close timeouts
			self.__timeoutsClear();
			
			var finishCallbacks = function() {
				
				// trigger any close method custom callbacks and reset them
				$.each(self.__callbacks.close, function(i,c) {
					c.call(self, self, {
						event: event,
						origin: self._$origin[0]
					});
				});
				
				self.__callbacks.close = [];
			};
			
			if (self.__state != 'closed') {
				
				var necessary = true,
					d = new Date(),
					now = d.getTime(),
					newClosingTime = now + self.__options.animationDuration[1];
				
				// the tooltip may already already be disappearing, but if a new
				// call to close() is made after the animationDuration was changed
				// to 0 (for example), we ought to actually close it sooner than
				// previously scheduled. In that case it should be noted that the
				// browser will not adapt the animation duration to the new
				// animationDuration that was set after the start of the closing
				// animation.
				// Note: the same thing could be considered at opening, but is not
				// really useful since the tooltip is actually opened immediately
				// upon a call to _open(). Since it would not make the opening
				// animation finish sooner, its sole impact would be to trigger the
				// state event and the open callbacks sooner than the actual end of
				// the opening animation, which is not great.
				if (self.__state == 'disappearing') {
					
					if (	newClosingTime > self.__closingTime
						// in case closing is actually overdue because the script
						// execution was suspended. See #679
						&&	self.__options.animationDuration[1] > 0
					) {
						necessary = false;
					}
				}
				
				if (necessary) {
					
					self.__closingTime = newClosingTime;
					
					if (self.__state != 'disappearing') {
						self.__stateSet('disappearing');
					}
					
					var finish = function() {
						
						// stop the tracker
						clearInterval(self.__tracker);
						
						// a "beforeClose" option has been asked several times but would
						// probably useless since the content element is still accessible
						// via ::content(), and because people can always use listeners
						// inside their content to track what's going on. For the sake of
						// simplicity, this has been denied. Bur for the rare people who
						// really need the option (for old browsers or for the case where
						// detaching the content is actually destructive, for file or
						// password inputs for example), this event will do the work.
						self._trigger({
							type: 'closing',
							event: event
						});
						
						// unbind listeners which are no longer needed
						
						self._$tooltip
							.off('.'+ self.__namespace +'-triggerClose')
							.removeClass('tooltipster-dying');
						
						// orientationchange, scroll and resize listeners
						$(env.window).off('.'+ self.__namespace +'-triggerClose');
						
						// scroll listeners
						self.__$originParents.each(function(i, el) {
							$(el).off('scroll.'+ self.__namespace +'-triggerClose');
						});
						// clear the array to prevent memory leaks
						self.__$originParents = null;
						
						$(env.window.document.body).off('.'+ self.__namespace +'-triggerClose');
						
						self._$origin.off('.'+ self.__namespace +'-triggerClose');
						
						self._off('dismissable');
						
						// a plugin that would like to remove the tooltip from the
						// DOM when closed should bind on this
						self.__stateSet('closed');
						
						// trigger event
						self._trigger({
							type: 'after',
							event: event
						});
						
						// call our constructor custom callback function
						if (self.__options.functionAfter) {
							self.__options.functionAfter.call(self, self, {
								event: event,
								origin: self._$origin[0]
							});
						}
						
						// call our method custom callbacks functions
						finishCallbacks();
					};
					
					if (env.hasTransitions) {
						
						self._$tooltip.css({
							'-moz-animation-duration': self.__options.animationDuration[1] + 'ms',
							'-ms-animation-duration': self.__options.animationDuration[1] + 'ms',
							'-o-animation-duration': self.__options.animationDuration[1] + 'ms',
							'-webkit-animation-duration': self.__options.animationDuration[1] + 'ms',
							'animation-duration': self.__options.animationDuration[1] + 'ms',
							'transition-duration': self.__options.animationDuration[1] + 'ms'
						});
						
						self._$tooltip
							// clear both potential open and close tasks
							.clearQueue()
							.removeClass('tooltipster-show')
							// for transitions only
							.addClass('tooltipster-dying');
						
						if (self.__options.animationDuration[1] > 0) {
							self._$tooltip.delay(self.__options.animationDuration[1]);
						}
						
						self._$tooltip.queue(finish);
					}
					else {
						
						self._$tooltip
							.stop()
							.fadeOut(self.__options.animationDuration[1], finish);
					}
				}
			}
			// if the tooltip is already closed, we still need to trigger
			// the method custom callbacks
			else {
				finishCallbacks();
			}
		}
		
		return self;
	},
	
	/**
	 * For internal use by plugins, if needed
	 * 
	 * @returns {self}
	 * @protected
	 */
	_off: function() {
		this.__$emitterPrivate.off.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments));
		return this;
	},
	
	/**
	 * For internal use by plugins, if needed
	 *
	 * @returns {self}
	 * @protected
	 */
	_on: function() {
		this.__$emitterPrivate.on.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments));
		return this;
	},
	
	/**
	 * For internal use by plugins, if needed
	 *
	 * @returns {self}
	 * @protected
	 */
	_one: function() {
		this.__$emitterPrivate.one.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments));
		return this;
	},
	
	/**
	 * Opens the tooltip right away.
	 *
	 * @param event
	 * @param callback Will be called when the opening animation is over
	 * @returns {self}
	 * @protected
	 */
	_open: function(event, callback) {
		
		var self = this;
		
		// if the destruction process has not begun and if this was not
		// triggered by an unwanted emulated click event
		if (!self.__destroying) {
			
			// check that the origin is still in the DOM
			if (	bodyContains(self._$origin)
				// if the tooltip is enabled
				&&	self.__enabled
			) {
				
				var ok = true;
				
				// if the tooltip is not open yet, we need to call functionBefore.
				// otherwise we can jst go on
				if (self.__state == 'closed') {
					
					// trigger an event. The event.stop function allows the callback
					// to prevent the opening of the tooltip
					self._trigger({
						type: 'before',
						event: event,
						stop: function() {
							ok = false;
						}
					});
					
					if (ok && self.__options.functionBefore) {
						
						// call our custom function before continuing
						ok = self.__options.functionBefore.call(self, self, {
							event: event,
							origin: self._$origin[0]
						});
					}
				}
				
				if (ok !== false) {
					
					// if there is some content
					if (self.__Content !== null) {
						
						// save the method callback and cancel close method callbacks
						if (callback) {
							self.__callbacks.open.push(callback);
						}
						self.__callbacks.close = [];
						
						// get rid of any appearance timeouts
						self.__timeoutsClear();
						
						var extraTime,
							finish = function() {
								
								if (self.__state != 'stable') {
									self.__stateSet('stable');
								}
								
								// trigger any open method custom callbacks and reset them
								$.each(self.__callbacks.open, function(i,c) {
									c.call(self, self, {
										origin: self._$origin[0],
										tooltip: self._$tooltip[0]
									});
								});
								
								self.__callbacks.open = [];
							};
						
						// if the tooltip is already open
						if (self.__state !== 'closed') {
							
							// the timer (if any) will start (or restart) right now
							extraTime = 0;
							
							// if it was disappearing, cancel that
							if (self.__state === 'disappearing') {
								
								self.__stateSet('appearing');
								
								if (env.hasTransitions) {
									
									self._$tooltip
										.clearQueue()
										.removeClass('tooltipster-dying')
										.addClass('tooltipster-show');
									
									if (self.__options.animationDuration[0] > 0) {
										self._$tooltip.delay(self.__options.animationDuration[0]);
									}
									
									self._$tooltip.queue(finish);
								}
								else {
									// in case the tooltip was currently fading out, bring it back
									// to life
									self._$tooltip
										.stop()
										.fadeIn(finish);
								}
							}
							// if the tooltip is already open, we still need to trigger the method
							// custom callback
							else if (self.__state == 'stable') {
								finish();
							}
						}
						// if the tooltip isn't already open, open it
						else {
							
							// a plugin must bind on this and store the tooltip in this._$tooltip
							self.__stateSet('appearing');
							
							// the timer (if any) will start when the tooltip has fully appeared
							// after its transition
							extraTime = self.__options.animationDuration[0];
							
							// insert the content inside the tooltip
							self.__contentInsert();
							
							// reposition the tooltip and attach to the DOM
							self.reposition(event, true);
							
							// animate in the tooltip. If the display plugin wants no css
							// animations, it may override the animation option with a
							// dummy value that will produce no effect
							if (env.hasTransitions) {
								
								// note: there seems to be an issue with start animations which
								// are randomly not played on fast devices in both Chrome and FF,
								// couldn't find a way to solve it yet. It seems that applying
								// the classes before appending to the DOM helps a little, but
								// it messes up some CSS transitions. The issue almost never
								// happens when delay[0]==0 though
								self._$tooltip
									.addClass('tooltipster-'+ self.__options.animation)
									.addClass('tooltipster-initial')
									.css({
										'-moz-animation-duration': self.__options.animationDuration[0] + 'ms',
										'-ms-animation-duration': self.__options.animationDuration[0] + 'ms',
										'-o-animation-duration': self.__options.animationDuration[0] + 'ms',
										'-webkit-animation-duration': self.__options.animationDuration[0] + 'ms',
										'animation-duration': self.__options.animationDuration[0] + 'ms',
										'transition-duration': self.__options.animationDuration[0] + 'ms'
									});
								
								setTimeout(
									function() {
										
										// a quick hover may have already triggered a mouseleave
										if (self.__state != 'closed') {
											
											self._$tooltip
												.addClass('tooltipster-show')
												.removeClass('tooltipster-initial');
											
											if (self.__options.animationDuration[0] > 0) {
												self._$tooltip.delay(self.__options.animationDuration[0]);
											}
											
											self._$tooltip.queue(finish);
										}
									},
									0
								);
							}
							else {
								
								// old browsers will have to live with this
								self._$tooltip
									.css('display', 'none')
									.fadeIn(self.__options.animationDuration[0], finish);
							}
							
							// checks if the origin is removed while the tooltip is open
							self.__trackerStart();
							
							// NOTE: the listeners below have a '-triggerClose' namespace
							// because we'll remove them when the tooltip closes (unlike
							// the '-triggerOpen' listeners). So some of them are actually
							// not about close triggers, rather about positioning.
							
							$(env.window)
								// reposition on resize
								.on('resize.'+ self.__namespace +'-triggerClose', function(e) {
									
									var $ae = $(document.activeElement);
									
									// reposition only if the resize event was not triggered upon the opening
									// of a virtual keyboard due to an input field being focused within the tooltip
									// (otherwise the repositioning would lose the focus)
									if (	(!$ae.is('input') && !$ae.is('textarea'))
										||	!$.contains(self._$tooltip[0], $ae[0])
									) {
										self.reposition(e);
									}
								})
								// same as below for parents
								.on('scroll.'+ self.__namespace +'-triggerClose', function(e) {
									self.__scrollHandler(e);
								});
							
							self.__$originParents = self._$origin.parents();
							
							// scrolling may require the tooltip to be moved or even
							// repositioned in some cases
							self.__$originParents.each(function(i, parent) {
								
								$(parent).on('scroll.'+ self.__namespace +'-triggerClose', function(e) {
									self.__scrollHandler(e);
								});
							});
							
							if (	self.__options.triggerClose.mouseleave
								||	(self.__options.triggerClose.touchleave && env.hasTouchCapability)
							) {
								
								// we use an event to allow users/plugins to control when the mouseleave/touchleave
								// close triggers will come to action. It allows to have more triggering elements
								// than just the origin and the tooltip for example, or to cancel/delay the closing,
								// or to make the tooltip interactive even if it wasn't when it was open, etc.
								self._on('dismissable', function(event) {
									
									if (event.dismissable) {
										
										if (event.delay) {
											
											timeout = setTimeout(function() {
												// event.event may be undefined
												self._close(event.event);
											}, event.delay);
											
											self.__timeouts.close.push(timeout);
										}
										else {
											self._close(event);
										}
									}
									else {
										clearTimeout(timeout);
									}
								});
								
								// now set the listeners that will trigger 'dismissable' events
								var $elements = self._$origin,
									eventNamesIn = '',
									eventNamesOut = '',
									timeout = null;
								
								// if we have to allow interaction, bind on the tooltip too
								if (self.__options.interactive) {
									$elements = $elements.add(self._$tooltip);
								}
								
								if (self.__options.triggerClose.mouseleave) {
									eventNamesIn += 'mouseenter.'+ self.__namespace +'-triggerClose ';
									eventNamesOut += 'mouseleave.'+ self.__namespace +'-triggerClose ';
								}
								if (self.__options.triggerClose.touchleave && env.hasTouchCapability) {
									eventNamesIn += 'touchstart.'+ self.__namespace +'-triggerClose';
									eventNamesOut += 'touchend.'+ self.__namespace +'-triggerClose touchcancel.'+ self.__namespace +'-triggerClose';
								}
								
								$elements
									// close after some time spent outside of the elements
									.on(eventNamesOut, function(event) {
										
										// it's ok if the touch gesture ended up to be a swipe,
										// it's still a "touch leave" situation
										if (	self._touchIsTouchEvent(event)
											||	!self._touchIsEmulatedEvent(event)
										) {
											
											var delay = (event.type == 'mouseleave') ?
												self.__options.delay :
												self.__options.delayTouch;
											
											self._trigger({
												delay: delay[1],
												dismissable: true,
												event: event,
												type: 'dismissable'
											});
										}
									})
									// suspend the mouseleave timeout when the pointer comes back
									// over the elements
									.on(eventNamesIn, function(event) {
										
										// it's also ok if the touch event is a swipe gesture
										if (	self._touchIsTouchEvent(event)
											||	!self._touchIsEmulatedEvent(event)
										) {
											self._trigger({
												dismissable: false,
												event: event,
												type: 'dismissable'
											});
										}
									});
							}
							
							// close the tooltip when the origin gets a mouse click (common behavior of
							// native tooltips)
							if (self.__options.triggerClose.originClick) {
								
								self._$origin.on('click.'+ self.__namespace + '-triggerClose', function(event) {
									
									// we could actually let a tap trigger this but this feature just
									// does not make sense on touch devices
									if (	!self._touchIsTouchEvent(event)
										&&	!self._touchIsEmulatedEvent(event)
									) {
										self._close(event);
									}
								});
							}
							
							// set the same bindings for click and touch on the body to close the tooltip
							if (	self.__options.triggerClose.click
								||	(self.__options.triggerClose.tap && env.hasTouchCapability)
							) {
								
								// don't set right away since the click/tap event which triggered this method
								// (if it was a click/tap) is going to bubble up to the body, we don't want it
								// to close the tooltip immediately after it opened
								setTimeout(function() {
									
									if (self.__state != 'closed') {
										
										var eventNames = '',
											$body = $(env.window.document.body);
										
										if (self.__options.triggerClose.click) {
											eventNames += 'click.'+ self.__namespace +'-triggerClose ';
										}
										if (self.__options.triggerClose.tap && env.hasTouchCapability) {
											eventNames += 'touchend.'+ self.__namespace +'-triggerClose';
										}
										
										$body.on(eventNames, function(event) {
											
											if (self._touchIsMeaningfulEvent(event)) {
												
												self._touchRecordEvent(event);
												
												if (!self.__options.interactive || !$.contains(self._$tooltip[0], event.target)) {
													self._close(event);
												}
											}
										});
										
										// needed to detect and ignore swiping
										if (self.__options.triggerClose.tap && env.hasTouchCapability) {
											
											$body.on('touchstart.'+ self.__namespace +'-triggerClose', function(event) {
												self._touchRecordEvent(event);
											});
										}
									}
								}, 0);
							}
							
							self._trigger('ready');
							
							// call our custom callback
							if (self.__options.functionReady) {
								self.__options.functionReady.call(self, self, {
									origin: self._$origin[0],
									tooltip: self._$tooltip[0]
								});
							}
						}
						
						// if we have a timer set, let the countdown begin
						if (self.__options.timer > 0) {
							
							var timeout = setTimeout(function() {
								self._close();
							}, self.__options.timer + extraTime);
							
							self.__timeouts.close.push(timeout);
						}
					}
				}
			}
		}
		
		return self;
	},
	
	/**
	 * When using the mouseenter/touchstart open triggers, this function will
	 * schedule the opening of the tooltip after the delay, if there is one
	 *
	 * @param event
	 * @returns {self}
	 * @protected
 	 */
	_openShortly: function(event) {
		
		var self = this,
			ok = true;
		
		if (self.__state != 'stable' && self.__state != 'appearing') {
			
			// if a timeout is not already running
			if (!self.__timeouts.open) {
				
				self._trigger({
					type: 'start',
					event: event,
					stop: function() {
						ok = false;
					}
				});
				
				if (ok) {
					
					var delay = (event.type.indexOf('touch') == 0) ?
						self.__options.delayTouch :
						self.__options.delay;
					
					if (delay[0]) {
						
						self.__timeouts.open = setTimeout(function() {
							
							self.__timeouts.open = null;
							
							// open only if the pointer (mouse or touch) is still over the origin.
							// The check on the "meaningful event" can only be made here, after some
							// time has passed (to know if the touch was a swipe or not)
							if (self.__pointerIsOverOrigin && self._touchIsMeaningfulEvent(event)) {
								
								// signal that we go on
								self._trigger('startend');
								
								self._open(event);
							}
							else {
								// signal that we cancel
								self._trigger('startcancel');
							}
						}, delay[0]);
					}
					else {
						// signal that we go on
						self._trigger('startend');
						
						self._open(event);
					}
				}
			}
		}
		
		return self;
	},
	
	/**
	 * Meant for plugins to get their options
	 * 
	 * @param {string} pluginName The name of the plugin that asks for its options
	 * @param {object} defaultOptions The default options of the plugin
	 * @returns {object} The options
	 * @protected
	 */
	_optionsExtract: function(pluginName, defaultOptions) {
		
		var self = this,
			options = $.extend(true, {}, defaultOptions);
		
		// if the plugin options were isolated in a property named after the
		// plugin, use them (prevents conflicts with other plugins)
		var pluginOptions = self.__options[pluginName];
		
		// if not, try to get them as regular options
		if (!pluginOptions){
			
			pluginOptions = {};
			
			$.each(defaultOptions, function(optionName, value) {
				
				var o = self.__options[optionName];
				
				if (o !== undefined) {
					pluginOptions[optionName] = o;
				}
			});
		}
		
		// let's merge the default options and the ones that were provided. We'd want
		// to do a deep copy but not let jQuery merge arrays, so we'll do a shallow
		// extend on two levels, that will be enough if options are not more than 1
		// level deep
		$.each(options, function(optionName, value) {
			
			if (pluginOptions[optionName] !== undefined) {
				
				if ((		typeof value == 'object'
						&&	!(value instanceof Array)
						&&	value != null
					)
					&&
					(		typeof pluginOptions[optionName] == 'object'
						&&	!(pluginOptions[optionName] instanceof Array)
						&&	pluginOptions[optionName] != null
					)
				) {
					$.extend(options[optionName], pluginOptions[optionName]);
				}
				else {
					options[optionName] = pluginOptions[optionName];
				}
			}
		});
		
		return options;
	},
	
	/**
	 * Used at instantiation of the plugin, or afterwards by plugins that activate themselves
	 * on existing instances
	 * 
	 * @param {object} pluginName
	 * @returns {self}
	 * @protected
	 */
	_plug: function(pluginName) {
		
		var plugin = $.tooltipster._plugin(pluginName);
		
		if (plugin) {
			
			// if there is a constructor for instances
			if (plugin.instance) {
				
				// proxy non-private methods on the instance to allow new instance methods
				$.tooltipster.__bridge(plugin.instance, this, plugin.name);
			}
		}
		else {
			throw new Error('The "'+ pluginName +'" plugin is not defined');
		}
		
		return this;
	},
	
	/**
	 * This will return true if the event is a mouse event which was
	 * emulated by the browser after a touch event. This allows us to
	 * really dissociate mouse and touch triggers.
	 * 
	 * There is a margin of error if a real mouse event is fired right
	 * after (within the delay shown below) a touch event on the same
	 * element, but hopefully it should not happen often.
	 * 
	 * @returns {boolean}
	 * @protected
	 */
	_touchIsEmulatedEvent: function(event) {
		
		var isEmulated = false,
			now = new Date().getTime();
		
		for (var i = this.__touchEvents.length - 1; i >= 0; i--) {
			
			var e = this.__touchEvents[i];
			
			// delay, in milliseconds. It's supposed to be 300ms in
			// most browsers (350ms on iOS) to allow a double tap but
			// can be less (check out FastClick for more info)
			if (now - e.time < 500) {
				
				if (e.target === event.target) {
					isEmulated = true;
				}
			}
			else {
				break;
			}
		}
		
		return isEmulated;
	},
	
	/**
	 * Returns false if the event was an emulated mouse event or
	 * a touch event involved in a swipe gesture.
	 * 
	 * @param {object} event
	 * @returns {boolean}
	 * @protected
	 */
	_touchIsMeaningfulEvent: function(event) {
		return (
				(this._touchIsTouchEvent(event) && !this._touchSwiped(event.target))
			||	(!this._touchIsTouchEvent(event) && !this._touchIsEmulatedEvent(event))
		);
	},
	
	/**
	 * Checks if an event is a touch event
	 * 
	 * @param {object} event
	 * @returns {boolean}
	 * @protected
	 */
	_touchIsTouchEvent: function(event){
		return event.type.indexOf('touch') == 0;
	},
	
	/**
	 * Store touch events for a while to detect swiping and emulated mouse events
	 * 
	 * @param {object} event
	 * @returns {self}
	 * @protected
	 */
	_touchRecordEvent: function(event) {
		
		if (this._touchIsTouchEvent(event)) {
			event.time = new Date().getTime();
			this.__touchEvents.push(event);
		}
		
		return this;
	},
	
	/**
	 * Returns true if a swipe happened after the last touchstart event fired on
	 * event.target.
	 * 
	 * We need to differentiate a swipe from a tap before we let the event open
	 * or close the tooltip. A swipe is when a touchmove (scroll) event happens
	 * on the body between the touchstart and the touchend events of an element.
	 * 
	 * @param {object} target The HTML element that may have triggered the swipe
	 * @returns {boolean}
	 * @protected
	 */
	_touchSwiped: function(target) {
		
		var swiped = false;
		
		for (var i = this.__touchEvents.length - 1; i >= 0; i--) {
			
			var e = this.__touchEvents[i];
			
			if (e.type == 'touchmove') {
				swiped = true;
				break;
			}
			else if (
				e.type == 'touchstart'
				&&	target === e.target
			) {
				break;
			}
		}
		
		return swiped;
	},
	
	/**
	 * Triggers an event on the instance emitters
	 * 
	 * @returns {self}
	 * @protected
	 */
	_trigger: function() {
		
		var args = Array.prototype.slice.apply(arguments);
		
		if (typeof args[0] == 'string') {
			args[0] = { type: args[0] };
		}
		
		// add properties to the event
		args[0].instance = this;
		args[0].origin = this._$origin ? this._$origin[0] : null;
		args[0].tooltip = this._$tooltip ? this._$tooltip[0] : null;
		
		// note: the order of emitters matters
		this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, args);
		$.tooltipster._trigger.apply($.tooltipster, args);
		this.__$emitterPublic.trigger.apply(this.__$emitterPublic, args);
		
		return this;
	},
	
	/**
	 * Deactivate a plugin on this instance
	 * 
	 * @returns {self}
	 * @protected
	 */
	_unplug: function(pluginName) {
		
		var self = this;
		
		// if the plugin has been activated on this instance
		if (self[pluginName]) {
			
			var plugin = $.tooltipster._plugin(pluginName);
			
			// if there is a constructor for instances
			if (plugin.instance) {
				
				// unbridge
				$.each(plugin.instance, function(methodName, fn) {
					
					// if the method exists (privates methods do not) and comes indeed from
					// this plugin (may be missing or come from a conflicting plugin).
					if (	self[methodName]
						&&	self[methodName].bridged === self[pluginName]
					) {
						delete self[methodName];
					}
				});
			}
			
			// destroy the plugin
			if (self[pluginName].__destroy) {
				self[pluginName].__destroy();
			}
			
			// remove the reference to the plugin instance
			delete self[pluginName];
		}
		
		return self;
	},
	
	/**
	 * @see self::_close
	 * @returns {self}
	 * @public
	 */
	close: function(callback) {
		
		if (!this.__destroyed) {
			this._close(null, callback);
		}
		else {
			this.__destroyError();
		}
		
		return this;
	},
	
	/**
	 * Sets or gets the content of the tooltip
	 * 
	 * @returns {mixed|self}
	 * @public
	 */
	content: function(content) {
		
		var self = this;
		
		// getter method
		if (content === undefined) {
			return self.__Content;
		}
		// setter method
		else {
			
			if (!self.__destroyed) {
				
				// change the content
				self.__contentSet(content);
				
				if (self.__Content !== null) {
					
					// update the tooltip if it is open
					if (self.__state !== 'closed') {
						
						// reset the content in the tooltip
						self.__contentInsert();
						
						// reposition and resize the tooltip
						self.reposition();
						
						// if we want to play a little animation showing the content changed
						if (self.__options.updateAnimation) {
							
							if (env.hasTransitions) {
								
								// keep the reference in the local scope
								var animation = self.__options.updateAnimation;
								
								self._$tooltip.addClass('tooltipster-update-'+ animation);
								
								// remove the class after a while. The actual duration of the
								// update animation may be shorter, it's set in the CSS rules
								setTimeout(function() {
									
									if (self.__state != 'closed') {
										
										self._$tooltip.removeClass('tooltipster-update-'+ animation);
									}
								}, 1000);
							}
							else {
								self._$tooltip.fadeTo(200, 0.5, function() {
									if (self.__state != 'closed') {
										self._$tooltip.fadeTo(200, 1);
									}
								});
							}
						}
					}
				}
				else {
					self._close();
				}
			}
			else {
				self.__destroyError();
			}
			
			return self;
		}
	},
	
	/**
	 * Destroys the tooltip
	 * 
	 * @returns {self}
	 * @public
	 */
	destroy: function() {
		
		var self = this;
		
		if (!self.__destroyed) {
			
			if(self.__state != 'closed'){
				
				// no closing delay
				self.option('animationDuration', 0)
					// force closing
					._close(null, null, true);
			}
			else {
				// there might be an open timeout still running
				self.__timeoutsClear();
			}
			
			// send event
			self._trigger('destroy');
			
			self.__destroyed = true;
			
			self._$origin
				.removeData(self.__namespace)
				// remove the open trigger listeners
				.off('.'+ self.__namespace +'-triggerOpen');
			
			// remove the touch listener
			$(env.window.document.body).off('.' + self.__namespace +'-triggerOpen');
			
			var ns = self._$origin.data('tooltipster-ns');
			
			// if the origin has been removed from DOM, its data may
			// well have been destroyed in the process and there would
			// be nothing to clean up or restore
			if (ns) {
				
				// if there are no more tooltips on this element
				if (ns.length === 1) {
					
					// optional restoration of a title attribute
					var title = null;
					if (self.__options.restoration == 'previous') {
						title = self._$origin.data('tooltipster-initialTitle');
					}
					else if (self.__options.restoration == 'current') {
						
						// old school technique to stringify when outerHTML is not supported
						title = (typeof self.__Content == 'string') ?
							self.__Content :
							$('<div></div>').append(self.__Content).html();
					}
					
					if (title) {
						self._$origin.attr('title', title);
					}
					
					// final cleaning
					
					self._$origin.removeClass('tooltipstered');
					
					self._$origin
						.removeData('tooltipster-ns')
						.removeData('tooltipster-initialTitle');
				}
				else {
					// remove the instance namespace from the list of namespaces of
					// tooltips present on the element
					ns = $.grep(ns, function(el, i) {
						return el !== self.__namespace;
					});
					self._$origin.data('tooltipster-ns', ns);
				}
			}
			
			// last event
			self._trigger('destroyed');
			
			// unbind private and public event listeners
			self._off();
			self.off();
			
			// remove external references, just in case
			self.__Content = null;
			self.__$emitterPrivate = null;
			self.__$emitterPublic = null;
			self.__options.parent = null;
			self._$origin = null;
			self._$tooltip = null;
			
			// make sure the object is no longer referenced in there to prevent
			// memory leaks
			$.tooltipster.__instancesLatestArr = $.grep($.tooltipster.__instancesLatestArr, function(el, i) {
				return self !== el;
			});
			
			clearInterval(self.__garbageCollector);
		}
		else {
			self.__destroyError();
		}
		
		// we return the scope rather than true so that the call to
		// .tooltipster('destroy') actually returns the matched elements
		// and applies to all of them
		return self;
	},
	
	/**
	 * Disables the tooltip
	 * 
	 * @returns {self}
	 * @public
	 */
	disable: function() {
		
		if (!this.__destroyed) {
			
			// close first, in case the tooltip would not disappear on
			// its own (no close trigger)
			this._close();
			this.__enabled = false;
			
			return this;
		}
		else {
			this.__destroyError();
		}
		
		return this;
	},
	
	/**
	 * Returns the HTML element of the origin
	 *
	 * @returns {self}
	 * @public
	 */
	elementOrigin: function() {
		
		if (!this.__destroyed) {
			return this._$origin[0];
		}
		else {
			this.__destroyError();
		}
	},
	
	/**
	 * Returns the HTML element of the tooltip
	 *
	 * @returns {self}
	 * @public
	 */
	elementTooltip: function() {
		return this._$tooltip ? this._$tooltip[0] : null;
	},
	
	/**
	 * Enables the tooltip
	 * 
	 * @returns {self}
	 * @public
	 */
	enable: function() {
		this.__enabled = true;
		return this;
	},
	
	/**
	 * Alias, deprecated in 4.0.0
	 * 
	 * @param {function} callback
	 * @returns {self}
	 * @public
	 */
	hide: function(callback) {
		return this.close(callback);
	},
	
	/**
	 * Returns the instance
	 * 
	 * @returns {self}
	 * @public
	 */
	instance: function() {
		return this;
	},
	
	/**
	 * For public use only, not to be used by plugins (use ::_off() instead)
	 * 
	 * @returns {self}
	 * @public
	 */
	off: function() {
		
		if (!this.__destroyed) {
			this.__$emitterPublic.off.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments));
		}
		
		return this;
	},
	
	/**
	 * For public use only, not to be used by plugins (use ::_on() instead)
	 *
	 * @returns {self}
	 * @public
	 */
	on: function() {
		
		if (!this.__destroyed) {
			this.__$emitterPublic.on.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments));
		}
		else {
			this.__destroyError();
		}
		
		return this;
	},
	
	/**
	 * For public use only, not to be used by plugins
	 *
	 * @returns {self}
	 * @public
	 */
	one: function() {
		
		if (!this.__destroyed) {
			this.__$emitterPublic.one.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments));
		}
		else {
			this.__destroyError();
		}
		
		return this;
	},
	
	/**
	 * @see self::_open
	 * @returns {self}
	 * @public
	 */
	open: function(callback) {
		
		if (!this.__destroyed) {
			this._open(null, callback);
		}
		else {
			this.__destroyError();
		}
		
		return this;
	},
	
	/**
	 * Get or set options. For internal use and advanced users only.
	 * 
	 * @param {string} o Option name
	 * @param {mixed} val optional A new value for the option
	 * @return {mixed|self} If val is omitted, the value of the option
	 * is returned, otherwise the instance itself is returned
	 * @public
	 */ 
	option: function(o, val) {
		
		// getter
		if (val === undefined) {
			return this.__options[o];
		}
		// setter
		else {
			
			if (!this.__destroyed) {
				
				// change value
				this.__options[o] = val;
				
				// format
				this.__optionsFormat();
				
				// re-prepare the triggers if needed
				if ($.inArray(o, ['trigger', 'triggerClose', 'triggerOpen']) >= 0) {
					this.__prepareOrigin();
				}
				
				if (o === 'selfDestruction') {
					this.__prepareGC();
				}
			}
			else {
				this.__destroyError();
			}
			
			return this;
		}
	},
	
	/**
	 * This method is in charge of setting the position and size properties of the tooltip.
	 * All the hard work is delegated to the display plugin.
	 * Note: The tooltip may be detached from the DOM at the moment the method is called 
	 * but must be attached by the end of the method call.
	 * 
	 * @param {object} event For internal use only. Defined if an event such as
	 * window resizing triggered the repositioning
	 * @param {boolean} tooltipIsDetached For internal use only. Set this to true if you
	 * know that the tooltip not being in the DOM is not an issue (typically when the
	 * tooltip element has just been created but has not been added to the DOM yet).
	 * @returns {self}
	 * @public
	 */
	reposition: function(event, tooltipIsDetached) {
		
		var self = this;
		
		if (!self.__destroyed) {
			
			// if the tooltip is still open and the origin is still in the DOM
			if (self.__state != 'closed' && bodyContains(self._$origin)) {
				
				// if the tooltip has not been removed from DOM manually (or if it
				// has been detached on purpose)
				if (tooltipIsDetached || bodyContains(self._$tooltip)) {
					
					if (!tooltipIsDetached) {
						// detach in case the tooltip overflows the window and adds
						// scrollbars to it, so __geometry can be accurate
						self._$tooltip.detach();
					}
					
					// refresh the geometry object before passing it as a helper
					self.__Geometry = self.__geometry();
					
					// let a plugin fo the rest
					self._trigger({
						type: 'reposition',
						event: event,
						helper: {
							geo: self.__Geometry
						}
					});
				}
			}
		}
		else {
			self.__destroyError();
		}
		
		return self;
	},
	
	/**
	 * Alias, deprecated in 4.0.0
	 *
	 * @param callback
	 * @returns {self}
	 * @public
	 */
	show: function(callback) {
		return this.open(callback);
	},
	
	/**
	 * Returns some properties about the instance
	 * 
	 * @returns {object}
	 * @public
	 */
	status: function() {
		
		return {
			destroyed: this.__destroyed,
			enabled: this.__enabled,
			open: this.__state !== 'closed',
			state: this.__state
		};
	},
	
	/**
	 * For public use only, not to be used by plugins
	 *
	 * @returns {self}
	 * @public
	 */
	triggerHandler: function() {
		
		if (!this.__destroyed) {
			this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments));
		}
		else {
			this.__destroyError();
		}
		
		return this;
	}
};

$.fn.tooltipster = function() {
	
	// for using in closures
	var args = Array.prototype.slice.apply(arguments),
		// common mistake: an HTML element can't be in several tooltips at the same time
		contentCloningWarning = 'You are using a single HTML element as content for several tooltips. You probably want to set the contentCloning option to TRUE.';
	
	// this happens with $(sel).tooltipster(...) when $(sel) does not match anything
	if (this.length === 0) {
		
		// still chainable
		return this;
	}
	// this happens when calling $(sel).tooltipster('methodName or options')
	// where $(sel) matches one or more elements
	else {
		
		// method calls
		if (typeof args[0] === 'string') {
			
			var v = '#*$~&';
			
			this.each(function() {
				
				// retrieve the namepaces of the tooltip(s) that exist on that element.
				// We will interact with the first tooltip only.
				var ns = $(this).data('tooltipster-ns'),
					// self represents the instance of the first tooltipster plugin
					// associated to the current HTML object of the loop
					self = ns ? $(this).data(ns[0]) : null;
				
				// if the current element holds a tooltipster instance
				if (self) {
					
					if (typeof self[args[0]] === 'function') {
						
						if (	this.length > 1
							&&	args[0] == 'content'
							&&	(	args[1] instanceof $
								|| (typeof args[1] == 'object' && args[1] != null && args[1].tagName)
							)
							&&	!self.__options.contentCloning
							&&	self.__options.debug
						) {
							console.log(contentCloningWarning);
						}
						
						// note : args[1] and args[2] may not be defined
						var resp = self[args[0]](args[1], args[2]);
					}
					else {
						throw new Error('Unknown method "'+ args[0] +'"');
					}
					
					// if the function returned anything other than the instance
					// itself (which implies chaining, except for the `instance` method)
					if (resp !== self || args[0] === 'instance') {
						
						v = resp;
						
						// return false to stop .each iteration on the first element
						// matched by the selector
						return false;
					}
				}
				else {
					throw new Error('You called Tooltipster\'s "'+ args[0] +'" method on an uninitialized element');
				}
			});
			
			return (v !== '#*$~&') ? v : this;
		}
		// first argument is undefined or an object: the tooltip is initializing
		else {
			
			// reset the array of last initialized objects
			$.tooltipster.__instancesLatestArr = [];
			
			// is there a defined value for the multiple option in the options object ?
			var	multipleIsSet = args[0] && args[0].multiple !== undefined,
				// if the multiple option is set to true, or if it's not defined but
				// set to true in the defaults
				multiple = (multipleIsSet && args[0].multiple) || (!multipleIsSet && defaults.multiple),
				// same for content
				contentIsSet = args[0] && args[0].content !== undefined,
				content = (contentIsSet && args[0].content) || (!contentIsSet && defaults.content),
				// same for contentCloning
				contentCloningIsSet = args[0] && args[0].contentCloning !== undefined,
				contentCloning =
						(contentCloningIsSet && args[0].contentCloning)
					||	(!contentCloningIsSet && defaults.contentCloning),
				// same for debug
				debugIsSet = args[0] && args[0].debug !== undefined,
				debug = (debugIsSet && args[0].debug) || (!debugIsSet && defaults.debug);
			
			if (	this.length > 1
				&&	(	content instanceof $
					|| (typeof content == 'object' && content != null && content.tagName)
				)
				&&	!contentCloning
				&&	debug
			) {
				console.log(contentCloningWarning);
			}
			
			// create a tooltipster instance for each element if it doesn't
			// already have one or if the multiple option is set, and attach the
			// object to it
			this.each(function() {
				
				var go = false,
					$this = $(this),
					ns = $this.data('tooltipster-ns'),
					obj = null;
				
				if (!ns) {
					go = true;
				}
				else if (multiple) {
					go = true;
				}
				else if (debug) {
					// console.log('Tooltipster: one or more tooltips are already attached to the element below. Ignoring.');
					// console.log(this);
				}
				
				if (go) {
					obj = new $.Tooltipster(this, args[0]);
					
					// save the reference of the new instance
					if (!ns) ns = [];
					ns.push(obj.__namespace);
					$this.data('tooltipster-ns', ns);
					
					// save the instance itself
					$this.data(obj.__namespace, obj);
					
					// call our constructor custom function.
					// we do this here and not in ::init() because we wanted
					// the object to be saved in $this.data before triggering
					// it
					if (obj.__options.functionInit) {
						obj.__options.functionInit.call(obj, obj, {
							origin: this
						});
					}
					
					// and now the event, for the plugins and core emitter
					obj._trigger('init');
				}
				
				$.tooltipster.__instancesLatestArr.push(obj);
			});
			
			return this;
		}
	}
};

// Utilities

/**
 * A class to check if a tooltip can fit in given dimensions
 * 
 * @param {object} $tooltip The jQuery wrapped tooltip element, or a clone of it
 */
function Ruler($tooltip) {
	
	// list of instance variables
	
	this.$container;
	this.constraints = null;
	this.__$tooltip;
	
	this.__init($tooltip);
}

Ruler.prototype = {
	
	/**
	 * Move the tooltip into an invisible div that does not allow overflow to make
	 * size tests. Note: the tooltip may or may not be attached to the DOM at the
	 * moment this method is called, it does not matter.
	 * 
	 * @param {object} $tooltip The object to test. May be just a clone of the
	 * actual tooltip.
	 * @private
	 */
	__init: function($tooltip) {
		
		this.__$tooltip = $tooltip;
		
		this.__$tooltip
			.css({
				// for some reason we have to specify top and left 0
				left: 0,
				// any overflow will be ignored while measuring
				overflow: 'hidden',
				// positions at (0,0) without the div using 100% of the available width
				position: 'absolute',
				top: 0
			})
			// overflow must be auto during the test. We re-set this in case
			// it were modified by the user
			.find('.tooltipster-content')
				.css('overflow', 'auto');
		
		this.$container = $('<div class="tooltipster-ruler"></div>')
			.append(this.__$tooltip)
			.appendTo(env.window.document.body);
	},
	
	/**
	 * Force the browser to redraw (re-render) the tooltip immediately. This is required
	 * when you changed some CSS properties and need to make something with it
	 * immediately, without waiting for the browser to redraw at the end of instructions.
	 *
	 * @see http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
	 * @private
	 */
	__forceRedraw: function() {
		
		// note: this would work but for Webkit only
		//this.__$tooltip.close();
		//this.__$tooltip[0].offsetHeight;
		//this.__$tooltip.open();
		
		// works in FF too
		var $p = this.__$tooltip.parent();
		this.__$tooltip.detach();
		this.__$tooltip.appendTo($p);
	},
	
	/**
	 * Set maximum dimensions for the tooltip. A call to ::measure afterwards
	 * will tell us if the content overflows or if it's ok
	 *
	 * @param {int} width
	 * @param {int} height
	 * @return {Ruler}
	 * @public
	 */
	constrain: function(width, height) {
		
		this.constraints = {
			width: width,
			height: height
		};
		
		this.__$tooltip.css({
			// we disable display:flex, otherwise the content would overflow without
			// creating horizontal scrolling (which we need to detect).
			display: 'block',
			// reset any previous height
			height: '',
			// we'll check if horizontal scrolling occurs
			overflow: 'auto',
			// we'll set the width and see what height is generated and if there
			// is horizontal overflow
			width: width
		});
		
		return this;
	},
	
	/**
	 * Reset the tooltip content overflow and remove the test container
	 * 
	 * @returns {Ruler}
	 * @public
	 */
	destroy: function() {
		
		// in case the element was not a clone
		this.__$tooltip
			.detach()
			.find('.tooltipster-content')
				.css({
					// reset to CSS value
					display: '',
					overflow: ''
				});
		
		this.$container.remove();
	},
	
	/**
	 * Removes any constraints
	 * 
	 * @returns {Ruler}
	 * @public
	 */
	free: function() {
		
		this.constraints = null;
		
		// reset to natural size
		this.__$tooltip.css({
			display: '',
			height: '',
			overflow: 'visible',
			width: ''
		});
		
		return this;
	},
	
	/**
	 * Returns the size of the tooltip. When constraints are applied, also returns
	 * whether the tooltip fits in the provided dimensions.
	 * The idea is to see if the new height is small enough and if the content does
	 * not overflow horizontally.
	 *
	 * @param {int} width
	 * @param {int} height
	 * @returns {object} An object with a bool `fits` property and a `size` property
	 * @public
	 */
	measure: function() {
		
		this.__forceRedraw();
		
		var tooltipBcr = this.__$tooltip[0].getBoundingClientRect(),
			result = { size: {
				// bcr.width/height are not defined in IE8- but in this
				// case, bcr.right/bottom will have the same value
				// except in iOS 8+ where tooltipBcr.bottom/right are wrong
				// after scrolling for reasons yet to be determined.
				// tooltipBcr.top/left might not be 0, see issue #514
				height: tooltipBcr.height || (tooltipBcr.bottom - tooltipBcr.top),
				width: tooltipBcr.width || (tooltipBcr.right - tooltipBcr.left)
			}};
		
		if (this.constraints) {
			
			// note: we used to use offsetWidth instead of boundingRectClient but
			// it returned rounded values, causing issues with sub-pixel layouts.
			
			// note2: noticed that the bcrWidth of text content of a div was once
			// greater than the bcrWidth of its container by 1px, causing the final
			// tooltip box to be too small for its content. However, evaluating
			// their widths one against the other (below) surprisingly returned
			// equality. Happened only once in Chrome 48, was not able to reproduce
			// => just having fun with float position values...
			
			var $content = this.__$tooltip.find('.tooltipster-content'),
				height = this.__$tooltip.outerHeight(),
				contentBcr = $content[0].getBoundingClientRect(),
				fits = {
					height: height <= this.constraints.height,
					width: (
						// this condition accounts for min-width property that
						// may apply
						tooltipBcr.width <= this.constraints.width
							// the -1 is here because scrollWidth actually returns
							// a rounded value, and may be greater than bcr.width if
							// it was rounded up. This may cause an issue for contents
							// which actually really overflow  by 1px or so, but that
							// should be rare. Not sure how to solve this efficiently.
							// See http://blogs.msdn.com/b/ie/archive/2012/02/17/sub-pixel-rendering-and-the-css-object-model.aspx
						&&	contentBcr.width >= $content[0].scrollWidth - 1
					)
				};
			
			result.fits = fits.height && fits.width;
		}
		
		// old versions of IE get the width wrong for some reason and it causes
		// the text to be broken to a new line, so we round it up. If the width
		// is the width of the screen though, we can assume it is accurate.
		if (	env.IE
			&&	env.IE <= 11
			&&	result.size.width !== env.window.document.documentElement.clientWidth
		) {
			result.size.width = Math.ceil(result.size.width) + 1;
		}
		
		return result;
	}
};

// quick & dirty compare function, not bijective nor multidimensional
function areEqual(a,b) {
	var same = true;
	$.each(a, function(i, _) {
		if (b[i] === undefined || a[i] !== b[i]) {
			same = false;
			return false;
		}
	});
	return same;
}

/**
 * A fast function to check if an element is still in the DOM. It
 * tries to use an id as ids are indexed by the browser, or falls
 * back to jQuery's `contains` method. May fail if two elements
 * have the same id, but so be it
 *
 * @param {object} $obj A jQuery-wrapped HTML element
 * @return {boolean}
 */
function bodyContains($obj) {
	var id = $obj.attr('id'),
		el = id ? env.window.document.getElementById(id) : null;
	// must also check that the element with the id is the one we want
	return el ? el === $obj[0] : $.contains(env.window.document.body, $obj[0]);
}

// detect IE versions for dirty fixes
var uA = navigator.userAgent.toLowerCase();
if (uA.indexOf('msie') != -1) env.IE = parseInt(uA.split('msie')[1]);
else if (uA.toLowerCase().indexOf('trident') !== -1 && uA.indexOf(' rv:11') !== -1) env.IE = 11;
else if (uA.toLowerCase().indexOf('edge/') != -1) env.IE = parseInt(uA.toLowerCase().split('edge/')[1]);

// detecting support for CSS transitions
function transitionSupport() {
	
	// env.window is not defined yet when this is called
	if (!win) return false;
	
	var b = win.document.body || win.document.documentElement,
		s = b.style,
		p = 'transition',
		v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
	
	if (typeof s[p] == 'string') { return true; }
	
	p = p.charAt(0).toUpperCase() + p.substr(1);
	for (var i=0; i<v.length; i++) {
		if (typeof s[v[i] + p] == 'string') { return true; }
	}
	return false;
}

// we'll return jQuery for plugins not to have to declare it as a dependency,
// but it's done by a build task since it should be included only once at the
// end when we concatenate the main file with a plugin
// sideTip is Tooltipster's default plugin.
// This file will be UMDified by a build task.

var pluginName = 'tooltipster.sideTip';

$.tooltipster._plugin({
	name: pluginName,
	instance: {
		/**
		 * Defaults are provided as a function for an easy override by inheritance
		 *
		 * @return {object} An object with the defaults options
		 * @private
		 */
		__defaults: function() {
			
			return {
				// if the tooltip should display an arrow that points to the origin
				arrow: true,
				// the distance in pixels between the tooltip and the origin
				distance: 6,
				// allows to easily change the position of the tooltip
				functionPosition: null,
				maxWidth: null,
				// used to accomodate the arrow of tooltip if there is one.
				// First to make sure that the arrow target is not too close
				// to the edge of the tooltip, so the arrow does not overflow
				// the tooltip. Secondly when we reposition the tooltip to
				// make sure that it's positioned in such a way that the arrow is
				// still pointing at the target (and not a few pixels beyond it).
				// It should be equal to or greater than half the width of
				// the arrow (by width we mean the size of the side which touches
				// the side of the tooltip).
				minIntersection: 16,
				minWidth: 0,
				// deprecated in 4.0.0. Listed for _optionsExtract to pick it up
				position: null,
				side: 'top',
				// set to false to position the tooltip relatively to the document rather
				// than the window when we open it
				viewportAware: true
			};
		},
		
		/**
		 * Run once: at instantiation of the plugin
		 *
		 * @param {object} instance The tooltipster object that instantiated this plugin
		 * @private
		 */
		__init: function(instance) {
			
			var self = this;
			
			// list of instance variables
			
			self.__instance = instance;
			self.__namespace = 'tooltipster-sideTip-'+ Math.round(Math.random()*1000000);
			self.__previousState = 'closed';
			self.__options;
			
			// initial formatting
			self.__optionsFormat();
			
			self.__instance._on('state.'+ self.__namespace, function(event) {
				
				if (event.state == 'closed') {
					self.__close();
				}
				else if (event.state == 'appearing' && self.__previousState == 'closed') {
					self.__create();
				}
				
				self.__previousState = event.state;
			});
			
			// reformat every time the options are changed
			self.__instance._on('options.'+ self.__namespace, function() {
				self.__optionsFormat();
			});
			
			self.__instance._on('reposition.'+ self.__namespace, function(e) {
				self.__reposition(e.event, e.helper);
			});
		},
		
		/**
		 * Called when the tooltip has closed
		 * 
		 * @private
		 */
		__close: function() {
			
			// detach our content object first, so the next jQuery's remove()
			// call does not unbind its event handlers
			if (this.__instance.content() instanceof $) {
				this.__instance.content().detach();
			}
			
			// remove the tooltip from the DOM
			this.__instance._$tooltip.remove();
			this.__instance._$tooltip = null;
		},
		
		/**
		 * Creates the HTML element of the tooltip.
		 * 
		 * @private
		 */
		__create: function() {
			
			// note: we wrap with a .tooltipster-box div to be able to set a margin on it
			// (.tooltipster-base must not have one)
			var $html = $(
				'<div class="tooltipster-base tooltipster-sidetip">' +
					'<div class="tooltipster-box">' +
						'<div class="tooltipster-content"></div>' +
					'</div>' +
					'<div class="tooltipster-arrow">' +
						'<div class="tooltipster-arrow-uncropped">' +
							'<div class="tooltipster-arrow-border"></div>' +
							'<div class="tooltipster-arrow-background"></div>' +
						'</div>' +
					'</div>' +
				'</div>'
			);
			
			// hide arrow if asked
			if (!this.__options.arrow) {
				$html
					.find('.tooltipster-box')
						.css('margin', 0)
						.end()
					.find('.tooltipster-arrow')
						.hide();
			}
			
			// apply min/max width if asked
			if (this.__options.minWidth) {
				$html.css('min-width', this.__options.minWidth + 'px');
			}
			if (this.__options.maxWidth) {
				$html.css('max-width', this.__options.maxWidth + 'px');
			}
			
			this.__instance._$tooltip = $html;
			
			// tell the instance that the tooltip element has been created
			this.__instance._trigger('created');
		},
		
		/**
		 * Used when the plugin is to be unplugged
		 *
		 * @private
		 */
		__destroy: function() {
			this.__instance._off('.'+ self.__namespace);
		},
		
		/**
		 * (Re)compute this.__options from the options declared to the instance
		 *
		 * @private
		 */
		__optionsFormat: function() {
			
			var self = this;
			
			// get the options
			self.__options = self.__instance._optionsExtract(pluginName, self.__defaults());
			
			// for backward compatibility, deprecated in v4.0.0
			if (self.__options.position) {
				self.__options.side = self.__options.position;
			}
			
			// options formatting
			
			// format distance as a four-cell array if it ain't one yet and then make
			// it an object with top/bottom/left/right properties
			if (typeof self.__options.distance != 'object') {
				self.__options.distance = [self.__options.distance];
			}
			if (self.__options.distance.length < 4) {
				
				if (self.__options.distance[1] === undefined) self.__options.distance[1] = self.__options.distance[0];
				if (self.__options.distance[2] === undefined) self.__options.distance[2] = self.__options.distance[0];
				if (self.__options.distance[3] === undefined) self.__options.distance[3] = self.__options.distance[1];
				
				self.__options.distance = {
					top: self.__options.distance[0],
					right: self.__options.distance[1],
					bottom: self.__options.distance[2],
					left: self.__options.distance[3]
				};
			}
			
			// let's transform:
			// 'top' into ['top', 'bottom', 'right', 'left']
			// 'right' into ['right', 'left', 'top', 'bottom']
			// 'bottom' into ['bottom', 'top', 'right', 'left']
			// 'left' into ['left', 'right', 'top', 'bottom']
			if (typeof self.__options.side == 'string') {
				
				var opposites = {
					'top': 'bottom',
					'right': 'left',
					'bottom': 'top',
					'left': 'right'
				};
				
				self.__options.side = [self.__options.side, opposites[self.__options.side]];
				
				if (self.__options.side[0] == 'left' || self.__options.side[0] == 'right') {
					self.__options.side.push('top', 'bottom');
				}
				else {
					self.__options.side.push('right', 'left');
				}
			}
			
			// misc
			// disable the arrow in IE6 unless the arrow option was explicitly set to true
			if (	$.tooltipster._env.IE === 6
				&&	self.__options.arrow !== true
			) {
				self.__options.arrow = false;
			}
		},
		
		/**
		 * This method must compute and set the positioning properties of the
		 * tooltip (left, top, width, height, etc.). It must also make sure the
		 * tooltip is eventually appended to its parent (since the element may be
		 * detached from the DOM at the moment the method is called).
		 *
		 * We'll evaluate positioning scenarios to find which side can contain the
		 * tooltip in the best way. We'll consider things relatively to the window
		 * (unless the user asks not to), then to the document (if need be, or if the
		 * user explicitly requires the tests to run on the document). For each
		 * scenario, measures are taken, allowing us to know how well the tooltip
		 * is going to fit. After that, a sorting function will let us know what
		 * the best scenario is (we also allow the user to choose his favorite
		 * scenario by using an event).
		 * 
		 * @param {object} helper An object that contains variables that plugin
		 * creators may find useful (see below)
		 * @param {object} helper.geo An object with many layout properties
		 * about objects of interest (window, document, origin). This should help
		 * plugin users compute the optimal position of the tooltip
		 * @private
		 */
		__reposition: function(event, helper) {
			
			var self = this,
				finalResult,
				// to know where to put the tooltip, we need to know on which point
				// of the x or y axis we should center it. That coordinate is the target
				targets = self.__targetFind(helper),
				testResults = [];
			
			// make sure the tooltip is detached while we make tests on a clone
			self.__instance._$tooltip.detach();
			
			// we could actually provide the original element to the Ruler and
			// not a clone, but it just feels right to keep it out of the
			// machinery.
			var $clone = self.__instance._$tooltip.clone(),
				// start position tests session
				ruler = $.tooltipster._getRuler($clone),
				satisfied = false,
				animation = self.__instance.option('animation');
			
			// an animation class could contain properties that distort the size
			if (animation) {
				$clone.removeClass('tooltipster-'+ animation);
			}
			
			// start evaluating scenarios
			$.each(['window', 'document'], function(i, container) {
				
				var takeTest = null;
				
				// let the user decide to keep on testing or not
				self.__instance._trigger({
					container: container,
					helper: helper,
					satisfied: satisfied,
					takeTest: function(bool) {
						takeTest = bool;
					},
					results: testResults,
					type: 'positionTest'
				});
				
				if (	takeTest == true
					||	(	takeTest != false
						&&	satisfied == false
							// skip the window scenarios if asked. If they are reintegrated by
							// the callback of the positionTest event, they will have to be
							// excluded using the callback of positionTested
						&&	(container != 'window' || self.__options.viewportAware)
					)
				) {
					
					// for each allowed side
					for (var i=0; i < self.__options.side.length; i++) {
						
						var distance = {
								horizontal: 0,
								vertical: 0
							},
							side = self.__options.side[i];
						
						if (side == 'top' || side == 'bottom') {
							distance.vertical = self.__options.distance[side];
						}
						else {
							distance.horizontal = self.__options.distance[side];
						}
						
						// this may have an effect on the size of the tooltip if there are css
						// rules for the arrow or something else
						self.__sideChange($clone, side);
						
						$.each(['natural', 'constrained'], function(i, mode) {
							
							takeTest = null;
							
							// emit an event on the instance
							self.__instance._trigger({
								container: container,
								event: event,
								helper: helper,
								mode: mode,
								results: testResults,
								satisfied: satisfied,
								side: side,
								takeTest: function(bool) {
									takeTest = bool;
								},
								type: 'positionTest'
							});
							
							if (	takeTest == true
								||	(	takeTest != false
									&&	satisfied == false
								)
							) {
								
								var testResult = {
									container: container,
									// we let the distance as an object here, it can make things a little easier
									// during the user's calculations at positionTest/positionTested
									distance: distance,
									// whether the tooltip can fit in the size of the viewport (does not mean
									// that we'll be able to make it initially entirely visible, see 'whole')
									fits: null,
									mode: mode,
									outerSize: null,
									side: side,
									size: null,
									target: targets[side],
									// check if the origin has enough surface on screen for the tooltip to
									// aim at it without overflowing the viewport (this is due to the thickness
									// of the arrow represented by the minIntersection length).
									// If not, the tooltip will have to be partly or entirely off screen in
									// order to stay docked to the origin. This value will stay null when the
									// container is the document, as it is not relevant
									whole: null
								};
								
								// get the size of the tooltip with or without size constraints
								var rulerConfigured = (mode == 'natural') ?
										ruler.free() :
										ruler.constrain(
											helper.geo.available[container][side].width - distance.horizontal,
											helper.geo.available[container][side].height - distance.vertical
										),
									rulerResults = rulerConfigured.measure();
								
								testResult.size = rulerResults.size;
								testResult.outerSize = {
									height: rulerResults.size.height + distance.vertical,
									width: rulerResults.size.width + distance.horizontal
								};
								
								if (mode == 'natural') {
									
									if(		helper.geo.available[container][side].width >= testResult.outerSize.width
										&&	helper.geo.available[container][side].height >= testResult.outerSize.height
									) {
										testResult.fits = true;
									}
									else {
										testResult.fits = false;
									}
								}
								else {
									testResult.fits = rulerResults.fits;
								}
								
								if (container == 'window') {
									
									if (!testResult.fits) {
										testResult.whole = false;
									}
									else {
										if (side == 'top' || side == 'bottom') {
											
											testResult.whole = (
													helper.geo.origin.windowOffset.right >= self.__options.minIntersection
												&&	helper.geo.window.size.width - helper.geo.origin.windowOffset.left >= self.__options.minIntersection
											);
										}
										else {
											testResult.whole = (
													helper.geo.origin.windowOffset.bottom >= self.__options.minIntersection
												&&	helper.geo.window.size.height - helper.geo.origin.windowOffset.top >= self.__options.minIntersection
											);
										}
									}
								}
								
								testResults.push(testResult);
								
								// we don't need to compute more positions if we have one fully on screen
								if (testResult.whole) {
									satisfied = true;
								}
								else {
									// don't run the constrained test unless the natural width was greater
									// than the available width, otherwise it's pointless as we know it
									// wouldn't fit either
									if (	testResult.mode == 'natural'
										&&	(	testResult.fits
											||	testResult.size.width <= helper.geo.available[container][side].width
										)
									) {
										return false;
									}
								}
							}
						});
					}
				}
			});
			
			// the user may eliminate the unwanted scenarios from testResults, but he's
			// not supposed to alter them at this point. functionPosition and the
			// position event serve that purpose.
			self.__instance._trigger({
				edit: function(r) {
					testResults = r;
				},
				event: event,
				helper: helper,
				results: testResults,
				type: 'positionTested'
			});
			
			/**
			 * Sort the scenarios to find the favorite one.
			 * 
			 * The favorite scenario is when we can fully display the tooltip on screen,
			 * even if it means that the middle of the tooltip is no longer centered on
			 * the middle of the origin (when the origin is near the edge of the screen
			 * or even partly off screen). We want the tooltip on the preferred side,
			 * even if it means that we have to use a constrained size rather than a
			 * natural one (as long as it fits). When the origin is off screen at the top
			 * the tooltip will be positioned at the bottom (if allowed), if the origin
			 * is off screen on the right, it will be positioned on the left, etc.
			 * If there are no scenarios where the tooltip can fit on screen, or if the
			 * user does not want the tooltip to fit on screen (viewportAware == false),
			 * we fall back to the scenarios relative to the document.
			 * 
			 * When the tooltip is bigger than the viewport in either dimension, we stop
			 * looking at the window scenarios and consider the document scenarios only,
			 * with the same logic to find on which side it would fit best.
			 * 
			 * If the tooltip cannot fit the document on any side, we force it at the
			 * bottom, so at least the user can scroll to see it.
 			 */
			testResults.sort(function(a, b) {
				
				// best if it's whole (the tooltip fits and adapts to the viewport)
				if (a.whole && !b.whole) {
					return -1;
				}
				else if (!a.whole && b.whole) {
					return 1;
				}
				else if (a.whole && b.whole) {
					
					var ai = self.__options.side.indexOf(a.side),
						bi = self.__options.side.indexOf(b.side);
					
					// use the user's sides fallback array
					if (ai < bi) {
						return -1;
					}
					else if (ai > bi) {
						return 1;
					}
					else {
						// will be used if the user forced the tests to continue
						return a.mode == 'natural' ? -1 : 1;
					}
				}
				else {
					
					// better if it fits
					if (a.fits && !b.fits) {
						return -1;
					}
					else if (!a.fits && b.fits) {
						return 1;
					}
					else if (a.fits && b.fits) {
						
						var ai = self.__options.side.indexOf(a.side),
							bi = self.__options.side.indexOf(b.side);
						
						// use the user's sides fallback array
						if (ai < bi) {
							return -1;
						}
						else if (ai > bi) {
							return 1;
						}
						else {
							// will be used if the user forced the tests to continue
							return a.mode == 'natural' ? -1 : 1;
						}
					}
					else {
						
						// if everything failed, this will give a preference to the case where
						// the tooltip overflows the document at the bottom
						if (	a.container == 'document'
							&&	a.side == 'bottom'
							&&	a.mode == 'natural'
						) {
							return -1;
						}
						else {
							return 1;
						}
					}
				}
			});
			
			finalResult = testResults[0];
			
			
			// now let's find the coordinates of the tooltip relatively to the window
			finalResult.coord = {};
			
			switch (finalResult.side) {
				
				case 'left':
				case 'right':
					finalResult.coord.top = Math.floor(finalResult.target - finalResult.size.height / 2);
					break;
				
				case 'bottom':
				case 'top':
					finalResult.coord.left = Math.floor(finalResult.target - finalResult.size.width / 2);
					break;
			}
			
			switch (finalResult.side) {
				
				case 'left':
					finalResult.coord.left = helper.geo.origin.windowOffset.left - finalResult.outerSize.width;
					break;
				
				case 'right':
					finalResult.coord.left = helper.geo.origin.windowOffset.right + finalResult.distance.horizontal;
					break;
				
				case 'top':
					finalResult.coord.top = helper.geo.origin.windowOffset.top - finalResult.outerSize.height;
					break;
				
				case 'bottom':
					finalResult.coord.top = helper.geo.origin.windowOffset.bottom + finalResult.distance.vertical;
					break;
			}
			
			// if the tooltip can potentially be contained within the viewport dimensions
			// and that we are asked to make it fit on screen
			if (finalResult.container == 'window') {
				
				// if the tooltip overflows the viewport, we'll move it accordingly (then it will
				// not be centered on the middle of the origin anymore). We only move horizontally
				// for top and bottom tooltips and vice versa.
				if (finalResult.side == 'top' || finalResult.side == 'bottom') {
					
					// if there is an overflow on the left
					if (finalResult.coord.left < 0) {
						
						// prevent the overflow unless the origin itself gets off screen (minus the
						// margin needed to keep the arrow pointing at the target)
						if (helper.geo.origin.windowOffset.right - this.__options.minIntersection >= 0) {
							finalResult.coord.left = 0;
						}
						else {
							finalResult.coord.left = helper.geo.origin.windowOffset.right - this.__options.minIntersection - 1;
						}
					}
					// or an overflow on the right
					else if (finalResult.coord.left > helper.geo.window.size.width - finalResult.size.width) {
						
						if (helper.geo.origin.windowOffset.left + this.__options.minIntersection <= helper.geo.window.size.width) {
							finalResult.coord.left = helper.geo.window.size.width - finalResult.size.width;
						}
						else {
							finalResult.coord.left = helper.geo.origin.windowOffset.left + this.__options.minIntersection + 1 - finalResult.size.width;
						}
					}
				}
				else {
					
					// overflow at the top
					if (finalResult.coord.top < 0) {
						
						if (helper.geo.origin.windowOffset.bottom - this.__options.minIntersection >= 0) {
							finalResult.coord.top = 0;
						}
						else {
							finalResult.coord.top = helper.geo.origin.windowOffset.bottom - this.__options.minIntersection - 1;
						}
					}
					// or at the bottom
					else if (finalResult.coord.top > helper.geo.window.size.height - finalResult.size.height) {
						
						if (helper.geo.origin.windowOffset.top + this.__options.minIntersection <= helper.geo.window.size.height) {
							finalResult.coord.top = helper.geo.window.size.height - finalResult.size.height;
						}
						else {
							finalResult.coord.top = helper.geo.origin.windowOffset.top + this.__options.minIntersection + 1 - finalResult.size.height;
						}
					}
				}
			}
			else {
				
				// there might be overflow here too but it's easier to handle. If there has
				// to be an overflow, we'll make sure it's on the right side of the screen
				// (because the browser will extend the document size if there is an overflow
				// on the right, but not on the left). The sort function above has already
				// made sure that a bottom document overflow is preferred to a top overflow,
				// so we don't have to care about it.
				
				// if there is an overflow on the right
				if (finalResult.coord.left > helper.geo.window.size.width - finalResult.size.width) {
					
					// this may actually create on overflow on the left but we'll fix it in a sec
					finalResult.coord.left = helper.geo.window.size.width - finalResult.size.width;
				}
				
				// if there is an overflow on the left
				if (finalResult.coord.left < 0) {
					
					// don't care if it overflows the right after that, we made our best
					finalResult.coord.left = 0;
				}
			}
			
			
			// submit the positioning proposal to the user function which may choose to change
			// the side, size and/or the coordinates
			
			// first, set the rules that corresponds to the proposed side: it may change
			// the size of the tooltip, and the custom functionPosition may want to detect the
			// size of something before making a decision. So let's make things easier for the
			// implementor
			self.__sideChange($clone, finalResult.side);
			
			// add some variables to the helper
			helper.tooltipClone = $clone[0];
			helper.tooltipParent = self.__instance.option('parent').parent[0];
			// move informative values to the helper
			helper.mode = finalResult.mode;
			helper.whole = finalResult.whole;
			// add some variables to the helper for the functionPosition callback (these
			// will also be added to the event fired by self.__instance._trigger but that's
			// ok, we're just being consistent)
			helper.origin = self.__instance._$origin[0];
			helper.tooltip = self.__instance._$tooltip[0];
			
			// leave only the actionable values in there for functionPosition
			delete finalResult.container;
			delete finalResult.fits;
			delete finalResult.mode;
			delete finalResult.outerSize;
			delete finalResult.whole;
			
			// keep only the distance on the relevant side, for clarity
			finalResult.distance = finalResult.distance.horizontal || finalResult.distance.vertical;
			
			// beginners may not be comfortable with the concept of editing the object
			//  passed by reference, so we provide an edit function and pass a clone
			var finalResultClone = $.extend(true, {}, finalResult);
			
			// emit an event on the instance
			self.__instance._trigger({
				edit: function(result) {
					finalResult = result;
				},
				event: event,
				helper: helper,
				position: finalResultClone,
				type: 'position'
			});
			
			if (self.__options.functionPosition) {
				
				var result = self.__options.functionPosition.call(self, self.__instance, helper, finalResultClone);
				
				if (result) finalResult = result;
			}
			
			// end the positioning tests session (the user might have had a
			// use for it during the position event, now it's over)
			ruler.destroy();
			
			// compute the position of the target relatively to the tooltip root
			// element so we can place the arrow and make the needed adjustments
			var arrowCoord,
				maxVal;
			
			if (finalResult.side == 'top' || finalResult.side == 'bottom') {
				
				arrowCoord = {
					prop: 'left',
					val: finalResult.target - finalResult.coord.left
				};
				maxVal = finalResult.size.width - this.__options.minIntersection;
			}
			else {
				
				arrowCoord = {
					prop: 'top',
					val: finalResult.target - finalResult.coord.top
				};
				maxVal = finalResult.size.height - this.__options.minIntersection;
			}
			
			// cannot lie beyond the boundaries of the tooltip, minus the
			// arrow margin
			if (arrowCoord.val < this.__options.minIntersection) {
				arrowCoord.val = this.__options.minIntersection;
			}
			else if (arrowCoord.val > maxVal) {
				arrowCoord.val = maxVal;
			}
			
			var originParentOffset;
			
			// let's convert the window-relative coordinates into coordinates relative to the
			// future positioned parent that the tooltip will be appended to
			if (helper.geo.origin.fixedLineage) {
				
				// same as windowOffset when the position is fixed
				originParentOffset = helper.geo.origin.windowOffset;
			}
			else {
				
				// this assumes that the parent of the tooltip is located at
				// (0, 0) in the document, typically like when the parent is
				// <body>.
				// If we ever allow other types of parent, .tooltipster-ruler
				// will have to be appended to the parent to inherit css style
				// values that affect the display of the text and such.
				originParentOffset = {
					left: helper.geo.origin.windowOffset.left + helper.geo.window.scroll.left,
					top: helper.geo.origin.windowOffset.top + helper.geo.window.scroll.top
				};
			}
			
			finalResult.coord = {
				left: originParentOffset.left + (finalResult.coord.left - helper.geo.origin.windowOffset.left),
				top: originParentOffset.top + (finalResult.coord.top - helper.geo.origin.windowOffset.top)
			};
			
			// set position values on the original tooltip element
			
			self.__sideChange(self.__instance._$tooltip, finalResult.side);
			
			if (helper.geo.origin.fixedLineage) {
				self.__instance._$tooltip
					.css('position', 'fixed');
			}
			else {
				// CSS default
				self.__instance._$tooltip
					.css('position', '');
			}
			
			self.__instance._$tooltip
				.css({
					left: finalResult.coord.left,
					top: finalResult.coord.top,
					// we need to set a size even if the tooltip is in its natural size
					// because when the tooltip is positioned beyond the width of the body
					// (which is by default the width of the window; it will happen when
					// you scroll the window horizontally to get to the origin), its text
					// content will otherwise break lines at each word to keep up with the
					// body overflow strategy.
					height: finalResult.size.height,
					width: finalResult.size.width
				})
				.find('.tooltipster-arrow')
					.css({
						'left': '',
						'top': ''
					})
					.css(arrowCoord.prop, arrowCoord.val);
			
			// append the tooltip HTML element to its parent
			self.__instance._$tooltip.appendTo(self.__instance.option('parent'));
			
			self.__instance._trigger({
				type: 'repositioned',
				event: event,
				position: finalResult
			});
		},
		
		/**
		 * Make whatever modifications are needed when the side is changed. This has
		 * been made an independant method for easy inheritance in custom plugins based
		 * on this default plugin.
		 *
		 * @param {object} $obj
		 * @param {string} side
		 * @private
		 */
		__sideChange: function($obj, side) {
			
			$obj
				.removeClass('tooltipster-bottom')
				.removeClass('tooltipster-left')
				.removeClass('tooltipster-right')
				.removeClass('tooltipster-top')
				.addClass('tooltipster-'+ side);
		},
		
		/**
		 * Returns the target that the tooltip should aim at for a given side.
		 * The calculated value is a distance from the edge of the window
		 * (left edge for top/bottom sides, top edge for left/right side). The
		 * tooltip will be centered on that position and the arrow will be
		 * positioned there (as much as possible).
		 *
		 * @param {object} helper
		 * @return {integer}
		 * @private
		 */
		__targetFind: function(helper) {
			
			var target = {},
				rects = this.__instance._$origin[0].getClientRects();
			
			// these lines fix a Chrome bug (issue #491)
			if (rects.length > 1) {
				var opacity = this.__instance._$origin.css('opacity');
				if(opacity == 1) {
					this.__instance._$origin.css('opacity', 0.99);
					rects = this.__instance._$origin[0].getClientRects();
					this.__instance._$origin.css('opacity', 1);
				}
			}
			
			// by default, the target will be the middle of the origin
			if (rects.length < 2) {
				
				target.top = Math.floor(helper.geo.origin.windowOffset.left + (helper.geo.origin.size.width / 2));
				target.bottom = target.top;
				
				target.left = Math.floor(helper.geo.origin.windowOffset.top + (helper.geo.origin.size.height / 2));
				target.right = target.left;
			}
			// if multiple client rects exist, the element may be text split
			// up into multiple lines and the middle of the origin may not be
			// best option anymore. We need to choose the best target client rect
			else {
				
				// top: the first
				var targetRect = rects[0];
				target.top = Math.floor(targetRect.left + (targetRect.right - targetRect.left) / 2);
		
				// right: the middle line, rounded down in case there is an even
				// number of lines (looks more centered => check out the
				// demo with 4 split lines)
				if (rects.length > 2) {
					targetRect = rects[Math.ceil(rects.length / 2) - 1];
				}
				else {
					targetRect = rects[0];
				}
				target.right = Math.floor(targetRect.top + (targetRect.bottom - targetRect.top) / 2);
		
				// bottom: the last
				targetRect = rects[rects.length - 1];
				target.bottom = Math.floor(targetRect.left + (targetRect.right - targetRect.left) / 2);
		
				// left: the middle line, rounded up
				if (rects.length > 2) {
					targetRect = rects[Math.ceil((rects.length + 1) / 2) - 1];
				}
				else {
					targetRect = rects[rects.length - 1];
				}
				
				target.left = Math.floor(targetRect.top + (targetRect.bottom - targetRect.top) / 2);
			}
			
			return target;
		}
	}
});

/* a build task will add "return $;" here */
return $;

}));

/**
 * jquery.mask.js
 * @version: v1.14.12
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at http://blog.igorescobar.com
 *
 * Copyright (c) 2012 Igor Escobar http://blog.igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* jshint laxbreak: true */
/* jshint maxcomplexity:17 */
/* global define */

'use strict';

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
(function (factory, jQuery, Zepto) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }

}(function ($) {

    var Mask = function (el, mask, options) {

        var p = {
            invalid: [],
            getCaret: function () {
                try {
                    var sel,
                        pos = 0,
                        ctrl = el.get(0),
                        dSel = document.selection,
                        cSelStart = ctrl.selectionStart;

                    // IE Support
                    if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                        sel = dSel.createRange();
                        sel.moveStart('character', -p.val().length);
                        pos = sel.text.length;
                    }
                    // Firefox support
                    else if (cSelStart || cSelStart === '0') {
                        pos = cSelStart;
                    }

                    return pos;
                } catch (e) {}
            },
            setCaret: function(pos) {
                try {
                    if (el.is(':focus')) {
                        var range, ctrl = el.get(0);

                        // Firefox, WebKit, etc..
                        if (ctrl.setSelectionRange) {
                            ctrl.setSelectionRange(pos, pos);
                        } else { // IE
                            range = ctrl.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }
                } catch (e) {}
            },
            events: function() {
                el
                .on('keydown.mask', function(e) {
                    el.data('mask-keycode', e.keyCode || e.which);
                    el.data('mask-previus-value', el.val());
                    el.data('mask-previus-caret-pos', p.getCaret());
                    p.maskDigitPosMapOld = p.maskDigitPosMap;
                })
                .on($.jMaskGlobals.useInput ? 'input.mask' : 'keyup.mask', p.behaviour)
                .on('paste.mask drop.mask', function() {
                    setTimeout(function() {
                        el.keydown().keyup();
                    }, 100);
                })
                .on('change.mask', function(){
                    el.data('changed', true);
                })
                .on('blur.mask', function(){
                    if (oldValue !== p.val() && !el.data('changed')) {
                        el.trigger('change');
                    }
                    el.data('changed', false);
                })
                // it's very important that this callback remains in this position
                // otherwhise oldValue it's going to work buggy
                .on('blur.mask', function() {
                    oldValue = p.val();
                })
                // select all text on focus
                .on('focus.mask', function (e) {
                    if (options.selectOnFocus === true) {
                        $(e.target).select();
                    }
                })
                // clear the value if it not complete the mask
                .on('focusout.mask', function() {
                    if (options.clearIfNotMatch && !regexMask.test(p.val())) {
                       p.val('');
                   }
                });
            },
            getRegexMask: function() {
                var maskChunks = [], translation, pattern, optional, recursive, oRecursive, r;

                for (var i = 0; i < mask.length; i++) {
                    translation = jMask.translation[mask.charAt(i)];

                    if (translation) {

                        pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                        optional = translation.optional;
                        recursive = translation.recursive;

                        if (recursive) {
                            maskChunks.push(mask.charAt(i));
                            oRecursive = {digit: mask.charAt(i), pattern: pattern};
                        } else {
                            maskChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
                        }

                    } else {
                        maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                    }
                }

                r = maskChunks.join('');

                if (oRecursive) {
                    r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                         .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
                }

                return new RegExp(r);
            },
            destroyEvents: function() {
                el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
            },
            val: function(v) {
                var isInput = el.is('input'),
                    method = isInput ? 'val' : 'text',
                    r;

                if (arguments.length > 0) {
                    if (el[method]() !== v) {
                        el[method](v);
                    }
                    r = el;
                } else {
                    r = el[method]();
                }

                return r;
            },
            calculateCaretPosition: function() {
                var oldVal = el.data('mask-previus-value') || '',
                    newVal = p.getMasked(),
                    caretPosNew = p.getCaret();
                if (oldVal !== newVal) {
                    var caretPosOld = el.data('mask-previus-caret-pos') || 0,
                        newValL = newVal.length,
                        oldValL = oldVal.length,
                        maskDigitsBeforeCaret = 0,
                        maskDigitsAfterCaret = 0,
                        maskDigitsBeforeCaretAll = 0,
                        maskDigitsBeforeCaretAllOld = 0,
                        i = 0;

                    for (i = caretPosNew; i < newValL; i++) {
                        if (!p.maskDigitPosMap[i]) {
                            break;
                        }
                        maskDigitsAfterCaret++;
                    }

                    for (i = caretPosNew - 1; i >= 0; i--) {
                        if (!p.maskDigitPosMap[i]) {
                            break;
                        }
                        maskDigitsBeforeCaret++;
                    }

                    for (i = caretPosNew - 1; i >= 0; i--) {
                        if (p.maskDigitPosMap[i]) {
                            maskDigitsBeforeCaretAll++;
                        }
                    }

                    for (i = caretPosOld - 1; i >= 0; i--) {
                        if (p.maskDigitPosMapOld[i]) {
                            maskDigitsBeforeCaretAllOld++;
                        }
                    }

                    // if the cursor is at the end keep it there
                    if (caretPosNew > oldValL) {
                      caretPosNew = newValL * 10;
                    } else if (caretPosOld >= caretPosNew && caretPosOld !== oldValL) {
                        if (!p.maskDigitPosMapOld[caretPosNew])  {
                          var caretPos = caretPosNew;
                          caretPosNew -= maskDigitsBeforeCaretAllOld - maskDigitsBeforeCaretAll;
                          caretPosNew -= maskDigitsBeforeCaret;
                          if (p.maskDigitPosMap[caretPosNew])  {
                            caretPosNew = caretPos;
                          }
                        }
                    }
                    else if (caretPosNew > caretPosOld) {
                        caretPosNew += maskDigitsBeforeCaretAll - maskDigitsBeforeCaretAllOld;
                        caretPosNew += maskDigitsAfterCaret;
                    }
                }
                return caretPosNew;
            },
            behaviour: function(e) {
                e = e || window.event;
                p.invalid = [];

                var keyCode = el.data('mask-keycode');

                if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
                    var newVal   = p.getMasked(),
                        caretPos = p.getCaret();

                    // this is a compensation to devices/browsers that don't compensate
                    // caret positioning the right way
                    setTimeout(function() {
                      p.setCaret(p.calculateCaretPosition());
                    }, 10);

                    p.val(newVal);
                    p.setCaret(caretPos);
                    return p.callbacks(e);
                }
            },
            getMasked: function(skipMaskChars, val) {
                var buf = [],
                    value = val === undefined ? p.val() : val + '',
                    m = 0, maskLen = mask.length,
                    v = 0, valLen = value.length,
                    offset = 1, addMethod = 'push',
                    resetPos = -1,
                    maskDigitCount = 0,
                    maskDigitPosArr = [],
                    lastMaskChar,
                    check;

                if (options.reverse) {
                    addMethod = 'unshift';
                    offset = -1;
                    lastMaskChar = 0;
                    m = maskLen - 1;
                    v = valLen - 1;
                    check = function () {
                        return m > -1 && v > -1;
                    };
                } else {
                    lastMaskChar = maskLen - 1;
                    check = function () {
                        return m < maskLen && v < valLen;
                    };
                }

                var lastUntranslatedMaskChar;
                while (check()) {
                    var maskDigit = mask.charAt(m),
                        valDigit = value.charAt(v),
                        translation = jMask.translation[maskDigit];

                    if (translation) {
                        if (valDigit.match(translation.pattern)) {
                            buf[addMethod](valDigit);
                             if (translation.recursive) {
                                if (resetPos === -1) {
                                    resetPos = m;
                                } else if (m === lastMaskChar) {
                                    m = resetPos - offset;
                                }

                                if (lastMaskChar === resetPos) {
                                    m -= offset;
                                }
                            }
                            m += offset;
                        } else if (valDigit === lastUntranslatedMaskChar) {
                            // matched the last untranslated (raw) mask character that we encountered
                            // likely an insert offset the mask character from the last entry; fall
                            // through and only increment v
                            maskDigitCount--;
                            lastUntranslatedMaskChar = undefined;
                        } else if (translation.optional) {
                            m += offset;
                            v -= offset;
                        } else if (translation.fallback) {
                            buf[addMethod](translation.fallback);
                            m += offset;
                            v -= offset;
                        } else {
                          p.invalid.push({p: v, v: valDigit, e: translation.pattern});
                        }
                        v += offset;
                    } else {
                        if (!skipMaskChars) {
                            buf[addMethod](maskDigit);
                        }

                        if (valDigit === maskDigit) {
                            maskDigitPosArr.push(v);
                            v += offset;
                        } else {
                            lastUntranslatedMaskChar = maskDigit;
                            maskDigitPosArr.push(v + maskDigitCount);
                            maskDigitCount++;
                        }

                        m += offset;
                    }
                }

                var lastMaskCharDigit = mask.charAt(lastMaskChar);
                if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
                    buf.push(lastMaskCharDigit);
                }

                var newVal = buf.join('');
                p.mapMaskdigitPositions(newVal, maskDigitPosArr, valLen);
                return newVal;
            },
            mapMaskdigitPositions: function(newVal, maskDigitPosArr, valLen) {
              var maskDiff = options.reverse ? newVal.length - valLen : 0;
              p.maskDigitPosMap = {};
              for (var i = 0; i < maskDigitPosArr.length; i++) {
                p.maskDigitPosMap[maskDigitPosArr[i] + maskDiff] = 1;
              }
            },
            callbacks: function (e) {
                var val = p.val(),
                    changed = val !== oldValue,
                    defaultArgs = [val, e, el, options],
                    callback = function(name, criteria, args) {
                        if (typeof options[name] === 'function' && criteria) {
                            options[name].apply(this, args);
                        }
                    };

                callback('onChange', changed === true, defaultArgs);
                callback('onKeyPress', changed === true, defaultArgs);
                callback('onComplete', val.length === mask.length, defaultArgs);
                callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
            }
        };

        el = $(el);
        var jMask = this, oldValue = p.val(), regexMask;

        mask = typeof mask === 'function' ? mask(p.val(), undefined, el,  options) : mask;

        // public methods
        jMask.mask = mask;
        jMask.options = options;
        jMask.remove = function() {
            var caret = p.getCaret();
            p.destroyEvents();
            p.val(jMask.getCleanVal());
            p.setCaret(caret);
            return el;
        };

        // get value without mask
        jMask.getCleanVal = function() {
           return p.getMasked(true);
        };

        // get masked value without the value being in the input or element
        jMask.getMaskedVal = function(val) {
           return p.getMasked(false, val);
        };

       jMask.init = function(onlyMask) {
            onlyMask = onlyMask || false;
            options = options || {};

            jMask.clearIfNotMatch  = $.jMaskGlobals.clearIfNotMatch;
            jMask.byPassKeys       = $.jMaskGlobals.byPassKeys;
            jMask.translation      = $.extend({}, $.jMaskGlobals.translation, options.translation);

            jMask = $.extend(true, {}, jMask, options);

            regexMask = p.getRegexMask();

            if (onlyMask) {
                p.events();
                p.val(p.getMasked());
            } else {
                if (options.placeholder) {
                    el.attr('placeholder' , options.placeholder);
                }

                // this is necessary, otherwise if the user submit the form
                // and then press the "back" button, the autocomplete will erase
                // the data. Works fine on IE9+, FF, Opera, Safari.
                if (el.data('mask')) {
                  el.attr('autocomplete', 'off');
                }

                // detect if is necessary let the user type freely.
                // for is a lot faster than forEach.
                for (var i = 0, maxlength = true; i < mask.length; i++) {
                    var translation = jMask.translation[mask.charAt(i)];
                    if (translation && translation.recursive) {
                        maxlength = false;
                        break;
                    }
                }

                if (maxlength) {
                    el.attr('maxlength', mask.length);
                }

                p.destroyEvents();
                p.events();

                var caret = p.getCaret();
                p.val(p.getMasked());
                p.setCaret(caret);
            }
        };

        jMask.init(!el.is('input'));
    };

    $.maskWatchers = {};
    var HTMLAttributes = function () {
        var input = $(this),
            options = {},
            prefix = 'data-mask-',
            mask = input.attr('data-mask');

        if (input.attr(prefix + 'reverse')) {
            options.reverse = true;
        }

        if (input.attr(prefix + 'clearifnotmatch')) {
            options.clearIfNotMatch = true;
        }

        if (input.attr(prefix + 'selectonfocus') === 'true') {
           options.selectOnFocus = true;
        }

        if (notSameMaskObject(input, mask, options)) {
            return input.data('mask', new Mask(this, mask, options));
        }
    },
    notSameMaskObject = function(field, mask, options) {
        options = options || {};
        var maskObject = $(field).data('mask'),
            stringify = JSON.stringify,
            value = $(field).val() || $(field).text();
        try {
            if (typeof mask === 'function') {
                mask = mask(value);
            }
            return typeof maskObject !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
        } catch (e) {}
    },
    eventSupported = function(eventName) {
        var el = document.createElement('div'), isSupported;

        eventName = 'on' + eventName;
        isSupported = (eventName in el);

        if ( !isSupported ) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] === 'function';
        }
        el = null;

        return isSupported;
    };

    $.fn.mask = function(mask, options) {
        options = options || {};
        var selector = this.selector,
            globals = $.jMaskGlobals,
            interval = globals.watchInterval,
            watchInputs = options.watchInputs || globals.watchInputs,
            maskFunction = function() {
                if (notSameMaskObject(this, mask, options)) {
                    return $(this).data('mask', new Mask(this, mask, options));
                }
            };

        $(this).each(maskFunction);

        if (selector && selector !== '' && watchInputs) {
            clearInterval($.maskWatchers[selector]);
            $.maskWatchers[selector] = setInterval(function(){
                $(document).find(selector).each(maskFunction);
            }, interval);
        }
        return this;
    };

    $.fn.masked = function(val) {
        return this.data('mask').getMaskedVal(val);
    };

    $.fn.unmask = function() {
        clearInterval($.maskWatchers[this.selector]);
        delete $.maskWatchers[this.selector];
        return this.each(function() {
            var dataMask = $(this).data('mask');
            if (dataMask) {
                dataMask.remove().removeData('mask');
            }
        });
    };

    $.fn.cleanVal = function() {
        return this.data('mask').getCleanVal();
    };

    $.applyDataMask = function(selector) {
        selector = selector || $.jMaskGlobals.maskElements;
        var $selector = (selector instanceof $) ? selector : $(selector);
        $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
    };

    var globals = {
        maskElements: 'input,td,span,div',
        dataMaskAttr: '*[data-mask]',
        dataMask: true,
        watchInterval: 300,
        watchInputs: true,
        // old versions of chrome dont work great with input event
        useInput: !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) && eventSupported('input'),
        watchDataMask: false,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            '0': {pattern: /\d/},
            '9': {pattern: /\d/, optional: true},
            '#': {pattern: /\d/, recursive: true},
            'A': {pattern: /[a-zA-Z0-9]/},
            'S': {pattern: /[a-zA-Z]/}
        }
    };

    $.jMaskGlobals = $.jMaskGlobals || {};
    globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

    // looking for inputs with data-mask attribute
    if (globals.dataMask) {
        $.applyDataMask();
    }

    setInterval(function() {
        if ($.jMaskGlobals.watchDataMask) {
            $.applyDataMask();
        }
    }, globals.watchInterval);
}, window.jQuery, window.Zepto));

/*!
 * jQuery Mousewheel 3.1.12
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

/*!
 * jScrollPane - v2.0.23 - 2016-01-28
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2014 Kelvin Luck
 * Dual licensed under the MIT or GPL licenses.
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){a.fn.jScrollPane=function(b){function c(b,c){function d(c){var f,h,j,k,l,o,p=!1,q=!1;if(N=c,void 0===O)l=b.scrollTop(),o=b.scrollLeft(),b.css({overflow:"hidden",padding:0}),P=b.innerWidth()+rb,Q=b.innerHeight(),b.width(P),O=a('<div class="jspPane" />').css("padding",qb).append(b.children()),R=a('<div class="jspContainer" />').css({width:P+"px",height:Q+"px"}).append(O).appendTo(b);else{if(b.css("width",""),p=N.stickToBottom&&A(),q=N.stickToRight&&B(),k=b.innerWidth()+rb!=P||b.outerHeight()!=Q,k&&(P=b.innerWidth()+rb,Q=b.innerHeight(),R.css({width:P+"px",height:Q+"px"})),!k&&sb==S&&O.outerHeight()==T)return void b.width(P);sb=S,O.css("width",""),b.width(P),R.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()}O.css("overflow","auto"),S=c.contentWidth?c.contentWidth:O[0].scrollWidth,T=O[0].scrollHeight,O.css("overflow",""),U=S/P,V=T/Q,W=V>1,X=U>1,X||W?(b.addClass("jspScrollable"),f=N.maintainPosition&&($||bb),f&&(h=y(),j=z()),e(),g(),i(),f&&(w(q?S-P:h,!1),v(p?T-Q:j,!1)),F(),C(),L(),N.enableKeyboardNavigation&&H(),N.clickOnTrack&&m(),J(),N.hijackInternalLinks&&K()):(b.removeClass("jspScrollable"),O.css({top:0,left:0,width:R.width()-rb}),D(),G(),I(),n()),N.autoReinitialise&&!pb?pb=setInterval(function(){d(N)},N.autoReinitialiseDelay):!N.autoReinitialise&&pb&&clearInterval(pb),l&&b.scrollTop(0)&&v(l,!1),o&&b.scrollLeft(0)&&w(o,!1),b.trigger("jsp-initialised",[X||W])}function e(){W&&(R.append(a('<div class="jspVerticalBar" />').append(a('<div class="jspCap jspCapTop" />'),a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragTop" />'),a('<div class="jspDragBottom" />'))),a('<div class="jspCap jspCapBottom" />'))),cb=R.find(">.jspVerticalBar"),db=cb.find(">.jspTrack"),Y=db.find(">.jspDrag"),N.showArrows&&(hb=a('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp",k(0,-1)).bind("click.jsp",E),ib=a('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp",k(0,1)).bind("click.jsp",E),N.arrowScrollOnHover&&(hb.bind("mouseover.jsp",k(0,-1,hb)),ib.bind("mouseover.jsp",k(0,1,ib))),j(db,N.verticalArrowPositions,hb,ib)),fb=Q,R.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function(){fb-=a(this).outerHeight()}),Y.hover(function(){Y.addClass("jspHover")},function(){Y.removeClass("jspHover")}).bind("mousedown.jsp",function(b){a("html").bind("dragstart.jsp selectstart.jsp",E),Y.addClass("jspActive");var c=b.pageY-Y.position().top;return a("html").bind("mousemove.jsp",function(a){p(a.pageY-c,!1)}).bind("mouseup.jsp mouseleave.jsp",o),!1}),f())}function f(){db.height(fb+"px"),$=0,eb=N.verticalGutter+db.outerWidth(),O.width(P-eb-rb);try{0===cb.position().left&&O.css("margin-left",eb+"px")}catch(a){}}function g(){X&&(R.append(a('<div class="jspHorizontalBar" />').append(a('<div class="jspCap jspCapLeft" />'),a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragLeft" />'),a('<div class="jspDragRight" />'))),a('<div class="jspCap jspCapRight" />'))),jb=R.find(">.jspHorizontalBar"),kb=jb.find(">.jspTrack"),_=kb.find(">.jspDrag"),N.showArrows&&(nb=a('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp",k(-1,0)).bind("click.jsp",E),ob=a('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp",k(1,0)).bind("click.jsp",E),N.arrowScrollOnHover&&(nb.bind("mouseover.jsp",k(-1,0,nb)),ob.bind("mouseover.jsp",k(1,0,ob))),j(kb,N.horizontalArrowPositions,nb,ob)),_.hover(function(){_.addClass("jspHover")},function(){_.removeClass("jspHover")}).bind("mousedown.jsp",function(b){a("html").bind("dragstart.jsp selectstart.jsp",E),_.addClass("jspActive");var c=b.pageX-_.position().left;return a("html").bind("mousemove.jsp",function(a){r(a.pageX-c,!1)}).bind("mouseup.jsp mouseleave.jsp",o),!1}),lb=R.innerWidth(),h())}function h(){R.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function(){lb-=a(this).outerWidth()}),kb.width(lb+"px"),bb=0}function i(){if(X&&W){var b=kb.outerHeight(),c=db.outerWidth();fb-=b,a(jb).find(">.jspCap:visible,>.jspArrow").each(function(){lb+=a(this).outerWidth()}),lb-=c,Q-=c,P-=b,kb.parent().append(a('<div class="jspCorner" />').css("width",b+"px")),f(),h()}X&&O.width(R.outerWidth()-rb+"px"),T=O.outerHeight(),V=T/Q,X&&(mb=Math.ceil(1/U*lb),mb>N.horizontalDragMaxWidth?mb=N.horizontalDragMaxWidth:mb<N.horizontalDragMinWidth&&(mb=N.horizontalDragMinWidth),_.width(mb+"px"),ab=lb-mb,s(bb)),W&&(gb=Math.ceil(1/V*fb),gb>N.verticalDragMaxHeight?gb=N.verticalDragMaxHeight:gb<N.verticalDragMinHeight&&(gb=N.verticalDragMinHeight),Y.height(gb+"px"),Z=fb-gb,q($))}function j(a,b,c,d){var e,f="before",g="after";"os"==b&&(b=/Mac/.test(navigator.platform)?"after":"split"),b==f?g=b:b==g&&(f=b,e=c,c=d,d=e),a[f](c)[g](d)}function k(a,b,c){return function(){return l(a,b,this,c),this.blur(),!1}}function l(b,c,d,e){d=a(d).addClass("jspActive");var f,g,h=!0,i=function(){0!==b&&tb.scrollByX(b*N.arrowButtonSpeed),0!==c&&tb.scrollByY(c*N.arrowButtonSpeed),g=setTimeout(i,h?N.initialDelay:N.arrowRepeatFreq),h=!1};i(),f=e?"mouseout.jsp":"mouseup.jsp",e=e||a("html"),e.bind(f,function(){d.removeClass("jspActive"),g&&clearTimeout(g),g=null,e.unbind(f)})}function m(){n(),W&&db.bind("mousedown.jsp",function(b){if(void 0===b.originalTarget||b.originalTarget==b.currentTarget){var c,d=a(this),e=d.offset(),f=b.pageY-e.top-$,g=!0,h=function(){var a=d.offset(),e=b.pageY-a.top-gb/2,j=Q*N.scrollPagePercent,k=Z*j/(T-Q);if(0>f)$-k>e?tb.scrollByY(-j):p(e);else{if(!(f>0))return void i();e>$+k?tb.scrollByY(j):p(e)}c=setTimeout(h,g?N.initialDelay:N.trackClickRepeatFreq),g=!1},i=function(){c&&clearTimeout(c),c=null,a(document).unbind("mouseup.jsp",i)};return h(),a(document).bind("mouseup.jsp",i),!1}}),X&&kb.bind("mousedown.jsp",function(b){if(void 0===b.originalTarget||b.originalTarget==b.currentTarget){var c,d=a(this),e=d.offset(),f=b.pageX-e.left-bb,g=!0,h=function(){var a=d.offset(),e=b.pageX-a.left-mb/2,j=P*N.scrollPagePercent,k=ab*j/(S-P);if(0>f)bb-k>e?tb.scrollByX(-j):r(e);else{if(!(f>0))return void i();e>bb+k?tb.scrollByX(j):r(e)}c=setTimeout(h,g?N.initialDelay:N.trackClickRepeatFreq),g=!1},i=function(){c&&clearTimeout(c),c=null,a(document).unbind("mouseup.jsp",i)};return h(),a(document).bind("mouseup.jsp",i),!1}})}function n(){kb&&kb.unbind("mousedown.jsp"),db&&db.unbind("mousedown.jsp")}function o(){a("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp"),Y&&Y.removeClass("jspActive"),_&&_.removeClass("jspActive")}function p(c,d){if(W){0>c?c=0:c>Z&&(c=Z);var e=new a.Event("jsp-will-scroll-y");if(b.trigger(e,[c]),!e.isDefaultPrevented()){var f=c||0,g=0===f,h=f==Z,i=c/Z,j=-i*(T-Q);void 0===d&&(d=N.animateScroll),d?tb.animate(Y,"top",c,q,function(){b.trigger("jsp-user-scroll-y",[-j,g,h])}):(Y.css("top",c),q(c),b.trigger("jsp-user-scroll-y",[-j,g,h]))}}}function q(a){void 0===a&&(a=Y.position().top),R.scrollTop(0),$=a||0;var c=0===$,d=$==Z,e=a/Z,f=-e*(T-Q);(ub!=c||wb!=d)&&(ub=c,wb=d,b.trigger("jsp-arrow-change",[ub,wb,vb,xb])),t(c,d),O.css("top",f),b.trigger("jsp-scroll-y",[-f,c,d]).trigger("scroll")}function r(c,d){if(X){0>c?c=0:c>ab&&(c=ab);var e=new a.Event("jsp-will-scroll-x");if(b.trigger(e,[c]),!e.isDefaultPrevented()){var f=c||0,g=0===f,h=f==ab,i=c/ab,j=-i*(S-P);void 0===d&&(d=N.animateScroll),d?tb.animate(_,"left",c,s,function(){b.trigger("jsp-user-scroll-x",[-j,g,h])}):(_.css("left",c),s(c),b.trigger("jsp-user-scroll-x",[-j,g,h]))}}}function s(a){void 0===a&&(a=_.position().left),R.scrollTop(0),bb=a||0;var c=0===bb,d=bb==ab,e=a/ab,f=-e*(S-P);(vb!=c||xb!=d)&&(vb=c,xb=d,b.trigger("jsp-arrow-change",[ub,wb,vb,xb])),u(c,d),O.css("left",f),b.trigger("jsp-scroll-x",[-f,c,d]).trigger("scroll")}function t(a,b){N.showArrows&&(hb[a?"addClass":"removeClass"]("jspDisabled"),ib[b?"addClass":"removeClass"]("jspDisabled"))}function u(a,b){N.showArrows&&(nb[a?"addClass":"removeClass"]("jspDisabled"),ob[b?"addClass":"removeClass"]("jspDisabled"))}function v(a,b){var c=a/(T-Q);p(c*Z,b)}function w(a,b){var c=a/(S-P);r(c*ab,b)}function x(b,c,d){var e,f,g,h,i,j,k,l,m,n=0,o=0;try{e=a(b)}catch(p){return}for(f=e.outerHeight(),g=e.outerWidth(),R.scrollTop(0),R.scrollLeft(0);!e.is(".jspPane");)if(n+=e.position().top,o+=e.position().left,e=e.offsetParent(),/^body|html$/i.test(e[0].nodeName))return;h=z(),j=h+Q,h>n||c?l=n-N.horizontalGutter:n+f>j&&(l=n-Q+f+N.horizontalGutter),isNaN(l)||v(l,d),i=y(),k=i+P,i>o||c?m=o-N.horizontalGutter:o+g>k&&(m=o-P+g+N.horizontalGutter),isNaN(m)||w(m,d)}function y(){return-O.position().left}function z(){return-O.position().top}function A(){var a=T-Q;return a>20&&a-z()<10}function B(){var a=S-P;return a>20&&a-y()<10}function C(){R.unbind(zb).bind(zb,function(a,b,c,d){bb||(bb=0),$||($=0);var e=bb,f=$,g=a.deltaFactor||N.mouseWheelSpeed;return tb.scrollBy(c*g,-d*g,!1),e==bb&&f==$})}function D(){R.unbind(zb)}function E(){return!1}function F(){O.find(":input,a").unbind("focus.jsp").bind("focus.jsp",function(a){x(a.target,!1)})}function G(){O.find(":input,a").unbind("focus.jsp")}function H(){function c(){var a=bb,b=$;switch(d){case 40:tb.scrollByY(N.keyboardSpeed,!1);break;case 38:tb.scrollByY(-N.keyboardSpeed,!1);break;case 34:case 32:tb.scrollByY(Q*N.scrollPagePercent,!1);break;case 33:tb.scrollByY(-Q*N.scrollPagePercent,!1);break;case 39:tb.scrollByX(N.keyboardSpeed,!1);break;case 37:tb.scrollByX(-N.keyboardSpeed,!1)}return e=a!=bb||b!=$}var d,e,f=[];X&&f.push(jb[0]),W&&f.push(cb[0]),O.bind("focus.jsp",function(){b.focus()}),b.attr("tabindex",0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp",function(b){if(b.target===this||f.length&&a(b.target).closest(f).length){var g=bb,h=$;switch(b.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:d=b.keyCode,c();break;case 35:v(T-Q),d=null;break;case 36:v(0),d=null}return e=b.keyCode==d&&g!=bb||h!=$,!e}}).bind("keypress.jsp",function(b){return b.keyCode==d&&c(),b.target===this||f.length&&a(b.target).closest(f).length?!e:void 0}),N.hideFocus?(b.css("outline","none"),"hideFocus"in R[0]&&b.attr("hideFocus",!0)):(b.css("outline",""),"hideFocus"in R[0]&&b.attr("hideFocus",!1))}function I(){b.attr("tabindex","-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp"),O.unbind(".jsp")}function J(){if(location.hash&&location.hash.length>1){var b,c,d=escape(location.hash.substr(1));try{b=a("#"+d+', a[name="'+d+'"]')}catch(e){return}b.length&&O.find(d)&&(0===R.scrollTop()?c=setInterval(function(){R.scrollTop()>0&&(x(b,!0),a(document).scrollTop(R.position().top),clearInterval(c))},50):(x(b,!0),a(document).scrollTop(R.position().top)))}}function K(){a(document.body).data("jspHijack")||(a(document.body).data("jspHijack",!0),a(document.body).delegate('a[href*="#"]',"click",function(b){var c,d,e,f,g,h,i=this.href.substr(0,this.href.indexOf("#")),j=location.href;if(-1!==location.href.indexOf("#")&&(j=location.href.substr(0,location.href.indexOf("#"))),i===j){c=escape(this.href.substr(this.href.indexOf("#")+1));try{d=a("#"+c+', a[name="'+c+'"]')}catch(k){return}d.length&&(e=d.closest(".jspScrollable"),f=e.data("jsp"),f.scrollToElement(d,!0),e[0].scrollIntoView&&(g=a(window).scrollTop(),h=d.offset().top,(g>h||h>g+a(window).height())&&e[0].scrollIntoView()),b.preventDefault())}}))}function L(){var a,b,c,d,e,f=!1;R.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp",function(g){var h=g.originalEvent.touches[0];a=y(),b=z(),c=h.pageX,d=h.pageY,e=!1,f=!0}).bind("touchmove.jsp",function(g){if(f){var h=g.originalEvent.touches[0],i=bb,j=$;return tb.scrollTo(a+c-h.pageX,b+d-h.pageY),e=e||Math.abs(c-h.pageX)>5||Math.abs(d-h.pageY)>5,i==bb&&j==$}}).bind("touchend.jsp",function(){f=!1}).bind("click.jsp-touchclick",function(){return e?(e=!1,!1):void 0})}function M(){var a=z(),c=y();b.removeClass("jspScrollable").unbind(".jsp"),O.unbind(".jsp"),b.replaceWith(yb.append(O.children())),yb.scrollTop(a),yb.scrollLeft(c),pb&&clearInterval(pb)}var N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_,ab,bb,cb,db,eb,fb,gb,hb,ib,jb,kb,lb,mb,nb,ob,pb,qb,rb,sb,tb=this,ub=!0,vb=!0,wb=!1,xb=!1,yb=b.clone(!1,!1).empty(),zb=a.fn.mwheelIntent?"mwheelIntent.jsp":"mousewheel.jsp";"border-box"===b.css("box-sizing")?(qb=0,rb=0):(qb=b.css("paddingTop")+" "+b.css("paddingRight")+" "+b.css("paddingBottom")+" "+b.css("paddingLeft"),rb=(parseInt(b.css("paddingLeft"),10)||0)+(parseInt(b.css("paddingRight"),10)||0)),a.extend(tb,{reinitialise:function(b){b=a.extend({},N,b),d(b)},scrollToElement:function(a,b,c){x(a,b,c)},scrollTo:function(a,b,c){w(a,c),v(b,c)},scrollToX:function(a,b){w(a,b)},scrollToY:function(a,b){v(a,b)},scrollToPercentX:function(a,b){w(a*(S-P),b)},scrollToPercentY:function(a,b){v(a*(T-Q),b)},scrollBy:function(a,b,c){tb.scrollByX(a,c),tb.scrollByY(b,c)},scrollByX:function(a,b){var c=y()+Math[0>a?"floor":"ceil"](a),d=c/(S-P);r(d*ab,b)},scrollByY:function(a,b){var c=z()+Math[0>a?"floor":"ceil"](a),d=c/(T-Q);p(d*Z,b)},positionDragX:function(a,b){r(a,b)},positionDragY:function(a,b){p(a,b)},animate:function(a,b,c,d,e){var f={};f[b]=c,a.animate(f,{duration:N.animateDuration,easing:N.animateEase,queue:!1,step:d,complete:e})},getContentPositionX:function(){return y()},getContentPositionY:function(){return z()},getContentWidth:function(){return S},getContentHeight:function(){return T},getPercentScrolledX:function(){return y()/(S-P)},getPercentScrolledY:function(){return z()/(T-Q)},getIsScrollableH:function(){return X},getIsScrollableV:function(){return W},getContentPane:function(){return O},scrollToBottom:function(a){p(Z,a)},hijackInternalLinks:a.noop,destroy:function(){M()}}),d(c)}return b=a.extend({},a.fn.jScrollPane.defaults,b),a.each(["arrowButtonSpeed","trackClickSpeed","keyboardSpeed"],function(){b[this]=b[this]||b.speed}),this.each(function(){var d=a(this),e=d.data("jsp");e?e.reinitialise(b):(a("script",d).filter('[type="text/javascript"],:not([type])').remove(),e=new c(d,b),d.data("jsp",e))})},a.fn.jScrollPane.defaults={showArrows:!1,maintainPosition:!0,stickToBottom:!1,stickToRight:!1,clickOnTrack:!0,autoReinitialise:!1,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,contentWidth:void 0,animateScroll:!1,animateDuration:300,animateEase:"linear",hijackInternalLinks:!1,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:3,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:!1,trackClickSpeed:0,trackClickRepeatFreq:70,verticalArrowPositions:"split",horizontalArrowPositions:"split",enableKeyboardNavigation:!0,hideFocus:!1,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:.8}});
/*!
 * 
 *             SimpleBar.js - v2.4.3
 *             Scrollbars, simpler.
 *             https://grsmto.github.io/simplebar/
 *             
 *             Made by Adrien Grsmto from a fork by Jonathan Nicol
 *             Under MIT License
 *         
 */
!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.SimpleBar=n():t.SimpleBar=n()}(this,function(){return function(t){function n(r){if(e[r])return e[r].exports;var i=e[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function t(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(n,e,r){return e&&t(n.prototype,e),r&&t(n,r),n}}(),c=e(194),s=r(c),u=e(191),a=r(u),f=e(193),l=r(f);e(169),e(174),e(177),e(178),e(172),e(175),e(173),e(176),e(170),e(171),e(113),e(160),e(179),e(180),e(142),e(143),e(144),e(145),e(148),e(146),e(147),e(149),e(150),e(151),e(152),e(154),e(153),e(141),e(168),e(138),e(139),e(140),e(112),e(165),e(163),e(161),e(166),e(167),e(162),e(164),e(155),e(156),e(157),e(159),e(158),e(110),e(111),e(106),e(109),e(108),e(107),e(66),e(132),e(133),e(135),e(134),e(131),e(137),e(136),e(114),e(115),e(116),e(117),e(118),e(119),e(120),e(121),e(122),e(123),e(125),e(124),e(126),e(127),e(128),e(129),e(130),e(181),e(184),e(182),e(183),e(186),e(185),e(189),e(188),e(187),e(192),e(190);var h=function(){function t(n,e){i(this,t),this.el=n,this.flashTimeout,this.contentEl,this.scrollContentEl,this.dragOffset={x:0,y:0},this.isVisible={x:!0,y:!0},this.scrollOffsetAttr={x:"scrollLeft",y:"scrollTop"},this.sizeAttr={x:"offsetWidth",y:"offsetHeight"},this.scrollSizeAttr={x:"scrollWidth",y:"scrollHeight"},this.offsetAttr={x:"left",y:"top"},this.globalObserver,this.mutationObserver,this.resizeObserver,this.currentAxis,this.options=Object.assign({},t.defaultOptions,e),this.classNames=this.options.classNames,this.scrollbarWidth=(0,s.default)(),this.offsetSize=20,this.flashScrollbar=this.flashScrollbar.bind(this),this.onDragY=this.onDragY.bind(this),this.onDragX=this.onDragX.bind(this),this.onScrollY=this.onScrollY.bind(this),this.onScrollX=this.onScrollX.bind(this),this.drag=this.drag.bind(this),this.onEndDrag=this.onEndDrag.bind(this),this.onMouseEnter=this.onMouseEnter.bind(this),this.recalculate=(0,a.default)(this.recalculate,100,{leading:!0,trailing:!1}),this.init()}return o(t,[{key:"init",value:function(){this.el.SimpleBar=this,this.initDOM(),this.scrollbarX=this.trackX.querySelector("."+this.classNames.scrollbar),this.scrollbarY=this.trackY.querySelector("."+this.classNames.scrollbar),this.scrollContentEl.style.paddingRight=(this.scrollbarWidth||this.offsetSize)+"px",this.scrollContentEl.style.marginBottom="-"+(2*this.scrollbarWidth||this.offsetSize)+"px",this.contentEl.style.paddingBottom=(this.scrollbarWidth||this.offsetSize)+"px",0!==this.scrollbarWidth&&(this.contentEl.style.marginRight="-"+this.scrollbarWidth+"px"),this.recalculate(),this.initListeners()}},{key:"initDOM",value:function(){var t=this;if(Array.from(this.el.children).find(function(n){return n.classList.contains(t.classNames.scrollContent)}))this.trackX=this.el.querySelector("."+this.classNames.track+".horizontal"),this.trackY=this.el.querySelector("."+this.classNames.track+".vertical"),this.scrollContentEl=this.el.querySelector("."+this.classNames.scrollContent),this.contentEl=this.el.querySelector("."+this.classNames.content);else{for(this.scrollContentEl=document.createElement("div"),this.contentEl=document.createElement("div"),this.scrollContentEl.classList.add(this.classNames.scrollContent),this.contentEl.classList.add(this.classNames.content);this.el.firstChild;)this.contentEl.appendChild(this.el.firstChild);this.scrollContentEl.appendChild(this.contentEl),this.el.appendChild(this.scrollContentEl)}if(!this.trackX||!this.trackY){var n=document.createElement("div"),e=document.createElement("div");n.classList.add(this.classNames.track),e.classList.add(this.classNames.scrollbar),n.appendChild(e),this.trackX=n.cloneNode(!0),this.trackX.classList.add("horizontal"),this.trackY=n.cloneNode(!0),this.trackY.classList.add("vertical"),this.el.insertBefore(this.trackX,this.el.firstChild),this.el.insertBefore(this.trackY,this.el.firstChild)}this.el.setAttribute("data-simplebar","init")}},{key:"initListeners",value:function(){var t=this;this.options.autoHide&&this.el.addEventListener("mouseenter",this.onMouseEnter),this.scrollbarY.addEventListener("mousedown",this.onDragY),this.scrollbarX.addEventListener("mousedown",this.onDragX),this.scrollContentEl.addEventListener("scroll",this.onScrollY),this.contentEl.addEventListener("scroll",this.onScrollX),"undefined"!=typeof MutationObserver&&(this.mutationObserver=new MutationObserver(function(n){n.forEach(function(n){(t.isChildNode(n.target)||n.addedNodes.length)&&t.recalculate()})}),this.mutationObserver.observe(this.el,{attributes:!0,childList:!0,characterData:!0,subtree:!0})),this.resizeObserver=new l.default(this.recalculate.bind(this)),this.resizeObserver.observe(this.el)}},{key:"removeListeners",value:function(){this.options.autoHide&&this.el.removeEventListener("mouseenter",this.onMouseEnter),this.scrollbarX.removeEventListener("mousedown",this.onDragX),this.scrollbarY.removeEventListener("mousedown",this.onDragY),this.scrollContentEl.removeEventListener("scroll",this.onScrollY),this.contentEl.removeEventListener("scroll",this.onScrollX),this.mutationObserver.disconnect(),this.resizeObserver.disconnect()}},{key:"onDragX",value:function(t){this.onDrag(t,"x")}},{key:"onDragY",value:function(t){this.onDrag(t,"y")}},{key:"onDrag",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"y";t.preventDefault();var e="y"===n?this.scrollbarY:this.scrollbarX,r="y"===n?t.pageY:t.pageX;this.dragOffset[n]=r-e.getBoundingClientRect()[this.offsetAttr[n]],this.currentAxis=n,document.addEventListener("mousemove",this.drag),document.addEventListener("mouseup",this.onEndDrag)}},{key:"drag",value:function(t){var n=void 0,e=void 0,r=void 0;t.preventDefault(),"y"===this.currentAxis?(n=t.pageY,e=this.trackY,r=this.scrollContentEl):(n=t.pageX,e=this.trackX,r=this.contentEl);var i=n-e.getBoundingClientRect()[this.offsetAttr[this.currentAxis]]-this.dragOffset[this.currentAxis],o=i/e[this.sizeAttr[this.currentAxis]],c=o*this.contentEl[this.scrollSizeAttr[this.currentAxis]];r[this.scrollOffsetAttr[this.currentAxis]]=c}},{key:"onEndDrag",value:function(){document.removeEventListener("mousemove",this.drag),document.removeEventListener("mouseup",this.onEndDrag)}},{key:"resizeScrollbar",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"y",n=void 0,e=void 0,r=void 0,i=void 0,o=void 0;"x"===t?(n=this.trackX,e=this.scrollbarX,r=this.contentEl[this.scrollOffsetAttr[t]],i=this.contentSizeX,o=this.scrollbarXSize):(n=this.trackY,e=this.scrollbarY,r=this.scrollContentEl[this.scrollOffsetAttr[t]],i=this.contentSizeY,o=this.scrollbarYSize);var c=o/i,s=r/(i-o),u=Math.max(~~(c*(o-2))-2,this.options.scrollbarMinSize),a=~~((o-4-u)*s+2);this.isVisible[t]=o<i,this.isVisible[t]?(n.style.visibility="visible","x"===t?(e.style.left=a+"px",e.style.width=u+"px"):(e.style.top=a+"px",e.style.height=u+"px")):n.style.visibility="hidden"}},{key:"onScrollX",value:function(){this.flashScrollbar("x")}},{key:"onScrollY",value:function(){this.flashScrollbar("y")}},{key:"onMouseEnter",value:function(){this.flashScrollbar("x"),this.flashScrollbar("y")}},{key:"flashScrollbar",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"y";this.resizeScrollbar(t),this.showScrollbar(t)}},{key:"showScrollbar",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"y";this.isVisible[t]&&("x"===t?this.scrollbarX.classList.add("visible"):this.scrollbarY.classList.add("visible"),this.options.autoHide&&("number"==typeof this.flashTimeout&&window.clearTimeout(this.flashTimeout),this.flashTimeout=window.setTimeout(this.hideScrollbar.bind(this),1e3)))}},{key:"hideScrollbar",value:function(){this.scrollbarX.classList.remove("visible"),this.scrollbarY.classList.remove("visible"),"number"==typeof this.flashTimeout&&window.clearTimeout(this.flashTimeout)}},{key:"recalculate",value:function(){this.contentSizeX=this.contentEl[this.scrollSizeAttr.x],this.contentSizeY=this.contentEl[this.scrollSizeAttr.y]-(this.scrollbarWidth||this.offsetSize),this.scrollbarXSize=this.trackX[this.sizeAttr.x],this.scrollbarYSize=this.trackY[this.sizeAttr.y],this.resizeScrollbar("x"),this.resizeScrollbar("y"),this.options.autoHide||(this.showScrollbar("x"),this.showScrollbar("y"))}},{key:"getScrollElement",value:function(){return this.scrollContentEl}},{key:"getContentElement",value:function(){return this.contentEl}},{key:"unMount",value:function(){this.removeListeners(),this.el.SimpleBar=null}},{key:"isChildNode",value:function(t){return null!==t&&(t===this.el||this.isChildNode(t.parentNode))}}],[{key:"initHtmlApi",value:function(){this.initDOMLoadedElements=this.initDOMLoadedElements.bind(this),"undefined"!=typeof MutationObserver&&(this.globalObserver=new MutationObserver(function(n){n.forEach(function(n){Array.from(n.addedNodes).forEach(function(n){1===n.nodeType&&(n.hasAttribute("data-simplebar")?!n.SimpleBar&&new t(n,t.getElOptions(n)):Array.from(n.querySelectorAll("[data-simplebar]")).forEach(function(n){!n.SimpleBar&&new t(n,t.getElOptions(n))}))}),Array.from(n.removedNodes).forEach(function(t){1===t.nodeType&&(t.hasAttribute("data-simplebar")?t.SimpleBar&&t.SimpleBar.unMount():Array.from(t.querySelectorAll("[data-simplebar]")).forEach(function(t){t.SimpleBar&&t.SimpleBar.unMount()}))})})}),this.globalObserver.observe(document,{childList:!0,subtree:!0})),"complete"===document.readyState||"loading"!==document.readyState&&!document.documentElement.doScroll?window.setTimeout(this.initDOMLoadedElements.bind(this)):(document.addEventListener("DOMContentLoaded",this.initDOMLoadedElements),window.addEventListener("load",this.initDOMLoadedElements))}},{key:"getElOptions",value:function(n){var e=Object.keys(t.htmlAttributes).reduce(function(e,r){var i=t.htmlAttributes[r];return n.hasAttribute(i)&&(e[r]=JSON.parse(n.getAttribute(i)||!0)),e},{});return e}},{key:"removeObserver",value:function(){this.globalObserver.disconnect()}},{key:"initDOMLoadedElements",value:function(){document.removeEventListener("DOMContentLoaded",this.initDOMLoadedElements),window.removeEventListener("load",this.initDOMLoadedElements),Array.from(document.querySelectorAll("[data-simplebar]")).forEach(function(n){n.SimpleBar||new t(n,t.getElOptions(n))})}},{key:"defaultOptions",get:function(){return{autoHide:!0,classNames:{content:"simplebar-content",scrollContent:"simplebar-scroll-content",scrollbar:"simplebar-scrollbar",track:"simplebar-track"},scrollbarMinSize:25}}},{key:"htmlAttributes",get:function(){return{autoHide:"data-simplebar-autohide",scrollbarMinSize:"data-simplebar-scrollbar-min-size"}}}]),t}();n.default=h,h.initHtmlApi(),t.exports=n.default},function(t,n,e){var r=e(3),i=e(34),o=e(11),c=e(16),s=e(12),u="prototype",a=function(t,n,e){var f,l,h,v,p=t&a.F,d=t&a.G,y=t&a.S,g=t&a.P,m=t&a.B,b=d?r:y?r[n]||(r[n]={}):(r[n]||{})[u],_=d?i:i[n]||(i[n]={}),w=_[u]||(_[u]={});d&&(e=n);for(f in e)l=!p&&b&&void 0!==b[f],h=(l?b:e)[f],v=m&&l?s(h,r):g&&"function"==typeof h?s(Function.call,h):h,b&&c(b,f,h,t&a.U),_[f]!=h&&o(_,f,v),g&&w[f]!=h&&(w[f]=h)};r.core=i,a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a},function(t,n,e){var r=e(4);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n,e){var r=e(60)("wks"),i=e(22),o=e(3).Symbol,c="function"==typeof o,s=t.exports=function(t){return r[t]||(r[t]=c&&o[t]||(c?o:i)("Symbol."+t))};s.store=r},function(t,n){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,n,e){var r=e(2),i=e(71),o=e(40),c=Object.defineProperty;n.f=e(9)?Object.defineProperty:function(t,n,e){if(r(t),n=o(n,!0),r(e),i)try{return c(t,n,e)}catch(t){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},function(t,n,e){var r=e(20),i=Math.min;t.exports=function(t){return t>0?i(r(t),9007199254740991):0}},function(t,n,e){t.exports=!e(6)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},function(t,n,e){var r=e(7),i=e(19);t.exports=e(9)?function(t,n,e){return r.f(t,n,i(1,e))}:function(t,n,e){return t[n]=e,t}},function(t,n,e){var r=e(17);t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,i){return t.call(n,e,r,i)}}return function(){return t.apply(n,arguments)}}},function(t,n,e){var r=e(54),i=e(18);t.exports=function(t){return r(i(t))}},function(t,n,e){"use strict";if(e(9)){var r=e(27),i=e(3),o=e(6),c=e(1),s=e(64),u=e(88),a=e(12),f=e(24),l=e(19),h=e(11),v=e(29),p=e(20),d=e(8),y=e(87),g=e(31),m=e(40),b=e(10),_=e(49),w=e(4),S=e(21),x=e(55),E=e(36),O=e(38),M=e(37).f,A=e(65),L=e(22),j=e(5),k=e(33),T=e(48),P=e(61),F=e(66),N=e(26),C=e(44),R=e(46),D=e(47),I=e(67),W=e(7),z=e(15),B=W.f,Y=z.f,X=i.RangeError,G=i.TypeError,V=i.Uint8Array,U="ArrayBuffer",q="Shared"+U,H="BYTES_PER_ELEMENT",K="prototype",J=Array[K],$=u.ArrayBuffer,Q=u.DataView,Z=k(0),tt=k(2),nt=k(3),et=k(4),rt=k(5),it=k(6),ot=T(!0),ct=T(!1),st=F.values,ut=F.keys,at=F.entries,ft=J.lastIndexOf,lt=J.reduce,ht=J.reduceRight,vt=J.join,pt=J.sort,dt=J.slice,yt=J.toString,gt=J.toLocaleString,mt=j("iterator"),bt=j("toStringTag"),_t=L("typed_constructor"),wt=L("def_constructor"),St=s.CONSTR,xt=s.TYPED,Et=s.VIEW,Ot="Wrong length!",Mt=k(1,function(t,n){return Tt(P(t,t[wt]),n)}),At=o(function(){return 1===new V(new Uint16Array([1]).buffer)[0]}),Lt=!!V&&!!V[K].set&&o(function(){new V(1).set({})}),jt=function(t,n){var e=p(t);if(e<0||e%n)throw X("Wrong offset!");return e},kt=function(t){if(w(t)&&xt in t)return t;throw G(t+" is not a typed array!")},Tt=function(t,n){if(!(w(t)&&_t in t))throw G("It is not a typed array constructor!");return new t(n)},Pt=function(t,n){return Ft(P(t,t[wt]),n)},Ft=function(t,n){for(var e=0,r=n.length,i=Tt(t,r);r>e;)i[e]=n[e++];return i},Nt=function(t,n,e){B(t,n,{get:function(){return this._d[e]}})},Ct=function(t){var n,e,r,i,o,c,s=S(t),u=arguments.length,f=u>1?arguments[1]:void 0,l=void 0!==f,h=A(s);if(void 0!=h&&!x(h)){for(c=h.call(s),r=[],n=0;!(o=c.next()).done;n++)r.push(o.value);s=r}for(l&&u>2&&(f=a(f,arguments[2],2)),n=0,e=d(s.length),i=Tt(this,e);e>n;n++)i[n]=l?f(s[n],n):s[n];return i},Rt=function(){for(var t=0,n=arguments.length,e=Tt(this,n);n>t;)e[t]=arguments[t++];return e},Dt=!!V&&o(function(){gt.call(new V(1))}),It=function(){return gt.apply(Dt?dt.call(kt(this)):kt(this),arguments)},Wt={copyWithin:function(t,n){return I.call(kt(this),t,n,arguments.length>2?arguments[2]:void 0)},every:function(t){return et(kt(this),t,arguments.length>1?arguments[1]:void 0)},fill:function(t){return D.apply(kt(this),arguments)},filter:function(t){return Pt(this,tt(kt(this),t,arguments.length>1?arguments[1]:void 0))},find:function(t){return rt(kt(this),t,arguments.length>1?arguments[1]:void 0)},findIndex:function(t){return it(kt(this),t,arguments.length>1?arguments[1]:void 0)},forEach:function(t){Z(kt(this),t,arguments.length>1?arguments[1]:void 0)},indexOf:function(t){return ct(kt(this),t,arguments.length>1?arguments[1]:void 0)},includes:function(t){return ot(kt(this),t,arguments.length>1?arguments[1]:void 0)},join:function(t){return vt.apply(kt(this),arguments)},lastIndexOf:function(t){return ft.apply(kt(this),arguments)},map:function(t){return Mt(kt(this),t,arguments.length>1?arguments[1]:void 0)},reduce:function(t){return lt.apply(kt(this),arguments)},reduceRight:function(t){return ht.apply(kt(this),arguments)},reverse:function(){for(var t,n=this,e=kt(n).length,r=Math.floor(e/2),i=0;i<r;)t=n[i],n[i++]=n[--e],n[e]=t;return n},some:function(t){return nt(kt(this),t,arguments.length>1?arguments[1]:void 0)},sort:function(t){return pt.call(kt(this),t)},subarray:function(t,n){var e=kt(this),r=e.length,i=g(t,r);return new(P(e,e[wt]))(e.buffer,e.byteOffset+i*e.BYTES_PER_ELEMENT,d((void 0===n?r:g(n,r))-i))}},zt=function(t,n){return Pt(this,dt.call(kt(this),t,n))},Bt=function(t){kt(this);var n=jt(arguments[1],1),e=this.length,r=S(t),i=d(r.length),o=0;if(i+n>e)throw X(Ot);for(;o<i;)this[n+o]=r[o++]},Yt={entries:function(){return at.call(kt(this))},keys:function(){return ut.call(kt(this))},values:function(){return st.call(kt(this))}},Xt=function(t,n){return w(t)&&t[xt]&&"symbol"!=typeof n&&n in t&&String(+n)==String(n)},Gt=function(t,n){return Xt(t,n=m(n,!0))?l(2,t[n]):Y(t,n)},Vt=function(t,n,e){return!(Xt(t,n=m(n,!0))&&w(e)&&b(e,"value"))||b(e,"get")||b(e,"set")||e.configurable||b(e,"writable")&&!e.writable||b(e,"enumerable")&&!e.enumerable?B(t,n,e):(t[n]=e.value,t)};St||(z.f=Gt,W.f=Vt),c(c.S+c.F*!St,"Object",{getOwnPropertyDescriptor:Gt,defineProperty:Vt}),o(function(){yt.call({})})&&(yt=gt=function(){return vt.call(this)});var Ut=v({},Wt);v(Ut,Yt),h(Ut,mt,Yt.values),v(Ut,{slice:zt,set:Bt,constructor:function(){},toString:yt,toLocaleString:It}),Nt(Ut,"buffer","b"),Nt(Ut,"byteOffset","o"),Nt(Ut,"byteLength","l"),Nt(Ut,"length","e"),B(Ut,bt,{get:function(){return this[xt]}}),t.exports=function(t,n,e,u){u=!!u;var a=t+(u?"Clamped":"")+"Array",l="get"+t,v="set"+t,p=i[a],g=p||{},m=p&&O(p),b=!p||!s.ABV,S={},x=p&&p[K],A=function(t,e){var r=t._d;return r.v[l](e*n+r.o,At)},L=function(t,e,r){var i=t._d;u&&(r=(r=Math.round(r))<0?0:r>255?255:255&r),i.v[v](e*n+i.o,r,At)},j=function(t,n){B(t,n,{get:function(){return A(this,n)},set:function(t){return L(this,n,t)},enumerable:!0})};b?(p=e(function(t,e,r,i){f(t,p,a,"_d");var o,c,s,u,l=0,v=0;if(w(e)){if(!(e instanceof $||(u=_(e))==U||u==q))return xt in e?Ft(p,e):Ct.call(p,e);o=e,v=jt(r,n);var g=e.byteLength;if(void 0===i){if(g%n)throw X(Ot);if(c=g-v,c<0)throw X(Ot)}else if(c=d(i)*n,c+v>g)throw X(Ot);s=c/n}else s=y(e),c=s*n,o=new $(c);for(h(t,"_d",{b:o,o:v,l:c,e:s,v:new Q(o)});l<s;)j(t,l++)}),x=p[K]=E(Ut),h(x,"constructor",p)):o(function(){p(1)})&&o(function(){new p(-1)})&&C(function(t){new p,new p(null),new p(1.5),new p(t)},!0)||(p=e(function(t,e,r,i){f(t,p,a);var o;return w(e)?e instanceof $||(o=_(e))==U||o==q?void 0!==i?new g(e,jt(r,n),i):void 0!==r?new g(e,jt(r,n)):new g(e):xt in e?Ft(p,e):Ct.call(p,e):new g(y(e))}),Z(m!==Function.prototype?M(g).concat(M(m)):M(g),function(t){t in p||h(p,t,g[t])}),p[K]=x,r||(x.constructor=p));var k=x[mt],T=!!k&&("values"==k.name||void 0==k.name),P=Yt.values;h(p,_t,!0),h(x,xt,a),h(x,Et,!0),h(x,wt,p),(u?new p(1)[bt]==a:bt in x)||B(x,bt,{get:function(){return a}}),S[a]=p,c(c.G+c.W+c.F*(p!=g),S),c(c.S,a,{BYTES_PER_ELEMENT:n}),c(c.S+c.F*o(function(){g.of.call(p,1)}),a,{from:Ct,of:Rt}),H in x||h(x,H,n),c(c.P,a,Wt),R(a),c(c.P+c.F*Lt,a,{set:Bt}),c(c.P+c.F*!T,a,Yt),r||x.toString==yt||(x.toString=yt),c(c.P+c.F*o(function(){new p(1).slice()}),a,{slice:zt}),c(c.P+c.F*(o(function(){return[1,2].toLocaleString()!=new p([1,2]).toLocaleString()})||!o(function(){x.toLocaleString.call([1,2])})),a,{toLocaleString:It}),N[a]=T?k:P,r||T||h(x,mt,P)}}else t.exports=function(){}},function(t,n,e){var r=e(39),i=e(19),o=e(13),c=e(40),s=e(10),u=e(71),a=Object.getOwnPropertyDescriptor;n.f=e(9)?a:function(t,n){if(t=o(t),n=c(n,!0),u)try{return a(t,n)}catch(t){}if(s(t,n))return i(!r.f.call(t,n),t[n])}},function(t,n,e){var r=e(3),i=e(11),o=e(10),c=e(22)("src"),s="toString",u=Function[s],a=(""+u).split(s);e(34).inspectSource=function(t){return u.call(t)},(t.exports=function(t,n,e,s){var u="function"==typeof e;u&&(o(e,"name")||i(e,"name",n)),t[n]!==e&&(u&&(o(e,c)||i(e,c,t[n]?""+t[n]:a.join(String(n)))),t===r?t[n]=e:s?t[n]?t[n]=e:i(t,n,e):(delete t[n],i(t,n,e)))})(Function.prototype,s,function(){return"function"==typeof this&&this[c]||u.call(this)})},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},function(t,n,e){var r=e(18);t.exports=function(t){return Object(r(t))}},function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+r).toString(36))}},function(t,n,e){var r=e(5)("unscopables"),i=Array.prototype;void 0==i[r]&&e(11)(i,r,{}),t.exports=function(t){i[r][t]=!0}},function(t,n){t.exports=function(t,n,e,r){if(!(t instanceof n)||void 0!==r&&r in t)throw TypeError(e+": incorrect invocation!");return t}},function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},function(t,n){t.exports={}},function(t,n){t.exports=!1},function(t,n,e){var r=e(82),i=e(52);t.exports=Object.keys||function(t){return r(t,i)}},function(t,n,e){var r=e(16);t.exports=function(t,n,e){for(var i in n)r(t,i,n[i],e);return t}},function(t,n,e){var r=e(7).f,i=e(10),o=e(5)("toStringTag");t.exports=function(t,n,e){t&&!i(t=e?t:t.prototype,o)&&r(t,o,{configurable:!0,value:n})}},function(t,n,e){var r=e(20),i=Math.max,o=Math.min;t.exports=function(t,n){return t=r(t),t<0?i(t+n,0):o(t,n)}},function(t,n,e){var r=e(4);t.exports=function(t,n){if(!r(t)||t._t!==n)throw TypeError("Incompatible receiver, "+n+" required!");return t}},function(t,n,e){var r=e(12),i=e(54),o=e(21),c=e(8),s=e(91);t.exports=function(t,n){var e=1==t,u=2==t,a=3==t,f=4==t,l=6==t,h=5==t||l,v=n||s;return function(n,s,p){for(var d,y,g=o(n),m=i(g),b=r(s,p,3),_=c(m.length),w=0,S=e?v(n,_):u?v(n,0):void 0;_>w;w++)if((h||w in m)&&(d=m[w],y=b(d,w,g),t))if(e)S[w]=y;else if(y)switch(t){case 3:return!0;case 5:return d;case 6:return w;case 2:S.push(d)}else if(f)return!1;return l?-1:a||f?f:S}}},function(t,n){var e=t.exports={version:"2.5.1"};"number"==typeof __e&&(__e=e)},function(t,n,e){var r=e(22)("meta"),i=e(4),o=e(10),c=e(7).f,s=0,u=Object.isExtensible||function(){return!0},a=!e(6)(function(){return u(Object.preventExtensions({}))}),f=function(t){c(t,r,{value:{i:"O"+ ++s,w:{}}})},l=function(t,n){if(!i(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!o(t,r)){if(!u(t))return"F";if(!n)return"E";f(t)}return t[r].i},h=function(t,n){if(!o(t,r)){if(!u(t))return!0;if(!n)return!1;f(t)}return t[r].w},v=function(t){return a&&p.NEED&&u(t)&&!o(t,r)&&f(t),t},p=t.exports={KEY:r,NEED:!1,fastKey:l,getWeak:h,onFreeze:v}},function(t,n,e){var r=e(2),i=e(99),o=e(52),c=e(59)("IE_PROTO"),s=function(){},u="prototype",a=function(){var t,n=e(51)("iframe"),r=o.length,i="<",c=">";for(n.style.display="none",e(70).appendChild(n),n.src="javascript:",t=n.contentWindow.document,t.open(),t.write(i+"script"+c+"document.F=Object"+i+"/script"+c),t.close(),a=t.F;r--;)delete a[u][o[r]];return a()};t.exports=Object.create||function(t,n){var e;return null!==t?(s[u]=r(t),e=new s,s[u]=null,e[c]=t):e=a(),void 0===n?e:i(e,n)}},function(t,n,e){var r=e(82),i=e(52).concat("length","prototype");n.f=Object.getOwnPropertyNames||function(t){return r(t,i)}},function(t,n,e){var r=e(10),i=e(21),o=e(59)("IE_PROTO"),c=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=i(t),r(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?c:null}},function(t,n){n.f={}.propertyIsEnumerable},function(t,n,e){var r=e(4);t.exports=function(t,n){if(!r(t))return t;var e,i;if(n&&"function"==typeof(e=t.toString)&&!r(i=e.call(t)))return i;if("function"==typeof(e=t.valueOf)&&!r(i=e.call(t)))return i;if(!n&&"function"==typeof(e=t.toString)&&!r(i=e.call(t)))return i;throw TypeError("Can't convert object to primitive value")}},function(t,n,e){"use strict";var r=e(3),i=e(1),o=e(16),c=e(29),s=e(35),u=e(43),a=e(24),f=e(4),l=e(6),h=e(44),v=e(30),p=e(95);t.exports=function(t,n,e,d,y,g){var m=r[t],b=m,_=y?"set":"add",w=b&&b.prototype,S={},x=function(t){var n=w[t];o(w,t,"delete"==t?function(t){return!(g&&!f(t))&&n.call(this,0===t?0:t)}:"has"==t?function(t){return!(g&&!f(t))&&n.call(this,0===t?0:t)}:"get"==t?function(t){return g&&!f(t)?void 0:n.call(this,0===t?0:t)}:"add"==t?function(t){return n.call(this,0===t?0:t),this}:function(t,e){return n.call(this,0===t?0:t,e),this})};if("function"==typeof b&&(g||w.forEach&&!l(function(){(new b).entries().next()}))){var E=new b,O=E[_](g?{}:-0,1)!=E,M=l(function(){E.has(1)}),A=h(function(t){new b(t)}),L=!g&&l(function(){for(var t=new b,n=5;n--;)t[_](n,n);return!t.has(-0)});A||(b=n(function(n,e){a(n,b,t);var r=p(new m,n,b);return void 0!=e&&u(e,y,r[_],r),r}),b.prototype=w,w.constructor=b),(M||L)&&(x("delete"),x("has"),y&&x("get")),(L||O)&&x(_),g&&w.clear&&delete w.clear}else b=d.getConstructor(n,t,y,_),c(b.prototype,e),s.NEED=!0;return v(b,t),S[t]=b,i(i.G+i.W+i.F*(b!=m),S),g||d.setStrong(b,t,y),b}},function(t,n,e){"use strict";var r=e(11),i=e(16),o=e(6),c=e(18),s=e(5);t.exports=function(t,n,e){var u=s(t),a=e(c,u,""[t]),f=a[0],l=a[1];o(function(){var n={};return n[u]=function(){return 7},7!=""[t](n)})&&(i(String.prototype,t,f),r(RegExp.prototype,u,2==n?function(t,n){return l.call(t,this,n)}:function(t){return l.call(t,this)}))}},function(t,n,e){var r=e(12),i=e(76),o=e(55),c=e(2),s=e(8),u=e(65),a={},f={},n=t.exports=function(t,n,e,l,h){var v,p,d,y,g=h?function(){return t}:u(t),m=r(e,l,n?2:1),b=0;if("function"!=typeof g)throw TypeError(t+" is not iterable!");if(o(g)){for(v=s(t.length);v>b;b++)if(y=n?m(c(p=t[b])[0],p[1]):m(t[b]),y===a||y===f)return y}else for(d=g.call(t);!(p=d.next()).done;)if(y=i(d,m,p.value,n),y===a||y===f)return y};n.BREAK=a,n.RETURN=f},function(t,n,e){var r=e(5)("iterator"),i=!1;try{var o=[7][r]();o.return=function(){i=!0},Array.from(o,function(){throw 2})}catch(t){}t.exports=function(t,n){if(!n&&!i)return!1;var e=!1;try{var o=[7],c=o[r]();c.next=function(){return{done:e=!0}},o[r]=function(){return c},t(o)}catch(t){}return e}},function(t,n){n.f=Object.getOwnPropertySymbols},function(t,n,e){"use strict";var r=e(3),i=e(7),o=e(9),c=e(5)("species");t.exports=function(t){var n=r[t];o&&n&&!n[c]&&i.f(n,c,{configurable:!0,get:function(){return this}})}},function(t,n,e){"use strict";var r=e(21),i=e(31),o=e(8);t.exports=function(t){for(var n=r(this),e=o(n.length),c=arguments.length,s=i(c>1?arguments[1]:void 0,e),u=c>2?arguments[2]:void 0,a=void 0===u?e:i(u,e);a>s;)n[s++]=t;return n}},function(t,n,e){var r=e(13),i=e(8),o=e(31);t.exports=function(t){return function(n,e,c){var s,u=r(n),a=i(u.length),f=o(c,a);if(t&&e!=e){for(;a>f;)if(s=u[f++],s!=s)return!0}else for(;a>f;f++)if((t||f in u)&&u[f]===e)return t||f||0;return!t&&-1}}},function(t,n,e){var r=e(25),i=e(5)("toStringTag"),o="Arguments"==r(function(){return arguments}()),c=function(t,n){try{return t[n]}catch(t){}};t.exports=function(t){var n,e,s;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=c(n=Object(t),i))?e:o?r(n):"Object"==(s=r(n))&&"function"==typeof n.callee?"Arguments":s}},function(t,n,e){"use strict";var r=e(7),i=e(19);t.exports=function(t,n,e){n in t?r.f(t,n,i(0,e)):t[n]=e}},function(t,n,e){var r=e(4),i=e(3).document,o=r(i)&&r(i.createElement);t.exports=function(t){return o?i.createElement(t):{}}},function(t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,n,e){var r=e(5)("match");t.exports=function(t){var n=/./;try{"/./"[t](n)}catch(e){try{return n[r]=!1,!"/./"[t](n)}catch(t){}}return!0}},function(t,n,e){var r=e(25);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,n,e){var r=e(26),i=e(5)("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||o[i]===t)}},function(t,n){var e=Math.expm1;t.exports=!e||e(10)>22025.465794806718||e(10)<22025.465794806718||e(-2e-17)!=-2e-17?function(t){return 0==(t=+t)?t:t>-1e-6&&t<1e-6?t+t*t/2:Math.exp(t)-1}:e},function(t,n){t.exports=Math.sign||function(t){return 0==(t=+t)||t!=t?t:t<0?-1:1}},function(t,n,e){var r=e(4),i=e(2),o=function(t,n){if(i(t),!r(n)&&null!==n)throw TypeError(n+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,n,r){try{r=e(12)(Function.call,e(15).f(Object.prototype,"__proto__").set,2),r(t,[]),n=!(t instanceof Array)}catch(t){n=!0}return function(t,e){return o(t,e),n?t.__proto__=e:r(t,e),t}}({},!1):void 0),check:o}},function(t,n,e){var r=e(60)("keys"),i=e(22);t.exports=function(t){return r[t]||(r[t]=i(t))}},function(t,n,e){var r=e(3),i="__core-js_shared__",o=r[i]||(r[i]={});t.exports=function(t){return o[t]||(o[t]={})}},function(t,n,e){var r=e(2),i=e(17),o=e(5)("species");t.exports=function(t,n){var e,c=r(t).constructor;return void 0===c||void 0==(e=r(c)[o])?n:i(e)}},function(t,n,e){var r=e(75),i=e(18);t.exports=function(t,n,e){if(r(n))throw TypeError("String#"+e+" doesn't accept regex!");return String(i(t))}},function(t,n,e){var r,i,o,c=e(12),s=e(72),u=e(70),a=e(51),f=e(3),l=f.process,h=f.setImmediate,v=f.clearImmediate,p=f.MessageChannel,d=f.Dispatch,y=0,g={},m="onreadystatechange",b=function(){var t=+this;if(g.hasOwnProperty(t)){var n=g[t];delete g[t],n()}},_=function(t){b.call(t.data)};h&&v||(h=function(t){for(var n=[],e=1;arguments.length>e;)n.push(arguments[e++]);return g[++y]=function(){s("function"==typeof t?t:Function(t),n)},r(y),y},v=function(t){delete g[t]},"process"==e(25)(l)?r=function(t){l.nextTick(c(b,t,1))}:d&&d.now?r=function(t){d.now(c(b,t,1))}:p?(i=new p,o=i.port2,i.port1.onmessage=_,r=c(o.postMessage,o,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(r=function(t){f.postMessage(t+"","*")},f.addEventListener("message",_,!1)):r=m in a("script")?function(t){u.appendChild(a("script"))[m]=function(){u.removeChild(this),b.call(t)}}:function(t){setTimeout(c(b,t,1),0)}),t.exports={set:h,clear:v}},function(t,n,e){for(var r,i=e(3),o=e(11),c=e(22),s=c("typed_array"),u=c("view"),a=!(!i.ArrayBuffer||!i.DataView),f=a,l=0,h=9,v="Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array".split(",");l<h;)(r=i[v[l++]])?(o(r.prototype,s,!0),o(r.prototype,u,!0)):f=!1;t.exports={ABV:a,CONSTR:f,TYPED:s,VIEW:u}},function(t,n,e){var r=e(49),i=e(5)("iterator"),o=e(26);t.exports=e(34).getIteratorMethod=function(t){if(void 0!=t)return t[i]||t["@@iterator"]||o[r(t)]}},function(t,n,e){"use strict";var r=e(23),i=e(78),o=e(26),c=e(13);t.exports=e(77)(Array,"Array",function(t,n){this._t=c(t),this._i=0,this._k=n},function(){var t=this._t,n=this._k,e=this._i++;return!t||e>=t.length?(this._t=void 0,i(1)):"keys"==n?i(0,e):"values"==n?i(0,t[e]):i(0,[e,t[e]])},"values"),o.Arguments=o.Array,r("keys"),r("values"),r("entries")},function(t,n,e){"use strict";var r=e(21),i=e(31),o=e(8);t.exports=[].copyWithin||function(t,n){var e=r(this),c=o(e.length),s=i(t,c),u=i(n,c),a=arguments.length>2?arguments[2]:void 0,f=Math.min((void 0===a?c:i(a,c))-u,c-s),l=1;for(u<s&&s<u+f&&(l=-1,u+=f-1,s+=f-1);f-- >0;)u in e?e[s]=e[u]:delete e[s],s+=l,u+=l;return e}},function(t,n,e){"use strict";var r=e(7).f,i=e(36),o=e(29),c=e(12),s=e(24),u=e(43),a=e(77),f=e(78),l=e(46),h=e(9),v=e(35).fastKey,p=e(32),d=h?"_s":"size",y=function(t,n){var e,r=v(n);if("F"!==r)return t._i[r];for(e=t._f;e;e=e.n)if(e.k==n)return e};t.exports={getConstructor:function(t,n,e,a){var f=t(function(t,r){s(t,f,n,"_i"),t._t=n,t._i=i(null),t._f=void 0,t._l=void 0,t[d]=0,void 0!=r&&u(r,e,t[a],t)});return o(f.prototype,{
clear:function(){for(var t=p(this,n),e=t._i,r=t._f;r;r=r.n)r.r=!0,r.p&&(r.p=r.p.n=void 0),delete e[r.i];t._f=t._l=void 0,t[d]=0},delete:function(t){var e=p(this,n),r=y(e,t);if(r){var i=r.n,o=r.p;delete e._i[r.i],r.r=!0,o&&(o.n=i),i&&(i.p=o),e._f==r&&(e._f=i),e._l==r&&(e._l=o),e[d]--}return!!r},forEach:function(t){p(this,n);for(var e,r=c(t,arguments.length>1?arguments[1]:void 0,3);e=e?e.n:this._f;)for(r(e.v,e.k,this);e&&e.r;)e=e.p},has:function(t){return!!y(p(this,n),t)}}),h&&r(f.prototype,"size",{get:function(){return p(this,n)[d]}}),f},def:function(t,n,e){var r,i,o=y(t,n);return o?o.v=e:(t._l=o={i:i=v(n,!0),k:n,v:e,p:r=t._l,n:void 0,r:!1},t._f||(t._f=o),r&&(r.n=o),t[d]++,"F"!==i&&(t._i[i]=o)),t},getEntry:y,setStrong:function(t,n,e){a(t,n,function(t,e){this._t=p(t,n),this._k=e,this._l=void 0},function(){for(var t=this,n=t._k,e=t._l;e&&e.r;)e=e.p;return t._t&&(t._l=e=e?e.n:t._t._f)?"keys"==n?f(0,e.k):"values"==n?f(0,e.v):f(0,[e.k,e.v]):(t._t=void 0,f(1))},e?"entries":"values",!e,!0),l(n)}}},function(t,n,e){"use strict";var r=e(29),i=e(35).getWeak,o=e(2),c=e(4),s=e(24),u=e(43),a=e(33),f=e(10),l=e(32),h=a(5),v=a(6),p=0,d=function(t){return t._l||(t._l=new y)},y=function(){this.a=[]},g=function(t,n){return h(t.a,function(t){return t[0]===n})};y.prototype={get:function(t){var n=g(this,t);if(n)return n[1]},has:function(t){return!!g(this,t)},set:function(t,n){var e=g(this,t);e?e[1]=n:this.a.push([t,n])},delete:function(t){var n=v(this.a,function(n){return n[0]===t});return~n&&this.a.splice(n,1),!!~n}},t.exports={getConstructor:function(t,n,e,o){var a=t(function(t,r){s(t,a,n,"_i"),t._t=n,t._i=p++,t._l=void 0,void 0!=r&&u(r,e,t[o],t)});return r(a.prototype,{delete:function(t){if(!c(t))return!1;var e=i(t);return e===!0?d(l(this,n)).delete(t):e&&f(e,this._i)&&delete e[this._i]},has:function(t){if(!c(t))return!1;var e=i(t);return e===!0?d(l(this,n)).has(t):e&&f(e,this._i)}}),a},def:function(t,n,e){var r=i(o(n),!0);return r===!0?d(t).set(n,e):r[t._i]=e,t},ufstore:d}},function(t,n,e){var r=e(3).document;t.exports=r&&r.documentElement},function(t,n,e){t.exports=!e(9)&&!e(6)(function(){return 7!=Object.defineProperty(e(51)("div"),"a",{get:function(){return 7}}).a})},function(t,n){t.exports=function(t,n,e){var r=void 0===e;switch(n.length){case 0:return r?t():t.call(e);case 1:return r?t(n[0]):t.call(e,n[0]);case 2:return r?t(n[0],n[1]):t.call(e,n[0],n[1]);case 3:return r?t(n[0],n[1],n[2]):t.call(e,n[0],n[1],n[2]);case 4:return r?t(n[0],n[1],n[2],n[3]):t.call(e,n[0],n[1],n[2],n[3])}return t.apply(e,n)}},function(t,n,e){var r=e(25);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,n,e){var r=e(4),i=Math.floor;t.exports=function(t){return!r(t)&&isFinite(t)&&i(t)===t}},function(t,n,e){var r=e(4),i=e(25),o=e(5)("match");t.exports=function(t){var n;return r(t)&&(void 0!==(n=t[o])?!!n:"RegExp"==i(t))}},function(t,n,e){var r=e(2);t.exports=function(t,n,e,i){try{return i?n(r(e)[0],e[1]):n(e)}catch(n){var o=t.return;throw void 0!==o&&r(o.call(t)),n}}},function(t,n,e){"use strict";var r=e(27),i=e(1),o=e(16),c=e(11),s=e(10),u=e(26),a=e(96),f=e(30),l=e(38),h=e(5)("iterator"),v=!([].keys&&"next"in[].keys()),p="@@iterator",d="keys",y="values",g=function(){return this};t.exports=function(t,n,e,m,b,_,w){a(e,n,m);var S,x,E,O=function(t){if(!v&&t in j)return j[t];switch(t){case d:return function(){return new e(this,t)};case y:return function(){return new e(this,t)}}return function(){return new e(this,t)}},M=n+" Iterator",A=b==y,L=!1,j=t.prototype,k=j[h]||j[p]||b&&j[b],T=k||O(b),P=b?A?O("entries"):T:void 0,F="Array"==n?j.entries||k:k;if(F&&(E=l(F.call(new t)),E!==Object.prototype&&E.next&&(f(E,M,!0),r||s(E,h)||c(E,h,g))),A&&k&&k.name!==y&&(L=!0,T=function(){return k.call(this)}),r&&!w||!v&&!L&&j[h]||c(j,h,T),u[n]=T,u[M]=g,b)if(S={values:A?T:O(y),keys:_?T:O(d),entries:P},w)for(x in S)x in j||o(j,x,S[x]);else i(i.P+i.F*(v||L),n,S);return S}},function(t,n){t.exports=function(t,n){return{value:n,done:!!t}}},function(t,n){t.exports=Math.log1p||function(t){return(t=+t)>-1e-8&&t<1e-8?t-t*t/2:Math.log(1+t)}},function(t,n,e){"use strict";function r(t){var n,e;this.promise=new t(function(t,r){if(void 0!==n||void 0!==e)throw TypeError("Bad Promise constructor");n=t,e=r}),this.resolve=i(n),this.reject=i(e)}var i=e(17);t.exports.f=function(t){return new r(t)}},function(t,n,e){"use strict";var r=e(28),i=e(45),o=e(39),c=e(21),s=e(54),u=Object.assign;t.exports=!u||e(6)(function(){var t={},n={},e=Symbol(),r="abcdefghijklmnopqrst";return t[e]=7,r.split("").forEach(function(t){n[t]=t}),7!=u({},t)[e]||Object.keys(u({},n)).join("")!=r})?function(t,n){for(var e=c(t),u=arguments.length,a=1,f=i.f,l=o.f;u>a;)for(var h,v=s(arguments[a++]),p=f?r(v).concat(f(v)):r(v),d=p.length,y=0;d>y;)l.call(v,h=p[y++])&&(e[h]=v[h]);return e}:u},function(t,n,e){var r=e(10),i=e(13),o=e(48)(!1),c=e(59)("IE_PROTO");t.exports=function(t,n){var e,s=i(t),u=0,a=[];for(e in s)e!=c&&r(s,e)&&a.push(e);for(;n.length>u;)r(s,e=n[u++])&&(~o(a,e)||a.push(e));return a}},function(t,n,e){var r=e(28),i=e(13),o=e(39).f;t.exports=function(t){return function(n){for(var e,c=i(n),s=r(c),u=s.length,a=0,f=[];u>a;)o.call(c,e=s[a++])&&f.push(t?[e,c[e]]:c[e]);return f}}},function(t,n,e){var r=e(37),i=e(45),o=e(2),c=e(3).Reflect;t.exports=c&&c.ownKeys||function(t){var n=r.f(o(t)),e=i.f;return e?n.concat(e(t)):n}},function(t,n,e){var r=e(8),i=e(86),o=e(18);t.exports=function(t,n,e,c){var s=String(o(t)),u=s.length,a=void 0===e?" ":String(e),f=r(n);if(f<=u||""==a)return s;var l=f-u,h=i.call(a,Math.ceil(l/a.length));return h.length>l&&(h=h.slice(0,l)),c?h+s:s+h}},function(t,n,e){"use strict";var r=e(20),i=e(18);t.exports=function(t){var n=String(i(this)),e="",o=r(t);if(o<0||o==1/0)throw RangeError("Count can't be negative");for(;o>0;(o>>>=1)&&(n+=n))1&o&&(e+=n);return e}},function(t,n,e){var r=e(20),i=e(8);t.exports=function(t){if(void 0===t)return 0;var n=r(t),e=i(n);if(n!==e)throw RangeError("Wrong length!");return e}},function(t,n,e){"use strict";function r(t,n,e){var r,i,o,c=Array(e),s=8*e-n-1,u=(1<<s)-1,a=u>>1,f=23===n?B(2,-24)-B(2,-77):0,l=0,h=t<0||0===t&&1/t<0?1:0;for(t=z(t),t!=t||t===I?(i=t!=t?1:0,r=u):(r=Y(X(t)/G),t*(o=B(2,-r))<1&&(r--,o*=2),t+=r+a>=1?f/o:f*B(2,1-a),t*o>=2&&(r++,o/=2),r+a>=u?(i=0,r=u):r+a>=1?(i=(t*o-1)*B(2,n),r+=a):(i=t*B(2,a-1)*B(2,n),r=0));n>=8;c[l++]=255&i,i/=256,n-=8);for(r=r<<n|i,s+=n;s>0;c[l++]=255&r,r/=256,s-=8);return c[--l]|=128*h,c}function i(t,n,e){var r,i=8*e-n-1,o=(1<<i)-1,c=o>>1,s=i-7,u=e-1,a=t[u--],f=127&a;for(a>>=7;s>0;f=256*f+t[u],u--,s-=8);for(r=f&(1<<-s)-1,f>>=-s,s+=n;s>0;r=256*r+t[u],u--,s-=8);if(0===f)f=1-c;else{if(f===o)return r?NaN:a?-I:I;r+=B(2,n),f-=c}return(a?-1:1)*r*B(2,f-n)}function o(t){return t[3]<<24|t[2]<<16|t[1]<<8|t[0]}function c(t){return[255&t]}function s(t){return[255&t,t>>8&255]}function u(t){return[255&t,t>>8&255,t>>16&255,t>>24&255]}function a(t){return r(t,52,8)}function f(t){return r(t,23,4)}function l(t,n,e){M(t[T],n,{get:function(){return this[e]}})}function h(t,n,e,r){var i=+e,o=E(i);if(o+n>t[K])throw D(F);var c=t[H]._b,s=o+t[J],u=c.slice(s,s+n);return r?u:u.reverse()}function v(t,n,e,r,i,o){var c=+e,s=E(c);if(s+n>t[K])throw D(F);for(var u=t[H]._b,a=s+t[J],f=r(+i),l=0;l<n;l++)u[a+l]=f[o?l:n-l-1]}var p=e(3),d=e(9),y=e(27),g=e(64),m=e(11),b=e(29),_=e(6),w=e(24),S=e(20),x=e(8),E=e(87),O=e(37).f,M=e(7).f,A=e(47),L=e(30),j="ArrayBuffer",k="DataView",T="prototype",P="Wrong length!",F="Wrong index!",N=p[j],C=p[k],R=p.Math,D=p.RangeError,I=p.Infinity,W=N,z=R.abs,B=R.pow,Y=R.floor,X=R.log,G=R.LN2,V="buffer",U="byteLength",q="byteOffset",H=d?"_b":V,K=d?"_l":U,J=d?"_o":q;if(g.ABV){if(!_(function(){N(1)})||!_(function(){new N(-1)})||_(function(){return new N,new N(1.5),new N(NaN),N.name!=j})){N=function(t){return w(this,N),new W(E(t))};for(var $,Q=N[T]=W[T],Z=O(W),tt=0;Z.length>tt;)($=Z[tt++])in N||m(N,$,W[$]);y||(Q.constructor=N)}var nt=new C(new N(2)),et=C[T].setInt8;nt.setInt8(0,2147483648),nt.setInt8(1,2147483649),!nt.getInt8(0)&&nt.getInt8(1)||b(C[T],{setInt8:function(t,n){et.call(this,t,n<<24>>24)},setUint8:function(t,n){et.call(this,t,n<<24>>24)}},!0)}else N=function(t){w(this,N,j);var n=E(t);this._b=A.call(Array(n),0),this[K]=n},C=function(t,n,e){w(this,C,k),w(t,N,k);var r=t[K],i=S(n);if(i<0||i>r)throw D("Wrong offset!");if(e=void 0===e?r-i:x(e),i+e>r)throw D(P);this[H]=t,this[J]=i,this[K]=e},d&&(l(N,U,"_l"),l(C,V,"_b"),l(C,U,"_l"),l(C,q,"_o")),b(C[T],{getInt8:function(t){return h(this,1,t)[0]<<24>>24},getUint8:function(t){return h(this,1,t)[0]},getInt16:function(t){var n=h(this,2,t,arguments[1]);return(n[1]<<8|n[0])<<16>>16},getUint16:function(t){var n=h(this,2,t,arguments[1]);return n[1]<<8|n[0]},getInt32:function(t){return o(h(this,4,t,arguments[1]))},getUint32:function(t){return o(h(this,4,t,arguments[1]))>>>0},getFloat32:function(t){return i(h(this,4,t,arguments[1]),23,4)},getFloat64:function(t){return i(h(this,8,t,arguments[1]),52,8)},setInt8:function(t,n){v(this,1,t,c,n)},setUint8:function(t,n){v(this,1,t,c,n)},setInt16:function(t,n){v(this,2,t,s,n,arguments[2])},setUint16:function(t,n){v(this,2,t,s,n,arguments[2])},setInt32:function(t,n){v(this,4,t,u,n,arguments[2])},setUint32:function(t,n){v(this,4,t,u,n,arguments[2])},setFloat32:function(t,n){v(this,4,t,f,n,arguments[2])},setFloat64:function(t,n){v(this,8,t,a,n,arguments[2])}});L(N,j),L(C,k),m(C[T],g.VIEW,!0),n[j]=N,n[k]=C},function(t,n,e){n.f=e(5)},function(t,n,e){var r=e(4),i=e(73),o=e(5)("species");t.exports=function(t){var n;return i(t)&&(n=t.constructor,"function"!=typeof n||n!==Array&&!i(n.prototype)||(n=void 0),r(n)&&(n=n[o],null===n&&(n=void 0))),void 0===n?Array:n}},function(t,n,e){var r=e(90);t.exports=function(t,n){return new(r(t))(n)}},function(t,n,e){"use strict";var r=e(17),i=e(4),o=e(72),c=[].slice,s={},u=function(t,n,e){if(!(n in s)){for(var r=[],i=0;i<n;i++)r[i]="a["+i+"]";s[n]=Function("F,a","return new F("+r.join(",")+")")}return s[n](t,e)};t.exports=Function.bind||function(t){var n=r(this),e=c.call(arguments,1),s=function(){var r=e.concat(c.call(arguments));return this instanceof s?u(n,r.length,r):o(n,r,t)};return i(n.prototype)&&(s.prototype=n.prototype),s}},function(t,n,e){var r=e(28),i=e(45),o=e(39);t.exports=function(t){var n=r(t),e=i.f;if(e)for(var c,s=e(t),u=o.f,a=0;s.length>a;)u.call(t,c=s[a++])&&n.push(c);return n}},function(t,n,e){"use strict";var r=e(2);t.exports=function(){var t=r(this),n="";return t.global&&(n+="g"),t.ignoreCase&&(n+="i"),t.multiline&&(n+="m"),t.unicode&&(n+="u"),t.sticky&&(n+="y"),n}},function(t,n,e){var r=e(4),i=e(58).set;t.exports=function(t,n,e){var o,c=n.constructor;return c!==e&&"function"==typeof c&&(o=c.prototype)!==e.prototype&&r(o)&&i&&i(t,o),t}},function(t,n,e){"use strict";var r=e(36),i=e(19),o=e(30),c={};e(11)(c,e(5)("iterator"),function(){return this}),t.exports=function(t,n,e){t.prototype=r(c,{next:i(1,e)}),o(t,n+" Iterator")}},function(t,n,e){var r=e(57),i=Math.pow,o=i(2,-52),c=i(2,-23),s=i(2,127)*(2-c),u=i(2,-126),a=function(t){return t+1/o-1/o};t.exports=Math.fround||function(t){var n,e,i=Math.abs(t),f=r(t);return i<u?f*a(i/u/c)*u*c:(n=(1+c/o)*i,e=n-(n-i),e>s||e!=e?f*(1/0):f*e)}},function(t,n,e){var r=e(3),i=e(63).set,o=r.MutationObserver||r.WebKitMutationObserver,c=r.process,s=r.Promise,u="process"==e(25)(c);t.exports=function(){var t,n,e,a=function(){var r,i;for(u&&(r=c.domain)&&r.exit();t;){i=t.fn,t=t.next;try{i()}catch(r){throw t?e():n=void 0,r}}n=void 0,r&&r.enter()};if(u)e=function(){c.nextTick(a)};else if(o){var f=!0,l=document.createTextNode("");new o(a).observe(l,{characterData:!0}),e=function(){l.data=f=!f}}else if(s&&s.resolve){var h=s.resolve();e=function(){h.then(a)}}else e=function(){i.call(r,a)};return function(r){var i={fn:r,next:void 0};n&&(n.next=i),t||(t=i,e()),n=i}}},function(t,n,e){var r=e(7),i=e(2),o=e(28);t.exports=e(9)?Object.defineProperties:function(t,n){i(t);for(var e,c=o(n),s=c.length,u=0;s>u;)r.f(t,e=c[u++],n[e]);return t}},function(t,n,e){var r=e(13),i=e(37).f,o={}.toString,c="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(t){try{return i(t)}catch(t){return c.slice()}};t.exports.f=function(t){return c&&"[object Window]"==o.call(t)?s(t):i(r(t))}},function(t,n){t.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},function(t,n,e){var r=e(2),i=e(4),o=e(80);t.exports=function(t,n){if(r(t),i(n)&&n.constructor===t)return n;var e=o.f(t),c=e.resolve;return c(n),e.promise}},function(t,n){t.exports=Object.is||function(t,n){return t===n?0!==t||1/t===1/n:t!=t&&n!=n}},function(t,n,e){var r=e(20),i=e(18);t.exports=function(t){return function(n,e){var o,c,s=String(i(n)),u=r(e),a=s.length;return u<0||u>=a?t?"":void 0:(o=s.charCodeAt(u),o<55296||o>56319||u+1===a||(c=s.charCodeAt(u+1))<56320||c>57343?t?s.charAt(u):o:t?s.slice(u,u+2):(o-55296<<10)+(c-56320)+65536)}}},function(t,n,e){var r=e(3),i=e(34),o=e(27),c=e(89),s=e(7).f;t.exports=function(t){var n=i.Symbol||(i.Symbol=o?{}:r.Symbol||{});"_"==t.charAt(0)||t in n||s(n,t,{value:c.f(t)})}},function(t,n,e){var r=e(1);r(r.P,"Array",{copyWithin:e(67)}),e(23)("copyWithin")},function(t,n,e){var r=e(1);r(r.P,"Array",{fill:e(47)}),e(23)("fill")},function(t,n,e){"use strict";var r=e(1),i=e(33)(6),o="findIndex",c=!0;o in[]&&Array(1)[o](function(){c=!1}),r(r.P+r.F*c,"Array",{findIndex:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),e(23)(o)},function(t,n,e){"use strict";var r=e(1),i=e(33)(5),o="find",c=!0;o in[]&&Array(1)[o](function(){c=!1}),r(r.P+r.F*c,"Array",{find:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),e(23)(o)},function(t,n,e){"use strict";var r=e(12),i=e(1),o=e(21),c=e(76),s=e(55),u=e(8),a=e(50),f=e(65);i(i.S+i.F*!e(44)(function(t){Array.from(t)}),"Array",{from:function(t){var n,e,i,l,h=o(t),v="function"==typeof this?this:Array,p=arguments.length,d=p>1?arguments[1]:void 0,y=void 0!==d,g=0,m=f(h);if(y&&(d=r(d,p>2?arguments[2]:void 0,2)),void 0==m||v==Array&&s(m))for(n=u(h.length),e=new v(n);n>g;g++)a(e,g,y?d(h[g],g):h[g]);else for(l=m.call(h),e=new v;!(i=l.next()).done;g++)a(e,g,y?c(l,d,[i.value,g],!0):i.value);return e.length=g,e}})},function(t,n,e){"use strict";var r=e(1),i=e(50);r(r.S+r.F*e(6)(function(){function t(){}return!(Array.of.call(t)instanceof t)}),"Array",{of:function(){for(var t=0,n=arguments.length,e=new("function"==typeof this?this:Array)(n);n>t;)i(e,t,arguments[t++]);return e.length=n,e}})},function(t,n,e){var r=e(7).f,i=Function.prototype,o=/^\s*function ([^ (]*)/,c="name";c in i||e(9)&&r(i,c,{configurable:!0,get:function(){try{return(""+this).match(o)[1]}catch(t){return""}}})},function(t,n,e){"use strict";var r=e(68),i=e(32),o="Map";t.exports=e(41)(o,function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{get:function(t){var n=r.getEntry(i(this,o),t);return n&&n.v},set:function(t,n){return r.def(i(this,o),0===t?0:t,n)}},r,!0)},function(t,n,e){var r=e(1),i=e(79),o=Math.sqrt,c=Math.acosh;r(r.S+r.F*!(c&&710==Math.floor(c(Number.MAX_VALUE))&&c(1/0)==1/0),"Math",{acosh:function(t){return(t=+t)<1?NaN:t>94906265.62425156?Math.log(t)+Math.LN2:i(t-1+o(t-1)*o(t+1))}})},function(t,n,e){function r(t){return isFinite(t=+t)&&0!=t?t<0?-r(-t):Math.log(t+Math.sqrt(t*t+1)):t}var i=e(1),o=Math.asinh;i(i.S+i.F*!(o&&1/o(0)>0),"Math",{asinh:r})},function(t,n,e){var r=e(1),i=Math.atanh;r(r.S+r.F*!(i&&1/i(-0)<0),"Math",{atanh:function(t){return 0==(t=+t)?t:Math.log((1+t)/(1-t))/2}})},function(t,n,e){var r=e(1),i=e(57);r(r.S,"Math",{cbrt:function(t){return i(t=+t)*Math.pow(Math.abs(t),1/3)}})},function(t,n,e){var r=e(1);r(r.S,"Math",{clz32:function(t){return(t>>>=0)?31-Math.floor(Math.log(t+.5)*Math.LOG2E):32}})},function(t,n,e){var r=e(1),i=Math.exp;r(r.S,"Math",{cosh:function(t){return(i(t=+t)+i(-t))/2}})},function(t,n,e){var r=e(1),i=e(56);r(r.S+r.F*(i!=Math.expm1),"Math",{expm1:i})},function(t,n,e){var r=e(1);r(r.S,"Math",{fround:e(97)})},function(t,n,e){var r=e(1),i=Math.abs;r(r.S,"Math",{hypot:function(t,n){for(var e,r,o=0,c=0,s=arguments.length,u=0;c<s;)e=i(arguments[c++]),u<e?(r=u/e,o=o*r*r+1,u=e):e>0?(r=e/u,o+=r*r):o+=e;return u===1/0?1/0:u*Math.sqrt(o)}})},function(t,n,e){var r=e(1),i=Math.imul;r(r.S+r.F*e(6)(function(){return i(4294967295,5)!=-5||2!=i.length}),"Math",{imul:function(t,n){var e=65535,r=+t,i=+n,o=e&r,c=e&i;return 0|o*c+((e&r>>>16)*c+o*(e&i>>>16)<<16>>>0)}})},function(t,n,e){var r=e(1);r(r.S,"Math",{log10:function(t){return Math.log(t)*Math.LOG10E}})},function(t,n,e){var r=e(1);r(r.S,"Math",{log1p:e(79)})},function(t,n,e){var r=e(1);r(r.S,"Math",{log2:function(t){return Math.log(t)/Math.LN2}})},function(t,n,e){var r=e(1);r(r.S,"Math",{sign:e(57)})},function(t,n,e){var r=e(1),i=e(56),o=Math.exp;r(r.S+r.F*e(6)(function(){return!Math.sinh(-2e-17)!=-2e-17}),"Math",{sinh:function(t){return Math.abs(t=+t)<1?(i(t)-i(-t))/2:(o(t-1)-o(-t-1))*(Math.E/2)}})},function(t,n,e){var r=e(1),i=e(56),o=Math.exp;r(r.S,"Math",{tanh:function(t){var n=i(t=+t),e=i(-t);return n==1/0?1:e==1/0?-1:(n-e)/(o(t)+o(-t))}})},function(t,n,e){var r=e(1);r(r.S,"Math",{trunc:function(t){return(t>0?Math.floor:Math.ceil)(t)}})},function(t,n,e){var r=e(1);r(r.S,"Number",{EPSILON:Math.pow(2,-52)})},function(t,n,e){var r=e(1),i=e(3).isFinite;r(r.S,"Number",{isFinite:function(t){return"number"==typeof t&&i(t)}})},function(t,n,e){var r=e(1);r(r.S,"Number",{isInteger:e(74)})},function(t,n,e){var r=e(1);r(r.S,"Number",{isNaN:function(t){return t!=t}})},function(t,n,e){var r=e(1),i=e(74),o=Math.abs;r(r.S,"Number",{isSafeInteger:function(t){return i(t)&&o(t)<=9007199254740991}})},function(t,n,e){var r=e(1);r(r.S,"Number",{MAX_SAFE_INTEGER:9007199254740991})},function(t,n,e){var r=e(1);r(r.S,"Number",{MIN_SAFE_INTEGER:-9007199254740991})},function(t,n,e){var r=e(1);r(r.S+r.F,"Object",{assign:e(81)})},function(t,n,e){var r=e(1);r(r.S,"Object",{is:e(103)})},function(t,n,e){var r=e(1);r(r.S,"Object",{setPrototypeOf:e(58).set})},function(t,n,e){"use strict";var r,i,o,c,s=e(27),u=e(3),a=e(12),f=e(49),l=e(1),h=e(4),v=e(17),p=e(24),d=e(43),y=e(61),g=e(63).set,m=e(98)(),b=e(80),_=e(101),w=e(102),S="Promise",x=u.TypeError,E=u.process,O=u[S],M="process"==f(E),A=function(){},L=i=b.f,j=!!function(){try{var t=O.resolve(1),n=(t.constructor={})[e(5)("species")]=function(t){t(A,A)};return(M||"function"==typeof PromiseRejectionEvent)&&t.then(A)instanceof n}catch(t){}}(),k=function(t){var n;return!(!h(t)||"function"!=typeof(n=t.then))&&n},T=function(t,n){if(!t._n){t._n=!0;var e=t._c;m(function(){for(var r=t._v,i=1==t._s,o=0,c=function(n){var e,o,c=i?n.ok:n.fail,s=n.resolve,u=n.reject,a=n.domain;try{c?(i||(2==t._h&&N(t),t._h=1),c===!0?e=r:(a&&a.enter(),e=c(r),a&&a.exit()),e===n.promise?u(x("Promise-chain cycle")):(o=k(e))?o.call(e,s,u):s(e)):u(r)}catch(t){u(t)}};e.length>o;)c(e[o++]);t._c=[],t._n=!1,n&&!t._h&&P(t)})}},P=function(t){g.call(u,function(){var n,e,r,i=t._v,o=F(t);if(o&&(n=_(function(){M?E.emit("unhandledRejection",i,t):(e=u.onunhandledrejection)?e({promise:t,reason:i}):(r=u.console)&&r.error&&r.error("Unhandled promise rejection",i)}),t._h=M||F(t)?2:1),t._a=void 0,o&&n.e)throw n.v})},F=function(t){if(1==t._h)return!1;for(var n,e=t._a||t._c,r=0;e.length>r;)if(n=e[r++],n.fail||!F(n.promise))return!1;return!0},N=function(t){g.call(u,function(){var n;M?E.emit("rejectionHandled",t):(n=u.onrejectionhandled)&&n({promise:t,reason:t._v})})},C=function(t){var n=this;n._d||(n._d=!0,n=n._w||n,n._v=t,n._s=2,n._a||(n._a=n._c.slice()),T(n,!0))},R=function(t){var n,e=this;if(!e._d){e._d=!0,e=e._w||e;try{if(e===t)throw x("Promise can't be resolved itself");(n=k(t))?m(function(){var r={_w:e,_d:!1};try{n.call(t,a(R,r,1),a(C,r,1))}catch(t){C.call(r,t)}}):(e._v=t,e._s=1,T(e,!1))}catch(t){C.call({_w:e,_d:!1},t)}}};j||(O=function(t){p(this,O,S,"_h"),v(t),r.call(this);try{t(a(R,this,1),a(C,this,1))}catch(t){C.call(this,t)}},r=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},r.prototype=e(29)(O.prototype,{then:function(t,n){var e=L(y(this,O));return e.ok="function"!=typeof t||t,e.fail="function"==typeof n&&n,e.domain=M?E.domain:void 0,this._c.push(e),this._a&&this._a.push(e),this._s&&T(this,!1),e.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new r;this.promise=t,this.resolve=a(R,t,1),this.reject=a(C,t,1)},b.f=L=function(t){return t===O||t===c?new o(t):i(t)}),l(l.G+l.W+l.F*!j,{Promise:O}),e(30)(O,S),e(46)(S),c=e(34)[S],l(l.S+l.F*!j,S,{reject:function(t){var n=L(this),e=n.reject;return e(t),n.promise}}),l(l.S+l.F*(s||!j),S,{resolve:function(t){return w(s&&this===c?O:this,t)}}),l(l.S+l.F*!(j&&e(44)(function(t){O.all(t).catch(A)})),S,{all:function(t){var n=this,e=L(n),r=e.resolve,i=e.reject,o=_(function(){var e=[],o=0,c=1;d(t,!1,function(t){var s=o++,u=!1;e.push(void 0),c++,n.resolve(t).then(function(t){u||(u=!0,e[s]=t,--c||r(e))},i)}),--c||r(e)});return o.e&&i(o.v),e.promise},race:function(t){var n=this,e=L(n),r=e.reject,i=_(function(){d(t,!1,function(t){n.resolve(t).then(e.resolve,r)})});return i.e&&r(i.v),e.promise}})},function(t,n,e){var r=e(1),i=e(17),o=e(2),c=(e(3).Reflect||{}).apply,s=Function.apply;r(r.S+r.F*!e(6)(function(){c(function(){})}),"Reflect",{apply:function(t,n,e){var r=i(t),u=o(e);return c?c(r,n,u):s.call(r,n,u)}})},function(t,n,e){var r=e(1),i=e(36),o=e(17),c=e(2),s=e(4),u=e(6),a=e(92),f=(e(3).Reflect||{}).construct,l=u(function(){function t(){}return!(f(function(){},[],t)instanceof t)}),h=!u(function(){f(function(){})});r(r.S+r.F*(l||h),"Reflect",{construct:function(t,n){o(t),c(n);var e=arguments.length<3?t:o(arguments[2]);if(h&&!l)return f(t,n,e);if(t==e){switch(n.length){case 0:return new t;case 1:return new t(n[0]);case 2:return new t(n[0],n[1]);case 3:return new t(n[0],n[1],n[2]);case 4:return new t(n[0],n[1],n[2],n[3])}var r=[null];return r.push.apply(r,n),new(a.apply(t,r))}var u=e.prototype,v=i(s(u)?u:Object.prototype),p=Function.apply.call(t,v,n);return s(p)?p:v}})},function(t,n,e){var r=e(7),i=e(1),o=e(2),c=e(40);i(i.S+i.F*e(6)(function(){Reflect.defineProperty(r.f({},1,{value:1}),1,{value:2})}),"Reflect",{defineProperty:function(t,n,e){o(t),n=c(n,!0),o(e);try{return r.f(t,n,e),!0}catch(t){return!1}}})},function(t,n,e){var r=e(1),i=e(15).f,o=e(2);r(r.S,"Reflect",{deleteProperty:function(t,n){var e=i(o(t),n);return!(e&&!e.configurable)&&delete t[n]}})},function(t,n,e){var r=e(15),i=e(1),o=e(2);i(i.S,"Reflect",{getOwnPropertyDescriptor:function(t,n){return r.f(o(t),n)}})},function(t,n,e){var r=e(1),i=e(38),o=e(2);r(r.S,"Reflect",{getPrototypeOf:function(t){return i(o(t))}})},function(t,n,e){function r(t,n){var e,s,f=arguments.length<3?t:arguments[2];return a(t)===f?t[n]:(e=i.f(t,n))?c(e,"value")?e.value:void 0!==e.get?e.get.call(f):void 0:u(s=o(t))?r(s,n,f):void 0}var i=e(15),o=e(38),c=e(10),s=e(1),u=e(4),a=e(2);s(s.S,"Reflect",{get:r})},function(t,n,e){var r=e(1);r(r.S,"Reflect",{has:function(t,n){return n in t}})},function(t,n,e){var r=e(1),i=e(2),o=Object.isExtensible;r(r.S,"Reflect",{isExtensible:function(t){return i(t),!o||o(t)}})},function(t,n,e){var r=e(1);r(r.S,"Reflect",{ownKeys:e(84)})},function(t,n,e){var r=e(1),i=e(2),o=Object.preventExtensions;r(r.S,"Reflect",{preventExtensions:function(t){i(t);try{return o&&o(t),!0}catch(t){return!1}}})},function(t,n,e){var r=e(1),i=e(58);i&&r(r.S,"Reflect",{setPrototypeOf:function(t,n){i.check(t,n);try{return i.set(t,n),!0}catch(t){return!1}}})},function(t,n,e){function r(t,n,e){var u,h,v=arguments.length<4?t:arguments[3],p=o.f(f(t),n);if(!p){if(l(h=c(t)))return r(h,n,e,v);p=a(0)}return s(p,"value")?!(p.writable===!1||!l(v))&&(u=o.f(v,n)||a(0),u.value=e,i.f(v,n,u),!0):void 0!==p.set&&(p.set.call(v,e),!0)}var i=e(7),o=e(15),c=e(38),s=e(10),u=e(1),a=e(19),f=e(2),l=e(4);u(u.S,"Reflect",{set:r})},function(t,n,e){e(9)&&"g"!=/./g.flags&&e(7).f(RegExp.prototype,"flags",{configurable:!0,get:e(94)})},function(t,n,e){e(42)("match",1,function(t,n,e){return[function(e){"use strict";var r=t(this),i=void 0==e?void 0:e[n];return void 0!==i?i.call(e,r):new RegExp(e)[n](String(r))},e]})},function(t,n,e){e(42)("replace",2,function(t,n,e){return[function(r,i){"use strict";var o=t(this),c=void 0==r?void 0:r[n];return void 0!==c?c.call(r,o,i):e.call(String(o),r,i)},e]})},function(t,n,e){e(42)("search",1,function(t,n,e){return[function(e){"use strict";var r=t(this),i=void 0==e?void 0:e[n];return void 0!==i?i.call(e,r):new RegExp(e)[n](String(r))},e]})},function(t,n,e){e(42)("split",2,function(t,n,r){"use strict";var i=e(75),o=r,c=[].push,s="split",u="length",a="lastIndex";if("c"=="abbc"[s](/(b)*/)[1]||4!="test"[s](/(?:)/,-1)[u]||2!="ab"[s](/(?:ab)*/)[u]||4!="."[s](/(.?)(.?)/)[u]||"."[s](/()()/)[u]>1||""[s](/.?/)[u]){var f=void 0===/()??/.exec("")[1];r=function(t,n){var e=String(this);if(void 0===t&&0===n)return[];if(!i(t))return o.call(e,t,n);var r,s,l,h,v,p=[],d=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),y=0,g=void 0===n?4294967295:n>>>0,m=new RegExp(t.source,d+"g");for(f||(r=new RegExp("^"+m.source+"$(?!\\s)",d));(s=m.exec(e))&&(l=s.index+s[0][u],!(l>y&&(p.push(e.slice(y,s.index)),!f&&s[u]>1&&s[0].replace(r,function(){for(v=1;v<arguments[u]-2;v++)void 0===arguments[v]&&(s[v]=void 0)}),s[u]>1&&s.index<e[u]&&c.apply(p,s.slice(1)),h=s[0][u],y=l,p[u]>=g)));)m[a]===s.index&&m[a]++;return y===e[u]?!h&&m.test("")||p.push(""):p.push(e.slice(y)),p[u]>g?p.slice(0,g):p}}else"0"[s](void 0,0)[u]&&(r=function(t,n){return void 0===t&&0===n?[]:o.call(this,t,n)});return[function(e,i){var o=t(this),c=void 0==e?void 0:e[n];return void 0!==c?c.call(e,o,i):r.call(String(o),e,i)},r]})},function(t,n,e){"use strict";var r=e(68),i=e(32),o="Set";t.exports=e(41)(o,function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function(t){return r.def(i(this,o),t=0===t?0:t,t)}},r)},function(t,n,e){"use strict";var r=e(1),i=e(104)(!1);r(r.P,"String",{codePointAt:function(t){return i(this,t)}})},function(t,n,e){"use strict";var r=e(1),i=e(8),o=e(62),c="endsWith",s=""[c];r(r.P+r.F*e(53)(c),"String",{endsWith:function(t){var n=o(this,t,c),e=arguments.length>1?arguments[1]:void 0,r=i(n.length),u=void 0===e?r:Math.min(i(e),r),a=String(t);return s?s.call(n,a,u):n.slice(u-a.length,u)===a}})},function(t,n,e){var r=e(1),i=e(31),o=String.fromCharCode,c=String.fromCodePoint;r(r.S+r.F*(!!c&&1!=c.length),"String",{fromCodePoint:function(t){for(var n,e=[],r=arguments.length,c=0;r>c;){if(n=+arguments[c++],i(n,1114111)!==n)throw RangeError(n+" is not a valid code point");e.push(n<65536?o(n):o(((n-=65536)>>10)+55296,n%1024+56320))}return e.join("")}})},function(t,n,e){"use strict";var r=e(1),i=e(62),o="includes";r(r.P+r.F*e(53)(o),"String",{includes:function(t){return!!~i(this,t,o).indexOf(t,arguments.length>1?arguments[1]:void 0)}})},function(t,n,e){var r=e(1),i=e(13),o=e(8);r(r.S,"String",{raw:function(t){for(var n=i(t.raw),e=o(n.length),r=arguments.length,c=[],s=0;e>s;)c.push(String(n[s++])),s<r&&c.push(String(arguments[s]));return c.join("")}})},function(t,n,e){var r=e(1);r(r.P,"String",{repeat:e(86)})},function(t,n,e){"use strict";var r=e(1),i=e(8),o=e(62),c="startsWith",s=""[c];r(r.P+r.F*e(53)(c),"String",{startsWith:function(t){var n=o(this,t,c),e=i(Math.min(arguments.length>1?arguments[1]:void 0,n.length)),r=String(t);return s?s.call(n,r,e):n.slice(e,e+r.length)===r}})},function(t,n,e){"use strict";var r=e(3),i=e(10),o=e(9),c=e(1),s=e(16),u=e(35).KEY,a=e(6),f=e(60),l=e(30),h=e(22),v=e(5),p=e(89),d=e(105),y=e(93),g=e(73),m=e(2),b=e(13),_=e(40),w=e(19),S=e(36),x=e(100),E=e(15),O=e(7),M=e(28),A=E.f,L=O.f,j=x.f,k=r.Symbol,T=r.JSON,P=T&&T.stringify,F="prototype",N=v("_hidden"),C=v("toPrimitive"),R={}.propertyIsEnumerable,D=f("symbol-registry"),I=f("symbols"),W=f("op-symbols"),z=Object[F],B="function"==typeof k,Y=r.QObject,X=!Y||!Y[F]||!Y[F].findChild,G=o&&a(function(){return 7!=S(L({},"a",{get:function(){return L(this,"a",{value:7}).a}})).a})?function(t,n,e){var r=A(z,n);r&&delete z[n],L(t,n,e),r&&t!==z&&L(z,n,r)}:L,V=function(t){var n=I[t]=S(k[F]);return n._k=t,n},U=B&&"symbol"==typeof k.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof k},q=function(t,n,e){return t===z&&q(W,n,e),m(t),n=_(n,!0),m(e),i(I,n)?(e.enumerable?(i(t,N)&&t[N][n]&&(t[N][n]=!1),e=S(e,{enumerable:w(0,!1)})):(i(t,N)||L(t,N,w(1,{})),t[N][n]=!0),G(t,n,e)):L(t,n,e)},H=function(t,n){m(t);for(var e,r=y(n=b(n)),i=0,o=r.length;o>i;)q(t,e=r[i++],n[e]);return t},K=function(t,n){return void 0===n?S(t):H(S(t),n)},J=function(t){var n=R.call(this,t=_(t,!0));return!(this===z&&i(I,t)&&!i(W,t))&&(!(n||!i(this,t)||!i(I,t)||i(this,N)&&this[N][t])||n)},$=function(t,n){if(t=b(t),n=_(n,!0),t!==z||!i(I,n)||i(W,n)){var e=A(t,n);return!e||!i(I,n)||i(t,N)&&t[N][n]||(e.enumerable=!0),e}},Q=function(t){for(var n,e=j(b(t)),r=[],o=0;e.length>o;)i(I,n=e[o++])||n==N||n==u||r.push(n);return r},Z=function(t){for(var n,e=t===z,r=j(e?W:b(t)),o=[],c=0;r.length>c;)!i(I,n=r[c++])||e&&!i(z,n)||o.push(I[n]);return o};B||(k=function(){if(this instanceof k)throw TypeError("Symbol is not a constructor!");var t=h(arguments.length>0?arguments[0]:void 0),n=function(e){this===z&&n.call(W,e),i(this,N)&&i(this[N],t)&&(this[N][t]=!1),G(this,t,w(1,e))};return o&&X&&G(z,t,{configurable:!0,set:n}),V(t)},s(k[F],"toString",function(){return this._k}),E.f=$,O.f=q,e(37).f=x.f=Q,e(39).f=J,e(45).f=Z,o&&!e(27)&&s(z,"propertyIsEnumerable",J,!0),p.f=function(t){return V(v(t))}),c(c.G+c.W+c.F*!B,{Symbol:k});for(var tt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),nt=0;tt.length>nt;)v(tt[nt++]);for(var et=M(v.store),rt=0;et.length>rt;)d(et[rt++]);c(c.S+c.F*!B,"Symbol",{for:function(t){return i(D,t+="")?D[t]:D[t]=k(t)},keyFor:function(t){if(!U(t))throw TypeError(t+" is not a symbol!");for(var n in D)if(D[n]===t)return n},useSetter:function(){X=!0},useSimple:function(){X=!1}}),c(c.S+c.F*!B,"Object",{create:K,defineProperty:q,defineProperties:H,getOwnPropertyDescriptor:$,getOwnPropertyNames:Q,getOwnPropertySymbols:Z}),T&&c(c.S+c.F*(!B||a(function(){var t=k();return"[null]"!=P([t])||"{}"!=P({a:t})||"{}"!=P(Object(t))})),"JSON",{stringify:function(t){if(void 0!==t&&!U(t)){for(var n,e,r=[t],i=1;arguments.length>i;)r.push(arguments[i++]);return n=r[1],"function"==typeof n&&(e=n),!e&&g(n)||(n=function(t,n){if(e&&(n=e.call(this,t,n)),!U(n))return n}),r[1]=n,P.apply(T,r)}}}),k[F][C]||e(11)(k[F],C,k[F].valueOf),l(k,"Symbol"),l(Math,"Math",!0),l(r.JSON,"JSON",!0)},function(t,n,e){"use strict";var r=e(1),i=e(64),o=e(88),c=e(2),s=e(31),u=e(8),a=e(4),f=e(3).ArrayBuffer,l=e(61),h=o.ArrayBuffer,v=o.DataView,p=i.ABV&&f.isView,d=h.prototype.slice,y=i.VIEW,g="ArrayBuffer";r(r.G+r.W+r.F*(f!==h),{ArrayBuffer:h}),r(r.S+r.F*!i.CONSTR,g,{isView:function(t){return p&&p(t)||a(t)&&y in t}}),r(r.P+r.U+r.F*e(6)(function(){return!new h(2).slice(1,void 0).byteLength}),g,{slice:function(t,n){if(void 0!==d&&void 0===n)return d.call(c(this),t);for(var e=c(this).byteLength,r=s(t,e),i=s(void 0===n?e:n,e),o=new(l(this,h))(u(i-r)),a=new v(this),f=new v(o),p=0;r<i;)f.setUint8(p++,a.getUint8(r++));return o}}),e(46)(g)},function(t,n,e){e(14)("Float32",4,function(t){return function(n,e,r){return t(this,n,e,r)}})},function(t,n,e){e(14)("Float64",8,function(t){return function(n,e,r){return t(this,n,e,r)}})},function(t,n,e){e(14)("Int16",2,function(t){return function(n,e,r){return t(this,n,e,r)}})},function(t,n,e){e(14)("Int32",4,function(t){return function(n,e,r){return t(this,n,e,r)}})},function(t,n,e){e(14)("Int8",1,function(t){return function(n,e,r){return t(this,n,e,r)}})},function(t,n,e){e(14)("Uint16",2,function(t){return function(n,e,r){return t(this,n,e,r)}})},function(t,n,e){e(14)("Uint32",4,function(t){return function(n,e,r){return t(this,n,e,r)}})},function(t,n,e){e(14)("Uint8",1,function(t){return function(n,e,r){return t(this,n,e,r)}})},function(t,n,e){e(14)("Uint8",1,function(t){return function(n,e,r){return t(this,n,e,r)}},!0)},function(t,n,e){"use strict";var r,i=e(33)(0),o=e(16),c=e(35),s=e(81),u=e(69),a=e(4),f=e(6),l=e(32),h="WeakMap",v=c.getWeak,p=Object.isExtensible,d=u.ufstore,y={},g=function(t){
return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},m={get:function(t){if(a(t)){var n=v(t);return n===!0?d(l(this,h)).get(t):n?n[this._i]:void 0}},set:function(t,n){return u.def(l(this,h),t,n)}},b=t.exports=e(41)(h,g,m,u,!0,!0);f(function(){return 7!=(new b).set((Object.freeze||Object)(y),7).get(y)})&&(r=u.getConstructor(g,h),s(r.prototype,m),c.NEED=!0,i(["delete","has","get","set"],function(t){var n=b.prototype,e=n[t];o(n,t,function(n,i){if(a(n)&&!p(n)){this._f||(this._f=new r);var o=this._f[t](n,i);return"set"==t?this:o}return e.call(this,n,i)})}))},function(t,n,e){"use strict";var r=e(69),i=e(32),o="WeakSet";e(41)(o,function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function(t){return r.def(i(this,o),t,!0)}},r,!1,!0)},function(t,n,e){"use strict";var r=e(1),i=e(48)(!0);r(r.P,"Array",{includes:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),e(23)("includes")},function(t,n,e){var r=e(1),i=e(83)(!0);r(r.S,"Object",{entries:function(t){return i(t)}})},function(t,n,e){var r=e(1),i=e(84),o=e(13),c=e(15),s=e(50);r(r.S,"Object",{getOwnPropertyDescriptors:function(t){for(var n,e,r=o(t),u=c.f,a=i(r),f={},l=0;a.length>l;)e=u(r,n=a[l++]),void 0!==e&&s(f,n,e);return f}})},function(t,n,e){var r=e(1),i=e(83)(!1);r(r.S,"Object",{values:function(t){return i(t)}})},function(t,n,e){"use strict";var r=e(1),i=e(85);r(r.P,"String",{padEnd:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0,!1)}})},function(t,n,e){"use strict";var r=e(1),i=e(85);r(r.P,"String",{padStart:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0,!0)}})},function(t,n,e){for(var r=e(66),i=e(28),o=e(16),c=e(3),s=e(11),u=e(26),a=e(5),f=a("iterator"),l=a("toStringTag"),h=u.Array,v={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},p=i(v),d=0;d<p.length;d++){var y,g=p[d],m=v[g],b=c[g],_=b&&b.prototype;if(_&&(_[f]||s(_,f,h),_[l]||s(_,l,g),u[g]=h,m))for(y in r)_[y]||o(_,y,r[y],!0)}},function(t,n,e){var r=e(1),i=e(63);r(r.G+r.B,{setImmediate:i.set,clearImmediate:i.clear})},function(t,n,e){var r=e(3),i=e(1),o=r.navigator,c=[].slice,s=!!o&&/MSIE .\./.test(o.userAgent),u=function(t){return function(n,e){var r=arguments.length>2,i=!!r&&c.call(arguments,2);return t(r?function(){("function"==typeof n?n:Function(n)).apply(this,i)}:n,e)}};i(i.G+i.B+i.F*s,{setTimeout:u(r.setTimeout),setInterval:u(r.setInterval)})},function(t,n){},function(t,n){(function(n){function e(t,n,e){function i(n){var e=d,r=y;return d=y=void 0,E=n,m=t.apply(r,e)}function o(t){return E=t,b=setTimeout(f,n),O?i(t):m}function u(t){var e=t-x,r=t-E,i=n-e;return M?w(i,g-r):i}function a(t){var e=t-x,r=t-E;return void 0===x||e>=n||e<0||M&&r>=g}function f(){var t=S();return a(t)?l(t):void(b=setTimeout(f,u(t)))}function l(t){return b=void 0,A&&d?i(t):(d=y=void 0,m)}function h(){void 0!==b&&clearTimeout(b),E=0,d=x=y=b=void 0}function v(){return void 0===b?m:l(S())}function p(){var t=S(),e=a(t);if(d=arguments,y=this,x=t,e){if(void 0===b)return o(x);if(M)return b=setTimeout(f,n),i(x)}return void 0===b&&(b=setTimeout(f,n)),m}var d,y,g,m,b,x,E=0,O=!1,M=!1,A=!0;if("function"!=typeof t)throw new TypeError(s);return n=c(n)||0,r(e)&&(O=!!e.leading,M="maxWait"in e,g=M?_(c(e.maxWait)||0,n):g,A="trailing"in e?!!e.trailing:A),p.cancel=h,p.flush=v,p}function r(t){var n=typeof t;return!!t&&("object"==n||"function"==n)}function i(t){return!!t&&"object"==typeof t}function o(t){return"symbol"==typeof t||i(t)&&b.call(t)==a}function c(t){if("number"==typeof t)return t;if(o(t))return u;if(r(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=r(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(f,"");var e=h.test(t);return e||v.test(t)?p(t.slice(2),e?2:8):l.test(t)?u:+t}var s="Expected a function",u=NaN,a="[object Symbol]",f=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,h=/^0b[01]+$/i,v=/^0o[0-7]+$/i,p=parseInt,d="object"==typeof n&&n&&n.Object===Object&&n,y="object"==typeof self&&self&&self.Object===Object&&self,g=d||y||Function("return this")(),m=Object.prototype,b=m.toString,_=Math.max,w=Math.min,S=function(){return g.Date.now()};t.exports=e}).call(n,function(){return this}())},function(t,n){!function(n){"use strict";function e(t,n,e,r){var o=n&&n.prototype instanceof i?n:i,c=Object.create(o.prototype),s=new v(r||[]);return c._invoke=a(t,e,s),c}function r(t,n,e){try{return{type:"normal",arg:t.call(n,e)}}catch(t){return{type:"throw",arg:t}}}function i(){}function o(){}function c(){}function s(t){["next","throw","return"].forEach(function(n){t[n]=function(t){return this._invoke(n,t)}})}function u(t){function n(e,i,o,c){var s=r(t[e],t,i);if("throw"!==s.type){var u=s.arg,a=u.value;return a&&"object"==typeof a&&m.call(a,"__await")?Promise.resolve(a.__await).then(function(t){n("next",t,o,c)},function(t){n("throw",t,o,c)}):Promise.resolve(a).then(function(t){u.value=t,o(u)},c)}c(s.arg)}function e(t,e){function r(){return new Promise(function(r,i){n(t,e,r,i)})}return i=i?i.then(r,r):r()}var i;this._invoke=e}function a(t,n,e){var i=O;return function(o,c){if(i===A)throw new Error("Generator is already running");if(i===L){if("throw"===o)throw c;return d()}for(e.method=o,e.arg=c;;){var s=e.delegate;if(s){var u=f(s,e);if(u){if(u===j)continue;return u}}if("next"===e.method)e.sent=e._sent=e.arg;else if("throw"===e.method){if(i===O)throw i=L,e.arg;e.dispatchException(e.arg)}else"return"===e.method&&e.abrupt("return",e.arg);i=A;var a=r(t,n,e);if("normal"===a.type){if(i=e.done?L:M,a.arg===j)continue;return{value:a.arg,done:e.done}}"throw"===a.type&&(i=L,e.method="throw",e.arg=a.arg)}}}function f(t,n){var e=t.iterator[n.method];if(e===y){if(n.delegate=null,"throw"===n.method){if(t.iterator.return&&(n.method="return",n.arg=y,f(t,n),"throw"===n.method))return j;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return j}var i=r(e,t.iterator,n.arg);if("throw"===i.type)return n.method="throw",n.arg=i.arg,n.delegate=null,j;var o=i.arg;return o?o.done?(n[t.resultName]=o.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=y),n.delegate=null,j):o:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,j)}function l(t){var n={tryLoc:t[0]};1 in t&&(n.catchLoc=t[1]),2 in t&&(n.finallyLoc=t[2],n.afterLoc=t[3]),this.tryEntries.push(n)}function h(t){var n=t.completion||{};n.type="normal",delete n.arg,t.completion=n}function v(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(l,this),this.reset(!0)}function p(t){if(t){var n=t[_];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var e=-1,r=function n(){for(;++e<t.length;)if(m.call(t,e))return n.value=t[e],n.done=!1,n;return n.value=y,n.done=!0,n};return r.next=r}}return{next:d}}function d(){return{value:y,done:!0}}var y,g=Object.prototype,m=g.hasOwnProperty,b="function"==typeof Symbol?Symbol:{},_=b.iterator||"@@iterator",w=b.asyncIterator||"@@asyncIterator",S=b.toStringTag||"@@toStringTag",x="object"==typeof t,E=n.regeneratorRuntime;if(E)return void(x&&(t.exports=E));E=n.regeneratorRuntime=x?t.exports:{},E.wrap=e;var O="suspendedStart",M="suspendedYield",A="executing",L="completed",j={},k={};k[_]=function(){return this};var T=Object.getPrototypeOf,P=T&&T(T(p([])));P&&P!==g&&m.call(P,_)&&(k=P);var F=c.prototype=i.prototype=Object.create(k);o.prototype=F.constructor=c,c.constructor=o,c[S]=o.displayName="GeneratorFunction",E.isGeneratorFunction=function(t){var n="function"==typeof t&&t.constructor;return!!n&&(n===o||"GeneratorFunction"===(n.displayName||n.name))},E.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,c):(t.__proto__=c,S in t||(t[S]="GeneratorFunction")),t.prototype=Object.create(F),t},E.awrap=function(t){return{__await:t}},s(u.prototype),u.prototype[w]=function(){return this},E.AsyncIterator=u,E.async=function(t,n,r,i){var o=new u(e(t,n,r,i));return E.isGeneratorFunction(n)?o:o.next().then(function(t){return t.done?t.value:o.next()})},s(F),F[S]="Generator",F[_]=function(){return this},F.toString=function(){return"[object Generator]"},E.keys=function(t){var n=[];for(var e in t)n.push(e);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},E.values=p,v.prototype={constructor:v,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=y,this.done=!1,this.delegate=null,this.method="next",this.arg=y,this.tryEntries.forEach(h),!t)for(var n in this)"t"===n.charAt(0)&&m.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=y)},stop:function(){this.done=!0;var t=this.tryEntries[0],n=t.completion;if("throw"===n.type)throw n.arg;return this.rval},dispatchException:function(t){function n(n,r){return o.type="throw",o.arg=t,e.next=n,r&&(e.method="next",e.arg=y),!!r}if(this.done)throw t;for(var e=this,r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r],o=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=m.call(i,"catchLoc"),s=m.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,n){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc<=this.prev&&m.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var i=r;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=n&&n<=i.finallyLoc&&(i=null);var o=i?i.completion:{};return o.type=t,o.arg=n,i?(this.method="next",this.next=i.finallyLoc,j):this.complete(o)},complete:function(t,n){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&n&&(this.next=n),j},finish:function(t){for(var n=this.tryEntries.length-1;n>=0;--n){var e=this.tryEntries[n];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),h(e),j}},catch:function(t){for(var n=this.tryEntries.length-1;n>=0;--n){var e=this.tryEntries[n];if(e.tryLoc===t){var r=e.completion;if("throw"===r.type){var i=r.arg;h(e)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(t,n,e){return this.delegate={iterator:p(t),resultName:n,nextLoc:e},"next"===this.method&&(this.arg=y),j}}}(function(){return this}()||Function("return this")())},function(t,n,e){!function(n,e){t.exports=e()}(this,function(){"use strict";function t(t){return parseFloat(t)||0}function n(n){var e=Array.prototype.slice.call(arguments,1);return e.reduce(function(e,r){var i=n["border-"+r+"-width"];return e+t(i)},0)}function e(n){for(var e=["top","right","bottom","left"],r={},i=0,o=e;i<o.length;i+=1){var c=o[i],s=n["padding-"+c];r[c]=t(s)}return r}function r(t){var n=t.getBBox();return u(0,0,n.width,n.height)}function i(r){var i=r.clientWidth,c=r.clientHeight;if(!i&&!c)return _;var s=getComputedStyle(r),a=e(s),f=a.left+a.right,l=a.top+a.bottom,h=t(s.width),v=t(s.height);if("border-box"===s.boxSizing&&(Math.round(h+f)!==i&&(h-=n(s,"left","right")+f),Math.round(v+l)!==c&&(v-=n(s,"top","bottom")+l)),!o(r)){var p=Math.round(h+f)-i,d=Math.round(v+l)-c;1!==Math.abs(p)&&(h-=p),1!==Math.abs(d)&&(v-=d)}return u(a.left,a.top,h,v)}function o(t){return t===document.documentElement}function c(t){return f?w(t)?r(t):i(t):_}function s(t){var n=t.x,e=t.y,r=t.width,i=t.height,o="undefined"!=typeof DOMRectReadOnly?DOMRectReadOnly:Object,c=Object.create(o.prototype);return b(c,{x:n,y:e,width:r,height:i,top:e,right:n+r,bottom:i+e,left:n}),c}function u(t,n,e,r){return{x:t,y:n,width:e,height:r}}var a=function(){function t(t,n){var e=-1;return t.some(function(t,r){return t[0]===n&&(e=r,!0)}),e}return"undefined"!=typeof Map?Map:function(){function n(){this.__entries__=[]}var e={size:{}};return e.size.get=function(){return this.__entries__.length},n.prototype.get=function(n){var e=t(this.__entries__,n),r=this.__entries__[e];return r&&r[1]},n.prototype.set=function(n,e){var r=t(this.__entries__,n);~r?this.__entries__[r][1]=e:this.__entries__.push([n,e])},n.prototype.delete=function(n){var e=this.__entries__,r=t(e,n);~r&&e.splice(r,1)},n.prototype.has=function(n){return!!~t(this.__entries__,n)},n.prototype.clear=function(){this.__entries__.splice(0)},n.prototype.forEach=function(t,n){void 0===n&&(n=null);for(var e=0,r=this.__entries__;e<r.length;e+=1){var i=r[e];t.call(n,i[1],i[0])}},Object.defineProperties(n.prototype,e),n}()}(),f="undefined"!=typeof window&&"undefined"!=typeof document&&window.document===document,l=function(){return"function"==typeof requestAnimationFrame?requestAnimationFrame:function(t){return setTimeout(function(){return t(Date.now())},1e3/60)}}(),h=2,v=function(t,n){function e(){o&&(o=!1,t()),c&&i()}function r(){l(e)}function i(){var t=Date.now();if(o){if(t-s<h)return;c=!0}else o=!0,c=!1,setTimeout(r,n);s=t}var o=!1,c=!1,s=0;return i},p=20,d=["top","right","bottom","left","width","height","size","weight"],y="undefined"!=typeof navigator&&/Trident\/.*rv:11/.test(navigator.userAgent),g="undefined"!=typeof MutationObserver&&!y,m=function(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=v(this.refresh.bind(this),p)};m.prototype.addObserver=function(t){~this.observers_.indexOf(t)||this.observers_.push(t),this.connected_||this.connect_()},m.prototype.removeObserver=function(t){var n=this.observers_,e=n.indexOf(t);~e&&n.splice(e,1),!n.length&&this.connected_&&this.disconnect_()},m.prototype.refresh=function(){var t=this.updateObservers_();t&&this.refresh()},m.prototype.updateObservers_=function(){var t=this.observers_.filter(function(t){return t.gatherActive(),t.hasActive()});return t.forEach(function(t){return t.broadcastActive()}),t.length>0},m.prototype.connect_=function(){f&&!this.connected_&&(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),g?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},m.prototype.disconnect_=function(){f&&this.connected_&&(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},m.prototype.onTransitionEnd_=function(t){var n=t.propertyName,e=d.some(function(t){return!!~n.indexOf(t)});e&&this.refresh()},m.getInstance=function(){return this.instance_||(this.instance_=new m),this.instance_},m.instance_=null;var b=function(t,n){for(var e=0,r=Object.keys(n);e<r.length;e+=1){var i=r[e];Object.defineProperty(t,i,{value:n[i],enumerable:!1,writable:!1,configurable:!0})}return t},_=u(0,0,0,0),w=function(){return"undefined"!=typeof SVGGraphicsElement?function(t){return t instanceof SVGGraphicsElement}:function(t){return t instanceof SVGElement&&"function"==typeof t.getBBox}}(),S=function(t){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=u(0,0,0,0),this.target=t};S.prototype.isActive=function(){var t=c(this.target);return this.contentRect_=t,t.width!==this.broadcastWidth||t.height!==this.broadcastHeight},S.prototype.broadcastRect=function(){var t=this.contentRect_;return this.broadcastWidth=t.width,this.broadcastHeight=t.height,t};var x=function(t,n){var e=s(n);b(this,{target:t,contentRect:e})},E=function(t,n,e){if("function"!=typeof t)throw new TypeError("The callback provided as parameter 1 is not a function.");this.activeObservations_=[],this.observations_=new a,this.callback_=t,this.controller_=n,this.callbackCtx_=e};E.prototype.observe=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof Element))throw new TypeError('parameter 1 is not of type "Element".');var n=this.observations_;n.has(t)||(n.set(t,new S(t)),this.controller_.addObserver(this),this.controller_.refresh())}},E.prototype.unobserve=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof Element))throw new TypeError('parameter 1 is not of type "Element".');var n=this.observations_;n.has(t)&&(n.delete(t),n.size||this.controller_.removeObserver(this))}},E.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},E.prototype.gatherActive=function(){var t=this;this.clearActive(),this.observations_.forEach(function(n){n.isActive()&&t.activeObservations_.push(n)})},E.prototype.broadcastActive=function(){if(this.hasActive()){var t=this.callbackCtx_,n=this.activeObservations_.map(function(t){return new x(t.target,t.broadcastRect())});this.callback_.call(t,n,t),this.clearActive()}},E.prototype.clearActive=function(){this.activeObservations_.splice(0)},E.prototype.hasActive=function(){return this.activeObservations_.length>0};var O="undefined"!=typeof WeakMap?new WeakMap:new a,M=function(t){if(!(this instanceof M))throw new TypeError("Cannot call a class as a function");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var n=m.getInstance(),e=new E(t,n,this);O.set(this,e)};["observe","unobserve","disconnect"].forEach(function(t){M.prototype[t]=function(){return(n=O.get(this))[t].apply(n,arguments);var n}});var A=function(){return"undefined"!=typeof ResizeObserver?ResizeObserver:M}();return A})},function(t,n,e){var r,i,o;/*! scrollbarWidth.js v0.1.0 | felixexter | MIT | https://github.com/felixexter/scrollbarWidth */
!function(e,c){i=[],r=c,o="function"==typeof r?r.apply(n,i):r,!(void 0!==o&&(t.exports=o))}(this,function(){"use strict";function t(){var t,n=document.body,e=document.createElement("div"),r=e.style;return r.position="absolute",r.top=r.left="-9999px",r.width=r.height="100px",r.overflow="scroll",n.appendChild(e),t=e.offsetWidth-e.clientWidth,n.removeChild(e),t}return t})}])});
/**
 * Owl Carousel v2.2.1
 * Copyright 2013-2017 David Deutsch
 * Licensed under  ()
 */
/**
 * Owl carousel
 * @version 2.1.6
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 * @todo Lazy Load Icon
 * @todo prevent animationend bubling
 * @todo itemsScaleUp
 * @todo Test Zepto
 * @todo stagePadding calculate wrong active classes
 */
;(function($, window, document, undefined) {

	/**
	 * Creates a carousel.
	 * @class The Owl Carousel.
	 * @public
	 * @param {HTMLElement|jQuery} element - The element to create the carousel for.
	 * @param {Object} [options] - The options
	 */
	function Owl(element, options) {

		/**
		 * Current settings for the carousel.
		 * @public
		 */
		this.settings = null;

		/**
		 * Current options set by the caller including defaults.
		 * @public
		 */
		this.options = $.extend({}, Owl.Defaults, options);

		/**
		 * Plugin element.
		 * @public
		 */
		this.$element = $(element);

		/**
		 * Proxied event handlers.
		 * @protected
		 */
		this._handlers = {};

		/**
		 * References to the running plugins of this carousel.
		 * @protected
		 */
		this._plugins = {};

		/**
		 * Currently suppressed events to prevent them from beeing retriggered.
		 * @protected
		 */
		this._supress = {};

		/**
		 * Absolute current position.
		 * @protected
		 */
		this._current = null;

		/**
		 * Animation speed in milliseconds.
		 * @protected
		 */
		this._speed = null;

		/**
		 * Coordinates of all items in pixel.
		 * @todo The name of this member is missleading.
		 * @protected
		 */
		this._coordinates = [];

		/**
		 * Current breakpoint.
		 * @todo Real media queries would be nice.
		 * @protected
		 */
		this._breakpoint = null;

		/**
		 * Current width of the plugin element.
		 */
		this._width = null;

		/**
		 * All real items.
		 * @protected
		 */
		this._items = [];

		/**
		 * All cloned items.
		 * @protected
		 */
		this._clones = [];

		/**
		 * Merge values of all items.
		 * @todo Maybe this could be part of a plugin.
		 * @protected
		 */
		this._mergers = [];

		/**
		 * Widths of all items.
		 */
		this._widths = [];

		/**
		 * Invalidated parts within the update process.
		 * @protected
		 */
		this._invalidated = {};

		/**
		 * Ordered list of workers for the update process.
		 * @protected
		 */
		this._pipe = [];

		/**
		 * Current state information for the drag operation.
		 * @todo #261
		 * @protected
		 */
		this._drag = {
			time: null,
			target: null,
			pointer: null,
			stage: {
				start: null,
				current: null
			},
			direction: null
		};

		/**
		 * Current state information and their tags.
		 * @type {Object}
		 * @protected
		 */
		this._states = {
			current: {},
			tags: {
				'initializing': [ 'busy' ],
				'animating': [ 'busy' ],
				'dragging': [ 'interacting' ]
			}
		};

		$.each([ 'onResize', 'onThrottledResize' ], $.proxy(function(i, handler) {
			this._handlers[handler] = $.proxy(this[handler], this);
		}, this));

		$.each(Owl.Plugins, $.proxy(function(key, plugin) {
			this._plugins[key.charAt(0).toLowerCase() + key.slice(1)]
				= new plugin(this);
		}, this));

		$.each(Owl.Workers, $.proxy(function(priority, worker) {
			this._pipe.push({
				'filter': worker.filter,
				'run': $.proxy(worker.run, this)
			});
		}, this));

		this.setup();
		this.initialize();
	}

	/**
	 * Default options for the carousel.
	 * @public
	 */
	Owl.Defaults = {
		items: 3,
		loop: false,
		center: false,
		rewind: false,

		mouseDrag: true,
		touchDrag: true,
		pullDrag: true,
		freeDrag: false,

		margin: 0,
		stagePadding: 0,

		merge: false,
		mergeFit: true,
		autoWidth: false,

		startPosition: 0,
		rtl: false,

		smartSpeed: 250,
		fluidSpeed: false,
		dragEndSpeed: false,

		responsive: {},
		responsiveRefreshRate: 200,
		responsiveBaseElement: window,

		fallbackEasing: 'swing',

		info: false,

		nestedItemSelector: false,
		itemElement: 'div',
		stageElement: 'div',

		refreshClass: 'owl-refresh',
		loadedClass: 'owl-loaded',
		loadingClass: 'owl-loading',
		rtlClass: 'owl-rtl',
		responsiveClass: 'owl-responsive',
		dragClass: 'owl-drag',
		itemClass: 'owl-item',
		stageClass: 'owl-stage',
		stageOuterClass: 'owl-stage-outer',
		grabClass: 'owl-grab'
	};

	/**
	 * Enumeration for width.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
	Owl.Width = {
		Default: 'default',
		Inner: 'inner',
		Outer: 'outer'
	};

	/**
	 * Enumeration for types.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
	Owl.Type = {
		Event: 'event',
		State: 'state'
	};

	/**
	 * Contains all registered plugins.
	 * @public
	 */
	Owl.Plugins = {};

	/**
	 * List of workers involved in the update process.
	 */
	Owl.Workers = [ {
		filter: [ 'width', 'settings' ],
		run: function() {
			this._width = this.$element.width();
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			cache.current = this._items && this._items[this.relative(this._current)];
		}
	}, {
		filter: [ 'items', 'settings' ],
		run: function() {
			this.$stage.children('.cloned').remove();
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			var margin = this.settings.margin || '',
				grid = !this.settings.autoWidth,
				rtl = this.settings.rtl,
				css = {
					'width': 'auto',
					'margin-left': rtl ? margin : '',
					'margin-right': rtl ? '' : margin
				};

			!grid && this.$stage.children().css(css);

			cache.css = css;
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			var width = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
				merge = null,
				iterator = this._items.length,
				grid = !this.settings.autoWidth,
				widths = [];

			cache.items = {
				merge: false,
				width: width
			};

			while (iterator--) {
				merge = this._mergers[iterator];
				merge = this.settings.mergeFit && Math.min(merge, this.settings.items) || merge;

				cache.items.merge = merge > 1 || cache.items.merge;

				widths[iterator] = !grid ? this._items[iterator].width() : width * merge;
			}

			this._widths = widths;
		}
	}, {
		filter: [ 'items', 'settings' ],
		run: function() {
			var clones = [],
				items = this._items,
				settings = this.settings,
				// TODO: Should be computed from number of min width items in stage
				view = Math.max(settings.items * 2, 4),
				size = Math.ceil(items.length / 2) * 2,
				repeat = settings.loop && items.length ? settings.rewind ? view : Math.max(view, size) : 0,
				append = '',
				prepend = '';

			repeat /= 2;

			while (repeat--) {
				// Switch to only using appended clones
				clones.push(this.normalize(clones.length / 2, true));
				append = append + items[clones[clones.length - 1]][0].outerHTML;
				clones.push(this.normalize(items.length - 1 - (clones.length - 1) / 2, true));
				prepend = items[clones[clones.length - 1]][0].outerHTML + prepend;
			}

			this._clones = clones;

			$(append).addClass('cloned').appendTo(this.$stage);
			$(prepend).addClass('cloned').prependTo(this.$stage);
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function() {
			var rtl = this.settings.rtl ? 1 : -1,
				size = this._clones.length + this._items.length,
				iterator = -1,
				previous = 0,
				current = 0,
				coordinates = [];

			while (++iterator < size) {
				previous = coordinates[iterator - 1] || 0;
				current = this._widths[this.relative(iterator)] + this.settings.margin;
				coordinates.push(previous + current * rtl);
			}

			this._coordinates = coordinates;
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function() {
			var padding = this.settings.stagePadding,
				coordinates = this._coordinates,
				css = {
					'width': Math.ceil(Math.abs(coordinates[coordinates.length - 1])) + padding * 2,
					'padding-left': padding || '',
					'padding-right': padding || ''
				};

			this.$stage.css(css);
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			var iterator = this._coordinates.length,
				grid = !this.settings.autoWidth,
				items = this.$stage.children();

			if (grid && cache.items.merge) {
				while (iterator--) {
					cache.css.width = this._widths[this.relative(iterator)];
					items.eq(iterator).css(cache.css);
				}
			} else if (grid) {
				cache.css.width = cache.items.width;
				items.css(cache.css);
			}
		}
	}, {
		filter: [ 'items' ],
		run: function() {
			this._coordinates.length < 1 && this.$stage.removeAttr('style');
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			cache.current = cache.current ? this.$stage.children().index(cache.current) : 0;
			cache.current = Math.max(this.minimum(), Math.min(this.maximum(), cache.current));
			this.reset(cache.current);
		}
	}, {
		filter: [ 'position' ],
		run: function() {
			this.animate(this.coordinates(this._current));
		}
	}, {
		filter: [ 'width', 'position', 'items', 'settings' ],
		run: function() {
			var rtl = this.settings.rtl ? 1 : -1,
				padding = this.settings.stagePadding * 2,
				begin = this.coordinates(this.current()) + padding,
				end = begin + this.width() * rtl,
				inner, outer, matches = [], i, n;

			for (i = 0, n = this._coordinates.length; i < n; i++) {
				inner = this._coordinates[i - 1] || 0;
				outer = Math.abs(this._coordinates[i]) + padding * rtl;

				if ((this.op(inner, '<=', begin) && (this.op(inner, '>', end)))
					|| (this.op(outer, '<', begin) && this.op(outer, '>', end))) {
					matches.push(i);
				}
			}

			this.$stage.children('.active').removeClass('active');
			this.$stage.children(':eq(' + matches.join('), :eq(') + ')').addClass('active');

			if (this.settings.center) {
				this.$stage.children('.center').removeClass('center');
				this.$stage.children().eq(this.current()).addClass('center');
			}
		}
	} ];

	/**
	 * Initializes the carousel.
	 * @protected
	 */
	Owl.prototype.initialize = function() {
		this.enter('initializing');
		this.trigger('initialize');

		this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl);

		if (this.settings.autoWidth && !this.is('pre-loading')) {
			var imgs, nestedSelector, width;
			imgs = this.$element.find('img');
			nestedSelector = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : undefined;
			width = this.$element.children(nestedSelector).width();

			if (imgs.length && width <= 0) {
				this.preloadAutoWidthImages(imgs);
			}
		}

		this.$element.addClass(this.options.loadingClass);

		// create stage
		this.$stage = $('<' + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>')
			.wrap('<div class="' + this.settings.stageOuterClass + '"/>');

		// append stage
		this.$element.append(this.$stage.parent());

		// append content
		this.replace(this.$element.children().not(this.$stage.parent()));

		// check visibility
		if (this.$element.is(':visible')) {
			// update view
			this.refresh();
		} else {
			// invalidate width
			this.invalidate('width');
		}

		this.$element
			.removeClass(this.options.loadingClass)
			.addClass(this.options.loadedClass);

		// register event handlers
		this.registerEventHandlers();

		this.leave('initializing');
		this.trigger('initialized');
	};

	/**
	 * Setups the current settings.
	 * @todo Remove responsive classes. Why should adaptive designs be brought into IE8?
	 * @todo Support for media queries by using `matchMedia` would be nice.
	 * @public
	 */
	Owl.prototype.setup = function() {
		var viewport = this.viewport(),
			overwrites = this.options.responsive,
			match = -1,
			settings = null;

		if (!overwrites) {
			settings = $.extend({}, this.options);
		} else {
			$.each(overwrites, function(breakpoint) {
				if (breakpoint <= viewport && breakpoint > match) {
					match = Number(breakpoint);
				}
			});

			settings = $.extend({}, this.options, overwrites[match]);
			if (typeof settings.stagePadding === 'function') {
				settings.stagePadding = settings.stagePadding();
			}
			delete settings.responsive;

			// responsive class
			if (settings.responsiveClass) {
				this.$element.attr('class',
					this.$element.attr('class').replace(new RegExp('(' + this.options.responsiveClass + '-)\\S+\\s', 'g'), '$1' + match)
				);
			}
		}

		this.trigger('change', { property: { name: 'settings', value: settings } });
		this._breakpoint = match;
		this.settings = settings;
		this.invalidate('settings');
		this.trigger('changed', { property: { name: 'settings', value: this.settings } });
	};

	/**
	 * Updates option logic if necessery.
	 * @protected
	 */
	Owl.prototype.optionsLogic = function() {
		if (this.settings.autoWidth) {
			this.settings.stagePadding = false;
			this.settings.merge = false;
		}
	};

	/**
	 * Prepares an item before add.
	 * @todo Rename event parameter `content` to `item`.
	 * @protected
	 * @returns {jQuery|HTMLElement} - The item container.
	 */
	Owl.prototype.prepare = function(item) {
		var event = this.trigger('prepare', { content: item });

		if (!event.data) {
			event.data = $('<' + this.settings.itemElement + '/>')
				.addClass(this.options.itemClass).append(item)
		}

		this.trigger('prepared', { content: event.data });

		return event.data;
	};

	/**
	 * Updates the view.
	 * @public
	 */
	Owl.prototype.update = function() {
		var i = 0,
			n = this._pipe.length,
			filter = $.proxy(function(p) { return this[p] }, this._invalidated),
			cache = {};

		while (i < n) {
			if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
				this._pipe[i].run(cache);
			}
			i++;
		}

		this._invalidated = {};

		!this.is('valid') && this.enter('valid');
	};

	/**
	 * Gets the width of the view.
	 * @public
	 * @param {Owl.Width} [dimension=Owl.Width.Default] - The dimension to return.
	 * @returns {Number} - The width of the view in pixel.
	 */
	Owl.prototype.width = function(dimension) {
		dimension = dimension || Owl.Width.Default;
		switch (dimension) {
			case Owl.Width.Inner:
			case Owl.Width.Outer:
				return this._width;
			default:
				return this._width - this.settings.stagePadding * 2 + this.settings.margin;
		}
	};

	/**
	 * Refreshes the carousel primarily for adaptive purposes.
	 * @public
	 */
	Owl.prototype.refresh = function() {
		this.enter('refreshing');
		this.trigger('refresh');

		this.setup();

		this.optionsLogic();

		this.$element.addClass(this.options.refreshClass);

		this.update();

		this.$element.removeClass(this.options.refreshClass);

		this.leave('refreshing');
		this.trigger('refreshed');
	};

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
	Owl.prototype.onThrottledResize = function() {
		window.clearTimeout(this.resizeTimer);
		this.resizeTimer = window.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate);
	};

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
	Owl.prototype.onResize = function() {
		if (!this._items.length) {
			return false;
		}

		if (this._width === this.$element.width()) {
			return false;
		}

		if (!this.$element.is(':visible')) {
			return false;
		}

		this.enter('resizing');

		if (this.trigger('resize').isDefaultPrevented()) {
			this.leave('resizing');
			return false;
		}

		this.invalidate('width');

		this.refresh();

		this.leave('resizing');
		this.trigger('resized');
	};

	/**
	 * Registers event handlers.
	 * @todo Check `msPointerEnabled`
	 * @todo #261
	 * @protected
	 */
	Owl.prototype.registerEventHandlers = function() {
		if ($.support.transition) {
			this.$stage.on($.support.transition.end + '.owl.core', $.proxy(this.onTransitionEnd, this));
		}

		if (this.settings.responsive !== false) {
			this.on(window, 'resize', this._handlers.onThrottledResize);
		}

		if (this.settings.mouseDrag) {
			this.$element.addClass(this.options.dragClass);
			this.$stage.on('mousedown.owl.core', $.proxy(this.onDragStart, this));
			this.$stage.on('dragstart.owl.core selectstart.owl.core', function() { return false });
		}

		if (this.settings.touchDrag){
			this.$stage.on('touchstart.owl.core', $.proxy(this.onDragStart, this));
			this.$stage.on('touchcancel.owl.core', $.proxy(this.onDragEnd, this));
		}
	};

	/**
	 * Handles `touchstart` and `mousedown` events.
	 * @todo Horizontal swipe threshold as option
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragStart = function(event) {
		var stage = null;

		if (event.which === 3) {
			return;
		}

		if ($.support.transform) {
			stage = this.$stage.css('transform').replace(/.*\(|\)| /g, '').split(',');
			stage = {
				x: stage[stage.length === 16 ? 12 : 4],
				y: stage[stage.length === 16 ? 13 : 5]
			};
		} else {
			stage = this.$stage.position();
			stage = {
				x: this.settings.rtl ?
					stage.left + this.$stage.width() - this.width() + this.settings.margin :
					stage.left,
				y: stage.top
			};
		}

		if (this.is('animating')) {
			$.support.transform ? this.animate(stage.x) : this.$stage.stop()
			this.invalidate('position');
		}

		this.$element.toggleClass(this.options.grabClass, event.type === 'mousedown');

		this.speed(0);

		this._drag.time = new Date().getTime();
		this._drag.target = $(event.target);
		this._drag.stage.start = stage;
		this._drag.stage.current = stage;
		this._drag.pointer = this.pointer(event);

		$(document).on('mouseup.owl.core touchend.owl.core', $.proxy(this.onDragEnd, this));

		$(document).one('mousemove.owl.core touchmove.owl.core', $.proxy(function(event) {
			var delta = this.difference(this._drag.pointer, this.pointer(event));

			$(document).on('mousemove.owl.core touchmove.owl.core', $.proxy(this.onDragMove, this));

			if (Math.abs(delta.x) < Math.abs(delta.y) && this.is('valid')) {
				return;
			}

			event.preventDefault();

			this.enter('dragging');
			this.trigger('drag');
		}, this));
	};

	/**
	 * Handles the `touchmove` and `mousemove` events.
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragMove = function(event) {
		var minimum = null,
			maximum = null,
			pull = null,
			delta = this.difference(this._drag.pointer, this.pointer(event)),
			stage = this.difference(this._drag.stage.start, delta);

		if (!this.is('dragging')) {
			return;
		}

		event.preventDefault();

		if (this.settings.loop) {
			minimum = this.coordinates(this.minimum());
			maximum = this.coordinates(this.maximum() + 1) - minimum;
			stage.x = (((stage.x - minimum) % maximum + maximum) % maximum) + minimum;
		} else {
			minimum = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
			maximum = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
			pull = this.settings.pullDrag ? -1 * delta.x / 5 : 0;
			stage.x = Math.max(Math.min(stage.x, minimum + pull), maximum + pull);
		}

		this._drag.stage.current = stage;

		this.animate(stage.x);
	};

	/**
	 * Handles the `touchend` and `mouseup` events.
	 * @todo #261
	 * @todo Threshold for click event
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragEnd = function(event) {
		var delta = this.difference(this._drag.pointer, this.pointer(event)),
			stage = this._drag.stage.current,
			direction = delta.x > 0 ^ this.settings.rtl ? 'left' : 'right';

		$(document).off('.owl.core');

		this.$element.removeClass(this.options.grabClass);

		if (delta.x !== 0 && this.is('dragging') || !this.is('valid')) {
			this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
			this.current(this.closest(stage.x, delta.x !== 0 ? direction : this._drag.direction));
			this.invalidate('position');
			this.update();

			this._drag.direction = direction;

			if (Math.abs(delta.x) > 3 || new Date().getTime() - this._drag.time > 300) {
				this._drag.target.one('click.owl.core', function() { return false; });
			}
		}

		if (!this.is('dragging')) {
			return;
		}

		this.leave('dragging');
		this.trigger('dragged');
	};

	/**
	 * Gets absolute position of the closest item for a coordinate.
	 * @todo Setting `freeDrag` makes `closest` not reusable. See #165.
	 * @protected
	 * @param {Number} coordinate - The coordinate in pixel.
	 * @param {String} direction - The direction to check for the closest item. Ether `left` or `right`.
	 * @return {Number} - The absolute position of the closest item.
	 */
	Owl.prototype.closest = function(coordinate, direction) {
		var position = -1,
			pull = 30,
			width = this.width(),
			coordinates = this.coordinates();

		if (!this.settings.freeDrag) {
			// check closest item
			$.each(coordinates, $.proxy(function(index, value) {
				// on a left pull, check on current index
				if (direction === 'left' && coordinate > value - pull && coordinate < value + pull) {
					position = index;
				// on a right pull, check on previous index
				// to do so, subtract width from value and set position = index + 1
				} else if (direction === 'right' && coordinate > value - width - pull && coordinate < value - width + pull) {
					position = index + 1;
				} else if (this.op(coordinate, '<', value)
					&& this.op(coordinate, '>', coordinates[index + 1] || value - width)) {
					position = direction === 'left' ? index + 1 : index;
				}
				return position === -1;
			}, this));
		}

		if (!this.settings.loop) {
			// non loop boundries
			if (this.op(coordinate, '>', coordinates[this.minimum()])) {
				position = coordinate = this.minimum();
			} else if (this.op(coordinate, '<', coordinates[this.maximum()])) {
				position = coordinate = this.maximum();
			}
		}

		return position;
	};

	/**
	 * Animates the stage.
	 * @todo #270
	 * @public
	 * @param {Number} coordinate - The coordinate in pixels.
	 */
	Owl.prototype.animate = function(coordinate) {
		var animate = this.speed() > 0;

		this.is('animating') && this.onTransitionEnd();

		if (animate) {
			this.enter('animating');
			this.trigger('translate');
		}

		if ($.support.transform3d && $.support.transition) {
			this.$stage.css({
				transform: 'translate3d(' + coordinate + 'px,0px,0px)',
				transition: (this.speed() / 1000) + 's'
			});
		} else if (animate) {
			this.$stage.animate({
				left: coordinate + 'px'
			}, this.speed(), this.settings.fallbackEasing, $.proxy(this.onTransitionEnd, this));
		} else {
			this.$stage.css({
				left: coordinate + 'px'
			});
		}
	};

	/**
	 * Checks whether the carousel is in a specific state or not.
	 * @param {String} state - The state to check.
	 * @returns {Boolean} - The flag which indicates if the carousel is busy.
	 */
	Owl.prototype.is = function(state) {
		return this._states.current[state] && this._states.current[state] > 0;
	};

	/**
	 * Sets the absolute position of the current item.
	 * @public
	 * @param {Number} [position] - The new absolute position or nothing to leave it unchanged.
	 * @returns {Number} - The absolute position of the current item.
	 */
	Owl.prototype.current = function(position) {
		if (position === undefined) {
			return this._current;
		}

		if (this._items.length === 0) {
			return undefined;
		}

		position = this.normalize(position);

		if (this._current !== position) {
			var event = this.trigger('change', { property: { name: 'position', value: position } });

			if (event.data !== undefined) {
				position = this.normalize(event.data);
			}

			this._current = position;

			this.invalidate('position');

			this.trigger('changed', { property: { name: 'position', value: this._current } });
		}

		return this._current;
	};

	/**
	 * Invalidates the given part of the update routine.
	 * @param {String} [part] - The part to invalidate.
	 * @returns {Array.<String>} - The invalidated parts.
	 */
	Owl.prototype.invalidate = function(part) {
		if ($.type(part) === 'string') {
			this._invalidated[part] = true;
			this.is('valid') && this.leave('valid');
		}
		return $.map(this._invalidated, function(v, i) { return i });
	};

	/**
	 * Resets the absolute position of the current item.
	 * @public
	 * @param {Number} position - The absolute position of the new item.
	 */
	Owl.prototype.reset = function(position) {
		position = this.normalize(position);

		if (position === undefined) {
			return;
		}

		this._speed = 0;
		this._current = position;

		this.suppress([ 'translate', 'translated' ]);

		this.animate(this.coordinates(position));

		this.release([ 'translate', 'translated' ]);
	};

	/**
	 * Normalizes an absolute or a relative position of an item.
	 * @public
	 * @param {Number} position - The absolute or relative position to normalize.
	 * @param {Boolean} [relative=false] - Whether the given position is relative or not.
	 * @returns {Number} - The normalized position.
	 */
	Owl.prototype.normalize = function(position, relative) {
		var n = this._items.length,
			m = relative ? 0 : this._clones.length;

		if (!this.isNumeric(position) || n < 1) {
			position = undefined;
		} else if (position < 0 || position >= n + m) {
			position = ((position - m / 2) % n + n) % n + m / 2;
		}

		return position;
	};

	/**
	 * Converts an absolute position of an item into a relative one.
	 * @public
	 * @param {Number} position - The absolute position to convert.
	 * @returns {Number} - The converted position.
	 */
	Owl.prototype.relative = function(position) {
		position -= this._clones.length / 2;
		return this.normalize(position, true);
	};

	/**
	 * Gets the maximum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
	Owl.prototype.maximum = function(relative) {
		var settings = this.settings,
			maximum = this._coordinates.length,
			iterator,
			reciprocalItemsWidth,
			elementWidth;

		if (settings.loop) {
			maximum = this._clones.length / 2 + this._items.length - 1;
		} else if (settings.autoWidth || settings.merge) {
			iterator = this._items.length;
			reciprocalItemsWidth = this._items[--iterator].width();
			elementWidth = this.$element.width();
			while (iterator--) {
				reciprocalItemsWidth += this._items[iterator].width() + this.settings.margin;
				if (reciprocalItemsWidth > elementWidth) {
					break;
				}
			}
			maximum = iterator + 1;
		} else if (settings.center) {
			maximum = this._items.length - 1;
		} else {
			maximum = this._items.length - settings.items;
		}

		if (relative) {
			maximum -= this._clones.length / 2;
		}

		return Math.max(maximum, 0);
	};

	/**
	 * Gets the minimum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
	Owl.prototype.minimum = function(relative) {
		return relative ? 0 : this._clones.length / 2;
	};

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
	Owl.prototype.items = function(position) {
		if (position === undefined) {
			return this._items.slice();
		}

		position = this.normalize(position, true);
		return this._items[position];
	};

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
	Owl.prototype.mergers = function(position) {
		if (position === undefined) {
			return this._mergers.slice();
		}

		position = this.normalize(position, true);
		return this._mergers[position];
	};

	/**
	 * Gets the absolute positions of clones for an item.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @returns {Array.<Number>} - The absolute positions of clones for the item or all if no position was given.
	 */
	Owl.prototype.clones = function(position) {
		var odd = this._clones.length / 2,
			even = odd + this._items.length,
			map = function(index) { return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2 };

		if (position === undefined) {
			return $.map(this._clones, function(v, i) { return map(i) });
		}

		return $.map(this._clones, function(v, i) { return v === position ? map(i) : null });
	};

	/**
	 * Sets the current animation speed.
	 * @public
	 * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
	 * @returns {Number} - The current animation speed in milliseconds.
	 */
	Owl.prototype.speed = function(speed) {
		if (speed !== undefined) {
			this._speed = speed;
		}

		return this._speed;
	};

	/**
	 * Gets the coordinate of an item.
	 * @todo The name of this method is missleanding.
	 * @public
	 * @param {Number} position - The absolute position of the item within `minimum()` and `maximum()`.
	 * @returns {Number|Array.<Number>} - The coordinate of the item in pixel or all coordinates.
	 */
	Owl.prototype.coordinates = function(position) {
		var multiplier = 1,
			newPosition = position - 1,
			coordinate;

		if (position === undefined) {
			return $.map(this._coordinates, $.proxy(function(coordinate, index) {
				return this.coordinates(index);
			}, this));
		}

		if (this.settings.center) {
			if (this.settings.rtl) {
				multiplier = -1;
				newPosition = position + 1;
			}

			coordinate = this._coordinates[position];
			coordinate += (this.width() - coordinate + (this._coordinates[newPosition] || 0)) / 2 * multiplier;
		} else {
			coordinate = this._coordinates[newPosition] || 0;
		}

		coordinate = Math.ceil(coordinate);

		return coordinate;
	};

	/**
	 * Calculates the speed for a translation.
	 * @protected
	 * @param {Number} from - The absolute position of the start item.
	 * @param {Number} to - The absolute position of the target item.
	 * @param {Number} [factor=undefined] - The time factor in milliseconds.
	 * @returns {Number} - The time in milliseconds for the translation.
	 */
	Owl.prototype.duration = function(from, to, factor) {
		if (factor === 0) {
			return 0;
		}

		return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs((factor || this.settings.smartSpeed));
	};

	/**
	 * Slides to the specified item.
	 * @public
	 * @param {Number} position - The position of the item.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.to = function(position, speed) {
		var current = this.current(),
			revert = null,
			distance = position - this.relative(current),
			direction = (distance > 0) - (distance < 0),
			items = this._items.length,
			minimum = this.minimum(),
			maximum = this.maximum();

		if (this.settings.loop) {
			if (!this.settings.rewind && Math.abs(distance) > items / 2) {
				distance += direction * -1 * items;
			}

			position = current + distance;
			revert = ((position - minimum) % items + items) % items + minimum;

			if (revert !== position && revert - distance <= maximum && revert - distance > 0) {
				current = revert - distance;
				position = revert;
				this.reset(current);
			}
		} else if (this.settings.rewind) {
			maximum += 1;
			position = (position % maximum + maximum) % maximum;
		} else {
			position = Math.max(minimum, Math.min(maximum, position));
		}

		this.speed(this.duration(current, position, speed));
		this.current(position);

		if (this.$element.is(':visible')) {
			this.update();
		}
	};

	/**
	 * Slides to the next item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.next = function(speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) + 1, speed);
	};

	/**
	 * Slides to the previous item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.prev = function(speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) - 1, speed);
	};

	/**
	 * Handles the end of an animation.
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onTransitionEnd = function(event) {

		// if css2 animation then event object is undefined
		if (event !== undefined) {
			event.stopPropagation();

			// Catch only owl-stage transitionEnd event
			if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) {
				return false;
			}
		}

		this.leave('animating');
		this.trigger('translated');
	};

	/**
	 * Gets viewport width.
	 * @protected
	 * @return {Number} - The width in pixel.
	 */
	Owl.prototype.viewport = function() {
		var width;
		if (this.options.responsiveBaseElement !== window) {
			width = $(this.options.responsiveBaseElement).width();
		} else if (window.innerWidth) {
			width = window.innerWidth;
		} else if (document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
		} else {
			console.warn('Can not detect viewport width.');
		}
		return width;
	};

	/**
	 * Replaces the current content.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The new content.
	 */
	Owl.prototype.replace = function(content) {
		this.$stage.empty();
		this._items = [];

		if (content) {
			content = (content instanceof jQuery) ? content : $(content);
		}

		if (this.settings.nestedItemSelector) {
			content = content.find('.' + this.settings.nestedItemSelector);
		}

		content.filter(function() {
			return this.nodeType === 1;
		}).each($.proxy(function(index, item) {
			item = this.prepare(item);
			this.$stage.append(item);
			this._items.push(item);
			this._mergers.push(item.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
		}, this));

		this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);

		this.invalidate('items');
	};

	/**
	 * Adds an item.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The item content to add.
	 * @param {Number} [position] - The relative position at which to insert the item otherwise the item will be added to the end.
	 */
	Owl.prototype.add = function(content, position) {
		var current = this.relative(this._current);

		position = position === undefined ? this._items.length : this.normalize(position, true);
		content = content instanceof jQuery ? content : $(content);

		this.trigger('add', { content: content, position: position });

		content = this.prepare(content);

		if (this._items.length === 0 || position === this._items.length) {
			this._items.length === 0 && this.$stage.append(content);
			this._items.length !== 0 && this._items[position - 1].after(content);
			this._items.push(content);
			this._mergers.push(content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
		} else {
			this._items[position].before(content);
			this._items.splice(position, 0, content);
			this._mergers.splice(position, 0, content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
		}

		this._items[current] && this.reset(this._items[current].index());

		this.invalidate('items');

		this.trigger('added', { content: content, position: position });
	};

	/**
	 * Removes an item by its position.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {Number} position - The relative position of the item to remove.
	 */
	Owl.prototype.remove = function(position) {
		position = this.normalize(position, true);

		if (position === undefined) {
			return;
		}

		this.trigger('remove', { content: this._items[position], position: position });

		this._items[position].remove();
		this._items.splice(position, 1);
		this._mergers.splice(position, 1);

		this.invalidate('items');

		this.trigger('removed', { content: null, position: position });
	};

	/**
	 * Preloads images with auto width.
	 * @todo Replace by a more generic approach
	 * @protected
	 */
	Owl.prototype.preloadAutoWidthImages = function(images) {
		images.each($.proxy(function(i, element) {
			this.enter('pre-loading');
			element = $(element);
			$(new Image()).one('load', $.proxy(function(e) {
				element.attr('src', e.target.src);
				element.css('opacity', 1);
				this.leave('pre-loading');
				!this.is('pre-loading') && !this.is('initializing') && this.refresh();
			}, this)).attr('src', element.attr('src') || element.attr('data-src') || element.attr('data-src-retina'));
		}, this));
	};

	/**
	 * Destroys the carousel.
	 * @public
	 */
	Owl.prototype.destroy = function() {

		this.$element.off('.owl.core');
		this.$stage.off('.owl.core');
		$(document).off('.owl.core');

		if (this.settings.responsive !== false) {
			window.clearTimeout(this.resizeTimer);
			this.off(window, 'resize', this._handlers.onThrottledResize);
		}

		for (var i in this._plugins) {
			this._plugins[i].destroy();
		}

		this.$stage.children('.cloned').remove();

		this.$stage.unwrap();
		this.$stage.children().contents().unwrap();
		this.$stage.children().unwrap();

		this.$element
			.removeClass(this.options.refreshClass)
			.removeClass(this.options.loadingClass)
			.removeClass(this.options.loadedClass)
			.removeClass(this.options.rtlClass)
			.removeClass(this.options.dragClass)
			.removeClass(this.options.grabClass)
			.attr('class', this.$element.attr('class').replace(new RegExp(this.options.responsiveClass + '-\\S+\\s', 'g'), ''))
			.removeData('owl.carousel');
	};

	/**
	 * Operators to calculate right-to-left and left-to-right.
	 * @protected
	 * @param {Number} [a] - The left side operand.
	 * @param {String} [o] - The operator.
	 * @param {Number} [b] - The right side operand.
	 */
	Owl.prototype.op = function(a, o, b) {
		var rtl = this.settings.rtl;
		switch (o) {
			case '<':
				return rtl ? a > b : a < b;
			case '>':
				return rtl ? a < b : a > b;
			case '>=':
				return rtl ? a <= b : a >= b;
			case '<=':
				return rtl ? a >= b : a <= b;
			default:
				break;
		}
	};

	/**
	 * Attaches to an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The event handler to attach.
	 * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.
	 */
	Owl.prototype.on = function(element, event, listener, capture) {
		if (element.addEventListener) {
			element.addEventListener(event, listener, capture);
		} else if (element.attachEvent) {
			element.attachEvent('on' + event, listener);
		}
	};

	/**
	 * Detaches from an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The attached event handler to detach.
	 * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.
	 */
	Owl.prototype.off = function(element, event, listener, capture) {
		if (element.removeEventListener) {
			element.removeEventListener(event, listener, capture);
		} else if (element.detachEvent) {
			element.detachEvent('on' + event, listener);
		}
	};

	/**
	 * Triggers a public event.
	 * @todo Remove `status`, `relatedTarget` should be used instead.
	 * @protected
	 * @param {String} name - The event name.
	 * @param {*} [data=null] - The event data.
	 * @param {String} [namespace=carousel] - The event namespace.
	 * @param {String} [state] - The state which is associated with the event.
	 * @param {Boolean} [enter=false] - Indicates if the call enters the specified state or not.
	 * @returns {Event} - The event arguments.
	 */
	Owl.prototype.trigger = function(name, data, namespace, state, enter) {
		var status = {
			item: { count: this._items.length, index: this.current() }
		}, handler = $.camelCase(
			$.grep([ 'on', name, namespace ], function(v) { return v })
				.join('-').toLowerCase()
		), event = $.Event(
			[ name, 'owl', namespace || 'carousel' ].join('.').toLowerCase(),
			$.extend({ relatedTarget: this }, status, data)
		);

		if (!this._supress[name]) {
			$.each(this._plugins, function(name, plugin) {
				if (plugin.onTrigger) {
					plugin.onTrigger(event);
				}
			});

			this.register({ type: Owl.Type.Event, name: name });
			this.$element.trigger(event);

			if (this.settings && typeof this.settings[handler] === 'function') {
				this.settings[handler].call(this, event);
			}
		}

		return event;
	};

	/**
	 * Enters a state.
	 * @param name - The state name.
	 */
	Owl.prototype.enter = function(name) {
		$.each([ name ].concat(this._states.tags[name] || []), $.proxy(function(i, name) {
			if (this._states.current[name] === undefined) {
				this._states.current[name] = 0;
			}

			this._states.current[name]++;
		}, this));
	};

	/**
	 * Leaves a state.
	 * @param name - The state name.
	 */
	Owl.prototype.leave = function(name) {
		$.each([ name ].concat(this._states.tags[name] || []), $.proxy(function(i, name) {
			this._states.current[name]--;
		}, this));
	};

	/**
	 * Registers an event or state.
	 * @public
	 * @param {Object} object - The event or state to register.
	 */
	Owl.prototype.register = function(object) {
		if (object.type === Owl.Type.Event) {
			if (!$.event.special[object.name]) {
				$.event.special[object.name] = {};
			}

			if (!$.event.special[object.name].owl) {
				var _default = $.event.special[object.name]._default;
				$.event.special[object.name]._default = function(e) {
					if (_default && _default.apply && (!e.namespace || e.namespace.indexOf('owl') === -1)) {
						return _default.apply(this, arguments);
					}
					return e.namespace && e.namespace.indexOf('owl') > -1;
				};
				$.event.special[object.name].owl = true;
			}
		} else if (object.type === Owl.Type.State) {
			if (!this._states.tags[object.name]) {
				this._states.tags[object.name] = object.tags;
			} else {
				this._states.tags[object.name] = this._states.tags[object.name].concat(object.tags);
			}

			this._states.tags[object.name] = $.grep(this._states.tags[object.name], $.proxy(function(tag, i) {
				return $.inArray(tag, this._states.tags[object.name]) === i;
			}, this));
		}
	};

	/**
	 * Suppresses events.
	 * @protected
	 * @param {Array.<String>} events - The events to suppress.
	 */
	Owl.prototype.suppress = function(events) {
		$.each(events, $.proxy(function(index, event) {
			this._supress[event] = true;
		}, this));
	};

	/**
	 * Releases suppressed events.
	 * @protected
	 * @param {Array.<String>} events - The events to release.
	 */
	Owl.prototype.release = function(events) {
		$.each(events, $.proxy(function(index, event) {
			delete this._supress[event];
		}, this));
	};

	/**
	 * Gets unified pointer coordinates from event.
	 * @todo #261
	 * @protected
	 * @param {Event} - The `mousedown` or `touchstart` event.
	 * @returns {Object} - Contains `x` and `y` coordinates of current pointer position.
	 */
	Owl.prototype.pointer = function(event) {
		var result = { x: null, y: null };

		event = event.originalEvent || event || window.event;

		event = event.touches && event.touches.length ?
			event.touches[0] : event.changedTouches && event.changedTouches.length ?
				event.changedTouches[0] : event;

		if (event.pageX) {
			result.x = event.pageX;
			result.y = event.pageY;
		} else {
			result.x = event.clientX;
			result.y = event.clientY;
		}

		return result;
	};

	/**
	 * Determines if the input is a Number or something that can be coerced to a Number
	 * @protected
	 * @param {Number|String|Object|Array|Boolean|RegExp|Function|Symbol} - The input to be tested
	 * @returns {Boolean} - An indication if the input is a Number or can be coerced to a Number
	 */
	Owl.prototype.isNumeric = function(number) {
		return !isNaN(parseFloat(number));
	};

	/**
	 * Gets the difference of two vectors.
	 * @todo #261
	 * @protected
	 * @param {Object} - The first vector.
	 * @param {Object} - The second vector.
	 * @returns {Object} - The difference.
	 */
	Owl.prototype.difference = function(first, second) {
		return {
			x: first.x - second.x,
			y: first.y - second.y
		};
	};

	/**
	 * The jQuery Plugin for the Owl Carousel
	 * @todo Navigation plugin `next` and `prev`
	 * @public
	 */
	$.fn.owlCarousel = function(option) {
		var args = Array.prototype.slice.call(arguments, 1);

		return this.each(function() {
			var $this = $(this),
				data = $this.data('owl.carousel');

			if (!data) {
				data = new Owl(this, typeof option == 'object' && option);
				$this.data('owl.carousel', data);

				$.each([
					'next', 'prev', 'to', 'destroy', 'refresh', 'replace', 'add', 'remove'
				], function(i, event) {
					data.register({ type: Owl.Type.Event, name: event });
					data.$element.on(event + '.owl.carousel.core', $.proxy(function(e) {
						if (e.namespace && e.relatedTarget !== this) {
							this.suppress([ event ]);
							data[event].apply(this, [].slice.call(arguments, 1));
							this.release([ event ]);
						}
					}, data));
				});
			}

			if (typeof option == 'string' && option.charAt(0) !== '_') {
				data[option].apply(data, args);
			}
		});
	};

	/**
	 * The constructor for the jQuery Plugin
	 * @public
	 */
	$.fn.owlCarousel.Constructor = Owl;

})(window.Zepto || window.jQuery, window, document);

/**
 * AutoRefresh Plugin
 * @version 2.1.0
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the auto refresh plugin.
	 * @class The Auto Refresh Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var AutoRefresh = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Refresh interval.
		 * @protected
		 * @type {number}
		 */
		this._interval = null;

		/**
		 * Whether the element is currently visible or not.
		 * @protected
		 * @type {Boolean}
		 */
		this._visible = null;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.autoRefresh) {
					this.watch();
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, AutoRefresh.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	AutoRefresh.Defaults = {
		autoRefresh: true,
		autoRefreshInterval: 500
	};

	/**
	 * Watches the element.
	 */
	AutoRefresh.prototype.watch = function() {
		if (this._interval) {
			return;
		}

		this._visible = this._core.$element.is(':visible');
		this._interval = window.setInterval($.proxy(this.refresh, this), this._core.settings.autoRefreshInterval);
	};

	/**
	 * Refreshes the element.
	 */
	AutoRefresh.prototype.refresh = function() {
		if (this._core.$element.is(':visible') === this._visible) {
			return;
		}

		this._visible = !this._visible;

		this._core.$element.toggleClass('owl-hidden', !this._visible);

		this._visible && (this._core.invalidate('width') && this._core.refresh());
	};

	/**
	 * Destroys the plugin.
	 */
	AutoRefresh.prototype.destroy = function() {
		var handler, property;

		window.clearInterval(this._interval);

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.AutoRefresh = AutoRefresh;

})(window.Zepto || window.jQuery, window, document);

/**
 * Lazy Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the lazy plugin.
	 * @class The Lazy Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Lazy = function(carousel) {

		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Already loaded items.
		 * @protected
		 * @type {Array.<jQuery>}
		 */
		this._loaded = [];

		/**
		 * Event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel change.owl.carousel resized.owl.carousel': $.proxy(function(e) {
				if (!e.namespace) {
					return;
				}

				if (!this._core.settings || !this._core.settings.lazyLoad) {
					return;
				}

				if ((e.property && e.property.name == 'position') || e.type == 'initialized') {
					var settings = this._core.settings,
						n = (settings.center && Math.ceil(settings.items / 2) || settings.items),
						i = ((settings.center && n * -1) || 0),
						position = (e.property && e.property.value !== undefined ? e.property.value : this._core.current()) + i,
						clones = this._core.clones().length,
						load = $.proxy(function(i, v) { this.load(v) }, this);

					while (i++ < n) {
						this.load(clones / 2 + this._core.relative(position));
						clones && $.each(this._core.clones(this._core.relative(position)), load);
						position++;
					}
				}
			}, this)
		};

		// set the default options
		this._core.options = $.extend({}, Lazy.Defaults, this._core.options);

		// register event handler
		this._core.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	Lazy.Defaults = {
		lazyLoad: false
	};

	/**
	 * Loads all resources of an item at the specified position.
	 * @param {Number} position - The absolute position of the item.
	 * @protected
	 */
	Lazy.prototype.load = function(position) {
		var $item = this._core.$stage.children().eq(position),
			$elements = $item && $item.find('.owl-lazy');

		if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
			return;
		}

		$elements.each($.proxy(function(index, element) {
			var $element = $(element), image,
				url = (window.devicePixelRatio > 1 && $element.attr('data-src-retina')) || $element.attr('data-src');

			this._core.trigger('load', { element: $element, url: url }, 'lazy');

			if ($element.is('img')) {
				$element.one('load.owl.lazy', $.proxy(function() {
					$element.css('opacity', 1);
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this)).attr('src', url);
			} else {
				image = new Image();
				image.onload = $.proxy(function() {
					$element.css({
						'background-image': 'url("' + url + '")',
						'opacity': '1'
					});
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this);
				image.src = url;
			}
		}, this));

		this._loaded.push($item.get(0));
	};

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Lazy.prototype.destroy = function() {
		var handler, property;

		for (handler in this.handlers) {
			this._core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;

})(window.Zepto || window.jQuery, window, document);

/**
 * AutoHeight Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the auto height plugin.
	 * @class The Auto Height Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var AutoHeight = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel refreshed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.autoHeight) {
					this.update();
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.autoHeight && e.property.name == 'position'){
					this.update();
				}
			}, this),
			'loaded.owl.lazy': $.proxy(function(e) {
				if (e.namespace && this._core.settings.autoHeight
					&& e.element.closest('.' + this._core.settings.itemClass).index() === this._core.current()) {
					this.update();
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	AutoHeight.Defaults = {
		autoHeight: false,
		autoHeightClass: 'owl-height'
	};

	/**
	 * Updates the view.
	 */
	AutoHeight.prototype.update = function() {
		var start = this._core._current,
			end = start + this._core.settings.items,
			visible = this._core.$stage.children().toArray().slice(start, end),
			heights = [],
			maxheight = 0;

		$.each(visible, function(index, item) {
			heights.push($(item).height());
		});

		maxheight = Math.max.apply(null, heights);

		this._core.$stage.parent()
			.height(maxheight)
			.addClass(this._core.settings.autoHeightClass);
	};

	AutoHeight.prototype.destroy = function() {
		var handler, property;

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;

})(window.Zepto || window.jQuery, window, document);

/**
 * Video Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the video plugin.
	 * @class The Video Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Video = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Cache all video URLs.
		 * @protected
		 * @type {Object}
		 */
		this._videos = {};

		/**
		 * Current playing item.
		 * @protected
		 * @type {jQuery}
		 */
		this._playing = null;

		/**
		 * All event handlers.
		 * @todo The cloned content removale is too late
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function(e) {
				if (e.namespace) {
					this._core.register({ type: 'state', name: 'playing', tags: [ 'interacting' ] });
				}
			}, this),
			'resize.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.video && this.isInFullScreen()) {
					e.preventDefault();
				}
			}, this),
			'refreshed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.is('resizing')) {
					this._core.$stage.find('.cloned .owl-video-frame').remove();
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && e.property.name === 'position' && this._playing) {
					this.stop();
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function(e) {
				if (!e.namespace) {
					return;
				}

				var $element = $(e.content).find('.owl-video');

				if ($element.length) {
					$element.css('display', 'none');
					this.fetch($element, $(e.content));
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Video.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);

		this._core.$element.on('click.owl.video', '.owl-video-play-icon', $.proxy(function(e) {
			this.play(e);
		}, this));
	};

	/**
	 * Default options.
	 * @public
	 */
	Video.Defaults = {
		video: false,
		videoHeight: false,
		videoWidth: false
	};

	/**
	 * Gets the video ID and the type (YouTube/Vimeo/vzaar only).
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {jQuery} item - The item containing the video.
	 */
	Video.prototype.fetch = function(target, item) {
			var type = (function() {
					if (target.attr('data-vimeo-id')) {
						return 'vimeo';
					} else if (target.attr('data-vzaar-id')) {
						return 'vzaar'
					} else {
						return 'youtube';
					}
				})(),
				id = target.attr('data-vimeo-id') || target.attr('data-youtube-id') || target.attr('data-vzaar-id'),
				width = target.attr('data-width') || this._core.settings.videoWidth,
				height = target.attr('data-height') || this._core.settings.videoHeight,
				url = target.attr('href');

		if (url) {

			/*
					Parses the id's out of the following urls (and probably more):
					https://www.youtube.com/watch?v=:id
					https://youtu.be/:id
					https://vimeo.com/:id
					https://vimeo.com/channels/:channel/:id
					https://vimeo.com/groups/:group/videos/:id
					https://app.vzaar.com/videos/:id

					Visual example: https://regexper.com/#(http%3A%7Chttps%3A%7C)%5C%2F%5C%2F(player.%7Cwww.%7Capp.)%3F(vimeo%5C.com%7Cyoutu(be%5C.com%7C%5C.be%7Cbe%5C.googleapis%5C.com)%7Cvzaar%5C.com)%5C%2F(video%5C%2F%7Cvideos%5C%2F%7Cembed%5C%2F%7Cchannels%5C%2F.%2B%5C%2F%7Cgroups%5C%2F.%2B%5C%2F%7Cwatch%5C%3Fv%3D%7Cv%5C%2F)%3F(%5BA-Za-z0-9._%25-%5D*)(%5C%26%5CS%2B)%3F
			*/

			id = url.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

			if (id[3].indexOf('youtu') > -1) {
				type = 'youtube';
			} else if (id[3].indexOf('vimeo') > -1) {
				type = 'vimeo';
			} else if (id[3].indexOf('vzaar') > -1) {
				type = 'vzaar';
			} else {
				throw new Error('Video URL not supported.');
			}
			id = id[6];
		} else {
			throw new Error('Missing video URL.');
		}

		this._videos[url] = {
			type: type,
			id: id,
			width: width,
			height: height
		};

		item.attr('data-video', url);

		this.thumbnail(target, this._videos[url]);
	};

	/**
	 * Creates video thumbnail.
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {Object} info - The video info object.
	 * @see `fetch`
	 */
	Video.prototype.thumbnail = function(target, video) {
		var tnLink,
			icon,
			path,
			dimensions = video.width && video.height ? 'style="width:' + video.width + 'px;height:' + video.height + 'px;"' : '',
			customTn = target.find('img'),
			srcType = 'src',
			lazyClass = '',
			settings = this._core.settings,
			create = function(path) {
				icon = '<div class="owl-video-play-icon"></div>';

				if (settings.lazyLoad) {
					tnLink = '<div class="owl-video-tn ' + lazyClass + '" ' + srcType + '="' + path + '"></div>';
				} else {
					tnLink = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + path + ')"></div>';
				}
				target.after(tnLink);
				target.after(icon);
			};

		// wrap video content into owl-video-wrapper div
		target.wrap('<div class="owl-video-wrapper"' + dimensions + '></div>');

		if (this._core.settings.lazyLoad) {
			srcType = 'data-src';
			lazyClass = 'owl-lazy';
		}

		// custom thumbnail
		if (customTn.length) {
			create(customTn.attr(srcType));
			customTn.remove();
			return false;
		}

		if (video.type === 'youtube') {
			path = "//img.youtube.com/vi/" + video.id + "/hqdefault.jpg";
			create(path);
		} else if (video.type === 'vimeo') {
			$.ajax({
				type: 'GET',
				url: '//vimeo.com/api/v2/video/' + video.id + '.json',
				jsonp: 'callback',
				dataType: 'jsonp',
				success: function(data) {
					path = data[0].thumbnail_large;
					create(path);
				}
			});
		} else if (video.type === 'vzaar') {
			$.ajax({
				type: 'GET',
				url: '//vzaar.com/api/videos/' + video.id + '.json',
				jsonp: 'callback',
				dataType: 'jsonp',
				success: function(data) {
					path = data.framegrab_url;
					create(path);
				}
			});
		}
	};

	/**
	 * Stops the current video.
	 * @public
	 */
	Video.prototype.stop = function() {
		this._core.trigger('stop', null, 'video');
		this._playing.find('.owl-video-frame').remove();
		this._playing.removeClass('owl-video-playing');
		this._playing = null;
		this._core.leave('playing');
		this._core.trigger('stopped', null, 'video');
	};

	/**
	 * Starts the current video.
	 * @public
	 * @param {Event} event - The event arguments.
	 */
	Video.prototype.play = function(event) {
		var target = $(event.target),
			item = target.closest('.' + this._core.settings.itemClass),
			video = this._videos[item.attr('data-video')],
			width = video.width || '100%',
			height = video.height || this._core.$stage.height(),
			html;

		if (this._playing) {
			return;
		}

		this._core.enter('playing');
		this._core.trigger('play', null, 'video');

		item = this._core.items(this._core.relative(item.index()));

		this._core.reset(item.index());

		if (video.type === 'youtube') {
			html = '<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' +
				video.id + '?autoplay=1&rel=0&v=' + video.id + '" frameborder="0" allowfullscreen></iframe>';
		} else if (video.type === 'vimeo') {
			html = '<iframe src="//player.vimeo.com/video/' + video.id +
				'?autoplay=1" width="' + width + '" height="' + height +
				'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		} else if (video.type === 'vzaar') {
			html = '<iframe frameborder="0"' + 'height="' + height + '"' + 'width="' + width +
				'" allowfullscreen mozallowfullscreen webkitAllowFullScreen ' +
				'src="//view.vzaar.com/' + video.id + '/player?autoplay=true"></iframe>';
		}

		$('<div class="owl-video-frame">' + html + '</div>').insertAfter(item.find('.owl-video'));

		this._playing = item.addClass('owl-video-playing');
	};

	/**
	 * Checks whether an video is currently in full screen mode or not.
	 * @todo Bad style because looks like a readonly method but changes members.
	 * @protected
	 * @returns {Boolean}
	 */
	Video.prototype.isInFullScreen = function() {
		var element = document.fullscreenElement || document.mozFullScreenElement ||
				document.webkitFullscreenElement;

		return element && $(element).parent().hasClass('owl-video-frame');
	};

	/**
	 * Destroys the plugin.
	 */
	Video.prototype.destroy = function() {
		var handler, property;

		this._core.$element.off('click.owl.video');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Video = Video;

})(window.Zepto || window.jQuery, window, document);

/**
 * Animate Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the animate plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
	var Animate = function(scope) {
		this.core = scope;
		this.core.options = $.extend({}, Animate.Defaults, this.core.options);
		this.swapping = true;
		this.previous = undefined;
		this.next = undefined;

		this.handlers = {
			'change.owl.carousel': $.proxy(function(e) {
				if (e.namespace && e.property.name == 'position') {
					this.previous = this.core.current();
					this.next = e.property.value;
				}
			}, this),
			'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function(e) {
				if (e.namespace) {
					this.swapping = e.type == 'translated';
				}
			}, this),
			'translate.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) {
					this.swap();
				}
			}, this)
		};

		this.core.$element.on(this.handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	Animate.Defaults = {
		animateOut: false,
		animateIn: false
	};

	/**
	 * Toggles the animation classes whenever an translations starts.
	 * @protected
	 * @returns {Boolean|undefined}
	 */
	Animate.prototype.swap = function() {

		if (this.core.settings.items !== 1) {
			return;
		}

		if (!$.support.animation || !$.support.transition) {
			return;
		}

		this.core.speed(0);

		var left,
			clear = $.proxy(this.clear, this),
			previous = this.core.$stage.children().eq(this.previous),
			next = this.core.$stage.children().eq(this.next),
			incoming = this.core.settings.animateIn,
			outgoing = this.core.settings.animateOut;

		if (this.core.current() === this.previous) {
			return;
		}

		if (outgoing) {
			left = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
			previous.one($.support.animation.end, clear)
				.css( { 'left': left + 'px' } )
				.addClass('animated owl-animated-out')
				.addClass(outgoing);
		}

		if (incoming) {
			next.one($.support.animation.end, clear)
				.addClass('animated owl-animated-in')
				.addClass(incoming);
		}
	};

	Animate.prototype.clear = function(e) {
		$(e.target).css( { 'left': '' } )
			.removeClass('animated owl-animated-out owl-animated-in')
			.removeClass(this.core.settings.animateIn)
			.removeClass(this.core.settings.animateOut);
		this.core.onTransitionEnd();
	};

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Animate.prototype.destroy = function() {
		var handler, property;

		for (handler in this.handlers) {
			this.core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Animate = Animate;

})(window.Zepto || window.jQuery, window, document);

/**
 * Autoplay Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the autoplay plugin.
	 * @class The Autoplay Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
	var Autoplay = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * The autoplay timeout.
		 * @type {Timeout}
		 */
		this._timeout = null;

		/**
		 * Indicates whenever the autoplay is paused.
		 * @type {Boolean}
		 */
		this._paused = false;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && e.property.name === 'settings') {
					if (this._core.settings.autoplay) {
						this.play();
					} else {
						this.stop();
					}
				} else if (e.namespace && e.property.name === 'position') {
					//console.log('play?', e);
					if (this._core.settings.autoplay) {
						this._setAutoPlayInterval();
					}
				}
			}, this),
			'initialized.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.autoplay) {
					this.play();
				}
			}, this),
			'play.owl.autoplay': $.proxy(function(e, t, s) {
				if (e.namespace) {
					this.play(t, s);
				}
			}, this),
			'stop.owl.autoplay': $.proxy(function(e) {
				if (e.namespace) {
					this.stop();
				}
			}, this),
			'mouseover.owl.autoplay': $.proxy(function() {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.pause();
				}
			}, this),
			'mouseleave.owl.autoplay': $.proxy(function() {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.play();
				}
			}, this),
			'touchstart.owl.core': $.proxy(function() {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.pause();
				}
			}, this),
			'touchend.owl.core': $.proxy(function() {
				if (this._core.settings.autoplayHoverPause) {
					this.play();
				}
			}, this)
		};

		// register event handlers
		this._core.$element.on(this._handlers);

		// set default options
		this._core.options = $.extend({}, Autoplay.Defaults, this._core.options);
	};

	/**
	 * Default options.
	 * @public
	 */
	Autoplay.Defaults = {
		autoplay: false,
		autoplayTimeout: 5000,
		autoplayHoverPause: false,
		autoplaySpeed: false
	};

	/**
	 * Starts the autoplay.
	 * @public
	 * @param {Number} [timeout] - The interval before the next animation starts.
	 * @param {Number} [speed] - The animation speed for the animations.
	 */
	Autoplay.prototype.play = function(timeout, speed) {
		this._paused = false;

		if (this._core.is('rotating')) {
			return;
		}

		this._core.enter('rotating');

		this._setAutoPlayInterval();
	};

	/**
	 * Gets a new timeout
	 * @private
	 * @param {Number} [timeout] - The interval before the next animation starts.
	 * @param {Number} [speed] - The animation speed for the animations.
	 * @return {Timeout}
	 */
	Autoplay.prototype._getNextTimeout = function(timeout, speed) {
		if ( this._timeout ) {
			window.clearTimeout(this._timeout);
		}
		return window.setTimeout($.proxy(function() {
			if (this._paused || this._core.is('busy') || this._core.is('interacting') || document.hidden) {
				return;
			}
			this._core.next(speed || this._core.settings.autoplaySpeed);
		}, this), timeout || this._core.settings.autoplayTimeout);
	};

	/**
	 * Sets autoplay in motion.
	 * @private
	 */
	Autoplay.prototype._setAutoPlayInterval = function() {
		this._timeout = this._getNextTimeout();
	};

	/**
	 * Stops the autoplay.
	 * @public
	 */
	Autoplay.prototype.stop = function() {
		if (!this._core.is('rotating')) {
			return;
		}

		window.clearTimeout(this._timeout);
		this._core.leave('rotating');
	};

	/**
	 * Stops the autoplay.
	 * @public
	 */
	Autoplay.prototype.pause = function() {
		if (!this._core.is('rotating')) {
			return;
		}

		this._paused = true;
	};

	/**
	 * Destroys the plugin.
	 */
	Autoplay.prototype.destroy = function() {
		var handler, property;

		this.stop();

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;

})(window.Zepto || window.jQuery, window, document);

/**
 * Navigation Plugin
 * @version 2.1.0
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {
	'use strict';

	/**
	 * Creates the navigation plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} carousel - The Owl Carousel.
	 */
	var Navigation = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Indicates whether the plugin is initialized or not.
		 * @protected
		 * @type {Boolean}
		 */
		this._initialized = false;

		/**
		 * The current paging indexes.
		 * @protected
		 * @type {Array}
		 */
		this._pages = [];

		/**
		 * All DOM elements of the user interface.
		 * @protected
		 * @type {Object}
		 */
		this._controls = {};

		/**
		 * Markup for an indicator.
		 * @protected
		 * @type {Array.<String>}
		 */
		this._templates = [];

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
		this.$element = this._core.$element;

		/**
		 * Overridden methods of the carousel.
		 * @protected
		 * @type {Object}
		 */
		this._overrides = {
			next: this._core.next,
			prev: this._core.prev,
			to: this._core.to
		};

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'prepared.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.push('<div class="' + this._core.settings.dotClass + '">' +
						$(e.content).find('[data-dot]').addBack('[data-dot]').attr('data-dot') + '</div>');
				}
			}, this),
			'added.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.splice(e.position, 0, this._templates.pop());
				}
			}, this),
			'remove.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.splice(e.position, 1);
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && e.property.name == 'position') {
					this.draw();
				}
			}, this),
			'initialized.owl.carousel': $.proxy(function(e) {
				if (e.namespace && !this._initialized) {
					this._core.trigger('initialize', null, 'navigation');
					this.initialize();
					this.update();
					this.draw();
					this._initialized = true;
					this._core.trigger('initialized', null, 'navigation');
				}
			}, this),
			'refreshed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._initialized) {
					this._core.trigger('refresh', null, 'navigation');
					this.update();
					this.draw();
					this._core.trigger('refreshed', null, 'navigation');
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Navigation.Defaults, this._core.options);

		// register event handlers
		this.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 * @todo Rename `slideBy` to `navBy`
	 */
	Navigation.Defaults = {
		nav: false,
		navText: [ 'prev', 'next' ],
		navSpeed: false,
		navElement: 'div',
		navContainer: false,
		navContainerClass: 'owl-nav',
		navClass: [ 'owl-prev', 'owl-next' ],
		slideBy: 1,
		dotClass: 'owl-dot',
		dotsClass: 'owl-dots',
		dots: true,
		dotsEach: false,
		dotsData: false,
		dotsSpeed: false,
		dotsContainer: false
	};

	/**
	 * Initializes the layout of the plugin and extends the carousel.
	 * @protected
	 */
	Navigation.prototype.initialize = function() {
		var override,
			settings = this._core.settings;

		// create DOM structure for relative navigation
		this._controls.$relative = (settings.navContainer ? $(settings.navContainer)
			: $('<div>').addClass(settings.navContainerClass).appendTo(this.$element)).addClass('anyClass');

		this._controls.$previous = $('<' + settings.navElement + '>')
			.addClass(settings.navClass[0])
			.html(settings.navText[0])
			.prependTo(this._controls.$relative)
			.on('click', $.proxy(function(e) {
				this.prev(settings.navSpeed);
			}, this));
		this._controls.$next = $('<' + settings.navElement + '>')
			.addClass(settings.navClass[1])
			.html(settings.navText[1])
			.appendTo(this._controls.$relative)
			.on('click', $.proxy(function(e) {
				this.next(settings.navSpeed);
			}, this));

		// create DOM structure for absolute navigation
		if (!settings.dotsData) {
			this._templates = [ $('<div>')
				.addClass(settings.dotClass)
				.append($('<span>'))
				.prop('outerHTML') ];
		}

		this._controls.$absolute = (settings.dotsContainer ? $(settings.dotsContainer)
			: $('<div>').addClass(settings.dotsClass).appendTo(this.$element)).addClass('anyClass');

		this._controls.$absolute.on('click', 'div', $.proxy(function(e) {
			var index = $(e.target).parent().is(this._controls.$absolute)
				? $(e.target).index() : $(e.target).parent().index();

			e.preventDefault();

			this.to(index, settings.dotsSpeed);
		}, this));

		// override public methods of the carousel
		for (override in this._overrides) {
			this._core[override] = $.proxy(this[override], this);
		}
	};

	/**
	 * Destroys the plugin.
	 * @protected
	 */
	Navigation.prototype.destroy = function() {
		var handler, control, property, override;

		for (handler in this._handlers) {
			this.$element.off(handler, this._handlers[handler]);
		}
		for (control in this._controls) {
			this._controls[control].remove();
		}
		for (override in this.overides) {
			this._core[override] = this._overrides[override];
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	/**
	 * Updates the internal state.
	 * @protected
	 */
	Navigation.prototype.update = function() {
		var i, j, k,
			lower = this._core.clones().length / 2,
			upper = lower + this._core.items().length,
			maximum = this._core.maximum(true),
			settings = this._core.settings,
			size = settings.center || settings.autoWidth || settings.dotsData
				? 1 : settings.dotsEach || settings.items;

		if (settings.slideBy !== 'page') {
			settings.slideBy = Math.min(settings.slideBy, settings.items);
		}

		if (settings.dots || settings.slideBy == 'page') {
			this._pages = [];

			for (i = lower, j = 0, k = 0; i < upper; i++) {
				if (j >= size || j === 0) {
					this._pages.push({
						start: Math.min(maximum, i - lower),
						end: i - lower + size - 1
					});
					if (Math.min(maximum, i - lower) === maximum) {
						break;
					}
					j = 0, ++k;
				}
				j += this._core.mergers(this._core.relative(i));
			}
		}
	};

	/**
	 * Draws the user interface.
	 * @todo The option `dotsData` wont work.
	 * @protected
	 */
	Navigation.prototype.draw = function() {
		var difference,
			settings = this._core.settings,
            anyClass = this._core.items().length <= settings.items,
			index = this._core.relative(this._core.current()),
			loop = settings.loop || settings.rewind;

		this._controls.$relative.toggleClass('anyClass', !settings.nav || anyClass);

		if (settings.nav) {
			this._controls.$previous.toggleClass('anyClass', !loop && index <= this._core.minimum(true));
			this._controls.$next.toggleClass('anyClass', !loop && index >= this._core.maximum(true));
		}

		this._controls.$absolute.toggleClass('anyClass', !settings.dots || anyClass);

		if (settings.dots) {
			difference = this._pages.length - this._controls.$absolute.children().length;

			if (settings.dotsData && difference !== 0) {
				this._controls.$absolute.html(this._templates.join(''));
			} else if (difference > 0) {
				this._controls.$absolute.append(new Array(difference + 1).join(this._templates[0]));
			} else if (difference < 0) {
				this._controls.$absolute.children().slice(difference).remove();
			}

			this._controls.$absolute.find('.active').removeClass('active');
			this._controls.$absolute.children().eq($.inArray(this.current(), this._pages)).addClass('active');
		}
	};

	/**
	 * Extends event data.
	 * @protected
	 * @param {Event} event - The event object which gets thrown.
	 */
	Navigation.prototype.onTrigger = function(event) {
		var settings = this._core.settings;

		event.page = {
			index: $.inArray(this.current(), this._pages),
			count: this._pages.length,
			size: settings && (settings.center || settings.autoWidth || settings.dotsData
				? 1 : settings.dotsEach || settings.items)
		};
	};

	/**
	 * Gets the current page position of the carousel.
	 * @protected
	 * @returns {Number}
	 */
	Navigation.prototype.current = function() {
		var current = this._core.relative(this._core.current());
		return $.grep(this._pages, $.proxy(function(page, index) {
			return page.start <= current && page.end >= current;
		}, this)).pop();
	};

	/**
	 * Gets the current succesor/predecessor position.
	 * @protected
	 * @returns {Number}
	 */
	Navigation.prototype.getPosition = function(successor) {
		var position, length,
			settings = this._core.settings;

		if (settings.slideBy == 'page') {
			position = $.inArray(this.current(), this._pages);
			length = this._pages.length;
			successor ? ++position : --position;
			position = this._pages[((position % length) + length) % length].start;
		} else {
			position = this._core.relative(this._core.current());
			length = this._core.items().length;
			successor ? position += settings.slideBy : position -= settings.slideBy;
		}

		return position;
	};

	/**
	 * Slides to the next item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
	Navigation.prototype.next = function(speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
	};

	/**
	 * Slides to the previous item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
	Navigation.prototype.prev = function(speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
	};

	/**
	 * Slides to the specified item or page.
	 * @public
	 * @param {Number} position - The position of the item or page.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 * @param {Boolean} [standard=false] - Whether to use the standard behaviour or not.
	 */
	Navigation.prototype.to = function(position, speed, standard) {
		var length;

		if (!standard && this._pages.length) {
			length = this._pages.length;
			$.proxy(this._overrides.to, this._core)(this._pages[((position % length) + length) % length].start, speed);
		} else {
			$.proxy(this._overrides.to, this._core)(position, speed);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;

})(window.Zepto || window.jQuery, window, document);

/**
 * Hash Plugin
 * @version 2.1.0
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {
	'use strict';

	/**
	 * Creates the hash plugin.
	 * @class The Hash Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Hash = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Hash index for the items.
		 * @protected
		 * @type {Object}
		 */
		this._hashes = {};

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
		this.$element = this._core.$element;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.startPosition === 'URLHash') {
					$(window).trigger('hashchange.owl.navigation');
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function(e) {
				if (e.namespace) {
					var hash = $(e.content).find('[data-hash]').addBack('[data-hash]').attr('data-hash');

					if (!hash) {
						return;
					}

					this._hashes[hash] = e.content;
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && e.property.name === 'position') {
					var current = this._core.items(this._core.relative(this._core.current())),
						hash = $.map(this._hashes, function(item, hash) {
							return item === current ? hash : null;
						}).join();

					if (!hash || window.location.hash.slice(1) === hash) {
						return;
					}

					window.location.hash = hash;
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Hash.Defaults, this._core.options);

		// register the event handlers
		this.$element.on(this._handlers);

		// register event listener for hash navigation
		$(window).on('hashchange.owl.navigation', $.proxy(function(e) {
			var hash = window.location.hash.substring(1),
				items = this._core.$stage.children(),
				position = this._hashes[hash] && items.index(this._hashes[hash]);

			if (position === undefined || position === this._core.current()) {
				return;
			}

			this._core.to(this._core.relative(position), false, true);
		}, this));
	};

	/**
	 * Default options.
	 * @public
	 */
	Hash.Defaults = {
		URLhashListener: false
	};

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Hash.prototype.destroy = function() {
		var handler, property;

		$(window).off('hashchange.owl.navigation');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Hash = Hash;

})(window.Zepto || window.jQuery, window, document);

/**
 * Support Plugin
 *
 * @version 2.1.0
 * @author Vivid Planet Software GmbH
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	var style = $('<support>').get(0).style,
		prefixes = 'Webkit Moz O ms'.split(' '),
		events = {
			transition: {
				end: {
					WebkitTransition: 'webkitTransitionEnd',
					MozTransition: 'transitionend',
					OTransition: 'oTransitionEnd',
					transition: 'transitionend'
				}
			},
			animation: {
				end: {
					WebkitAnimation: 'webkitAnimationEnd',
					MozAnimation: 'animationend',
					OAnimation: 'oAnimationEnd',
					animation: 'animationend'
				}
			}
		},
		tests = {
			csstransforms: function() {
				return !!test('transform');
			},
			csstransforms3d: function() {
				return !!test('perspective');
			},
			csstransitions: function() {
				return !!test('transition');
			},
			cssanimations: function() {
				return !!test('animation');
			}
		};

	function test(property, prefixed) {
		var result = false,
			upper = property.charAt(0).toUpperCase() + property.slice(1);

		$.each((property + ' ' + prefixes.join(upper + ' ') + upper).split(' '), function(i, property) {
			if (style[property] !== undefined) {
				result = prefixed ? property : true;
				return false;
			}
		});

		return result;
	}

	function prefixed(property) {
		return test(property, true);
	}

	if (tests.csstransitions()) {
		/* jshint -W053 */
		$.support.transition = new String(prefixed('transition'))
		$.support.transition.end = events.transition.end[ $.support.transition ];
	}

	if (tests.cssanimations()) {
		/* jshint -W053 */
		$.support.animation = new String(prefixed('animation'))
		$.support.animation.end = events.animation.end[ $.support.animation ];
	}

	if (tests.csstransforms()) {
		/* jshint -W053 */
		$.support.transform = new String(prefixed('transform'));
		$.support.transform3d = tests.csstransforms3d();
	}

})(window.Zepto || window.jQuery, window, document);

/*!
 * jquery.sumoselect - v3.0.2
 * http://hemantnegi.github.io/jquery.sumoselect
 * 2014-04-08
 *
 * Copyright 2015 Hemant Negi
 * Email : hemant.frnz@gmail.com
 * Compressor http://refresh-sf.com/
 */

(function ($) {

    'namespace sumo';
    $.fn.SumoSelect = function (options) {

        // This is the easiest way to have default options.
        var settings = $.extend({
            placeholder: '',   // Dont change it here.
            csvDispCount: 3,              // display no. of items in multiselect. 0 to display all.
            captionFormat:'{0} Selected', // format of caption text. you can set your locale.
            captionFormatAllSelected:'{0} all selected!', // format of caption text when all elements are selected. set null to use captionFormat. It will not work if there are disabled elements in select.
            floatWidth: 400,              // Screen width of device at which the list is rendered in floating popup fashion.
            forceCustomRendering: false,  // force the custom modal on all devices below floatWidth resolution.
            nativeOnDevice: ['Android', 'BlackBerry', 'iPhone', 'iPad', 'iPod', 'Opera Mini', 'IEMobile', 'Silk'], //
            outputAsCSV: false,           // true to POST data as csv ( false for Html control array ie. default select )
            csvSepChar: ',',              // separation char in csv mode
            okCancelInMulti: false,       // display ok cancel buttons in desktop mode multiselect also.
            triggerChangeCombined: true,  // im multi select mode wether to trigger change event on individual selection or combined selection.
            selectAll: false,             // to display select all button in multiselect mode.|| also select all will not be available on mobile devices.

            search: false,                // to display input for filtering content. selectAlltext will be input text placeholder
            searchText: 'Search...',      // placeholder for search input
            noMatch: 'No matches for "{0}"',
            prefix: '',                   // some prefix usually the field name. eg. '<b>Hello</b>'
            locale: ['OK', 'Cancel', 'Select All'],  // all text that is used. don't change the index.
            up: false                     // set true to open upside.
        }, options);

        var ret = this.each(function () {
            var selObj = this; // the original select object.
            if (this.sumo || !$(this).is('select')) return; //already initialized

            this.sumo = {
                E: $(selObj),   //the jquery object of original select element.
                is_multi: $(selObj).attr('multiple'),  //if its a multiple select
                select: '',
                caption: '',
                placeholder: '',
                optDiv: '',
                CaptionCont: '',
                ul:'',
                is_floating: false,
                is_opened: false,
                //backdrop: '',
                mob:false, // if to open device default select
                Pstate: [],

                createElems: function () {
                    var O = this;
                    O.E.wrap('<div class="SumoSelect" tabindex="0">');
                    O.select = O.E.parent();
                    O.caption = $('<span>');
                    O.CaptionCont = $('<p class="CaptionCont"><label><i></i></label></p>').addClass('SelectBox').attr('style', O.E.attr('style')).prepend(O.caption);
                    O.select.append(O.CaptionCont);

                    // default turn off if no multiselect
                    if(!O.is_multi)settings.okCancelInMulti = false

                    if(O.E.attr('disabled'))
                        O.select.addClass('disabled').removeAttr('tabindex');

                    //if output as csv and is a multiselect.
                    if (settings.outputAsCSV && O.is_multi && O.E.attr('name')) {
                        //create a hidden field to store csv value.
                        O.select.append($('<input class="HEMANT123" type="hidden" />').attr('name', O.E.attr('name')).val(O.getSelStr()));

                        // so it can not post the original select.
                        O.E.removeAttr('name');
                    }

                    //break for mobile rendring.. if forceCustomRendering is false
                    if (O.isMobile() && !settings.forceCustomRendering) {
                        O.setNativeMobile();
                        return;
                    }

                    // if there is a name attr in select add a class to container div
                    if(O.E.attr('name')) O.select.addClass('sumo_'+O.E.attr('name'))

                    //hide original select
                    O.E.addClass('SumoUnder').attr('tabindex','-1');

                    //## Creating the list...
                    O.optDiv = $('<div class="optWrapper '+ (settings.up?'up':'') +'">');

                    //branch for floating list in low res devices.
                    O.floatingList();

                    //Creating the markup for the available options
                    O.ul = $('<ul class="options">');
                    O.optDiv.append(O.ul);

                    // Select all functionality
                    if(settings.selectAll) O.SelAll();

                    // search functionality
                    if(settings.search) O.Search();

                    O.ul.append(O.prepItems(O.E.children()));

                    //if multiple then add the class multiple and add OK / CANCEL button
                    if (O.is_multi) O.multiSelelect();

                    O.select.append(O.optDiv);
                    O.basicEvents();
                    O.selAllState();
                },

                prepItems: function(opts, d){
                    var lis = [], O=this;
                    $(opts).each(function (i, opt) {       // parsing options to li
                        opt = $(opt);
                        lis.push(opt.is('optgroup')?
                            $('<li class="group '+ (opt[0].disabled?'disabled':'') +'"><label>' + opt.attr('label') +'</label><ul></ul><li>')
                            .find('ul')
                            .append(O.prepItems(opt.children(), opt[0].disabled))
                            .end()
                            :
                            O.createLi(opt, d)
                            );
                    });
                    return lis;
                },

                //## Creates a LI element from a given option and binds events to it
                //## returns the jquery instance of li (not inserted in dom)
                createLi: function (opt, d) {
                    var O = this;

                    if(!opt.attr('value'))opt.attr('value',opt.val());
                                                                                    // todo: remove this data val 
                    li = $('<li class="opt"><label>' + opt.text() + '</label></li>');//.data('val',opt.val());
                    li.data('opt', opt);    // store a direct reference to option.
                    opt.data('li', li);    // store a direct reference to list item.
                    if (O.is_multi) li.prepend('<span><i></i></span>');

                    if (opt[0].disabled || d)
                        li = li.addClass('disabled');

                    O.onOptClick(li);

                    if (opt[0].selected)
                        li.addClass('selected');

                    if (opt.attr('class'))
                        li.addClass(opt.attr('class'));

                    return li;
                },

                //## Returns the selected items as string in a Multiselect.
                getSelStr: function () {
                    // get the pre selected items.
                    sopt = [];
                    this.E.find('option:selected').each(function () { sopt.push($(this).val()); });
                    return sopt.join(settings.csvSepChar);
                },

                //## THOSE OK/CANCEL BUTTONS ON MULTIPLE SELECT.
                multiSelelect: function () {
                    var O = this;
                    O.optDiv.addClass('multiple');
                    O.okbtn = $('<p class="btnOk">'+settings.locale[0]+'</p>').click(function () {

                        //if combined change event is set.
                        if (settings.triggerChangeCombined) {

                            //check for a change in the selection.
                            changed = false;
                            if (O.E.find('option:selected').length != O.Pstate.length) {
                                changed = true;
                            }
                            else {
                                O.E.find('option').each(function (i,e) {
                                    if(e.selected && O.Pstate.indexOf(i) < 0) changed = true;
                                });
                            }

                            if (changed) {
                                O.callChange();
                                O.setText();
                            }
                        }
                        O.hideOpts();
                    });
                    O.cancelBtn = $('<p class="btnCancel">'+settings.locale[1]+'</p>').click(function () {
                        O._cnbtn();
                        O.hideOpts();
                    });
                    O.optDiv.append($('<div class="MultiControls">').append(O.okbtn).append(O.cancelBtn));
                },

                _cnbtn:function(){
                    var O = this;
                    //remove all selections
                        O.E.find('option:selected').each(function () { this.selected = false; });
                        O.optDiv.find('li.selected').removeClass('selected')

                        //restore selections from saved state.
                        for(var i = 0; i < O.Pstate.length; i++) {
                            O.E.find('option')[O.Pstate[i]].selected = true;
                            O.ul.find('li.opt').eq(O.Pstate[i]).addClass('selected');
                        }
                    O.selAllState();
                },

                SelAll:function(){
                    var O = this;
                    if(!O.is_multi)return;
                    O.selAll = $('<p class="select-all"><span><i></i></span><label>' + settings.locale[2] + '</label></p>');
                    O.selAll.on('click',function(){
						//O.toggSelAll(!);
						O.selAll.toggleClass('selected');
						O.optDiv.find('li.opt').not('.hidden').each(function(ix,e){
							e = $(e);
							if(O.selAll.hasClass('selected')){
								if(!e.hasClass('selected'))e.trigger('click');
							}
							else
								if(e.hasClass('selected'))e.trigger('click');
						});
					});

                    O.optDiv.prepend(O.selAll);
                },

                // search module (can be removed if not required.)
                Search: function(){
                    var O = this,
                        cc = O.CaptionCont.addClass('search'),
                        P = $('<p class="no-match">');

                    O.ftxt = $('<input type="text" class="search-txt" value="" placeholder="' + settings.searchText + '">')
                        .on('click', function(e){
                            e.stopPropagation();
                        });
                    cc.append(O.ftxt);
                    O.optDiv.children('ul').after(P);

                    O.ftxt.on('keyup.sumo',function(){
                        var hid = O.optDiv.find('ul.options li.opt').each(function(ix,e){
                            e = $(e);
                            if(e.text().toLowerCase().indexOf(O.ftxt.val().toLowerCase()) > -1)
                                e.removeClass('hidden');
                            else
                                e.addClass('hidden');
                        }).not('.hidden');

                        P.html(settings.noMatch.replace(/\{0\}/g, O.ftxt.val())).toggle(!hid.length);

                        O.selAllState();
                    });
                },

                selAllState: function () {
                    var O = this;
                    if (settings.selectAll) {
                        var sc = 0, vc = 0;
                        O.optDiv.find('li.opt').not('.hidden').each(function (ix, e) {
                            if ($(e).hasClass('selected')) sc++;
                            if (!$(e).hasClass('disabled')) vc++;
                        });
                        //select all checkbox state change.
                        if (sc == vc) O.selAll.removeClass('partial').addClass('selected');
                        else if (sc == 0) O.selAll.removeClass('selected partial');
                        else O.selAll.addClass('partial')//.removeClass('selected');
                    }
                },

                showOpts: function () {
                    var O = this;
                    if (O.E.attr('disabled')) return; // if select is disabled then retrun
                    O.is_opened = true;
                    O.select.addClass('open');

                    if(O.ftxt)O.ftxt.focus();
                    else O.select.focus();

                    // hide options on click outside.
                    $(document).on('click.sumo', function (e) {
                        if (!O.select.is(e.target)                  // if the target of the click isn't the container...
                            && O.select.has(e.target).length === 0){ // ... nor a descendant of the container
                            if(!O.is_opened)return;
                            O.hideOpts();
                            if (settings.okCancelInMulti)O._cnbtn();
                        }
                    });

                    if (O.is_floating) {
                        H = O.optDiv.children('ul').outerHeight() + 2;  // +2 is clear fix
                        if (O.is_multi) H = H + parseInt(O.optDiv.css('padding-bottom'));
                        O.optDiv.css('height', H);
                        $('body').addClass('sumoStopScroll');
                    }

                    O.setPstate();
                },

                //maintain state when ok/cancel buttons are available storing the indexes.
                setPstate: function(){
                    var O = this;
                    if (O.is_multi && (O.is_floating || settings.okCancelInMulti)){
                        O.Pstate = [];
                        // assuming that find returns elements in tree order
                        O.E.find('option').each(function (i, e){if(e.selected) O.Pstate.push(i);});
                    }
                },

                callChange:function(){
                    this.E.trigger('change').trigger('click');
                },

                hideOpts: function () {
                    var O = this;
                    if(O.is_opened){
                        O.is_opened = false;
                        O.select.removeClass('open').find('ul li.sel').removeClass('sel');
                        $(document).off('click.sumo');
                        O.select.focus();
                        $('body').removeClass('sumoStopScroll');

                        // clear the search
                        if(settings.search){
                            O.ftxt.val('');
                            O.optDiv.find('ul.options li').removeClass('hidden');
                            O.optDiv.find('.no-match').toggle(false);
                        }
                    }
                 },
                setOnOpen: function () {
                    var O = this,
                        li = O.optDiv.find('li.opt:not(.hidden)').eq(settings.search?0:O.E[0].selectedIndex);

                    O.optDiv.find('li.sel').removeClass('sel');
                    li.addClass('sel');
                    O.showOpts();
                },
                nav: function (up) {
                    var O = this, c, 
                    s=O.ul.find('li.opt:not(.disabled, .hidden)'),
                    sel = O.ul.find('li.opt.sel:not(.hidden)'),
                    idx = s.index(sel);
                    if (O.is_opened && sel.length) {
                        
                        if (up && idx > 0)
                            c = s.eq(idx-1);
                        else if(!up && idx < s.length-1 && idx > -1)
                            c = s.eq(idx+1);
                        else return; // if no items before or after

                        sel.removeClass('sel');
                        sel = c.addClass('sel');

                        // setting sel item to visible view.
                        var ul = O.ul,
                            st = ul.scrollTop(),
                            t = sel.position().top + st;                            
                        if(t >= st + ul.height()-sel.outerHeight())
                            ul.scrollTop(t - ul.height() + sel.outerHeight());
                        if(t<st)
                            ul.scrollTop(t);

                    }
                    else
                        O.setOnOpen();
                },

                basicEvents: function () {
                    var O = this;
                    O.CaptionCont.click(function (evt) {
                        O.E.trigger('click');
                        if (O.is_opened) O.hideOpts(); else O.showOpts();
                        evt.stopPropagation();
                    });

                        O.select.on('keydown.sumo', function (e) {
                            switch (e.which) {
                                case 38: // up
                                    O.nav(true);
                                    break;

                                case 40: // down
                                    O.nav(false);
                                    break;

                                case 32: // space
                                    if(settings.search && O.ftxt.is(e.target))return;
                                case 13: // enter
                                    if (O.is_opened)
                                        O.optDiv.find('ul li.sel').trigger('click');
                                    else
                                        O.setOnOpen();
                                    break;
				                case 9:	 //tab
                                case 27: // esc
                                     if (settings.okCancelInMulti)O._cnbtn();
                                    O.hideOpts();
                                    return;

                                default:
                                    return; // exit this handler for other keys
                            }
                            e.preventDefault(); // prevent the default action (scroll / move caret)
                        });

                    $(window).on('resize.sumo', function () {
                        O.floatingList();
                    });
                },

                onOptClick: function (li) {
                    var O = this;
                    li.click(function () {
                        var li = $(this);
                        if(li.hasClass('disabled'))return;
                        txt = "";
                        if (O.is_multi) {
                            li.toggleClass('selected');
                            li.data('opt')[0].selected = li.hasClass('selected');
                            O.selAllState();
                        }
                        else {
                            li.parent().find('li.selected').removeClass('selected'); //if not multiselect then remove all selections from this list
                            li.toggleClass('selected');
                            li.data('opt')[0].selected = true;
                        }

                        //branch for combined change event.
                        if (!(O.is_multi && settings.triggerChangeCombined && (O.is_floating || settings.okCancelInMulti))) {
                            O.setText();
                            O.callChange();
                        }

                        if (!O.is_multi) O.hideOpts(); //if its not a multiselect then hide on single select.
                    });
                },

                setText: function () {
                    var O = this;
                    O.placeholder = "";
                    if (O.is_multi) {
                        sels = O.E.find(':selected').not(':disabled'); //selected options.

                        for (i = 0; i < sels.length; i++) {
                                if (i + 1 >= settings.csvDispCount && settings.csvDispCount) {
                                    if (sels.length == O.E.find('option').length && settings.captionFormatAllSelected) {
                                        O.placeholder = settings.captionFormatAllSelected.replace(/\{0\}/g, sels.length)+',';
                                    } else {
                                        O.placeholder = settings.captionFormat.replace(/\{0\}/g, sels.length)+',';
                                    }

                                    break;
                                }
                                else O.placeholder += $(sels[i]).text() + ", ";
                            }
                            O.placeholder = O.placeholder.replace(/,([^,]*)$/, '$1'); //remove unexpected "," from last.
                    }
                    else {
                        O.placeholder = O.E.find(':selected').not(':disabled').text();
                    }

                    is_placeholder = false;

                    if (!O.placeholder) {

                        is_placeholder = true;

                        O.placeholder = O.E.attr('placeholder');
                        if (!O.placeholder)                  //if placeholder is there then set it
                            O.placeholder = O.E.find('option:disabled:selected').text();
                    }

                    O.placeholder = O.placeholder ? (settings.prefix + ' ' + O.placeholder) : settings.placeholder

                    //set display text
                    O.caption.html(O.placeholder);
                    O.CaptionCont.attr('title', O.placeholder);

                    //set the hidden field if post as csv is true.
                    csvField = O.select.find('input.HEMANT123');
                    if (csvField.length) csvField.val(O.getSelStr());

                    //add class placeholder if its a placeholder text.
                    if (is_placeholder) O.caption.addClass('placeholder'); else O.caption.removeClass('placeholder');
                    return O.placeholder;
                },

                isMobile: function () {

                    // Adapted from http://www.detectmobilebrowsers.com
                    var ua = navigator.userAgent || navigator.vendor || window.opera;

                    // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                    for (var i = 0; i < settings.nativeOnDevice.length; i++) if (ua.toString().toLowerCase().indexOf(settings.nativeOnDevice[i].toLowerCase()) > 0) return settings.nativeOnDevice[i];
                    return false;
                },

                setNativeMobile: function () {
                    var O = this;
                    O.E.addClass('SelectClass')//.css('height', O.select.outerHeight());
					O.mob = true;
                    O.E.change(function () {
                        O.setText();
                    });
                },

                floatingList: function () {
                    var O = this;
                    //called on init and also on resize.
                    //O.is_floating = true if window width is < specified float width
                    O.is_floating = $(window).width() <= settings.floatWidth;

                    //set class isFloating
                    O.optDiv.toggleClass('isFloating', O.is_floating);

                    //remove height if not floating
                    if (!O.is_floating) O.optDiv.css('height', '');

                    //toggle class according to okCancelInMulti flag only when it is not floating
                    O.optDiv.toggleClass('okCancelInMulti', settings.okCancelInMulti && !O.is_floating);
                },

                //HELPERS FOR OUTSIDERS
                // validates range of given item operations
                vRange: function (i) {
                    var O = this;
                    opts = O.E.find('option');
                    if (opts.length <= i || i < 0) throw "index out of bounds"
                    return O;
                },

                //toggles selection on c as boolean.
                toggSel: function (c, i) {
                    var O = this;
                    if (typeof(i) === "number"){
                        O.vRange(i);
                        opt = O.E.find('option')[i];
                    }
                    else{
                        opt = O.E.find('option[value="'+i+'"]')[0]||0;
                    }
                    if (!opt || opt.disabled) 
                        return;

                    if(opt.selected != c){
                        opt.selected = c;
                        if(!O.mob) $(opt).data('li').toggleClass('selected',c);
                        
                        O.callChange();
                        O.setPstate();
                        O.setText();
                        O.selAllState();
                    }
                },

                //toggles disabled on c as boolean.
                toggDis: function (c, i) {
                    var O = this.vRange(i);
                    O.E.find('option')[i].disabled = c;
                    if(c)O.E.find('option')[i].selected = false;
                    if(!O.mob)O.optDiv.find('ul.options li').eq(i).toggleClass('disabled', c).removeClass('selected');
                    O.setText();
                },

                // toggle disable/enable on complete select control
                toggSumo: function(val) {
                    var O = this;
                    O.enabled = val;
                    O.select.toggleClass('disabled', val);

                    if (val) {
                        O.E.attr('disabled', 'disabled');
                        O.select.removeAttr('tabindex');
                    }
                    else{
                        O.E.removeAttr('disabled');
                        O.select.attr('tabindex','0');
                    }

                    return O;
                },

                //toggles alloption on c as boolean.
                toggSelAll: function (c) {
                    var O = this;
                    O.E.find('option').each(function (ix, el) {
                        if (O.E.find('option')[$(this).index()].disabled) return;
                        O.E.find('option')[$(this).index()].selected = c;
                        if (!O.mob)
							O.optDiv.find('ul.options li').eq($(this).index()).toggleClass('selected', c);
                        O.setText();
                    });
                    if(!O.mob && O.selAll)O.selAll.removeClass('partial').toggleClass('selected',c);
                    O.callChange();
                    O.setPstate();
                },

                /* outside accessibility options
                   which can be accessed from the element instance.
                */
                reload:function(){
                    var elm = this.unload();
                    return $(elm).SumoSelect(settings);
                },

                unload: function () {
                    var O = this;
                    O.select.before(O.E);
                    O.E.show();

                    if (settings.outputAsCSV && O.is_multi && O.select.find('input.HEMANT123').length) {
                        O.E.attr('name', O.select.find('input.HEMANT123').attr('name')); // restore the name;
                    }
                    O.select.remove();
                    delete selObj.sumo;
                    return selObj;
                },

                //## add a new option to select at a given index.
                add: function (val, txt, i) {
                    if (typeof val == "undefined") throw "No value to add"

                    var O = this;
                    opts=O.E.find('option')
                    if (typeof txt == "number") { i = txt; txt = val; }
                    if (typeof txt == "undefined") { txt = val; }

                    opt = $("<option></option>").val(val).html(txt);

                    if (opts.length < i) throw "index out of bounds"

                    if (typeof i == "undefined" || opts.length == i) { // add it to the last if given index is last no or no index provides.
                        O.E.append(opt);
                        if(!O.mob)O.ul.append(O.createLi(opt));
                    }
                    else {
                        opts.eq(i).before(opt);
                        if(!O.mob)O.ul.find('li.opt').eq(i).before(O.createLi(opt));
                    }

                    return selObj;
                },

                //## removes an item at a given index.
                remove: function (i) {
                    var O = this.vRange(i);
                    O.E.find('option').eq(i).remove();
                    if(!O.mob)O.optDiv.find('ul.options li').eq(i).remove();
                    O.setText();
                },

                //## Select an item at a given index.
                selectItem: function (i) { this.toggSel(true, i); },

                //## UnSelect an iten at a given index.
                unSelectItem: function (i) { this.toggSel(false, i); },

                //## Select all items  of the select.
                selectAll: function () { this.toggSelAll(true); },

                //## UnSelect all items of the select.
                unSelectAll: function () { this.toggSelAll(false); },

                //## Disable an iten at a given index.
                disableItem: function (i) { this.toggDis(true, i) },

                //## Removes disabled an iten at a given index.
                enableItem: function (i) { this.toggDis(false, i) },

                //## New simple methods as getter and setter are not working fine in ie8-
                //## variable to check state of control if enabled or disabled.
                enabled : true,
                //## Enables the control
                enable: function(){return this.toggSumo(false)},

                //## Disables the control
                disable: function(){return this.toggSumo(true)},


                init: function () {
                    var O = this;
                    O.createElems();
                    O.setText();
                    return O
                }

            };

            selObj.sumo.init();
        });

        return ret.length == 1 ? ret[0] : ret;
    };


}(jQuery));

/*!
 * Fotorama 4.6.4 | http://fotorama.io/license/
 */
fotoramaVersion="4.6.4",function(a,b,c,d,e){"use strict";function f(a){var b="bez_"+d.makeArray(arguments).join("_").replace(".","p");if("function"!=typeof d.easing[b]){var c=function(a,b){var c=[null,null],d=[null,null],e=[null,null],f=function(f,g){return e[g]=3*a[g],d[g]=3*(b[g]-a[g])-e[g],c[g]=1-e[g]-d[g],f*(e[g]+f*(d[g]+f*c[g]))},g=function(a){return e[0]+a*(2*d[0]+3*c[0]*a)},h=function(a){for(var b,c=a,d=0;++d<14&&(b=f(c,0)-a,!(Math.abs(b)<.001));)c-=b/g(c);return c};return function(a){return f(h(a),1)}};d.easing[b]=function(b,d,e,f,g){return f*c([a[0],a[1]],[a[2],a[3]])(d/g)+e}}return b}function g(){}function h(a,b,c){return Math.max(isNaN(b)?-1/0:b,Math.min(isNaN(c)?1/0:c,a))}function i(a){return a.match(/ma/)&&a.match(/-?\d+(?!d)/g)[a.match(/3d/)?12:4]}function j(a){return Ic?+i(a.css("transform")):+a.css("left").replace("px","")}function k(a){var b={};return Ic?b.transform="translate3d("+a+"px,0,0)":b.left=a,b}function l(a){return{"transition-duration":a+"ms"}}function m(a,b){return isNaN(a)?b:a}function n(a,b){return m(+String(a).replace(b||"px",""))}function o(a){return/%$/.test(a)?n(a,"%"):e}function p(a,b){return m(o(a)/100*b,n(a))}function q(a){return(!isNaN(n(a))||!isNaN(n(a,"%")))&&a}function r(a,b,c,d){return(a-(d||0))*(b+(c||0))}function s(a,b,c,d){return-Math.round(a/(b+(c||0))-(d||0))}function t(a){var b=a.data();if(!b.tEnd){var c=a[0],d={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",msTransition:"MSTransitionEnd",transition:"transitionend"};T(c,d[uc.prefixed("transition")],function(a){b.tProp&&a.propertyName.match(b.tProp)&&b.onEndFn()}),b.tEnd=!0}}function u(a,b,c,d){var e,f=a.data();f&&(f.onEndFn=function(){e||(e=!0,clearTimeout(f.tT),c())},f.tProp=b,clearTimeout(f.tT),f.tT=setTimeout(function(){f.onEndFn()},1.5*d),t(a))}function v(a,b){if(a.length){var c=a.data();Ic?(a.css(l(0)),c.onEndFn=g,clearTimeout(c.tT)):a.stop();var d=w(b,function(){return j(a)});return a.css(k(d)),d}}function w(){for(var a,b=0,c=arguments.length;c>b&&(a=b?arguments[b]():arguments[b],"number"!=typeof a);b++);return a}function x(a,b){return Math.round(a+(b-a)/1.5)}function y(){return y.p=y.p||("https:"===c.protocol?"https://":"http://"),y.p}function z(a){var c=b.createElement("a");return c.href=a,c}function A(a,b){if("string"!=typeof a)return a;a=z(a);var c,d;if(a.host.match(/youtube\.com/)&&a.search){if(c=a.search.split("v=")[1]){var e=c.indexOf("&");-1!==e&&(c=c.substring(0,e)),d="youtube"}}else a.host.match(/youtube\.com|youtu\.be/)?(c=a.pathname.replace(/^\/(embed\/|v\/)?/,"").replace(/\/.*/,""),d="youtube"):a.host.match(/vimeo\.com/)&&(d="vimeo",c=a.pathname.replace(/^\/(video\/)?/,"").replace(/\/.*/,""));return c&&d||!b||(c=a.href,d="custom"),c?{id:c,type:d,s:a.search.replace(/^\?/,""),p:y()}:!1}function B(a,b,c){var e,f,g=a.video;return"youtube"===g.type?(f=y()+"img.youtube.com/vi/"+g.id+"/default.jpg",e=f.replace(/\/default.jpg$/,"/hqdefault.jpg"),a.thumbsReady=!0):"vimeo"===g.type?d.ajax({url:y()+"vimeo.com/api/v2/video/"+g.id+".json",dataType:"jsonp",success:function(d){a.thumbsReady=!0,C(b,{img:d[0].thumbnail_large,thumb:d[0].thumbnail_small},a.i,c)}}):a.thumbsReady=!0,{img:e,thumb:f}}function C(a,b,c,e){for(var f=0,g=a.length;g>f;f++){var h=a[f];if(h.i===c&&h.thumbsReady){var i={videoReady:!0};i[Xc]=i[Zc]=i[Yc]=!1,e.splice(f,1,d.extend({},h,i,b));break}}}function D(a){function b(a,b,e){var f=a.children("img").eq(0),g=a.attr("href"),h=a.attr("src"),i=f.attr("src"),j=b.video,k=e?A(g,j===!0):!1;k?g=!1:k=j,c(a,f,d.extend(b,{video:k,img:b.img||g||h||i,thumb:b.thumb||i||h||g}))}function c(a,b,c){var e=c.thumb&&c.img!==c.thumb,f=n(c.width||a.attr("width")),g=n(c.height||a.attr("height"));d.extend(c,{width:f,height:g,thumbratio:S(c.thumbratio||n(c.thumbwidth||b&&b.attr("width")||e||f)/n(c.thumbheight||b&&b.attr("height")||e||g))})}var e=[];return a.children().each(function(){var a=d(this),f=R(d.extend(a.data(),{id:a.attr("id")}));if(a.is("a, img"))b(a,f,!0);else{if(a.is(":empty"))return;c(a,null,d.extend(f,{html:this,_html:a.html()}))}e.push(f)}),e}function E(a){return 0===a.offsetWidth&&0===a.offsetHeight}function F(a){return!d.contains(b.documentElement,a)}function G(a,b,c,d){return G.i||(G.i=1,G.ii=[!0]),d=d||G.i,"undefined"==typeof G.ii[d]&&(G.ii[d]=!0),a()?b():G.ii[d]&&setTimeout(function(){G.ii[d]&&G(a,b,c,d)},c||100),G.i++}function H(a){c.replace(c.protocol+"//"+c.host+c.pathname.replace(/^\/?/,"/")+c.search+"#"+a)}function I(a,b,c,d){var e=a.data(),f=e.measures;if(f&&(!e.l||e.l.W!==f.width||e.l.H!==f.height||e.l.r!==f.ratio||e.l.w!==b.w||e.l.h!==b.h||e.l.m!==c||e.l.p!==d)){var g=f.width,i=f.height,j=b.w/b.h,k=f.ratio>=j,l="scaledown"===c,m="contain"===c,n="cover"===c,o=$(d);k&&(l||m)||!k&&n?(g=h(b.w,0,l?g:1/0),i=g/f.ratio):(k&&n||!k&&(l||m))&&(i=h(b.h,0,l?i:1/0),g=i*f.ratio),a.css({width:g,height:i,left:p(o.x,b.w-g),top:p(o.y,b.h-i)}),e.l={W:f.width,H:f.height,r:f.ratio,w:b.w,h:b.h,m:c,p:d}}return!0}function J(a,b){var c=a[0];c.styleSheet?c.styleSheet.cssText=b:a.html(b)}function K(a,b,c){return b===c?!1:b>=a?"left":a>=c?"right":"left right"}function L(a,b,c,d){if(!c)return!1;if(!isNaN(a))return a-(d?0:1);for(var e,f=0,g=b.length;g>f;f++){var h=b[f];if(h.id===a){e=f;break}}return e}function M(a,b,c){c=c||{},a.each(function(){var a,e=d(this),f=e.data();f.clickOn||(f.clickOn=!0,d.extend(cb(e,{onStart:function(b){a=b,(c.onStart||g).call(this,b)},onMove:c.onMove||g,onTouchEnd:c.onTouchEnd||g,onEnd:function(c){c.moved||b.call(this,a)}}),{noMove:!0}))})}function N(a,b){return'<div class="'+a+'">'+(b||"")+"</div>"}function O(a){for(var b=a.length;b;){var c=Math.floor(Math.random()*b--),d=a[b];a[b]=a[c],a[c]=d}return a}function P(a){return"[object Array]"==Object.prototype.toString.call(a)&&d.map(a,function(a){return d.extend({},a)})}function Q(a,b,c){a.scrollLeft(b||0).scrollTop(c||0)}function R(a){if(a){var b={};return d.each(a,function(a,c){b[a.toLowerCase()]=c}),b}}function S(a){if(a){var b=+a;return isNaN(b)?(b=a.split("/"),+b[0]/+b[1]||e):b}}function T(a,b,c,d){b&&(a.addEventListener?a.addEventListener(b,c,!!d):a.attachEvent("on"+b,c))}function U(a){return!!a.getAttribute("disabled")}function V(a){return{tabindex:-1*a+"",disabled:a}}function W(a,b){T(a,"keyup",function(c){U(a)||13==c.keyCode&&b.call(a,c)})}function X(a,b){T(a,"focus",a.onfocusin=function(c){b.call(a,c)},!0)}function Y(a,b){a.preventDefault?a.preventDefault():a.returnValue=!1,b&&a.stopPropagation&&a.stopPropagation()}function Z(a){return a?">":"<"}function $(a){return a=(a+"").split(/\s+/),{x:q(a[0])||bd,y:q(a[1])||bd}}function _(a,b){var c=a.data(),e=Math.round(b.pos),f=function(){c.sliding=!1,(b.onEnd||g)()};"undefined"!=typeof b.overPos&&b.overPos!==b.pos&&(e=b.overPos,f=function(){_(a,d.extend({},b,{overPos:b.pos,time:Math.max(Qc,b.time/2)}))});var h=d.extend(k(e),b.width&&{width:b.width});c.sliding=!0,Ic?(a.css(d.extend(l(b.time),h)),b.time>10?u(a,"transform",f,b.time):f()):a.stop().animate(h,b.time,_c,f)}function ab(a,b,c,e,f,h){var i="undefined"!=typeof h;if(i||(f.push(arguments),Array.prototype.push.call(arguments,f.length),!(f.length>1))){a=a||d(a),b=b||d(b);var j=a[0],k=b[0],l="crossfade"===e.method,m=function(){if(!m.done){m.done=!0;var a=(i||f.shift())&&f.shift();a&&ab.apply(this,a),(e.onEnd||g)(!!a)}},n=e.time/(h||1);c.removeClass(Rb+" "+Qb),a.stop().addClass(Rb),b.stop().addClass(Qb),l&&k&&a.fadeTo(0,0),a.fadeTo(l?n:0,1,l&&m),b.fadeTo(n,0,m),j&&l||k||m()}}function bb(a){var b=(a.touches||[])[0]||a;a._x=b.pageX,a._y=b.clientY,a._now=d.now()}function cb(a,c){function e(a){return m=d(a.target),u.checked=p=q=s=!1,k||u.flow||a.touches&&a.touches.length>1||a.which>1||ed&&ed.type!==a.type&&gd||(p=c.select&&m.is(c.select,t))?p:(o="touchstart"===a.type,q=m.is("a, a *",t),n=u.control,r=u.noMove||u.noSwipe||n?16:u.snap?0:4,bb(a),l=ed=a,fd=a.type.replace(/down|start/,"move").replace(/Down/,"Move"),(c.onStart||g).call(t,a,{control:n,$target:m}),k=u.flow=!0,void((!o||u.go)&&Y(a)))}function f(a){if(a.touches&&a.touches.length>1||Nc&&!a.isPrimary||fd!==a.type||!k)return k&&h(),void(c.onTouchEnd||g)();bb(a);var b=Math.abs(a._x-l._x),d=Math.abs(a._y-l._y),e=b-d,f=(u.go||u.x||e>=0)&&!u.noSwipe,i=0>e;o&&!u.checked?(k=f)&&Y(a):(Y(a),(c.onMove||g).call(t,a,{touch:o})),!s&&Math.sqrt(Math.pow(b,2)+Math.pow(d,2))>r&&(s=!0),u.checked=u.checked||f||i}function h(a){(c.onTouchEnd||g)();var b=k;u.control=k=!1,b&&(u.flow=!1),!b||q&&!u.checked||(a&&Y(a),gd=!0,clearTimeout(hd),hd=setTimeout(function(){gd=!1},1e3),(c.onEnd||g).call(t,{moved:s,$target:m,control:n,touch:o,startEvent:l,aborted:!a||"MSPointerCancel"===a.type}))}function i(){u.flow||setTimeout(function(){u.flow=!0},10)}function j(){u.flow&&setTimeout(function(){u.flow=!1},Pc)}var k,l,m,n,o,p,q,r,s,t=a[0],u={};return Nc?(T(t,"MSPointerDown",e),T(b,"MSPointerMove",f),T(b,"MSPointerCancel",h),T(b,"MSPointerUp",h)):(T(t,"touchstart",e),T(t,"touchmove",f),T(t,"touchend",h),T(b,"touchstart",i),T(b,"touchend",j),T(b,"touchcancel",j),Ec.on("scroll",j),a.on("mousedown",e),Fc.on("mousemove",f).on("mouseup",h)),a.on("click","a",function(a){u.checked&&Y(a)}),u}function db(a,b){function c(c,d){A=!0,j=l=c._x,q=c._now,p=[[q,j]],m=n=D.noMove||d?0:v(a,(b.getPos||g)()),(b.onStart||g).call(B,c)}function e(a,b){s=D.min,t=D.max,u=D.snap,w=a.altKey,A=z=!1,y=b.control,y||C.sliding||c(a)}function f(d,e){D.noSwipe||(A||c(d),l=d._x,p.push([d._now,l]),n=m-(j-l),o=K(n,s,t),s>=n?n=x(n,s):n>=t&&(n=x(n,t)),D.noMove||(a.css(k(n)),z||(z=!0,e.touch||Nc||a.addClass(ec)),(b.onMove||g).call(B,d,{pos:n,edge:o})))}function i(e){if(!D.noSwipe||!e.moved){A||c(e.startEvent,!0),e.touch||Nc||a.removeClass(ec),r=d.now();for(var f,i,j,k,o,q,v,x,y,z=r-Pc,C=null,E=Qc,F=b.friction,G=p.length-1;G>=0;G--){if(f=p[G][0],i=Math.abs(f-z),null===C||j>i)C=f,k=p[G][1];else if(C===z||i>j)break;j=i}v=h(n,s,t);var H=k-l,I=H>=0,J=r-C,K=J>Pc,L=!K&&n!==m&&v===n;u&&(v=h(Math[L?I?"floor":"ceil":"round"](n/u)*u,s,t),s=t=v),L&&(u||v===n)&&(y=-(H/J),E*=h(Math.abs(y),b.timeLow,b.timeHigh),o=Math.round(n+y*E/F),u||(v=o),(!I&&o>t||I&&s>o)&&(q=I?s:t,x=o-q,u||(v=q),x=h(v+.03*x,q-50,q+50),E=Math.abs((n-x)/(y/F)))),E*=w?10:1,(b.onEnd||g).call(B,d.extend(e,{moved:e.moved||K&&u,pos:n,newPos:v,overPos:x,time:E}))}}var j,l,m,n,o,p,q,r,s,t,u,w,y,z,A,B=a[0],C=a.data(),D={};return D=d.extend(cb(b.$wrap,d.extend({},b,{onStart:e,onMove:f,onEnd:i})),D)}function eb(a,b){var c,e,f,h=a[0],i={prevent:{}};return T(h,Oc,function(a){var h=a.wheelDeltaY||-1*a.deltaY||0,j=a.wheelDeltaX||-1*a.deltaX||0,k=Math.abs(j)&&!Math.abs(h),l=Z(0>j),m=e===l,n=d.now(),o=Pc>n-f;e=l,f=n,k&&i.ok&&(!i.prevent[l]||c)&&(Y(a,!0),c&&m&&o||(b.shift&&(c=!0,clearTimeout(i.t),i.t=setTimeout(function(){c=!1},Rc)),(b.onEnd||g)(a,b.shift?l:j)))}),i}function fb(){d.each(d.Fotorama.instances,function(a,b){b.index=a})}function gb(a){d.Fotorama.instances.push(a),fb()}function hb(a){d.Fotorama.instances.splice(a.index,1),fb()}var ib="fotorama",jb="fullscreen",kb=ib+"__wrap",lb=kb+"--css2",mb=kb+"--css3",nb=kb+"--video",ob=kb+"--fade",pb=kb+"--slide",qb=kb+"--no-controls",rb=kb+"--no-shadows",sb=kb+"--pan-y",tb=kb+"--rtl",ub=kb+"--only-active",vb=kb+"--no-captions",wb=kb+"--toggle-arrows",xb=ib+"__stage",yb=xb+"__frame",zb=yb+"--video",Ab=xb+"__shaft",Bb=ib+"__grab",Cb=ib+"__pointer",Db=ib+"__arr",Eb=Db+"--disabled",Fb=Db+"--prev",Gb=Db+"--next",Hb=ib+"__nav",Ib=Hb+"-wrap",Jb=Hb+"__shaft",Kb=Hb+"--dots",Lb=Hb+"--thumbs",Mb=Hb+"__frame",Nb=Mb+"--dot",Ob=Mb+"--thumb",Pb=ib+"__fade",Qb=Pb+"-front",Rb=Pb+"-rear",Sb=ib+"__shadow",Tb=Sb+"s",Ub=Tb+"--left",Vb=Tb+"--right",Wb=ib+"__active",Xb=ib+"__select",Yb=ib+"--hidden",Zb=ib+"--fullscreen",$b=ib+"__fullscreen-icon",_b=ib+"__error",ac=ib+"__loading",bc=ib+"__loaded",cc=bc+"--full",dc=bc+"--img",ec=ib+"__grabbing",fc=ib+"__img",gc=fc+"--full",hc=ib+"__dot",ic=ib+"__thumb",jc=ic+"-border",kc=ib+"__html",lc=ib+"__video",mc=lc+"-play",nc=lc+"-close",oc=ib+"__caption",pc=ib+"__caption__wrap",qc=ib+"__spinner",rc='" tabindex="0" role="button',sc=d&&d.fn.jquery.split(".");if(!sc||sc[0]<1||1==sc[0]&&sc[1]<8)throw"Fotorama requires jQuery 1.8 or later and will not run without it.";var tc={},uc=function(a,b,c){function d(a){r.cssText=a}function e(a,b){return typeof a===b}function f(a,b){return!!~(""+a).indexOf(b)}function g(a,b){for(var d in a){var e=a[d];if(!f(e,"-")&&r[e]!==c)return"pfx"==b?e:!0}return!1}function h(a,b,d){for(var f in a){var g=b[a[f]];if(g!==c)return d===!1?a[f]:e(g,"function")?g.bind(d||b):g}return!1}function i(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),f=(a+" "+u.join(d+" ")+d).split(" ");return e(b,"string")||e(b,"undefined")?g(f,b):(f=(a+" "+v.join(d+" ")+d).split(" "),h(f,b,c))}var j,k,l,m="2.6.2",n={},o=b.documentElement,p="modernizr",q=b.createElement(p),r=q.style,s=({}.toString," -webkit- -moz- -o- -ms- ".split(" ")),t="Webkit Moz O ms",u=t.split(" "),v=t.toLowerCase().split(" "),w={},x=[],y=x.slice,z=function(a,c,d,e){var f,g,h,i,j=b.createElement("div"),k=b.body,l=k||b.createElement("body");if(parseInt(d,10))for(;d--;)h=b.createElement("div"),h.id=e?e[d]:p+(d+1),j.appendChild(h);return f=["&#173;",'<style id="s',p,'">',a,"</style>"].join(""),j.id=p,(k?j:l).innerHTML+=f,l.appendChild(j),k||(l.style.background="",l.style.overflow="hidden",i=o.style.overflow,o.style.overflow="hidden",o.appendChild(l)),g=c(j,a),k?j.parentNode.removeChild(j):(l.parentNode.removeChild(l),o.style.overflow=i),!!g},A={}.hasOwnProperty;l=e(A,"undefined")||e(A.call,"undefined")?function(a,b){return b in a&&e(a.constructor.prototype[b],"undefined")}:function(a,b){return A.call(a,b)},Function.prototype.bind||(Function.prototype.bind=function(a){var b=this;if("function"!=typeof b)throw new TypeError;var c=y.call(arguments,1),d=function(){if(this instanceof d){var e=function(){};e.prototype=b.prototype;var f=new e,g=b.apply(f,c.concat(y.call(arguments)));return Object(g)===g?g:f}return b.apply(a,c.concat(y.call(arguments)))};return d}),w.csstransforms3d=function(){var a=!!i("perspective");return a};for(var B in w)l(w,B)&&(k=B.toLowerCase(),n[k]=w[B](),x.push((n[k]?"":"no-")+k));return n.addTest=function(a,b){if("object"==typeof a)for(var d in a)l(a,d)&&n.addTest(d,a[d]);else{if(a=a.toLowerCase(),n[a]!==c)return n;b="function"==typeof b?b():b,"undefined"!=typeof enableClasses&&enableClasses&&(o.className+=" "+(b?"":"no-")+a),n[a]=b}return n},d(""),q=j=null,n._version=m,n._prefixes=s,n._domPrefixes=v,n._cssomPrefixes=u,n.testProp=function(a){return g([a])},n.testAllProps=i,n.testStyles=z,n.prefixed=function(a,b,c){return b?i(a,b,c):i(a,"pfx")},n}(a,b),vc={ok:!1,is:function(){return!1},request:function(){},cancel:function(){},event:"",prefix:""},wc="webkit moz o ms khtml".split(" ");if("undefined"!=typeof b.cancelFullScreen)vc.ok=!0;else for(var xc=0,yc=wc.length;yc>xc;xc++)if(vc.prefix=wc[xc],"undefined"!=typeof b[vc.prefix+"CancelFullScreen"]){vc.ok=!0;break}vc.ok&&(vc.event=vc.prefix+"fullscreenchange",vc.is=function(){switch(this.prefix){case"":return b.fullScreen;case"webkit":return b.webkitIsFullScreen;default:return b[this.prefix+"FullScreen"]}},vc.request=function(a){return""===this.prefix?a.requestFullScreen():a[this.prefix+"RequestFullScreen"]()},vc.cancel=function(){return""===this.prefix?b.cancelFullScreen():b[this.prefix+"CancelFullScreen"]()});var zc,Ac={lines:12,length:5,width:2,radius:7,corners:1,rotate:15,color:"rgba(128, 128, 128, .75)",hwaccel:!0},Bc={top:"auto",left:"auto",className:""};!function(a,b){zc=b()}(this,function(){function a(a,c){var d,e=b.createElement(a||"div");for(d in c)e[d]=c[d];return e}function c(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function d(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=m.substring(0,m.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return o[e]||(p.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",p.cssRules.length),o[e]=1),e}function f(a,b){var c,d,f=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<n.length;d++)if(c=n[d]+b,f[c]!==e)return c;return f[b]!==e?b:void 0}function g(a,b){for(var c in b)a.style[f(a,c)||c]=b[c];return a}function h(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)a[d]===e&&(a[d]=c[d])}return a}function i(a){for(var b={x:a.offsetLeft,y:a.offsetTop};a=a.offsetParent;)b.x+=a.offsetLeft,b.y+=a.offsetTop;return b}function j(a,b){return"string"==typeof a?a:a[b%a.length]}function k(a){return"undefined"==typeof this?new k(a):void(this.opts=h(a||{},k.defaults,q))}function l(){function b(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}p.addRule(".spin-vml","behavior:url(#default#VML)"),k.prototype.lines=function(a,d){function e(){return g(b("group",{coordsize:k+" "+k,coordorigin:-i+" "+-i}),{width:k,height:k})}function f(a,f,h){c(m,c(g(e(),{rotation:360/d.lines*a+"deg",left:~~f}),c(g(b("roundrect",{arcsize:d.corners}),{width:i,height:d.width,left:d.radius,top:-d.width>>1,filter:h}),b("fill",{color:j(d.color,a),opacity:d.opacity}),b("stroke",{opacity:0}))))}var h,i=d.length+d.width,k=2*i,l=2*-(d.width+d.length)+"px",m=g(e(),{position:"absolute",top:l,left:l});if(d.shadow)for(h=1;h<=d.lines;h++)f(h,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(h=1;h<=d.lines;h++)f(h);return c(a,m)},k.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var m,n=["webkit","Moz","ms","O"],o={},p=function(){var d=a("style",{type:"text/css"});return c(b.getElementsByTagName("head")[0],d),d.sheet||d.styleSheet}(),q={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"};k.defaults={},h(k.prototype,{spin:function(b){this.stop();var c,d,e=this,f=e.opts,h=e.el=g(a(0,{className:f.className}),{position:f.position,width:0,zIndex:f.zIndex}),j=f.radius+f.length+f.width;if(b&&(b.insertBefore(h,b.firstChild||null),d=i(b),c=i(h),g(h,{left:("auto"==f.left?d.x-c.x+(b.offsetWidth>>1):parseInt(f.left,10)+j)+"px",top:("auto"==f.top?d.y-c.y+(b.offsetHeight>>1):parseInt(f.top,10)+j)+"px"})),h.setAttribute("role","progressbar"),e.lines(h,e.opts),!m){var k,l=0,n=(f.lines-1)*(1-f.direction)/2,o=f.fps,p=o/f.speed,q=(1-f.opacity)/(p*f.trail/100),r=p/f.lines;!function s(){l++;for(var a=0;a<f.lines;a++)k=Math.max(1-(l+(f.lines-a)*r)%p*q,f.opacity),e.opacity(h,a*f.direction+n,k,f);e.timeout=e.el&&setTimeout(s,~~(1e3/o))}()}return e},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=e),this},lines:function(b,e){function f(b,c){return g(a(),{position:"absolute",width:e.length+e.width+"px",height:e.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/e.lines*i+e.rotate)+"deg) translate("+e.radius+"px,0)",borderRadius:(e.corners*e.width>>1)+"px"})}for(var h,i=0,k=(e.lines-1)*(1-e.direction)/2;i<e.lines;i++)h=g(a(),{position:"absolute",top:1+~(e.width/2)+"px",transform:e.hwaccel?"translate3d(0,0,0)":"",opacity:e.opacity,animation:m&&d(e.opacity,e.trail,k+i*e.direction,e.lines)+" "+1/e.speed+"s linear infinite"}),e.shadow&&c(h,g(f("#000","0 0 4px #000"),{top:"2px"})),c(b,c(h,f(j(e.color,i),"0 0 1px rgba(0,0,0,.1)")));return b},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var r=g(a("group"),{behavior:"url(#default#VML)"});return!f(r,"transform")&&r.adj?l():m=f(r,"animation"),k});var Cc,Dc,Ec=d(a),Fc=d(b),Gc="quirks"===c.hash.replace("#",""),Hc=uc.csstransforms3d,Ic=Hc&&!Gc,Jc=Hc||"CSS1Compat"===b.compatMode,Kc=vc.ok,Lc=navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i),Mc=!Ic||Lc,Nc=navigator.msPointerEnabled,Oc="onwheel"in b.createElement("div")?"wheel":b.onmousewheel!==e?"mousewheel":"DOMMouseScroll",Pc=250,Qc=300,Rc=1400,Sc=5e3,Tc=2,Uc=64,Vc=500,Wc=333,Xc="$stageFrame",Yc="$navDotFrame",Zc="$navThumbFrame",$c="auto",_c=f([.1,0,.25,1]),ad=99999,bd="50%",cd={width:null,minwidth:null,maxwidth:"100%",height:null,minheight:null,maxheight:null,ratio:null,margin:Tc,glimpse:0,fit:"contain",position:bd,thumbposition:bd,nav:"dots",navposition:"bottom",navwidth:null,thumbwidth:Uc,thumbheight:Uc,thumbmargin:Tc,thumbborderwidth:Tc,thumbfit:"cover",allowfullscreen:!1,transition:"slide",clicktransition:null,transitionduration:Qc,captions:!0,hash:!1,startindex:0,loop:!1,autoplay:!1,stopautoplayontouch:!0,keyboard:!1,arrows:!0,click:!0,swipe:!0,trackpad:!1,enableifsingleframe:!1,controlsonstart:!0,shuffle:!1,direction:"ltr",shadows:!0,spinner:null},dd={left:!0,right:!0,down:!1,up:!1,space:!1,home:!1,end:!1};G.stop=function(a){G.ii[a]=!1};var ed,fd,gd,hd;jQuery.Fotorama=function(a,e){function f(){d.each(yd,function(a,b){if(!b.i){b.i=me++;var c=A(b.video,!0);if(c){var d={};b.video=c,b.img||b.thumb?b.thumbsReady=!0:d=B(b,yd,ie),C(yd,{img:d.img,thumb:d.thumb},b.i,ie)}}})}function g(a){return Zd[a]||ie.fullScreen}function i(a){var b="keydown."+ib,c=ib+je,d="keydown."+c,f="resize."+c+" orientationchange."+c;a?(Fc.on(d,function(a){var b,c;Cd&&27===a.keyCode?(b=!0,md(Cd,!0,!0)):(ie.fullScreen||e.keyboard&&!ie.index)&&(27===a.keyCode?(b=!0,ie.cancelFullScreen()):a.shiftKey&&32===a.keyCode&&g("space")||37===a.keyCode&&g("left")||38===a.keyCode&&g("up")?c="<":32===a.keyCode&&g("space")||39===a.keyCode&&g("right")||40===a.keyCode&&g("down")?c=">":36===a.keyCode&&g("home")?c="<<":35===a.keyCode&&g("end")&&(c=">>")),(b||c)&&Y(a),c&&ie.show({index:c,slow:a.altKey,user:!0})}),ie.index||Fc.off(b).on(b,"textarea, input, select",function(a){!Dc.hasClass(jb)&&a.stopPropagation()}),Ec.on(f,ie.resize)):(Fc.off(d),Ec.off(f))}function j(b){b!==j.f&&(b?(a.html("").addClass(ib+" "+ke).append(qe).before(oe).before(pe),gb(ie)):(qe.detach(),oe.detach(),pe.detach(),a.html(ne.urtext).removeClass(ke),hb(ie)),i(b),j.f=b)}function m(){yd=ie.data=yd||P(e.data)||D(a),zd=ie.size=yd.length,!xd.ok&&e.shuffle&&O(yd),f(),Je=y(Je),zd&&j(!0)}function o(){var a=2>zd&&!e.enableifsingleframe||Cd;Me.noMove=a||Sd,Me.noSwipe=a||!e.swipe,!Wd&&se.toggleClass(Bb,!e.click&&!Me.noMove&&!Me.noSwipe),Nc&&qe.toggleClass(sb,!Me.noSwipe)}function t(a){a===!0&&(a=""),e.autoplay=Math.max(+a||Sc,1.5*Vd)}function u(){function a(a,c){b[a?"add":"remove"].push(c)}ie.options=e=R(e),Sd="crossfade"===e.transition||"dissolve"===e.transition,Md=e.loop&&(zd>2||Sd&&(!Wd||"slide"!==Wd)),Vd=+e.transitionduration||Qc,Yd="rtl"===e.direction,Zd=d.extend({},e.keyboard&&dd,e.keyboard);var b={add:[],remove:[]};zd>1||e.enableifsingleframe?(Nd=e.nav,Pd="top"===e.navposition,b.remove.push(Xb),we.toggle(!!e.arrows)):(Nd=!1,we.hide()),Rb(),Bd=new zc(d.extend(Ac,e.spinner,Bc,{direction:Yd?-1:1})),Gc(),Hc(),e.autoplay&&t(e.autoplay),Td=n(e.thumbwidth)||Uc,Ud=n(e.thumbheight)||Uc,Ne.ok=Pe.ok=e.trackpad&&!Mc,o(),ed(e,[Le]),Od="thumbs"===Nd,Od?(lc(zd,"navThumb"),Ad=Be,he=Zc,J(oe,d.Fotorama.jst.style({w:Td,h:Ud,b:e.thumbborderwidth,m:e.thumbmargin,s:je,q:!Jc})),ye.addClass(Lb).removeClass(Kb)):"dots"===Nd?(lc(zd,"navDot"),Ad=Ae,he=Yc,ye.addClass(Kb).removeClass(Lb)):(Nd=!1,ye.removeClass(Lb+" "+Kb)),Nd&&(Pd?xe.insertBefore(re):xe.insertAfter(re),wc.nav=!1,wc(Ad,ze,"nav")),Qd=e.allowfullscreen,Qd?(De.prependTo(re),Rd=Kc&&"native"===Qd):(De.detach(),Rd=!1),a(Sd,ob),a(!Sd,pb),a(!e.captions,vb),a(Yd,tb),a("always"!==e.arrows,wb),Xd=e.shadows&&!Mc,a(!Xd,rb),qe.addClass(b.add.join(" ")).removeClass(b.remove.join(" ")),Ke=d.extend({},e)}function x(a){return 0>a?(zd+a%zd)%zd:a>=zd?a%zd:a}function y(a){return h(a,0,zd-1)}function z(a){return Md?x(a):y(a)}function E(a){return a>0||Md?a-1:!1}function U(a){return zd-1>a||Md?a+1:!1}function $(){Me.min=Md?-1/0:-r(zd-1,Le.w,e.margin,Fd),Me.max=Md?1/0:-r(0,Le.w,e.margin,Fd),Me.snap=Le.w+e.margin}function bb(){Oe.min=Math.min(0,Le.nw-ze.width()),Oe.max=0,ze.toggleClass(Bb,!(Oe.noMove=Oe.min===Oe.max))}function cb(a,b,c){if("number"==typeof a){a=new Array(a);var e=!0}return d.each(a,function(a,d){if(e&&(d=a),"number"==typeof d){var f=yd[x(d)];if(f){var g="$"+b+"Frame",h=f[g];c.call(this,a,d,f,h,g,h&&h.data())}}})}function fb(a,b,c,d){(!$d||"*"===$d&&d===Ld)&&(a=q(e.width)||q(a)||Vc,b=q(e.height)||q(b)||Wc,ie.resize({width:a,ratio:e.ratio||c||a/b},0,d!==Ld&&"*"))}function Pb(a,b,c,f,g,h){cb(a,b,function(a,i,j,k,l,m){function n(a){var b=x(i);fd(a,{index:b,src:w,frame:yd[b]})}function o(){t.remove(),d.Fotorama.cache[w]="error",j.html&&"stage"===b||!y||y===w?(!w||j.html||r?"stage"===b&&(k.trigger("f:load").removeClass(ac+" "+_b).addClass(bc),n("load"),fb()):(k.trigger("f:error").removeClass(ac).addClass(_b),n("error")),m.state="error",!(zd>1&&yd[i]===j)||j.html||j.deleted||j.video||r||(j.deleted=!0,ie.splice(i,1))):(j[v]=w=y,Pb([i],b,c,f,g,!0))}function p(){d.Fotorama.measures[w]=u.measures=d.Fotorama.measures[w]||{width:s.width,height:s.height,ratio:s.width/s.height},fb(u.measures.width,u.measures.height,u.measures.ratio,i),t.off("load error").addClass(fc+(r?" "+gc:"")).prependTo(k),I(t,(d.isFunction(c)?c():c)||Le,f||j.fit||e.fit,g||j.position||e.position),d.Fotorama.cache[w]=m.state="loaded",setTimeout(function(){k.trigger("f:load").removeClass(ac+" "+_b).addClass(bc+" "+(r?cc:dc)),"stage"===b?n("load"):(j.thumbratio===$c||!j.thumbratio&&e.thumbratio===$c)&&(j.thumbratio=u.measures.ratio,vd())},0)}function q(){var a=10;G(function(){return!fe||!a--&&!Mc},function(){p()})}if(k){var r=ie.fullScreen&&j.full&&j.full!==j.img&&!m.$full&&"stage"===b;if(!m.$img||h||r){var s=new Image,t=d(s),u=t.data();m[r?"$full":"$img"]=t;var v="stage"===b?r?"full":"img":"thumb",w=j[v],y=r?null:j["stage"===b?"thumb":"img"];if("navThumb"===b&&(k=m.$wrap),!w)return void o();d.Fotorama.cache[w]?!function z(){"error"===d.Fotorama.cache[w]?o():"loaded"===d.Fotorama.cache[w]?setTimeout(q,0):setTimeout(z,100)}():(d.Fotorama.cache[w]="*",t.on("load",q).on("error",o)),m.state="",s.src=w}}})}function Qb(a){Ie.append(Bd.spin().el).appendTo(a)}function Rb(){Ie.detach(),Bd&&Bd.stop()}function Sb(){var a=Dd[Xc];a&&!a.data().state&&(Qb(a),a.on("f:load f:error",function(){a.off("f:load f:error"),Rb()}))}function ec(a){W(a,sd),X(a,function(){setTimeout(function(){Q(ye)},0),Rc({time:Vd,guessIndex:d(this).data().eq,minMax:Oe})})}function lc(a,b){cb(a,b,function(a,c,e,f,g,h){if(!f){f=e[g]=qe[g].clone(),h=f.data(),h.data=e;var i=f[0];"stage"===b?(e.html&&d('<div class="'+kc+'"></div>').append(e._html?d(e.html).removeAttr("id").html(e._html):e.html).appendTo(f),e.caption&&d(N(oc,N(pc,e.caption))).appendTo(f),e.video&&f.addClass(zb).append(Fe.clone()),X(i,function(){setTimeout(function(){Q(re)},0),pd({index:h.eq,user:!0})}),te=te.add(f)):"navDot"===b?(ec(i),Ae=Ae.add(f)):"navThumb"===b&&(ec(i),h.$wrap=f.children(":first"),Be=Be.add(f),e.video&&h.$wrap.append(Fe.clone()))}})}function sc(a,b,c,d){return a&&a.length&&I(a,b,c,d)}function tc(a){cb(a,"stage",function(a,b,c,f,g,h){if(f){var i=x(b),j=c.fit||e.fit,k=c.position||e.position;h.eq=i,Re[Xc][i]=f.css(d.extend({left:Sd?0:r(b,Le.w,e.margin,Fd)},Sd&&l(0))),F(f[0])&&(f.appendTo(se),md(c.$video)),sc(h.$img,Le,j,k),sc(h.$full,Le,j,k)}})}function uc(a,b){if("thumbs"===Nd&&!isNaN(a)){var c=-a,f=-a+Le.nw;Be.each(function(){var a=d(this),g=a.data(),h=g.eq,i=function(){return{h:Ud,w:g.w}},j=i(),k=yd[h]||{},l=k.thumbfit||e.thumbfit,m=k.thumbposition||e.thumbposition;j.w=g.w,g.l+g.w<c||g.l>f||sc(g.$img,j,l,m)||b&&Pb([h],"navThumb",i,l,m)})}}function wc(a,b,c){if(!wc[c]){var f="nav"===c&&Od,g=0;b.append(a.filter(function(){for(var a,b=d(this),c=b.data(),e=0,f=yd.length;f>e;e++)if(c.data===yd[e]){a=!0,c.eq=e;break}return a||b.remove()&&!1}).sort(function(a,b){return d(a).data().eq-d(b).data().eq}).each(function(){if(f){var a=d(this),b=a.data(),c=Math.round(Ud*b.data.thumbratio)||Td;b.l=g,b.w=c,a.css({width:c}),g+=c+e.thumbmargin}})),wc[c]=!0}}function xc(a){return a-Se>Le.w/3}function yc(a){return!(Md||Je+a&&Je-zd+a||Cd)}function Gc(){var a=yc(0),b=yc(1);ue.toggleClass(Eb,a).attr(V(a)),ve.toggleClass(Eb,b).attr(V(b))}function Hc(){Ne.ok&&(Ne.prevent={"<":yc(0),">":yc(1)})}function Lc(a){var b,c,d=a.data();return Od?(b=d.l,c=d.w):(b=a.position().left,c=a.width()),{c:b+c/2,min:-b+10*e.thumbmargin,max:-b+Le.w-c-10*e.thumbmargin}}function Oc(a){var b=Dd[he].data();_(Ce,{time:1.2*a,pos:b.l,width:b.w-2*e.thumbborderwidth})}function Rc(a){var b=yd[a.guessIndex][he];if(b){var c=Oe.min!==Oe.max,d=a.minMax||c&&Lc(Dd[he]),e=c&&(a.keep&&Rc.l?Rc.l:h((a.coo||Le.nw/2)-Lc(b).c,d.min,d.max)),f=c&&h(e,Oe.min,Oe.max),g=1.1*a.time;_(ze,{time:g,pos:f||0,onEnd:function(){uc(f,!0)}}),ld(ye,K(f,Oe.min,Oe.max)),Rc.l=e}}function Tc(){_c(he),Qe[he].push(Dd[he].addClass(Wb))}function _c(a){for(var b=Qe[a];b.length;)b.shift().removeClass(Wb)}function bd(a){var b=Re[a];d.each(Ed,function(a,c){delete b[x(c)]}),d.each(b,function(a,c){delete b[a],c.detach()})}function cd(a){Fd=Gd=Je;var b=Dd[Xc];b&&(_c(Xc),Qe[Xc].push(b.addClass(Wb)),a||ie.show.onEnd(!0),v(se,0,!0),bd(Xc),tc(Ed),$(),bb())}function ed(a,b){a&&d.each(b,function(b,c){c&&d.extend(c,{width:a.width||c.width,height:a.height,minwidth:a.minwidth,maxwidth:a.maxwidth,minheight:a.minheight,maxheight:a.maxheight,ratio:S(a.ratio)})})}function fd(b,c){a.trigger(ib+":"+b,[ie,c])}function gd(){clearTimeout(hd.t),fe=1,e.stopautoplayontouch?ie.stopAutoplay():ce=!0}function hd(){fe&&(e.stopautoplayontouch||(id(),jd()),hd.t=setTimeout(function(){fe=0},Qc+Pc))}function id(){ce=!(!Cd&&!de)}function jd(){if(clearTimeout(jd.t),G.stop(jd.w),!e.autoplay||ce)return void(ie.autoplay&&(ie.autoplay=!1,fd("stopautoplay")));ie.autoplay||(ie.autoplay=!0,fd("startautoplay"));var a=Je,b=Dd[Xc].data();jd.w=G(function(){return b.state||a!==Je},function(){jd.t=setTimeout(function(){if(!ce&&a===Je){var b=Kd,c=yd[b][Xc].data();jd.w=G(function(){return c.state||b!==Kd},function(){ce||b!==Kd||ie.show(Md?Z(!Yd):Kd)})}},e.autoplay)})}function kd(){ie.fullScreen&&(ie.fullScreen=!1,Kc&&vc.cancel(le),Dc.removeClass(jb),Cc.removeClass(jb),a.removeClass(Zb).insertAfter(pe),Le=d.extend({},ee),md(Cd,!0,!0),rd("x",!1),ie.resize(),Pb(Ed,"stage"),Q(Ec,ae,_d),fd("fullscreenexit"))}function ld(a,b){Xd&&(a.removeClass(Ub+" "+Vb),b&&!Cd&&a.addClass(b.replace(/^|\s/g," "+Tb+"--")))}function md(a,b,c){b&&(qe.removeClass(nb),Cd=!1,o()),a&&a!==Cd&&(a.remove(),fd("unloadvideo")),c&&(id(),jd())}function nd(a){qe.toggleClass(qb,a)}function od(a){if(!Me.flow){var b=a?a.pageX:od.x,c=b&&!yc(xc(b))&&e.click;od.p!==c&&re.toggleClass(Cb,c)&&(od.p=c,od.x=b)}}function pd(a){clearTimeout(pd.t),e.clicktransition&&e.clicktransition!==e.transition?setTimeout(function(){var b=e.transition;ie.setOptions({transition:e.clicktransition}),Wd=b,pd.t=setTimeout(function(){ie.show(a)},10)},0):ie.show(a)}function qd(a,b){var c=a.target,f=d(c);f.hasClass(mc)?ie.playVideo():c===Ee?ie.toggleFullScreen():Cd?c===He&&md(Cd,!0,!0):b?nd():e.click&&pd({index:a.shiftKey||Z(xc(a._x)),slow:a.altKey,user:!0})}function rd(a,b){Me[a]=Oe[a]=b}function sd(a){var b=d(this).data().eq;pd({index:b,slow:a.altKey,user:!0,coo:a._x-ye.offset().left})}function td(a){pd({index:we.index(this)?">":"<",slow:a.altKey,user:!0})}function ud(a){X(a,function(){setTimeout(function(){Q(re)},0),nd(!1)})}function vd(){if(m(),u(),!vd.i){vd.i=!0;var a=e.startindex;(a||e.hash&&c.hash)&&(Ld=L(a||c.hash.replace(/^#/,""),yd,0===ie.index||a,a)),Je=Fd=Gd=Hd=Ld=z(Ld)||0}if(zd){if(wd())return;Cd&&md(Cd,!0),Ed=[],bd(Xc),vd.ok=!0,ie.show({index:Je,time:0}),ie.resize()}else ie.destroy()}function wd(){return!wd.f===Yd?(wd.f=Yd,Je=zd-1-Je,ie.reverse(),!0):void 0}function xd(){xd.ok||(xd.ok=!0,fd("ready"))}Cc=d("html"),Dc=d("body");var yd,zd,Ad,Bd,Cd,Dd,Ed,Fd,Gd,Hd,Id,Jd,Kd,Ld,Md,Nd,Od,Pd,Qd,Rd,Sd,Td,Ud,Vd,Wd,Xd,Yd,Zd,$d,_d,ae,be,ce,de,ee,fe,ge,he,ie=this,je=d.now(),ke=ib+je,le=a[0],me=1,ne=a.data(),oe=d("<style></style>"),pe=d(N(Yb)),qe=d(N(kb)),re=d(N(xb)).appendTo(qe),se=(re[0],d(N(Ab)).appendTo(re)),te=d(),ue=d(N(Db+" "+Fb+rc)),ve=d(N(Db+" "+Gb+rc)),we=ue.add(ve).appendTo(re),xe=d(N(Ib)),ye=d(N(Hb)).appendTo(xe),ze=d(N(Jb)).appendTo(ye),Ae=d(),Be=d(),Ce=(se.data(),ze.data(),d(N(jc)).appendTo(ze)),De=d(N($b+rc)),Ee=De[0],Fe=d(N(mc)),Ge=d(N(nc)).appendTo(re),He=Ge[0],Ie=d(N(qc)),Je=!1,Ke={},Le={},Me={},Ne={},Oe={},Pe={},Qe={},Re={},Se=0,Te=[];
qe[Xc]=d(N(yb)),qe[Zc]=d(N(Mb+" "+Ob+rc,N(ic))),qe[Yc]=d(N(Mb+" "+Nb+rc,N(hc))),Qe[Xc]=[],Qe[Zc]=[],Qe[Yc]=[],Re[Xc]={},qe.addClass(Ic?mb:lb).toggleClass(qb,!e.controlsonstart),ne.fotorama=this,ie.startAutoplay=function(a){return ie.autoplay?this:(ce=de=!1,t(a||e.autoplay),jd(),this)},ie.stopAutoplay=function(){return ie.autoplay&&(ce=de=!0,jd()),this},ie.show=function(a){var b;"object"!=typeof a?(b=a,a={}):b=a.index,b=">"===b?Gd+1:"<"===b?Gd-1:"<<"===b?0:">>"===b?zd-1:b,b=isNaN(b)?L(b,yd,!0):b,b="undefined"==typeof b?Je||0:b,ie.activeIndex=Je=z(b),Id=E(Je),Jd=U(Je),Kd=x(Je+(Yd?-1:1)),Ed=[Je,Id,Jd],Gd=Md?b:Je;var c=Math.abs(Hd-Gd),d=w(a.time,function(){return Math.min(Vd*(1+(c-1)/12),2*Vd)}),f=a.overPos;a.slow&&(d*=10);var g=Dd;ie.activeFrame=Dd=yd[Je];var i=g===Dd&&!a.user;md(Cd,Dd.i!==yd[x(Fd)].i),lc(Ed,"stage"),tc(Mc?[Gd]:[Gd,E(Gd),U(Gd)]),rd("go",!0),i||fd("show",{user:a.user,time:d}),ce=!0;var j=ie.show.onEnd=function(b){if(!j.ok){if(j.ok=!0,b||cd(!0),i||fd("showend",{user:a.user}),!b&&Wd&&Wd!==e.transition)return ie.setOptions({transition:Wd}),void(Wd=!1);Sb(),Pb(Ed,"stage"),rd("go",!1),Hc(),od(),id(),jd()}};if(Sd){var k=Dd[Xc],l=Je!==Hd?yd[Hd][Xc]:null;ab(k,l,te,{time:d,method:e.transition,onEnd:j},Te)}else _(se,{pos:-r(Gd,Le.w,e.margin,Fd),overPos:f,time:d,onEnd:j});if(Gc(),Nd){Tc();var m=y(Je+h(Gd-Hd,-1,1));Rc({time:d,coo:m!==Je&&a.coo,guessIndex:"undefined"!=typeof a.coo?m:Je,keep:i}),Od&&Oc(d)}return be="undefined"!=typeof Hd&&Hd!==Je,Hd=Je,e.hash&&be&&!ie.eq&&H(Dd.id||Je+1),this},ie.requestFullScreen=function(){return Qd&&!ie.fullScreen&&(_d=Ec.scrollTop(),ae=Ec.scrollLeft(),Q(Ec),rd("x",!0),ee=d.extend({},Le),a.addClass(Zb).appendTo(Dc.addClass(jb)),Cc.addClass(jb),md(Cd,!0,!0),ie.fullScreen=!0,Rd&&vc.request(le),ie.resize(),Pb(Ed,"stage"),Sb(),fd("fullscreenenter")),this},ie.cancelFullScreen=function(){return Rd&&vc.is()?vc.cancel(b):kd(),this},ie.toggleFullScreen=function(){return ie[(ie.fullScreen?"cancel":"request")+"FullScreen"]()},T(b,vc.event,function(){!yd||vc.is()||Cd||kd()}),ie.resize=function(a){if(!yd)return this;var b=arguments[1]||0,c=arguments[2];ed(ie.fullScreen?{width:"100%",maxwidth:null,minwidth:null,height:"100%",maxheight:null,minheight:null}:R(a),[Le,c||ie.fullScreen||e]);var d=Le.width,f=Le.height,g=Le.ratio,i=Ec.height()-(Nd?ye.height():0);return q(d)&&(qe.addClass(ub).css({width:d,minWidth:Le.minwidth||0,maxWidth:Le.maxwidth||ad}),d=Le.W=Le.w=qe.width(),Le.nw=Nd&&p(e.navwidth,d)||d,e.glimpse&&(Le.w-=Math.round(2*(p(e.glimpse,d)||0))),se.css({width:Le.w,marginLeft:(Le.W-Le.w)/2}),f=p(f,i),f=f||g&&d/g,f&&(d=Math.round(d),f=Le.h=Math.round(h(f,p(Le.minheight,i),p(Le.maxheight,i))),re.stop().animate({width:d,height:f},b,function(){qe.removeClass(ub)}),cd(),Nd&&(ye.stop().animate({width:Le.nw},b),Rc({guessIndex:Je,time:b,keep:!0}),Od&&wc.nav&&Oc(b)),$d=c||!0,xd())),Se=re.offset().left,this},ie.setOptions=function(a){return d.extend(e,a),vd(),this},ie.shuffle=function(){return yd&&O(yd)&&vd(),this},ie.destroy=function(){return ie.cancelFullScreen(),ie.stopAutoplay(),yd=ie.data=null,j(),Ed=[],bd(Xc),vd.ok=!1,this},ie.playVideo=function(){var a=Dd,b=a.video,c=Je;return"object"==typeof b&&a.videoReady&&(Rd&&ie.fullScreen&&ie.cancelFullScreen(),G(function(){return!vc.is()||c!==Je},function(){c===Je&&(a.$video=a.$video||d(d.Fotorama.jst.video(b)),a.$video.appendTo(a[Xc]),qe.addClass(nb),Cd=a.$video,o(),we.blur(),De.blur(),fd("loadvideo"))})),this},ie.stopVideo=function(){return md(Cd,!0,!0),this},re.on("mousemove",od),Me=db(se,{onStart:gd,onMove:function(a,b){ld(re,b.edge)},onTouchEnd:hd,onEnd:function(a){ld(re);var b=(Nc&&!ge||a.touch)&&e.arrows&&"always"!==e.arrows;if(a.moved||b&&a.pos!==a.newPos&&!a.control){var c=s(a.newPos,Le.w,e.margin,Fd);ie.show({index:c,time:Sd?Vd:a.time,overPos:a.overPos,user:!0})}else a.aborted||a.control||qd(a.startEvent,b)},timeLow:1,timeHigh:1,friction:2,select:"."+Xb+", ."+Xb+" *",$wrap:re}),Oe=db(ze,{onStart:gd,onMove:function(a,b){ld(ye,b.edge)},onTouchEnd:hd,onEnd:function(a){function b(){Rc.l=a.newPos,id(),jd(),uc(a.newPos,!0)}if(a.moved)a.pos!==a.newPos?(ce=!0,_(ze,{time:a.time,pos:a.newPos,overPos:a.overPos,onEnd:b}),uc(a.newPos),Xd&&ld(ye,K(a.newPos,Oe.min,Oe.max))):b();else{var c=a.$target.closest("."+Mb,ze)[0];c&&sd.call(c,a.startEvent)}},timeLow:.5,timeHigh:2,friction:5,$wrap:ye}),Ne=eb(re,{shift:!0,onEnd:function(a,b){gd(),hd(),ie.show({index:b,slow:a.altKey})}}),Pe=eb(ye,{onEnd:function(a,b){gd(),hd();var c=v(ze)+.25*b;ze.css(k(h(c,Oe.min,Oe.max))),Xd&&ld(ye,K(c,Oe.min,Oe.max)),Pe.prevent={"<":c>=Oe.max,">":c<=Oe.min},clearTimeout(Pe.t),Pe.t=setTimeout(function(){Rc.l=c,uc(c,!0)},Pc),uc(c)}}),qe.hover(function(){setTimeout(function(){fe||nd(!(ge=!0))},0)},function(){ge&&nd(!(ge=!1))}),M(we,function(a){Y(a),td.call(this,a)},{onStart:function(){gd(),Me.control=!0},onTouchEnd:hd}),we.each(function(){W(this,function(a){td.call(this,a)}),ud(this)}),W(Ee,ie.toggleFullScreen),ud(Ee),d.each("load push pop shift unshift reverse sort splice".split(" "),function(a,b){ie[b]=function(){return yd=yd||[],"load"!==b?Array.prototype[b].apply(yd,arguments):arguments[0]&&"object"==typeof arguments[0]&&arguments[0].length&&(yd=P(arguments[0])),vd(),ie}}),vd()},d.fn.fotorama=function(b){return this.each(function(){var c=this,e=d(this),f=e.data(),g=f.fotorama;g?g.setOptions(b,!0):G(function(){return!E(c)},function(){f.urtext=e.html(),new d.Fotorama(e,d.extend({},cd,a.fotoramaDefaults,b,f))})})},d.Fotorama.instances=[],d.Fotorama.cache={},d.Fotorama.measures={},d=d||{},d.Fotorama=d.Fotorama||{},d.Fotorama.jst=d.Fotorama.jst||{},d.Fotorama.jst.style=function(a){{var b,c="";tc.escape}return c+=".fotorama"+(null==(b=a.s)?"":b)+" .fotorama__nav--thumbs .fotorama__nav__frame{\npadding:"+(null==(b=a.m)?"":b)+"px;\nheight:"+(null==(b=a.h)?"":b)+"px}\n.fotorama"+(null==(b=a.s)?"":b)+" .fotorama__thumb-border{\nheight:"+(null==(b=a.h-a.b*(a.q?0:2))?"":b)+"px;\nborder-width:"+(null==(b=a.b)?"":b)+"px;\nmargin-top:"+(null==(b=a.m)?"":b)+"px}"},d.Fotorama.jst.video=function(a){function b(){c+=d.call(arguments,"")}var c="",d=(tc.escape,Array.prototype.join);return c+='<div class="fotorama__video"><iframe src="',b(("youtube"==a.type?a.p+"youtube.com/embed/"+a.id+"?autoplay=1":"vimeo"==a.type?a.p+"player.vimeo.com/video/"+a.id+"?autoplay=1&badge=0":a.id)+(a.s&&"custom"!=a.type?"&"+a.s:"")),c+='" frameborder="0" allowfullscreen></iframe></div>\n'},d(function(){d("."+ib+':not([data-auto="false"])').fotorama()})}(window,document,location,"undefined"!=typeof jQuery&&jQuery);
;$( function()
{
    var targets = $( '[rel~=tooltip]' ),
        target  = false,
        tooltip = false,
        title   = false;

    targets.bind( 'mouseenter', function()
    {
        target  = $( this );
        tip     = target.attr( 'title' );
        tooltip = $( '<div id="tooltip"></div>' );

        if( !tip || tip == '' )
            return false;

        target.removeAttr( 'title' );
        tooltip.css( 'opacity', 0 )
            .html( tip )
            .appendTo( 'body' );

        var init_tooltip = function()
        {
            if( $( window ).width() < tooltip.outerWidth() * 1.5 )
                tooltip.css( 'max-width', $( window ).width() / 2 );
            else
                tooltip.css( 'max-width', 340 );

            var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                pos_top  = target.offset().top - tooltip.outerHeight() - 20;

            if( pos_left < 0 )
            {
                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                tooltip.addClass( 'left' );
            }
            else
                tooltip.removeClass( 'left' );

            if( pos_left + tooltip.outerWidth() > $( window ).width() )
            {
                pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                tooltip.addClass( 'right' );
            }
            else
                tooltip.removeClass( 'right' );

            if( pos_top < 0 )
            {
                var pos_top  = target.offset().top + target.outerHeight();
                tooltip.addClass( 'top' );
            }
            else
                tooltip.removeClass( 'top' );

            tooltip.css( { left: pos_left, top: pos_top } )
                .animate( { top: '+=10', opacity: 1 }, 50 );
        };

        init_tooltip();
        $( window ).resize( init_tooltip );

        var remove_tooltip = function()
        {
            tooltip.animate( { top: '-=10', opacity: 0 }, 50, function()
            {
                $( this ).remove();
            });

            target.attr( 'title', tip );
        };

        target.bind( 'mouseleave', remove_tooltip );
        tooltip.bind( 'click', remove_tooltip );
    });
});
var $body,
	windowHeight,
	windowWidth,
	mediaPoint1 = 1024,
	mediaPoint2 = 768,
	mediaPoint3 = 480,
	mediaPoint4 = 320;


//
// var el = document.querySelector('.cafe-description__text');
// SimpleScrollbar.initEl(el);


//загрузка скрипта
// var scriptMap = document.createElement('script');
// scriptMap.src = "https://api-maps.yandex.ru/2.0/?load=package.standard,package.geoObjects&lang=ru-RU";
// document.documentElement.appendChild(scriptMap);

// var scriptTool = document.createElement('script');
// scriptTool.src = "https://abestuzhev.github.io/cafe-anderson/bower_components/tooltipster/dist/js/tooltipster.bundle.js";
// document.documentElement.appendChild(scriptTool);

/*main.js*/


var windowWidth = (window.innerWidth ); // вся ширина окна
var documentWidth = (document.documentElement.clientWidth ); // ширина минус прокрутка
// console.log('Ширина window: ' + windowWidth);
// console.log('Ширина wrapper: ' + documentWidth);
var documentHeight = (document.documentElement.clientHeight );
// console.log('высота ' + documentHeight);

$(window).on('load', function(){



    /*скролл при выборе доставки*/
    var orderDeliveryMap = $('.order-delivery__map').height(),
        orderDeliveryAddressList = $('.order-delivery-address__list'),
        orderDeliveryAddressListHeight = orderDeliveryAddressList.height();
    // console.log('orderDeliveryMap: ' + orderDeliveryMap);
    // console.log('orderDeliveryAddressList: ' + orderDeliveryAddressListHeight);


    function changeHeightAddressList (){
        orderDeliveryAddressList.each(function(index, elem){
            var elemHeight =  $(elem).height();
            // console.log('elemHeight: ' + elemHeight);
            if(elemHeight > 320){
                // new SimpleBar(orderDeliveryAddressList[0]);
                // new SimpleBar(orderDeliveryAddressList[1]);
                // new SimpleBar(orderDeliveryAddressList[2]);
                // new SimpleBar(orderDeliveryAddressList[3]);
                $(elem).addClass('scroll-wrap');
            }
        });
    }
    changeHeightAddressList();

    //хак для быстрого обрезания всего списка в модальном окне заказа торта

    function addClassCakesAddressList(){
        $('.popup-cake-order .order-delivery-address__list').addClass('scroll-wrap');
    }
    addClassCakesAddressList();

    // $(document).on('click', '.cake-card__hover', function(){
    //     $('.popup-cake-order .order-delivery-address__list').addClass('scroll-wrap');
    //     console.log('scroll-wrap add');
    // });




    if($('div').hasClass('js-mixed-list')){
        var containerEl = document.querySelector('.js-mixed-list');
        var mixer = mixitup(containerEl);
    }

    $(document).on('click', '.order-tabs__item', function(){
        changeHeightAddressList();
    });



    var permitPath = [
    '/factory-happiness.html',
    '/cafe-anderson/factory-happiness.html'
    ];

    function getScrollElem (elem){
        if($(window).width() <= 800) {
            new SimpleBar($(elem)[0]);
        }
    }
    if(permitPath.indexOf(location.pathname) > -1){
        getScrollElem('.factory-layout');
        $(window).on('resize', function () {
            getScrollElem('.factory-layout');
        });
    } else {
        return false;
    }

    var $datepicker = $('.datepicker-here');
    $datepicker.datepicker({
        minDate: new Date(),
        autoClose: true
    });
    $datepicker.on('focus', function () {
        $(this).parents('.datepicker-layout').addClass('active-datepicker');
    });


    $('#datepickerCustom').datepicker({
        minDate: new Date(),
        autoClose: true
    });
    $('#datepickerCustom').on('focus', function () {
        $(this).parents('.datepicker-layout').addClass('active-datepicker');
    });


    var disabledPartyDays = [0, 6];
    $('#party-datepicker').datepicker({
        minDate: new Date(),
        inline: true,
        onRenderCell: function (date, cellType) {
            if (cellType == 'day') {
                var day = date.getDay(),
                    isDisabled = disabledPartyDays.indexOf(day) != -1;

                return {
                    disabled: isDisabled
                }
            }
        }
    });

    //календарь в мероприятиях
    var eventDates = [1, 10, 12, 22];
    $('#event-datepicker').datepicker({
        inline: true,
        onRenderCell: function (date, cellType) {
            var currentDate = date.getDate();
            if (cellType == 'day' && eventDates.indexOf(currentDate) != -1) {
                return {
                    html: currentDate + '<span class="dp-note"></span>'
                }
            }
        }
    });
    $('.js-event-order-datepicker').datepicker({
        minDate: new Date()
    });









});

$(document).ready(function ($) {
    //------------------------------------------------------------custom


    /*выбор месяцав календаре праздничных пространств*/
    $(document).on('click', '.calendar-header__month a', function(e){
        e.preventDefault();
        $('.calendar-header-popup').addClass('is-visible');
    });

    $(document).on('click', '.calendar-month__item', function(e){
        e.preventDefault();
        $('.calendar-header-popup').removeClass('is-visible');
    });



    /*слайдер на странице общих пращдников*/
    $('.holidays-slide').owlCarousel({
        items:1,
        loop:false,
        center:true,
        nav:false,
        // margin:10,
        URLhashListener:true,
        autoplayHoverPause:true,
        startPosition: 'URLHash'
    });




    $(document).on('click', '.c-card-catalog__footer.v2 .c-card-catalog__basket', function(){
        $(this).hide();
        $(this).siblings('.c-card-catalog__count').show();
    });



    if($('div').hasClass('js-readmore')){
        $('.cake-order-composition').readmore({
            speed: 75,
            moreLink: '<a href="#">Подробный состав</a>',
            lessLink: '<a href="#">Свернуть состав</a>'
        });
    }




    // if($('div').hasClass('js-slick')){
    //     $('.pie-slider-for').slick({
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //         arrows: false,
    //         fade: true,
    //         asNavFor: '.pie-slider-nav'
    //     });
    //
    //     $('.pie-slider-nav').slick({
    //         slidesToShow: 3,
    //         slidesToScroll: 1,
    //         speed: 500,
    //         asNavFor: '.pie-slider-for',
    //         // dots: true,
    //         // centerMode: true,
    //         focusOnSelect: true,
    //         slide: 'div'
    //     });
    // }

    $(document).on('click', '.pie-slider-nav__item', function(){
        var self = $(this);
        var path = self.children('img').attr('src');

        $('.pie-slider-for').find('img').attr('src', path).animate({
            opacity: '1'
        },200);
    });




    /*START карусель*/
    //Обработка клика на стрелку вправо
    $(document).on('click', ".popup-pie .pie-slider-right",function(){
        var carusel = $(this).parents('.pie-slider');
        right_carusel(carusel);
        var path = $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(1).children('img').attr('src');
        console.log(path);

        $('.pie-slider-for').find('img').animate({'opacity': 0}, 100);
        setTimeout(function(){
            $('.pie-slider-for').find('img').attr('src', path);
            $('.pie-slider-for').find('img').animate({'opacity': 1}, 100);;
        },100);

        return false;
    });

    //Обработка клика на стрелку влево
    $(document).on('click',".popup-pie .pie-slider-left",function(){
        var carusel = $(this).parents('.pie-slider');
        left_carusel(carusel);
        var path = $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(0).children('img').attr('src');

        $('.pie-slider-for').find('img').animate({'opacity': 0}, 100);
        setTimeout(function(){
            $('.pie-slider-for').find('img').attr('src', path);
            $('.pie-slider-for').find('img').animate({'opacity': 1}, 100);;
        },100);

        return false;
    });

    function left_carusel(carusel){
        var block_width = $(carusel).find('.pie-slider-nav__item').outerWidth();
        $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(-1).clone().prependTo($(carusel).find(".pie-slider-items"));
        $(carusel).find(".pie-slider-items").css({"left":"-"+block_width+"px"});
        $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(-1).remove();
        $(carusel).find(".pie-slider-items").animate({left: "0px"}, 500);

    }

    function right_carusel(carusel){
        var block_width = $(carusel).find('.pie-slider-nav__item').outerWidth();
        $(carusel).find(".pie-slider-items").animate({left: "-"+ block_width +"px"}, 500, function(){
            $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(0).clone().appendTo($(carusel).find(".pie-slider-items"));
            $(carusel).find(".pie-slider-items .pie-slider-nav__item").eq(0).remove();
            $(carusel).find(".pie-slider-items").css({"left":"0px"});
        });
    }



    /*START карусель*/
    //Обработка клика на стрелку вправо
    $(".pie-filling-right").on('click',function(e){
        e.preventDefault();
        var carusel = $(this).parents('.pie-filling');
        filling_right_carusel(carusel);
        console.log('право');

        // console.log('filling_left_carusel : ' + filling_left_carusel(carusel));
        // console.log('filling_right_carusel : ' + filling_right_carusel(carusel));

    });

    //Обработка клика на стрелку влево
    $('.pie-filling-left').on('click', function(e){
        e.preventDefault();
        var carusel = $(this).parents('.pie-filling');
        filling_left_carusel(carusel);
        console.log('лево');

    });
    // var block_width = $('.pie-filling').find('.pie-filling__item').outerWidth();
    var filling_block_width = $('.pie-filling-wrapper').width();
    $('.pie-filling__item').css({
        'width': filling_block_width - 9
    });

    $(window).resize(function(){
        var filling_block_width = $('.pie-filling-wrapper').width();
        var w = $(window).width();
        if(w < 627){
            $('.pie-filling__item').css({
                'width': filling_block_width - 9
            });
        }else{

        }

    });




    function filling_right_carusel(carusel){
        // var block_width = $(carusel).find('.pie-filling__item').outerWidth();
        $(carusel).find(".pie-filling__items").animate({left: "-"+ filling_block_width +"px"}, 200);
        setTimeout(function () {
            $(carusel).find(".pie-filling__items .pie-filling__item").eq(0).clone().appendTo($(carusel).find(".pie-filling__items"));
            $(carusel).find(".pie-filling__items .pie-filling__item").eq(0).remove();
            $(carusel).find(".pie-filling__items").css({"left":"0px"});
        }, 300);
    }


    function filling_left_carusel(carusel){

        $(carusel).find(".pie-filling__items .pie-filling__item").eq(-1).clone().prependTo($(carusel).find(".pie-filling__items"));
        $(carusel).find(".pie-filling__items").css({"left":"-"+filling_block_width+"px"});
        // $(carusel).find(".pie-filling__items").animate({"left":"-"+filling_block_width+"px"}, 1000);
        $(carusel).find(".pie-filling__items").animate({left: "0px"}, 300);
        $(carusel).find(".pie-filling__items .pie-filling__item").eq(-1).remove();

    }






//аналогичная карусель для начинок



//     $(function() {
// //Раскомментируйте строку ниже, чтобы включить автоматическую прокрутку карусели
// //	auto_right('.carousel:first');
//     })
//
// // Автоматическая прокрутка
//     function auto_right(carusel){
//         setInterval(function(){
//             if (!$(carusel).is('.hover'))
//                 right_carusel(carusel);
//         }, 1000)
//     }

// Навели курсор на карусель
//     $(document).on('mouseenter', '.pie-slider', function(){$(this).addClass('hover')})
//Убрали курсор с карусели
//     $(document).on('mouseleave', '.pie-slider', function(){$(this).removeClass('hover')})

    /*END карусель*/




    /*загрузка файлов на странице с кондитерскими изделиями*/
    $("#pie-form-download__file").on('change', function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
    function imageIsLoaded(e) {
        $('#pie-form-download__img').attr('src', e.target.result).show();
    };


    /*resize img c-card-catalog-2__img*/
    $('.c-card-catalog-2__img').each(function(i, val){

        var pieImgContainerWidth = $(val).width();
        var pieImgWidth = $(val).children('img').width();


        if(pieImgWidth < pieImgContainerWidth){
            $(val).children('img').css({
                'width': '100%',
                'height': 'auto'

            });
        }
    });




    /*кнопка раскрытия информации в карточке c-card-slide*/
    $(document).on('click', '.c-card-slide__dropdown', function(e){
        e.preventDefault();
        var self = $(this);
        self.toggleClass('active');
        self.parents('.c-card-slide__info').toggleClass('show');
    })


    function addReadonlyInput(elem){
        $(elem).attr('readonly', 'readonly');
    }

    addReadonlyInput('.datepicker-here');
    addReadonlyInput('.datepicker-custom');
    addReadonlyInput('#minMaxExample');
    addReadonlyInput('.datepicker-delivery-v2');
    addReadonlyInput('#event-datepicker');
    addReadonlyInput('.js-event-order-datepicker');
    addReadonlyInput('#party-datepicker');
    addReadonlyInput('.datepicker-layout input');
    addReadonlyInput('.datepicker-layout-v2 input');

    /*хлебные крошки - выпадающий список*/
    $(document).on('click', '.c-breadcrumb-word__active span', function(e){
        e.preventDefault();
        $(this).parent('.dropdown').toggleClass('open');
        $(this).siblings('.c-breadcrumb-dropdown__layout').toggleClass('is-visible');
    })


    function initCustomSelect(elem){
        $(elem).SumoSelect();

    }

    function initCustomSelectSearch(elem){
        $(elem).SumoSelect({
            search: true,
            searchText: 'Искать...'
        });
    }

    function initCustomDatepicker(elem){
       $(elem).datepicker({
            minDate: new Date()
            // autoClose: true

        });

       // var value = $(elem).val();
       // $(elem).val(value);
       // console.log(value);
       // elem.val(value);
    }


    function reloadValueDatepicker (elem){
        $.each($(elem), function(){
            // var value = $(this).val();
            // $(this).data('value', value);
            var dataValue = $(this).data('value');
            $(this).val(dataValue);
            // console.log(value);
            console.log($(this).val());
        });
    }



    // reloadValueDatepicker('#js-event-data__list .datepicker-custom-clock');



    var countCheckbox = 0;

    function addClonePanel(btn, list){
        var rand;
        function randomInteger(min, max) {
            rand = min - 0.5 + Math.random() * (max - min + 1);
            rand = Math.round(rand);
            return rand;
        }

        initCustomSelectSearch('#js-event-data__list .js-select-search-copy');
        initCustomSelect('#js-event-data__list .panel-event-date__item select');



        $(document).on('click', btn , function(e) {
            e.preventDefault();
            $(this)
                .parents('.c-form__item')
                .siblings('.panel-work-time__copy')
                .clone().appendTo(list);

            // var select = $(this)

            initCustomSelectSearch('#js-event-data__list .js-select-search-copy');
            initCustomSelectSearch('#js-dish-variation__list .js-select-search-copy');

            initCustomDatepicker('#js-event-data__list .panel-work-time__copy:last-child .datepicker-custom-clock');

            // reloadValueDatepicker('#js-event-data__list .datepicker-custom-clock');

            initCustomSelect('' + list + ' select');
            initCustomSelect('#js-dish-variation__list .panel-dish-variation__item:last-child select');
            initCustomSelect('#js-event-data__list .panel-event-date__item:last-child select');
            // console.log('initCustomSelectSearch');
            $('.js-input--tel').mask('0(000)000-00-00', {clearIfNotMatch: true});
            $('.js-input--date').mask('00.00.0000', {clearIfNotMatch: true});
            $('.js-input--mode').mask('00:00 — 00:00', {
                clearIfNotMatch: true,
                placeholder: "__:__ — __:__"
            });

            randomInteger(1, 99999);


            countCheckbox +=1;
            // console.log(count);



            var checkbox = $(this)
                .parents('.c-form__item')
                .siblings('.panel-work-time__copy').find('input[type="checkbox"]');
            var checkLabel = $(this)
                .parents('.c-form__item')
                .siblings('.panel-work-time__copy').find('input[type="checkbox"]').siblings('label');

            // checkbox.attr('name', );

            checkbox.attr('name', 'panel-event-free-' + rand);
            checkbox.attr('id', 'panel-event-free-' + rand);
            checkLabel.attr('for', 'panel-event-free-' + rand);
            // console.log(checkLabel);


        });
    }



    addClonePanel('#js-work-time-coffee__add', '#js-panel-work-time__coffee');
    addClonePanel('#js-work-time-cafe__add', '#js-panel-work-time__cafe');
    addClonePanel('#js-work-time-mp__add', '#js-panel-work-time__mp');
    addClonePanel('#js-work-time-animator__add', '#js-panel-work-time__animator');
    addClonePanel('#js-dish-variation__add', '#js-dish-variation__list');
    addClonePanel('#js-event-data__add', '#js-event-data__list');

    $(document).on('click', '.c-form__del', function(e) {
        e.preventDefault();
        var $elem_item = $(this).parents('.panel-work-time__copy');
        $elem_item.remove();
    });

    $(document).on('click', '.testReload', function(e) {
        e.preventDefault();
    //    panel-dish-variation__list
    //     $('.panel-dish-variation__list select').each(function(index){
    //         $(this)[index].sumo.reload();
    //         console.log(index);
    //     });
        $('.panel-dish-variation__list select')[1].sumo.reload();
        console.log('OK!!!');


    });


    //административная панель
    $(document).on('click', '.panel-cafe__title', function(e){
        e.preventDefault();
        $(this).toggleClass('panel-cafe-show');
        $(this).siblings('.panel-cafe__body').slideToggle(100);
    });

    $(document).on('click', '.panel-cafe__title', function(e){
        e.preventDefault();
        $(this).toggleClass('panel-cafe-show');
        $(this).siblings('.panel-hall__body').slideToggle(100);
    });



    //управление рассылкой
    $('.dispatch-list__title input').on('change', function(){
        var self = $(this);
        if(self.is( ":checked" )){
            self.parents('.dispatch-list__title')
                .siblings('.dispatch-list')
                .find('input[type="checkbox"]')
                .prop( "checked", true );
        }else {
            self.parents('.dispatch-list__title')
                .siblings('.dispatch-list')
                .find('input[type="checkbox"]')
                .prop( "checked", false );
        }
    });

    var lenEvent = $('.dispatch-list__item input[name*="dispatch-event"]').length;
    // console.log('колдичество ' + lenEvent);



    function changeDispatchCheckbox(elem){
        var count;

        $('' + elem + ' input').each(function(index){
            count = index+1;
        });
        // console.log('количество each ' + elem + ': ' + count);

        $('' + elem + ' input').on('change', function(){
            var self = $(this);
            if(!self.is( ":checked" )){
                self.parents('.dispatch-list')
                    .siblings('.dispatch-list__title')
                    .find('input[type="checkbox"]')
                    .prop( "checked", false );
            }

            if($('' + elem + ' input[type=checkbox]:checked').length == count){
                self.parents('.dispatch-list')
                    .siblings('.dispatch-list__title')
                    .find('input[type="checkbox"]')
                    .prop( "checked", true );
            }
        });
    }

    changeDispatchCheckbox('.js-dispatch-news');
    changeDispatchCheckbox('.js-dispatch-event');




    //франшиза
    $('.franchise-title').on('click', function(){
        var self = $(this);
        self.parents('.franchise-title-layout').siblings('.franchise-content').slideToggle(100);
        self.siblings('.franchise-print').toggle();
    });


    var divToPrint = document.getElementById("franchisePrint");
    function printData(){
        // var divToPrint = $(elem).parents('.franchise-content');

        var newWin= window.open("");
        newWin.document.write(divToPrint.outerHTML);
        newWin.print();
        newWin.close();
    }

    function PrintElem(elem)
    {
        var mywindow = window.open('', 'PRINT', 'height=400,width=600');

        mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write('<h1>' + document.title  + '</h1>');
        mywindow.document.write(document.getElementById(elem).innerHTML);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        mywindow.close();

        return true;
    }

    $('.franchise-print').on('click',function(){
        // printData();
        var self = $(this);
        // $('*').hide();
        $('.franchise-box').removeClass('print');
        self.parents('.franchise-box').addClass('print');
        window.print();
        // PrintElem(divToPrint);
    });



    if($('input').hasClass('datepicker-custom') || $('div').hasClass('datepicker-custom')){
        $('.datepicker-custom').datepicker({
            minDate: new Date(),
            autoClose: true
        });
    }

    if($('input').hasClass('datepicker-custom-clock') || $('div').hasClass('datepicker-custom-clock')){
        $('.datepicker-custom-clock').datepicker({
            minDate: new Date(),
            // onSelect: function(formattedDate){
            //     $(this).val(formattedDate);
            //     var datePick = formattedDate;
            //     $(this).data('value', datePick);
            //     console.log('Выводит data-value: ' + $(this).data('value'));
            // }
        });
    }


    /*функция форматирования даты*/
    function formatDate(date) {
        var dd = date.getDate();
        if (dd < 10) dd = '0' + dd;

        var mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        var yy = date.getFullYear();
        if (yy < 10) yy = '0' + yy;

        return dd + '.' + mm + '.' + yy;
    }

    if($('input').hasClass('datepicker-delivery-v2') || $('div').hasClass('datepicker-delivery-v2')){


        var datepickerDelivery = new Date(),
            datepickerDeliveryV2= $('.datepicker-delivery-v2');
        // datepickerDeliveryV2.val(formatDate(datepickerDelivery));
        datepickerDeliveryV2.datepicker({
            minDate: new Date(),
            autoClose: true
        });




    }


    

    $('document').on('click', '.order__btn.disabled', function(e){
        e.preventDefault();
    });

    $('.excursion-pay__item label').on('click', function(){
        $(this).parents('.excursion-pay__item').siblings().find('label').removeClass('active');
        $(this).addClass('active');
    });



    //модальное окно в экскурсиях
    $(document).on('change', '#excursion-pay-score', function(){
        if($(this).prop( "checked" )){
            $('.excursion-pay-score').slideDown(300);
        }
    });

    $(document).on('change', '#excursion-pay-card', function(){
        if($(this).prop( "checked" )){
            $('.excursion-pay-score').slideUp(300);
        }
    });


    /*изменение оплаты*/
    $('.order-pay__item').on('click', function(){
        var payRadio = $(this).children('input');
        if(payRadio.prop("checked")){
            $(this).siblings('.order-pay__item').find('label').removeClass('active');
            $(this).children('label').addClass('active');
        }
    });



    $(document).on('click', '.filter-hold__dropdown', function(e){
        e.preventDefault();
        $(this).parents('.filter-hold__item').siblings().removeClass('active');
        $(this).parents('.filter-hold__item').addClass('active');
        $(this).siblings('.filter-hold__submenu').slideDown(500);
    });



    // documentHeight
    function changeHeightBasketPopup (){
        var basketScroll = $('.popup-basket__scroll'),
            heightBasket = basketScroll.height();

        if (heightBasket >= documentHeight - 100){
            basketScroll.addClass('fixed-height-basket');
            // console.log('if ' + heightBasket);
            /*кастомный скролл*/
            basketScroll.jScrollPane();
        }else {
            basketScroll.removeClass('fixed-height-basket');
            // console.log('else ' + heightBasket);
        }
    }

    changeHeightBasketPopup();

    $(window).resize(function(){
        changeHeightBasketPopup();
    });
    /*картинки одной ширины*/

    $('.c-card-catalog__img').each(function(index, elem){
        var img = $(elem).children('img'),
            imgWidth = img.width(),
            $this = $(elem);

        // console.log('element ' + index + ': ' + 'width: ' + imgWidth);
        if(imgWidth < 390 ) {
            $this.addClass('big-product-img');
            // console.log('есть картинка меньше 390');
        }else {
            $this.removeClass('big-product-img');
            // console.log('работает но картинки нет');
        }
    });


    //показать все мероприятия по дням на странице Мероприятия
    $(document).on('click', '.c-card-event-timelist__more', function(e){
        e.preventDefault();
        var $this = $(this);

        var textBtn = $this.html();
        if(textBtn == "показать все"){
            $this.html("скрыть");
            $this.siblings('.c-card-event-timelist').addClass('show-item-all');
        }else{
            $this.html("показать все");
            $this.siblings('.c-card-event-timelist').removeClass('show-item-all');
        }
    });


    function changePartyTitlePopup (){
        $(document).on('click', '.js-party-order', function(){
            var letter = $(this).data('name'),
                title = $('.popup-party-order .popup-title').find('span');

            title.text('');
            title.append(letter);
            $('#title-party-order').val(letter);
        });
    }
    // changePartyTitlePopup();



    //появление мобильного чека в корзине
    $(document).on('click', '.basket__check-mobile', function(e){
        e.preventDefault();
        $('.basket__aside').toggleClass('active');
    });

    //изменение в оформлении заказа на другого пользователя
    $(document).on('change', '#order-user_other, .order-user_other',  function(){
        if($(this).prop( "checked" )){
            $('.order-user__list').css('display','none');
            $('.order-user__other-form').css('display','flex');
        }
    });
    $(document).on('change', '#order-user_auth, #order-user_auth-1', function(){
        if($(this).prop( "checked" )){
            $('.order-user__list').css('display','flex');
            $('.order-user__other-form').css('display','none');
        }
    });

    //редактировать профиль
    $(document).on('click', '.lk-profile__link-edit', function(e){
        e.preventDefault();
        $(this).parents('.lk-profile__item')
            .children('div:first-child')
            .hide();
        $(this).parents('.lk-profile__item')
            .children('.lk-profile-edit:eq(0)')
            .show();

        initProfilePlugin();

    });

    function initProfilePlugin(){
        //маска
        $('.js-input--tel').mask('0(000)000-00-00', {clearIfNotMatch: true});
        $('.js-input--date').mask('00.00.0000', {clearIfNotMatch: true});

        /*селект*/
        $('.lk-profile-edit__child-list .js-select--child').SumoSelect();
        changeSelectFace('.lk-profile-edit__child-list .js-select--child', 'M','icon-boy-smiling','icon-girl-smiling');
    };

    // $(document).on('click', '.lk-profile__edit .c-button__medium', function(){
    //     $(this).parents('.lk-profile-edit').hide;
    //     $(this).parents('.lk-profile-item').children('div:first-child').show();
    // });

    /*слайдер для страницы Выпускные*/
    $('.graduation-party-banner__slider').owlCarousel({
        loop:true,
        items: 1,
        autoheight: true,
        nav: false
    });


    //плавный якорь
    function scrollToAnchor (elem) {
        $(document).on("click", elem, function (event) {
            // event.preventDefault();
            var id  = $(this).attr('href'),
                menuHeight = 0,
                top = $(id).offset().top,
                topIndent = top - menuHeight;
            // console.log('top: ' + top);
            // console.log('topIndent: ' + topIndent);
            $('html').animate({scrollTop: topIndent}, 1000);
        });
    };

    $('.graduation-party-banner__btn').click(function(e){
        e.preventDefault();
        var target = $($(this).attr('href'));
        if(target.length){

            var heightHeader = $('.header').height();
            var scrollTo = target.offset().top - (+heightHeader + 100);
            $('body, html').animate({scrollTop: scrollTo+'px'}, 800);
        }
    });

    // $('#excursion-program-btn').click(function(e){
    //     e.preventDefault();
    //     var target = $($(this).attr('href'));
    //     if(target.length){
    //
    //         var heightHeader = $('.header').height();
    //         var scrollTo = target.offset().top - (+heightHeader + 100);
    //         $('body, html').animate({scrollTop: scrollTo+'px'}, 800);
    //     }
    // });

    // scrollToAnchor('.graduation-party-banner__btn');


    //поиск по кафе на странице с тортами и в оформлении заказа
    $(document).on('keyup change', '.c-search-page__input', function(){
        checkAll('.order-delivery-address__list li', '.order-radio', '.c-search-page__input');
        checkAll('#js-box-search-additive .c-box-search__item', '.c-checkbox', '#js-box-search-additive .c-search-page__input');
        checkAll('#js-box-search-ingredient .c-box-search__item', '.c-checkbox', '#js-box-search-ingredient .c-search-page__input');
        checkAll('#js-box-search-event .c-box-search__item', ' .order-radio', '#js-box-search-event .c-search-page__input');
    });

    function checkAll(elem, whereSearch, input) {
        $(elem).each(function(i, item) {
            var value = $(this).find(whereSearch).text().toLowerCase().indexOf($(input).val().toLowerCase());
            if ( value >= 0 ) {
                $(this).show();
                // $(this).addClass('js-order-delivery-address__show');
            } else {
                $(this).hide();
                // $(this).removeClass('js-order-delivery-address__show');
            }
        });
    }

    checkAll('.order-delivery-address__list li', '.order-radio', '.c-search-page__input');
    checkAll('#js-box-search-additive .c-box-search__item', '.c-checkbox', '#js-box-search-additive .c-search-page__input');
    checkAll('#js-box-search-ingredient .c-box-search__item', ' .c-checkbox', '#js-box-search-ingredient .c-search-page__input');
    checkAll('#js-box-search-event .c-box-search__item', ' .order-radio', '#js-box-search-event .c-search-page__input');

    $(document).on('click', '.c-box-search__clear', function(e){
        e.preventDefault();
        $('.c-search-page__input').val('');
        $('.c-box-search__item').show();

    });

    //отписаться от подписки в личном кабинете
    $(document).on('click', '#lk-profile-subscription_unsubscribe', function(e){
        e.preventDefault();
        $('.lk-profile .lk-profile-subscription__box').hide();
        $('.lk-profile .lk-profile-subscription-del').show();

    });
    $(document).on('click', '#lk-profile-subscription-del__cancel', function(e){
        e.preventDefault();
        $('.lk-profile .lk-profile-subscription-del').hide();
        $('.lk-profile .lk-profile-subscription__box').show();
    });

    //изменнеие пароля в профиле личного кабинета
    $(document).on('click', '#lk-profile__change-pass', function(e){
        e.preventDefault();
        $(this)
        .parents('.lk-profile-user')
        .css('display', 'none')
        .siblings('.lk-profile-edit__pass')
        .css('display', 'block');
    });

    // изменение подписки в профиле пользователя
    $('#lk-profile_change-subscription').on('click', function(e){
        e.preventDefault();
        $(this)
        .parents('.lk-profile-subscription__box')
        .css('display', 'none')
        .siblings('.lk-profile-edit')
        .css('display', 'block');
    });
    // отмена изменения подписки в профиле пользователя
    $('#lk-profile_cancel-change').on('click', function(e){
        e.preventDefault();
        $(this)
        .parents('.lk-profile-edit')
        .css('display', 'none')
        .siblings('.lk-profile-subscription__box')
        .css('display', 'block');
    });

    //добавляем элементы в профиле личного кабинета
    //добавление второго email

    $(document).on('click', '#js-lk-profile__add-email', function(e) {
        e.preventDefault();
        $(this)
            .parents('.c-form__item')
            .siblings('.lk-profile-edit__copy')
            .clone().appendTo(".lk-profile-edit__email-list");
    });

    $(document).on('click', '#js-lk-profile__add-tel', function(e) {
        e.preventDefault();
        $(this)
            .parents('.c-form__item')
            .siblings('.lk-profile-edit__copy')
            .clone().appendTo(".lk-profile-edit__tel-list");
        $('.js-input--tel').mask('0(000)000-00-00', {clearIfNotMatch: true});
    });

    /*добавление полей в контактах ЛК*/
    $(document).on('click', '#js-lk-profile__add-info-all', function(e) {
        e.preventDefault();
        console.log('correct');
        $(this)
            .parents('.lk-profile-edit__line')
            .siblings('.lk-profile-edit__copy')
            .clone().appendTo(".lk-profile-edit__contact-list");
        // $('.js-input--date').mask('0(000)000-00-00', {clearIfNotMatch: true});

        // initProfilePlugin();
    });

    /*добавление ребенка в профиле пользователя*/
    $(document).on('click', '#js-lk-profile__add-child', function(e) {
        e.preventDefault();
        $(this)
            .parents('.lk-profile-edit__line')
            .siblings('.lk-profile-edit__copy')
            .clone().appendTo(".lk-profile-edit__child-list");
        $('.js-input--date').mask('00.00.0000', {clearIfNotMatch: true});

        initProfilePlugin();
    });


    $(document).on('click', '#js-lk-profile-edit__address', function(e) {
        e.preventDefault();
        $(this)
            .parents('.lk-profile-edit__line')
            .siblings('.lk-profile-edit__copy')
            .clone().appendTo(".lk-profile-edit__address-list");
    });


    $(document).on('click', '.c-form__del', function(e) {
        e.preventDefault();
        var $elem_item = $(this).parents('.c-form__item');
        var $element =  $(this).parents('.lk-profile-edit__copy');
        $element.remove();
        $elem_item.remove();
    });

    //скрыть/показать заказ в истории заказов
    $('.lk-history-item__header').on('click', function(e){
        e.preventDefault();
        $(this).parents('.lk-history-item').toggleClass('lk-history-item__body-show');
        $(this).siblings('.lk-history-item__body').slideToggle(300);
    });


    //очистить форму поиска
    $(document).on('click', '.order-delivery-search__clear', function(e){
        e.preventDefault();
        $(this).parents('.order-delivery-search__item').siblings().find('input').val('');
        $('.order-delivery-address__all').removeClass('show-item-all');

        // showDeliveryAddressCake('.order-delivery-address__item');
    });

    //показать все адреса кафе в заказе
    function showDeliveryAddressCake (elem){
        $(elem).each(function(i, elem){
            i < 6 ? $(elem).show() : $(elem).hide();
        });
    }
    // showDeliveryAddressCake('.order-delivery-address__item');




    $(document).on('click', '.order-delivery-address__all', function(e){
        var $this = $('.order-delivery-address__all');
        e.preventDefault();

        var textBtn = $this.html();
        if(textBtn == "показать все"){
            $this.html("скрыть");
            $this.siblings('.order-delivery-address__list').addClass('show-item-all');
        }else{
            $this.html("показать все");
            $this.siblings('.order-delivery-address__list').removeClass('show-item-all');
        }

    });

    //страница Оформление заказа. При фокусе на инпут с адресом, делаем активный radio button
    $('.order-delivery-custom__item input, .order-delivery-custom__item textarea').focus(function(){
        var $this = $(this);
        // var $thisRadioInput = $(this).parents('label').siblings('input[type="radio"]');
        $this.parents('label').siblings('input[type="radio"]').prop( "checked",true);

    });



    //свернуть/развернуть блок в корзине
    $('.basket-item__header').on('click', function(){
        var $this =  $(this);
        $this.parents('.basket-item').toggleClass('basket-body__show');
        setTimeout(function(){

        }, 150);

        $(this).siblings('.basket-item__body').slideToggle(100);
    });

    $('.basket-mix__item').on('click', function(){

        $('.basket-item__header').parents('.basket-item').addClass('basket-body__show');
        $('.basket-item__body').slideDown(100);
    });



    /*показываем попап на странице Создатели Андерсон*/
    $('.photo-point__icon').on('click', function(){
        var str = $(this).siblings('.photo-point__description').find('span').text().trim(),
            arr = str.split(' '),
            name = arr[0] + ' ' + arr[1],
            desc = '';
        arr.splice(0, 2);
        desc = arr.join(' ');
        $('.creators .popup-title').find('span').text(name);
        $('.creators .popup-body').find('p').text(desc);
        var popup = $('.creators .popup');
        popup.removeClass('is-visible');
        popup.addClass('is-visible');
    });

    $('.creators .popup-close').on('click', function(){
        $('.creators .popup').removeClass('is-visible');
    });

    /*фабрика счастья, клик по поинту*/
    $('.factory-point__img').on('click', function(){
        $('.popup').removeClass('is-visible');
        $(this).siblings('.popup').addClass('is-visible');
    });

    $('.factory-point .popup-close').on('click', function(e){
        e.preventDefault();
        $('.popup').removeClass('is-visible');
    });

    /*показываем маленький блок с выбранными товарами в карточке товара (мобильная версия)*/
    $(document).on('click', '.popup-product__check-mobile', function(e){
        e.preventDefault();
        $('.popup-product .popup-mini').addClass('active');
    });
    /*закрываем маленький попап с товарами*/
    $(document).on('click', '.popup-product__check-close', function(e){
        e.preventDefault();
        $('.popup-product .popup-mini').removeClass('active');
    });

    $('.popup-mini').on('click', function(e){
        e.preventDefault();

    });

    /*показываем категории меню в каталоге*/
    var filterBage = $('.filter-bage');

    filterBage.on('click', function(e){
        e.preventDefault();
        $(this).hide();
        $('.catalog-body').toggleClass('show-category');
        $(this).toggleClass('js-hide-word');
        $(this).find('.filter-bage__title span').html('Показать');
        $('.js-hide-word').find('.filter-bage__title span').html('Скрыть');
    });

    $('.filter-hold__close').on('click', function(e){
        e.preventDefault();
        filterBage.show();
        $('.catalog-body').removeClass('show-category');
        filterBage.toggleClass('js-hide-word');
        $('.filter-bage__title span').html('Показать');
    });




    $(window).on('resize', function () {
    	if(windowWidth <= 730){
    	    $('.filter-hold__close').on('click', function(e){
                e.preventDefault();
    	        $(this).parents('.filter-hold').slideUp(600);
            });
        }
    });

    if(windowWidth <= 730){
        $('.filter-hold__close').on('click', function(e){
            e.preventDefault();
            $(this).parents('.filter-hold').slideUp(600);
        });
    }





    /*слайдер карусель*/
    $('.carousel-slider').owlCarousel({
        loop:true,
        // nav:true,
        margin:20,
        // items: 4,
        // center: true,
        responsiveClass: true,
        responsive:{
            0:{
                items:1
            },
            540:{
                nav: true,
                items:2
            },
            780:{
                nav: true,
                items:3
            },
            1200:{
                nav: true,
                items:4
            },
            1600:{
                nav: true,
                items:5
            }
        }
    });

    $('.c-card-product__slider').owlCarousel({
        loop:true,
        // nav:true,
        // margin:20,
        // items: 4,
        // center: true,
        responsive:{
            0:{
                items:1
            },
            600:{
                nav: true,
                items:2
            },
            1200:{
                nav: true,
                items:3
            },
            1600:{
                nav: true,
                items:3
            }
        }
    });

    /*слайдер карусель*/
    $('.publications-slider').owlCarousel({
        loop:true,
        nav:true,
        margin:20,
        items: 7,
        // center: true,
        stagePadding: 10,
        responsiveClass: true,
        responsive:{
            0:{
                items:1
            },
            480:{
                items:2
            },
            780:{
                nav: true,
                items:3
            },
            980:{
                nav: true,
                items:4
            },
            1200:{
                nav: true,
                items:4
            },
            1600:{
                nav: true,
                items:7
            },
            1920:{
                nav: true,
                items:7
            }
        }
    });


    $('#filter-cafe-all, #filter-cafe__mobile-all').on('change', function(){
        var $this = $(this),
            $elem = $('.filter-item');
        if($this.is(':checked')) {
            $elem.addClass('disable');
        }else{
            $elem.removeClass('disable');
        }
    });

    $('.top-message__close').on('click',function(e){
        e.preventDefault();
        $('.top-message').hide();
    });

    /*вписываем img в блок при любом размере изображения*/
    function fix_size() {
        var images = $('.c-pic_link img');
        images.each(setsize);

        function setsize() {
            var img = $(this),
                img_dom = img.get(0),
                container = img.parents('.c-pic_link');
            if (img_dom.complete) {
                resize();
            } else img.one('load', resize);

            function resize() {
                if ((container.width() / container.height()) < (img_dom.width / img_dom.height)) {
                    img.width('auto');
                    img.height('100%');
                    return;
                }
                img.height('auto');
                img.width('100%');
            }
        }

    }
    // $(window).on('resize', fix_size);
    // fix_size();
    //
    // if (typeof _current != 'undefined') {
    //     var mapImages = _current;
    // } else {
    //     var mapImages = $('.c-card-cafe__img img');
    // }

    /*если в городе одно кафе, делаем его inline*/
    $('.cafe-list__city').each(function(){
        var $this = $(this);
        var countElem = $this.find('.c-col-6').length;
        if(countElem == 1){
            $($this).addClass('cafe-list__one');

        }else{
            $($this).removeClass('cafe-list__one');
        }
    });



    //подключение тултипа
    $( '.tooltip' ).tooltipster({
        animation: 'grow',
        delay: 100,
        trigger : 'custom' ,
        maxWidth: 500,
        contentAsHTML: true,
        interactive: true,
        triggerOpen : {
            mouseenter : true ,
            touchstart : true
        },
        triggerClose : {
            mouseleave : true,
            click : true ,
            scroll : true ,
            tap : true
        }
    });


    //подключение тултипа
    $( '.tooltip-catalog' ).tooltipster({
        animation: 'grow',
        delay: 100,
        trigger : 'click' ,
        maxWidth: 500,
        functionBefore: function(instance, helper){
            if (helper.event.type == 'click') {
                instance.content('You opened me with a regular mouse <a href="https://www.google.ru/?hl=ru">click :)</a>.');
            }
            else {
                instance.content('You opened me by a tap on the screen :)');
            }
        },
        contentAsHTML: true,
        interactive: true,
        triggerOpen : {
            mouseenter : true ,
            touchstart : true
        },
        triggerClose : {
            mouseleave : true,
            click : true ,
            scroll : true ,
            tap : true
        }
    });



    $(".owl-carousel").owlCarousel({
        items: 1,
        loop: true,
        center: true,
        autoHeight:true,
        nav: true
    });


    $('.cafe-fotorama').on('fotorama:ready', function (e, fotorama) {
        // console.log(e.type);
        // console.log( fotorama.activeIndex);
        var path = fotorama.activeFrame.img;
        $('.bg-blur').attr('src', path);
    }).fotorama({
        width: '100%',
        // maxwidth: '100%',
        ratio: 17/11,
        loop: true,
        thumbwidth: 88,
        allowfullscreen: true,
        nav: 'thumbs',
        fit:'cover'
    });;

    /*Фоторама, слайдер мероприятий, слайдер отзывов*/
    // var $slider = $('.cafe-fotorama').fotorama({
    //     width: '100%',
    //     // maxwidth: '100%',
    //     ratio: 17/11,
    //     loop: true,
    //     thumbwidth: 88,
    //     allowfullscreen: true,
    //     nav: 'thumbs',
    //     fit:'cover'
    // });

    // $slider
    //     .on('fotorama:show', function (e, fotorama) {
    //         // pick the active thumb by id
    //         var path = fotorama.activeFrame.img;
    //         $('.bg-blur').attr('src', path);
    //         console.log('hello');
    //     });




    // $slider.on('fotorama:load', function (e, fotorama, extra) {
    //     console.log(extra.src + ' is loaded');
    //     console.log('hello');
    // });


    $('.cafe-holiday-slider').fotorama({
        width: '100%',
        maxwidth: '100%',
        // ratio: 16/9,
        loop: true,
        allowfullscreen: true,
        fit:'cover'
    });

    // $('.cafe-reviews-slider').fotorama({
    //     width: '100%',
    //     height: 'auto',
    //     maxwidth: '100%',
    //     loop: true,
    //     ratio: 16/5
    // });

    /*маски для телефона*/
    $('#request-call__tel, #reg__phone').mask('0(000)000-00-00', {clearIfNotMatch: true});
    $('#request-call__tel, #reg__phone').mask('0(000)000-00-00', {clearIfNotMatch: true});
    $('.js-input--tel').mask('0(000)000-00-00', {clearIfNotMatch: true});
    $('.js-input--date').mask('00.00.0000', {clearIfNotMatch: true});
    $('.js-input--loyalty').mask('000-000', {clearIfNotMatch: true });

    $('.js-input--mode').mask('00:00 — 00:00', {
        clearIfNotMatch: true,
        placeholder: "__:__ — __:__"
    });
    $('input[name="form_text_30"]').mask('0(000)000-00-00', {clearIfNotMatch: true});
    $('input[name="form_text_52"]').mask('0(000)000-00-00', {clearIfNotMatch: true});

    /*показ номера телефона в карточке кафе*/
    $('.cafe-info__item-col .c-button').on('click', function(e){
        e.preventDefault();
        $(this).hide();
        $(this).parents('.l-button').siblings('.cafe-info__phone-number').show();
    });

    /*функция показа модального окна*/
    function showPopup(icon, popup) {
        $(document).on('click', icon, function (e) {
            var $html = $('html');
            e.preventDefault();
            $(popup).addClass('is-visible');
            $('.mfp-bg').addClass('is-visible');


            $html.addClass('lock-html');
            $('body').addClass('fixed-input');
            if(windowWidth > documentWidth){
                $html.css({
                    'margin-right':'17px'
                });
                $('.mfp-wrap').css({
                    'overflow-y':'scroll'
                });
                // console.log('Есть полоса прокрутки');
            }else {
                // console.log('Нет полосы прокрутки');
            }
        });
    }

    $(document).on('click', '.popup-close', function (e) {
        e.preventDefault();
        var $html = $('html');
        $(this).parents('.mfp-wrap').removeClass('is-visible');
        $('.mfp-bg').removeClass('is-visible');
        $html.css({
            'margin-right':'0'
        }).removeClass('lock-html');
        $('body').removeClass('fixed-input');
        $('.header.sticky').css({
            // 'right':'0'
        });
        // console.log('popup-close!!!!');
    });

    $(document).on('click', '.js-popup-close', function (e) {
        e.preventDefault();
        var $html = $('html');
        $(this).parents('.mfp-wrap').removeClass('is-visible');
        $('.mfp-bg').removeClass('is-visible');
        $html.css({
            'margin-right':'0'
        }).removeClass('lock-html');
        $('.wrapper').removeClass('fixed-input');
        $('.header.sticky').css({
            // 'right':'0'
        });
    });


    showPopup(".header-phone", '.popup__request-call');
    showPopup(".header-email", '.popup__write-to-us');
    showPopup(".js-header-cabinet", '.popup-authorization');
    showPopup(".header-city > a", '.popup-city');
    showPopup(".header-mobile__city", '.popup-city');
    showPopup(".c-card-cafe__menu", '.popup__menu');
    showPopup(".c-card-vacancy .c-button", '.popup__vacancy');
    showPopup(".c-card_menu", '.popup__menu');
    // showPopup(".c-reviews-positive", '.popup__review');
    // showPopup(".c-reviews-negative", '.popup__review');
    showPopup(".footer-reviews__icon", '.popup__review');
    // showPopup(".popup-forgot-password", '.popup__recovery-password');
    // showPopup(".catalog-product .c-card-catalog__img", '.popup-product');
    // showPopup(".catalog-product .c-card-catalog__title", '.popup-product');
    showPopup(".js-show-product-order", '.popup-product');
    showPopup(".js-show-pie-order", '.popup-pie');
    showPopup("#loadCake", '.popup-cake-order');
    showPopup(".cake-card__hover", '.popup-cake-order');
    showPopup(".js-easter-btn", '.popup-cake-order');
    showPopup("#lk-profile-subscription-del__ok", '.popup-subscription-del');
    showPopup(".js-party-order", '.popup-party-order');
    showPopup(".c-card-event__link--more", '.popup-event');
    showPopup(".c-card-event__link--basket", '.popup-event-basket');
    showPopup(".c-card-event__link--one-click", '.popup-event-one-click');
    showPopup(".excursion-btn", '.popup-excursion-order');

    showPopup(".js-show-cake-order", '.popup-cake-order');
    showPopup(".js-show-pie-order", '.popup-pie');
    showPopup(".js-show-poster", '.popup-poster');
    showPopup(".calendar-box__link", '.popup-calendar-booking');


    showPopup(".calendar-nav-hall__decor-blue", '.popup__gallery_hall_blue');
    showPopup(".calendar-nav-hall__decor-red", '.popup__gallery_hall_red');

    // $(document).on('click', '#cake-order-issue', function (e) {
    //     e.preventDefault();
    //     $(this).parents('.popup-cake-order').removeClass('is-visible');
    //     $('.popup-cake-order-congratulation').addClass('is-visible');
    // });

    $(document).on('click', '.c-card-event__btn--click', function (e) {
        e.preventDefault();
        $(this).parents('.popup-event').removeClass('is-visible');
        $('.popup-event-one-click').addClass('is-visible');
    });

    $(document).on('click', '#pie-order__one-click', function (e) {
        e.preventDefault();
        $(this).parents('.popup-pie').removeClass('is-visible');
        $('.popup-pie-one-click').addClass('is-visible');
    });

	$(document).on('click', '.factory-point .c-button', function (e) {
        e.preventDefault();
        $(this).parents('.factory-point .popup').removeClass('is-visible');
        $('.popup-gallery').addClass('is-visible');
        $('.mfp-bg').addClass('is-visible');
        $('html').css({
            'margin-right':'0'
        }).addClass('lock-html');

        if(windowWidth > documentWidth){
            $('html').css({
                'margin-right':'17px'
            });
            $('.mfp-wrap').css({
                'overflow-y':'scroll'
            });
            // console.log('Есть полоса прокрутки');
        }

    });

    $(document).on('click', '.c-card-event__btn--basket', function (e) {
        e.preventDefault();
        $(this).parents('.popup-event').removeClass('is-visible');
        $('.popup-event-basket').addClass('is-visible');
    });

    // $(document).on('click', '.popup-forgot-password', function (e) {
    //     e.preventDefault();
    //     $(this).parents('.popup-authorization').removeClass('is-visible');
    //     $('.popup__recovery-password').addClass('is-visible');
    // });


    $('.popup-authorization .popup-authorization__reg').on('click', function (e) {
        e.preventDefault();
        $(this).parents('.popup-authorization').removeClass('is-visible');
        $('.popup-reg').addClass('is-visible');
    });

    $('.popup-reg .popup-authorization__auth').on('click', function (e) {
        e.preventDefault();
        $(this).parents('.popup-reg').removeClass('is-visible');
        $('.popup-authorization').addClass('is-visible');
    });

    /*мобильные кнопки показа попапов Регистрация/Авторизация*/
    $("#mobile-reg").click(function (e) {
        e.preventDefault();
        $('.popup').removeClass('is-visible');
        $('.popup-reg').addClass('is-visible');
        $('.mfp-bg').addClass('is-visible');
        $('body').addClass('fixed-input');
        $('html').addClass('lock-html');
        $(this).parents('.header-mobile__auth').removeClass('.popup-slide__show');
    });

    $("#mobile-auth").click(function (e) {
        e.preventDefault();
        $('.popup').removeClass('is-visible');
        $('.popup-authorization').addClass('is-visible');
        $('.mfp-bg').addClass('is-visible');
        $('body').addClass('fixed-input');
        $('html').addClass('lock-html');
        $(this).parents('.header-mobile__auth').removeClass('.popup-slide__show');
    });




    /*поиск в шапке*/
    $(".header-search .icon-search, .header-search .symbol-search").click(function (e) {
        e.preventDefault();
        $('.header-search__form').toggleClass('is-visible');
        $('.header-search-result').toggleClass('is-visible');
    });

    /*показ мобильного поиска*/
    $(".header-mobile__search .icon-search, .header-mobile__search .symbol-search").click(function (e) {
        e.preventDefault();
        $('.header-mobile__search-box').show();
        $('.header-mobile__menu').hide();
        $('.header-mobile__search .icon-search, .header-mobile__search .symbol-search').hide();
        $('.icon-search-mobile').show();
        $('.header-mobile__search-input').focus();
        $('.header-mobile__auth').removeClass('popup-slide__show');
        // $('.header').addClass('header-top__hide');
    });

    /*скрываем мобильный поиск*/
    $(".icon-search-mobile").click(function (e) {
        e.preventDefault();
        $('.header-mobile__search-box').hide();
        $('.header-mobile__menu').show();
        $('.header-mobile__search .icon-search').show();
        $('.header-mobile__search .symbol-search').show();
        $(this).hide();
        // $('.header').removeClass('header-top__hide');
    });

    $(document).mouseup(function (e) { // событие клика по веб-документу
        var div = $('.header-mobile__search-box'); // тут указываем ID элемента
        if (!div.is(e.target) // если клик был не по нашему блоку
            && div.has(e.target).length === 0) { // и не по его дочерним элементам

            $('.header-mobile__menu').show();
            $('.header-mobile__search-box').hide();
            $('.header-mobile__search .icon-search').show();
            $('.header-mobile__search .icon-search-mobile').hide();
            // $('.header').removeClass('header-top__hide');
        }
    });

    // закрытие по клику все области экрана
    $(".popup-bg").click(function (e) {
        e.preventDefault();
        $('.popup').parents().removeClass('is-visible');
        // $('.fixed-overlay').removeClass('is-visible');
        $('html').removeClass('body-popup');
    });




    /*клик вне области экрана для корзины*/
    function hidePopup (element, instrumentHide){
        $(document).mouseup(function (e) { // событие клика по веб-документу
            var div = $(element); // тут указываем ID элемента
            if (!div.is(e.target) // если клик был не по нашему блоку
                && div.has(e.target).length === 0) { // и не по его дочерним элементам
                div.removeClass(instrumentHide); // скрываем его
                // $('.fixed-overlay').removeClass('is-visible');
                // $('body').removeClass('body-popup');
            }
        });
    }

    // событие клика по веб-документу
    // $(document).mouseup(function (e) {
    //
    //     var popup = $('.popup');
    //     if (!popup.is(e.target)
    //         && !popup.has(e.target).length
    //         && !$('.popup-mini').is(e.target)
    //     ) {
    //         popup.parents('.mfp-wrap').removeClass('is-visible');
    //         $('.mfp-bg').removeClass('is-visible');
    //         $('html').css({
    //             'margin-right':'0'
    //         }).removeClass('lock-html');
    //     }
    // });

    /*скрываем попапы вне зоны элемента для карточки товара*/
    $(document).mousedown(function (e) { // событие клика по веб-документу
        // var div = $('.popup');
        // тут указываем ID элемента
        // var div2 = $('.popup-mini');


        function hideOutZone(elem, elem2, elem3, elem4, elem5){
            var div = $(elem);
            var div2 = $(elem2);
            var div3 = $(elem3);
            var div4 = $(elem4);
            var div5 = $(elem5);
            if (!div.is(e.target)
                && div.has(e.target).length === 0
                && !div2.is(e.target)
                && div2.has(e.target).length === 0
                && !div3.is(e.target)
                && div3.has(e.target).length === 0
                && !div4.is(e.target)
                && div4.has(e.target).length === 0
                && !div5.is(e.target)
                && div5.has(e.target).length === 0){
                // div.removeClass(instrumentHide); // скрываем его
                // console.log('true');
                if ($('.popup-graduation').hasClass('is-visible')) {
                    $.cookie("graduation", "1", {path: '/', expires: 3});
                }

                div.parents('.mfp-wrap').removeClass('is-visible');
                div.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div.parents('html').removeClass('lock-html').css('margin-right','0');
                // div.find('.popup-close').trigger('click');

                var url = localStorage.getItem('backUrl');
                if (url !== null) {
                    window.history.pushState(null, null, url);
                    localStorage.removeItem("backUrl");
                    window.cakeCartItem = {};
                }



                div2.parents('.mfp-wrap').removeClass('is-visible');
                div2.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div2.parents('html').removeClass('lock-html').css('margin-right','0');

                div3.parents('.mfp-wrap').removeClass('is-visible');
                div3.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div3.parents('html').removeClass('lock-html').css('margin-right','0');

                div4.parents('.mfp-wrap').removeClass('is-visible');
                div4.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div4.parents('html').removeClass('lock-html').css('margin-right','0');

                div5.parents('.mfp-wrap').removeClass('is-visible');
                div5.parents('html').find('.mfp-bg ').removeClass('is-visible');
                div5.parents('html').removeClass('lock-html').css('margin-right','0');
            }

        }



        // if (localStorage.getItem('backUrl') !== null) {
        //     var serialObj = JSON.stringify(backUrl);
        //     window.history.pushState(null, null, '/easter/');
        //     localStorage.setItem('backUrl', serialObj);
        //
        //     localStorage.removeItem("backUrl");
        // } else {
        //     return false;
        // }




        if (e.which === 1) {
            hideOutZone('.popup', '.popup-mini', '.datepicker', '.main-user-consent-request-popup', '.fancybox-container');
        }

    });


    hidePopup('.popup-basket', 'popup-slide__show');
    hidePopup('.header-mobile__auth', 'popup-slide__show');
    hidePopup('.header-search__form', 'is-visible');
    hidePopup('.header-search-result', 'is-visible');
    hidePopup('.c-breadcrumb-dropdown__layout', 'is-visible');
    hidePopup('.c-breadcrumb-word__active', 'open');


    /*юоковые кнопки отзыва*/
    var $reviews_btn = $(".c-reviews__btn"),
        clickCount;
    $reviews_btn.attr("data-count", "0");
    var isMobile = {
        Android:        function() { return navigator.userAgent.match(/Android/i) ? true : false; },
        BlackBerry:     function() { return navigator.userAgent.match(/BlackBerry/i) ? true : false; },
        iOS:            function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false; },
        Windows:        function() { return navigator.userAgent.match(/IEMobile/i) ? true : false; },
        any:            function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());  }
    };
    if ( isMobile.any() ) {
        $reviews_btn.on("click", function(){
            clickCount = $(this).attr("data-count");
            clickCount ++;
            $(this).parent('.c-reviews__item').siblings().removeClass('active');
            if (clickCount == 1) {
                $(this).attr("data-count", clickCount);
                $(this).parent('.c-reviews__item').addClass('active');
                return false;
            } else if (clickCount == 2){
                $(this).parent('.c-reviews__item').removeClass('active');
                $(this).attr("data-count", "0");
                showPopup(".c-reviews-positive", '.popup__review');
                showPopup(".c-reviews-negative", '.popup__review');
            }else {
                return true;
            }
        });
    }

    if ( !isMobile.any() ) {
        $reviews_btn.hover(function(){
            clickCount = $(this).attr("data-count");
            clickCount ++;
            $(this).parent('.c-reviews__item').siblings().removeClass('active');
            if (clickCount == 1) {
                $(this).attr("data-count", clickCount);
                $(this).parent('.c-reviews__item').addClass('active');
                return false;
            } else if (clickCount == 2){
                showPopup(".c-reviews-positive", '.popup__review');
                showPopup(".c-reviews-negative", '.popup__review');
                $(this).parent('.c-reviews__item').removeClass('active');
                $(this).attr("data-count", "0");
            }else {
                return true;
            }
        });
    }


    // мобильный заказать звонок, показываем форму и удаляем надпись
    $(".mobile-request-call_inquiry").click(function (e) {
        e.preventDefault();
        $(this).css({
            'opacity': '0',
            'visibility': 'hidden',
            'display':'none'
        });
        $('.mobile-request-call__form').css({
            'opacity': '1',
            'visibility': 'visible',
            'display':'block'
        });
    });

    /*соглашение на обработку персональных данных*/
    function DisabledFormButton(form, check, btn_form){
        $("form input[type='checkbox']").on('change', function(){
            if($(check).prop('checked')){
                $(btn_form).removeAttr('disabled');
                // console.log('check');
            }else {
                $(btn_form).attr('disabled', 'disabled');
                // console.log('check else');
            }
        });
    }

    DisabledFormButton('#popup-reg','#reg__regulations','#popup-reg button');
    DisabledFormButton('#popup__write-to-us','#write-to-us__regulations','#popup__write-to-us button');
    DisabledFormButton('#popup__request-call','#request-call__regulations','#popup__request-call button');
    DisabledFormButton('#popup__vacancy','#vacancy__regulations','#popup__vacancy button');
    DisabledFormButton('#order-auth-new','#order-auth-new__regulations','#order-auth-new button');
    DisabledFormButton('#cake-order-form','#cake-order__regulations','#cake-order-form button');
    DisabledFormButton('#excursion-form','#excursion__regulations','#excursion-form button');



    /*показываем в попапе заказать звонок список городов*/
    $(".mobile-request-call_city").on('click', function (e) {
        e.preventDefault();
        console.log('click click');
        // $('.popup-request-city').show();
        $('.popup-request-city').addClass('popup-show');
    });

    $(".popup-request-city").click(function (e) {
        e.preventDefault();
        $('.popup-request-city').removeClass('popup-show');
        // $('.popup-request-city').hide();
        $('.popup__request-call').addClass('is-visible');
        $('.mfp-bg').addClass('is-visible');
        $('html').css({
            'overflow':'hidden',
            'margin-right':'17px'
        });
    });

    /*попап корзины*/
    $('.icon-basket, .header .symbol-basket, .header .symbol-basket-2, .header-basket__count').on('click', function () {
        $('.popup-basket').addClass('popup-slide__show');
        $('.header').addClass('header-top__no-hide');
        // $('html').addClass('lock-html');
    });

    $('.popup-basket__close').on('click', function () {
        $('.popup-basket').removeClass('popup-slide__show');
        $('.header').removeClass('header-top__no-hide');
    });

    $('.popup-basket__scroll').on( 'mousewheel DOMMouseScroll', function (e) {

        var e0 = e.originalEvent;
        var delta = e0.wheelDelta || -e0.detail;

        this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
        e.preventDefault();
    });


    /*проверяет в фильтре наличие селекта и еслит есть делает родитель блочным для отображения в мобильной версии*/
    $('.filter').each(function(){
        var $filterBody =  $('.filter-item__body');
        $filterBody.has('select').css('display', 'block');
        $filterBody.has('input[type="text"]').css('display', 'block');
        $filterBody.has('select').parents('.filter-item').css('border','none');
        $filterBody.has('input[type="text"]').parents('.filter-item').css('border','none');
    });

    /*появление фильтра в мобильной версии*/

    function ShowMobileBtnFilter (btn, showBlock) {
        $(btn).on('click', function (e) {
            e.preventDefault();
            $(this).toggleClass('dropdown-show');
            $(this).siblings(showBlock).slideToggle(200);
        });
    }
    ShowMobileBtnFilter('.filter-mobile-btn', '.filter');
    ShowMobileBtnFilter('.filter-mobile-btn', '.reviews-form');
    ShowMobileBtnFilter('.filter-hold-mobile-btn', '.filter-hold');



    /*показ подменю в мобильной версии меню*/
    $('.header-mobile__list .icon-dropdown').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('dropdown-show');
        $(this).siblings('.header-mobile__sublist').slideToggle(200);
        $(this).parents('.header-mobile__item').toggleClass('active');
    });

    /*функция счета больше/меньше*/
    function catalogItemCounter(field) {
        var fieldCount = function (el) {
            var
                // Мин. значение
                min = el.data('min') || false,
                // Макс. значение
                max = el.data('max') || false,
                // Кнопка уменьшения кол-ва
                dec = el.prev('.dec'),
                // Кнопка увеличения кол-ва
                inc = el.next('.inc');
            function init(el) {
                if (!el.attr('disabled')) {
                    dec.on('click', decrement);
                    inc.on('click', increment);
                }
                // Уменьшим значение
                function decrement() {
                    var value = parseInt(el[0].value);
                    value--;

                    if (!min || value >= min) {
                        el[0].value = value;
                    }
                };
                // Увеличим значение
                function increment() {
                    var value = parseInt(el[0].value);

                    value++;

                    if (!max || value <= max) {
                        el[0].value = value++;
                    }
                };
            }
            el.each(function () {
                init($(this));
            });
        };
        $(field).each(function () {
            fieldCount($(this));
        });
    }
    // catalogItemCounter('.fieldCount');

   /*мобильное меню*/
	$('.header-mobile__menu').on('click', function(){
		$(this).toggleClass('icon-menu__transform');
		$('.header-mobile__dropdown').toggleClass('popup-show');
		// $('.header').toggleClass('header-top__hide');
        $('html').toggleClass('overflow');
        $('.c-reviews__item').toggleClass('is-hide');


        if($('.header').hasClass('sticky')){
            $('.header-mobile__dropdown').addClass('menu-sticky');
        }else {
            $('.header-mobile__dropdown').removeClass('menu-sticky');
        }
	});
    // $('.header').hasClass('.sticky').children('.header-mobile__dropdown').addClass('menu-sticky');

    $('.header-mobile__dropdown-close').on('click', function(){
        $('.header-mobile__menu').toggleClass('icon-menu__transform');
        $('.header-mobile__dropdown').toggleClass('popup-show');
        $('html').removeClass('overflow');
        $('.c-reviews__item').removeClass('is-hide');
	});


	$('.header-mobile__cabinet').on('click', function(){
		$('.header-mobile__auth').toggleClass('popup-slide__show');
	});

    //кнопка вверх
    function backToTop (btnElem, parentElem){
        var offset = 300,
            offset_opacity = 1200,
            scroll_top_duration = 700,
            $back_to_top = $(btnElem);
        //кнопка назад
        $(window).scroll(function(){
            ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
            if( $(this).scrollTop() > offset_opacity ) {
                $back_to_top.addClass('cd-fade-out');
            }
        });

        $back_to_top.on('click', function(event){
            event.preventDefault();
            $(parentElem).animate({
                    scrollTop: 0
                }, scroll_top_duration
            );
        });
    }

    backToTop('.cd-top', 'body,html');
    backToTop('.popup-product__btn-back', '.popup');


    var wrapperHeight = parseInt($('.wrapper').height());
    /*липкая шапка*/
    $(window).scroll(function(){
        var bo = $(window).scrollTop();
        var $header = $(".header");
        var $headerWrap = $(".header-wrap");
        var $logo = $("#symbol-logo");
        var $headerHeight = $headerWrap.height();
        if ( bo >= 1 ) {/*значение при котором не дергается ничего 106*/
            $header.addClass('header-top__hide');
            // $header.addClass('sticky');
            $headerWrap.addClass('sticky');
            $logo.addClass('fixed-logo');

            $('main').css({
                'padding-top': $headerHeight
            });
            // $header.addClass('fixed-header');
        } else {
            $header.removeClass('header-top__hide');
            // $header.removeClass('sticky');
            $headerWrap.removeClass('sticky');
            $logo.removeClass('fixed-logo');
            // $header.removeClass('fixed-header');
            $('main').css({
                'padding-top': '0'
            });
        }

        // console.log('высота wrapperHeight: ' + wrapperHeight)
        if( wrapperHeight + 10 > documentHeight){
            $('.wrapper').css({
                'padding-bottom': '7rem'
            })
        }

        if( wrapperHeight + 300 > documentHeight){
            $('.wrapper').css({
                'padding-bottom': '0'
            })
        }
    });

    /*кастомный селект*/
    $('.c-select').SumoSelect( {
        forceCustomRendering: false
    });
    $('.c-select--search').SumoSelect( {
        forceCustomRendering: false,
        search: true,
        searchText: 'Искать...'
    });

    function showNegative(clickElem){
        $(clickElem).on('click', function(){
            var select = $('.popup__review .c-select');
            select.val('48');
            select[0].sumo.reload();
            // select[0].sumo.selectItem('48');
            var $icon = select.parents('.reviews-form__type').find('.reviews-form__type-icon');
            $icon.removeClass('icon-rabbit-positive');
            $icon.addClass('icon-rabbit-negative');
            // console.log('функция сработала при клике js-negative');
            // console.log(select.val());
        });
    }
    showNegative('.js-negative');
    showNegative('.c-reviews-negative');

    function showPositive(clickElem){
        $(clickElem).on('click', function(){
            var select = $('.popup__review .c-select');
            select.val('47');
            select[0].sumo.reload();
            var $icon = select.parents('.reviews-form__type').find('.reviews-form__type-icon');
            $icon.removeClass('icon-rabbit-negative');
            $icon.addClass('icon-rabbit-positive');
            // select[0].sumo.selectItem('47');
            // console.log('функция сработала при клике js-positive');
            // console.log(select.val());
        });
    }
    showPositive('.js-positive');
    showPositive('.c-reviews-positive');



    function changeRabbitFace (select){
        $(select).on("change",function() {
            var valReview = $(this).val();
            var $icon = $(this).parents('.reviews-form__type').find('.reviews-form__type-icon');

            if (valReview == 48 ) {
                $icon.removeClass('icon-rabbit-positive');
                $icon.addClass('icon-rabbit-negative');
            } else {
                $icon.removeClass('icon-rabbit-negative');
                $icon.addClass('icon-rabbit-positive');
            }
        });
    }

    changeRabbitFace('#form_dropdown_SIMPLE_QUESTION_257');

    function changeSelectFace (select, value, icon_1, icon_2){
        $(select).on("change",function() {
            var valReview = $(this).val();
            var $icon = $(this).parents('.c-select-layout').find('.c-select__icon');
            console.log('changeSelectFace');

            if (valReview == value ) {
                $icon.removeClass(icon_2);
                $icon.addClass(icon_1);
                console.log('boy');
            } else {
                $icon.removeClass(icon_1);
                $icon.addClass(icon_2);
                console.log('girl');
            }
        });
    }

    changeSelectFace('.lk-profile__child-gender', 'M','icon-boy-smiling','icon-girl-smiling');






    /*простые табы*/
    $(document).on('click', '.tabs-menu a', function(event) {
        event.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(this).parents('.tabs-menu').parent().siblings('.tab').find(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });

    /*scroll*/
    // $(".popup-basket__scroll").scrollBox();
    // $('#scrollbarY').tinyscrollbar();

    /*hover в меню*/
    // $('.header-menu__item--about').hover( function(){
    //    $('.header-subnavigation').addClass('is-visible');
    // });
    //
    // $('.header-subnavigation').mouseleave(function(){
    //     $(this).removeClass('is-visible');
    // });

/*скрол карты*/
    // var target = $('#map');
    // var targetPos = target.offset().top;
    // var winHeight = $(window).height();
    // var scrollToElem = targetPos - winHeight;
    // $(window).scroll(function(){
    //     var winScrollTop = $(this).scrollTop();
    //     if(winScrollTop > scrollToElem){
    //         //сработает когда пользователь доскроллит к элементу с классом .elem
    //         $(window).offset(60);
    //     }
    // });

    /*Порой на страницах с «резиновой» версткой необходимо знать ширину скролбара, чтобы правильно вычислить размеры внутренних элементов и их положение. Эта задача решается с помощью следующего алгоритма:

добавить два div в body и разместить их за пределами экрана;
определить ширину внутреннего div;
установить значение «scroll» свойства overflow у внешнего div;
опять определить ширину внутреннего div;
удалить оба div;
вернуть разницу между измеренными ранее значениями ширины.*/
    // function scrollbarWidth() {
    //     var div = $('<div style="width:50px; height:50px; overflow:hidden; position:absolute; top:-200px; left:-200px;"><div style="height:100px;"></div></div>').appendTo('body');
    //     var w1 = $('div', div).innerWidth();
    //     div.css('overflow-y', 'scroll');
    //     var w2 = $('div', div).innerWidth();
    //     $(div).remove();
    //     return (w1 - w2);
    // }
    //
    // var resScrollWidtn = scrollbarWidth();
    // console.log('Ширина скролбара страницы: ' + resScrollWidtn);

});



    /*-------------------------------------------------------------*/

    /*-------------------------------------------------------------*/

// });

    //------------------------------------------------------------custom###
//
// 	$body = $('body');
// 	windowWidth = $(window).width();
// 	windowHeight = $(window).height();
//
// 	pageWidget(['index']);
// 	getAllClasses('html','.elements_list');
// });
//
// $(window).on('load', function () {
// 	loadFunc();
// });
//
// $(window).on('resize', function () {
// 	resizeFunc();
// });
//
// $(window).on('scroll', function () {
// 	scrollFunc();
// });
//
// function loadFunc() {
//
// }
// function resizeFunc() {
// 	updateSizes();
// }
//
// function scrollFunc() {
// 	updateSizes();
// }
//
// function updateSizes() {
// 	windowWidth = $(window).width();
// 	windowHeight = $(window).height();
// }

// if ('objectFit' in document.documentElement.style === false) {
// 	document.addEventListener('DOMContentLoaded', function () {
// 		Array.prototype.forEach.call(document.querySelectorAll('img[data-object-fit]'), function (image) {
// 			(image.runtimeStyle || image.style).background = 'url("' + image.src + '") no-repeat 50%/' + (image.currentStyle ? image.currentStyle['object-fit'] : image.getAttribute('data-object-fit'));
//
// 			image.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'' + image.width + '\' height=\'' + image.height + '\'%3E%3C/svg%3E';
// 		});
// 	});
// }

//Functions for development
// function getAllClasses(context, output) {
// 	var finalArray = [],
// 		mainArray = [],
// 		allElements = $(context).find($('*'));//get all elements of our page
// 	//If element has class push this class to mainArray
// 	for (var i = 0; i < allElements.length; i++) {
// 		var someElement = allElements[i],
// 			elementClass = someElement.className;
// 		if (elementClass.length > 0) {//if element have not empty class
// 			//If element have multiple classes - separate them
// 			var elementClassArray = elementClass.split(' '),
// 				classesAmount = elementClassArray.length;
// 			if (classesAmount === 1) {
// 				mainArray.push('.' + elementClassArray[0] + ' {');
// 			} else {
// 				var cascad = '.' + elementClassArray[0] + ' {';
// 				for (var j = 1; j < elementClassArray.length; j++) {
// 					cascad += ' &.' + elementClassArray[j] + ' { }';
// 				}
// 				mainArray.push(cascad);
// 			}
// 		}
// 	}

	//creating finalArray, that don't have repeating elements
// 	var noRepeatingArray = unique(mainArray);
// 	noRepeatingArray.forEach(function (item) {
// 		var has = false;
// 		var preWords = item.split('&');
// 		for (var i = 0; i < finalArray.length; ++i) {
// 			var newWords = finalArray[i].split('&');
// 			if (newWords[0] == preWords[0]) {
// 				has = true;
// 				for (var j = 0; j < preWords.length; ++j) {
// 					if (newWords.indexOf(preWords[j]) < 0) {
// 						newWords.push(preWords[j]);
// 					}
// 				}
// 				finalArray[i] = newWords.join('&');
// 			}
// 		}
// 		if (!has) {
// 			finalArray.push(item);
// 		}
// 	});
// 	for (var i = 0; i < finalArray.length; i++) {
// 		$('<div>' + finalArray[i] + ' }</div>').appendTo(output);
// 	}
//
// 	//function that delete repeating elements from arrays, for more information visit http://mathhelpplanet.com/static.php?p=javascript-algoritmy-obrabotki-massivov
// 	function unique(A) {
// 		var n = A.length, k = 0, B = [];
// 		for (var i = 0; i < n; i++) {
// 			var j = 0;
// 			while (j < k && B[j] !== A[i]) j++;
// 			if (j == k) B[k++] = A[i];
// 		}
// 		return B;
// 	}
// }
/*
function pageWidget(pages) {
	var widgetWrap = $('<div class="widget_wrap"><ul class="widget_list"></ul></div>');
	widgetWrap.prependTo("body");
	for (var i = 0; i < pages.length; i++) {
		$('<li class="widget_item"><a class="widget_link" href="' + pages[i] + '.html' + '">' + pages[i] + '</a></li>').appendTo('.widget_list');
	}
	var widgetStilization = $('<style>body {position:relative} .widget_wrap{position:absolute;top:0;left:0;z-index:9999;padding:10px 20px;background:#222;border-bottom-right-radius:10px;-webkit-transition:all .3s ease;transition:all .3s ease;-webkit-transform:translate(-100%,0);-ms-transform:translate(-100%,0);transform:translate(-100%,0)}.widget_wrap:after{content:" ";position:absolute;top:0;left:100%;width:24px;height:24px;background:#222 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAABGdBTUEAALGPC/xhBQAAAAxQTFRF////////AAAA////BQBkwgAAAAN0Uk5TxMMAjAd+zwAAACNJREFUCNdjqP///y/DfyBg+LVq1Xoo8W8/CkFYAmwA0Kg/AFcANT5fe7l4AAAAAElFTkSuQmCC) no-repeat 50% 50%;cursor:pointer}.widget_wrap:hover{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0)}.widget_item{padding:0 0 10px}.widget_link{color:#fff;text-decoration:none;font-size:15px;}.widget_link:hover{text-decoration:underline} </style>');
	widgetStilization.prependTo(".widget_wrap");
}
*/

/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/

'use strict';

;( function ( document, window, index )
{
    var inputs = document.querySelectorAll( '.c-inputfile__input' );
    Array.prototype.forEach.call( inputs, function( input )
    {
        var label	 = input.nextElementSibling,
            labelVal = label.innerHTML;

        input.addEventListener( 'change', function( e )
        {
            var fileName = '';
            if( this.files && this.files.length > 1 )
                fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
                fileName = e.target.value.split( '\\' ).pop();

            if( fileName )
                label.querySelector( 'span' ).innerHTML = fileName;
            else
                label.innerHTML = labelVal;
        });

        // Firefox bug fix
        input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
        input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
    });
}( document, window, 0 ));


$(function(){
    // Custom readmore
    var obj = $(".cake-order-composition");
    var collapsed = true;
    obj.attr('collapsed', collapsed);
    var moreString = '<a href="#" class="mrm-more"></a>';
    var lessString = '<a href="#" class="mrm-less"></a>';
    obj.append(moreString);
    obj.append(lessString);
    obj.find('a.mrm-more').show();
    obj.find('a.mrm-less').hide();

    obj.find('a.mrm-more').on('click',function(event){
        event.preventDefault();
        var collapsed = false;
        obj.find('a.mrm-less').show();
        obj.find('a.mrm-more').hide();
        obj.attr('collapsed', collapsed);

    });
    obj.find('a.mrm-less').on('click',function(event){
        event.preventDefault();
        var collapsed = true;
        obj.find('a.mrm-more').show();
        obj.find('a.mrm-less').hide();
        obj.attr('collapsed', collapsed);

    });



    // Show Hint
    $('#pie-order-form > div.popup-body > div.cake-order-time > div:nth-child(3)').append($('<div class="close"></div>'));

    var hintPanel = $('#pie-order-form > div.popup-body > div.cake-order-time > div:nth-child(3)');

    $('.delivery-date-hint').on('click',function() {

        if(hintPanel.hasClass('show-hint')) {
            hintPanel.removeClass("show-hint");
        } else {
            hintPanel.addClass("show-hint");
        }
    });

    hintPanel.find('.close').on('click', function() {
        hintPanel.removeClass("show-hint");
    });


    // #region disable dialogbox and hints

    function hideHints() {
        $('#pie-order-form > div.popup-body > div.cake-order-time > div:nth-child(3)').removeClass("show-hint");
    }

    function hideDatepicker() {
        $('#cake-order-date').datepicker().data('datepicker').hide();
    }
    // #endregion disable dialogbox and hints

    // Scroll form
    $('.mfp-wrap.popup-pie-one-click').on('scroll', function(){
        hideHints();
        hideDatepicker();
    });


    // Click on form with except
    $('.popup-pie-one-click .mfp-content').on('click', function(event) {
        if($(event.target).hasClass('delivery-date-hint') ||
            $(event.target).hasClass('c-form__attention')
        ) {
            //clicked on hint
        } else {
            hideHints();
        }
    });

    // Collapse nav menu
    //c-card-slide__dropdown
    var carretHTML = `
    <a href="#" class="nav-dropdown">
        <i class="icon-dropdown">
            <svg class="icon-dropdown__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124.54 68.83">
                <path d="M46.65,23.71c-2.19-2-4.42-3.89-6.71-5.76C31,10.61,18.61-.11,6.22,2.69c-4.43,1-7.1,6.07-6,10.37,3,11,13.81,17.08,22.07,24.06C33.06,46.17,42.88,56,52.87,65.85c3.61,3.54,10.81,4,14.8.86,7.56-6,20.49-14.33,27.53-21,15.48-12.05,29.38-26,29.33-35,.33-7-4.2-10.14-7.33-10.67-8.32-1.41-27,17.75-35.67,25.67C77.38,28.58,69.22,35.58,65,38.28"></path>
            </svg>
        </i>
    </a>
    `;

    $('.pie-mix__item').append(carretHTML);

    var pieNavCollapse = true;
    $('.pie-mix a.nav-dropdown').on('click',function() {
        pieNavCollapse = !pieNavCollapse;

        if(pieNavCollapse) {
            $(this).removeClass('active');
            $('.pie-mix a.pie-mix__item').not('.mixitup-control-active').hide();
        } else {
            $(this).addClass('active');
            $('.pie-mix a.pie-mix__item').not('.mixitup-control-active').show();
        }



        // $('.pie-mix a.pie-mix__item:not(.mixitup-control-active)').hide();

        // if(pieNavCollapse) {
        //     pieNavCollapse = false;
        //     $('.pie-mix a.pie-mix__item').show();
        // } else {
        //     pieNavCollapse = true;
        //     $('.pie-mix a.pie-mix__item:not(.mixitup-control-active)').hide();
        // }

    });



});


/* holiday space list */
$(function() {
    /* show more */
    
    /* settings*/
    var $target = $('.show-more-target');
    var $control = $('.show-more');
    var target_item_selector = 'div.c-col';
    var start_count = 8;
    /* end settings */

    var show_more_state_collapsed = true; 
    var target_count = $target.find(target_item_selector).length;


    $control.find('a').on('click', function(event) {
        event.preventDefault();
        show_more_state_collapsed = !show_more_state_collapsed;
        console.log(show_more_state_collapsed);

        $target.find(target_item_selector).each(function(index, elem) {
            if(show_more_state_collapsed) {
                index >= start_count ? $(elem).hide(): $(elem).show();
            } else {
                $(elem).show();
            }
        });

        if (show_more_state_collapsed) {
            $control.find('a').html('показать ещё');
        } else {
            $control.find('a').html('скрыть');
        }


    //        if(current > target_count) $control.hide();
    });

    if(start_count < target_count) {
        $target.find(target_item_selector).each(function(index, elem) {
            index >= start_count ? $(elem).hide(): $(elem).show();
        });
    }
    /* end show more */



    $('.popup-fotorama').fotorama({
        width: '100%',
        ratio: 16/9,
        loop: true,
        thumbwidth: 88,
        allowfullscreen: false,
        nav: 'thumbs',
        fit:'cover'
    });

    if($('div').hasClass('calendar-selector__list')){
        /* Calendar Selector */
        new SimpleBar($('.calendar-selector__list')[0], {
            autoHide: false,
            scrollbarMinSize: 35,
        });
    };


    $('.calendar-title__wrapper').on('click', function (event) {
        event.preventDefault();
        $('#hsl-addr-selector').toggleClass('calendar-selector_hidden');
        $('.calendar-title__wrapper .calendar-title__control svg').toggleClass('calendar-title__control_flip');
    });

    $('#hsl-year-selector-init').on('click', function (event) {
        event.preventDefault();
        $('#hsl-year-selector').toggleClass('calendar-selector_hidden');
    });



    // hide on click other element
    function hideSelector(target_selector, event) {
        let elemclass = $(event.target).attr('class');
        let elemid = $(event.target).attr('id');
        if(!elemid) elemid = '';
        if(!elemclass) elemclass = '';

        if(!$(target_selector).hasClass('calendar-selector_hidden'))
            if ((elemclass.indexOf('calendar-selector') === -1) &&
                (elemclass.indexOf('simplebar') === -1) &&
                (elemclass.indexOf('calendar-navigator__year') === -1) &&
                (elemid.indexOf('hsl-year-selector-init') === -1) &&
                (elemclass.indexOf('calendar-title__caption') === -1) &&
                (elemclass.indexOf('calendar-title__wrapper') === -1) &&
                (elemclass.indexOf('calendar-title__caption') === -1) &&
                (elemclass.indexOf('calendar-title__control') === -1)
            ) {
                $('.calendar-selector').addClass('calendar-selector_hidden');
                // arrow transform
                $('.calendar-title__wrapper .calendar-title__control svg').removeClass('calendar-title__control_flip');

            }
    }

    $(document).on('click', function(event) {
        hideSelector('#hsl-addr-selector', event);
        hideSelector('#hsl-year-selector', event);
    });

    // filter on input
    $('.calendar-selector__input').on('change paste keyup', function(event) {

        var filter_value =  $('.calendar-selector__input').val();
        var $elem_target = $(this).closest('.calendar-selector').find('.calendar-selector__list');

        if(filter_value) {
            $elem_target.find('li').each(function (index, element) {
                if ($(element).find('a').html().toLowerCase().indexOf(filter_value.toLowerCase()) !== -1) {
                    $(element).show();
                } else {
                    $(element).hide();
                }
            });
        } else {
            $elem_target.find('li').each(function (index, element) {
                $(element).show();
            });
        }
    });



});

