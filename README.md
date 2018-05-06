# chokidar-sync

Initial working version.

Adapted from: https://github.com/FormidableLabs/whackage

## Quick Start

```js
import {start} from 'chokidar-sync'

const main = () => {
  const sync = [{src: '../core-library', dest: './core-library'}]
  start(sync)
}

main()
```
