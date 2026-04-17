/**
 * Test file for filterXSSWithResult() - fixes issue #284
 *
 * Written by: Joya Biswas
 * Note: I'm a beginner contributor. I used Claude (claude.ai) as a learning
 * assistant to help me understand the codebase and the JavaScript concepts
 * involved. Every line of this solution has been read, understood, and
 * verified by me through testing.
 */
var xss = require("./lib/index.js");

var passed = 0;
var failed = 0;

function check(testName, condition) {
  if (condition) {
    console.log("  ✅ PASS:", testName);
    passed++;
  } else {
    console.log("  ❌ FAIL:", testName);
    failed++;
  }
}

console.log("========================================");
console.log("  Testing filterXSSWithResult");
console.log("========================================\n");

// ---- TEST 1 ----
// A <script> tag is NOT in the whitelist → should be recorded as removed
console.log("TEST 1: Dangerous tag gets recorded");
var r1 = xss.filterXSSWithResult('<script>alert("xss")</script><p>Hello</p>');
console.log("  Input  :", '<script>alert("xss")</script><p>Hello</p>');
console.log("  Output :", r1.html);
console.log("  Removed:", JSON.stringify(r1.removed, null, 2));
check("removed array is not empty", r1.removed.length > 0);
check("script tag was recorded", r1.removed.some(function(r) { return r.tag === "script"; }));
check("<p> tag was NOT recorded (it is allowed)", !r1.removed.some(function(r) { return r.tag === "p"; }));

console.log();

// ---- TEST 2 ----
// onclick is NOT in the whitelist for <a> → should be recorded as removed
console.log("TEST 2: Dangerous attribute gets recorded");
var r2 = xss.filterXSSWithResult('<a href="#" onclick="evil()">click me</a>');
console.log("  Input  :", '<a href="#" onclick="evil()">click me</a>');
console.log("  Output :", r2.html);
console.log("  Removed:", JSON.stringify(r2.removed, null, 2));
check("removed array has 1 item (only onclick)", r2.removed.length === 1);
check("onclick attr was recorded", r2.removed.some(function(r) { return r.attr === "onclick"; }));
check("href was NOT recorded (it is allowed)", !r2.removed.some(function(r) { return r.attr === "href"; }));

console.log();

// ---- TEST 3 ----
// Completely clean HTML → nothing should be recorded
console.log("TEST 3: Clean HTML produces empty removed array");
var r3 = xss.filterXSSWithResult("<p>This is safe</p>");
console.log("  Input  :", "<p>This is safe</p>");
console.log("  Output :", r3.html);
console.log("  Removed:", JSON.stringify(r3.removed));
check("removed array is empty", r3.removed.length === 0);
check("html output is unchanged", r3.html === "<p>This is safe</p>");

console.log();

// ---- TEST 4 ----
// Both a bad tag AND a bad attribute in one string
console.log("TEST 4: Mixed dangerous input — both tag and attr recorded");
var r4 = xss.filterXSSWithResult('<script>bad()</script><a href="#" onclick="evil()">x</a>');
console.log("  Removed:", JSON.stringify(r4.removed, null, 2));
check("script tag recorded", r4.removed.some(function(r) { return r.tag === "script" && r.type === "tag"; }));
check("onclick attr recorded", r4.removed.some(function(r) { return r.attr === "onclick" && r.type === "attr"; }));

console.log();

// ---- SUMMARY ----
console.log("========================================");
console.log("  Results:", passed, "passed,", failed, "failed");
if (failed === 0) {
  console.log("  🎉 ALL TESTS PASSED!");
} else {
  console.log("  ⚠️  SOME TESTS FAILED - check your code");
}
console.log("========================================");