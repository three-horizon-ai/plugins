import { azureDevboxPlugin } from './plugin';

describe('azure-devbox', () => {
  it('should export plugin', () => {
    expect(azureDevboxPlugin).toBeDefined();
  });
});
