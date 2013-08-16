// fix console missing
window.console = console ? console : {log:function(){}, trace:function(){}};
window.create = function(l){ return document.createElement(l); };


// functions //
/**
 * Setup a namespace
 * @param {String} n
 */
function namespace(n){
	if (!n.match(/^(\w+?(?:\.\w+|)+$)/)) throw new tchov.Exception(tchov.Err.ERR_INVALID_NS);
	var ns = window, sp = n.split('.');

	for (i in sp) {
		if(ns[sp[i]] === undefined) {
			ns[sp[i]] = {};
			ns = ns[sp[i]];
		} else {
			ns = ns[sp[i]];
		}
	}
}

/**
 * Setup an adapter
 * @param {String} a
 */
function defaultAdapter(a) {
	tchov.Adapters.DEFAULT = a || tchov.Adapters.BOOTSTRAP;
}

// objects //
namespace('tchov');
tchov.Err = {
	ERR_OCURRED: 'An error ocurred!',
	ERR_INVALID_NS: 'Invalid Namespace format!',
	ERR_ADAPTER_NOT_FOUND: 'Adapter not found!',
};

tchov.Adapters = {
	JQ_UI: 'jqueryUi',
	BOOTSTRAP: 'bootstrap',
	DEFAULT: '',
};


// Exceptions //
tchov.Exception = function(m){
	var m = m || TchovErr.ERR_OCURRED;
	this.getMessage = function(){ return m; };
};


// classes //
/**
 * @class tchov.Obj
 * @namespace tchov
 *
 * @method megeOptions(o:Object):Void
 * @method optionsMerged():Void
 */
tchov.Obj = function(){
	this.options = {};
	this.defOptions = {};
	this.mergeOptions = function(o) {
		this.options = $.extend({}, this.defOptions, o);
		this.optionsMerged();
	};
	this.optionsMerged = function() {};
};


/**
 * @class tchov.Plugable
 * @extends tchov.Obj
 * @namespace tchov
 *
 * @method megeOptions(o:Object):Void
 * @method optionsMerged():Void
 * @method setAdapterName(n:String):String
 * @method getAdapterName():String
 */
tchov.Plugable = function() {
	this.defAdapter = '';
	this.setAdapterName = function(n) {
		this.defAdapter = n;
		this.adapterSet();
		return this.defAdapter;
	};
	this.getAdapterName = function() {
		return this.defAdapter || tchov.Adapters.DEFAULT;
	};
};
tchov.Plugable.prototype = new tchov.Obj;



// classes.plugins //
namespace('tchov.plugin');
/**
 * @class tchov.plugin.OpenBox
 * @extends tchov.Plugable
 * @namespace tchov.plugin
 *
 * @method megeOptions(o:Object):Void
 * @method optionsMerged():Void
 * @method setAdapterName(n:String):String
 * @method getAdapterName():String
 * @method adapterSet():Void
 * @method optionsMerged():Void
 * @method execute():Void
 */
tchov.plugin.OpenBox = function(o) {
	this.defOptions = {container:$('body'), title:'Box', width:'80%', height:500, modal:true, url:''};
	this.adapter = null;

	this.adapterSet = function() {
		this.optionsMerged();
	};

	this.optionsMerged = function() {
		try {
			this.adapter = new tchov.plugin.adapter[this.getAdapterName()].OpenBox(this.options);
		} catch (e) {
			throw tchov.Err.ERR_ADAPTER_NOT_FOUND;
		}
	};

	this.execute = function(){this.adapter.execute();};

	this.mergeOptions(o);
};
tchov.plugin.OpenBox.prototype = new tchov.Plugable;

/**
 * @class tchov.plugin.DragNDropUpload
 * @extends tchov.Plugable
 * @namespace tchov.plugin
 *
 * @method megeOptions(o:Object):Void
 * @method optionsMerged():Void
 * @method setAdapterName(n:String):String
 * @method getAdapterName():String
 * @method adapterSet():Void
 * @method optionsMerged():Void
 * @method execute():Void
 */
tchov.plugin.DragNDropUpload = function(o) {
	this.defOptions = {container:$('body'), title:'Box', width:'80%', height:500, modal:true, content:''};
	this.adapter = null;

	this.getTemplate = function() {
		return $('<div id="uploader-area"><div id="file-area"></div></div>');
	};

	this.adapterSet = function() {
		this.optionsMerged();
	};

	this.optionsMerged = function() {
		try {
			this.adapter = new tchov.plugin.adapter[this.getAdapterName()].OpenBox(this.options);
		} catch (e) {
			throw tchov.Err.ERR_ADAPTER_NOT_FOUND;
		}
	};

	this.execute = function(){
		var up = this.getTemplate(), fa = up.find('div');
		// @TODO fazer o drag do objeto na area e o upload
		this.adapter.execute();
	};

	this.mergeOptions(o);
};
tchov.plugin.DragNDropUpload.prototype = new tchov.Plugable;

