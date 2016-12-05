# drequire

[![build status](https://img.shields.io/travis/gratex/drequire/master.svg?style=flat-square)](https://travis-ci.org/gratex/drequire)
[![npm version](https://img.shields.io/npm/v/drequire.svg?style=flat-square)](https://www.npmjs.com/package/drequire)


Synchronous loader of dojo modules (or other modules that use dojo AMD loader).
Path to dojo is passed as env variable DOJO\_BASE\_PATH or as *baseUrl* param in dojoConfig

## Install

Node module, so use:

	npm install --save drequire

You need dojo/dojox on your disk somewhere
and drequire needs path ``export DOJO_BASE_PATH`` to that install

Example:

	mkdir resources
	cd resources
	export DOJO_BASE_PATH="$(pwd)" # abs path, folder above dojo
	git clone https://github.com/dojo/dojo.git
	git clone https://github.com/dojo/dojox.git
	# ... any other dojo compatible AMD libs you want to use from node	


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


## BEWARE: Versions and poluting global scope

1.x - poluted global scope
2.x - does NOT create global `define` variable (so some UMD modules loaded after using drquire worked)
3.x - back to original simple version, polutes the scope again, 2.x was more trouble then benefit



