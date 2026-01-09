const { spawnSync } = require('node:child_process')

process.env.RUN_INTEGRATION = 'true'

const mochaPath = require.resolve('mocha/bin/mocha')
const result = spawnSync(
  process.execPath,
  [mochaPath, 'test/integration/**/*.test.js'],
  {
    stdio: 'inherit',
    env: process.env,
  },
)

if (result.error) {
  console.error(result.error)
  process.exit(1)
}

process.exit(result.status == null ? 1 : result.status)
