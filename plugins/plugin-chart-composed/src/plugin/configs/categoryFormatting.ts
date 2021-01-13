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
import { ControlConfig } from '@superset-ui/chart-controls/lib/types';
import { MAX_FORM_CONTROLS } from '../utils';

type CategoryFormatting = [{ name: string; config: ControlConfig<'CheckboxControl'> }];

const categoryFormatting: CategoryFormatting[] = [];

const getCategoryFormatting = (index: number, source: string, name: string, title: string): CategoryFormatting => [
  {
    name: `use_category_formatting_${name}_${index}`,
    config: {
      type: 'CheckboxControl',
      renderTrigger: true,
      label: t(`Use ${title} ${index + 1} for tick label`),
      default: true,
      description: t(`Use ${title} ${index + 1} for tick label`),
      visibility: ({ form_data }: { form_data: QueryFormData }) => !!form_data?.[source]?.[index],
    },
  },
];

for (let i = 0; i < MAX_FORM_CONTROLS; i++) {
  categoryFormatting.push(getCategoryFormatting(i, 'group_by', 'group_by', t('"group by"')));
}

export { categoryFormatting };
