/**
 * @fileoverview Comma style
 * @author Vignesh Anand aka vegetableman
 * @copyright 2014 Vignesh Anand. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    validate = require("../../../lib/validate-options"),
    ESLintTester = require("eslint-tester");

var BAD_LN_BRK_MSG = "Bad line breaking before and after ','.",
    FIRST_MSG = "',' should be placed first.",
    LAST_MSG = "',' should be placed last.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint, validate);
eslintTester.addRuleTest("lib/rules/comma-style", {

    valid: [
        "var foo = 1, bar = 3;",
        "var foo = {'a': 1, 'b': 2};",
        "var foo = [1, 2];",
        "var foo = [, 2];",
        "var foo = [1, ];",
        "var foo = ['apples', \n 'oranges'];",
        "var foo = {'a': 1, \n 'b': 2, \n'c': 3};",
        "var foo = {'a': 1, \n 'b': 2, 'c':\n 3};",
        "var foo = {'a': 1, \n 'b': 2, 'c': [{'d': 1}, \n {'e': 2}, \n {'f': 3}]};",
        {code: "var foo = [1, \n2, \n3];"},
        {code: "function foo(){var a=[1,\n 2]}"},
        {code: "function foo(){return {'a': 1,\n'b': 2}}"},
        {code: "var foo = \n1, \nbar = \n2;"},
        {code: "var foo = \n1, \nbar = [1,\n2,\n3]"},
        {code: "var foo = ['apples'\n,'oranges'];", options: ["first"]},
        {code: "var foo = 1, bar = 2;", options: ["first"]},
        {code: "var foo = 1 \n ,bar = 2;", options: ["first"]},
        {code: "var foo = {'a': 1 \n ,'b': 2 \n,'c': 3};", options: ["first"]},
        {code: "var foo = [1 \n ,2 \n, 3];", options: ["first"]},
        {code: "function foo(){return {'a': 1\n,'b': 2}}", options: ["first"]},
        {code: "function foo(){var a=[1\n, 2]}", options: ["first"]},
        {
            code: "var a = 'a',\no = 'o';",
            args: [2, "first", {exceptions: {VariableDeclaration: true}}]
        },
        {
            code: "var arr = ['a',\n'o'];",
            args: [2, "first", {exceptions: {ArrayExpression: true}}]
        },
        {
            code: "var obj = {a: 'a',\nb: 'b'};",
            args: [2, "first", {exceptions: {ObjectExpression: true}}]
        },
        {
            code: "var a = 'a',\no = 'o',\narr = [1,\n2];",
            args: [2, "first", {exceptions: {VariableDeclaration: true, ArrayExpression: true}}]
        },
        {
            code: "var ar ={fst:1,\nsnd: [1,\n2]};",
            args: [2, "first", {exceptions: {ArrayExpression: true, ObjectExpression: true}}]
        },
        {
            code: "var ar ={fst:1,\nsnd: [1,\n2]};",
            args: [2, "first", {exceptions: {ArrayExpression: true, ObjectExpression: true}}]
        },
        {
            code: "var a = 'a',\nar ={fst:1,\nsnd: [1,\n2]};",
            args: [2, "first",
              {exceptions: {
                    ArrayExpression: true,
                    ObjectExpression: true,
                    VariableDeclaration: true
              }}]
        }
    ],

    invalid: [
        {
            code: "var foo = 1\n,\nbar = 2;",
            errors: [{
                message: BAD_LN_BRK_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var foo = 1\n,bar = 2;",
            errors: [{
                message: LAST_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "f([1,2\n,3]);",
            errors: [{
                message: LAST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "f([1,2\n,]);",
            errors: [{
                message: LAST_MSG,
                type: "Punctuator"
            }]
        },
        {
            code: "f([,2\n,3]);",
            errors: [{
                message: LAST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var foo = ['apples'\n, 'oranges'];",
            errors: [{
                message: LAST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var foo = 1,\nbar = 2;",
            args: [2, "first"],
            errors: [{
                message: FIRST_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "f([1,\n2,3]);",
            args: [2, "first"],
            errors: [{
                message: FIRST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var foo = ['apples', \n 'oranges'];",
            args: [2, "first"],
            errors: [{
                message: FIRST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var foo = {'a': 1, \n 'b': 2\n ,'c': 3};",
            args: [2, "first"],
            errors: [{
                message: FIRST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var foo = {'a': 1, \n 'b': 2\n ,'c': 3};",
            args: [2, "first"],
            errors: [{
                message: FIRST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var a = 'a',\no = 'o',\narr = [1,\n2];",
            args: [2, "first", {exceptions: {VariableDeclaration: true}}],
            errors: [{
                message: FIRST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var a = 'a',\nobj = {a: 'a',\nb: 'b'};",
            args: [2, "first", {exceptions: {VariableDeclaration: true}}],
            errors: [{
                message: FIRST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var a = 'a',\nobj = {a: 'a',\nb: 'b'};",
            args: [2, "first", {exceptions: {ObjectExpression: true}}],
            errors: [{
                message: FIRST_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var a = 'a',\narr = [1,\n2];",
            args: [2, "first", {exceptions: {ArrayExpression: true}}],
            errors: [{
                message: FIRST_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var ar =[1,\n{a: 'a',\nb: 'b'}];",
            args: [2, "first", {exceptions: {ArrayExpression: true}}],
            errors: [{
                message: FIRST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var ar =[1,\n{a: 'a',\nb: 'b'}];",
            args: [2, "first", {exceptions: {ObjectExpression: true}}],
            errors: [{
                message: FIRST_MSG,
                type: "ObjectExpression"
            }]
        },
        {
            code: "var ar ={fst:1,\nsnd: [1,\n2]};",
            args: [2, "first", {exceptions: {ObjectExpression: true}}],
            errors: [{
                message: FIRST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var ar ={fst:1,\nsnd: [1,\n2]};",
            args: [2, "first", {exceptions: {ArrayExpression: true}}],
            errors: [{
                message: FIRST_MSG,
                type: "Property"
            }]
        }
    ]
});
