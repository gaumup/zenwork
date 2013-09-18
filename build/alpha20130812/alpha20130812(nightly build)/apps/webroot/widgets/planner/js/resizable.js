/* jQuery resizable by gaumup(ukhome@gmail.com) */
/**
 * @use:
 *  - change DOM element position by dragging mouse
 *  - change DOM element size by dragging mouse at the edges of it
 * @depends:
 *	- jQuery core
 *	- jQuery widget
 *	- jQuery mouse
 * @change log:
 *  - v1.0: can only move/resize DOM element along x-axis
 */

//make sure DOM are ready
(function($) {
	$.widget('ui.resizable', $.ui.mouse, {
        widgetEventPrefix: 'resizable',

        //private member
            EVENT: {
                START: 'start',
                STOP: 'stop',
                START_MOVING: 'startMoving',
                START_RESIZING: 'startResizing',
                MOVING: 'moving',
                RESIZING: 'resizing',
                MOVED: 'moved',
                RESIZED: 'resized'
            },
            dragPoint: 0,
            isResizing: false,
            isResizableLeft: false,
            isResizableRight: false,
            isMovable: false,
            isMoving: false,
            isChange: false,
            lastDelta: 0,
            mouseDelta: 0,
            snapMouseDelta: 0,
            startPoint: 0,

        //options
            options: {
                boundaryMode: false,
                cssClass: {
                    disabled: 'Disabled',
                    lock: 'Lock',
                    move: 'Move',
                    resize: 'Resize',
                    select: 'Select'
                },
                edgeSensitive: 4,
                gridModel: { //only available when 'boundaryMode' is true
                    unitSize: 10, //min value bar can be moved/resized
                    leftEdge: 0, //relative position to container
                    rightEdge: $(document).width() //relative position to container
                },
                left: 0,
                tooltipText: {
                    move: 'Drag to move bar',
                    resize: 'Drag to resize bar'
                },
                disabled: false,
                disabledMoving: false,
                disabledResizing: false,
                width: 10 //default width for un-declared-width bar
            },

        //constructor
            _create: function () {
                var opts = this.options;
                var self = this;
                var element = this.element; //default $ widget 'element' is refer to trigger $(DOM)

                element.css({
                    left: opts.left,
                    width: opts.width == 0 ? opts.gridModel.unitSize : opts.width
                });
                element.bind('mousemove.resizable', function (e) {
                    if ( opts.disabled ) { return false; }
                    if ( element.hasClass(opts.cssClass.lock) ) { return false; }
                    //detect resize
                    if ( self.isResizing ) {
                        self.isMovable = false;
                        element.removeClass(opts.cssClass.move);
                    }
                    else if ( self.isMoving ) {
                        self.isResizableLeft = false;
                        self.isResizableRight = false;
                        element.removeClass(opts.cssClass.resize);
                    }
                    else { //!self.isResizing && !self.isMoving
                        //can resize left edge
                        if ( !opts.disabledResizing
                            && e.pageX >= element.offset().left
                            && e.pageX < element.offset().left+opts.edgeSensitive
                        ) { //resize on left edge
                            //element.attr("title", opts.tooltipText.resize);
                            self.isMovable = false;
                            element.removeClass(opts.cssClass.move);
                            self.isResizableLeft = true;
                            self.isResizableRight = false;
                            element.addClass(opts.cssClass.resize);
                        }
                        //can resize right edge
                        else if ( !opts.disabledResizing
                            && e.pageX > element.offset().left + element.width()-opts.edgeSensitive
                            && e.pageX <= element.offset().left + element.width()
                        ) { //resize on right edge
                            //element.attr("title", opts.tooltipText.resize);
                            self.isMovable = false;
                            element.removeClass(opts.cssClass.move);
                            self.isResizableLeft = false;
                            self.isResizableRight = true;
                            element.addClass(opts.cssClass.resize);
                        }
                        //can move
                        else if ( !opts.disabledMoving ) {
                            //element.attr("title", opts.tooltipText.move);
                            self.isResizableLeft = false;
                            self.isResizableRight = false;
                            element.removeClass(opts.cssClass.resize);
                            self.isMovable = true;
                            element.addClass(opts.cssClass.move);
                        }
                    }
                });
                element.bind('mousedown.resizable', function (e) {
                    if ( opts.disabled ) { return false; }
                    if ( element.hasClass(opts.cssClass.lock) ) { return false; }
                    element.addClass(opts.cssClass.select);
                    //detect start drag point
                    if ( !self.isResizableLeft && !self.isResizableRight && !self.isMovable ) { return false; }
                    self.dragPoint = e.pageX;
                    if ( self.isResizableLeft || self.isResizableRight ) {
                        self.isResizing = true;
                        self.isMoving = false;
                        if ( self.isResizableLeft ) {
                            self.startPoint = element.position().left;
                        }
                        else if ( self.isResizableRight ) {
                            self.startPoint = element.width();
                        }
                    }
                    else if ( self.isMovable ){
                        self.isResizing = false;
                        self.isMoving = true;
                        self.startPoint = element.position().left;
                    }
                    self._trigger(self.EVENT.START, e, self);
                    self._trigger(self.isMovable ? self.EVENT.START_MOVING : self.EVENT.START_RESIZING, e, self);
                    return false;
                });
                element.bind('mouseup.resizable', function (e) {
                    if ( opts.disabled ) { return false; }
                    element.removeClass(opts.cssClass.select);
                });

                this._mouseInit();
            },

        //destructor
            destroy: function () {
                this._mouseDestroy();
            },

        //public method
            disable: function () {
                this.options.disabled = true;
                this.element.addClass(this.options.cssClass.disabled);
            },
            disableMoving: function () {
                this.options.disabledMoving = true;
            },
            disableResizing: function () {
                this.options.disabledResizing = true;
            },
            enable: function () {
                this.options.disabled = false;
                this.element.removeClass(this.options.cssClass.disabled);
            },
            enableMoving: function () {
                this.options.disabledMoving = false;
            },
            enableResizing: function () {
                this.options.disabledResizing = false;
            },
            /**
             * return last delta change after moving/resizing element
             */
            getLastDelta: function () { return self.lastDelta; },

            /**
             * move DOM element by offset
             * parameters:
             * - offset: int
             * return true if moved successfully
             */
            move: function (offset) {
                if ( this.options.disabled || this.options.disabledMove ) { return false; }
                this.element.css({
                    left: '+=' + offset + 'px'
                });
                this.lastDelta = offset;
                this._movedCallback();
                return true;
            },

            /**
             * resize DOM element by offset
             * parameters:
             * - offset: int
             * return true if resized successfully
             */
            resize: function (offset) {
                if ( this.options.disabled || this.options.disabledResize ) { return false; }
                if ( this.element.width() + offset <= 0 ) { return false; }
                this.element.css({
                    width: '+=' + offset + 'px'
                });
                this.lastDelta = offset;
                this._resizedCallback();
                return true;
            },
            getIsResizing: function () { return this.isResizing; },
            getIsResizableLeft: function () { return this.isResizableLeft; },
            getIsResizableRight: function () { return this.isResizableRight; },
            getIsMoving: function () { return this.isMoving; },

        //private method
            _mouseStart: function (e) {},
            _mouseDrag: function (e) {
                var opts = this.options;
                var element = this.element;
                if ( opts.disabled ) { return false; }
                if ( (this.isResizing || this.isMoving) && !element.hasClass(opts.cssClass.lock) ) {
                    this.mouseDelta += e.pageX - this.dragPoint;
                    this.dragPoint = e.pageX;

                    if ( Math.abs(this.mouseDelta) >= opts.gridModel.unitSize ) {
                        this.isChange = true;

                        if ( this.mouseDelta > 0 ) {
                            var snapMouseDelta = Math.floor(this.mouseDelta/opts.gridModel.unitSize)*opts.gridModel.unitSize;
                        }
                        else {
                            var snapMouseDelta = Math.ceil(this.mouseDelta/opts.gridModel.unitSize)*opts.gridModel.unitSize;
                        }
                        if ( opts.boundaryMode ) { //limit movement between left/right
                            if ( element.width() < opts.gridModel.rightEdge - opts.gridModel.leftEdge ) {
                                if ( this.isMovable ) {
                                    if ( snapMouseDelta+element.position().left < opts.gridModel.leftEdge ) {
                                        snapMouseDelta = -element.position().left + opts.gridModel.leftEdge;
                                    }
                                    else if ( snapMouseDelta+element.position().left > opts.gridModel.rightEdge-element.width() ) {
                                        snapMouseDelta = -element.position().left + opts.gridModel.rightEdge-element.width();
                                    }
                                }
                                else {
                                    if ( this.isResizableLeft && snapMouseDelta+element.position().left < opts.gridModel.leftEdge ) {
                                        snapMouseDelta = -element.position().left + opts.gridModel.leftEdge;
                                    }
                                    else if ( this.isResizableRight && snapMouseDelta+element.position().left > opts.gridModel.rightEdge-element.width() ) {
                                        snapMouseDelta = -element.position().left + opts.gridModel.rightEdge-element.width();
                                    }
                                }
                            }
                            else {
                                if ( (this.isResizableLeft && snapMouseDelta < 0) || (this.isResizableRight && snapMouseDelta > 0) || this.isMovable ) {
                                    snapMouseDelta = 0;
                                }
                            }
                        }

                        //moving
                        if ( this.isMoving ) {
                            element.css({
                                left: element.position().left + snapMouseDelta
                            });
                        }
                        //resizing
                        else {
                            //choose the right is the positive direction (+)
                            var direction = this.isResizableLeft ? -1 : 1;
                            if ( element.width() + direction*snapMouseDelta < opts.gridModel.unitSize ) {
                                snapMouseDelta = direction*(-element.width() + opts.gridModel.unitSize);
                            }
                            if ( this.isResizableLeft ) {
                                element.css({
                                    left: element.position().left + snapMouseDelta
                                });
                            }
                            element.css({
                                //snap to grid_size => round-up 'this.mouseDelta' to 'grid_size' value
                                width: element.width() + direction*snapMouseDelta
                            });
                        }
                        this.mouseDelta -= snapMouseDelta;
                        this.snapMouseDelta = snapMouseDelta;

                        if ( this.isMoving || this.isResizing ) { //change event
                            this._trigger(this.isMoving ? this.EVENT.MOVING : this.EVENT.RESIZING, e, this);
                        }
                    }
                }
            },
            _mouseStop: function (e) {
                var opts = this.options;
                var element = this.element;
                if ( opts.disabled ) { return false; }
                if ( (this.isResizing || this.isMoving) ) {
                    if ( this.isChange ) {
                        if ( this.isMoving ) {
                            this.lastDelta = element.position().left - this.startPoint;
                            this._movedCallback();
                        }
                        else {
                            this.lastDelta = this.isResizableLeft
                                ? this.startPoint - element.position().left
                                : element.width() - this.startPoint;
                            this._resizedCallback();
                        }
                        this._trigger(this.isMoving ? this.EVENT.MOVED : this.EVENT.RESIZED, e, this);
                        this.isChange = false;
                    }
                    this._trigger(this.EVENT.STOP, e, this); //stop event
                }
                this._releaseMouseCallback(e);
            },
            _mouseUp: function (e) {
                if ( this.snapMouseDelta == 0 ) {
                    this._releaseMouseCallback(e);
                }
                this._super(e);
            },
            _movedCallback: function () {
                this.element.data('left', this.element.position().left);
            },
            _resizedCallback: function () {
                this.element.data('width', this.element.width());
                this.element.data('left', this.element.position().left);
            },
            _releaseMouseCallback: function (e) {
                //reset init var
                this.isResizing = false;
                this.isResizableLeft = false;
                this.isResizableRight = false;
                this.isMovable = false;
                this.isMoving = false;
                this.mouseDelta = 0;
                this.snapMouseDelta = 0;

                //clear style
                this.element.removeClass(this.options.cssClass.resize);
                this.element.removeClass(this.options.cssClass.move);
                this.element.removeClass(this.options.cssClass.select);
            }
    });

    //version
    $.extend($.ui.resizable, {
        version: '1.0'
    });
})(jQuery);