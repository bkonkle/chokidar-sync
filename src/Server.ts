import {resolve, basename, relative, join, dirname} from 'path'
import {sync as isSymlink} from 'is-symlink'
import {removeSync} from 'fs-extra'
import {watch} from 'chokidar'

import {syncAll, syncFile} from './Sync'

interface StartOptions {sources: string[], dest: string, exclude?: string[]}

/*
 * Starts the file watching service. Syncs the whole directories when the
 * service is started, and as files are changed, copies individual file
 * modifications one by one
 */
export const start = ({sources, dest, exclude}: StartOptions) => {
  const ROOT_PATH = process.cwd()

  const paths = sources.map(directory => resolve(process.cwd(), directory))

  // initial sync
  for (const key in paths) {
    if (isSymlink(key)) {
      removeSync(key)
    }
    syncAll(dest, key, basename(key), exclude)
  }

  const dir = (p) => p.endsWith('/') ? p : `${p}/`
  const watcher = watch(sources, {
    ignoreInitial: true,
    ignored: exclude
  })

  watcher.on('all', (event, changedPath) => {
    const sourcePath = resolve(dirname(changedPath))
    const sourceFile = basename(changedPath)
    let rootDirectory
    let packageName
    for (const key in sources) {
      if (dir(sourcePath).startsWith(dir(key))) {
        rootDirectory = key
        packageName = basename(key)
        break
      }
    }

    const relativePath = relative(
      resolve(rootDirectory),
      sourcePath
    )

    const targetPath = join(
      ROOT_PATH,
      dest,
      packageName,
      relativePath
    )

    syncFile(event, sourceFile, sourcePath, targetPath)
  })
}
