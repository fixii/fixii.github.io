// Avoid `console` errors in browsers that lack a console.
		(function() {
		    var method;
		    var noop = function () {};
		    var methods = [
		        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		        'timeStamp', 'trace', 'warn'
		    ];
		    var length = methods.length;
		    var console = (window.console = window.console || {});
		
		    while (length--) {
		        method = methods[length];
		
		        // Only stub undefined methods.
		        if (!console[method]) {
		            console[method] = noop;
		        }
		    }
		}());

// Place any jQuery/helper plugins in here.


// jQuery Scroll
		/**
		 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
		 * Dual licensed under MIT and GPL.
		 * @author Ariel Flesler
		 * @version 1.4.3
		 */
		;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(!e)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,e,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);



/*
 * jQuery One Page Nav Plugin
 * http://github.com/davist11/jQuery-One-Page-Nav
 *
 * Copyright (c) 2010 Trevor Davis (http://trevordavis.net)
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://jquery.org/license
 *
 * @version 2.2
 *
 * Example usage:
 * $('#nav').onePageNav({
 *   currentClass: 'current',
 *   changeHash: false,
 *   scrollSpeed: 750
 * });
 */

;(function($, window, document, undefined){

	// our plugin constructor
	var OnePageNav = function(elem, options){
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options;
		this.metadata = this.$elem.data('plugin-options');
		this.$nav = this.$elem.find('a');
		this.$win = $(window);
		this.sections = {};
		this.didScroll = false;
		this.$doc = $(document);
		this.docHeight = this.$doc.height();
	};

	// the plugin prototype
	OnePageNav.prototype = {
		defaults: {
			currentClass: 'active',
			changeHash: false,
			easing: 'swing',
			filter: '',
			scrollSpeed: 400,
			scrollOffset: 0,
			scrollThreshold: 0.2,
			begin: false,
			end: false,
			scrollChange: false
		},

		init: function() {
			var self = this;
			
			// Introduce defaults that can be extended either
			// globally or using an object literal.
			self.config = $.extend({}, self.defaults, self.options, self.metadata);
			
			//Filter any links out of the nav
			if(self.config.filter !== '') {
				self.$nav = self.$nav.filter(self.config.filter);
			}
			
			//Handle clicks on the nav
			self.$nav.on('click.onePageNav', $.proxy(self.handleClick, self));

			//Get the section positions
			self.getPositions();
			
			//Handle scroll changes
			self.bindInterval();
			
			//Update the positions on resize too
			self.$win.on('resize.onePageNav', $.proxy(self.getPositions, self));

			return this;
		},
		
		adjustNav: function(self, $parent) {
			self.$elem.find('.' + self.config.currentClass).removeClass(self.config.currentClass);
			$parent.addClass(self.config.currentClass);
		},
		
		bindInterval: function() {
			var self = this;
			var docHeight;
			
			self.$win.on('scroll.onePageNav', function() {
				self.didScroll = true;
			});
			
			self.t = setInterval(function() {
				docHeight = self.$doc.height();
				
				//If it was scrolled
				if(self.didScroll) {
					self.didScroll = false;
					self.scrollChange();
				}
				
				//If the document height changes
				if(docHeight !== self.docHeight) {
					self.docHeight = docHeight;
					self.getPositions();
				}
			}, 250);
		},
		
		getHash: function($link) {
			return $link.attr('href').split('#')[1];
		},
		
		getPositions: function() {
			var self = this;
			var linkHref;
			var topPos;
			var $target;
			
			self.$nav.each(function() {
				linkHref = self.getHash($(this));
				$target = $('#' + linkHref);

				if($target.length) {
					topPos = $target.offset().top;
					self.sections[linkHref] = Math.round(topPos) - self.config.scrollOffset;
				}
			});
		},
		
		getSection: function(windowPos) {
			var returnValue = null;
			var windowHeight = Math.round(this.$win.height() * this.config.scrollThreshold);

			for(var section in this.sections) {
				if((this.sections[section] - windowHeight) < windowPos) {
					returnValue = section;
				}
			}
			
			return returnValue;
		},
		
		handleClick: function(e) {
			var self = this;
			var $link = $(e.currentTarget);
			var $parent = $link.parent();
			var newLoc = '#' + self.getHash($link);
			
			if(!$parent.hasClass(self.config.currentClass)) {
				//Start callback
				if(self.config.begin) {
					self.config.begin();
				}
				
				//Change the highlighted nav item
				self.adjustNav(self, $parent);
				
				//Removing the auto-adjust on scroll
				self.unbindInterval();
				
				//Scroll to the correct position
				$.scrollTo(newLoc, self.config.scrollSpeed, {
					axis: 'y',
					easing: self.config.easing,
					offset: {
						top: -self.config.scrollOffset
					},
					onAfter: function() {
						//Do we need to change the hash?
						if(self.config.changeHash) {
							window.location.hash = newLoc;
						}
						
						//Add the auto-adjust on scroll back in
						self.bindInterval();
						
						//End callback
						if(self.config.end) {
							self.config.end();
						}
					}
				});
			}

			e.preventDefault();
		},
		
		scrollChange: function() {
			var windowTop = this.$win.scrollTop();
			var position = this.getSection(windowTop);
			var $parent;
			
			//If the position is set
			if(position !== null) {
				$parent = this.$elem.find('a[href$="#' + position + '"]').parent();
				
				//If it's not already the current section
				if(!$parent.hasClass(this.config.currentClass)) {
					//Change the highlighted nav item
					this.adjustNav(this, $parent);
					
					//If there is a scrollChange callback
					if(this.config.scrollChange) {
						this.config.scrollChange($parent);
					}
				}
			}
		},
		
		unbindInterval: function() {
			clearInterval(this.t);
			this.$win.unbind('scroll.onePageNav');
		}
	};

	OnePageNav.defaults = OnePageNav.prototype.defaults;

	$.fn.onePageNav = function(options) {
		return this.each(function() {
			new OnePageNav(this, options).init();
		});
	};
	
})( jQuery, window , document );


