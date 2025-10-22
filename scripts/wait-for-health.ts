#!/usr/bin/env tsx

const defaultConfig = {
  url: 'http://localhost:3000/api/health',
  method: 'HEAD',
  timeoutMs: 60_000,
  intervalMs: 1_000,
}

type Config = typeof defaultConfig

function parseArgs(): Config {
  const config: Config = { ...defaultConfig }

  for (const arg of process.argv.slice(2)) {
    if (!arg.startsWith('--')) continue
    const [key, value] = arg.slice(2).split('=')
    if (!value) continue

    switch (key) {
      case 'url':
        config.url = value
        break
      case 'method':
        config.method = value.toUpperCase()
        break
      case 'timeout':
      case 'timeoutMs':
        config.timeoutMs = Number.parseInt(value, 10) || config.timeoutMs
        break
      case 'interval':
      case 'intervalMs':
        config.intervalMs = Number.parseInt(value, 10) || config.intervalMs
        break
      default:
        break
    }
  }

  return config
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const config = parseArgs()
  const start = Date.now()

  // eslint-disable-next-line no-console
  console.log(
    `Waiting for ${config.url} (${config.method}) with timeout ${config.timeoutMs}ms…`,
  )

  while (Date.now() - start < config.timeoutMs) {
    try {
      const response = await fetch(config.url, { method: config.method })
      if (response.ok) {
        const duration = Date.now() - start
        // eslint-disable-next-line no-console
        console.log(
          `Health check succeeded (${response.status}) after ${duration}ms`,
        )
        return
      }

      // eslint-disable-next-line no-console
      console.warn(
        `Health check returned ${response.status}. Retrying in ${config.intervalMs}ms…`,
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `Health check failed: ${
          error instanceof Error ? error.message : String(error)
        }. Retrying in ${config.intervalMs}ms…`,
      )
    }

    await sleep(config.intervalMs)
  }

  const elapsed = Date.now() - start
  // eslint-disable-next-line no-console
  console.error(
    `Timed out after ${elapsed}ms waiting for ${config.url}. Exiting with code 1.`,
  )
  process.exit(1)
}

main()
