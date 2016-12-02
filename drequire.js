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
var dojoGlobals = null;

/*global module:true,global:true,process:true */
module.exports = function(dojoConfig) {

    if (!dojoGlobals) {

        // config
        var config = Object.assign({ //defaults
            async: false, //dojo.require will exists now
            //if you dont have GJAX_DOJO_BASE env, send it as param in dojoConfig
            baseUrl: process.env["DOJO_BASE_PATH"] && path.resolve(process.env["DOJO_BASE_PATH"], "dojo") || null
        }, dojoConfig);
        if (!config.baseUrl) {
            throw new Error("'baseUrl' is required and is missing, please pass as argument or define 'DOJO_BASE_PATH' environment variable");
        }

        // load dojo
        var pathToDojoJs = path.resolve(config.baseUrl, "dojo.js")
        dojoGlobals = requireDojo(config, pathToDojoJs);

        //console.log(dojoGlobals);
    } else {
        if (dojoConfig && Object.keys(dojoConfig).length) {
            //console.warn("[WARN]: dojo config alteady configured, config ignored");
        }
    }
    var drequire = function() {
        try {
            mixGlobals(dojoGlobals);
            var module = global.dojo.require.apply(null, arguments);
            return module;
        } finally {
            unmixGlobals(dojoGlobals);
        }
    };

    return drequire;
};

function requireDojo(config, path) {
    // requires module that exports {} but sets some globals
    // unsets the glovals and returs them
    // to ind globals it uses primitive logic of comparing global keys
    // TODO: contextLoading, but dojo will not load in empty context, investigate
    // and create fake context for dojo to load, the return new context
    var globalsBefore = Object.keys(global);

    global.dojoConfig = config;
    require(path);

    var globalsAfter = Object.keys(global);
    // 
    var globalsNew = globalsAfter.filter(function(a) {
        return !~globalsBefore.indexOf(a);
    });
    //console.error("[globalsNew]:", globalsNew);
    var r = {};
    globalsNew.forEach(function(k) {
        r[k] = global[k];
        delete global[k];
    });
    return r;
}

function mixGlobals(globals) {
    for (var p in globals) {
        global[p] = globals[p];
    }
}

function unmixGlobals(globals) {
    for (var p in globals) {
        delete global[p];
    }
}
