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
import { buildQueryContext, QueryFormData } from '@superset-ui/core';
import { BinaryOperator, SetOperator } from '@superset-ui/core/lib/query/types/Operator';
import { SortingType } from './utils';

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
    if (formData.use_order_by_period_column) {
      orderby.push([formData?.period_column, formData.order_by_period_column === SortingType.ASC]);
    }
    if (formData.use_order_by_x_axis_column) {
      orderby.push([formData?.x_axis_column, formData.order_by_x_axis_column === SortingType.ASC]);
    }
    if (formData.use_order_by_metric) {
      orderby.push([formData?.metric?.label, formData.order_by_metric === SortingType.ASC]);
    }

    return [
      {
        ...baseQueryObject,
        orderby,
        groupby: [formData.x_axis_column, formData.period_column],
      },
    ];
  });
}
