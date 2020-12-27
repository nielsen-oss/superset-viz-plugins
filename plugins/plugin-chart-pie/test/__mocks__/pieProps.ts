const formDataLegendTopPercent = {
  "queryFields": {"group_by": "groupby", "metric": "metrics"},
  "datasource": "13__table",
  "vizType": "pie",
  "urlParams": {},
  "timeRangeEndpoints": ["inclusive", "exclusive"],
  "timeRange": "Last week",
  "groupBy": "period",
  "metric": {
    "expressionType": "SIMPLE",
    "column": {
      "id": 461,
      "column_name": "efficiency",
      "verbose_name": null,
      "description": null,
      "expression": null,
      "filterable": true,
      "groupby": true,
      "is_dttm": false,
      "type": "DOUBLE PRECISION",
      "python_date_format": null,
      "optionName": "_col_efficiency"
    },
    "aggregate": "AVG",
    "sqlExpression": null,
    "isNew": false,
    "hasCustomLabel": false,
    "label": "AVG(efficiency)",
    "optionName": "metric_t2849p6snpr_6pdt0hejlds"
  },
  "adhocFilters": [],
  "rowLimit": 100,
  "pieLabelType": "percent",
  "showLegend": true,
  "legendPosition": "top",
  "showLabels": true,
  "colorScheme": "supersetColors",
  "labelColors": {}
}
const queryData = {
  "cache_key": "77e34489b5485843f64d103955180cf1",
  "cached_dttm": null,
  "cache_timeout": 86400,
  "error": null,
  "is_cached": true,
  "status": "success",
  "stacktrace": null,
  "rowcount": 5,
  "annotation_data": [],
  "data": [{"period": "2020", "AVG(efficiency)": 0.0566666666666667}, {
    "period": "2018",
    "AVG(efficiency)": 0.038
  }, {"period": "2019", "AVG(efficiency)": 0.0162068965517241}, {
    "period": "Total Period",
    "AVG(efficiency)": 0.0138888888888889
  }, {"period": "2017", "AVG(efficiency)": 0.011304347826087}]
}

export const legendTopPercentage = {
  "formData": formDataLegendTopPercent,
  "height": 596,
  "queriesData": [queryData],
  "width": 595
}

export const legendLeftWithoutLabels = {
  "formData": {
    ...formDataLegendTopPercent,
    legendPosition: 'left',
    showLabels: false
  },
  "height": 596,
  "queriesData": [queryData],
  "width": 595
}

export const categoryPercentageDonutNoLegend = {
  "formData": {
    ...formDataLegendTopPercent,
    pieLabelType: 'keyPercent',
    showLegend: false,
    isDonut: true
  },
  "height": 596,
  "queriesData": [queryData],
  "width": 595
}