/**
 * @fileoverview Tests for no-sync.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    validate = require("../../../lib/validate-options"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint, validate);
eslintTester.addRuleTest("lib/rules/no-sync", {
    valid: [
        "var foo = fs.foo.foo();"
    ],
    invalid: [
        { code: "var foo = fs.fooSync();", errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression"}] },
        { code: "var foo = fs.fooSync;", errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression"}] }
    ]
});
