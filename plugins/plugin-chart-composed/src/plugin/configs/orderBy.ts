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
import { QueryFormData, t } from '@superset-ui/core';
import { ControlConfig, SelectControlConfig } from '@superset-ui/chart-controls/lib/types';
import { MAX_FORM_CONTROLS, QueryMode, SortingTypeNames, Sorting as SortingType } from '../utils';

type Sorting = [
  { name: string; config: ControlConfig<'CheckboxControl'> },
  { name: string; config: SelectControlConfig<{ value: SortingType; label: string }, 'SelectControl'> },
];

const orderByMetric: Sorting[] = [];
const orderByGroupBy: Sorting[] = [];
const orderByColumns: Sorting[] = [];

const getOrderByRow = (source: string, name: string, title: string, index?: number): Sorting => [
  {
    name: `use_order_by_${name}_${index ?? 0}`,
    config: {
      type: 'CheckboxControl',
      label: t(`Use sorting for ${title} ${index === undefined ? '' : index + 1}`),
      default: false,
      description: t(
        `Use sorting for ${title} ${index === undefined ? '' : index + 1}${
          source === 'metrics'
            ? ' (if you use "BarChart", can be applied correctly only without composition with other charts)'
            : ''
        }`,
      ),
      visibility: ({ form_data }: { form_data: QueryFormData }) =>
        ((form_data.query_mode === QueryMode.aggregate && (source === 'metrics' || source === 'groupby')) ||
          (form_data.query_mode === QueryMode.raw && (source === 'y_column' || source === 'x_column'))) &&
        (index === undefined || !!form_data[source]?.[index]),
    },
  },
  {
    name: `order_by_type_${name}_${index ?? 0}`,
    config: {
      label: t(`Sorting type ${index === undefined ? '' : index + 1}`),
      type: 'SelectControl',
      clearable: false,
      options: Object.values(SortingType).map(key => ({
        value: key,
        label: SortingTypeNames[key],
      })),
      visibility: ({ form_data }: { form_data: QueryFormData }) =>
        ((form_data.query_mode === QueryMode.aggregate && (source === 'metrics' || source === 'groupby')) ||
          (form_data.query_mode === QueryMode.raw && (source === 'y_column' || source === 'x_column'))) &&
        !!(form_data[`use_order_by_${name}_${index ?? 0}`] && (index === undefined || form_data[source]?.[index])),
      default: SortingType.ASC,
      description: t(`Set Ascending / Descending sorting for ${title} ${index === undefined ? '' : index + 1}`),
    },
  },
];

for (let i = 0; i < MAX_FORM_CONTROLS; i++) {
  orderByGroupBy.push(getOrderByRow('groupby', 'group_by', t('"group by"'), i));
}

for (let i = 0; i < MAX_FORM_CONTROLS; i++) {
  orderByMetric.push(getOrderByRow('metrics', 'metric', t('"metric"'), i));
}

orderByColumns.push(getOrderByRow('x_column', 'x_column', t('"X Column"')));
orderByColumns.push(getOrderByRow('y_column', 'y_column', t('"Y Column"')));

export { orderByMetric, orderByGroupBy, orderByColumns };
