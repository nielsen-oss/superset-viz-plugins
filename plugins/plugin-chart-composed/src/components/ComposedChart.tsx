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
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Legend,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { JsonObject, styled } from '@superset-ui/core';
import ComposedChartTooltip from './ComposedChartTooltip';
import {
  LabelColors,
  ResultData,
  BubbleChart,
  ColorSchemes,
  Deepness,
  Layout,
  LegendPosition,
  LegendType,
  NORM_SPACE,
  NormChart,
  NumbersFormat,
  ResetProps,
  XAxisProps,
  YAxisProps,
  YColumnsMeta,
  ChartType,
  ChartConfig,
  YColumnsMetaData,
  SortingType,
} from './types';
import { debounce, getResultColor, isStackedBar, Z_SEPARATOR } from './utils';
import { getCartesianGridProps, getLegendProps, getXAxisProps, getYAxisProps, renderChartElement } from './chartUtils';
import { useCurrentData, useDataPreparation, useZAxisRange } from './state';

import ScatterChartTooltip from './ScatterChartTooltip';

type EventData = {
  color: string;
  id: string;
  type: LegendType;
  value: string;
};

type ComposedChartStylesProps = {
  height: number;
  width: number;
  legendPosition?: LegendPosition;
  isClickable: boolean;
};

export type ComposedChartProps = {
  drillDown?: {
    deepness?: Deepness;
    disabled?: boolean;
  };
  handleChartClick?: (arg?: JsonObject) => void;
  hasTimeSeries: boolean;
  height: number;
  bubbleChart: BubbleChart;
  width: number;
  legend?: LegendType;
  data: ResultData[];
  layout: Layout;
  yColumns: string[];
  columnNames: string[];
  xColumns: string[];
  isAnimationActive?: boolean;
  xAxis: XAxisProps;
  yAxis: YAxisProps;
  y2Axis?: YAxisProps;
  labelsColor: LabelColors;
  colorSchemes?: ColorSchemes;
  numbersFormat?: NumbersFormat;
  yColumnsMeta: YColumnsMeta;
  normChart?: NormChart;
  barChart?: {
    stickyScatters?: JsonObject;
    minBarWidth?: number;
    yColumnSortingType?: SortingType;
    hasTotals?: boolean;
  };
} & ChartConfig;

const Breadcrumb = styled.div`
  display: flex;
`;

const StyledLink = styled.div`
  cursor: pointer;
  color: #4b31af;
  padding-right: 5px;
  &:not(:last-child):after {
    color: black;
    content: ' / ';
  }
`;

const Styles = styled.div<ComposedChartStylesProps>`
  position: relative;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  overflow: auto;

  .recharts-cartesian-axis-tick-line {
    display: none;
  }

  .recharts-bar-rectangle {
    ${({ isClickable }) => isClickable && 'cursor: pointer'};
  }

  .recharts-legend-item {
    cursor: pointer;
    white-space: nowrap;
  }
`;

