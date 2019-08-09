import { AbstractEnvironmentDetailsInterface } from './AbstractEnvironmentDetailsInterface'

interface BrowserEnvironmentDetailsInterface extends AbstractEnvironmentDetailsInterface {
  isJsDom: boolean | null
  appCodeName: string | null
  appName: string | null
}

export {
  BrowserEnvironmentDetailsInterface
}
