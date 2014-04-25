/* jQuery stream by gaumup(ukhome@gmail.com) */
/**
 * @use:
 *  - manipulate stream list in app
 * @depends:
 *  - jQuery core
 *  - jQuery widget
 *  - plupload widget
 *  - zenwork.js
 *  - widgets/uploader
 *  - widgets/comment
 *  - jquery.mjs.nestedSortable (https://github.com/mjsarfatti/nestedSortable)
 * @change log:
 *  - v1.0: initial
 *  - v1.1: modified some widgets dependancies: zenwork, uploader, comment
 */

//make sure DOM are ready
(function($) {
    $.widget('ui.stream', {
        widgetNamespace: 'stream',
        widgetEventPrefix: 'stream',

        /* note:
         * - streamElement --> <li> class = StreamElement
         * - stream --> <div id="s[id]"> class = StreamRow
         */

        //private member
            PREFIX: 's',
            EVENT: {
                ADD: 'add',
                COMPLETED: 'completed',
                UNCOMPLETED: 'uncompleted',
                DELETED: 'deleted',
                DELETED_ALL: 'deletedAll',
                SELECTING: 'selecting',
                SELECTED: 'selected',
                UNSELECTING: 'unselecting',
                UNSELECTED: 'unselected',
                COLLAPSED: 'collapsed',
                EXPANDED: 'expanded',
                COLLAPSED_ALL: 'collapsedAll',
                EXPANDED_ALL: 'expandedAll',
                INDENTED: 'indented',
                OUTDENTED: 'outdented',
                SINGLE_COMPLETED: 'singleCompleted',
                SINGLE_UNCOMPLETED: 'singleUnCompleted',
                SORTING: 'sorting',
                SCROLL: 'scroll'
            },
            indexTable: {}, //pair of key/value = index/id(server id)

        //option
            options: {
                cssClass: {
                    streamCreator: 'StreamCreator',
                    streamElement: 'StreamElement',
                    streamElementPending: 'StreamElementPending',
                    streamLeaf: 'StreamLeaf',
                    streamNode: 'StreamNode',
                    streamNodeExpanded: 'StreamNodeExpanded',
                    streamRow: 'StreamRow',
                    streamField: 'StreamField',
                    streamPlaceHolder: 'StreamPlaceHolder',
                    streamMarker: 'StreamMarker',
                    streamMarked: 'StreamMarked',
                    streamSelectAllBtn: 'StreamSelectAllBtn',
                    streamClearSelectionBtn: 'StreamClearSelectionBtn',
                    streamIndex: 'StreamIndex',
                    streamTag: 'StreamTag',
                    streamName: 'StreamName',
                    streamDetails: 'StreamDetails',
                    streamDetailsBtn: 'StreamDetailsBtn',
                    streamContextRequiredBtn: 'StreamContextRequiredBtn',
                    streamContextDisabledBtn: 'StreamContextDisabledBtn',
                    streamCommentBtn: 'StreamCommentBtn',
                    streamIndentBtn: 'StreamIndentBtn',
                    streamOutdentBtn: 'StreamOutdentBtn',
                    streamAttachmentBtn: 'StreamAttachmentBtn',
                    streamDeleteBtn: 'StreamDeleteBtn',
                    streamDeleteBtnPopup: 'StreamDeleteBtnPopup',
                    streamCompletionBtn: 'StreamCompletionBtn',
                    streamCompletionDisabledBtn: 'StreamCompletionDisabledBtn',
                    streamCompletedBtn: 'StreamCompletedBtn',
                    streamHeaderEditBtn: 'StreamHeaderEditBtn',
                    streamHeaderDoneBtn: 'StreamHeaderDoneBtn',
                    streamCommonLnk: 'StreamCommonLnk',
                    streamCompletion: 'StreamCompletion',
                    streamActionBtn: 'StreamActionBtn',
                    streamDraggingBtn: 'StreamDraggingBtn',
                    streamDraggingHelper: 'StreamDraggingHelper',
                    streamDraggingHelperError: 'StreamDraggingHelperError',
                    streamContextBtn: 'StreamContextBtn',
                    streamToggleBtn: 'StreamToggleBtn',
                    streamToggleViewAllExpaned: 'StreamToggleViewAllExpaned',
                    streamRowAddingHelper: 'StreamRowAddingHelper',
                    streamDialog: 'StreamDialog',
                    streamDialogDecor: 'StreamDialogDecor',
                    streamDialogScrollContent: 'StreamScrollContent',
                    streamDialogCloseBtn: 'StreamDialogCloseBtn',
                    streamDialogConfirmBtn: 'StreamDialogConfirmBtn',
                    streamInnerDialogTrigger: 'StreamInnerDialogTrigger',
                    streamFixedContent: 'StreamFixedContent',
                    streamDeletePending: 'StreamDeletePending',
                    uiSelecting: 'ui-selecting', //depends on jquery selectable
                    uiSelected: 'ui-selected', //depends on jquery selectable
                    streamAttachmentList: 'StreamAttachmentList',
                    streamAttachmentUploading: 'StreamAttachmentUploading',
                    streamAttachmentDownloadLnk: 'StreamAttachmentDownloadLnk',
                    streamAttachmentTime: 'StreamAttachmentTime',
                    streamAttachmentRemoveBtn: 'StreamAttachmentRemoveBtn',
                    autoResizeTextbox: 'AutoResizeTextbox',
                    calendarInput: 'CalendarInput'
                },
                listPrefix: '',
                baseIndex: 0,
                selectable: true,
                streamContextMenu: $('#streamContextMenu'),
                streamGroupContextMenu: $('#streamGroupContextMenu'),
                streamAddingRowHelper: $('#addingRowHelper'),
                //callback
                completed: function (e, item) {
                    //console.log('Completed: '+item);
                },
                deleted: function (e, item) {
                    //console.log('Deleted: '+item);
                },
                selecting: function (e, item) {
                    //console.log('Selecting: '+item);
                },
                selected: function (e, item) {
                    //console.log('Selected: '+item);
                },
                unselecting: function (e, item) {
                    //console.log('UnSelecting: '+item);
                },
                unselected: function (e, item) {
                    //console.log('UnSelected: '+item);
                },
                streamDialogOffset: {
                    x: 1,
                    y: 1
                },
                streamDialog: $('#streamDialog'),
                streamDialogContent: $('#streamDialogContent'),
                streamDialogAside: $('#streamDialogAside'),
                streamDialogDecorArrow: {
                    width: 7,
                    height: 13
                },
                //use id because is not exist at init time, available after ajax call
                streamDialogTitleId: 'streamDialogTitle',
                streamAttachmentListId: 'streamAttachmentList',
                streamAttachmentBrowseBtnId: 'streamBrowseFileBtn',
                streamAttachmentContainerId: 'streamAttachmentContainer',
                streamAttachmentDropboxId: 'streamBrowseDropbox',
                streamDialogTabsId: 'streamDialogTab',
                useModel: 'Stream'
            },

        //constructor
            _create: function () {
                var self = this;
                var opts = this.options;
                var element = this.element;
                var _closeUtil_ = function () {
                    opts.streamContextMenu.addClass('Hidden');
                    opts.streamGroupContextMenu.addClass('Hidden');
                    Zenwork.StreamPopup.close();
                }
                var onScroll = false;

                //create selectable(stream item) on stream list
                if ( opts.selectable ) {
                    var onDraggingList = true;
                    var mouseTimer;
                    var y;

                    element.selectable({
                        filter: '.'+opts.cssClass.streamRow,
                        delay: 50,
                        start: function () {
                            var focusInput = element.find('li > .StreamRow .StreamName input:focus');
                            if ( focusInput.length > 0 ) {
                                focusInput.blur();
                            }
                            _closeUtil_();
                        },
                        selecting: function (e, ui) {
                            _closeUtil_();
                            self._trigger(self.EVENT.SELECTING, e, ui.selecting);
                        },
                        selected: function (e, ui) {
                            self._trigger(self.EVENT.SELECTED, e, ui.selected);
                        },
                        unselecting: function (e, ui) {
                            self._trigger(self.EVENT.UNSELECTING, e, ui.unselecting);
                        },
                        unselected: function (e, ui) {
                            self._trigger(self.EVENT.UNSELECTED, e, ui.unselected);
                        }
                    });
                    element.on('mousedown', function (e) {
                        mouseTimer = setTimeout(function () {
                            element.selectable('enable');
                            onDraggingList = false;
                            element.css({
                                cursor: 'default'
                            });
                        }, 200);
                        element.css({
                            cursor: 'url(widgets/stream/images/cursor-close-hand.cur),auto'
                        });
                        element.selectable('disable');
                        onDraggingList = true;
                        y = e.pageY;
                    });
                    element.on('mouseup', function (e) {
                        element.css({
                            cursor: 'default'
                        });
                        element.selectable('enable');
                        onDraggingList = false;
                        y = e.pageY;
                    });
                    element.on('mousemove', function (e) {
                        if ( onDraggingList ) {
                            if ( mouseTimer !== undefined ) { clearTimeout(mouseTimer); }
                            var deltaY = e.pageY - y;
                            if ( Math.abs(deltaY) > 10 ) {
                                self._trigger(self.EVENT.SCROLL, e, deltaY);
                                y = e.pageY;
                            }
                        }
                    });
                }

                element.on('click.stream', '.'+opts.cssClass.streamRow, function (e) {
                    _closeUtil_();
                    var stream = $(e.currentTarget);
                    if ( !stream.hasClass(opts.cssClass.uiSelected) ) {
                        self._clearSelectedStream(e);
                        self._trigger(self.EVENT.SELECTING, e, stream.addClass(opts.cssClass.uiSelected));
                    }
                    e.stopPropagation();
                });

                //live focus&blur event on input stream's name field in stream item
                element.on('focus.stream', '.'+opts.cssClass.streamName+' > input', function (e) {
                    _closeUtil_();
                    var $this = $(this);
                    var stream = $this.parent().parent();
                    if ( stream.hasClass(opts.cssClass.uiSelected) ) {
                        return false;
                    }

                    element.find('.'+opts.cssClass.uiSelected)
                        .removeClass(opts.cssClass.uiSelected)
                        .each(function () {
                            self._trigger(self.EVENT.UNSELECTED, e, $(this));
                        });

                    self._trigger(self.EVENT.SELECTED, e, stream.addClass(opts.cssClass.uiSelected));
                });
                element.on('blur.stream', '.'+opts.cssClass.streamName+' > input', function (e) {
                    var $this = $(this);
                    var stream = $this.parent().parent();
                    if ( String(stream.data('creatorID')) !== Zenwork.Auth.User.id
                        && Zenwork.Planner !== undefined && Zenwork.Planner.creatorID !== Zenwork.Auth.User.id ) { return false; }

                    if ( this.value == '' ) { this.value = stream.data('name'); }

                    /* litte trick to move cursor to the beginning when blur text input */
                    var value = this.value;
                    this.value = '';
                    this.value = value;
                });
                element.on('keyup.stream', '.'+opts.cssClass.streamName+' > input', function (e) {
                    var $this = $(this);
                    var stream = $this.parent().parent();
                    if ( String(stream.data('creatorID')) !== Zenwork.Auth.User.id
                        && Zenwork.Planner !== undefined && Zenwork.Planner.creatorID !== Zenwork.Auth.User.id ) { return false; }
                    
                    if ( this.value == '' || stream.data('name') === this.value ) { 
                        return false;
                    } //no change or empty

                    var streamData = stream.data();

                    $this.attr('title', this.value);
                    streamData.name = this.value;

                    //live update changed data
                    Zenwork.Model.liveUpdate({
                        id: streamData.id,
                        name: this.value
                    }, opts.useModel, Zenwork.Model.CU, streamData.clientID);
                });

                //live event on %complete button on stream item
                element.on('click.stream', '.'+opts.cssClass.streamCompletionBtn, function (e) {
                    var $this = $(this);
                    var stream = $($this.attr('href'));
                    if ( String(stream.data('creatorID')) !== Zenwork.Auth.User.id
                        && Zenwork.Planner !== undefined && Zenwork.Planner.creatorID !== Zenwork.Auth.User.id ) { return false; }

                    if ( !$this.hasClass(opts.cssClass.streamCompletedBtn) ) {
                        self._markStreamAsCompleted($this, stream, e);
                    }
                    else {
                        self._markStreamAsUncompleted($this, stream, e);
                    }

                    //flush data from model buffer
                    Zenwork.Model.flush();

                    $this.blur();
                    e.preventDefault();
                });
                element.on('mousedown.stream', '.'+opts.cssClass.streamCompletionBtn, function (e) {
                    e.stopPropagation();
                });

                //live event on marker
                element.on('click.stream', '.'+opts.cssClass.streamMarker+' a', function (e) {
                    opts.streamGroupContextMenu.addClass('Hidden');
                    var highlightStreams = element.find('.'+opts.cssClass.uiSelected);
                    var $this = $(this);
                    if ( $($this.attr('href')).hasClass(opts.cssClass.uiSelected) ) {
                        if ( highlightStreams.length > 0 ) {
                            if ( !$this.hasClass(opts.cssClass.streamMarked) ) {
                                $('.'+opts.cssClass.streamMarked).removeClass(opts.cssClass.streamMarked);
                            }
                            highlightStreams.find('.'+opts.cssClass.streamMarker+' a').toggleClass(opts.cssClass.streamMarked);
                        }
                    }
                    else {
                        if ( highlightStreams.length > 0 ) {
                            $('.'+opts.cssClass.streamMarked).removeClass(opts.cssClass.streamMarked);
                        }
                        self._clearSelectedStream();
                        $this.toggleClass(opts.cssClass.streamMarked);
                    }
                    return false;
                });
                element.on('mousedown.stream', '.'+opts.cssClass.streamMarker+' a', function (e) {
                    e.stopPropagation();
                });
                $('#streamBatchActionTrigger').on('click.stream', function (e) {
                    self._openStreamGroupContextMenu(e);
                    return false;
                });
                $('#streamToggleRowViewTrigger').on('click.stream', function (e) {
                    $(e.currentTarget).toggleClass(opts.cssClass.streamToggleViewAllExpaned);
                    self._toggleAllStreamsView(e);
                    return false;
                });

                //live event on context/details/toggle button
                element.on('mousedown.stream', '.'+opts.cssClass.streamActionBtn, function (e, callback) {
                    if ( e.button == 2 ) { return true; }
                    var $this = $(this);
                    if ( $this.hasClass('Pending') ) { return false; }
                    $this.addClass('Pending');
                    setTimeout(function () { //little trick to prevent click too fast
                        _closeUtil_();
                        var $stream = $($this.attr('href'));
                        //de-select current row
                        var $currentSelectedStream = $('.'+opts.cssClass.uiSelected);
                        $currentSelectedStream.removeClass(opts.cssClass.uiSelected);
                        self._trigger(self.EVENT.UNSELECTING, e, $currentSelectedStream);
                        
                        //select new row
                        $stream.addClass(opts.cssClass.uiSelected);
                        self._trigger(self.EVENT.SELECTING, e, $stream);
                        if ( $this.hasClass(opts.cssClass.streamContextBtn) ) {
                            self._openStreamContextMenu(e);
                        }
                        else if ( $this.hasClass(opts.cssClass.streamDetailsBtn) ) {
                            self._openStreamDetails(e, $stream, 'comment', callback);
                        }
                        else if ( $this.hasClass(opts.cssClass.streamToggleBtn) ) {
                            self._toggleStreamView(e, $stream); //heavy works...
                        }
                        else if ( $this.hasClass(opts.cssClass.streamTag) ) {
                            Zenwork.TagDialog.show($this);
                        }
                        $this.removeClass('Pending');
                    }, 1);
                    return false;
                });
                element.on('click.stream', '.'+opts.cssClass.streamActionBtn, function (e) {
                    $(e.currentTarget).blur();
                    return false;
                });

                //init dynamic adding row handler
                if ( Zenwork.Planner !== undefined ) {
                    var onAddingStream = null;
                    var onAddingRow = null;
                    var _resetAddingRow_ = function () {
                        onAddingStream = null;
                        onAddingRow = null;
                        opts.streamAddingRowHelper.addClass('Hidden');
                    }
                    var _showAddingRowHelper_ = function (target) {
                        opts.streamAddingRowHelper
                            .removeClass('Hidden')
                            .position({
                                my: 'left center',
                                at: 'left+8 bottom-1',
                                of: target,
                                collision: 'none'
                            });
                    }
                    element.on('mousemove.stream', '.'+opts.cssClass.streamRow, function (e) {
                        var stream = $(e.currentTarget);
                        if ( !opts.onSorting && !onScroll ) {
                            onAddingStream = stream;
                            onAddingRow = stream.parent();
                            var currentTargetHeight = stream.height();
                            var innerOffset = e.pageY - stream.offset().top;
                            if ( innerOffset >= currentTargetHeight*0.95 ) {
                                _showAddingRowHelper_(stream);
                                Zenwork.Plugins.Tip.showTip(opts.streamAddingRowHelper);
                            }
                        }
                    });
                    opts.streamAddingRowHelper.on('click.stream', function (e) {
                        Zenwork.Notifier.notify('Adding new row...');
                        //if ( opts.streamAddingRowHelper.hasClass('Pending') ) { return false; }
                        opts.streamAddingRowHelper.addClass('Pending');
                        var configData = opts.streamAddingRowHelper.data();
                        var config = {
                            parentID: self._isLeaf(onAddingStream)
                                ? onAddingStream.data('parentID')
                                : onAddingStream.data('id'),
                            listID: Zenwork.List.active,
                            streamExtendModel: configData.streamExtendModel,
                            timelinePrefix: configData.timelinePrefix,
                            index: onAddingStream.data('index')+1,
                            offset: -(onAddingRow.nextAll('li').length)
                        };
                        var exportConfig = {};
                        self._addNewStream(
                            config,
                            true,
                            function (insertIndex) {
                                exportConfig = Zenwork.Planner.app.planner('addTimelinePlaceholder', insertIndex, true);
                            },
                            function (stream) {
                                if ( config.parentID != 0 ) {
                                    var parentStreamElement = $('#'+self.PREFIX+config.parentID).parent();
                                    //update parent stream completion status, recursively
                                    self._updateStreamCompletion(e, parentStreamElement.find('.'+opts.cssClass.streamRow).eq(0));
                                }
                                self._trigger(self.EVENT.ADD, e, [stream, exportConfig, function (e) { //callback
                                    stream.parent().removeClass(opts.cssClass.streamElementPending);
                                    opts.streamAddingRowHelper.removeClass('Pending');

                                    //flush buffer data
                                    Zenwork.Model.flush();
                                }]);
                            }
                        );
                        return false;
                    });
                    opts.streamAddingRowHelper.on('mouseover.stream', function (e) {
                        //stop propagation here prevent showing qtip too
                        //so, call it manually in 'element.on('mousemove.stream', '.'+opts.cssClass.streamRow)'
                        e.stopPropagation();
                    });
                    opts.streamAddingRowHelper.on('mouseout.stream', function (e) {
                        Zenwork.Plugins.Tip.hideTip(); //force hide
                    });
                    
                    //hide add row icon
                    $(document).on('mouseover.stream', function (e) {
                        if ( !opts.onSorting ) {
                            _resetAddingRow_();
                        }
                    });
                    //close stream context menu
                    $(document).on('click.stream', function (e) {
                        if (e.which == 3) { e.stopPropagation(); }
                        else {
                            _closeUtil_();
                            self._clearSelectedStream(e);
                        }
                    });
                }
                
                //stream context menu action
                opts.streamContextMenu.on('click.stream', 'a', function (e, callback) {
                    var $this = $(this);
                    var $stream = $($this.attr('href'));

                    if ( $this.hasClass(opts.cssClass.streamCommentBtn) ) {
                        self._openStreamDetails(e, $stream, 'comment');
                    }
                    else if ( $this.hasClass(opts.cssClass.streamAttachmentBtn) ) {
                        self._openStreamDetails(e, $stream, 'attachment');
                    }
                    else if ( $this.hasClass(opts.cssClass.streamDeleteBtn) ) {
                        self._deleteStream(e, $stream, true, callback);
                    }
                    else if ( $this.hasClass(opts.cssClass.streamIndentBtn) ) {
                        self._indentStream(e, $stream);
                    }
                    else if ( $this.hasClass(opts.cssClass.streamOutdentBtn) ) {
                        self._outdentStream(e, $stream);
                    }

                    opts.streamContextMenu.addClass('Hidden');
                    $this.blur();
                    return false;
                });

                //stream group context menu action
                opts.streamGroupContextMenu.on('click.stream', 'a', function (e, callback) {
                    var $this = $(this);
                    var streams = $([]);
                    $('.'+opts.cssClass.streamMarked).each(function () {
                        streams = streams.add($($(this).attr('href')));
                    });;

                    if ( $this.hasClass(opts.cssClass.streamSelectAllBtn) ) {
                        element.find('.'+opts.cssClass.streamMarker+' a').addClass(opts.cssClass.streamMarked);
                    }
                    else if ( $this.hasClass(opts.cssClass.streamClearSelectionBtn) ) {
                        if ( streams.length > 0 ) {
                            $('.'+opts.cssClass.streamMarked).removeClass(opts.cssClass.streamMarked);
                        }
                    }
                    else if ( $this.hasClass(opts.cssClass.streamDeleteBtn) ) {
                        if ( streams.length > 0 ) {
                            self._deleteStream(e, streams, true, callback);
                        }
                    }
                    else if ( $this.hasClass(opts.cssClass.streamIndentBtn) ) {
                    }
                    else if ( $this.hasClass(opts.cssClass.streamOutdentBtn) ) {
                    }

                    if ( !$this.hasClass(opts.cssClass.streamSelectAllBtn) ) {
                        opts.streamGroupContextMenu.addClass('Hidden');
                    }
                    else {
                        opts.streamGroupContextMenu.find('a').removeClass(opts.cssClass.streamContextDisabledBtn);
                    }
                    $this.blur();
                    return false;
                });
               
                var scrollIdle;
                element.parent().on('scroll.stream', function (e) {
                    var target = $(e.currentTarget);
                    var scrollTop = target.scrollTop();
                    if ( scrollIdle !== undefined ) { clearTimeout(scrollIdle); }
                    scrollIdle = setTimeout(function () {
                        if ( target.scrollTop() === scrollTop ) {
                            onScroll = false;
                        }
                    }, 500);
                    onScroll = true;
                    opts.streamContextMenu.addClass('Hidden');
                    Zenwork.StreamPopup.close();
                });

                //live dialog event on stream
                element.on(Zenwork.StreamPopup.EVENT.VIEW_COMMENT, '.'+opts.cssClass.streamRow, function (e) {
                    self._loadStreamCommentBox(e, $(e.currentTarget));
                });
                element.on(Zenwork.StreamPopup.EVENT.VIEW_ATTACHMENT, '.'+opts.cssClass.streamRow, function (e) {
                    self._loadStreamAttachmentBox(e, $(e.currentTarget));
                });

                //live comment event on stream
                element.on(Zenwork.Comment.EVENT.POST, '.'+opts.cssClass.streamRow, function (e, data, attachment) {
                    var stream = $(e.currentTarget);
                    var streamData = stream.data();
                    streamData.countComment += 1;
                    Zenwork.StreamPopup.updateCommentView(+1);

                    //update attachment if available
                    streamData.countAttachment += attachment;
                    Zenwork.StreamPopup.updateAttachmentView(attachment);
                });
                element.on(Zenwork.Comment.EVENT.DELETED, '.'+opts.cssClass.streamRow, function (e, attachment) {
                    var stream = $(e.currentTarget);
                    var streamData = stream.data();
                    streamData.countComment -= 1;
                    Zenwork.StreamPopup.updateCommentView(-1);

                    //update attachment if available
                    streamData.countAttachment -= attachment;
                    Zenwork.StreamPopup.updateAttachmentView(-attachment);
                });
                element.on(Zenwork.Comment.EVENT.INPUT_RESIZED, '.'+opts.cssClass.streamRow, function (e) {
                    self._ajustDialogScrollAsideSize();
                });
                element.on(Zenwork.Comment.EVENT.DELETED_ATTACHMENT, '.'+opts.cssClass.streamRow, function (e) {
                    var stream = $(e.currentTarget);
                    var streamData = stream.data();
                    streamData.countAttachment -= 1;
                    Zenwork.StreamPopup.updateAttachmentView(-1);
                });

                //live attachment event on stream
                element.on(Zenwork.Uploader.EVENT.UPLOADED, '.'+opts.cssClass.streamRow, function (e, data) {
                    var stream = $(e.currentTarget);
                    var streamData = stream.data();
                    streamData.countAttachment += 1;
                    Zenwork.StreamPopup.updateAttachmentView(+1);
                    //update comment(auto post add)
                    streamData.countComment += 1;
                    Zenwork.StreamPopup.updateCommentView(+1);
                });
                element.on(Zenwork.Uploader.EVENT.DELETED, '.'+opts.cssClass.streamRow, function (e) {
                    var stream = $(e.currentTarget);
                    var streamData = stream.data();
                    streamData.countAttachment -= 1;
                    Zenwork.StreamPopup.updateAttachmentView(-1);
                    //update comment(auto post delete)
                    streamData.countComment += 1;
                    Zenwork.StreamPopup.updateCommentView(+1);
                });
                
                //init stream dialog
                this._initStreamDialog();

                //init sortable stream
                this._initSortable();
            },

        //destructor
            _destroy: function () {
                this._mouseDestroy();
            },

        //reset
            reset: function () {
                //reset private member
                this.indexTable = {};
                this.element.empty();

                //reset dynamic add row data
                if ( Zenwork.Planner !== undefined ) {
                    this.options.streamAddingRowHelper.attr('data-list-id', Zenwork.List.active);
                }
            },

        //public method
            addNewStream: function (config, isAjax, before, callback) {
                return this._addNewStream(config, isAjax, before, callback);
            },
            count: function () {
                return this._count();
            },
            deleteAllStreams: function (callback) {
                var opts = this.options;
                var marked = $('.'+opts.cssClass.streamMarker+' a').addClass(opts.cssClass.streamMarked);
                if ( marked.length == 0 && callback !== undefined ) {
                    callback(false);
                }
                opts.streamGroupContextMenu.find('.'+opts.cssClass.streamDeleteBtn).trigger('click.stream', [
                    function (isSuccess) {
                        if ( !isSuccess ) {
                            marked.removeClass(opts.cssClass.streamMarked);
                        }
                        if ( callback !== undefined ) { callback(isSuccess); }
                    }
                ]);
            },
            getStreamHeight: function () {
                return this.element.find('.'+this.options.cssClass.streamRow).eq(0).height();
            },
            getIndexTable: function () {
                return this.indexTable;
            },
            getPrefix: function () {
                return this.PREFIX;
            },
            getStreamRows: function () {
                return this.element.find('.'+this.options.cssClass.streamRow);
            },
            getChildren: function (stream) {
                return this._getChildren(stream);
            },
            getNumberCompletedChildren: function (stream) {
                return this._getNumberCompletedStream(stream);
            },
            getStreamAtIndex: function (index) { //getter
                return this._getStreamAtIndex(index);
            },
            getStreamIndex: function (stream) { //getter
                return this._getStreamIndex(stream);
            },
            isLeaf: function (stream) {
                return this._isLeaf(stream);
            },
            isExpanded: function (stream) {
                return stream.parent().hasClass(this.options.cssClass.streamNodeExpanded);
            },
            indentStream: function (stream) {
                this._indentStream(stream);
            },
            hideContextMenu: function () {
                this.options.streamContextMenu.addClass('Hidden');
                this.options.streamGroupContextMenu.addClass('Hidden');
            },
            markStreamAsCompleted: function (stream) {
                var checkbox = stream.find('.'+this.options.cssClass.streamCompletionBtn).eq(0);
                this._markStreamAsCompleted(checkbox, stream);
            },
            markStreamAsUnCompleted: function (stream) {
                var checkbox = stream.find('.'+this.options.cssClass.streamCompletionBtn).eq(0);
                this._markStreamAsUncompleted(checkbox, stream);
            },
            markSingleStreamAsCompleted: function (stream) {
                this._markSingleStreamAsCompleted(stream);
            },
            markSingleStreamAsUnCompleted: function (stream) {
                this._markSingleStreamAsUnCompleted(stream);
            },
            moveStreamInside: function (target, stream) {
                this._addStream(target.parent(), stream.parent(), 'inside');
            },
            markStreamListReorder: function () {
                this.element.addClass(this.options.cssClass.streamListIndexed);
            },
            nodeToLeaf: function (stream) {
                stream.parent()
                    .removeClass(this.options.cssClass.streamNode)
                    .addClass(this.options.cssClass.streamLeaf);
            },
            outdentStream: function (stream) {
                this._outdentStream(stream);
            },
            restructureStreamList: function () {
                this._restructure();
            },
            setStreamIndex: function (stream, index) { //setter
                stream.data('index', index).find('.'+this.options.cssClass.streamIndex).eq(0).text(index);
            },
            selectStream: function (e, stream) {
                this._clearSelectedStream(e);
                stream.addClass(this.options.cssClass.uiSelected);
            },
            toggleStreamView: function (e, stream) {
                this._toggleStreamView(e, stream);
            },
            updateStreamTag: function (e, stream, added, label) {
                this._updateStreamTag(e, stream, added, label);
            },
            viewDetails: function (sid, fakescroll) {
                var stream = $('#'+this.PREFIX+sid).find('.'+this.options.cssClass.streamDetailsBtn);
                var clip = this.element.parent();
                var offset = stream.position().top - clip.height()/2;
                if ( offset > 0 ) {
                    fakescroll.removeClass('Hidden').scrollTop(offset);
                }
                setTimeout(function () {
                    fakescroll.addClass('Hidden');
                    stream.trigger('mousedown');
                }, 1);
            },

        //private method
            _addNewStream: function (config, isAjax, before, callback) {
                var self = this;
                var opts = this.options;
                var index = (this.element.find('li').length+1+opts.baseIndex);
                var appendAtBottom = true;
                if ( config.index !== undefined && config.index < index ) { //insert between list
                    appendAtBottom = false;
                }
                var tabIndex = index;
                var postData = $.extend(true, {
                    index: index,
                    name: 'Untitled',
                    completed: false,
                    parentID: 0,
                    listID: Zenwork.List.active
                }, config);
                delete postData.timelinePrefix;
                var _appendHelper_ = function (streamElement, index) {
                    if ( index === undefined ) {
                        self.element.append(streamElement);
                    }
                    else {
                        var insertAfterStream = self._getStreamAtIndex(index-1);
                        //if insertAfterStream is NODE -> do many things after then
                        if ( !self._isLeaf(insertAfterStream) ) {
                            //many things to do here
                            insertAfterStream.next('ul').prepend(streamElement);
                        }
                        else {
                            insertAfterStream.parent().after(streamElement);
                        }
                        //on server-side when insert index which exists, index update automatically
                        //so do not need to update indexes on followed streams, 3rd params 'addBuffer'->false
                        self._restructure(index-1, undefined, false);
                    }
                    return index;
                }
                var placeholder = $('<li class="'+opts.cssClass.streamElementPending+' '+opts.cssClass.streamElement+' '+opts.cssClass.streamLeaf+'">');
                var _util_ = function (data) {
                    var isCreator = String(data.creatorID) === Zenwork.Auth.User.id
                        || (Zenwork.Planner !== undefined && Zenwork.Planner.creatorID === Zenwork.Auth.User.id);
                    var sid = self.PREFIX+data.id;
                    var tid = config.timelinePrefix+data.id;
                    //DOM
                    var tag = data.tag == '' ? '&ndash;' : '<strong>'+data.tag+'</strong>';
                    var streamElement = placeholder.addClass(isCreator ? opts.cssClass.streamCreator : '').html(
                        '<div id='+sid+' rel="#'+tid+'" class="StreamRow">'+
                        '    <div class="'+opts.cssClass.streamField+' '+opts.cssClass.streamMarker+'">'+
                        (isCreator
                            ? '<a href="#'+sid+'"></a>'
                            : ''
                        )+
                        '    </div>'+
                        '    <div class="'+opts.cssClass.streamField+' '+opts.cssClass.streamIndex+'">'+data.index+'</div>'+
                        '<div class="'+opts.cssClass.streamField+' '+opts.cssClass.streamPlaceHolder+' '+opts.cssClass.streamPlaceHolder+'Alt01">'+
                        (isCreator
                            ? '<a href="#'+sid+'" title="Hold and drag to reorder task" class="'+opts.cssClass.streamActionBtn+' '+opts.cssClass.streamDraggingBtn+'" data-qtip-ajust="0 10px">Drag to reorder</a>'
                            : ''
                        )+'</div>'+
                        '    <div class="'+opts.cssClass.streamField+' '+opts.cssClass.streamPlaceHolder+'"><a href="#'+sid+'" class="QTip '+opts.cssClass.streamActionBtn+' '+opts.cssClass.streamTag+'" title="Tags: '+tag+'" data-qtip-ajust="0 10px" data-sid="'+data.id+'">'+tag+'</a></div>'+
                        '    <div class="'+opts.cssClass.streamField+' '+opts.cssClass.streamPlaceHolder+'"><a href="#'+sid+'" title="" class="'+opts.cssClass.streamActionBtn+' '+opts.cssClass.streamContextBtn+'">Context menu</a></div>'+
                        '    <div class="'+opts.cssClass.streamField+' '+opts.cssClass.streamName+'">'+
                        '        <input '+(isCreator ? '' : 'readonly="readonly"')+' tabindex="'+data.index+'" class="QTip" title="'+data.name+'" type="text" value="'+data.name+'" spellcheck="false" />'+
                        '        <a href="#'+sid+'" title="" class="'+opts.cssClass.streamActionBtn+' '+opts.cssClass.streamToggleBtn+'">Click to expand/collapse stream</a>'+
                        '    </div>'+
                        '    <div class="'+opts.cssClass.streamField+' '+opts.cssClass.streamCompletion+'"><a href="#'+sid+'" title="" class="'+opts.cssClass.streamCompletionBtn+(data.completed == 1 ? ' '+opts.cssClass.streamCompletedBtn : '')+' '+(isCreator ? '' : opts.cssClass.streamCompletionDisabledBtn)+'">Toggle stream completion</a></div>'+
                        '    <div class="'+opts.cssClass.streamField+' '+opts.cssClass.streamDetails+'"><a href="#'+sid+'" title="" class="'+opts.cssClass.streamActionBtn+' '+opts.cssClass.streamDetailsBtn+'">Click to see stream\'s details</a></div>'+
                        '</div>'
                    );
                    _appendHelper_(streamElement, appendAtBottom ? undefined : data.index);
                    /*
                     * HOT FIX: concurrently editing plan
                     * cause lost parent or rendered order cause child rendered before parent inserted 
                     * -> solution: check for parent before performing child->parent insert action
                     */
                    if ( data.parentID != 0 && appendAtBottom ) {
                        var parentStream = $('#'+self.PREFIX+data.parentID);
                        if ( parentStream.length > 0 ) {
                            self._addStream(parentStream.parent(), streamElement, 'inside');
                        }
                        else {
                            data.parentID = 0;
                        }
                    }
                    var stream = $('#'+sid).data($.extend(data, {
                        'ui': self.element.attr('id'),
                        'clientID': sid,
                        'parentClientID': data.parentID == 0 ? 0 : self.PREFIX+data.parentID
                    }));
                    
                    $('#'+sid+' .'+opts.cssClass.streamName).trigger('focus.stream');
                    //set data object {} to stream element <div id="sid">
                    if ( callback !== undefined ) {
                        callback(stream, function () {
                            placeholder.removeClass(opts.cssClass.streamElementPending);
                        });
                    }
                    else {
                        placeholder.removeClass(opts.cssClass.streamElementPending);
                    }
                }

                //execute
                if ( before !== undefined ) { before(_appendHelper_(placeholder, appendAtBottom ? undefined : config.index)); }
                if (isAjax) {
                    $.ajax({
                        type: 'POST',
                        url: Zenwork.Planner.Config.baseURL+'/addNewStream',
                        dataType: 'json',
                        contentType: 'json',
                        data: JSON.stringify(postData),
                        success: function (data, textStatus, jqXHR) {
                            if (data) {
                                _util_(data);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            alert('Really sorry for this, network error! Please try again!');
                        }
                    });
                }
                else {
                    _util_(postData);
                }
            },

            _ajustDialogSize: function () {
                var opts = this.options;
                var parentBox = this.element.parent();
                var streamContainerBoxDimension = $.extend({}, $.getBoxPosition(parentBox), $.getBoxModel(parentBox));
                var streamCotainerHeight = streamContainerBoxDimension.height;
                //ajust outer height
                var streamDialogBoxModel = $.getBoxModel(opts.streamDialog);
                var streamDialogBoxDimension = $.getBoxPosition(opts.streamDialog);
                var streamDialogHeight = streamCotainerHeight
                    - streamDialogBoxModel.borderTop
                    - streamDialogBoxModel.borderBottom
                    - opts.streamDialogOffset.y;
                opts.streamDialog.css({
                    width: $(window).width() 
                        - streamContainerBoxDimension.width 
                        - streamContainerBoxDimension.leftAbs
                        - 30,
                    height: streamDialogHeight
                });
                //ajust content height
                var streamDialogContentBoxModel = $.getBoxModel(opts.streamDialogContent);
                var streamDialogContentHeight = streamDialogHeight
                    - streamDialogContentBoxModel.borderTop
                    - streamDialogContentBoxModel.borderBottom
                    - streamDialogContentBoxModel.paddingTop
                    - streamDialogContentBoxModel.paddingBottom;
                opts.streamDialogContent.css({
                    height: streamDialogContentHeight
                });
                opts.streamDialogAside.css({
                    height: streamDialogContentHeight
                });
            },

            _ajustDialogScrollContentSize: function () {
                var opts = this.options;
                var streamScrollContent = opts.streamDialogContent.find('.'+opts.cssClass.streamDialogScrollContent);
                var streamDialogFixedContentBox = opts.streamDialogContent.find('.'+opts.cssClass.streamFixedContent);
                var fixedHeight = 0;
                streamDialogFixedContentBox.each(function () {
                    fixedHeight += $(this).outerHeight(true); //included margin
                });
                var streamScrollContentBoxModel = $.getBoxModel(streamScrollContent);
                streamScrollContent.css({
                    height: opts.streamDialogContent.height() //excluded padding
                        - $('#'+opts.streamDialogTitleId).outerHeight(true)
                        - fixedHeight
                        - streamScrollContentBoxModel.paddingTop
                        - streamScrollContentBoxModel.paddingBottom
                });
                streamScrollContent.on('scroll', function (e) {
                    if ( Zenwork.Planner !== undefined 
                        && Zenwork.Dialog !== undefined
                    ) {
                        Zenwork.Dialog.close();
                    }
                });
            },

            _ajustDialogScrollAsideSize: function () {
                var opts = this.options;
                var streamScrollContent = opts.streamDialogAside.find('.'+opts.cssClass.streamDialogScrollContent);
                var streamDialogFixedContentBox = opts.streamDialogAside.find('.'+opts.cssClass.streamFixedContent);
                var fixedHeight = 0;
                streamDialogFixedContentBox.each(function () {
                    fixedHeight += $(this).outerHeight(true); //included margin
                });
                var streamScrollContentBoxModel = $.getBoxModel(streamScrollContent);
                streamScrollContent.css({
                    height: opts.streamDialogContent.height() //excluded padding
                        - $('#'+opts.streamDialogTabsId).outerHeight(true)
                        - fixedHeight
                        - streamScrollContentBoxModel.paddingTop
                        - streamScrollContentBoxModel.paddingBottom
                });
                streamScrollContent.on('scroll', function (e) {
                    if ( Zenwork.Dialog !== undefined ) {
                        Zenwork.Dialog.close();
                    }
                });
            },

            _ajustStreamDialogDecorBox: function (stream) {
                var opts = this.options;
                var decorBox = opts.streamDialog.find('.'+opts.cssClass.streamDialogDecor).eq(0);
                var streamDimension = $.getBoxPosition(stream);
                var streamBoxModel = $.getBoxModel(stream);
                var topPos = streamDimension.topRel
                    - streamBoxModel.borderTop
                    - streamBoxModel.borderBottom
                    - this.element.parent().position().top
                    + Math.floor((streamBoxModel.height - opts.streamDialogDecorArrow.height)/2)
                    - 1;
                decorBox.css({
                    backgroundPosition: '0 '+topPos+'px'
                });
            },

            /**
             * add stream into a specific position 'before | after | inside' a stream node
             */
            _addStream: function (targetElement, streamElement, position, callback) {
                var parentID = 0;
                switch (position) {
                    case 'inside':
                        if ( targetElement.find('li').length == 0 ) { //leaf node
                            var sub = $('<ul></ul>');
                            targetElement.removeClass(this.options.cssClass.streamLeaf).addClass(this.options.cssClass.streamNode).addClass(this.options.cssClass.streamNodeExpanded).append(sub.append(streamElement));
                        }
                        else {
                            targetElement.find('ul').eq(0).append(streamElement);
                        }
                        parentID = targetElement.find('> .'+this.options.cssClass.streamRow).eq(0).data('id');
                        break;
                    case 'after':
                        targetElement.after(streamElement);
                        parentID = targetElement.find('> .'+this.options.cssClass.streamRow).eq(0).data('parentID');
                        break;
                    case 'before':
                        targetElement.before(streamElement);
                        parentID = targetElement.find('> .'+this.options.cssClass.streamRow).eq(0).data('parentID');
                        break;
                }
                streamElement.find('> .'+this.options.cssClass.streamRow).eq(0).data({
                    'parentID': parentID,
                    'parentClientID': parentID == 0 ? 0 : this.PREFIX+parentID
                });

                if ( callback != undefined ) { callback(); }
            },

            _count: function () {
                return this.element.find('.'+this.options.cssClass.streamRow).length;
            },

            _siblings: function (stream, dir, wrapper) {
                wrapper == undefined ? function () {} : wrapper;
                return wrapper(dir == 'prev' ? stream.parent().prevAll('li') : stream.parent().nextAll('li')) ;
            },

            _clearSelectedStream: function (e) {
                var self = this;
                var opts = this.options;
                this.element.find('.'+this.options.cssClass.uiSelected).each(function () {
                    var $this = $(this);
                    $this.removeClass(opts.cssClass.uiSelected).find('input:focus').blur();
                    self._trigger(self.EVENT.UNSELECTED, e, $this);
                });
            },

            /**
             * liItem1: dragging element
             * liItem2: dropping on element
             */
            _checkValidReorder: function (liItem1, liItem2) {
                var tryTime = 0; //prevent 'while' go into infinitive loop
                var draggingElement = liItem1;
                var droppedElement = liItem2;
                var draggingElementLevel = this._getLevels(draggingElement);
                var droppedElementLevel = this._getLevels(droppedElement);
                //same levels or dragging element's level < dropping element's level
                //so they can be nested within each other
                if ( draggingElementLevel >= droppedElementLevel ) { return true; }
                else {
                    //do the hard work to find out result
                    //traverse up droppedElementLevel to draggingElementLevel+1
                    //then checkup its parentID is identical to draggingElement ID or not
                    //return 'true' if they are not identical
                    while ( droppedElementLevel > draggingElementLevel+1 ) {
                        tryTime++;
                        if ( tryTime > 100 ) { alert('"_checkValidReorder": too much recursion!'); break; }

                        droppedElementLevel--;
                        droppedElement = droppedElement.parent().parent();
                    }
                    return !(droppedElement.find('.'+this.options.cssClass.streamRow).data('parentID') 
                        === draggingElement.find('.'+this.options.cssClass.streamRow).data('id'));
                }
            }, 

            /**
             * descender: $(<li>)
             * ancestor: $(<li>)
             */
            _checkAncestor: function (descender, ancestor) {
                var tryTime = 0; //prevent 'while' go into infinitive loop
                var descenderLevel = this._getLevels(descender);
                var ancestorLevel = this._getLevels(ancestor);
                //same levels or descenderLevel < ancestorLevel
                //so they can be nested within each other
                if ( descenderLevel <= ancestorLevel ) { return false; }
                else {
                    //do the hard work to find out result
                    //traverse up descender to ancestorLevel+1
                    //then checkup its parentID is identical to ancestor ID or not
                    //return 'true' if they are identical
                    while ( descenderLevel > ancestorLevel+1 ) {
                        tryTime++;
                        if ( tryTime > 100 ) { alert('"_checkAncestor": too much recursion!'); break; }

                        descenderLevel--;
                        descender = descender.parent().parent();
                    }
                    return descender.find('.'+this.options.cssClass.streamRow).data('parentID') 
                        === ancestor.find('.'+this.options.cssClass.streamRow).data('id');
                }
            },

            _dialogUtil: function (stream) {
                var self = this;
                var opts = this.options;
                if ( !opts.streamDialog.hasClass('Hidden') ) {
                    this._ajustDialogSize();
                    this._ajustStreamDialogDecorBox(
                        stream !== undefined
                            ? stream
                            : $('.'+opts.cssClass.uiSelected).eq(0)
                    );
                    this._ajustDialogScrollContentSize();
                    this._ajustDialogScrollAsideSize();
                }
            },

            _deleteStream: function (e, removeStream, ajaxPost, callback) {
                var self = this;
                var opts = this.options;
                var deleteSIDs = [];
                var element = this.element;
                var _deleteConfirmed_ = function () {
                    Zenwork.StreamPopup.close();
                    Zenwork.Notifier.notify('Deleting...');

                    var minDeleteStreamIndex;
                    var deleteStreamsIndex = [];
                    removeStream.each(function () {
                        var $this = $(this).addClass(opts.cssClass.streamDeletePending);
                        $this.find('.'+opts.cssClass.streamName+' input').attr('disabled', 'disabled');
                        deleteSIDs.push($this.data('id'));
                        var tmpIndex = $this.data('index');
                        if ( minDeleteStreamIndex === undefined || minDeleteStreamIndex > tmpIndex ) {
                            minDeleteStreamIndex = tmpIndex;
                        }
                        if ( !self._isLeaf($this) ) {
                            var children = self._getChildren($this);
                            tmpIndex += children.length;
                            children.addClass(opts.cssClass.streamDeletePending).find('.'+opts.cssClass.streamName+' input').attr('disabled', 'disabled');
                        }
                        deleteStreamsIndex.push(tmpIndex);
                    });
                    var startRestructureStreamIndex = deleteStreamsIndex.min();
                    //use 'gt' -> index = startRestructureStreamIndex
                    //and get array index -> startRestructureStreamIndex-1
                    var collections = element.find('.'+opts.cssClass.streamRow+':gt('+(startRestructureStreamIndex-1-opts.baseIndex)+'):not(.'+opts.cssClass.streamDeletePending+')');
                    //re-index all streams from 'startRestructureStreamIndex' index
                    collections.each(function () {
                        var index = minDeleteStreamIndex++;
                        var $this = $(this);
                        var $thisData = $this.data();
                        $thisData.index = index;
                        $this.find('.StreamIndex').eq(0).text(index);
                    });
                    removeStream.each(function () {
                        self._trigger(self.EVENT.DELETED, e, [$(this), ajaxPost ? false : true]);
                        if ( callback !== undefined ) { callback(); }
                    });
                    //send delete action to server
                    if ( ajaxPost ) {
                        $.ajax({
                            type: 'POST',
                            url: Zenwork.Planner.Config.baseURL+'/deleteStream',
                            dataType: 'json', //receive from server
                            contentType: 'json', //send to server
                            data: JSON.stringify({
                                sids: deleteSIDs,
                                listID: Zenwork.List.active
                            }),
                            success: function (data, textStatus, jqXHR) {
                                if ( data.success ) {
                                    Zenwork.Notifier.notify('Updated', 2);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if ( textStatus !== 'abort' ) {
                                    alert('Really sorry for this, network error! Please try again!');
                                }
                            }
                        });
                    }
                }
                if ( ajaxPost ) {
                    Zenwork.Window.confirm('Confirm delete?', 
                        _deleteConfirmed_,
                        function () { if ( callback !== undefined ) { callback(false); } }
                    )
                }
                else {
                    _deleteConfirmed_();
                }
            },

            _getStreamAtIndex: function (index) {
                return this.element.find('.'+this.options.cssClass.streamRow+':eq('+(index-1)+')');
            },

            _getStreamIndex: function (stream) {
                return parseInt(stream.find('.'+this.options.cssClass.streamIndex).eq(0).text());
            },

            _getChildren: function (stream, filter) {
                var streams = stream.next('ul').find('.'+this.options.cssClass.streamRow);
                if ( filter != undefined ) {
                    return streams.filter(filter);
                }
                return streams;
            },

            _getNumberCompletedStream: function (stream) {
                var streams = stream.next('ul').find('.'+this.options.cssClass.streamCompletedBtn);
                return streams.length;
            },

            _getLevels: function (liItem) {
                var tryTime = 0; //prevent 'while' go into infinitive loop
                var levels = 1;
                var parentUL = liItem.parent();
                while ( !parentUL.is(this.element) ) {
                    tryTime++;
                    if ( tryTime > 100 ) { alert('"_getLevels": too much recursion!'); break; }

                    levels++;
                    parentUL = parentUL.parent().parent();
                }
                return levels;
            },

            _initSortable: function () {
                var oldIndex; //starting from 1
                var newIndex; //starting from 1
                var isValid = false;
                var droppedElement = null;
                var droppedAt = ''; //before | inside | after of current dropped stream
                var self = this;
                var opts = this.options;
                opts.onSorting = false;
                var helper = $('<div class="Hidden '+opts.cssClass.streamDraggingHelper+'"></div>').appendTo('body');
                var element = this.element;

                //internal function
                var _reset_ = function () {
                    oldIndex = undefined;
                    newIndex = undefined;
                    opts.onSorting = false;
                    isValid = false;
                    droppedElement = null;
                    droppedAt = '';
                    helper.addClass('Hidden').data('sClientID', '');
                }
                var _disable_ = function () {
                    isValid = false;
                    droppedElement = null;
                    droppedAt = '';
                    helper.addClass('Hidden');
                }
                //main function to do the reorder streams job
                var _reorder_ = function (e, reorderedStream, droppedStream, droppedElement) {
                    var reorderedStream = $('#'+helper.data('sClientID'));
                    var reorderedStreamData = reorderedStream.data();
                    var reorderedStreamWrapper = reorderedStream.parent();
                    var oldIndex = reorderedStream.data('index');
                    var oldParentStreamID = reorderedStream.data('parentID');
                    var newParentStreamID = oldParentStreamID;
                    var newIndex = parseInt(droppedStream.data('index'));
                    if ( oldIndex < newIndex ) { //move downward, shift newIndex by a negative offset
                        newIndex -= (self._isLeaf(reorderedStream) 
                            ? 1 
                            : (reorderedStream.next('ul').find('li').length+1)
                            //1 is reorderedStream itself
                        );
                    }
                    switch (droppedAt) {
                        case 'before':
                            newParentStreamID = droppedStream.data('parentID');
                            break;
                        case 'after':
                            newIndex += (droppedElement.find('li').length+1);
                            //reoderedStream is already inside droppedStream
                            if ( self._checkAncestor(reorderedStreamWrapper, droppedElement) ) { 
                                newIndex -= (self._isLeaf(reorderedStream)
                                    ? 1
                                    : (reorderedStream.next('ul').find('li').length+1)
                                    //1 is reorderedStream itself
                                );
                            }
                            newParentStreamID = droppedStream.data('parentID');
                            break;
                        case 'inside':
                            newIndex += (droppedElement.find('li').length+1);
                            //reoderedStream is already inside droppedStream
                            if ( self._checkAncestor(reorderedStreamWrapper, droppedElement) ) { 
                                newIndex -= (self._isLeaf(reorderedStream)
                                    ? 1
                                    : (reorderedStream.next('ul').find('li').length+1)
                                    //1 is reorderedStream itself
                                );
                            }
                            newParentStreamID = droppedStream.data('id');
                            break;
                    }
                    //console.log(oldIndex, newIndex);
                    //console.log(oldParentStreamID, newParentStreamID);
                    if ( oldIndex !== newIndex || oldParentStreamID !== newParentStreamID ) {
                        //store the old data before move streams
                        var oldParentStream = oldParentStreamID != 0
                            ? $('#'+reorderedStream.data('parentClientID'))
                            : null;
                        
                        //move streams
                        self._addStream(droppedElement, reorderedStreamWrapper, droppedAt, function () {
                            if ( oldParentStreamID !== newParentStreamID ) {
                                if ( newParentStreamID == 0 ) {
                                    //add data to model buffer
                                    Zenwork.Model.addBuffer({
                                        id: reorderedStreamData.slmid,
                                        lid: Zenwork.List.active,
                                        parentID: 0
                                    }, 'Stream_list_map', Zenwork.Model.CU);
                                }
                                else {
                                    //after indented, data buffer added in '_postIndentStream' function
                                    self._postIndentStream(e, reorderedStream, droppedElement, true/*do not flush data*/);
                                }
                            }
                        });

                        //callback on old parent
                        if ( oldParentStreamID !== newParentStreamID && oldParentStream !== null ) {
                            var oldParentStreamWrapper = oldParentStream.parent();
                            if ( oldParentStreamWrapper.find('li').length == 0 ) {
                                self._nodeToLeaf(oldParentStreamWrapper);
                            }
                        }
                
                        //restructure stream list
                        if ( oldIndex !== newIndex ) {
                            var from = oldIndex-1;
                            var to = newIndex-1;
                            if ( oldIndex > newIndex ) { //upward
                                if ( !self._isLeaf(reorderedStream) ) {
                                    from += reorderedStream.next('ul').find('li').length;
                                }
                            }
                            else { //downward
                                if ( !self._isLeaf(reorderedStream) ) {
                                    to += reorderedStream.next('ul').find('li').length;
                                }
                            }
                            self._restructure(from, to);

                            //add buffer
                            Zenwork.Model.addBuffer({
                                id: reorderedStreamData.slmid,
                                lid: Zenwork.List.active,
                                offset: newIndex - oldIndex
                            }, 'Stream_list_map', Zenwork.Model.CU);
                        }

                        //trigger event
                        self._trigger(self.EVENT.SORTING, e, [reorderedStream, oldIndex, newIndex, oldParentStreamID, newParentStreamID, oldParentStream]);

                        Zenwork.Model.flush();
                    }
                }

                element.on('mousedown.stream', '.'+opts.cssClass.streamDraggingBtn, function (e) {
                    opts.onSorting = true;
                    var $this = $(this);
                    var stream = $($this.attr('href'));
                    helper.data('sClientID', stream.data('clientID'));
                    $this.disableSelection();
                });
                element.on('mouseup.stream', '.'+opts.cssClass.streamRow, function (e) { //do the reorder work
                    if ( isValid && opts.onSorting && droppedElement !== null ) {
                        _reorder_(e, $('#'+helper.data('sClientID')), $(e.currentTarget), droppedElement);
                    }

                    //reset
                    _reset_();
                });
                $(document).on('mouseup.stream', function (e) {
                    if ( isValid && opts.onSorting && droppedElement !== null ) {
                        _reorder_(e, $('#'+helper.data('sClientID')), droppedElement.find('.'+opts.cssClass.streamRow), droppedElement);
                        //reset
                        _reset_();
                    }
                });
                element.on('mouseenter.stream', '.'+opts.cssClass.streamRow, function (e) { //check 'isValid'
                    if ( opts.onSorting ) {
                        var currentTarget = $(e.currentTarget)
                        if ( helper.data('sClientID') == currentTarget.data('clientID') ) { 
                            helper.addClass('Hidden');
                            isValid = false;
                            return false;
                        }
                        isValid = self._checkValidReorder(
                            $('#'+helper.data('sClientID')).parent(),
                            currentTarget.parent()
                        );
                        if ( isValid ) {
                            helper.removeClass(opts.cssClass.streamDraggingHelperError);
                        }
                        else {
                            helper.addClass(opts.cssClass.streamDraggingHelperError);
                        }
                    }
                });
                element.on('mousemove.stream', '.'+opts.cssClass.streamRow, function (e) { //handling indicator
                    if ( opts.onSorting ) {
                        var currentTarget = $(e.currentTarget);
                        if ( helper.data('sClientID') == currentTarget.data('clientID') ) { 
                            _disable_();
                            return false;
                        }

                        droppedElement = currentTarget.parent();
                        var currentTargetHeight = currentTarget.height();
                        var innerOffset = e.pageY - currentTarget.offset().top;
                        var xPos = 'left+16';
                        var yPos = 'center-2';
                        droppedAt = 'inside';
                        if ( innerOffset <= currentTargetHeight*0.3 ) {
                            xPos = 'left+8';
                            yPos = 'top-1';
                            droppedAt = 'before';
                        }
                        else if ( innerOffset >= currentTargetHeight*0.7 ) {
                            xPos = 'left+8';
                            yPos = 'bottom-1';
                            droppedAt = 'after';
                        }
                        helper
                            .removeClass('Hidden')
                            .position({
                                my: 'left center',
                                at: xPos + ' ' + yPos,
                                of: currentTarget,
                                collision: 'none'
                            });
                    }
                });
            },

            _initStreamDialog: function () {
                var self = this;

                Zenwork.StreamPopup.init();

                $(window).bind('resize', function (e) {
                    self._dialogUtil();
                });
            },

            /** 
             * notice: 'from, to' is array index, starting from 0
             */
            _indexStreams: function (from, to, addBuffer) {
                addBuffer = addBuffer !== undefined ? addBuffer : true;
                var opts = this.options;
                var collections = $('.'+opts.cssClass.streamIndex);
                if ( from !== undefined && to !== undefined ) {
                    if ( from > to ) {
                        var tmp = from;
                        from = to;
                        to = tmp;
                    }
                }
                from = from || 0;
                to = to || collections.length-1+opts.baseIndex;
                var ignoreDeletePending = 0;
                collections.each(function (index) {
                    index += opts.baseIndex;
                    var stream = $(this).parent();
                    if ( stream.hasClass(opts.cssClass.streamDeletePending) || index < from || index > to ) {
                        if ( stream.hasClass(opts.cssClass.streamDeletePending) ) {
                            ignoreDeletePending++;
                            this.innerHTML = '';
                        }
                        return true;
                    } //continue
                    var idx = index+1-ignoreDeletePending;
                    this.innerHTML = idx;
                    stream.data('index', idx);
                    stream.find('.'+opts.cssClass.streamName+' input').eq(0).attr('tabindex', idx);
                });
            },

            _isLeaf: function (stream) {
                return stream.parent().hasClass(this.options.cssClass.streamLeaf);
            },

            _isEmpty: function () {
                return this.element.find('li').length == 0;
            },

            _indentStream: function (e, stream) {
                var self = this;
                var isIndent = true;
                var streamElement = stream.parent();
                var prevStreamElement = streamElement.prev();
                if ( prevStreamElement.get(0) == undefined
                    || prevStreamElement.get(0).nodeName.toLowerCase() != 'li'
                ) {
                    isIndent = false;
                    return false;
                }

                //do indentation
                this._addStream(prevStreamElement, streamElement, 'inside', function () {
                    //after indented
                    self._postIndentStream(e, stream, prevStreamElement);
                });
            },

            _initWorkloadPlanningControl: function () {
                //timeline workload estimation(planning)
                var _updateTimelineWorkloadPlanning_ = function (element, effort) {
                    var elementData = element.data();
                    if ( elementData.effort != effort ) {
                        if ( !$.isNumeric(effort) ) {
                            Zenwork.Notifier.notify('Workload must be number', 2);
                            return false;
                        }
                        if ( effort < 0 ) {
                            Zenwork.Notifier.notify('Workload must be > 0', 2);
                            return false;
                        }
                        element.data('effort', effort);
                        Zenwork.Model.addBuffer({
                            id: element.data('tid'),
                            effort: effort
                        }, 'Timeline', Zenwork.Model.CU);
                        Zenwork.Model.flush();
                    }
                    else {
                        Zenwork.Notifier.notify('No change was made', 2);
                    }
                }
                $('.StreamTimelinePlanningEffortInput').each(function () {
                    $(this).data('effort', this.value);
                });
                Zenwork.StreamPopup.wrapper.on('blur.timeline', '.StreamTimelinePlanningEffortInput', function (e) {
                    _updateTimelineWorkloadPlanning_($(this), this.value);
                });
                Zenwork.StreamPopup.wrapper.on('keyup.timeline', '.StreamTimelinePlanningEffortInput', function (e) {
                    if ( e.which == 13 ) { //enter
                        _updateTimelineWorkloadPlanning_($(this), this.value);
                    }
                });
            },

            /**
             * has 'addListener' inside
             * review to ensure no duplicated listener
             */
            _initStreamDetailsControl: function (stream) {
                //clear all events binding
                if ( Zenwork.TimelineDialog !== undefined ) {
                    Zenwork.StreamPopup.wrapper.off(Zenwork.TimelineDialog.EVENT.UPDATE);
                    Zenwork.StreamPopup.wrapper.off(Zenwork.TimelineDialog.EVENT.CLOSE);
                    Zenwork.StreamPopup.wrapper.off(Zenwork.TimelineDialog.EVENT.SELECT);
                }
                if ( Zenwork.AssigneeDialog !== undefined ) {
                    Zenwork.StreamPopup.wrapper.off(Zenwork.AssigneeDialog.EVENT.ASSIGN);
                    Zenwork.StreamPopup.wrapper.off(Zenwork.AssigneeDialog.EVENT.UNASSIGN);
                    Zenwork.StreamPopup.wrapper.off(Zenwork.AssigneeDialog.EVENT.UPDATE);
                }
                Zenwork.StreamPopup.wrapper.off('click.stream');
                
                var self = this;
                var opts = this.options;
                var streamData = stream.data();
                var target;
                var targetData;
                var timeline;
                var timelineData;

                //init live edit name control
                var syncInput = stream.find('.'+opts.cssClass.streamName+' > input');
                Zenwork.StreamPopup.getTitle().find('input').on('keyup', function (e) {
                    syncInput.val(e.currentTarget.value);
                    syncInput.trigger('keyup.stream');
                });
                
                //auto expand textarea
                Zenwork.StreamPopup.wrapper.find('.AutoResizeTextbox')
                    .autoresize({
                        container: 'tmpContainer',
                        buffer: 1,
                        animate: false,
                        resizeOnStart: true,
                        onresize: function () {}
                    })
                    .filter('.AutoSync').bind('keyup.stream', function (e) {
                        if ( String(streamData.creatorID) !== Zenwork.Auth.User.id ) { return false; }

                        if ( streamData.description === this.value ) { 
                            return false;
                        } //no change
                        streamData.description = this.value;
                        //live update changed data
                        Zenwork.Model.liveUpdate({
                            id: streamData.id,
                            description: this.value
                        }, opts.useModel, Zenwork.Model.CU, streamData.clientID);
                    });

                //tagging
                $('.TagInput').each(function () {
                    var $this = $(this);
                    Zenwork.Plugins.tagit.call($this, streamData.id);
                    $this.on('afterTagAdded.tagit', function (e, label) {
                        self._updateStreamTag(e, stream, true, label);
                    });
                    $this.on('afterTagRemoved.tagit', function (e, label) {
                        self._updateStreamTag(e, stream, false, label);
                    });
                });

                //workload estimation(planning) control
                this._initWorkloadPlanningControl();
                
                //delete stream button
                Zenwork.StreamPopup.wrapper.on('click.stream', '.'+opts.cssClass.streamDeleteBtnPopup, function (e) {
                    self._deleteStream(e, stream, true, function() {});
                    return false;
                });

                //init completion, delete, calendar & assignee control
                Zenwork.StreamPopup.wrapper.on('click.stream', '.StreamTimelineBlockDelete', function (e) {
                    if ( Zenwork.Dialog !== undefined ) {
                        Zenwork.Dialog.close();
                    }
                    var $target = $(e.currentTarget);
                    var $timeline = $($target.attr('href'));
                    var $timelineBlock = $($target.attr('rel'));
                    var _callback_ = function () {
                        $timelineBlock.fadeOut('medium', function () {
                            $timelineBlock.remove();
                            var deleteBlockTimelineTrigger = Zenwork.StreamPopup.content.find('.StreamTimelineBlockDelete');
                            if ( deleteBlockTimelineTrigger.length === 1 ) {
                                deleteBlockTimelineTrigger.addClass('Hidden');
                            }
                        });
                    }
                    $timelineBlock.addClass('StreamBlockDeletePending');
                    if ( $timeline.data('uiTimeline') != undefined ) {
                        $timeline.timeline('deleteTimeline', e, _callback_);
                    }
                    else if ( $timeline.data('uiMilestone') != undefined ) {
                        $timeline.milestone('deleteTimeline', e, _callback_);
                    }
                    return false;
                }); //delete

                Zenwork.StreamPopup.wrapper.on('click.stream', '.StreamTimelineBlockCompletion', function (e) {
                    if ( Zenwork.Dialog !== undefined ) {
                        Zenwork.Dialog.close();
                    }
                    var $target = $(e.currentTarget).toggleClass('StreamTimelineBlockCompleted');
                    $($target.attr('href')+' .GanttTimelineCompletionBtn').eq(0).trigger('click');
                    $($target.attr('rel')).toggleClass('StreamTimelineBlockDone');
                    return false;
                }); //toggle completion

                if ( Zenwork.TimelineDialog !== undefined ) {
                    /**
                     * timeline dialog
                     */
                    var isUpdatedTimeline = false;
                    var startField;
                    var endField;
                    Zenwork.StreamPopup.wrapper.on( //update timeline dialog
                        Zenwork.TimelineDialog.EVENT.UPDATE,
                        '.StreamTimelineBlockEditTimeline',
                        function (e, start, end) {
                            //update to timeline
                            timeline.trigger(Zenwork.TimelineDialog.EVENT.UPDATE, [start, end]);
                            
                            target.attr('data-start', start/1000);
                            target.attr('data-end', end/1000);
                            //TODO: calculate exactly duration
                            $('#'+target.data('wdaysId')).text(Math.round((end-start)/86400000));
                            isUpdatedTimeline = true;
                        });
                    Zenwork.StreamPopup.wrapper.on( //close timeline dialog without update
                        Zenwork.TimelineDialog.EVENT.CLOSE,
                        '.StreamTimelineBlockEditTimeline',
                        function (e) {
                            if ( !isUpdatedTimeline ) {
                                startField.text(new Date(target.attr('data-start')*1000).toString('dd-MMM-yyyy'));
                                endField.text(new Date(target.attr('data-end')*1000).toString('dd-MMM-yyyy'));
                            }
                            isUpdatedTimeline = false;
                        });
                    Zenwork.StreamPopup.wrapper.on( //select date from timeline dialog
                        Zenwork.TimelineDialog.EVENT.SELECT,
                        '.StreamTimelineBlockEditTimeline',
                        function (e, id, dateStr) {
                            var selectDate = Date.parse(dateStr);
                            if ( id === 'timelineDialogStartTimeCalendar' ) {
                                startField.text(dateStr);
                                if ( selectDate.valueOf() > Date.parse(endField.text()).valueOf() ) {
                                    endField.text(dateStr);
                                }
                            }
                            else if ( id === 'timelineDialogEndTimeCalendar' ) {
                                endField.text(dateStr);
                            }
                        });
                    Zenwork.StreamPopup.wrapper.on( //click on button
                        'click.stream', 
                        '.StreamTimelineBlockEditTimeline',
                        function (e) {
                            if ( $(e.currentTarget).hasClass('ZWDialogBtnActive') ) {
                                return false;
                            }
                            target = $(e.currentTarget).addClass('ZWDialogBtnActive');
                            targetData = target.data();
                            timeline = $(target.attr('href'));
                            timelineData = timeline.data();

                            Zenwork.Model.checkExist('Timeline', timelineData.id, function (exists) {
                                if ( exists ) {
                                    startField = $('.StreamDateTimeStart[data-id="'+timelineData.id+'"]');
                                    endField = $('.StreamDateTimeEnd[data-id="'+timelineData.id+'"]');

                                    if ( Zenwork.Dialog !== undefined ) {
                                        Zenwork.Dialog.close();
                                    }

                                    Zenwork.TimelineDialog.updateTimelineDialog(target.attr('data-start')*1000, target.attr('data-end')*1000);

                                    Zenwork.TimelineDialog.show(e, target);
                                }
                            });

                            return false;
                        }); //end. timeline dialog
                }
            
                if ( Zenwork.AssigneeDialog !== undefined ) {
                    /**
                     * assignee dialog
                     */
                    var listAssignee;
                    Zenwork.StreamPopup.wrapper.on( //assign
                        Zenwork.AssigneeDialog.EVENT.ASSIGN,
                        '.StreamTimelineBlockEditAssignee',
                        function (e, assigneeData) {
                            if ( listAssignee.find('li').length === 1 ) {
                                listAssignee.find('.NoAssignee').addClass('Hidden');
                            }
                            /*
                             * data {
                             *     id: value, //user id
                             *     username: value,
                             *     email: value
                             *     avatar: value
                             *     Users_timeline: { 
                             *         effort: value
                             *         id: value
                             *         tid: value
                             *         uid: value
                             *     }
                             * }
                             */
                            listAssignee.append(
                                '<li data-id="'+assigneeData.id+'">'+
                                '    <strong>'+assigneeData.username+'</strong>(<span data-effort-id="'+assigneeData.id+'">'+assigneeData.Users_timeline.effort+'</span> wdays)'+
                                '</li>'
                            );
                            if ( timeline !== undefined ) {
                                timeline.timeline('setAssignee', e, timelineData.User);
                            }
                        });
                    Zenwork.StreamPopup.wrapper.on( //un-assign
                        Zenwork.AssigneeDialog.EVENT.UNASSIGN,
                        '.StreamTimelineBlockEditAssignee',
                        function (e, uid) {
                            listAssignee.find('[data-id="'+uid+'"]').remove();
                            if ( listAssignee.find('li').length === 1 ) {
                                listAssignee.find('.NoAssignee').removeClass('Hidden');
                            }
                            if ( timeline !== undefined ) {
                                timeline.timeline('setAssignee', e, timelineData.User);
                            }
                        });
                    Zenwork.StreamPopup.wrapper.on( //update effort
                        Zenwork.AssigneeDialog.EVENT.UPDATE,
                        '.StreamTimelineBlockEditAssignee',
                        function (e, uid, effort) {
                            listAssignee.find('[data-effort-id="'+uid+'"]').text(effort);
                        });
                    Zenwork.StreamPopup.wrapper.on( //update completion
                        Zenwork.AssigneeDialog.EVENT.TOGGLE_COMPLETION,
                        '.StreamTimelineBlockEditAssignee',
                        function (e, uid, completed) {
                            listAssignee.find('[data-completion-id="'+uid+'"]').toggleClass('Hidden', completed < 3);
                        });
                    Zenwork.StreamPopup.wrapper.on( //click on button
                        'click.stream', 
                        '.StreamTimelineBlockEditAssignee',
                        function (e) {
                            if ( $(e.currentTarget).hasClass('ZWDialogBtnActive') ) {
                                return false;
                            }
                            target = $(e.currentTarget).addClass('ZWDialogBtnActive');
                            timeline = $(target.attr('href'));
                            timelineData = timeline.data();
                            if ( Zenwork.Dialog !== undefined ) {
                                Zenwork.Dialog.close();
                            }
                            Zenwork.Model.checkExist('Timeline', target.data('tid'), function (exists) {
                                if ( exists ) {
                                    listAssignee = $(target.attr('rel'));
                                    Zenwork.AssigneeDialog.show(e, $(target.attr('href')), target);
                                }
                            });
                            return false;
                        }); //end. assignee
                }
                
                Zenwork.StreamPopup.wrapper.on('click.stream', function (e) {
                    if ( Zenwork.Dialog !== undefined ) {
                        Zenwork.Dialog.close();
                    }
                });

                if ( Zenwork.Planner !== undefined ) {
                    $('#addStreamTimelineBlockBtn').bind('click', function (e) {
                        var $target = $(e.currentTarget);
                        $target.addClass('Pending');
                        $.ajax({
                            type: 'POST',
                            url: Zenwork.Planner.Config.baseURL+'/addNewTimeline/1', //1 -> use return HTML layout
                            dataType: 'json',
                            contentType: 'json',
                            data: JSON.stringify({
                                sid: streamData.id,
                                completed: 0
                            }),
                            success: function (data, textStatus, jqXHR) {
                                $target.before(data.html);
                                Zenwork.Planner.app.planner(
                                    'addStreamTimelineBar', //method name
                                    //params
                                    $(stream.attr('rel')),
                                    stream, 
                                    [data.json], //timelineConfig: [{...}, {...}]
                                    'timeline', 
                                    false, //isAjax -> false 
                                    function () {
                                        $target.removeClass('Pending');
                                        Zenwork.StreamPopup.content.find('.StreamTimelineBlockDelete').removeClass('Hidden');
                                    },
                                    e
                                );
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if ( textStatus !== 'abort' ) {
                                    alert('Really sorry for this, network error! Please try again!');
                                }
                            },
                            complete: function (jqXHR, textStatus) {}
                        });
                        return false;
                    });
                }

                $('.StreamActivityViewMoreBtn').on('click', function (e) {
                    var $target = $(e.currentTarget);
                    var list = $($target.attr('href'));
                    var visible = list.find('li:visible');
                    var index = visible.length+visible.length;
                    list.find('li:lt('+index+')').removeClass('Hidden');
                    Zenwork.StreamPopup.wrapper.find('.StreamScrollContent').data('jsp').reinitialise();
                    if ( index >= list.find('li').length ) {
                        $target.addClass('Hidden');
                    }
                    return false;
                });

                //stream list selection
                var listSelection = $('#listSelection');
                if ( listSelection.length > 0 ) {
                    Zenwork.Plugins.listSelection(listSelection, streamData);
                    listSelection.on('update.listSelection', function (e) {
                        self._deleteStream(e, stream, false, function () {});
                    });
                }
            },

            _loadStreamCommentBox: function (e, stream) {
                var self = this;
                Zenwork.Comment.observer = stream;
                Zenwork.StreamPopup.preAsideProcess();
                $.ajax({
                    type: 'POST',
                    url: Zenwork.Root+'/app/comment/'+stream.data('id'),
                    success: function (data, textStatus, jqXHR) {
                        if ( data == 404 ) {
                            Zenwork.StreamPopup.show({aside: '<p class="ExceptionNotFound">'+Zenwork.Exception.MESSAGE['404']+'</p>'});
                            return false;
                        }

                        Zenwork.StreamPopup.show({aside: data});

                        //init comment plugin
                        Zenwork.Comment.init('tmpContainer');

                        //last action
                        self._ajustDialogScrollAsideSize();
                        Zenwork.StreamPopup.aside.find('.StreamScrollContent').each(function() {
                            Zenwork.Plugins.jScrollPane.call(this, {verticalGutter: 0});
                        });

                        $('.StreamDialogShare').data('stream-prefix', self.options.listPrefix);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if ( textStatus !== 'abort' ) {
                            alert('Really sorry for this, network error! Please try again!');
                        }
                    }
                });
            },

            _loadStreamAttachmentBox: function (e, stream) {
                var self = this;
                Zenwork.Uploader.observer = stream;
                Zenwork.StreamPopup.preAsideProcess();
                $.ajax({
                    type: 'POST',
                    url: Zenwork.Root+'/app/attachment/'+stream.data('id'),
                    success: function (data, textStatus, jqXHR) {
                        if ( data == 404 ) {
                            Zenwork.StreamPopup.show({aside: '<p class="ExceptionNotFound">'+Zenwork.Exception.MESSAGE['404']+'</p>'});
                            return false;
                        }

                        Zenwork.StreamPopup.show({aside: data});
                        
                        //init upload plugin
                        Zenwork.Uploader.init();

                        //last action
                        self._ajustDialogScrollAsideSize();
                        Zenwork.StreamPopup.aside.find('.StreamScrollContent').each(function() {
                            Zenwork.Plugins.jScrollPane.call(this, {verticalGutter: 0});
                        });

                        $('.StreamDialogShare').data('stream-prefix', self.options.listPrefix);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if ( textStatus !== 'abort' ) {
                            alert('Really sorry for this, network error! Please try again!');
                        }
                    }
                });
            },

            _markStreamAsCompleted: function (checkbox, completedStream, e) {
                var opts = this.options;
                completedStream.data('completed', 1);
                checkbox.addClass(opts.cssClass.streamCompletedBtn);

                //add changes data to model buffer
                Zenwork.Model.addBuffer({
                    id: completedStream.data('id'),
                    completed: 1
                }, 'Stream', Zenwork.Model.CU);

                //mark all children stream as completed
                var streamWrapper = completedStream.parent();
                streamWrapper.find('.'+opts.cssClass.streamCompletionBtn).addClass(opts.cssClass.streamCompletedBtn);
                
                var childrenStream = streamWrapper.find('> ul .'+opts.cssClass.streamRow);
                //add changes data to model buffer
                childrenStream.each(function () {
                    var $stream = $(this);
                    if ( $stream.data('completed') == 1 ) { return; }

                    $stream.data('completed', 1);
                    Zenwork.Model.addBuffer({
                        id: $stream.data('id'),
                        completed: 1
                    }, 'Stream', Zenwork.Model.CU);
                });

                //mark parent stream completed, if available
                this._updateParentStreamAsCompleted(completedStream);
                //callback
                if ( e != undefined ) {
                    this._trigger(this.EVENT.COMPLETED, e, completedStream);
                }
            },
            _updateParentStreamAsCompleted: function (completedStream) { //recursive
                var opts = this.options;
                var parentID = completedStream.data('parentID');
                if ( parentID != 0 ) {
                    var parentStream = $('#'+this.PREFIX+parentID);
                    if ( parentStream.data('completed') == 1 ) { return false; }

                    var parentWrapper = parentStream.parent();
                    var completed = parentWrapper.find('.'+opts.cssClass.streamCompletedBtn).length;
                    if ( parentWrapper.find('.'+opts.cssClass.streamRow).length - 1 == completed ) {
                        parentStream.data('completed', 1);
                        parentStream.find('.'+opts.cssClass.streamCompletionBtn).addClass(opts.cssClass.streamCompletedBtn);

                        //add changes data to model buffer
                        Zenwork.Model.addBuffer({
                            id: parentStream.data('id'),
                            completed: 1
                        }, 'Stream', Zenwork.Model.CU);
                    }

                    if ( parentStream.data('parentID') != 0 ) {
                        this._updateParentStreamAsCompleted(parentStream);
                    }
                }
            },

            _markStreamAsUncompleted: function (checkbox, uncompletedStream, e) {
                var opts = this.options;
                uncompletedStream.data('completed', 0);
                checkbox.addClass(opts.cssClass.streamCompletedBtn);
                
                //add changes data to model buffer
                Zenwork.Model.addBuffer({
                    id: uncompletedStream.data('id'),
                    completed: 0
                }, 'Stream', Zenwork.Model.CU);

                //mark all children stream as uncompleted
                var streamWrapper = uncompletedStream.parent();
                var childrenStream = streamWrapper.find('> ul .'+opts.cssClass.streamRow);
                streamWrapper.find('.'+opts.cssClass.streamCompletionBtn).removeClass(opts.cssClass.streamCompletedBtn);

                //add changes data to model buffer
                childrenStream.each(function () {
                    var $stream = $(this);
                    if ( $stream.data('completed') == 0 ) { return; }

                    $stream.data('completed', 0);
                    Zenwork.Model.addBuffer({
                        id: $stream.data('id'),
                        completed: 0
                    }, 'Stream', Zenwork.Model.CU);
                });

                //mark parent stream uncompleted
                this._updateParentStreamAsUnCompleted(uncompletedStream);

                //callback
                if ( e != undefined ) {
                    this._trigger(this.EVENT.UNCOMPLETED, e, uncompletedStream);
                }
            },
            _updateParentStreamAsUnCompleted: function (uncompletedStream) { //recursive
                var opts = this.options;
                var parentID = uncompletedStream.data('parentID');
                if ( parentID != 0 ) {
                    var parentStream = $('#'+this.PREFIX+parentID);
                    if ( parentStream.data('completed') == 0 ) { return false; }

                    parentStream
                        .data('completed', 0)
                        .find('.'+opts.cssClass.streamCompletionBtn).removeClass(opts.cssClass.streamCompletedBtn);

                    //add changes data to model buffer
                    Zenwork.Model.addBuffer({
                        id: parentStream.data('id'),
                        completed: 0
                    }, 'Stream', Zenwork.Model.CU);

                    if ( parentStream.data('parentID') != 0 ) {
                        this._updateParentStreamAsUnCompleted(parentStream);
                    }
                }
            },

            _markSingleStreamAsCompleted: function (stream) {
                if ( stream.data('completed') == 1 ) { return false; }

                stream.data('completed', 1);
                stream.find('.'+this.options.cssClass.streamCompletionBtn).addClass(this.options.cssClass.streamCompletedBtn);

                //add changes data to model buffer
                Zenwork.Model.addBuffer({
                    id: stream.data('id'),
                    completed: 1
                }, 'Stream', Zenwork.Model.CU);
            },

            _markSingleStreamAsUnCompleted: function (stream) {
                if ( stream.data('completed') == 0 ) { return false; }

                stream.data('completed', 0);
                stream.find('.'+this.options.cssClass.streamCompletionBtn).removeClass(this.options.cssClass.streamCompletedBtn);

                //add changes data to model buffer
                Zenwork.Model.addBuffer({
                    id: stream.data('id'),
                    completed: 0
                }, 'Stream', Zenwork.Model.CU);
            },

            _nodeToLeaf: function (streamWrapper) {
                streamWrapper
                    .find('> ul').remove().end()
                    .removeClass(this.options.cssClass.streamNode)
                    .addClass(this.options.cssClass.streamLeaf);
            },

            _notFoundException: function (stream) {
                var self = this;                
                var opts = this.options;

                Zenwork.StreamPopup.show({content: '<p class="ExceptionNotFound">'+Zenwork.Exception.MESSAGE['404']+'&nbsp;&nbsp;<a href="#s'+stream.data('id')+'" title="remove from plan">remove from plan</a></p>'});

                //remove stream if stream does not exist anymore
                $('.ExceptionNotFound a').on('click', function (e) {
                    self._deleteStream(e, stream, false, function () {});
                    return false;
                });
            },

            _openStreamDetails: function (e, stream, aside) {
                Zenwork.Planner.pub('beforeStreamDetailsOpen.Help.Planner');

                var self = this;
                if ( Zenwork.Dialog !== undefined ) {
                    Zenwork.Dialog.close();
                }
                Zenwork.StreamPopup.observer = stream;
                Zenwork.StreamPopup.preProcess({}, false);
                this._dialogUtil(stream);
                $.ajax({
                    type: 'POST',
                    url: Zenwork.Planner.Config.baseURL+'/getStreamDetails/'+stream.data('id')+'/'+Zenwork.List.active,
                    success: function (data, textStatus, jqXHR) {
                        if ( data == 404 ) {
                            self._notFoundException(stream);
                            return false;
                        }

                        Zenwork.StreamPopup.show({content: data});

                        //init stream details control
                        self._initStreamDetailsControl(stream);

                        self._dialogUtil(stream);
                        self._ajustDialogScrollContentSize();

                        //last action
                        $('.StreamScrollContent').each(function() {
                            Zenwork.Plugins.jScrollPane.call(this, {verticalGutter: 0});
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if ( textStatus !== 'abort' ) {
                            alert('Really sorry for this, network error! Please try again!');
                        }
                    }
                });

                aside = aside || 'comment';
                if ( aside === 'comment' ) {
                    //init comment box
                    this._loadStreamCommentBox(e, stream);
                }
                else if ( aside === 'attachment' ) {
                    //init attachment box
                    this._loadStreamAttachmentBox(e, stream);
                }
            },

            _openStreamContextMenu: function (e) {
                var target = $(e.target);
                var stream = $(target.attr('href'));
                this.options.streamContextMenu
                    .removeClass('Hidden')
                    .position({
                        my: 'left top',
                        at: 'left+15 bottom-10',
                        of: target,
                        collision: 'fit'
                    })
                    .find('a')
                        .attr('href', target.attr('href')).end()
                    .find('.'+this.options.cssClass.streamCommentBtn+' > span')
                        .text(stream.data('countComment')).end()
                    .find('.'+this.options.cssClass.streamAttachmentBtn+' > span')
                        .text(stream.data('countAttachment'));
                
                var isCreator = String(stream.data('creatorID')) === Zenwork.Auth.User.id;
                if ( Zenwork.Planner !== undefined ) {
                    isCreator = isCreator || Zenwork.Planner.creatorID === Zenwork.Auth.User.id;
                }

                if ( !isCreator ) {
                   this.options.streamContextMenu.find('.StreamIndentBtn, .StreamOutdentBtn, .StreamDeleteBtn').addClass('Hidden');
                }
                else {
                   this.options.streamContextMenu.find('.StreamIndentBtn, .StreamOutdentBtn, .StreamDeleteBtn').removeClass('Hidden');
                }
            },

            _openStreamGroupContextMenu: function (e) {
                this.options.streamGroupContextMenu.find('.'+this.options.cssClass.streamContextRequiredBtn)
                    .toggleClass(
                        this.options.cssClass.streamContextDisabledBtn,
                        $('.'+this.options.cssClass.streamMarked).length === 0 //add disabled class if true
                    );
                this.options.streamGroupContextMenu.find('.'+this.options.cssClass.streamSelectAllBtn)
                    .toggleClass(
                        this.options.cssClass.streamContextDisabledBtn,
                        this.element.find('li').length == 0
                    )
                this.options.streamGroupContextMenu
                    .removeClass('Hidden')
                    .position({
                        my: 'left top',
                        at: 'left+15 bottom-10',
                        of: $(e.target),
                        collision: 'fit'
                    });
            },

            _outdentStream: function (e, stream) {
                var self = this;
                var oldParentID = stream.data('parentID');
                if ( oldParentID == 0 ) {
                    return false;
                }
                var oldIndex = stream.data('index');
                var isOutdent = true;
                var streamElement = stream.parent();
                var oldParentStream = $('#'+this.PREFIX+oldParentID);
                var oldParentStreamElement = oldParentStream.parent();
                
                //do outdentation
                this._addStream(oldParentStreamElement, streamElement, 'after', function () {
                    //after outdented
                    self._postOutdentStream(e, stream, streamElement, oldIndex, oldParentID, oldParentStream, oldParentStreamElement);
                });
            },

            _postIndentStream: function (e, stream, parentStreamElement, noFlush) {
                var _streamData_ = stream.data();
                //add data to model buffer
                Zenwork.Model.addBuffer({
                    id: _streamData_.slmid,
                    lid: Zenwork.List.active,
                    parentID: _streamData_.parentID
                }, 'Stream_list_map', Zenwork.Model.CU);

                //update parent stream completion status, recursively
                this._updateStreamCompletion(e, parentStreamElement.find('.'+this.options.cssClass.streamRow).eq(0));
                 
                this._trigger(this.EVENT.INDENTED, e, stream);

                //flush data from model buffer
                noFlush = noFlush === undefined ? false : noFlush;
                if ( !noFlush ) { Zenwork.Model.flush(); }
            },

            _postOutdentStream: function (e, stream, streamElement, oldIndex, oldParentID, oldParentStream, oldParentStreamElement) {
                var childrenLength = oldParentStreamElement.find('li').length;
                if ( childrenLength == 0 ) {
                    this._nodeToLeaf(oldParentStreamElement);
                }
                var newIndex = oldParentStream.data('index')
                    + oldParentStreamElement.find('li').length
                    + 1; //<-- +1 is outdented stream itself
                if ( oldIndex !== newIndex ) {
                    var to = newIndex-1;
                    if ( !this._isLeaf(stream) ) {
                        to += streamElement.find('li').length;
                    }
                    this._restructure(oldIndex-1, to);
                }

                var _streamData_ = stream.data();
                //add data to model buffer
                Zenwork.Model.addBuffer({
                    id: _streamData_.slmid,
                    lid: Zenwork.List.active,
                    parentID: _streamData_.parentID
                }, 'Stream_list_map', Zenwork.Model.CU); //change parent
                Zenwork.Model.addBuffer({
                    id: _streamData_.slmid,
                    lid: Zenwork.List.active,
                    offset: -this._siblings(stream, 'next', function (siblings) { return siblings.length; }),
                }, 'Stream_list_map', Zenwork.Model.CU); //move node to right after old parent

                //update parent stream completion status, recursively
                this._updateStreamCompletion(e, oldParentStreamElement.find('.'+this.options.cssClass.streamRow).eq(0));

                this._trigger(this.EVENT.OUTDENTED, e, [stream, oldParentStream, oldIndex, newIndex]);

                //flush data from model buffer
                Zenwork.Model.flush();
            },

            _updateStreamCompletion: function (e, stream) {
                var opts = this.options;
                var children = this._getChildren(stream);
                if ( children.length > 0
                    && children.length == this._getNumberCompletedStream(stream)
                ) {
                    //mark stream as complete
                    this._markSingleStreamAsCompleted(stream);
                    
                    //callback
                    this._trigger(this.EVENT.SINGLE_COMPLETED, e, [stream]);
                }
                else {
                    //mark stream as uncomplete
                    this._markSingleStreamAsUnCompleted(stream);
                    
                    //callback
                    this._trigger(this.EVENT.SINGLE_UNCOMPLETED, e, [stream]);
                }
                if ( stream.data('parentClientID') != 0 ) {
                    this._updateStreamCompletion(e, $('#'+stream.data('parentClientID')));
                }
            },

            _restructure: function (from, to, addBuffer) {
                this._indexStreams(from, to, addBuffer);
            },

            _toggleStreamView: function (e, stream) {
                var streamElement = stream.parent();
                streamElement.toggleClass(this.options.cssClass.streamNodeExpanded);
                this._trigger(
                    streamElement.hasClass(this.options.cssClass.streamNodeExpanded)
                        ? this.EVENT.EXPANDED
                        : this.EVENT.COLLAPSED,
                    e,
                    stream
                );
            },
            
            _toggleAllStreamsView: function (e) {
                var self = this;
                var opts = this.options;
                var target = $(e.currentTarget);
                this.element.find('.'+opts.cssClass.streamElement).toggleClass(opts.cssClass.streamNodeExpanded, target.hasClass(opts.cssClass.streamToggleViewAllExpaned));
                this._trigger(
                    target.hasClass(opts.cssClass.streamToggleViewAllExpaned)
                        ? self.EVENT.EXPANDED_ALL
                        : self.EVENT.COLLAPSED_ALL,
                    e
                );
            },

            _updateStreamTag: function (e, stream, added, label) {
                var opts = this.options;
                var streamData = stream.data();
                if ( added ) {
                    streamData.tag += streamData.tag == '' ? '' : ',';
                    streamData.tag += label;
                    var tagTxt =  'Tags: <strong>'+streamData.tag+'</strong>';
                    stream.find('.'+opts.cssClass.streamTag).attr('title', tagTxt).text(tagTxt);
                }
                else {
                    var tmp = streamData.tag.split(',');
                    $.each(tmp, function (index, value) {
                        if ( value == label ) {
                            tmp.splice(index, 1);
                            return false;
                        }
                    });
                    var tagTxt = 'Tags: &ndash;';
                    if ( tmp.length > 0 ) {
                        streamData.tag = tmp.toString();
                        tagTxt =  'Tags: <strong>'+streamData.tag+'</strong>';
                    }
                    else {
                        streamData.tag = '';
                    }
                    stream.find('.'+opts.cssClass.streamTag).attr('title', tagTxt).text(tagTxt);
                }
            }
    });

    //version
    $.extend($.ui.stream, {
        version: '1.0'
    });

    //create model for stream
    Zenwork.Model.createModel('Stream', function (streamData) {
        return { 'Stream': $.extend({}, streamData) };
    });
    Zenwork.Model.createModel('Stream_list_map', function (data) {
        return { 'Stream_list_map': $.extend({}, data) };
    });
})(jQuery);
