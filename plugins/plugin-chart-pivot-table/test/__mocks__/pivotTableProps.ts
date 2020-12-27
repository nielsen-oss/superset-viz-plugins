const formDataWithTotals = {
  "queryFields": {"metrics": "metrics", "rows": "groupby", "columns": "groupby"},
  "datasource": "13__table",
  "vizType": "pivot",
  "urlParams": {},
  "timeRangeEndpoints": ["inclusive", "exclusive"],
  "timeRange": "Last week",
  "metrics": [{
    "expressionType": "SIMPLE",
    "column": {
      "id": 449,
      "column_name": "decomp_volume",
      "verbose_name": null,
      "description": null,
      "expression": null,
      "filterable": true,
      "groupby": true,
      "is_dttm": false,
      "type": "DOUBLE PRECISION",
      "python_date_format": null,
      "optionName": "_col_decomp_volume"
    },
    "aggregate": "AVG",
    "sqlExpression": null,
    "isNew": false,
    "hasCustomLabel": false,
    "label": "AVG(decomp_volume)",
    "optionName": "metric_lfke6i7nx6k_6jgnc1zoyq5"
  }, {
    "expressionType": "SIMPLE",
    "column": {
      "id": 450,
      "column_name": "volume_for_roi",
      "verbose_name": null,
      "description": null,
      "expression": null,
      "filterable": true,
      "groupby": true,
      "is_dttm": false,
      "type": "DOUBLE PRECISION",
      "python_date_format": null
    },
    "aggregate": "AVG",
    "sqlExpression": null,
    "isNew": false,
    "hasCustomLabel": false,
    "label": "AVG(volume_for_roi)",
    "optionName": "metric_68w492l0n3a_s110voiy62q"
  }],
  "rows": ["group_type", "period_type"],
  "columns": ["period", "period_type"],
  "adhocFilters": [{
    "expressionType": "SIMPLE",
    "subject": "period",
    "operator": "!=",
    "comparator": "2019",
    "clause": "WHERE",
    "sqlExpression": null,
    "isExtra": false,
    "isNew": false,
    "filterOptionName": "filter_dv1vzir8d8v_ghbznkxwzmu"
  }, {
    "expressionType": "SIMPLE",
    "subject": "period",
    "operator": "!=",
    "comparator": "2020",
    "clause": "WHERE",
    "sqlExpression": null,
    "isExtra": false,
    "isNew": false,
    "filterOptionName": "filter_gdsjztfvsjh_4mip8d1hs8r"
  }],
  "rowLimit": 100,
  "transpose": false,
  "showTotal": "columnsAndRows",
  "numberFormat": "SMART_NUMBER"
}
const queryData = {
  "cache_key": "ad06e7cb1276f8ebc1d2ef57f0a133ac",
  "cached_dttm": null,
  "cache_timeout": 86400,
  "error": null,
  "is_cached": true,
  "status": "success",
  "stacktrace": null,
  "rowcount": 24,
  "annotation_data": [],
  "data": [{
    "group_type": "SummaryGroup",
    "period_type": "Standard",
    "period": "Total Period",
    "AVG(decomp_volume)": 1076125.66666667,
    "AVG(volume_for_roi)": 372648.333333333
  }, {
    "group_type": "SummaryGroup",
    "period_type": "Custom",
    "period": "Total Period",
    "AVG(decomp_volume)": 293427.333333333,
    "AVG(volume_for_roi)": 372648.333333333
  }, {
    "group_type": "SummaryGroup",
    "period_type": "Standard",
    "period": "2017",
    "AVG(decomp_volume)": 213718.333333333,
    "AVG(volume_for_roi)": 213915
  }, {
    "group_type": "SummaryGroup",
    "period_type": "Custom",
    "period": "2017",
    "AVG(decomp_volume)": 213718.333333333,
    "AVG(volume_for_roi)": 213915
  }, {
    "group_type": "SummaryGroup",
    "period_type": "Standard",
    "period": "2018",
    "AVG(decomp_volume)": 158924,
    "AVG(volume_for_roi)": 158733
  }, {
    "group_type": "SummaryGroup",
    "period_type": "Custom",
    "period": "2018",
    "AVG(decomp_volume)": 158924,
    "AVG(volume_for_roi)": 158733
  }, {
    "group_type": "Variable",
    "period_type": "Custom",
    "period": "2018",
    "AVG(decomp_volume)": 51089.4814814815,
    "AVG(volume_for_roi)": 14063.4814814815
  }, {
    "group_type": "Variable",
    "period_type": "Standard",
    "period": "Total Period",
    "AVG(decomp_volume)": 50911.8604651163,
    "AVG(volume_for_roi)": 20054.2325581395
  }, {
    "group_type": "DueToGroup",
    "period_type": "Standard",
    "period": "Total Period",
    "AVG(decomp_volume)": 46566.6666666667,
    "AVG(volume_for_roi)": 46611.3333333333
  }, {
    "group_type": "DirectDueToGroup",
    "period_type": "Custom",
    "period": "Total Period",
    "AVG(decomp_volume)": 46566.6666666667,
    "AVG(volume_for_roi)": 46611.3333333333
  }, {
    "group_type": "DueToGroup",
    "period_type": "Custom",
    "period": "Total Period",
    "AVG(decomp_volume)": 46566.6666666667,
    "AVG(volume_for_roi)": 46611.3333333333
  }, {
    "group_type": "DirectDueToGroup",
    "period_type": "Standard",
    "period": "Total Period",
    "AVG(decomp_volume)": 46566.6666666667,
    "AVG(volume_for_roi)": 46611.3333333333
  }, {
    "group_type": "DueToGroup",
    "period_type": "Standard",
    "period": "2017",
    "AVG(decomp_volume)": 28899.6666666667,
    "AVG(volume_for_roi)": 28866.8333333333
  }, {
    "group_type": "DirectDueToGroup",
    "period_type": "Standard",
    "period": "2017",
    "AVG(decomp_volume)": 28899.6666666667,
    "AVG(volume_for_roi)": 28866.8333333333
  }, {
    "group_type": "DueToGroup",
    "period_type": "Custom",
    "period": "2017",
    "AVG(decomp_volume)": 24882.7142857143,
    "AVG(volume_for_roi)": 24849.4285714286
  }, {
    "group_type": "DirectDueToGroup",
    "period_type": "Custom",
    "period": "2017",
    "AVG(decomp_volume)": 24882.7142857143,
    "AVG(volume_for_roi)": 24849.4285714286
  }, {
    "group_type": "Variable",
    "period_type": "Custom",
    "period": "2017",
    "AVG(decomp_volume)": 19966.2222222222,
    "AVG(volume_for_roi)": 17059.0740740741
  }, {
    "group_type": "DirectDueToGroup",
    "period_type": "Standard",
    "period": "2018",
    "AVG(decomp_volume)": 18454.1666666667,
    "AVG(volume_for_roi)": 18472.8333333333
  }, {
    "group_type": "DueToGroup",
    "period_type": "Standard",
    "period": "2018",
    "AVG(decomp_volume)": 18454.1666666667,
    "AVG(volume_for_roi)": 18472.8333333333
  }, {
    "group_type": "Variable",
    "period_type": "Standard",
    "period": "2017",
    "AVG(decomp_volume)": 17069.5555555556,
    "AVG(volume_for_roi)": 17059.0740740741
  }, {
    "group_type": "DueToGroup",
    "period_type": "Custom",
    "period": "2018",
    "AVG(decomp_volume)": 15817.8571428571,
    "AVG(volume_for_roi)": 15833.8571428571
  }, {
    "group_type": "DirectDueToGroup",
    "period_type": "Custom",
    "period": "2018",
    "AVG(decomp_volume)": 15817.8571428571,
    "AVG(volume_for_roi)": 15833.8571428571
  }, {
    "group_type": "Variable",
    "period_type": "Standard",
    "period": "2018",
    "AVG(decomp_volume)": 14052.8148148148,
    "AVG(volume_for_roi)": 14063.4814814815
  }, {
    "group_type": "Variable",
    "period_type": "Custom",
    "period": "Total Period",
    "AVG(decomp_volume)": 3035.81395348837,
    "AVG(volume_for_roi)": 20054.2325581395
  }]
}

export const withTotals = {
  "annotationData": {},
  "initialValues": {},
  "formData": formDataWithTotals,
  "height": 596,
  "hooks": {},
  "queriesData": [queryData],
  "width": 595
}

export const withNoTotals = {
  "annotationData": {},
  "initialValues": {},
  "formData": {
    ...formDataWithTotals,
    "showTotal": "noTotal",
  },
  "height": 596,
  "hooks": {},
  "queriesData": [queryData],
  "width": 595
}