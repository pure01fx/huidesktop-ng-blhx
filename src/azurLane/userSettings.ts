/* eslint-disable @typescript-eslint/strict-boolean-expressions */ // TODO

export enum MouseKeyFunction {
  void,
  touch,
  switchDance,
  // walk
}

const currentVersion = 5
const mouseKeyFunctionTotal = 4

export interface UserSettings {
  version: number
  name: string
  left: MouseKeyFunction
  right: MouseKeyFunction
  leftDrag: boolean
  rightDrag: boolean
  scale: number
  free: boolean
  opacity: number
  topMost: boolean
  hideTaskbarIcon: boolean
  clickTransparent: boolean
  flip: boolean
}

const tryParseInt = (sth: any, defaultValue: number): number => {
  try {
    return parseInt(sth || defaultValue)
  } catch {
    return defaultValue
  }
}

const tryParseFloat = (sth: any, defaultValue: number): number => {
  try {
    return parseFloat(sth || defaultValue)
  } catch {
    return defaultValue
  }
}

const inEnumRange = (sth: number, end: number, defaultValue?: number): number => {
  sth = Math.ceil(sth)
  if (sth < 0 || sth > end) return defaultValue ?? 0
  return sth
}

const inFloatRange = (sth: number, start: number, end: number, defaultValue?: number): number => {
  if (sth < start || sth > end) return defaultValue ?? 0
  return sth
}

const parseUserSettings = (name: string, config: string | null): UserSettings => {
  let obj: Partial<UserSettings> = config === null ? {} : JSON.parse(config)
  if (obj.version !== currentVersion) obj = {}
  const real: UserSettings = {
    version: currentVersion,
    name,
    left: inEnumRange(tryParseInt(obj.left, 0), mouseKeyFunctionTotal - 1),
    right: inEnumRange(tryParseInt(obj.right, 0), mouseKeyFunctionTotal - 1),
    leftDrag: !!obj.leftDrag,
    rightDrag: !!obj.rightDrag,
    topMost: !!obj.topMost,
    hideTaskbarIcon: !!obj.hideTaskbarIcon,
    opacity: inFloatRange(tryParseFloat(obj.opacity, 1), 0, 1, 1),
    scale: inFloatRange(tryParseFloat(obj.scale, 1), 0, 1, 1),
    free: !!obj.free,
    clickTransparent: !!obj.clickTransparent,
    flip: !!obj.flip
  }
  return real
}

export const loadUserSettingsFromLocalStorage = (name: string): UserSettings => {
  return parseUserSettings(name, localStorage.getItem(name))
}

export const saveUserSettingsToLocalStorage = (settings: UserSettings): void => {
  localStorage.setItem(settings.name, JSON.stringify(settings))
}

export const getUserSettingsFromHTMLDocument = (document: HTMLDocument, name: string): UserSettings => {
  const on = <T extends HTMLElement>(name: string): T => {
    const obj = document.getElementById(name)
    if (obj == null) throw new Error(`${name} not found in the document`)
    return obj as T
  }
  const onSelect: (name: string) => HTMLSelectElement = on
  const onInput: (name: string) => HTMLInputElement = on
  const settings: UserSettings = {
    version: currentVersion,
    name,
    left: onSelect('left-click').selectedIndex,
    right: onSelect('right-click').selectedIndex,
    leftDrag: onInput('dragmove-left').checked,
    rightDrag: onInput('dragmove-right').checked,
    topMost: onInput('top-most').checked,
    hideTaskbarIcon: !onInput('show-in-taskbar').checked,
    // walkRandom: parseInt(onInput('walk-random').value),
    opacity: parseFloat(onInput('opacity').value),
    scale: parseFloat(onInput('zoom').value),
    flip: onInput('reverse').checked,
    free: onInput('free').checked,
    clickTransparent: onInput('click-transparent').checked
  }
  return settings
}

export const showUserSettingsToHTMLDocument = (it: UserSettings, document: HTMLDocument): void => {
  const on = <T extends HTMLElement>(name: string): T => {
    const obj = document.getElementById(name)
    if (obj == null) throw new Error(`${name} not found in the document`)
    return obj as T
  }
  const onSelect: (name: string) => HTMLSelectElement = on
  const onInput: (name: string) => HTMLInputElement = on
  onSelect('left-click').selectedIndex = it.left
  onSelect('right-click').selectedIndex = it.right
  onInput('dragmove-left').checked = it.leftDrag
  onInput('dragmove-right').checked = it.rightDrag
  onInput('top-most').checked = it.topMost
  onInput('show-in-taskbar').checked = !it.hideTaskbarIcon
  // onInput('walk-random').value = it.walkRandom.toString()
  onInput('opacity').value = it.opacity.toString()
  onInput('zoom').value = it.scale.toString()
  onInput('reverse').checked = it.flip
  onInput('free').checked = it.free
  onInput('click-transparent').checked = it.clickTransparent
}
