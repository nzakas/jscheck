/**
 * @fileoverview Tests for config validator.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    Linter = require("../../../lib/linter"),
    validator = require("../../../lib/config/config-validator");

const linter = new Linter();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/**
 * Fake a rule object
 * @param {Object} context context passed to the rules by eslint
 * @returns {Object} mocked rule listeners
 * @private
 */
function mockRule(context) {
    return {
        Program(node) {
            context.report(node, "Expected a validation error.");
        }
    };
}

mockRule.schema = [
    {
        enum: ["first", "second"]
    }
];

/**
 * Fake a rule object
 * @param {Object} context context passed to the rules by eslint
 * @returns {Object} mocked rule listeners
 * @private
 */
function mockObjectRule(context) {
    return {
        Program(node) {
            context.report(node, "Expected a validation error.");
        }
    };
}

mockObjectRule.schema = {
    enum: ["first", "second"]
};

/**
 * Fake a rule with no options
 * @param {Object} context context passed to the rules by eslint
 * @returns {Object} mocked rule listeners
 * @private
 */
function mockNoOptionsRule(context) {
    return {
        Program(node) {
            context.report(node, "Expected a validation error.");
        }
    };
}

mockNoOptionsRule.schema = [];

const mockRequiredOptionsRule = {
    meta: {
        schema: {
            type: "array",
            minItems: 1
        }
    },
    create(context) {
        return {
            Program(node) {
                context.report(node, "Expected a validation error.");
            }
        };
    }
};

