import React, { createRef, useEffect, useReducer } from 'react'
import { styled } from '@superset-ui/core'
import {
  SdkPluginProps,
  SdkPluginStylesProps,
  PluginState,
} from './types'
import { sdkMessageHandler } from './hooks/sdkMessageHandler'
import { Divider } from 'antd'

// Components
import { WidgetSelectorLoader } from './components/WidgetSelectorLoader'
import GroupBy from './components/GroupBy'
import TimeFilter from './components/DateRange'
import { Footer } from './components/Footer'

// Actions
import { getExtraFormData } from './utils/buildExtraFormData'
import { setData } from './actions/updateData'
import { reducer } from './reducers'

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
  return {
    extraFormData: getExtraFormData(data),
    filterState: {
      value: data,
    },
  }
}

export default function SdkPluginRoot({
  height,
  width,
  setDataMask,
  filterState,
  defaultValue,
  data,
}: SdkPluginProps) {
  const [state, dispatch] = useReducer(reducer, defaultValue)
  const rootElem = createRef<HTMLDivElement>()

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

  useEffect(() => {
    dispatch(setData(defaultValue))
    setDataMask(buildDataMask(defaultValue))
  }, [dispatch, JSON.stringify(defaultValue)])

  return (
    <Styles ref={rootElem} height={height} width={width}>

        return (
          <React.Fragment key={type}>
           //todo :show text content here
          </React.Fragment>
        )
      })}
      <Footer widgetsState={state} />
    </Styles>
  )
}
