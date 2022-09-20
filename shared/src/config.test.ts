import { Config } from './config'

describe('Config', () => {
  it('should have correct values and its types', () => {
    expect(Config.SERVER_PORT).toBe(5348)
  })
})
