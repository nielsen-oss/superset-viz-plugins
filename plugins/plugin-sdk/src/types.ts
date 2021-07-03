/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { QueryFormData, DataRecord, FilterState, SetDataMaskHook } from '@superset-ui/core'

export interface SdkPluginStylesProps {
  height: number
  width: number
}

interface SdkPluginCustomizeProps {
  controlPaneTypes: ControlPanelTypes[]
  setDataMask: SetDataMaskHook
  filterState: FilterState
}

export type SdkPluginQueryFormData = QueryFormData &
  SdkPluginStylesProps &
  SdkPluginCustomizeProps

export type SdkPluginProps = SdkPluginStylesProps &
  SdkPluginCustomizeProps & {
    data: DataRecord[]
  }

export enum ControlPanelTypes {
  GROUP_BY = 'GROUP_BY',
  DATE_RANGE = 'DATE_RANGE',
  ALL = 'ALL',
}

export enum SdkActionTypes {
  SET_DATA = 'SET_DATA',
  GROUP_BY_UPDATE = 'GROUP_BY_UPDATE',
  DATE_RANGE_UPDATE = 'DATE_RANGE_UPDATE',
}

export interface SdkAction {
  type: SdkActionTypes
  payload: {
    controlPanelType?: ControlPanelTypes
    data?: string
  }
}

export interface PluginState {
  [ControlPanelTypes.GROUP_BY]?: Array<string>
  [ControlPanelTypes.DATE_RANGE]?: string
}

export type SelectorMapperObject<T> = {
  [K in ControlPanelTypes]?: T
}
