/**
 * 定义变换
 * 变换 --> 具体操作
 */

import { ManageSpine } from '../pixiHelper'
import ProcessManagementContainer from '../processManagementContainer'
import { UserSettings } from './userSettings'
import { motions } from './definitions'
import { Tween } from '@tweenjs/tween.js'
import { getGround } from './helpers'
import { ModelConfig } from './modelConfig'

export const newTweenToGround = (target: number): Tween<any> => {
  return new Tween(huiDesktop.window).to({ top: target }, 0.666 * Math.abs(target - huiDesktop.window.top))
}

export default function processProcessManagementContainer (container: ProcessManagementContainer, character: ManageSpine, userSettings: UserSettings, modelConfig: ModelConfig, extraState: { dancing: boolean }, savePos: () => void): void {
  character.whenComplete('touch', () => container.enter(motions.idle))

  container.addEntry(motions.idle, () => character.loop(extraState.dancing ? 'dance' : 'stand2'))
  container.addEntry(motions.chuo, () => character.once('touch'))
  container.addEntry(motions.drag, () => character.loop('tuozhuai2'))

  container.addEntry(motions.drop, setLeave => {
    if (userSettings.free) { savePos(); container.enter(motions.idle); return }
    if (container.current !== motions.drag) { console.error('Unexpected current motion'); character.loop('tuozhuai2') }

    let devAtom = true // DEV
    const finish = (): void => {
      if (!devAtom) console.error()
      devAtom = false
      container.enter(motions.idle)
      savePos()
    }

    const tween = newTweenToGround(getGround(modelConfig, userSettings)).onStop(finish).onComplete(finish).start()
    setLeave(() => tween.stop())
  })
}
