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
import { buildQueryContext, JsonObject, QueryFormData } from '@superset-ui/core';
import { BinaryOperator, SetOperator } from '@superset-ui/core/lib/query/types/Operator';
import { CHART_TYPES, checkTimeSeries, has2Queries, MAX_FORM_CONTROLS, QueryMode, Sorting } from './utils';

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

export default function buildQuery(formData: QueryFormData, options?: JsonObject) {
  return buildQueryContext(formData, baseQueryObject => {
    const orderby: [string, boolean][] = [];

    const prefixYColumn = formData.query_mode === QueryMode.raw ? 'y_column' : 'metric';
    const prefixXColumn = formData.query_mode === QueryMode.raw ? 'x_column' : 'group_by';

    for (let i = 0; i < MAX_FORM_CONTROLS; i++) {
      const yColumn = formData.query_mode === QueryMode.raw ? formData.y_column : (formData.metrics?.[i] as string);
      if (formData[`use_order_by_${prefixYColumn}_${i}`] && yColumn) {
        orderby.push([yColumn, formData[`order_by_type_${prefixYColumn}_${i}`] === Sorting.ASC]);
      }

      const xColumn = formData.query_mode === QueryMode.raw ? formData.x_column : (formData.groupby?.[i] as string);
      if (formData[`use_order_by_${prefixXColumn}_${i}`] && xColumn) {
        orderby.push([xColumn, formData[`order_by_type_${prefixXColumn}_${i}`] === Sorting.ASC]);
      }
    }

    let columns: string[] = [];
    let groupby = [...(formData.groupby ?? []), ...(formData.columns ?? [])];
    if (formData.query_mode === QueryMode.raw) {
      columns = [formData.x_column, formData.y_column, ...(formData.columns ?? [])];
      groupby = [];
    }

    const metrics = [...(baseQueryObject.metrics ?? [])];
    if (formData.z_dimension && formData.chart_type === CHART_TYPES.BUBBLE_CHART) {
      metrics.push(formData.z_dimension);
    }
    let { filters } = baseQueryObject;
    const ownState = options?.ownState ?? {};
    if (ownState.filters) {
      // eslint-disable-next-line prefer-destructuring
      filters = ownState.filters;
    }
    if (ownState.groupBy) {
      groupby = ownState.groupBy as string[];
    }

    const queries = [
      {
        ...baseQueryObject,
        filters,
        metrics,
        orderby,
        is_timeseries: checkTimeSeries(
          formData.query_mode === QueryMode.raw ? formData.x_column : formData.groupby,
          formData.granularity_sqla,
          formData.layout,
        ),
        columns,
        groupby,
      },
    ];

    const secondMetric = has2Queries(formData);
    if (secondMetric) {
      const updatedMetrics = [...queries[0].metrics];
      updatedMetrics.splice(secondMetric.metricOrder, 1);
      queries[0].metrics = updatedMetrics;
      // @ts-ignore
      queries.push({
        ...baseQueryObject,
        metrics: [metrics[secondMetric.metricOrder]],
        orderby,
        is_timeseries: checkTimeSeries(
          formData.query_mode === QueryMode.raw ? formData.x_column : formData.groupby,
          formData.granularity_sqla,
          formData.layout,
        ),
        columns,
        groupby: groupby.filter(gb => !formData.columns?.includes(gb)),
      });
    }

    return queries;
  });
}
