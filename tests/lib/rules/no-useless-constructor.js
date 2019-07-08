/**
 * @fileoverview Tests for no-useless-constructor rule.
 * @author Alberto Rodriguez
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-constructor");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });
const error = { message: "Useless constructor.", type: "MethodDefinition" };

ruleTester.run("no-useless-constructor", rule, {
    valid: [
        "class A { }",
        "class A { constructor(){ doSomething(); } }",
        "class A extends B { constructor(){} }",
        "class A extends B { constructor(){ super('foo'); } }",
        "class A extends B { constructor(foo, bar){ super(foo, bar, 1); } }",
        "class A extends B { constructor(){ super(); doSomething(); } }",
        "class A extends B { constructor(...args){ super(...args); doSomething(); } }",
        "class A { dummyMethod(){ doSomething(); } }",
        "class A extends B.C { constructor() { super(foo); } }",
        "class A extends B.C { constructor([a, b, c]) { super(...arguments); } }",
        "class A extends B.C { constructor(a = f()) { super(...arguments); } }",
        "class A extends B { constructor(a, b, c) { super(a, b); } }",
        "class A extends B { constructor(foo, bar){ super(foo); } }",
        "class A extends B { constructor(test) { super(); } }",
        "class A extends B { constructor() { foo; } }",
        "class A extends B { constructor(foo, bar) { super(bar); } }"
    ],
    invalid: [
        {
            code: "class A { constructor(){} }",
            output: "class A {  }",
            errors: [error]
        },
        {
            code: "class A { 'constructor'(){} }",
            output: "class A {  }",
            errors: [error]
        },
        {
            code: "class A extends B { constructor() { super(); } }",
            output: "class A extends B {  }",
            errors: [error]
        },
        {
            code: "class A extends B { constructor(foo){ super(foo); } }",
            output: "class A extends B {  }",
            errors: [error]
        },
        {
            code: "class A extends B { constructor(foo, bar){ super(foo, bar); } }",
            output: "class A extends B {  }",
            errors: [error]
        },
        {
            code: "class A extends B { constructor(...args){ super(...args); } }",
            output: "class A extends B {  }",
            errors: [error]
        },
        {
            code: "class A extends B.C { constructor() { super(...arguments); } }",
            output: "class A extends B.C {  }",
            errors: [error]
        },
        {
            code: "class A extends B { constructor(a, b, ...c) { super(...arguments); } }",
            output: "class A extends B {  }",
            errors: [error]
        },
        {
            code: "class A extends B { constructor(a, b, ...c) { super(a, b, ...c); } }",
            output: "class A extends B {  }",
            errors: [error]
        }
    ]
});
