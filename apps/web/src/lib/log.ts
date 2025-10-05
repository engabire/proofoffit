type Level = 'debug' | 'info' | 'warn' | 'error'

const levelOrder: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 }
const currentLevel: Level = (process.env.LOG_LEVEL as Level) || 'info'

function emit(level: Level, args: unknown[]) {
  if (levelOrder[level] < levelOrder[currentLevel]) return
  const ts = new Date().toISOString()
  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'log' : level](`[${ts}] [${level.toUpperCase()}]`, ...args)
}

export const log = {
  debug: (...a: unknown[]) => emit('debug', a),
  info: (...a: unknown[]) => emit('info', a),
  warn: (...a: unknown[]) => emit('warn', a),
  error: (...a: unknown[]) => emit('error', a),
}
