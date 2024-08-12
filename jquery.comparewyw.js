/*!
 * jQuery CompareWYW plugin 
 *
 * Copyright (c) 2011 Oskari Blomberg
 * http://www.oskariblomberg.fi
 *
 * Licensed under the GNU GPL v2 license
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 * Project home:
 * http://code.google.com/p/jquery-comparewyw/
 * 
 * Version: 1.0.0
 * Requires jQuery 1.4.0
 * Requires jQuery UI 1.7.0
 */

(function($){
	$.fn.compareWYW = function(options) {
		var defaults = {
			axis: 'x',
			animateDuration: 500,
			event: 'drag'
		};
		var opts = $.extend(defaults, options);
		if(opts.event == 'drag' && (!$.ui || !$.ui.draggable)) return false;
		return this.each(function() {
			var $obj = $(this);
			$obj.wrapInner('<div class="compareWYW"></div>');
			var $cont = $obj.find('.compareWYW');
			var size = {
				width: 0,
				height: 0
			};
			$obj.bind('selectstart',function(event){
				event.preventDefault();
			});
			$cont.children(':lt(2)').each(function(){
				var $item = $(this);
				var itemHeight = $item.height();	
				var itemWidth = $item.width();
				if(itemWidth > size.width) {
					size.width = itemWidth;
				}
				if(itemHeight > size.height){
					size.height = itemHeight;
				}
				$item.wrap('<div class="itemWrap"></div>');
			});
			$cont.css({
				width: size.width,
				height: size.height
			});
			$cont.append('<div class="indicator"><span class="handle"></span></div>');
			var $indicator = $cont.find('.indicator').addClass((opts.axis == 'x') ? 'horizontalIndicator' : 'verticalIndicator');
			var $handle = $cont.find('.handle').addClass((opts.axis == 'x') ? 'horizontalHandle' : 'verticalHandle');
			var $itemWrapFirst = $cont.find('.itemWrap:eq(0)');
			var $itemWrapLast = $cont.find('.itemWrap:eq(1)');
			
			if(opts.axis == 'x') {
				var cursor = ($.browser.msie) ? 'e-resize' : 'ew-resize';
			}
			else if(opts.axis == 'y') {
				var cursor = ($.browser.msie) ? 'n-resize' : 'ns-resize';
			}
			
			$indicator.css({
				left: (opts.axis == 'x') ? (size.width/2)-$indicator.width() : 0,
				top: (opts.axis == 'y') ? (size.height/2)-$indicator.height() : 0,
				cursor: cursor
			});
			$handle.css({
				left: (opts.axis == 'x') ? ($indicator.width()/2)-($handle.width()/2) : (size.width/2)-($handle.width()/2),
				top: (opts.axis == 'y') ? ($indicator.height()/2)-($handle.height()/2) : (size.height/2)-($handle.height()/2)
			});
			$itemWrapFirst.css({
				width: (opts.axis == 'x') ? size.width/2 : size.width,
				height: (opts.axis == 'y') ? size.height/2 : size.height,
				zIndex: 2
			});
			$itemWrapLast.css({
				zIndex: 1
			});
			if(opts.event == 'drag') {
				$indicator.draggable({
					axis: opts.axis,
					containment: $cont,
					drag: function(event,ui) {
						resizeItemWidth(event,ui);
					}
				});
				$cont.live('click',function(event){
					resizeItemWidth(event,null);
				});
			}
			else if(opts.event == 'hover'){
				$cont.live('mousemove',function(event){
					resizeItemWidth(event,null);
				});
			}
			function resizeItemWidth(event,ui) {
				if(event.type == 'click' || event.type == 'mousemove') {
					var curPos = (opts.axis == 'x') ? event.pageX - $cont.offset().left : event.pageY - $cont.offset().top;
				}
				else {
					var curPos = (opts.axis == 'x') ? ui.position.left : ui.position.top;
				}
				$itemWrapFirst.animate({
					width: (opts.axis == 'x') ? curPos : size.width,
					height: (opts.axis == 'y') ? curPos : size.height
				},(event.type == 'click') ? opts.animateDuration : 0);
				if(event.type == 'click' || event.type == 'mousemove') {
					$indicator.animate({
						left: (opts.axis == 'x') ? curPos : 0,
						top: (opts.axis == 'y') ? curPos : 0
					},(event.type == 'click') ? opts.animateDuration : 0);
				}
			}
		});
	};
})(jQuery);