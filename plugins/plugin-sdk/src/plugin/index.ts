import { t, ChartMetadata, ChartPlugin, Behavior } from '@superset-ui/core'
import controlPanel from './controlPanel'
import transformProps from './transformProps'
import buildQuery from './buildQuery'
import thumbnail from '../images/thumbnail.png'

export default class SdkPlugin extends ChartPlugin {
  constructor() {
    const metadata = new ChartMetadata({
      description: 'If you\'re embedding superset dashboard this is the plugin for you .'+
          'is an SDK that expose chart common actions to the parent ',


      name: t('SDK'),
      // behaviors: [Behavior.INTERACTIVE_CHART, Behavior.NATIVE_FILTER],
      thumbnail,
    })

    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('../SdkPluginRoot'),
      metadata,
      transformProps,
    })
  }
}
