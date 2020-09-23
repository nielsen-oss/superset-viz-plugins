import { styled } from '@superset-ui/core';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { supersetTheme } from '@superset-ui/style';

export const Grid = styled.div<{
  bordered?: boolean;
  withoutOverflow?: boolean;
  gridColumn?: string;
  gridAutoFlow?: string;
  gridAutoRows?: string;
  gridTemplateRows?: string;
  gridTemplateColumns?: string;
}>`
  ${({ bordered }) => bordered && 'border: 1px solid black;'}
  ${({ withoutOverflow }) => withoutOverflow && 'overflow: hidden;'}
  display: grid;
  ${({ gridColumn }) => gridColumn && `grid-column: ${gridColumn};`}
  ${({ gridAutoFlow }) => gridAutoFlow && `grid-auto-flow: ${gridAutoFlow};`}
  ${({ gridAutoRows }) => gridAutoRows && `grid-auto-rows: ${gridAutoRows};`}
  ${({ gridTemplateColumns }) =>
    gridTemplateColumns && `grid-template-columns: ${gridTemplateColumns};`}
  ${({ gridTemplateRows }) => gridTemplateRows && `grid-template-rows: ${gridTemplateRows};`}
`;

export const FillItem = styled.div<{ hidden?: boolean }>`
  ${({ hidden }) => !hidden && 'padding: 3px 5px;'}
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const GridItem = styled(FillItem)<{
  bgLevel?: number;
  header?: boolean;
  hidden?: boolean;
  bordered?: boolean;
  gridColumn?: string;
  gridRow?: string;
}>`
  overflow: hidden;
  ${({ bgLevel }) =>
    bgLevel && `background-color: ${supersetTheme.colors.grayscale[`light${bgLevel}`]};`}
  ${({ header }) => header && 'font-weight: bolder;'}
  ${({ bordered, hidden }) => bordered && !hidden && 'border: 1px solid black;'}
  ${({ gridColumn }) => gridColumn && `grid-column: ${gridColumn};`}
  ${({ gridRow }) => gridRow && `grid-row: ${gridRow};`}
`;
