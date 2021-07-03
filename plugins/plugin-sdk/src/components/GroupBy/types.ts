import { Behavior, DataRecord, FilterState, QueryFormData, SetDataMaskHook } from '@superset-ui/core'

interface PluginFilterGroupByCustomizeProps {
  defaultValue?: string[] | null
  multiSelect: boolean
}

export type PluginFilterGroupByQueryFormData = QueryFormData & PluginFilterGroupByCustomizeProps

export type PluginFilterGroupByProps = {
  behaviors: Behavior[]
  data: DataRecord[]
  setDataMask: SetDataMaskHook
  filterState: FilterState
  formData: PluginFilterGroupByQueryFormData
}

export const DEFAULT_FORM_DATA: PluginFilterGroupByCustomizeProps = {
  defaultValue: null,
  multiSelect: false,
}
