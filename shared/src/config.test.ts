import { Config } from './config'

describe('Config', () => {
  it('should have correct values and its types', () => {
    expect(Config.EXAMPLE_VALUE).toBe('example xyz')
  })
})