const ComposedChart: FC<ComposedChartProps> = props => {
  const {
    data: initData,
    height,
    width,
    layout,
    yColumns: initYColumns,
    chartType,
    xAxis,
    chartSubType,
    yAxis,
    isAnimationActive,
    labelsColor,
    y2Axis,
    numbersFormat,
    legend,
    yColumnsMeta,
    hasTimeSeries,
    xColumns,
    bubbleChart,
    colorSchemes = {},
    handleChartClick,
    drillDown,
    normChart,
    columnNames,
    barChart = {},
  } = props;

  const { breakdowns, yColumns, data } = useDataPreparation({
    columnNames,
    yColumns: initYColumns,
    yColumnsMeta,
    data: initData,
    numbersFormat,
    hasTimeSeries,
    xColumns,
    normChart,
    hiddenTickLabels: xAxis.hiddenTickLabels,
    zDimension: bubbleChart.zDimension,
    chartType,
  });

  let resultColors: JsonObject = {};
  breakdowns.forEach(b => {
    resultColors = {
      ...resultColors,
      ...getResultColor(b, colorSchemes, resultColors),
    };
  });

  const { yColumnSortingType, hasTotals = false, minBarWidth, stickyScatters } = barChart;

  const [disabledDataKeys, setDisabledDataKeys] = useState<string[]>([]);
  const [updater, setUpdater] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [barsUIPositions, setBarsUIPositions] = useState<JsonObject>({});
  const barsUIPositionsRef = useRef<JsonObject>({});
  const [resetProps, setResetProps] = useState<ResetProps>({});
  const rootRef = useRef<HTMLDivElement>(null);

  const forceUpdate = useCallback(() => setUpdater(Math.random()), []);

  const xAxisClientRect = rootRef.current
    ?.querySelector('.xAxis .recharts-cartesian-axis-ticks')
    ?.getBoundingClientRect();
  const xAxisHeight = Math.ceil(xAxisClientRect?.height || 1);
  const xAxisWidth = Math.ceil(xAxisClientRect?.width || 1);

  const yAxisClientRect = rootRef.current
    ?.querySelector('.yAxis .recharts-cartesian-axis-ticks')
    ?.getBoundingClientRect();
  const yAxisHeight = Math.ceil(yAxisClientRect?.height || 1);
  const yAxisWidth = Math.ceil(yAxisClientRect?.width || 1);

  const y2AxisClientRect = rootRef.current
    ?.querySelectorAll('.yAxis .recharts-cartesian-axis-ticks')[1]
    ?.getBoundingClientRect();
  const y2AxisHeight = Math.ceil(y2AxisClientRect?.height || 1);
  const y2AxisWidth = Math.ceil(y2AxisClientRect?.width || 1);

  const { excludedMetricsForStackedBars, includedMetricsForStackedBars, isMainChartStacked } = useMemo(() => {
    const excludedMetricsForStackedBars = yColumns.filter(
      metric => yColumnsMeta?.[metric]?.chartType && !isStackedBar(yColumnsMeta?.[metric]),
    );
    const includedMetricsForStackedBars = yColumns.filter(
      metric => yColumnsMeta?.[metric]?.chartType && isStackedBar(yColumnsMeta?.[metric]),
    );
    return {
      excludedMetricsForStackedBars,
      includedMetricsForStackedBars,
      isMainChartStacked: isStackedBar({ chartType, chartSubType } as YColumnsMetaData),
    };
  }, [chartSubType, chartType, yColumnsMeta, yColumns]);

  const currentData = useCurrentData(
    data,
    disabledDataKeys,
    breakdowns,
    hasTotals,
    yColumns,
    excludedMetricsForStackedBars,
    includedMetricsForStackedBars,
    isMainChartStacked,
    yColumnSortingType,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateVisibility = useCallback(
    debounce(() => {
      forceUpdate();
      setVisible(true);
      setResetProps({});
    }, 5),
    [],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateUI = useCallback(
    debounce(() => {
      forceUpdate();
      updateVisibility();
    }, 1),
    [],
  );

  useEffect(() => {
    setResetProps({ xAxisTicks: true });
    updateUI();
  }, [props, forceUpdate, updateUI, currentData]);

  const handleLegendClick = ({ id }: EventData) => {
    let resultKeys;
    if (disabledDataKeys.includes(id)) {
      resultKeys = disabledDataKeys.filter(item => item !== id);
    } else {
      resultKeys = [...disabledDataKeys];
      resultKeys.push(id);
    }
    setDisabledDataKeys(resultKeys);
  };

  let xMarginLeft =
    xAxis.tickLabelAngle === -45 &&
    layout === Layout.horizontal &&
    legend?.position !== LegendPosition.left &&
    !yAxis.label
      ? xAxisHeight / 2 - yAxisWidth + 5
      : 10;

  let yMarginBottom =
    yAxis.tickLabelAngle === -45 && layout === Layout.vertical ? yAxisWidth - xAxisHeight - 10 : xAxisHeight;
  const hasNormChart = [...Object.values(yColumnsMeta ?? {}).map(({ chartType }) => chartType), chartType].includes(
    ChartType.normChart as ChartType,
  );

  if (hasNormChart && layout === Layout.horizontal) {
    yMarginBottom += NORM_SPACE * 2;
  }

  if (hasNormChart && layout === Layout.vertical) {
    xMarginLeft += NORM_SPACE * 2;
  }

  let newWidth = width;
  let newHeight = height;
  if (layout === Layout.horizontal) {
    newWidth = minBarWidth ? currentData.length * (Number(minBarWidth) + 4) : width;
    newWidth = width > newWidth ? width : newWidth;
  } else if (layout === Layout.vertical) {
    newHeight = minBarWidth ? currentData.length * (Number(minBarWidth) + 4) : height;
    newHeight = height > newHeight ? height : newHeight;
  }

  const getZAxisRange = useZAxisRange(currentData, bubbleChart.size);

  let ChartContainer = RechartsComposedChart;
  let tooltipContent = (
    <ComposedChartTooltip
      numbersFormat={numbersFormat}
      yColumns={yColumns}
      yColumnSortingType={yColumnSortingType}
      hasTimeSeries={hasTimeSeries}
      zDimension={bubbleChart?.zDimension}
      breakdowns={breakdowns}
      resultColors={resultColors}
      hasExcludedBars={!!excludedMetricsForStackedBars.length}
    />
  );
  if (chartType === ChartType.bubbleChart && !Object.values(yColumnsMeta ?? {}).some(({ chartType }) => chartType)) {
    ChartContainer = ScatterChart;
    tooltipContent = (
      <ScatterChartTooltip
        breakdowns={breakdowns}
        numbersFormat={numbersFormat}
        yColumns={yColumns}
        zDimension={bubbleChart?.zDimension}
        resultColors={resultColors}
      />
    );
  }

  return (
    <Styles
      isClickable={!drillDown?.disabled && !!handleChartClick}
      key={updater}
      height={height}
      width={width}
      legendPosition={legend?.position}
      ref={rootRef}
      style={{ overflowX: newWidth === width ? 'hidden' : 'auto', overflowY: newHeight === height ? 'hidden' : 'auto' }}
    >
      <Breadcrumb>
        {drillDown?.deepness?.map((deep, index) => (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/interactive-supports-focus
          <StyledLink
            onClick={() => {
              handleChartClick?.({ index });
            }}
          >
            {deep?.label}
          </StyledLink>
        )) ?? null}
      </Breadcrumb>
      <ChartContainer
        key={updater}
        width={newWidth}
        height={newHeight}
        layout={layout}
        style={{ visibility: visible ? 'visible' : 'hidden' }}
        margin={{
          right: layout === Layout.vertical ? 10 : 10,
          left: xMarginLeft > 0 ? xMarginLeft : 10,
          top: 15,
          bottom: (legend?.position === LegendPosition.bottom ? 0 : yMarginBottom) + 16,
        }}
        data={currentData}
      >
        {legend && (
          <Legend
            onClick={handleLegendClick}
            {...getLegendProps(
              legend,
              height,
              newWidth,
              breakdowns,
              disabledDataKeys,
              yColumns,
              xAxisHeight,
              yAxisWidth,
              yColumnsMeta,
              resultColors,
              chartType,
            )}
            iconType="circle"
            iconSize={10}
          />
        )}
        <CartesianGrid {...getCartesianGridProps({ layout, chartType })} />
        <XAxis
          {...getXAxisProps({
            resetProps,
            numbersFormat,
            layout,
            currentData,
            interval: xAxis.interval,
            tickLabelAngle: xAxis.tickLabelAngle,
            axisHeight: xAxisHeight,
            axisWidth: xAxisWidth,
            xAxisClientRect,
            label: xAxis.label,
            hasTimeSeries,
            xColumns,
            rootRef,
            chartType,
          })}
        />
        <YAxis
          {...getYAxisProps({
            rootRef,
            numbersFormat,
            currentData,
            layout,
            height: newHeight,
            tickLabelAngle: yAxis.tickLabelAngle ?? 0,
            labelAngle: yAxis.labelAngle ?? 0,
            label: yAxis.label,
            axisHeight: yAxisHeight,
            axisWidth: yAxisWidth,
            chartType,
          })}
        />
        {chartType === ChartType.bubbleChart &&
          breakdowns.map((breakdown, i) => (
            // eslint-disable-next-line no-underscore-dangle
            <ZAxis type="number" zAxisId={i} range={getZAxisRange(breakdown)} dataKey={`${breakdown}${Z_SEPARATOR}`} />
          ))}
        {y2Axis && (
          <YAxis
            {...getYAxisProps({
              rootRef,
              numbersFormat,
              layout,
              currentData,
              height: newHeight,
              isSecondAxis: true,
              dataKey: initYColumns[initYColumns.length - 1],
              tickLabelAngle: y2Axis?.tickLabelAngle ?? 0,
              label: y2Axis?.label,
              labelAngle: y2Axis?.labelAngle ?? 0,
              axisHeight: y2AxisHeight,
              axisWidth: y2AxisWidth,
              chartType,
            })}
          />
        )}
        <Tooltip content={tooltipContent} />
        {breakdowns.map((breakdown, index) =>
          renderChartElement({
            yColumnSortingType,
            ...({ chartType, chartSubType } as ChartConfig),
            layout,
            initYColumns,
            yColumns,
            hasTotals,
            breakdown,
            numbersFormat,
            y2Axis,
            labelsColor,
            stickyScatters,
            barsUIPositions,
            setBarsUIPositions,
            isAnimationActive: isAnimationActive && visible,
            updater,
            index,
            currentData,
            yColumnsMeta,
            breakdowns,
            excludedMetricsForStackedBars,
            includedMetricsForStackedBars,
            isMainChartStacked,
            resultColors,
            barsUIPositionsRef,
            xAxisClientRect,
            yAxisClientRect,
            xColumns,
            firstItem: data[0]?.rechartsDataKey,
            handleChartClick: !drillDown?.disabled ? handleChartClick : undefined,
          }),
        )}
      </ChartContainer>
    </Styles>
  );
};
export default ComposedChart;
