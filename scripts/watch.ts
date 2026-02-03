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

    const changedFiles: string[] = []

    for (const { path } of events) {
      const workPath = path.replace(srcDir, '')

      if (
        workPath.startsWith('/src') 
        || workPath.endsWith('.js')
        || workPath.endsWith('.json')
        || workPath.endsWith('.ts')
        || workPath.endsWith('.lock')
      ) {
        if (!workPath.endsWith('scripts/watch.ts') && !workPath.endsWith('scripts/build.ts')) {
          changedFiles.push(workPath)
        }
      }
    }

    if (changedFiles.length > 0) {
      console.log(`\nChanged: ${changedFiles.join(', ')}`)
      await build()
    }
  }, {
    ignore: [ 'node_modules/**/*', '.git/**/*' ]
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
