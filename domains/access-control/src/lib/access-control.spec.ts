import { accessControl } from './access-control.js';

describe('accessControl', () => {
  it('should work', () => {
    expect(accessControl()).toEqual('access-control');
  });
});
