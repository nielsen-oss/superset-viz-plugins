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
import { styled, supersetTheme } from '@superset-ui/core';

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
  ${({ gridTemplateColumns }) => gridTemplateColumns && `grid-template-columns: ${gridTemplateColumns};`}
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
  ${({ bgLevel, theme }) =>
    bgLevel &&
    `background-color: ${theme.colors.grayscale[`light${bgLevel}` as keyof typeof supersetTheme.colors.grayscale]};`}
  ${({ header }) => header && 'font-weight: bolder;'}
  ${({ bordered, hidden }) => bordered && !hidden && 'border: 1px solid black;'}
  ${({ gridColumn }) => gridColumn && `grid-column: ${gridColumn};`}
  ${({ gridRow }) => gridRow && `grid-row: ${gridRow};`}
`;
