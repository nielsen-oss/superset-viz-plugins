import { t } from '@superset-ui/translation';
import {
  sharedControls,
  ControlConfig,
  ControlPanelConfig,
  D3_FORMAT_OPTIONS,
  D3_FORMAT_DOCS,
} from '@superset-ui/chart-controls';
import { CHART_TYPES } from '@superset-maf-ui/plugin-chart-composed/src/components/utils';

const groupBy: { name: string; config: ControlConfig<'SelectControl'> } = {
  name: 'group_by',
  config: {
    ...sharedControls.groupby,
    multi: false,
  },
};

export default {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['metric'], ['adhoc_filters'], [groupBy], ['row_limit']],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'pie_label_type',
            config: {
              type: 'SelectControl',
              label: t('Label Type'),
              default: 'percent',
              renderTrigger: true,
              choices: [
                ['key', 'Category Name'],
                ['percent', 'Percentage'],
                ['key_percent', 'Category and Percentage'],
              ],
              description: t('What should be shown on the label?'),
            },
          },
        ],
        [
          {
            name: 'is_donut',
            config: {
              type: 'CheckboxControl',
              label: t('Donut'),
              default: false,
              renderTrigger: true,
              description: t('Do you want a donut or a pie?'),
            },
          },
          {
            name: 'show_legend',
            config: {
              type: 'CheckboxControl',
              label: t('Legend'),
              renderTrigger: true,
              default: true,
              description: t('Whether to display the legend (toggles)'),
            },
          },
        ],
        [
          {
            name: 'show_labels',
            config: {
              type: 'CheckboxControl',
              label: t('Show Labels'),
              renderTrigger: true,
              visibility: ({ form_data }) => form_data.is_donut === false,
              default: true,
              description: t(
                'Whether to display the labels. Note that the label only displays when the the 5% ' + 'threshold.',
              ),
            },
          },
        ],
        ['color_scheme', 'label_colors'],
      ],
    },
  ],
  controlOverrides: {
    row_limit: {
      default: 10,
    },
  },
};