describe("Validator", () => {

    /**
     * Gets a loaded rule given a rule ID
     * @param {string} ruleId The ID of the rule
     * @returns {{create: Function}} The loaded rule
     */
    function ruleMapper(ruleId) {
        return linter.getRules().get(ruleId);
    }

    beforeEach(() => {
        linter.defineRule("mock-rule", mockRule);
        linter.defineRule("mock-required-options-rule", mockRequiredOptionsRule);
        linter.defineRule("plugin/mock-rule", mockRule);
    });

    describe("validate", () => {

        it("should do nothing with an empty config", () => {
            validator.validate({}, "tests", ruleMapper, linter.environments);
        });

        it("should do nothing with a valid eslint config", () => {
            validator.validate(
                {
                    root: true,
                    globals: { globalFoo: "bar" },
                    parser: "parserFoo",
                    env: { browser: true },
                    plugins: ["pluginFoo", "pluginBar"],
                    settings: { foo: "bar" },
                    extends: ["configFoo", "configBar"],
                    parserOptions: { foo: "bar" },
                    rules: {}
                },
                "tests",
                ruleMapper,
                linter.environments
            );
        });

        it("should throw with an unknown property", () => {
            const fn = validator.validate.bind(
                null,
                {
                    foo: true
                },
                "tests",
                ruleMapper,
                linter.environments
            );

            assert.throws(fn, "Unexpected top-level property \"foo\".");
        });

        describe("root", () => {
            it("should throw with a string value", () => {
                const fn = validator.validate.bind(null, { root: "true" }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Property \"root\" is the wrong type (expected boolean but got `\"true\"`).");
            });

            it("should throw with a numeric value", () => {
                const fn = validator.validate.bind(null, { root: 0 }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Property \"root\" is the wrong type (expected boolean but got `0`).");
            });
        });

        describe("globals", () => {
            it("should throw with a string value", () => {
                const fn = validator.validate.bind(null, { globals: "jQuery" }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Property \"globals\" is the wrong type (expected object but got `\"jQuery\"`).");
            });

            it("should throw with an array value", () => {
                const fn = validator.validate.bind(null, { globals: ["jQuery"] }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Property \"globals\" is the wrong type (expected object but got `[\"jQuery\"]`).");
            });
        });

        describe("parser", () => {
            it("should not throw with a null value", () => {
                validator.validate({ parser: null }, null, ruleMapper, linter.environments);
            });
        });

        describe("env", () => {

            it("should throw with an array environment", () => {
                const fn = validator.validate.bind(null, { env: [] }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Property \"env\" is the wrong type (expected object but got `[]`).");
            });

            it("should throw with a primitive environment", () => {
                const fn = validator.validate.bind(null, { env: 1 }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Property \"env\" is the wrong type (expected object but got `1`).");
            });

            it("should catch invalid environments", () => {
                const fn = validator.validate.bind(null, { env: { browser: true, invalid: true } }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Environment key \"invalid\" is unknown\n");
            });

            it("should catch disabled invalid environments", () => {
                const fn = validator.validate.bind(null, { env: { browser: true, invalid: false } }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Environment key \"invalid\" is unknown\n");
            });

            it("should do nothing with an undefined environment", () => {
                validator.validate({}, null, ruleMapper, linter.environments);
            });

        });

        describe("plugins", () => {
            it("should not throw with an empty array", () => {
                validator.validate({ plugins: [] }, null, ruleMapper, linter.environments);
            });

            it("should throw with a string", () => {
                const fn = validator.validate.bind(null, { plugins: "react" }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Property \"plugins\" is the wrong type (expected array but got `\"react\"`).");
            });
        });

        describe("settings", () => {
            it("should not throw with an empty object", () => {
                validator.validate({ settings: {} }, null, ruleMapper, linter.environments);
            });

            it("should throw with an array", () => {
                const fn = validator.validate.bind(null, { settings: ["foo"] }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Property \"settings\" is the wrong type (expected object but got `[\"foo\"]`).");
            });
        });

        describe("extends", () => {
            it("should not throw with an empty array", () => {
                validator.validate({ extends: [] }, null, ruleMapper, linter.environments);
            });

            it("should not throw with a string", () => {
                validator.validate({ extends: "react" }, null, ruleMapper, linter.environments);
            });

            it("should throw with an object", () => {
                const fn = validator.validate.bind(null, { extends: {} }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Property \"extends\" is the wrong type (expected string/array but got `{}`).");
            });
        });

        describe("parserOptions", () => {
            it("should not throw with an empty object", () => {
                validator.validate({ parserOptions: {} }, null, ruleMapper, linter.environments);
            });

            it("should throw with an array", () => {
                const fn = validator.validate.bind(null, { parserOptions: ["foo"] }, null, ruleMapper, linter.environments);

                assert.throws(fn, "Property \"parserOptions\" is the wrong type (expected object but got `[\"foo\"]`).");
            });
        });

        describe("rules", () => {

            it("should do nothing with an empty rules object", () => {
                validator.validate({ rules: {} }, "tests", ruleMapper, linter.environments);
            });

            it("should do nothing with a valid config with rules", () => {
                validator.validate({ rules: { "mock-rule": [2, "second"] } }, "tests", ruleMapper, linter.environments);
            });

            it("should do nothing with a valid config when severity is off", () => {
                validator.validate({ rules: { "mock-rule": ["off", "second"] } }, "tests", ruleMapper, linter.environments);
            });

            it("should do nothing with an invalid config when severity is off", () => {
                validator.validate({ rules: { "mock-required-options-rule": "off" } }, "tests", ruleMapper, linter.environments);
            });

            it("should do nothing with an invalid config when severity is an array with 'off'", () => {
                validator.validate({ rules: { "mock-required-options-rule": ["off"] } }, "tests", ruleMapper, linter.environments);
            });

            it("should do nothing with a valid config when severity is warn", () => {
                validator.validate({ rules: { "mock-rule": ["warn", "second"] } }, "tests", ruleMapper, linter.environments);
            });

            it("should do nothing with a valid config when severity is error", () => {
                validator.validate({ rules: { "mock-rule": ["error", "second"] } }, "tests", ruleMapper, linter.environments);
            });

            it("should do nothing with a valid config when severity is Off", () => {
                validator.validate({ rules: { "mock-rule": ["Off", "second"] } }, "tests", ruleMapper, linter.environments);
            });

            it("should do nothing with a valid config when severity is Warn", () => {
                validator.validate({ rules: { "mock-rule": ["Warn", "second"] } }, "tests", ruleMapper, linter.environments);
            });

            it("should do nothing with a valid config when severity is Error", () => {
                validator.validate({ rules: { "mock-rule": ["Error", "second"] } }, "tests", ruleMapper, linter.environments);
            });

            it("should catch invalid rule options", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-rule": [3, "third"] } }, "tests", ruleMapper, linter.environments);

                assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
            });

            it("should allow for rules with no options", () => {
                linter.defineRule("mock-no-options-rule", mockNoOptionsRule);

                validator.validate({ rules: { "mock-no-options-rule": 2 } }, "tests", ruleMapper, linter.environments);
            });

            it("should not allow options for rules with no options", () => {
                linter.defineRule("mock-no-options-rule", mockNoOptionsRule);

                const fn = validator.validate.bind(null, { rules: { "mock-no-options-rule": [2, "extra"] } }, "tests", ruleMapper, linter.environments);

                assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-no-options-rule\" is invalid:\n\tValue [\"extra\"] should NOT have more than 0 items.\n");
            });
        });

        describe("overrides", () => {
            it("should not throw with an empty overrides array", () => {
                validator.validate({ overrides: [] }, "tests", ruleMapper, linter.environments);
            });

            it("should not throw with a valid overrides array", () => {
                validator.validate({ overrides: [{ files: "*", rules: {} }] }, "tests", ruleMapper, linter.environments);
            });

            it("should throw if override does not specify files", () => {
                const fn = validator.validate.bind(null, { overrides: [{ rules: {} }] }, "tests", ruleMapper, linter.environments);

                assert.throws(fn, "ESLint configuration in tests is invalid:\n\t- \"overrides[0]\" should have required property 'files'. Value: {\"rules\":{}}.\n");
            });

            it("should throw if override has an empty files array", () => {
                const fn = validator.validate.bind(null, { overrides: [{ files: [] }] }, "tests", ruleMapper, linter.environments);

                assert.throws(fn, "ESLint configuration in tests is invalid:\n\t- Property \"overrides[0].files\" is the wrong type (expected string but got `[]`).\n\t- \"overrides[0].files\" should NOT have fewer than 1 items. Value: [].\n\t- \"overrides[0].files\" should match exactly one schema in oneOf. Value: [].\n");
            });

            it("should throw if override has nested overrides", () => {
                const fn = validator.validate.bind(null, { overrides: [{ files: "*", overrides: [{ files: "*", rules: {} }] }] }, "tests", ruleMapper, linter.environments);

                assert.throws(fn, "ESLint configuration in tests is invalid:\n\t- Unexpected top-level property \"overrides[0].overrides\".\n");
            });

            it("should throw if override extends", () => {
                const fn = validator.validate.bind(null, { overrides: [{ files: "*", extends: "eslint-recommended" }] }, "tests", ruleMapper, linter.environments);

                assert.throws(fn, "ESLint configuration in tests is invalid:\n\t- Unexpected top-level property \"overrides[0].extends\".\n");
            });

            it("should throw if override tries to set root", () => {
                const fn = validator.validate.bind(null, { overrides: [{ files: "*", root: "true" }] }, "tests", ruleMapper, linter.environments);

                assert.throws(fn, "ESLint configuration in tests is invalid:\n\t- Unexpected top-level property \"overrides[0].root\".\n");
            });

            describe("env", () => {

                it("should catch invalid environments", () => {
                    const fn = validator.validate.bind(null, { overrides: [{ files: "*", env: { browser: true, invalid: true } }] }, null, ruleMapper, linter.environments);

                    assert.throws(fn, "Environment key \"invalid\" is unknown\n");
                });

                it("should catch disabled invalid environments", () => {
                    const fn = validator.validate.bind(null, { overrides: [{ files: "*", env: { browser: true, invalid: false } }] }, null, ruleMapper, linter.environments);

                    assert.throws(fn, "Environment key \"invalid\" is unknown\n");
                });

            });

            describe("rules", () => {

                it("should catch invalid rule options", () => {
                    const fn = validator.validate.bind(null, { overrides: [{ files: "*", rules: { "mock-rule": [3, "third"] } }] }, "tests", ruleMapper, linter.environments);

                    assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
                });

                it("should not allow options for rules with no options", () => {
                    linter.defineRule("mock-no-options-rule", mockNoOptionsRule);

                    const fn = validator.validate.bind(null, { overrides: [{ files: "*", rules: { "mock-no-options-rule": [2, "extra"] } }] }, "tests", ruleMapper, linter.environments);

                    assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-no-options-rule\" is invalid:\n\tValue [\"extra\"] should NOT have more than 0 items.\n");
                });
            });

        });

    });

    describe("getRuleOptionsSchema", () => {

        it("should return null for a missing rule", () => {
            assert.strictEqual(validator.getRuleOptionsSchema(ruleMapper("non-existent-rule")), null);
        });

        it("should not modify object schema", () => {
            linter.defineRule("mock-object-rule", mockObjectRule);
            assert.deepStrictEqual(validator.getRuleOptionsSchema(ruleMapper("mock-object-rule")), {
                enum: ["first", "second"]
            });
        });

    });

    describe("validateRuleOptions", () => {

        it("should throw for incorrect warning level number", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("mock-rule"), "mock-rule", 3, "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
        });

        it("should throw for incorrect warning level string", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("mock-rule"), "mock-rule", "booya", "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '\"booya\"').\n");
        });

        it("should throw for invalid-type warning level", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("mock-rule"), "mock-rule", [["error"]], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '[ \"error\" ]').\n");
        });

        it("should report for nonexistent rules", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("non-existent-rule"), "non-existent-rule", [2, "foobar"], "tests");

            assert.throws(fn, "Definition for rule 'non-existent-rule' was not found.");
        });

        it("should only check warning level for plugin rules", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("plugin/mock-rule"), "plugin/mock-rule", 3, "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"plugin/mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
        });

        it("should throw for incorrect configuration values", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("mock-rule"), "mock-rule", [2, "frist"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tValue \"frist\" should be equal to one of the allowed values.\n");
        });

        it("should throw for too many configuration values", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("mock-rule"), "mock-rule", [2, "first", "second"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tValue [\"first\",\"second\"] should NOT have more than 1 items.\n");
        });

    });

});
