var assert = require("assert");
var path = require("path");

describe("drequire", function() {

    var drequire = require("../drequire")({
        packages: [{
            name: "app",
            location: __dirname
        }],
        baseUrl: path.resolve(__dirname, "../node_modules/dojo"),
        locale: "sk-sk"
    });

    it("3.0 - calling drequire sets globals (again as in 1.0 version) ", function() {
        require("../drequire")({});
        assert('dojo' in global);
        assert('define' in global);
    });
    it("3.0 - async define inside dojo module works (again)", function(done) {
        var async = drequire("app/module1");
        async(done);
    });
    it.skip("3.0 - badly written UMD modules will not load after you use drequire", function(done) {
        // TODO: deepmerge demo
    });
    it("should load sample dojo module", function() {
        var locale = drequire("dojo/date/locale");
        assert.equal(typeof locale, "object", "Loaded dojo module should be an object");
        assert.equal(typeof locale.format, "function", "Loaded dojo module should have 'format' function");
    });
    it("should load module with correct configuration", function() {
        var locale = drequire("dojo/date/locale");
        var formattedDate = locale.format(new Date(2015, 12, 16), {
            selector: "date"
        });
        assert.equal(formattedDate, "16.1.2016", "Date should be formatted according to passed 'locale' to dojoConfig");
    });
    
    it("multiple drequire will not fail (previously buggy)", function() {

        var drequire1 = require("../drequire")({
            locale: "sk-sk"
        });
        var drequire2 = require("../drequire")({
            locale: "en-en"
        });

        var stamp1 = drequire2("dojo/date/stamp");
        var stamp2 = drequire2("dojo/date/stamp");
    });
    it("Second call to drequire, config is ignored", function() {

        var drequire1 = require("../drequire")({
            locale: "sk-sk" // will be ignored (global drequire)
        });
        var drequire2 = require("../drequire")({
            locale: "en-en" //will be ignored
        });

        var stamp1 = drequire2("dojo/date/locale");
        var stamp2 = drequire2("dojo/date/locale");

        assert.equal(stamp1.getNames("months", "wide", "standAlone")[0], "január");
        assert.equal(stamp2.getNames("months", "wide", "standAlone")[0], "január");
        /* 
            https://dojotoolkit.org/reference-guide/1.7/dojo/_base/config.html
            Both the data-dojo-config script attribute and the dojoConfig 
            global have the same result - their properties are copied over into dojo.config. 
            In the data attribute case, no dojoConfig global gets created; 
            after bootstrap, dojo.config is the single source of truth 
            for configuration properties. 
            For that reason it is also typically treated as a read-only object 
            ... 
         */
    });
   
});

