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
import { ChartProps, JsonObject } from '@superset-ui/core';
import { AxisInterval } from 'recharts';
import {
  ChartConfig,
  ColorSchemeByItem,
  Data,
  Deepness,
  HiddenTickLabels,
  Layout,
  ResultData,
  SortingType,
  StickyScatters,
  YColumnsMeta,
} from '../components/types';
import { addRechartsKeyAndGetXColumnValues, getXColumnValues } from '../components/utils';
import { ComposedChartProps } from '../components/ComposedChart';
import {
  CHART_SUB_TYPES,
  CHART_TYPES,
  checkTimeSeries,
  enumsMapChartSubType,
  enumsMapChartType,
  enumsMapSticky,
  enumSorting,
  FormData,
  getChartSubType,
  getLabel,
  has2Queries,
  QueryMode,
  sortOrderedBars,
  STICK_TYPES,
} from './utils';

export default function transformProps(chartProps: ChartProps) {
  const { width, height, queriesData, hooks = {}, ownState, rawFormData } = chartProps;
  const data = queriesData[0].data as Data[];
  const formData = chartProps.formData as FormData;
  let xColumns: string[];
  let yColumns: string[];

  const { setDataMask = () => {} } = hooks;

  if (formData.queryMode === QueryMode.raw) {
    xColumns = [formData.xColumn];
    yColumns = [formData.yColumn];
  } else {
    xColumns = ownState?.groupBy ?? formData.groupby;
    yColumns = formData.metrics?.map(metric => metric.label ?? metric);
  }

  const xColumnValues: string[] = [];
  const hasTimeSeries = checkTimeSeries(xColumns, formData.granularitySqla, formData.layout);

  const hiddenTickLabels: HiddenTickLabels = {};
  data.forEach(item => {
    const dataKey = xColumns.map(field => getXColumnValues(field, item, xColumnValues));
    dataKey.forEach((value, index) => {
      if (!hasTimeSeries && !formData[`useCategoryFormattingGroupBy${index}`]) {
        hiddenTickLabels[value] = true;
      }
    });
  });

  const resultData: ResultData[] = addRechartsKeyAndGetXColumnValues(
    data,
    xColumnValues,
    hasTimeSeries,
    xColumns,
    hiddenTickLabels,
  );

  if (hasTimeSeries) {
    resultData.sort(
      ({ __timestamp: __timestamp2 }, { __timestamp: __timestamp1 }) =>
        (__timestamp2 as number) - (__timestamp1 as number),
    );
  }

  const secondQuery = has2Queries(rawFormData);

  const chartSubType = getChartSubType(
    formData.chartType,
    formData.barChartSubType,
    formData.lineChartSubType,
    formData.areaChartSubType,
    formData.scatterChartSubType,
    formData.bubbleChartSubType,
    formData.normChartSubType,
  );

  const chartTypeMetrics: (keyof typeof CHART_TYPES)[] = [];
  const chartSubTypeMetrics: (keyof typeof CHART_SUB_TYPES)[] = [];
  const hasCustomTypeMetrics: boolean[] = [];
  const colorSchemeByMetric: ColorSchemeByItem = {};
  const colorSchemeByBreakdown: ColorSchemeByItem = {};
  const hideLegendByMetric: boolean[] = [];
  const stickyScatters: { [key: string]: StickyScatters } = {};

  const metrics = formData.metrics.map(({ label }) => label);
  formData.coloredBreakdowns?.forEach((cb, i) => {
    colorSchemeByBreakdown[(cb.comparator as unknown) as string] = formData[`colorSchemeByBreakdown${i}`];
  });

  if (formData.queryMode !== QueryMode.raw) {
    yColumns.forEach((yColumn, index) => {
      hasCustomTypeMetrics.push(formData[`useCustomTypeMetric${index}`] as boolean);
      hideLegendByMetric.push(
        // @ts-ignore
        (formData[`hideLegendByMetric${index}`] as boolean) || yColumns[secondQuery?.metricOrder] === yColumn,
      );
      if (formData[`hasColorSchemeMetric${index}`]) {
        colorSchemeByMetric[yColumn] = formData[`colorSchemeByMetric${index}`];
      }
      if (
        formData[`stickToBars${index}`] &&
        formData.chartType === CHART_TYPES.BAR_CHART &&
        formData.barChartSubType === CHART_SUB_TYPES.DEFAULT &&
        formData[`chartTypeMetric${index}`] === CHART_TYPES.SCATTER_CHART &&
        (formData[`scatterChartSubTypeMetric${index}`] === CHART_SUB_TYPES.ARROW_UP ||
          formData[`scatterChartSubTypeMetric${index}`] === CHART_SUB_TYPES.CIRCLE ||
          formData[`scatterChartSubTypeMetric${index}`] === CHART_SUB_TYPES.ARROW_DOWN)
      ) {
        stickyScatters[metrics[index]] = enumsMapSticky[formData[`stickToBars${index}`] as keyof typeof STICK_TYPES];
      }
      chartTypeMetrics.push(formData[`chartTypeMetric${index}`] as keyof typeof CHART_TYPES);
      chartSubTypeMetrics.push(
        getChartSubType(
          formData[`chartTypeMetric${index}`] as keyof typeof CHART_TYPES,
          formData[`barChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
          formData[`lineChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
          formData[`areaChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
          formData[`scatterChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
          formData[`bubbleChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
          formData[`normChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
        ),
      );
    });
  }

  const orderByYColumn = formData.useOrderByMetric0 && formData.orderByTypeMetric0;

  const hasOrderedBars = formData.chartType === CHART_TYPES.BAR_CHART && !!orderByYColumn;

  if (hasOrderedBars) {
    sortOrderedBars(
      resultData,
      xColumnValues,
      formData,
      formData.queryMode === QueryMode.raw ? 'XAxisColumn' : 'GroupBy',
    );
  }

  const hasDrillDown = (ownState?.deepness?.length ?? 0) < formData.drillDownGroupBy?.length;
  const handleChartClick = (obj?: JsonObject) => {
    const initDeepness = [...(ownState.deepness ?? [])];
    const initFilters = [...(ownState?.filters ?? [])];
    let deepness: Deepness[];
    let filters: JsonObject[];
    let groupBy: string;
    if (obj?.index !== undefined) {
      deepness = initDeepness.slice(0, obj?.index);
      filters = initFilters.slice(0, obj?.index);
      // eslint-disable-next-line prefer-destructuring
      groupBy = deepness[deepness.length - 1]?.groupBy;
    } else {
      groupBy = formData.drillDownGroupBy[initDeepness?.length];
      deepness = initDeepness.concat({ ...obj, label: `${groupBy}: ${obj?.value}`, groupBy });
      filters = initFilters.concat({
        col: ownState?.groupBy?.[0] ?? formData.groupby[0],
        op: '==',
        val: deepness[deepness.length - 1]?.value,
      });
    }

    setDataMask({
      ownState: {
        deepness,
        groupBy: groupBy ? [groupBy] : null,
        filters,
      },
    });
  };

  const yColumnsMeta = yColumns.reduce(
    (acc, cur, index) => ({
      ...acc,
      [cur]: {
        chartType: hasCustomTypeMetrics[index]
          ? enumsMapChartType[chartTypeMetrics[index]]
          : enumsMapChartType[formData.chartType],
        chartSubType: hasCustomTypeMetrics[index]
          ? enumsMapChartSubType[chartSubTypeMetrics[index]]
          : enumsMapChartSubType[formData.chartSubType as string],
        hideLegend: hideLegendByMetric[index],
      } as ChartConfig,
    }),
    {} as YColumnsMeta,
  );

  const result: ComposedChartProps = {
    columnNames: formData.columns,
    width,
    height,
    hasTimeSeries,
    xColumns,
    layout: formData.layout,
    chartType: enumsMapChartType[formData.chartType],
    // @ts-ignore
    chartSubType,
    colorSchemes: {
      __DEFAULT_COLOR_SCHEME__: formData.colorScheme,
      metric: colorSchemeByMetric,
      breakdown: colorSchemeByBreakdown,
    },
    numbersFormat: {
      type: formData.numbersFormat,
      digits: formData.numbersFormatDigits !== undefined ? Number(formData.numbersFormatDigits) : undefined,
    },
    labelsColor: formData.labelsColor,
    xAxis: {
      interval: formData.xAxisInterval as AxisInterval,
      label: getLabel(formData, formData.xAxisLabel),
      tickLabelAngle: -Number(formData.xAxisTickLabelAngle ?? 0),
      hiddenTickLabels,
    },
    yAxis: {
      labelAngle: -Number(formData.yAxisLabelAngle ?? 0),
      label: getLabel(formData, formData.yAxisLabel),
      tickLabelAngle: -Number(formData.yAxisTickLabelAngle ?? 0),
    },
    bubbleChart: {
      size: Number(formData.bubbleSize ?? 1000),
      zDimension: formData.zDimension?.label,
    },
    barChart: {
      stickyScatters,
      minBarWidth: typeof formData.minBarWidth === undefined ? undefined : Number(formData.minBarWidth),
      hasTotals: formData.showTotals,
    },
    data: resultData,
    handleChartClick,
    // @ts-ignore
    yColumns,
    yColumnsMeta,
    drillDown: { deepness: ownState?.deepness, disabled: !hasDrillDown },
  };

  if (formData.showLegend) {
    result.legend = {
      position: formData.legendPosition,
    };
  }

  if (hasOrderedBars) {
    // @ts-ignore
    result.barChart!.yColumnSortingType = enumSorting[orderByYColumn] as SortingType;
  }

  if (queriesData[1]?.data) {
    result.normChart = {
      data: queriesData[1]?.data,
    };
  }

  if (
    yColumns.length > 1 &&
    formData.useY2Axis &&
    formData.layout === Layout.horizontal &&
    formData.queryMode !== QueryMode.raw
  ) {
    result.y2Axis = {
      labelAngle: -Number(formData.y2AxisLabelAngle ?? 0),
      label: formData.y2AxisLabel,
      tickLabelAngle: -Number(formData.y2AxisTickLabelAngle),
    };
  }

  return result;
}
