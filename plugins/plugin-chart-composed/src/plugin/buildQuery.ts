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
import { AdhocMetric, buildQueryContext, QueryFormData } from '@superset-ui/core';
import { BinaryOperator, SetOperator } from '@superset-ui/core/lib/query/types/Operator';
import { MAX_FORM_CONTROLS, SortingType } from './utils';

// Not correctly imported form node_modules, so add it here
export type QueryFormExtraFilter = {
  col: string;
} & (
  | {
      op: BinaryOperator;
      val: string;
    }
  | {
      op: SetOperator;
      val: string[];
    }
);

export default function buildQuery(formData: QueryFormData) {
  return buildQueryContext(formData, baseQueryObject => {
    const orderby: [string, boolean][] = [];
    for (let i = 0; i < MAX_FORM_CONTROLS / 2; i++) {
      const metric = (formData?.metrics as AdhocMetric[])?.[i]?.label;
      if (formData[`use_order_by_metric_${i}`] && metric) {
        orderby.push([metric as string, formData[`order_by_type_metric_${i}`] === SortingType.ASC]);
      }
    }
    for (let i = 0; i < MAX_FORM_CONTROLS / 2; i++) {
      const groupBy = formData?.group_by?.[i] as string;
      if (formData[`use_order_by_group_by_${i}`] && groupBy) {
        orderby.push([groupBy, formData[`order_by_type_group_by_${i}`] === SortingType.ASC]);
      }
    }
    return [
      {
        ...baseQueryObject,
        orderby,
      },
    ];
  });
}
