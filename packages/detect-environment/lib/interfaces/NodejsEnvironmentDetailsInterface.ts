import { AbstractEnvironmentDetailsInterface } from './AbstractEnvironmentDetailsInterface'

interface NodejsEnvironmentDetailsInterface extends AbstractEnvironmentDetailsInterface {
  arch: string | null
  v8: string | null
  type: string | null
  release: string | null
}

export {
  NodejsEnvironmentDetailsInterface
}
