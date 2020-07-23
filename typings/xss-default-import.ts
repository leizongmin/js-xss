/// <reference path="./xss.d.ts" />

import xss from "xss";

console.log(xss("<script>alert('xss');</script>"));
