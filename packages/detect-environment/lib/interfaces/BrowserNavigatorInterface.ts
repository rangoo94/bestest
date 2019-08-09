interface BrowserNavigatorInterface {
  userAgent: string | null
  appCodeName: string | null
  appName: string | null
  appVersion: string | null
  platform: string | null
  hardwareConcurrency: number | null
  deviceMemory: number | null
}

export {
  BrowserNavigatorInterface
}
