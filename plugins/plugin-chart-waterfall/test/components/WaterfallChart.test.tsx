import React from 'react';
import { render, screen, configure } from '@testing-library/react';
import { supersetTheme, ThemeProvider } from '@superset-ui/style';
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

  it('Render legend', () => {
    getWrapper();
    const legend = screen.getByTestId('legend');
    expect(legend.children).toHaveLength(4);
    expect(legend.children[0].children[1].textContent).toEqual('Increase');
    expect(legend.children[1].children[1].textContent).toEqual('Decrease');
    expect(legend.children[2].children[1].textContent).toEqual('Total');
    expect(legend.children[3].children[1].textContent).toEqual('Other');
  });

  xit('Render ticks', async () => {
    // TODO:: This test isn't working
    getWrapper();
    const label2017 = await screen.findByTestId('tick-2017');
    const labelFacebook = await screen.findByTestId('tick-Facebook');
    expect(label2017).toBeInTheDocument();
    expect(labelFacebook).toBeInTheDocument();
  });

  it('Render Bars', () => {
    getWrapper();
    const bars = screen.queryAllByTestId('bar');
    expect(bars).toHaveLength(20);
    expect(bars[0].attributes.fill.value).toBe('#66BCFE');
    expect(bars[0].attributes.y.value).toBe('578');

    expect(bars[1].attributes.fill.value).toBe('#5AC189');
    expect(bars[1].attributes.y.value).toBe('420.35384');
  });
});
