import { buildQueryContext, QueryFormData } from '@superset-ui/query';
export default function buildQuery(formData: QueryFormData) {
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
    },
  ]);
}
