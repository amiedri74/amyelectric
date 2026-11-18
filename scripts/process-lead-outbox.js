import { processPendingLeads } from '../lib/lead-outbox'
import { getPool } from '../lib/db'

async function main() {
  try {
    const results = await processPendingLeads(Number.parseInt(process.env.LEAD_WORKER_BATCH_SIZE || '25', 10))
    process.stdout.write(JSON.stringify({ processed: results.length, results }, null, 2) + '\\n')
    if (results.some((item) => item.error)) process.exitCode = 1
  } finally {
    await getPool().end()
  }
}

main().catch((error) => {
  process.stderr.write((error.stack || error.message) + '\\n')
  process.exitCode = 1
})