// classes.plugins.adapters //
namespace('tchov.plugin.adapter');
/**
 * @class tchov.plugin.adapter.Adaptable
 * @extends tchov.Obj
 * @namespace tchov.plugin.adapter
 *
 * @method megeOptions(o:Object):Void
 * @method optionsMerged():Void
 * @method adaptableExecute():Void
 * @method executionFinished():Void
 */
tchov.plugin.adapter.Adaptable = function() {

	this.adaptableExecute = function(){
		this.executionFinished();
	};

	this.executionFinished=function(){};
};
tchov.plugin.adapter.Adaptable.prototype = new tchov.Obj;


// classes.plugins.adapters.bootstrap //
namespace('tchov.plugin.adapter.bootstrap');
/**
 * @class tchov.plugin.adapter.bootstrap.OpenBox
 * @extends tchov.plugin.adapter.Adaptable
 * @namespace tchov.plugin.adapter.bootstrap
 *
 * @method megeOptions(o:Object):Void
 * @method optionsMerged():Void
 * @method adaptableExecute():Void
 * @method executionFinished():Void
 * @method getTamplate():String
 * @method execute():Void
 */
tchov.plugin.adapter.bootstrap.OpenBox = function(o){
	this.getTamplate = function() {
		return $('<div class="modal fade" id="open-box" tabindex="-1" role="dialog" aria-hidden="true">\
		    <div class="modal-dialog">\
				<div class="modal-content">\
				  <div class="modal-header">\
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
					<h4 class="modal-title"></h4>\
				  </div>\
				  <div class="modal-body"><iframe src="" width="100%" height="100%" style="border:0;"></iframe></div>\
				  <div class="modal-footer"></div>\
				</div><!-- /.modal-content -->\
			  </div><!-- /.modal-dialog -->\
			</div><!-- /.modal -->\
		 </div>');
	};

	this.execute = function() {
		var tpl = this.getTamplate(), tit = tpl.find('.modal-title'), bdy = tpl.find('.modal-body > iframe');

		tit.text(this.options.title);

		if (this.options.content !== undefined) {
			bdy = tpl.find('.modal-body');
			bdy.html(this.options.content);
		} else {
			bdy.attr('src', this.options.url);
		}
		this.options.container.detach('#open-box').append(tpl);

		tpl.on('shown.bs.modal', function(){
			$('.modal-backdrop + .modal-backdrop').detach();});
		tpl.modal();

		this.adaptableExecute();
	};

	this.mergeOptions(o);
};
tchov.plugin.adapter.bootstrap.OpenBox .prototype = new tchov.plugin.adapter.Adaptable;


// classes.plugins.adapters.jqueryUi //
namespace('tchov.plugin.adapter.jqueryUi');
/**
 * @class tchov.plugin.adapter.jqueryUi.OpenBox
 * @extends tchov.plugin.adapter.Adaptable
 * @namespace tchov.plugin.adapter.jqueryUi
 *
 * @method megeOptions(o:Object):Void
 * @method optionsMerged():Void
 * @method adaptableExecute():Void
 * @method executionFinished():Void
 * @method getTamplate():String
 * @method execute():Void
 */
tchov.plugin.adapter.jqueryUi.OpenBox = function(o){
	this.getTemplate = function() {
		return $('<div title="" id="open-box"><iframe src="" width="100%" height="100%" style="border:0;"></iframe></div>');
	};
	this.execute = function() {
		var tpl = this.getTemplate(), bdy = tpl.find('iframe');

		tpl.attr('title', this.options.title);

		if (this.options.content !== undefined) {
			bdy = tpl;
			bdy.html(this.options.content);
		} else {
			bdy.attr('src', this.options.url);
		}
		this.options.container.detach('#open-box').append(tpl);

		tpl.width(this.options.width);
		tpl.height(this.options.height);
		tpl.dialog(this.options);

		this.adaptableExecute();
	};

	this.mergeOptions(o);
};
tchov.plugin.adapter.jqueryUi.OpenBox .prototype = new tchov.plugin.adapter.Adaptable;






// jquery adapter //
$.tchov = {

	baseUrl: function(){
        return (window.location['origin'] || window.location['protocol'] + '//' + window.location['host']).toString();
    },

	openBox: function(o, adapterName) {
		defaultAdapter(adapterName);
		var opbx = new tchov.plugin.OpenBox(o);
			opbx.execute();
		return opbx;
	},
	dragNDropUpload: function(o, adapterName) {
		defaultAdapter(adapterName);
		var opbx = new tchov.plugin.DragNDropUpload(o);
			opbx.execute();
		return opbx;
	}
};
