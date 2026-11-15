import { makeId } from '../id';

describe('makeId', () => {
  it('generates non-empty string IDs', () => {
    const id = makeId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(5);
  });

  it('generates unique IDs across calls', () => {
    const set = new Set<string>();
    for (let i = 0; i < 100; i++) {
      set.add(makeId());
    }
    expect(set.size).toBe(100);
  });
});

