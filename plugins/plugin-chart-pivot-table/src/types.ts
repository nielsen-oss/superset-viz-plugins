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
export enum ShowTotal {
  columnsAndRows = 'columnsAndRows',
  columns = 'columns',
  rows = 'rows',
  noTotal = 'noTotal',
}

export const SHOW_TOTAL_NAMES = {
  [ShowTotal.columnsAndRows]: 'Columns & Rows',
  [ShowTotal.columns]: 'Columns',
  [ShowTotal.rows]: 'Rows',
  [ShowTotal.noTotal]: 'No Total',
};
