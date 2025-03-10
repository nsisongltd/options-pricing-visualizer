import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Grid, Slider, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import * as d3 from 'd3';
import { styled } from '@mui/material/styles';
import init, { calculate_option_price } from '@wasm/options_pricing_wasm.js';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '400px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

function Visualization({ params, onParamsChange }) {
  const chartRef = useRef();

  useEffect(() => {
    const initWasm = async () => {
      await init();
      updateChart();
    };
    initWasm();
  }, [params]);

  const updateChart = () => {
    const data = generateData();
    renderChart(data);
  };

  const generateData = () => {
    const data = [];
    const strikeRange = 40; // ±20 from spot price
    const steps = 41; // Number of points

    for (let i = 0; i < steps; i++) {
      const strike = params.spotPrice - strikeRange/2 + (strikeRange * i / (steps - 1));
      const price = calculate_option_price({
        spot_price: params.spotPrice,
        strike_price: strike,
        time_to_expiry: params.timeToExpiry,
        volatility: params.volatility,
        risk_free_rate: params.riskFreeRate,
        option_type: params.optionType
      });
      data.push({ strike, price });
    }
    return data;
  };

  const renderChart = (data) => {
    if (!chartRef.current) return;

    // Clear any existing SVG
    d3.select(chartRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    // Set up scales
    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, d => d.strike), d3.max(data, d => d.strike)])
      .range([50, 800]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([350, 50]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Add axes to SVG
    svg
      .append('g')
      .attr('transform', `translate(0, 350)`)
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', 'translate(50, 0)')
      .call(yAxis);

    // Add line
    const line = d3
      .line()
      .x(d => xScale(d.strike))
      .y(d => yScale(d.price));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#90caf9')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots
    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.strike))
      .attr('cy', d => yScale(d.price))
      .attr('r', 4)
      .attr('fill', '#90caf9');
  };

  const handleParamChange = (param, value) => {
    onParamsChange({ ...params, [param]: value });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Options Pricing Visualization
      </Typography>
      <ControlsContainer>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Spot Price"
              type="number"
              value={params.spotPrice}
              onChange={(e) => handleParamChange('spotPrice', parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Strike Price"
              type="number"
              value={params.strikePrice}
              onChange={(e) => handleParamChange('strikePrice', parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Option Type</InputLabel>
              <Select
                value={params.optionType}
                label="Option Type"
                onChange={(e) => handleParamChange('optionType', e.target.value)}
              >
                <MenuItem value="call">Call</MenuItem>
                <MenuItem value="put">Put</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography gutterBottom>Time to Expiry (years)</Typography>
            <Slider
              value={params.timeToExpiry}
              min={0.1}
              max={5}
              step={0.1}
              onChange={(e, value) => handleParamChange('timeToExpiry', value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography gutterBottom>Volatility</Typography>
            <Slider
              value={params.volatility}
              min={0.1}
              max={1}
              step={0.01}
              onChange={(e, value) => handleParamChange('volatility', value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography gutterBottom>Risk-Free Rate</Typography>
            <Slider
              value={params.riskFreeRate}
              min={0}
              max={0.2}
              step={0.01}
              onChange={(e, value) => handleParamChange('riskFreeRate', value)}
            />
          </Grid>
        </Grid>
      </ControlsContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Option Price vs Strike Price
            </Typography>
            <ChartContainer ref={chartRef} />
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Visualization; 