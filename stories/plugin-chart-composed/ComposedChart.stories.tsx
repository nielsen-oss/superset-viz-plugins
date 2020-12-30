import React from 'react';
import ComposedChart from '../../plugins/plugin-chart-composed/src/components/ComposedChart';
// import transformProps from '../../plugins/plugin-chart-pie/src/plugin/transformProps';
// import {legendTopPercentage} from '../../plugins/plugin-chart-pie/test/__mocks__/pieProps';
// import {ChartProps, supersetTheme, ThemeProvider} from "@superset-ui/core";

// export default {
//   title: 'Plugins/Composed Chart',
//   component: ComposedChart,
//   argTypes: {
//     data: {table: {disable: true}},
//   },
// };
//
// const BarTemplate = (args) =>
//   <ThemeProvider theme={supersetTheme}><ComposedChart
//     {...args}
//     data={transformProps({...legendTopPercentage, queriesData: args.queriesData} as unknown as ChartProps).data}
//   /></ThemeProvider>;
//
// const VerticalTemplate = (args) =>
//   <ThemeProvider theme={supersetTheme}><ComposedChart
//     {...args}
//     showLabels={transformProps({
//       ...legendTopPercentage,
//       formData: {
//         ...legendTopPercentage.formData,
//         isDonut: true
//       },
//     } as unknown as ChartProps).showLabels}
//     data={transformProps({
//       ...legendTopPercentage,
//       queriesData: args.queriesData
//     } as unknown as ChartProps).data}
//   /></ThemeProvider>;
//
// export const Bar = BarTemplate.bind({});
// Bar.args = {
//   ...transformProps(legendTopPercentage as unknown as ChartProps),
//   queriesData: legendTopPercentage.queriesData
// }
//
// export const Vertical = VerticalTemplate.bind({});
// Vertical.args = {
//   ...transformProps({
//     ...legendTopPercentage,
//     formData: {
//       ...legendTopPercentage.formData,
//       isDonut: true
//     }
//   } as unknown as ChartProps),
//   queriesData: legendTopPercentage.queriesData
// }
