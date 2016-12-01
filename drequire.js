/*
Synchronous loader of dojo modules (or other modules that use dojo AMD loader).
Path to dojo is passed as env variable DOJO\_BASE\_PATH or as *baseUrl* param in dojoConfig

	var drequire = require("drequire")({
		locale : "en-us",
		baseUrl: "/path/to/dojo/folder"
	});
	var locale = drequire("dojo/date/locale");
	console.log(locale.format(new Date()));
*/

var path = require("path");
var drequire = null;
/*global module:true,global:true,process:true */
module.exports = function(dojoConfig) {

	if (drequire) {
		console.warn("WARNING: drequire factory was already called. it is not possible to create two dojo AMD loaders. first loader will be returned");
		return drequire;
	}

	var defaultConfig = {//defaults
		async : false, //dojo.require will exists now
		//if you dont have GJAX_DOJO_BASE env, send it as param in dojoConfig
		baseUrl : process.env["DOJO_BASE_PATH"] && path.resolve(process.env["DOJO_BASE_PATH"], "dojo") || null
	};
	var config = Object.assign(defaultConfig, dojoConfig);

	if (!config.baseUrl) {
		throw new Error("'baseUrl' is required and is missing, please pass as argument or define 'DOJO_BASE_PATH' environment variable");
	}
	global.dojoConfig = config; //REVIEW: I beliveve this can also go away
	require(path.resolve(global.dojoConfig.baseUrl, "dojo.js")); //this will ensure that global variable 'dojo' exists

	var dojoDefine = global.define;
	delete global.define; //do not populate global scope with define, which would break loading of UMD modules

	drequire = function() {
		global.define = dojoDefine;
		var module = dojo.require.apply(null, arguments);
		delete global.define;
		return module;
	};

	return drequire;
};
