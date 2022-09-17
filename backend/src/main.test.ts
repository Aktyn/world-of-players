import { Config } from '@world-of-players/shared'

import { init } from './main'

describe('init', () => {
  it('should return the example value', () => {
    const result = init()
    expect(result).toEqual(Config.EXAMPLE_VALUE)
  })
})
