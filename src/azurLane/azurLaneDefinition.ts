import TWEEN from '@tweenjs/tween.js'
import HuiDesktopIpcBridge from '../huiDesktopIpcBridge'
import { ModelConfig } from './modelConfig'
import { ManagedApplication, ManageSpine } from '../pixiHelper'
import ProcessManagementContainer from '../processManagementContainer'
import processProcessManagementContainer from './processProcessManagementContainer'
import { initializeWindow } from './shapeHelper'
import { getUserSettingsFromHTMLDocument, loadUserSettingsFromLocalStorage, saveUserSettingsToLocalStorage, showUserSettingsToHTMLDocument, UserSettings } from './userSettings'
import { bindEventCallback } from './bindEventCallback'
import { motions } from './definitions'

const applyPureUserSettings = (hui: HuiDesktopIpcBridge, userSettings: UserSettings): void => {
  hui.setTopMost(userSettings.topMost)
  hui.hideTaskbarIcon(userSettings.hideTaskbarIcon)
  hui.setClickTransparent(userSettings.clickTransparent)
}

const initializeApp = (app: ManagedApplication, modelConfig: ModelConfig, userSettings: UserSettings): void => {
  // 你猜
  app.opacity = userSettings.opacity.toString()

  // 设置世界坐标原点，这样小人就不需要管坐标了~
  app.raw.stage.x = modelConfig.x0 * userSettings.scale
  app.raw.stage.y = (modelConfig.height - modelConfig.y0) * userSettings.scale
  // 如果只设置了翻转，且不走动，那么由于窗口大小的原因，要“翻转”x
  if (userSettings.flip) app.raw.stage.x = app.raw.view.width - app.raw.stage.x
}

const initializeCharacter = (character: ManageSpine, modelConfig: ModelConfig, userSettings: UserSettings): void => {
  character.raw.stateData.defaultMix = 1 / 6
  character.setScale(userSettings.scale, userSettings.flip)
}

export default async (modelConfig: ModelConfig): Promise<void> => {
  const hui = new HuiDesktopIpcBridge()
  const uname = `cc.huix.blhx.${modelConfig.name}`
  const userSettings = loadUserSettingsFromLocalStorage(uname)
  const container = new ProcessManagementContainer()
  const extraState = { dancing: false }

  applyPureUserSettings(hui, userSettings)

  const { size, savePos } = initializeWindow(hui, modelConfig, userSettings)
  const app = new ManagedApplication(size)
  initializeApp(app, modelConfig, userSettings)

  const character = await ManageSpine.downloadFromSkelUrl(modelConfig.location)
  initializeCharacter(character, modelConfig, userSettings)
  processProcessManagementContainer(container, character, userSettings, modelConfig, extraState, savePos)
  bindEventCallback(container, character, extraState, userSettings, hui)
  app.add(character)

  const loop = (time: number): void => {
    TWEEN.update(time)
    app.render()
    requestAnimationFrame(time => loop(time))
  }

  container.enter(motions.idle)
  app.start()
  requestAnimationFrame(time => loop(time))

  saveUserSettingsToLocalStorage(userSettings)

  window.saveSettings = d => saveUserSettingsToLocalStorage(getUserSettingsFromHTMLDocument(d, userSettings.name))
  window.showSettings = d => showUserSettingsToHTMLDocument(userSettings, d)
  hui.setUserSettingsResponse(() => window.open('config.html', '设置', 'width=370, height=480'))
}
