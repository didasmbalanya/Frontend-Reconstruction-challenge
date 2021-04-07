import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';

const jestExpect = (global as any).expect as jest.Expect;

const passMessage = (actual, expected) => () =>
    `${matcherHint('.toBeJson')}\n\n` +
    `Expected object not to contain any of the following keys:\n` +
    `  ${printExpected(expected)}\n` +
    `Received:\n` +
    `  ${printReceived(actual)}`;

const failMessage = (actual, expected) => () =>
    `${matcherHint('.toBeJson')}\n\n` +
    `Expected object to contain any of the following keys:\n` +
    `  ${printExpected(expected)}\n` +
    `Received:\n` +
    `  ${printReceived(actual)}`;
jestExpect.extend({
    toBeJson: (actual, expected) => {
        let resultObject = actual;
        let expectedObject = expected;

        if (typeof actual === 'string') {
            resultObject = JSON.parse(actual);
        }
        if (typeof expected === 'string') {
            expectedObject = JSON.parse(expected);
        }
        const pass = expect.objectContaining(expectedObject).asymmetricMatch(resultObject);
        return {
            pass,
            message: pass ? passMessage(actual, expected) : failMessage(actual, expected),
        };
    },
});
global.afterEach(() => {
    jest.clearAllMocks();
});

jestExpect.extend({});
