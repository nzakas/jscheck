/**
 * @fileoverview Tests for no-process-env rule.
 * @author Vignesh Anand
 * @copyright 2014 Vignesh Anand. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/no-process-env", {

    valid: [
        "Process.env",
        "process[env]",
        "process.nextTick",
        "process.execArgv"
    ],

    invalid: [
        {
            code: "process.env",
            errors: [{
                message: "Unexpected use of process.env.",
                type: "MemberExpression"
            }]
        },
        {
            code: "process.env.ENV",
            errors: [{
                message: "Unexpected use of process.env.",
                type: "MemberExpression"
            }]
        },
        {
            code: "f(process.env)",
            errors: [{
                message: "Unexpected use of process.env.",
                type: "MemberExpression"
            }]
        }
    ]
});
