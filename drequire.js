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
/*global module:true,global:true,process:true */

module.exports = function(dojoConfig) {
    var config = { // defaults
        async: false, // dojo.require will exists now
        // if you dont have GJAX_DOJO_BASE env, send it as param in dojoConfig
        baseUrl: path.resolve(process.env["GJAX_DOJO_BASE"], "dojo")
    };
    for (var p in dojoConfig) {
        config[p] = dojoConfig[p];
    }
    global.dojoConfig = config; // REVIEW: I beliveve this can also go away
    global.dojo || require(path.resolve(global.dojoConfig.baseUrl, "dojo.js")); // this will ensure that global variable 'dojo' exists
    return global.dojo.require;
};

/* 
Config is set only on first bootstrap:

https://dojotoolkit.org/reference-guide/1.7/dojo/_base/config.html
Both the data-dojo-config script attribute and the dojoConfig 
global have the same result - their properties are copied over into dojo.config. 
In the data attribute case, no dojoConfig global gets created; 
after bootstrap, dojo.config is the single source of truth 
for configuration properties. 
For that reason it is also typically treated as a read-only object 
... 
*/
