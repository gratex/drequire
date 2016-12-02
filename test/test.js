var assert = require("assert");
var path = require("path");

var drequire = require("../drequire")({
    baseUrl: path.resolve(__dirname, "../node_modules/dojo"),
    locale: "sk-sk"
});

describe("drequire", function() {
    it("should NOT create global object 'dojo' (or any other globals)", function() {
        require("../drequire")({});
        assert(!('dojo' in global));
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
    it("should not populate global scope with 'define' (would break loading of UMD modules)", function() {
        assert.equal(typeof global.define, "undefined", "Global 'dojo' variable is expected to be an object");
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
    it("[TO BE CHANGED SOON] Second call to drequire, config is ignored", function() {

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
    });
});
