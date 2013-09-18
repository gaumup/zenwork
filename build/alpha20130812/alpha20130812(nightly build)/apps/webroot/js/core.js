/* Core class by gaumup(ukhome@gmail.com) */
/**
 * @use:
 *  - contains core function
 * @depends:
 *	- jQuery core
 *	- qTip
 */

/**
 * @use: extend javascript prototypal
 * @ref: http://javascript.crockford.com/prototypal.html
 */
//define 'create inheritance object' method
if (typeof Object.create !== 'function') { //Object and Object.create is native javascript
    Object.create = function (o) {
        function F () {}
        F.prototype = o;
        return new F();
    };
}

var Core = {};

/**
 * @class
 * Mediator class
 */
Core.Mediator = (function () {
    var channels = {};

    var subscribe = function (channel, fn) {
        if ( !channels[channel] ) { channels[channel] = []; }
        channels[channel].push({
            context: this,
            callback: fn
        });
        return this;
    }

    var publish = function (channel) {
        if ( !channels[channel] ) { return false; }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = channels[channel].length; i < l; i++) {
            var subscription = channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }
        return this;
    }

    return {
        pub: publish,
        sub: subscribe,
        installTo: function(obj) {
            obj.pub = publish;
            obj.sub = subscribe;
        }
    }
})();

Core.Algorithm = {};
Core.Algorithm.Sort = new function () {
    //public
    this.mergeSort = function (list, evalFunction, inOrder/*asc|desc*/) {
        if ( list.length <= 1 ) { return list; }
        var left = [];
        var right = [];
        var middle = Math.floor(list.length/2);

        for ( var i = 0; i < middle; i++ ) {
            left.push(list[i]);
        }
        for ( var i = middle; i < list.length; i++ ) {
            right.push(list[i]);
        }
        //recursively call merge_sort() to further split each sublist
        //until sublist size is 1
        left = this.mergeSort(left, evalFunction, inOrder);
        right = this.mergeSort(right, evalFunction, inOrder);
        //merge the sublists returned from prior calls to merge_sort()
        //and return the resulting merged sublist
        return merge(left, right, evalFunction, inOrder);
    }

    //private
    /*
     * @use: merge function use for mergesort method
     */
    function merge (left, right, evalFunction, inOrder) {
        var result = [];
        while ( left.length > 0 || right.length > 0 ) {
            if ( left.length > 0 && right.length > 0 ) {
                if ( (inOrder == 'asc' && evalFunction.equalOrLessThan(left[0], right[0]))
                    || (inOrder == 'desc' && evalFunction.equalOrGreaterThan(left[0], right[0]))
                ) {
                    result.push(left[0]);
                    left.splice(0, 1);
                }
                else {
                    result.push(right[0]);
                    right.splice(0, 1);
                }
            }
            else if ( left.length > 0 ) {
                result.push(left[0]);
                left.splice(0, 1);
            }
            else if ( right.length > 0 ) {
                result.push(right[0]);
                right.splice(0, 1);
            }
        }
        return result;
    }
};
/*
var arr = [1,63,4,5, 12, 16, 19, 98, 90, 88, 190, 0, 0, 0, 6, 3, 6, 8, 9, 10, 56];
console.log( Core.Algorithm.Sort.mergeSort(arr, {
    equal: function (elem1, elem2) {
        return elem1 == elem2;
    },
    equalOrLessThan: function (elem1, elem2) {
        return elem1 <= elem2;
    },
    equalOrGreaterThan: function (elem1, elem2) {
        return elem1 >= elem2;
    },
    lessThan: function (elem1, elem2) {
        return elem1 < elem2;
    },
    greaterThan: function (elem1, elem2) {
        return elem1 > elem2;
    }
    }
, 'asc') );
*/

