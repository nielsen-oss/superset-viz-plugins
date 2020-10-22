import { t } from '@superset-ui/translation';
import { sharedControls, ControlConfig, formatSelectOptions } from '@superset-ui/chart-controls';
import { LegendPosition } from '@superset-maf-ui/plugin-chart-composed/src/components/utils';

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
            name: 'show_legend',
            config: {
              type: 'CheckboxControl',
              label: t('Legend'),
              renderTrigger: true,
              default: true,
              description: t('Whether to display the legend (toggles)'),
            },
          },
          {
            name: 'legend_position',
            config: {
              freeForm: true,
              type: 'SelectControl',
              clearable: false,
              label: t('Legend position'),
              renderTrigger: true,
              choices: formatSelectOptions(Object.keys(LegendPosition)),
              default: 'top',
              description: t('Set legend position'),
              visibility: ({ form_data }) => form_data.show_legend,
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
