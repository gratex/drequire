var assert = require("assert");
var path = require("path");

var drequire = require("../drequire")({
	baseUrl : path.resolve(__dirname, "../node_modules/dojo"),
	locale : "sk-sk"
});

describe("drequire", function() {
	it("should create global object 'dojo'", function() {
		assert.equal(typeof global.dojo, "object", "Global 'dojo' variable is expected to be an object");
	});
	it("should load sample dojo module", function() {
		var locale = drequire("dojo/date/locale");
		assert.equal(typeof locale, "object", "Loaded dojo module should be an object");
		assert.equal(typeof locale.format, "function", "Loaded dojo module should have 'format' function");
	});
	it("should load module with correct configuration", function() {
		var locale = drequire("dojo/date/locale");
		var formattedDate = locale.format(new Date(2015, 12, 16), {
			selector : "date"
		});
		assert.equal(formattedDate, "16.1.2016", "Date should be formatted according to passed 'locale' to dojoConfig");
	});
});
