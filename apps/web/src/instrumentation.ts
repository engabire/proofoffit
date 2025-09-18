export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // This file provides proper instrumentation entry point
    // Analytics is initialized in the app layout instead
  }
}
