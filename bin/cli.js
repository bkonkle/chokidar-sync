#!/usr/bin/env node
const yargs = require('yargs')
const Server = require('../dist/index').default

const VERSION = 'chokidar-cli: ' + require('../package.json').version +
  '\nchokidar: ' + require('chokidar/package').version

const toArray = value => value && (Array.isArray(value) ? value : [value])

const argv = yargs
  .usage(
    'Usage: chokidar-sync <source:dest> [<source:dest>...] [options]\n\n' +
    '  <source:dest>:\n' +
    '    A colon:separated mapping of source folder to destination folder.\n'
  )
  .example('chokidar-sync ../core-library:node_modules/core-library', 'sync the "../core-library" folder to the "node_modules/core-library" folder')
  .example('chokidar-sync ../core-library:node_modules/core-library --exclude "node_modules"', 'exclude the contents of "node_modules')
  .demand(1)
  .boolean('o', {
    alias: 'once',
    describe: 'Runs the sync operation once, copying all files in one go.'
  })
  .option('e', {
    alias: 'exclude',
    describe: 'Pattern for files which should be ignored. ' +
              'Needs to be surrounded with quotes to prevent shell globbing. ' +
              'The whole relative or absolute path is tested, not just filename. ' +
              'Supports glob patters or regexes using format: /yourmatch/i '
  })
  .help('h')
  .alias('v', 'version')
  .version(VERSION)
  .argv

const main = () => {
  const patterns = argv._
  const sources = patterns.map(pattern => {
    const args = pattern.split(':')
    return {src: args[0], dest: args[1]}
  })
  if (argv.once) {
    Server.once(sources, toArray(argv.exclude))
  } else {
    Server.start(sources, toArray(argv.exclude))
  }
}

main()
