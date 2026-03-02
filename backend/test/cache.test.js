const cache = require('../utils/cache');

describe('cache utility', () => {
  beforeEach(async () => {
    // clear internal map if available
    if (cache.del) {
      await cache.del('foo');
    }
  });

  test('stores and retrieves value with TTL', async () => {
    await cache.set('foo', { bar: 123 }, 100);
    const v = await cache.get('foo');
    expect(v).toEqual({ bar: 123 });
    // wait until expired
    await new Promise(r => setTimeout(r, 120));
    const v2 = await cache.get('foo');
    expect(v2).toBeNull();
  });
});
