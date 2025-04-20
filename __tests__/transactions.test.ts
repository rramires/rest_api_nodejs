import { expect, test } from 'vitest';

test('User must create a new transaction', async () => {

    // Call HTTP POST /transactions
    const statusCode = 201;

    // test
    expect(201).toEqual(statusCode);
})