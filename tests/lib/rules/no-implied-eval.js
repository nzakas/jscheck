/**
 * @fileoverview Tests for no-implied-eval rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint),
    expectedErrorMessage = "Implied eval. Consider passing a function instead of a string.",
    expectedError = { message: expectedErrorMessage, type: "CallExpression" };

eslintTester.addRuleTest("lib/rules/no-implied-eval", {
    valid: [
        // normal usage
        "setInterval(function() { x = 1; }, 100);",
        // only checks on top-level statements or window.*
        "foo.setTimeout('hi')",
        // identifiers are fine
        "setTimeout(foo, 10)",
        // as are function expressions
        "setTimeout(function() {}, 10)",
        // setInterval
        "foo.setInterval('hi')",
        "setInterval(foo, 10)",
        "setInterval(function() {}, 10)",
        // execScript
        "foo.execScript('hi')",
        "execScript(foo)",
        "execScript(function() {})",
        // a binary plus on non-strings doesn't guarantee a string
        "setTimeout(foo + bar, 10)",
        // doesn't check anything but the first argument
        "setTimeout(foobar, 'buzz')",
        "setTimeout(foobar, foo + 'bar')",
        // only checks immediate subtrees of the argument
        "setTimeout(function() { return 'foobar'; }, 10)"
    ],

    invalid: [
        { code: "setTimeout(\"x = 1;\");", errors: [expectedError] },
        { code: "setTimeout(\"x = 1;\", 100);", errors: [expectedError] },
        { code: "setInterval(\"x = 1;\");", errors: [expectedError] },
        { code: "execScript(\"x = 1;\");", errors: [expectedError] },
        // member expressions
        { code: "window.setTimeout('foo')", errors: [expectedError] },
        { code: "window.setInterval('foo')", errors: [expectedError] },
        { code: "window['setTimeout']('foo')", errors: [expectedError] },
        { code: "window['setInterval']('foo')", errors: [expectedError] },
        // template literals
        { code: "setTimeout(`foo${bar}`)", errors: [expectedError], ecmaFeatures: {templateStrings: true} },
        // string concatination
        { code: "setTimeout('foo' + bar)", errors: [expectedError] },
        { code: "setTimeout(foo + 'bar')", errors: [expectedError] },
        { code: "setTimeout(`foo` + bar)", errors: [expectedError], ecmaFeatures: {templateStrings: true} },
        { code: "setTimeout(1 + ';' + 1)", errors: [expectedError] },
        // gives the correct node when dealing with nesting
        {
            code:
                "setTimeout('foo' + (function() {\n" +
                "   setTimeout(helper);\n" +
                "   execScript('str');\n" +
                "   return 'bar';\n" +
                "})())",
            errors: [
                {
                    message: expectedErrorMessage,
                    type: "CallExpression",
                    line: "1"
                },
                // no error on line 2
                {
                    message: expectedErrorMessage,
                    type: "CallExpression",
                    line: "3"
                }
            ]
        }
    ]
});
