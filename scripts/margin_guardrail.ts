import { readFile } from 'node:fs/promises'

type MarginRecord = {
  eligibilityId: string
  orgName: string
  tier: string
  discountPct: number
  donorCoveragePct: number
}

async function loadMarginSnapshot(filePath: string): Promise<MarginRecord[]> {
  const raw = await readFile(filePath, 'utf-8')
  return JSON.parse(raw) as MarginRecord[]
}

export async function checkMarginFloors(filePath: string, floorPct = 0.3) {
  const rows = await loadMarginSnapshot(filePath)
  return rows.filter((row) => row.discountPct / 100 > floorPct && row.donorCoveragePct < 0.5)
}

if (require.main === module) {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: ts-node scripts/margin_guardrail.ts <snapshot.json> [floorPct]')
    process.exit(1)
  }

  const floorPct = process.argv[3] ? Number(process.argv[3]) : 0.3

  checkMarginFloors(filePath, floorPct)
    .then((breaches) => {
      if (breaches.length === 0) {
        console.info('No margin guardrail breaches detected.')
        return
      }

      console.warn(`Detected ${breaches.length} nonprofit discount breaches:`)
      breaches.forEach((row) => {
        console.warn(` - ${row.orgName} (${row.tier}) at ${row.discountPct}% discount; donor coverage ${row.donorCoveragePct * 100}%`)
      })
      process.exitCode = 1
    })
    .catch((error) => {
      console.error('Margin guardrail check failed', error)
      process.exit(1)
    })
}
