import React, {useEffect, useReducer, useRef} from 'react'
import {styled} from '@superset-ui/core'
import {PluginState, SdkPluginProps, SdkPluginStylesProps,} from './types'
import {sdkMessageHandler} from './hooks/sdkMessageHandler'
import {Divider} from 'antd'

// Components
// Actions
import {getExtraFormData} from './utils/buildExtraFormData'
import {setData} from './actions/updateData'
import {reducer} from './reducers'

const Styles = styled.div<SdkPluginStylesProps>`
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height};
  width: ${({ width }) => width}px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  flex: 1;

  .ant-divider.ant-divider-horizontal:last-child {
    display: none;
  }
`

const StyledDivider = styled(Divider)`
  margin: 12px 0;
`

const buildDataMask = (data: PluginState) => {
  const dataMask = {
    extraFormData: getExtraFormData(data),
    filterState: {
      value: data,
    }
  }

  console.log(dataMask)
  return dataMask
}

export default function SdkPluginRoot({
                                        height,
                                        width,
                                        setDataMask,
                                        controlPanalTypes,
                                        filterState,
  data,
}: SdkPluginProps) {
  const [state, dispatch] = useReducer(reducer, {})
  const rootElem = useRef()

  useEffect(() => {
    if (state) {
      setDataMask(buildDataMask(state))
    }
  }, [state])

  sdkMessageHandler(dispatch)

  useEffect(() => {
    dispatch(setData(filterState.value))
    setDataMask(buildDataMask(filterState.value))
  }, [dispatch, JSON.stringify(filterState.value)])

  return (
    <Styles  height={height} width={width}>

        789
    </Styles>
  )
}
