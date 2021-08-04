import {ExtraFormData} from '@superset-ui/core'
import {ControlPanelTypes, PluginState} from '../types'


export const getExtraFormData = (pluginState: PluginState) => {
    if (pluginState) {
        const {
            [ControlPanelTypes.GROUP_BY]: groupBy,
            [ControlPanelTypes.DATE_RANGE]: dateRange,
        } = pluginState
        const extra: ExtraFormData = {
            ...(groupBy ? {interactive_groupby: groupBy} : {}),
            ...(dateRange ? {time_range: dateRange} : {}),
        }


        extra.filters = pluginState.data
        return extra
    }

    return {}
}
