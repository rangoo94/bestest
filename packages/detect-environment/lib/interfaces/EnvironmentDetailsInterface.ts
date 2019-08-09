import { EnvironmentType } from './EnvironmentType'
import { NodejsEnvironmentDetailsInterface } from './NodejsEnvironmentDetailsInterface'
import { BrowserEnvironmentDetailsInterface } from './BrowserEnvironmentDetailsInterface'

interface EnvironmentDetailsInterface {
  environment: EnvironmentType
  nodejs: NodejsEnvironmentDetailsInterface
  browser: BrowserEnvironmentDetailsInterface
}

export {
  EnvironmentDetailsInterface
}
