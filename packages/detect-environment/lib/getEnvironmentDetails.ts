import { EnvironmentDetailsInterface } from './interfaces/EnvironmentDetailsInterface'
import { getBrowserEnvironmentDetails } from './getBrowserEnvironmentDetails'
import { getNodejsEnvironmentDetails } from './getNodejsEnvironmentDetails'
import { getEnvironmentType } from './getEnvironmentType'

function getEnvironmentDetails (): EnvironmentDetailsInterface {
  return {
    environment: getEnvironmentType(),
    nodejs: getNodejsEnvironmentDetails(),
    browser: getBrowserEnvironmentDetails()
  }
}

export {
  getEnvironmentDetails
}
