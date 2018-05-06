import chalk from 'chalk'

export const log = {
  info: (message: string) => {
    console.log(chalk.cyan('[chokidar-sync]'), message)
  },
  error: (message: string) => {
    console.log(chalk.red('[chokidar-sync]'), message)
  }
}
