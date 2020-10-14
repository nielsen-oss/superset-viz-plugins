import React, { useState, Fragment, FC, useEffect, memo } from 'react';
import styled from '@superset-ui/style';
import { t } from '@superset-ui/translation';
import {
  PieChart,
  Pie as RechartsPie,
  Cell,
  RechartsFunction,
  PieLabelRenderProps,
  Legend,
  PieProps as RechartsPieProps,
} from 'recharts';
import { CategoricalColorNamespace } from '@superset-ui/color';
import { renderActiveShape } from './utils';

type PieStylesProps = {
  height: number;
  width: number;
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
`;

const Pie: FC<PieProps> = memo(props => {
  const { dataKey, data, height, width, isDonut, colorScheme, showLegend, showLabels, groupBy, pieLabelType } = props;
  const [notification, setNotification] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimationEnded, setIsAnimationEnded] = useState<boolean>(false);
  const [exploreCounter, setExploreCounter] = useState<number>(0);

  useEffect(() => {
    if (isAnimationEnded) {
      setExploreCounter(exploreCounter + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLabels, showLegend, isDonut]);

  const onPieEnter = (data: object, index: number) => setActiveIndex(index);

  const closeNotification = () => setNotification(null);
  const colorFn = CategoricalColorNamespace.getScale(colorScheme);

  const onClick = (e, index) => {
    setNotification(t('Sector was clicked, filter will be emitted on a dashboard'));
  };

  const chartHeight = showLegend ? height - 40 : height;
  const outerRadius = (width < chartHeight ? width : chartHeight) / 2 - (showLabels ? 80 : 40);
  const pieProps: RechartsPieProps & { key?: string | number } = {
    activeIndex: activeIndex,
    key: exploreCounter,
    data: data,
    cx: width / 2,
    cy: chartHeight / 2 + (showLegend ? 0 : -20),
    dataKey: dataKey,
    outerRadius,
    // @ts-ignore
    label: showLabels
      ? // @ts-ignore
        (labelProps: PieLabelRenderProps) => renderActiveShape({ ...labelProps, groupBy, pieLabelType })
      : false,
    onClick: onClick,
  };
  if (isDonut) {
    pieProps.activeShape = activeShapeProps =>
      renderActiveShape({ ...activeShapeProps, groupBy, pieLabelType, isDonut: true });
    pieProps.onMouseEnter = onPieEnter;
    pieProps.innerRadius = outerRadius - outerRadius * 0.2;
    pieProps.label = false;
  }

  return (
    <Styles height={height} width={width}>
      {notification && <Notification onClick={closeNotification}>{notification}</Notification>}
      {
        <PieChart width={width - 40} height={height - 40} key={exploreCounter}>
          {showLegend && (
            // @ts-ignore
            <Legend verticalAlign="top" iconType="circle" formatter={(value, entry) => entry?.payload[groupBy]} />
          )}
          <RechartsPie onAnimationEnd={() => setIsAnimationEnded(true)} {...pieProps}>
            {data && data.map((entry, index) => <Cell fill={colorFn(index)} />)}
          </RechartsPie>
        </PieChart>
      }
    </Styles>
  );
});

export default Pie;
