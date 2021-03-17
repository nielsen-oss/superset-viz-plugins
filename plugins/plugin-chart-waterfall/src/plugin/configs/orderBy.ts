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
import { SortingType, SortingTypeNames } from '../utils';

type Sorting = [
  { name: string; config: ControlConfig<'CheckboxControl'> },
  { name: string; config: SelectControlConfig<{ value: SortingType; label: string }, 'SelectControl'> },
];

const orderBy: Sorting[] = [];

const getOrderByRow = ({
  name,
  title,
  renderTrigger = false,
}: {
  name: string;
  title: string;
  renderTrigger?: boolean;
}): Sorting => [
  {
    name: `use_order_by_${name}`,
    config: {
      type: 'CheckboxControl',
      label: t(`Use sorting for ${title}`),
      default: false,
      renderTrigger,
      description: t(`Use sorting for ${title}`),
    },
  },
  {
    name: `order_by_${name}`,
    config: {
      label: t(`Sorting type ${title}`),
      type: 'SelectControl',
      clearable: false,
      options: Object.values(SortingType).map(key => ({
        value: key,
        label: SortingTypeNames[key],
      })),
      renderTrigger,
      visibility: ({ form_data }: { form_data: QueryFormData }) => !!form_data[`use_order_by_${name}`],
      default: SortingType.ASC,
      description: t(`Set Ascending / Descending sorting for ${title}`),
    },
  },
];

[
  { title: t('"xAxis Column"'), name: 'x_axis_column' },
  { title: t('"Period Column"'), name: 'period_column' },
  { title: t('"Metric"'), name: 'metric' },
  { title: t('"Change"'), name: 'change', renderTrigger: true },
].forEach(item => {
  orderBy.push(getOrderByRow(item));
});

export { orderBy };
