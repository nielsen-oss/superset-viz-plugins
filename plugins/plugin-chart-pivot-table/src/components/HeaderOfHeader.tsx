// @ts-ignore
import React, { FC } from 'react';
import { t } from '@superset-ui/core';
import { Grid, GridItem } from './Layout';

type HeadersOfHeaderProps<R extends string, C extends string> = {
  rows: R[];
  columns: C[];
};

const HeadersOfHeader: FC<HeadersOfHeaderProps<string, string>> = ({ rows, columns }) => (
  <Grid
    withoutOverflow
    gridColumn={`span ${rows.length || 1}`}
    gridTemplateColumns="1fr"
    gridTemplateRows={`repeat(${columns.length || 1}, max-content)`}
  >
    <GridItem bordered header bgLevel={2}>
      {t('metrics')}
    </GridItem>
    {columns.map(column => (
      // eslint-disable-next-line react/jsx-key
      <GridItem bordered header bgLevel={2}>
        {column}
      </GridItem>
    ))}
  </Grid>
);

export default HeadersOfHeader;
