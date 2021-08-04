import { ControlPanelTypes, } from '../types'
import { v4 as uuid } from 'uuid'

const createMessage = (type: ControlPanelTypes, data?: string[] | number[]) => ({
  __superSetMessage: {
    sentFrom: 'Superset',
    messageId: uuid(),
    payload: { type, data },
  },
})

// This is a rather exahustive solution but should be more generic
// than just posting a message to the parent frame.
const findSupersetDummyFrame = () => {
  const mockChildFrameToSearch = '__supersetDummyIframe'
  let frame: Window = window
  let supersetFrame
  // Loop from bottom to top on all frames to search the wanted frame
  while (frame) {
    try {
      if ((frame.frames as any)[mockChildFrameToSearch]) {
        supersetFrame = frame
        break
      }
    } catch (e) {
      console.error('An error occurred while looking through the frames', e)
    }
    if (frame === window.top) {
      break
    }
    frame = frame.parent
  }

  return supersetFrame
}

export const sendMessage = (type: ControlPanelTypes, selectedItems: string[] | number[]) => {
  const frameToPostMessageTo = findSupersetDummyFrame()
  frameToPostMessageTo && frameToPostMessageTo.postMessage(createMessage(type, selectedItems), '*')
}