Core.Algorithm.MinMax = new function () {
    this.findMinMax = function (list, evalFunction) {
        if ( list.length == 0 ) { return null; }
        var minElem;
        var maxElem;
        var startIndex;
        var n = list.length;
        if ( n%2 != 0 ) { //n is odd
            minElem = list[0];
            maxElem = list[0];
            startIndex = 1;
        }
        else { //n is even
            if ( evalFunction.lessThan(list[0], list[1]) ){
                minElem = list[0];
                maxElem = list[1];
            }
            else {
                minElem = list[1];
                maxElem = list[0];
            }
            startIndex = 2;
        }

        for ( var i = startIndex; i <= n; i=i+2 ) {  // Processing elements in pair
            var tmpMinElem;
            var tmpMaxElem;
            var elem1 = list[i];
            var elem2 = list[i+1];
            //compare two adjacent elements to find min and max
            //we check lessThan and greaterThan in 2 different condition
            //to ensure it work in case 'lessThan' is not '!greaterThan'
            //eg. compare a=[2, 6] to b=[3, 4]
            //lessThan(a, b) -> return true
            //greaterThan(a, b) -> return true
            //but lessThan(a, b) derived to greaterThan(b, a) is false
            if ( evalFunction.equalOrLessThan(elem1, elem2) ) {
                tmpMinElem = elem1;
            }
            else {
                tmpMinElem = elem2;
            }
            if ( evalFunction.equalOrGreaterThan(elem1, elem2) ) {
                tmpMaxElem = elem1;
            }
            else {
                tmpMaxElem = elem2;
            }
            //update min
            if ( evalFunction.lessThan(tmpMinElem, minElem) ) {
                minElem = tmpMinElem;
            }
            //update max
            if ( evalFunction.greaterThan(tmpMaxElem, maxElem) ) {
                maxElem = tmpMaxElem;
            }
        }

        return {
            min: minElem,
            max: maxElem
        }
    }
};
/*
var arr = [1,63,4,5, 12, 16, 19, 98, 90, 88, 190, 0, 0, 0, 6, 3, 6, 8, 9, 10, 56];
console.log( Core.Algorithm.MinMax.findMinMax(arr, {
    equal: function (elem1, elem2) {
        return elem1 == elem2;
    },
    equalOrLessThan: function (elem1, elem2) {
        return elem1 <= elem2;
    },
    equalOrGreaterThan: function (elem1, elem2) {
        return elem1 >= elem2;
    },
    lessThan: function (elem1, elem2) {
        return elem1 < elem2;
    },
    greaterThan: function (elem1, elem2) {
        return elem1 > elem2;
    }
}) );
*/

Array.prototype.remove = function (arr) {
    if ( arr.length == 0 ) { return this; }
    if ( this.length == 0 ) { return []; }
    for ( var i in arr ) {
        var index = this.indexOf(arr[i]);
        if ( index == -1 ) { continue; }
        this.splice(index, 1);
    }
    return this;
};
/*
var arr = [1,63,4,5, 12, 16, 19, 98, 90, 88, 190, 0, 0, 0, 6,3,6,8,9,10,56];
var rmArr = [19, 98, 90, 88];
console.log('Original: ['+arr+']');
console.log('Remove: ['+rmArr+']');
arr.remove(rmArr);
console.log('After removed: ['+arr+']');
*/

Array.prototype.max = function () {
    return Math.max.apply(Math, this);
};
 
Array.prototype.min = function () {
    return Math.min.apply(Math, this);
};

//extend jQuery object
jQuery.extend(jQuery, {
    /*
     * @use: return width|height, left|top absolute, left|top relative of a jQuery element
     * @params:
     *     - element: jQuery object
     */
    getBoxPosition: function (element) {
        return {
            leftAbs: element.offset().left,
            topAbs: element.offset().top,
            leftRel: element.position().left,
            topRel: element.position().top
        }
    },

    /*
     * @use: return padding|border of a jQuery element
     * @params:
     *     - element: jQuery object
     */
    getBoxModel: function (element) {
        return {
            width: element.outerWidth(),
            height: element.outerHeight(),
            paddingTop: parseFloat(element.css('paddingTop')),
            paddingBottom: parseFloat(element.css('paddingBottom')),
            paddingLeft: parseFloat(element.css('paddingLeft')),
            paddingRight: parseFloat(element.css('paddingRight')),
            borderTop: parseFloat(element.css('borderTopWidth')),
            borderBottom: parseFloat(element.css('borderBottomWidth')),
            borderLeft: parseFloat(element.css('borderLeftWidth')),
            borderRight: parseFloat(element.css('borderRightWidth'))
        }
    },
    getScrollX: function (element) {
        return element.scrollLeft();
    },
    getScrollY: function (element) {
        return element.scrollTop();
    },
    scrollX: function (element, value) {
        element.scrollLeft(value);
    },
    scrollY: function (element, value) {
        element.scrollTop(value);
    },
    scrollTo: function (element, x, y) {
        element.scrollLeft(x).scrollTop(y);
    },

    /**
     * @use: sync callback of list of animation object
     */
    sync: function (list, animation, callback) {
        var queueCompleted = 0;
        $.each(list, function () {
            animation($(this), function () {
                queueCompleted++;
                if ( queueCompleted == list.length ) { callback(); }
            });
        });
    },

    toggleText: function (dom, text1, text2) {
        dom.innerHTML = dom.innerHTML == text1 ? text2 : text1;
        dom.title = dom.innerHTML;
    }
});

