import React, { useState, FC, useEffect, memo } from 'react';
import { styled } from '@superset-ui/style';
import { t } from '@superset-ui/translation';
import {
  PieChart,
  ResponsiveContainer,
  Pie as RechartsPie,
  Cell,
  RechartsFunction,
  PieLabelRenderProps,
  Legend,
  PieProps as RechartsPieProps,
} from 'recharts';
import { CategoricalColorNamespace } from '@superset-ui/color';
import { LegendPosition, renderActiveShape, getLegendProps } from './utils';

type PieStylesProps = {
  height: number;
  width: number;
  legendPosition: LegendPosition;
};

export type PieChartData = {
  [key: string]: string | number;
};

export type PieProps = {
  height: number;
  width: number;
  data?: PieChartData[];
  dataKey: string;
  isDonut?: boolean;
  onClick?: RechartsFunction;
  colorScheme: string;
  baseColor: string;
  legendPosition: LegendPosition;
  showLegend: boolean;
  showLabels: boolean;
  groupBy: string;
  pieLabelType: string;
};

export type LegendProps = {
  data?: PieChartData[];
  colorFn: Function;
  groupBy: string;
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
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  overflow-y: scroll;

  & .recharts-legend-item {
    white-space: nowrap;
    ${({ legendPosition }) =>
      legendPosition === LegendPosition.left || legendPosition === LegendPosition.right
        ? 'display: block !important;'
        : ''}
  }
`;

const Pie: FC<PieProps> = memo(props => {
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
    pieLabelType,
    legendPosition,
  } = props;
  const [notification, setNotification] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimationEnded, setIsAnimationEnded] = useState<boolean>(false);
  const [exploreCounter, setExploreCounter] = useState<number>(0);

  useEffect(() => {
    if (isAnimationEnded) {
      setExploreCounter(exploreCounter + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLabels, showLegend, isDonut, legendPosition]);

  const onPieEnter = (data: object, index: number) => setActiveIndex(index);

  const closeNotification = () => setNotification(null);
  const colorFn = CategoricalColorNamespace.getScale(colorScheme);

  const onClick = (e, index) => {
    // eslint-disable-next-line no-restricted-globals
    if (location.pathname.includes('/explore')) {
      setNotification(t('Sector was clicked, filter will be emitted on a dashboard'));
    }
  };

  const chartWidth =
    showLegend && (legendPosition === LegendPosition.right || legendPosition === LegendPosition.left)
      ? 0.8 * width
      : width;
  const chartHeight = height;
  const outerRadius = (chartWidth < chartHeight ? chartWidth : chartHeight) / 2 - (showLabels ? 80 : 40);
  const pieProps: RechartsPieProps & { key?: string | number } = {
    activeIndex: activeIndex,
    key: exploreCounter,
    data: data,
    dataKey: dataKey,
    outerRadius,
    // @ts-ignore
    label: showLabels
      ? // @ts-ignore
        (labelProps: PieLabelRenderProps) => renderActiveShape({ ...labelProps, groupBy, pieLabelType })
      : false,
    onClick,
  };
  if (isDonut) {
    pieProps.activeShape = activeShapeProps =>
      renderActiveShape({ ...activeShapeProps, groupBy, pieLabelType, isDonut: true });
    pieProps.onMouseEnter = onPieEnter;
    pieProps.innerRadius = outerRadius - outerRadius * 0.2;
    pieProps.label = false;
  }

  return (
    <Styles height={height} width={width} legendPosition={legendPosition}>
      {notification && <Notification onClick={closeNotification}>{notification}</Notification>}
      <ResponsiveContainer>
        <PieChart
          margin={{
            right: showLegend && legendPosition === LegendPosition.right ? width * 0.2 : 0,
            left: showLegend && legendPosition === LegendPosition.left ? width * 0.2 : 0,
          }}
          key={exploreCounter}
        >
          {showLegend && (
            <Legend
              {...getLegendProps(legendPosition, height, width)}
              iconType="circle"
              formatter={(value, entry) => entry?.payload[groupBy]}
            />
          )}
          <RechartsPie onAnimationEnd={() => setIsAnimationEnded(true)} {...pieProps}>
            {data && data.map((entry, index) => <Cell fill={colorFn(index)} />)}
          </RechartsPie>
        </PieChart>
      </ResponsiveContainer>
    </Styles>
  );
});

export default Pie;