// Parallax Effect
		$(document).ready(function(){
		   // cache the window object
		   $window = $(window);
		 
		   $('section[data-type="background"]').each(function(){
		     // declare the variable to affect the defined data-type
		     var $scroll = $(this);
		                     
		      $(window).scroll(function() {
		        // HTML5 proves useful for helping with creating JS functions!
		        // also, negative value because we're scrolling upwards                            
		        var yPos = -($window.scrollTop() / $scroll.data('speed'));
		         
		        // background position
		        var coords = '50% '+ yPos + 'px';
		 
		        // move the background
		        $scroll.css({ backgroundPosition: coords });   
		      }); // end window scroll
		   });  // end section function
		}); // close out script

		// Create HTML5 element for IE
		document.createElement("section");




// isotope

		$(window).load(function(){
		    var $container = $('.portfolioContainer');
		    $container.isotope({
		        filter: '*',
		        animationOptions: {
		            duration: 750,
		            easing: 'linear',
		            queue: false
		        }
		    });
		 
		    $('.portfolioFilter a').click(function(){
		        $('.portfolioFilter .current').removeClass('current');
		        $(this).addClass('current');
		 
		        var selector = $(this).attr('data-filter');
		        $container.isotope({
		            filter: selector,
		            animationOptions: {
		                duration: 750,
		                easing: 'linear',
		                queue: false
		            }
		         });
		         return false;
		    });
		
		
			(function ($) {
			  $.Isotope.prototype._getCenteredMasonryColumns = function() {
			    this.width = this.element.width();
			    var parentWidth = this.element.parent().width();
			                  // i.e. options.masonry && options.masonry.columnWidth
			    var colW = this.options.masonry && this.options.masonry.columnWidth ||
			                  // or use the size of the first item
			                  this.$filteredAtoms.outerWidth(true) ||
			                  // if there's no items, use size of container
			                  parentWidth;
			    var cols = Math.floor( parentWidth / colW );
			    cols = Math.max( cols, 1 );
			    // i.e. this.masonry.cols = ....
			    this.masonry.cols = cols;
			    // i.e. this.masonry.columnWidth = ...
			    this.masonry.columnWidth = colW;
			  };
			  $.Isotope.prototype._masonryReset = function() {
			    // layout-specific props
			    this.masonry = {};
			    // FIXME shouldn't have to call this again
			    this._getCenteredMasonryColumns();
			    var i = this.masonry.cols;
			    this.masonry.colYs = [];
			    while (i--) {
			      this.masonry.colYs.push( 0 );
			    }
			  };
			  $.Isotope.prototype._masonryResizeChanged = function() {
			    var prevColCount = this.masonry.cols;
			    // get updated colCount
			    this._getCenteredMasonryColumns();
			    return ( this.masonry.cols !== prevColCount );
			  };
			  $.Isotope.prototype._masonryGetContainerSize = function() {
			    var unusedCols = 0,
			        i = this.masonry.cols;
			    // count unused columns
			    while ( --i ) {
			      if ( this.masonry.colYs[i] !== 0 ) {
			        break;
			      }
			      unusedCols++;
			    }
			    return {
			          height : Math.max.apply( Math, this.masonry.colYs ),
			          // fit container to columns that have been used;
			          width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth
			        };
			  };
			})(jQuery);
		
		});


// fancyBox
		$(document).ready(function() {
			$(".fancybox").fancybox();
			// helpers
			
			//Change title position; show overlay after content has loaded
			
			$(".fancybox").fancybox({
		    	openEffect	: 'elastic',
		    	closeEffect	: 'elastic',
		
		    	helpers : {
		    		title : {
		    			type : 'inside'
		    		}
		    	}
		    });
			// ready for next helper here
			
		});
		
// Make Fancybox Respect Isotope Filtering
        $('.portfolioFilter a').click(function(){
              var selector = $(this).attr('data-filter');
          $('.portfolioContainer').isotope({ filter: selector }, function(){
            if(selector == "*"){
             $(".fancybox").attr("data-fancybox-group", "gallery");
            } else{ 
             $(selector).find(".fancybox").attr("data-fancybox-group", selector);
            }
          });
          return false;
        });