Zenwork = typeof(Zenwork) == 'undefined' ? {} : Zenwork;
jQuery(document).ready(function () {
    (function ($) {
        if ( $.browser.msie ) {
            $('body').addClass('ie').addClass('ie'+$.browser.version);
        }
    })(jQuery);

    //get native scrollbar size
    Core.SCROLLBAR_SIZE = function ($) {
        // Find the Width of the Scrollbar
        var sizeScrollHtml = '<div id="sizeScrollDivOne" style="width:50px;height:50px;overflow-y:scroll;position:absolute;top:-200px;left:-200px;"><div id="sizeScrollDivTwo" style="height:100px;width:100%"></div></div>';
        // Append our div and add the hmtl to your document for calculations
        jQuery("body").append(sizeScrollHtml);
        // Getting the width of the surrounding(parent) div - we already know it is 50px since we styled it but just to make sure.
        var scrollW1 = $("#sizeScrollDivOne").width();
        // Find the inner width of the inner(child) div.
        var scrollW2 = $("#sizeScrollDivTwo").innerWidth();
        jQuery("#sizeScrollDivOne").remove(); // remove the html from your document
        return scrollW1 - scrollW2; // subtract the difference
    }(jQuery);

    (function ($) {
        var qTipTimer;
        //live init qtip for all element which has class 'QTip'
        var qtipAPI = $('<div/>').qtip({
            overwrite: false, //Make sure the tooltip won't be overridden once created
            content: ' ', //intentionally insert 'space', content must not empty when init qtip
            position: {
                viewport: $(window),
                adjust: {
                    method: 'shift'
                }
            }
        }).data('qtip').render();
        var onQtip = false;
        var _show_ = function () { //call in '.QTip' -> e.currentTarget
            if ( qTipTimer !== undefined ) {
                clearTimeout(qTipTimer);
            }
            //Bind the qTip within the event handler
            var $this = $(this);
            var text = $this.attr('title');
            if ( text ) {
                $this.data('title', text);
                $this.removeAttr('title');
            }
            else {
                text = $this.data('title');
            }
            qtipAPI.elements.tooltip.stop().hide();
            var $thisData = $this.data();
            if ( $thisData != null ) {
                qtipAPI.set('position.my', $thisData.qtipMy || 'bottom center');
                qtipAPI.set('position.at', $thisData.qtipAt || 'top center');
                if ( $thisData.qtipAjust !== undefined ) {
                    var ajust = $thisData.qtipAjust.split(' ');
                    qtipAPI.set('position.adjust.x', parseInt(ajust[0]));
                    qtipAPI.set('position.adjust.y', parseInt(ajust[1]));
                }
                else {
                    qtipAPI.set('position.adjust.x', 0);
                    qtipAPI.set('position.adjust.y', 0);
                }

                if ( $thisData.qtipAjustMethod !== undefined ) {
                    qtipAPI.set('position.adjust.method', $thisData.qtipAjustMethod);
                }
            }
            
            qTipTimer = setTimeout(function () {
                if ( $this.is(':visible') ) {
                    qtipAPI
                        .set('content.text', text)
                        .set('position.target', $this)
                        .show();
                }
            }, 100);
        }
        var _hide_ = function () { //call in '.QTip' -> e.currentTarget
            if ( qTipTimer !== undefined ) { //!== undefined also mean it is shown
                clearTimeout(qTipTimer);
            }
            qtipAPI.hide();
        }
        $(document).on('mouseenter', '.QTip', function(e) {
            _show_.apply(e.currentTarget);
        });
        $(document).on('mouseleave', '.QTip', function(e) {
            _hide_.apply(e.currentTarget);
        });
        $(document).on('mousedown', '.QTip:not(.QTipPermanent)', function(e) {
            _hide_.apply(e.currentTarget);
        });
        $(document).on('focus', 'input[type="text"]', function(e) {
            _hide_.apply(e.currentTarget);
        });

        if ( Zenwork !== undefined && Zenwork.Plugins != undefined ) {
            Zenwork.Plugins.Tip = qtipAPI;

            Zenwork.Plugins.Tip.showTip = function (onTarget) {
                _show_.apply(onTarget);
            }
            Zenwork.Plugins.Tip.hideTip = function (onTarget) {
                _hide_.apply(onTarget);
            }
        }
    })(jQuery);
});

String.prototype.shorten = function (maxLength) {
    return this.length <= maxLength ? this : this.substring(0, maxLength)+'...'; 
}
