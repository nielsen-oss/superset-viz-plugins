import { supersetTheme, t } from '@superset-ui/core';
import { LegendPayload } from 'recharts';

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

export const LEGEND: LegendPayload[] = [
  { value: t('Increase'), color: supersetTheme.colors.success.base, id: 'increase', type: 'circle' },
  { value: t('Decrease'), color: supersetTheme.colors.error.base, id: 'decrease', type: 'circle' },
  { value: t('Total'), color: supersetTheme.colors.info.base, id: 'total', type: 'circle' },
  { value: t('Other'), color: supersetTheme.colors.alert.base, id: 'other', type: 'circle' },
];

export const valueFormatter = (value: number) => {
  if (Math.abs(Math.round(value / 1000000)) >= 1) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(Math.round(value / 1000)) >= 1) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return `${value}`;
};
