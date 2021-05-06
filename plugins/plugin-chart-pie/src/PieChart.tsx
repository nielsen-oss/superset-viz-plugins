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
import React, { useState, FC, useEffect, memo, useRef, useCallback } from 'react';
import { styled, t, CategoricalColorNamespace } from '@superset-ui/core';
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell,
  RechartsFunction,
  Legend,
  PieProps as RechartsPieProps,
  LegendType,
} from 'recharts';
import { LegendPosition, renderActiveShape, getLegendProps, ActiveShapeProps } from './utils';

export const LABELS_MARGIN = 100;

type EventData = {
  color: string;
  id: string;
  type: LegendType;
  value: string;
};

type PieStylesProps = {
  height: number;
  width: number;
  legendPosition: LegendPosition;
};

type GroupBy<G extends string> = Record<G, string>;

export type PieChartData<G extends string, DK extends string> = GroupBy<G> & Record<DK, number>;

export type PieProps<G extends string = string, DK extends string = string> = {
  height: number;
  width: number;
  data: PieChartData<G, DK>[];
  dataKey: DK;
  isDonut?: boolean;
  onClick?: RechartsFunction;
  colorScheme: string;
  baseColor: string;
  legendPosition: LegendPosition;
  showLegend: boolean;
  showLabels: boolean;
  groupBy: G;
  labelType: string;
};

const Notification = styled.div`
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  color: ${({ theme }) => theme.colors.info.dark1};
  background-color: ${({ theme }) => theme.colors.info.light1};
`;

const Styles = styled.div<PieStylesProps>`
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  overflow: auto;

  & .recharts-legend-item {
    cursor: pointer;
    white-space: nowrap;
  }
`;

const PieChart: FC<PieProps<string, string>> = memo(props => {
  const {
    dataKey,
    data,
    height,
    width,
    isDonut,
    colorScheme,
    showLegend,
    showLabels,
    groupBy,
    labelType,
    legendPosition,
  } = props;
  const [notification, setNotification] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [disabledDataKeys, setDisabledDataKeys] = useState<string[]>([]);
  const [legendWidth, setLegendWidth] = useState<number | null>(0);
  const [updater, setUpdater] = useState<number>(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const isSideLegend =
    showLegend && (legendPosition === LegendPosition.right || legendPosition === LegendPosition.left);

  const currentData = data.filter(item => !disabledDataKeys.includes(item[groupBy]));
  const isExplore = window.location.pathname.includes('/explore');

  useEffect(() => {
    if (isSideLegend && rootRef.current) {
      const legend = rootRef.current.querySelector('.recharts-legend-wrapper');
      const currentWidth = legend?.getBoundingClientRect()?.width || null;
      if (currentWidth !== legendWidth) {
        setLegendWidth(currentWidth ? currentWidth + 20 : currentWidth);
      }
    }
  }, [updater, isSideLegend, legendWidth]);

  useEffect(() => {
    if (isSideLegend) {
      setLegendWidth(0);
    }
  }, [isSideLegend, props]);

  const forceUpdate = useCallback(() => setUpdater(Math.random()), []);

  useEffect(() => {
    forceUpdate();
  }, [forceUpdate, props]);

  const onPieEnter = (data: object, index: number) => setActiveIndex(index);
  const closeNotification = () => setNotification(null);

  const onClick = () => {
    if (isExplore) {
      setNotification(t('Sector was clicked, filter will be emitted on a dashboard'));
    }
  };

  const chartMargin = showLabels ? LABELS_MARGIN : 20;

  const handleLegendClick = ({ id }: EventData) => {
    let resultKeys = [];
    if (disabledDataKeys.includes(id)) {
      resultKeys = disabledDataKeys.filter(item => item !== id);
    } else {
      resultKeys = [...disabledDataKeys];
      resultKeys.push(id);
    }
    setDisabledDataKeys(resultKeys);
  };

  const chartHeight = height;
  const outerRadius = (width < chartHeight ? width : chartHeight) / 2 - chartMargin;
  const chartWidth =
    isSideLegend && legendWidth ? Math.max((outerRadius + chartMargin) * 2 + legendWidth, width) : width;

  const pieProps: RechartsPieProps & { key?: string | number } = {
    activeIndex,
    key: updater,
    data: currentData,
    dataKey,
    cx: isSideLegend ? outerRadius + chartMargin : '50%',
    outerRadius,
    label: showLabels
      ? labelProps => renderActiveShape({ ...labelProps, groupBy, labelType } as ActiveShapeProps)
      : false,
    onClick,
  };

  if (isDonut) {
    pieProps.activeShape = activeShapeProps =>
      renderActiveShape({ ...activeShapeProps, groupBy, labelType, isDonut: true });
    pieProps.onMouseEnter = onPieEnter;
    pieProps.innerRadius = outerRadius - outerRadius * 0.2;
    pieProps.label = false;
  }

  return (
    <Styles height={height} width={width} legendPosition={legendPosition} ref={rootRef}>
      {notification && <Notification onClick={closeNotification}>{notification}</Notification>}
      <RechartsPieChart key={updater} width={chartWidth} height={height}>
        {showLegend && (
          <Legend
            onClick={handleLegendClick}
            {...getLegendProps(legendPosition, height, legendWidth)}
            iconType="square"
            iconSize={10}
            payload={data.map(item => ({
              value: item[groupBy],
              id: item[groupBy],
              payload: item,
              type: disabledDataKeys.includes(item[groupBy]) ? 'line' : 'circle',
              color: CategoricalColorNamespace.getScale(colorScheme)(item[groupBy]),
            }))}
          />
        )}
        {((isSideLegend && legendWidth) || !isSideLegend) && (
          <RechartsPie {...pieProps}>
            {currentData?.map(entry => (
              <Cell fill={CategoricalColorNamespace.getScale(colorScheme)(entry[groupBy])} />
            ))}
          </RechartsPie>
        )}
      </RechartsPieChart>
    </Styles>
  );
});

export default PieChart;
