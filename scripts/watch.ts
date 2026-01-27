/**
 * Watch script for sandstone development
 * Rebuilds on file changes
 */

import { $ } from 'bun'
import { join } from 'path'
import { subscribe } from '@parcel/watcher'

const rootDir = join(import.meta.dir, '..')
const srcDir = join(rootDir, 'src')

let building = false
let pendingBuild = false

async function build() {
  if (building) {
    pendingBuild = true
    return
  }

  building = true
  console.log('\nRebuilding...')
  const start = performance.now()

  try {
    $.cwd(rootDir)
    await $`bun run build`.quiet()
    const elapsed = ((performance.now() - start) / 1000).toFixed(2)
    console.log(`Build completed in ${elapsed}s`)
  } catch (err) {
    console.error('Build failed:', err)
  }

  building = false

  if (pendingBuild) {
    pendingBuild = false
    await build()
  }
}

async function main() {
  console.log('Starting sandstone watch mode...')
  console.log(`Watching: ${srcDir}\n`)

  // Initial build
  await build()

  // Watch for changes
  const subscription = await subscribe(srcDir, async (err, events) => {
    if (err) {
      console.error('Watch error:', err)
      return
    }

    const relevantEvents = events.filter(e =>
      e.path.endsWith('.ts') && !e.path.includes('node_modules')
    )

    if (relevantEvents.length > 0) {
      console.log(`\nChanged: ${relevantEvents.map(e => e.path.replace(srcDir, '')).join(', ')}`)
      await build()
    }
  })

  console.log('Press Ctrl+C to stop watching\n')

  // Keep process alive
  process.on('SIGINT', async () => {
    console.log('\nStopping watch...')
    await subscription.unsubscribe()
    process.exit(0)
  })
}

main().catch((err) => {
  console.error('Watch error:', err)
  process.exit(1)
})
