import { ModelConfig } from './modelConfig'
import { UserSettings } from './userSettings'

export const getGround = (mc: ModelConfig, us: UserSettings): number => huiDesktop.workingArea.height - ((mc.height - mc.y0) * us.scale)
