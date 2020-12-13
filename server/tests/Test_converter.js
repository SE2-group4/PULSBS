const assert = require("assert").strict;
const mod = module.require("../src/utils/converter");

const testSuiteConverter = () => {
    const goo1 = { arg: "1", arg2: "2.1" };
    const goo2 = { arg: 1, arg2: 2.1 };
    const bad1 = { arg: undefined, arg2: "2.1" };
    const emp1 = {};
    const resEmp = {};
    const resGoo1 = { arg: 1, arg2: 2.1 };
    const resGoo2 = { arg: 1, arg2: 2.1 };
    const err1 = { error: { arg: undefined } };
    const errU = { error: { msg: "argument is undefined" } };
    const errN = { error: { msg: "argument is null" } };

    describe("convertToNumbers", function () {
        describe("convertToNumbers", function () {
            it("Should have returned length 2", () => {
                const res = mod.convertToNumbers(goo1);
                assert.equal(Object.keys(res).length, 2);
            });

            it("Failed good comparison 1", () => {
                const res = mod.convertToNumbers(goo1);
                assert.deepStrictEqual(res, resGoo1);
            });

            it("Failed good comparison 2", () => {
                const res = mod.convertToNumbers(goo2);
                assert.deepStrictEqual(res, resGoo2);
            });

            it("Failed bad comparison 1", () => {
                const res = mod.convertToNumbers(bad1);
                assert.deepStrictEqual(res, err1);
            });

            it("Failed empty comparison", () => {
                const res = mod.convertToNumbers(emp1);
                assert.deepStrictEqual(res, resEmp);
            });

            it("Failed reference comparison", () => {
                const res = mod.convertToNumbers(goo1);
                assert.notEqual(res, resGoo1);
            });

            it("Failed strict deep equal with input undefined ", () => {
                const res = mod.convertToNumbers(undefined);
                assert.deepStrictEqual(res, errU);
            });

            it("Failed strict deep equal with input null", () => {
                const res = mod.convertToNumbers(null);
                assert.deepStrictEqual(res, errN);
            });
        });

        describe("convertToBooleans", function () {
            it("Failed strict deep equal with input undefined", () => {
                const res = mod.convertToBooleans(undefined);
                assert.deepStrictEqual(res, errU);
            });

            it("Failed good1 comparison", () => {
                const good1 = { arg1: "fAlse", arg2: "TRUE" };
                const good2 = { arg1: "false", arg2: "true" };

                const resGood1 = { arg1: false, arg2: true };

                let res = mod.convertToBooleans(good1);
                assert.deepStrictEqual(res, resGood1);

                res = mod.convertToBooleans(good2);
                assert.deepStrictEqual(res, resGood1);
            });

            it("Failed good2 comparison", () => {
                const good1 = { arg1: false, arg2: true };

                let res = mod.convertToBooleans(good1);
                assert.deepStrictEqual(res, good1);
            });

            it("Failed reference comparison", () => {
                const good1 = { arg1: false, arg2: true };
                const res = mod.convertToBooleans(good1);

                assert.notEqual(good1, res);
            });

            it("Failed empty comparison", () => {
                const res = mod.convertToBooleans({});
                assert.deepStrictEqual(res, {});
            });
        });
    });
};

testSuiteConverter();
