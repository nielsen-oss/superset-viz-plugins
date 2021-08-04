/* eslint camelcase: 0 */
import { t, tn } from '@superset-ui/core'
import React, { Dispatch } from 'react'
import { Select } from 'antd'
import { PluginFilterGroupByProps } from './types'
import { updateGroupBy } from '../../actions/updateData'
import { SdkAction } from '../../types'

const { Option } = Select

type GroupByProps = PluginFilterGroupByProps & {
  dispatch: Dispatch<SdkAction>
  selectedItems: string[]
}

const handleSelectChange = (newValue: string[], allOptions: any) => {
  if (newValue.includes('all')) {
    return allOptions.map((option: any) => option.column_name)
  } else {
    return newValue
  }
}

export default function GroupBy(props: GroupByProps) {
  const { data, dispatch, selectedItems } = props

  const columns = data || []
  const placeholderText =
    columns.length === 0 ? t('No columns') : tn('%s option', '%s options', columns.length, columns.length)
  return (
    <React.Fragment>
      <label>{t('Columns')}</label>
      <Select
        allowClear
        placeholder={placeholderText}
        value={selectedItems}
        mode='multiple'
        onChange={newValue => dispatch(updateGroupBy(handleSelectChange(newValue, columns)))}
      >
        <Option value='all'>{t('All')}</Option>
        {columns.map((row: any) => {
          const { column_name: columnName, verbose_name: verboseName } = row
          return (
            <Option key={columnName} value={columnName}>
              {verboseName ?? columnName}
            </Option>
          )
        })}
      </Select>
    </React.Fragment>
  )
}
