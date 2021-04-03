import appMain from './azurLane/azurLaneDefinition'
import autoMake from './autoMake'
import { ModelConfig, parseModelConfig } from './azurLane/modelConfig'

const batKey = 'cc.huix.blhx.current'

const bat = (list: string[]): void => {
  const current = (() => {
    const s = sessionStorage.getItem(batKey)
    if (s === null) {
      sessionStorage.setItem(batKey, '1')
      return 1
    } else return parseInt(s)
  })()
  if (list.length < current) {
    const ele = document.createElement('div')
    ele.innerText = 'finished'
    document.body.append(ele)
  } else {
    const name = list[current - 1]
    autoMake(`${name}/files/${name}`).then(async settings => {
      sessionStorage.setItem(batKey, (current + 1).toString())
      return await fetch(`/sandbox/${name}/config`, { method: 'POST', body: JSON.stringify(settings) })
    }).then(() => location.reload()).catch(err => console.error(err))
  }
}

const enterMain = (conf: ModelConfig): void => {
  appMain(conf).catch(e => console.error(e))
}

fetch('https://huidesktop/config')
  .then(async response => await response.text())
  .then(param => {
    if (param.startsWith('[')) bat(JSON.parse(param))
    else if (!param.includes('{')) {
      autoMake(param)
        .then(async settings => await fetch('/config', { method: 'POST', body: JSON.stringify(settings) }))
        .then(() => location.reload())
        .catch(console.error)
    } else enterMain(parseModelConfig(param))
  })
  .catch(console.error)
