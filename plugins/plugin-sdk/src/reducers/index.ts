import { SdkAction, SdkActionTypes, PluginState } from '../types'

export const reducer = (state: PluginState, action: SdkAction): PluginState | undefined => {
  switch (action.type) {
    case SdkActionTypes.GROUP_BY_UPDATE: {
      if (action.payload.controlPanelType) {
        return { ...state, [action.payload.controlPanelType]: action.payload.data ?? [] }
      }

      return state
    }
    case SdkActionTypes.DATE_RANGE_UPDATE: {
      return { ...state, [action.payload.controlPanelType!]: action.payload.data ?? '' }
    }
    case SdkActionTypes.SET_DATA:
      return action.payload.data ? { ...(action.payload.data as PluginState) } : (action.payload.data as undefined)
    default:
      throw new Error(`The action type wasn't expected: ${action.type}`)
  }
}
