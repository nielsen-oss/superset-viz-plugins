import { ExtraFormData } from '@superset-ui/core'
import { ControlPanelTypes, PluginState } from '../types'


export const getExtraFormData = (selectedItems: PluginState) => {
  if (selectedItems) {
    const {
      [ControlPanelTypes.GROUP_BY]: groupBy,
      [ControlPanelTypes.DATE_RANGE]: dateRange,
    } = selectedItems
    const extra: ExtraFormData = {
      ...(groupBy ? { interactive_groupby: groupBy } : {}),
      ...(dateRange ? { time_range: dateRange } : {}),
    }
    return extra
  }

  return {}
}
