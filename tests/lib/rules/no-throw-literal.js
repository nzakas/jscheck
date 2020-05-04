/**
 * @fileoverview Tests for no-throw-literal rule.
 * @author Dieter Oberkofler
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-throw-literal"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-throw-literal", rule, {
    valid: [
        "throw new Error();",
        "throw new Error('error');",
        "throw Error('error');",
        "var e = new Error(); throw e;",
        "try {throw new Error();} catch (e) {throw e;};",
        { code: "const err = Error('err'); throw err;", parserOptions: { ecmaVersion: 6 } },
        { code: "const err = new Error('err'); throw err;", parserOptions: { ecmaVersion: 6 } },
        { code: "const String = Error; throw String('err');", parserOptions: { ecmaVersion: 6 } },
        "throw new CustomError();",
        "throw CustomError();",
        "throw a;", // Identifier
        "throw foo();", // CallExpression
        "throw new foo();", // NewExpression
        "throw foo.bar;", // MemberExpression
        "throw foo[bar];", // MemberExpression
        "throw foo = new Error();", // AssignmentExpression
        "throw 1, 2, new Error();", // SequenceExpression
        "throw 'literal' && new Error();", // LogicalExpression (right)
        "throw new Error() || 'literal';", // LogicalExpression (left)
        "throw foo ? new Error() : 'literal';", // ConditionalExpression (consequent)
        "throw foo ? 'literal' : new Error();", // ConditionalExpression (alternate)
        { code: "throw tag `${foo}`;", parserOptions: { ecmaVersion: 6 } }, // TaggedTemplateExpression
        { code: "function* foo() { var index = 0; throw yield index++; }", parserOptions: { ecmaVersion: 6 } }, // YieldExpression
        { code: "async function foo() { throw await bar; }", parserOptions: { ecmaVersion: 8 } } // AwaitExpression
    ],
    invalid: [
        {
            code: "function foo() { const foo = 'str'; throw foo; }",
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw 'error';",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw 0;",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw false;",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw null;",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw {};",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw undefined;",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "function foo(undefined) {throw undefined;}",
            errors: [{
                messageId: "undef",
                type: "ThrowStatement"
            }]
        },
        {
            code: "const foo = 'foo'; throw foo;",
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },

        // String concatenation
        {
            code: "throw 'a' + 'b';",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "var b = new Error(); throw 'a' + b;",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },

        // AssignmentExpression
        {
            code: "throw foo = 'error';",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },

        // SequenceExpression
        {
            code: "throw new Error(), 1, 2, 3;",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },

        // LogicalExpression
        {
            code: "throw 'literal' && 'not an Error';",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },

        // ConditionalExpression
        {
            code: "throw foo ? 'not an Error' : 'literal';",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },

        // TemplateLiteral
        {
            code: "throw `${err}`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "object",
                type: "ThrowStatement"

            }]
        },

        {
            code: "const err = 'error'; throw err;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "object",
                type: "ThrowStatement"

            }]
        },
        {
            code: "throw new String('error');",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"

            }]
        },
        {
            code: "throw String('error');",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"

            }]
        },
        {
            code: "const foo = { bar: 'err' }; throw foo.bar;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "object",
                type: "ThrowStatement"

            }]
        },
        {
            code: "const Error = 'err'; throw Error;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "object",
                type: "ThrowStatement"

            }]
        },
        {
            code: "throw new Object();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "object",
                type: "ThrowStatement"

            }]
        }
    ]
});
