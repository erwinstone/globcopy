#!/usr/bin/env node
var o=require("./main.js");(async()=>{const a=process.argv[2],c=process.argv[3]==="--watch";await(0,o.globcopy)({path:a,watch:c})})();
