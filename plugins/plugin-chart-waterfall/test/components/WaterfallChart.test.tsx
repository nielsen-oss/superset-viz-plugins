import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, configure } from '@testing-library/react';
import { supersetTheme, ThemeProvider } from '@superset-ui/core';
import WaterfallChart from '../../src/components/WaterfallChart';
import transformProps from '../../src/plugin/transformProps';
import waterfallData from '../mocks/waterfallData';
configure({ testIdAttribute: 'data-test-id' });
describe('Waterfall chart', () => {
  beforeEach(() => {
    // Recharts still have some UNSAFE react functions that failing test
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  const getWrapper = () =>
    render(
      <ThemeProvider theme={supersetTheme}>
        {/*
        // @ts-ignore */}
        <WaterfallChart {...transformProps(waterfallData)} />
      </ThemeProvider>,
    );

  it('Render ticks', async () => {
    getWrapper();
    const label2017 = screen.getAllByText('2017');
    const labelFacebook = screen.getAllByText('Facebook');
    expect(label2017.length).toBe(1);
    expect(labelFacebook.length).toBe(3);
  });

  it('Render Bars', () => {
    getWrapper();
    const bars: Array<any> = screen.queryAllByTestId('bar');
    expect(bars).toHaveLength(35);
    expect(bars[0].attributes.fill.value).toBe('#66BCFE');
    expect(bars[0].attributes.y.value).toBe('718');
    expect(bars[1].attributes.fill.value).toBe('#5AC189');
    expect(bars[1].attributes.y.value).toBe('515.15064');
  });
});
