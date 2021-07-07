export * from './components'

export { default as config } from './managers/config'
export { default as i18n } from './managers/i18n'
export { default as validation } from './managers/rule'
export { default as alert } from './managers/alert'
export { default as confirm } from './managers/confirm'
export { default as prompt } from './managers/prompt'
export { default as toast } from './managers/toast'

export { default as useControllable } from './mixins/controllable'
export { default as useSearchable } from './mixins/searchable'
export { default as useUi } from './mixins/ui'
export { default as useInput } from './mixins/input'

export {
  alert as alertPlugin,
  confirm as confirmPlugin,
  prompt as promptPlugin,
  toast as toastPlugin
} from './plugins'

export * from './directives'
