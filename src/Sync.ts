import {join} from 'path'
import {unlink, copy} from 'fs-extra'
import * as rsync from 'rsyncwrapper'

import {log} from './Utils'

export const dir = (p) => p.endsWith('/') ? p : `${p}/`

export const syncAll = (
  dest: string,
  source: string,
  exclude?: string[]
) => {
  return new Promise((resolve, reject) => {
    const options = {
      src: dir(source),
      dest: dir(dest),
      exclude,
      recursive: true
    }

    rsync(options, (error) => {
      if (error) {
        log.error(error)
        reject(error)
      }

      log.info(`init ${source} -> ${dest}`)
      resolve()
    })
  })
}

export const syncFile = (
  event: string,
  filename: string,
  source: string,
  rootPath: string
) => {
  const done = (error) => {
    if (error) {
      log.error(error)
      return
    }
    log.info(`${event} ${join(rootPath, filename)}`)
  }

  if (event === 'unlink') {
    unlink(join(rootPath, filename), done)
  } else {
    copy(
      join(source, filename),
      join(rootPath, filename),
      done
    )
  }
}
