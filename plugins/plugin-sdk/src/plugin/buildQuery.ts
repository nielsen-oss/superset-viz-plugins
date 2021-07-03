import { buildQueryContext, QueryFormData } from '@superset-ui/core'

export default function buildQuery(formData: QueryFormData) {
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      result_type: 'columns',
      columns: [],
      metrics: [],
      orderby: [],
    },
  ])
}
