import {resolve, basename, relative, join, dirname} from 'path'
import {sync as isSymlink} from 'is-symlink'
import {removeSync} from 'fs-extra'
import {watch} from 'chokidar'

import {dir, syncAll, syncFile} from './Sync'

interface SyncMap {
  [relative: string]: {src: string, dest: string},
}

export const watchPaths = (
  paths: string[],
  syncMap: SyncMap,
  exclude?: string[]
) => {
  const watcher = watch(paths, {
    ignoreInitial: true,
    ignored: exclude
  })

  watcher.on('all', (event, changedPath) => {
    const sourcePath = resolve(dirname(changedPath))
    const sourceFile = basename(changedPath)

    interface Result {root: string, name: string, dest: string}

    const result = paths.reduce<Result | null>((memo, key) => {
      if (memo) return memo
      if (dir(sourcePath).startsWith(dir(key))) {
        return {root: key, name: basename(key), dest: syncMap[key].dest}
      }
      return memo
    }, null)

    if (result) {
      const {root, dest, name} = result
      const relativePath = relative(
        resolve(root),
        sourcePath
      )

      const targetPath = join(
        dest,
        name,
        relativePath
      )

      syncFile(event, sourceFile, sourcePath, targetPath)
    }
  })
}

/*
 * Starts the file watching service. Syncs the whole directories when the
 * service is started, and as files are changed, copies individual file
 * modifications one by one
 */
export const start = (
  sync: {src: string, dest: string}[],
  exclude?: string[]
) => {
  const syncMap = sync.reduce<SyncMap>((map, config) => {
    const relative = resolve(process.cwd(), config.src)
    return {
      ...map,
      [relative]: {
        src: config.src,
        dest: config.dest,
      }
    }
  }, {})

  // The relative paths to each sync source
  const paths = Object.keys(syncMap)

  // initial sync
  for (const key of paths) {
    if (isSymlink(key)) {
      removeSync(key)
    }
    syncAll(syncMap[key].dest, key, exclude)
      .then(() => watchPaths(paths, syncMap, exclude))
      .catch(error => { throw error })
  }
}
