import { ControlPanelTypes, SdkActionTypes, PluginState } from '../types'

export const updateGroupBy = (data: string[]) =>
  <const>{
    type: SdkActionTypes.GROUP_BY_UPDATE,
    payload: {
      widgetType: ControlPanelTypes.GROUP_BY,
      data,
    },
  }

export const updateDateRange = (data: string) =>
  <const>{
    type: SdkActionTypes.DATE_RANGE_UPDATE,
    payload: {
      widgetType: ControlPanelTypes.DATE_RANGE,
      data,
    },
  }

export const setData = (data: PluginState) =>
  <const>{
    type: SdkActionTypes.SET_DATA,
    payload: { data },
  }
