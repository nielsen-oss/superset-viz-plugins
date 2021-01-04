export const statusesAndObjects = {
  width: 800,
  height: 400,
  formData: {
    datasource: '13__table',
    vizType: 'status',
    urlParams: {},
    timeRangeEndpoints: ['inclusive', 'exclusive'],
    objectColumn: 'period',
    objectColumnFilters: [
      {
        expressionType: 'SIMPLE',
        subject: 'period',
        operator: '!=',
        comparator: 'Total Period',
        clause: 'WHERE',
        sqlExpression: null,
        isExtra: false,
        isNew: false,
        filterOptionName: 'filter_cm41bivl08_qrtbhvmm1gk',
      },
    ],
    statusColumn: 'period_type',
    rowLimit: 100,
    statusValue0: 'Healty',
    statusValueColor0: { r: 85, g: 150, b: 92, a: 1 },
    statusValue1: 'Infected',
    statusValueColor1: { r: 202, g: 8, b: 49, a: 1 }
  },
  queriesData: [
    {
      data: [{ period: '2020' }, { period: '2019' }, { period: '2017' }, { period: '2018' }],
    },
    {
      data: [{ period_type: 'Healty' }, { period_type: 'Infected' }],
    },
  ],
};
