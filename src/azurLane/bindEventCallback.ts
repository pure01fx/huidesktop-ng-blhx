/**
 * 绑定事件
 * 事件 --> 动画变换
 */

import HuiDesktopIpcBridge from '../huiDesktopIpcBridge'
import { ManageSpine } from '../pixiHelper'
import ProcessManagementContainer from '../processManagementContainer'
import { MouseKeyFunction, UserSettings } from './userSettings'
import { motions } from './definitions'

export function bindEventCallback (container: ProcessManagementContainer, character: ManageSpine, extraState: { dancing: boolean}, userSettings: UserSettings, hui: HuiDesktopIpcBridge): void {
  const chuo = (): void => {
    if (container.current !== motions.idle) { return }
    container.enter(motions.chuo)
  }

  const switchDance = (): void => {
    if (container.current !== motions.idle) { return }
    extraState.dancing = !extraState.dancing
    container.enter(motions.idle)
  }

  const makeClickFunc = (func: MouseKeyFunction): (() => void) => {
    switch (func) {
      case MouseKeyFunction.touch: return chuo
      case MouseKeyFunction.switchDance: return switchDance
      default: return (): void => { }
    }
  }

  const leftClick = makeClickFunc(userSettings.left)
  const rightClick = makeClickFunc(userSettings.right)

  character.on('mousedown', leftClick)
  character.on('rightdown', rightClick)

  hui.onLeftClick(leftClick)
  hui.onLeftDown(() => container.enter(motions.drag))
  hui.onLeftUp(() => container.enter(motions.drop))
  hui.setLeftDrag(userSettings.leftDrag)

  hui.onRightClick(rightClick)
  hui.onRightDown(() => container.enter(motions.drag))
  hui.onRightUp(() => container.enter(motions.drop))
  hui.setRightDrag(userSettings.rightDrag)
}
