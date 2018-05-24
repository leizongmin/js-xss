importScripts("../dist/xss.js");

postMessage(filterXSS('<a href="#" onclick="alert(/xss/)">click me</a>'));
