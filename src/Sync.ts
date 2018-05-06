import {join} from 'path'
import {unlink, copy} from 'fs-extra'
import rsync from 'rsyncwrapper'

import {log} from './Utils'

export const syncAll = (
  rootPath: string,
  source: string,
  name: string,
  exclude?: string[]
) => {
  const options = {
    src: `${source}/`,
    dest: join(rootPath, name),
    exclude,
    recursive: true
  }

  rsync(options, (error) => {
    if (error) {
      console.error('error', error)
      return
    }

    log.info(`init ${source} -> ${join('node_modules', name)}`)
  })
}

export const syncFile = (
  event: string,
  filename: string,
  source: string,
  dest: string
) => {
  const done = (error) => {
    if (error) {
      log.error(error)
      return
    }
    log.info(`${event} ${join(dest, filename)}`)
  }

  if (event === 'unlink') {
    unlink(join(dest, filename), done)
  } else {
    copy(
      join(source, filename),
      join(dest, filename),
      done
    )
  }
}
