import { Dispatch, useEffect } from 'react'
import { setData } from '../actions/updateData'
import { ControlPanelTypes, SdkAction, SdkActionTypes } from '../types'

export const sdkMessageHandler = (dispatch: Dispatch<SdkAction>) => {
  useEffect(() => {
    const handleMessages = (event: MessageEvent) => {
      if (event?.data?.__superSetMessage) {
        console.log(event.data.__superSetMessage)
        const widgetType = event.data.__superSetMessage.payload.type

        if (widgetType === ControlPanelTypes.ALL) {
          dispatch(setData(event.data.__superSetMessage.payload.data))
          return
        }

        const actionType = `${widgetType}_UPDATE` as SdkActionTypes
        dispatch({
          type: actionType,
          payload: { data: event.data.__superSetMessage.payload.data, widgetType },
        })
      }
    }
    window.addEventListener('message', handleMessages, false)

    return () => window.removeEventListener('message', handleMessages)
  }, [dispatch])
}
