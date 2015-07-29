/**
 * @fileoverview Tests for no-reserved-keys rule.
 * @author Emil Bay
 * @copyright 2014 Emil Bay. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-reserved-keys"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-reserved-keys", rule, {
    valid: [
        "var foo = { type: 1};",
        "var foo = { 'default': 1};",
        "var x = { foo: 1, bar: 2 };",
        "var x = { 1: 1, 2: 2 };",
        "+{ get a() { }, set a(b) { } };"
    ],
    invalid: [
        { code: "var x = { default: 1 };", errors: [{ message: "Reserved word 'default' used as key.", type: "ObjectExpression"}] },
        { code: "var foo = { if: 1, do: 2};", errors: [
            { message: "Reserved word 'if' used as key.", type: "ObjectExpression"},
            { message: "Reserved word 'do' used as key.", type: "ObjectExpression"}
        ] },
        { code: "var x = { get default() { }};", errors: [{ message: "Reserved word 'default' used as key.", type: "ObjectExpression"}] }
    ]
});
