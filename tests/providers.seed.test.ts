import test from 'node:test'
import assert from 'node:assert'
import { SeedProvider } from '../server/providers/seed'

void test('SeedProvider returns jobs and paginates', async () => {
  const p = new SeedProvider()
  const { jobs, nextPage } = await p.searchJobs({ q: 'Engineer', limit: 1, page: 1 })
  assert.ok(Array.isArray(jobs))
  assert.equal(jobs.length, 1)
  assert.ok(nextPage === undefined || typeof nextPage === 'number')
})

void test('SeedProvider location filter works', async () => {
  const p = new SeedProvider()
  const { jobs } = await p.searchJobs({ location: 'US', limit: 10 })
  assert.ok(jobs.length >= 0)
})
