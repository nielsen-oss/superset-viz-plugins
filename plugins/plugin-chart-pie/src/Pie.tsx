import React, { useState, FC, useEffect, memo, useRef } from 'react';
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
  LegendType,
} from 'recharts';
import { CategoricalColorNamespace } from '@superset-ui/color';
import { LegendPosition, renderActiveShape, getLegendProps, LABELS_MARGIN } from './utils';

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

export type PieProps<G extends string, DK extends string> = {
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
  pieLabelType: string;
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

const Pie: FC<PieProps<string, string>> = memo(props => {
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
  const [disabledDataKeys, setDisabledDataKeys] = useState<string[]>([]);
  const [legendWidth, setLegendWidth] = useState<number | null>(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const isSideLegend =
    showLegend && (legendPosition === LegendPosition.right || legendPosition === LegendPosition.left);

  const currentData = data.filter(item => !disabledDataKeys.includes(item[groupBy]));

  useEffect(() => {
    if (isAnimationEnded) {
      setExploreCounter(exploreCounter + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLabels, showLegend, isDonut, legendPosition]);

  useEffect(() => {
    if (isSideLegend && rootRef.current) {
      const legend = rootRef.current.querySelector('.recharts-legend-wrapper');
      setLegendWidth(legend?.getBoundingClientRect()?.width || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef.current]);

  const onPieEnter = (data: object, index: number) => setActiveIndex(index);

  const closeNotification = () => setNotification(null);
  const { getColor } = CategoricalColorNamespace;

  const onClick = () => {
    // eslint-disable-next-line no-restricted-globals
    if (location.pathname.includes('/explore')) {
      setNotification(t('Sector was clicked, filter will be emitted on a dashboard'));
    }
  };

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
  const outerRadius = (width < chartHeight ? width : chartHeight) / 2 - (showLabels ? LABELS_MARGIN : 20);
  const chartWidth =
    isSideLegend && legendWidth
      ? Math.max((outerRadius + (showLabels ? LABELS_MARGIN : 20)) * 2 + legendWidth, width)
      : width;

  const pieProps: RechartsPieProps & { key?: string | number } = {
    activeIndex: activeIndex,
    key: exploreCounter,
    data: currentData,
    dataKey: dataKey,
    cx: isSideLegend ? outerRadius + (showLabels ? LABELS_MARGIN : 20) : '50%',
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
    <Styles height={height} width={width} legendPosition={legendPosition} ref={rootRef}>
      {notification && <Notification onClick={closeNotification}>{notification}</Notification>}
      <ResponsiveContainer width={chartWidth}>
        <PieChart key={exploreCounter + chartWidth} width={chartWidth}>
          {showLegend && (
            <Legend
              onClick={handleLegendClick}
              {...getLegendProps(legendPosition, height)}
              iconType="circle"
              iconSize={10}
              payload={data.map(item => ({
                value: item[groupBy],
                id: item[groupBy],
                payload: item,
                type: disabledDataKeys.includes(item[groupBy]) ? 'line' : 'circle',
                color: CategoricalColorNamespace.getColor(item[groupBy], colorScheme),
              }))}
            />
          )}
          {((isSideLegend && legendWidth) || !isSideLegend) && (
            <RechartsPie onAnimationEnd={() => setIsAnimationEnded(true)} {...pieProps}>
              {currentData?.map((entry, index) => (
                <Cell fill={getColor(entry[groupBy], colorScheme)} />
              ))}
            </RechartsPie>
          )}
        </PieChart>
      </ResponsiveContainer>
    </Styles>
  );
});

export default Pie;
