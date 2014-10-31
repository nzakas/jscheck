/**
 * @fileoverview Tests for comma-dangle rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/comma-dangle", {
    valid: [
        { code: "var foo = { bar: \"baz\" }", args: ["2", "never"] },
        { code: "var foo = [ \"baz\" ]", args: ["2", "never"] },
        { code: "[,,]", args: ["2", "never"] },
        { code: "[,]", args: ["2", "never"] },
        { code: "[]", args: ["2", "never"] },

        { code: "var foo = { bar: \"baz\", }", args: ["2", "always"] },
        { code: "var foo = [ \"baz\", ]", args: ["2", "always"] },
        { code: "[,,]", args: ["2", "always"] },
        { code: "[,]", args: ["2", "always"] },
        { code: "[]", args: ["2", "always"] },
        { code: "foo[ bar, baz ]", args: ["2", "always"] }
    ],
    invalid: [
        { code: "var foo = { bar: \"baz\", }", args: ["2", "never"], errors: [{message: "Trailing comma.", type: "Property"}] },
        { code: "foo({ bar: \"baz\", qux: \"quux\", });", args: ["2", "never"], errors: [{ message: "Trailing comma.", type: "Property"}] },
        { code: "var foo = [ \"baz\", ]", args: ["2", "never"], errors: [{message: "Trailing comma.", type: "Literal"}]},
        { code: "var foo = { bar: \"bar\"\n\n, }", args: ["2", "never"], errors: [{message: "Trailing comma.", line: 3}]},

        { code: "var foo = { bar: \"baz\" }", args: ["2", "always"], errors: [{message: "No trailing comma.", type: "Property"}]},
        { code: "foo({ bar: \"baz\", qux: \"quux\" });", args: ["2", "always"], errors: [{message: "No trailing comma.", type: "Property"}]},
        { code: "var foo = [ \"baz\" ]", args: ["2", "always"], errors: [{message: "No trailing comma.", type: "Literal"}]},
        { code: "var foo = { bar: \"bar\"\n\n }", args: ["2", "always"], errors: [{message: "No trailing comma.", type: "Property"}]}
    ]
});
