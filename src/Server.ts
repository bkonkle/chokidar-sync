import {resolve, basename, relative, join, dirname} from 'path'
import {sync as isSymlink} from 'is-symlink'
import {removeSync} from 'fs-extra'
import {watch} from 'chokidar'

import {dir, syncAll, syncFile} from './Sync'

export interface SyncMap {
  [relative: string]: {src: string, dest: string},
}

const createSyncMap = (
  sync: {src: string, dest: string}[]
) => sync.reduce<SyncMap>((map, config) => {
  const relative = resolve(process.cwd(), config.src)
  return {
    ...map,
    [relative]: {
      src: config.src,
      dest: resolve(process.cwd(), config.dest),
    }
  }
}, {})

export const watchPaths = (
  sync: {src: string, dest: string}[],
  exclude?: string[]
) => {
  const syncMap = createSyncMap(sync)

  // The relative paths to each sync source
  const paths = Object.keys(syncMap)

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

/**
 * Runs the sync operation once for all files. Used at the beginning of the
 * service.
 */
export const once = (
  sync: {src: string, dest: string}[],
  exclude?: string[]
) => {
  const syncMap = createSyncMap(sync)

  // The relative paths to each sync source
  const paths = Object.keys(syncMap)

  // initial sync
  return Promise.all(paths.map(key => {
    if (isSymlink(key)) removeSync(key)
    return syncAll(syncMap[key].dest, key, exclude)
  }))
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
  return once(sync, exclude)
    .then(() => watchPaths(sync, exclude))
    .catch(error => { throw error })
}
