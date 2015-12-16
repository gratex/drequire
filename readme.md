# drequire

[![build status](https://img.shields.io/travis/gratex/drequire/master.svg?style=flat-square)](https://travis-ci.org/gratex/drequire)

Synchronous loader of dojo modules (or other modules that use dojo AMD loader).
Path to dojo is passed as env variable DOJO\_BASE\_PATH or as *baseUrl* param in dojoConfig

## Usage

	var drequire = require("drequire")({
		locale : "en-us",
		baseUrl: "/path/to/dojo/folder"
	});
	var locale = drequire("dojo/date/locale");
	console.log(locale.format(new Date()));

Passed *dojoConfig* will be mixed into

	{
		async : false,
		baseUrl : path.resolve(process.env["DOJO_BASE_PATH"], "dojo")
	}


## Known issues

When used together with loadash, loadash must be required before drequire, otherwise loadash will not work (talking about first require in application).

This issue is caused by code in lodash's 'factory', which checks if 'define' exists, and  switches itself to AMD mode. (drequire loads dojo, which creates global 'define' function).
