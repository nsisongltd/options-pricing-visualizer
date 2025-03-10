import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Grid, Tabs, Tab } from '@mui/material';
import * as d3 from 'd3';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '300px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

function GreeksVisualization({ params }) {
  const chartRef = useRef();
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [wasmModule, setWasmModule] = useState(null);

  useEffect(() => {
    const initWasm = async () => {
      try {
        const wasmUrl = '/wasm/options_pricing_wasm.js';
        const { default: init, calculate_option_price } = await import(/* @vite-ignore */ wasmUrl);
        await init();
        setWasmModule({ calculate_option_price });
        calculateGreeks();
      } catch (error) {
        console.error('Failed to initialize WebAssembly module:', error);
      }
    };
    initWasm();
  }, []);

  const calculateGreeks = (strike) => {
    const h = 0.01; // Small change for numerical differentiation
    
    // Calculate price at current point
    const price = wasmModule.calculate_option_price({
      spot_price: params.spotPrice,
      strike_price: strike,
      time_to_expiry: params.timeToExpiry,
      volatility: params.volatility,
      risk_free_rate: params.riskFreeRate,
      option_type: params.optionType
    });

    // Calculate price with small change in spot price (for Delta)
    const priceSpotUp = wasmModule.calculate_option_price({
      spot_price: params.spotPrice + h,
      strike_price: strike,
      time_to_expiry: params.timeToExpiry,
      volatility: params.volatility,
      risk_free_rate: params.riskFreeRate,
      option_type: params.optionType
    });

    // Calculate price with small change in time (for Theta)
    const priceTimeUp = wasmModule.calculate_option_price({
      spot_price: params.spotPrice,
      strike_price: strike,
      time_to_expiry: params.timeToExpiry + h,
      volatility: params.volatility,
      risk_free_rate: params.riskFreeRate,
      option_type: params.optionType
    });

    // Calculate price with small change in volatility (for Vega)
    const priceVolUp = wasmModule.calculate_option_price({
      spot_price: params.spotPrice,
      strike_price: strike,
      time_to_expiry: params.timeToExpiry,
      volatility: params.volatility + h,
      risk_free_rate: params.riskFreeRate,
      option_type: params.optionType
    });

    // Calculate Greeks
    const delta = (priceSpotUp - price) / h;
    const gamma = ((priceSpotUp - price) / h - (price - wasmModule.calculate_option_price({
      spot_price: params.spotPrice - h,
      strike_price: strike,
      time_to_expiry: params.timeToExpiry,
      volatility: params.volatility,
      risk_free_rate: params.riskFreeRate,
      option_type: params.optionType
    })) / h) / h;
    const theta = (priceTimeUp - price) / h;
    const vega = (priceVolUp - price) / h;

    return {
      strike,
      delta,
      gamma,
      theta,
      vega
    };
  };

  const updateChart = () => {
    const newData = [];
    const strikeRange = 40; // ±20 from spot price
    const steps = 41; // Number of points

    for (let i = 0; i < steps; i++) {
      const strike = params.spotPrice - strikeRange/2 + (strikeRange * i / (steps - 1));
      newData.push(calculateGreeks(strike));
    }
    setData(newData);
    renderChart(newData);
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
      .domain([d3.min(data, d => d[getActiveGreek()]), d3.max(data, d => d[getActiveGreek()])])
      .range([250, 50]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Add axes to SVG
    svg
      .append('g')
      .attr('transform', `translate(0, 250)`)
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', 'translate(50, 0)')
      .call(yAxis);

    // Add line
    const line = d3
      .line()
      .x(d => xScale(d.strike))
      .y(d => yScale(d[getActiveGreek()]));

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
      .attr('cy', d => yScale(d[getActiveGreek()]))
      .attr('r', 4)
      .attr('fill', '#90caf9');
  };

  const getActiveGreek = () => {
    switch (activeTab) {
      case 0: return 'delta';
      case 1: return 'gamma';
      case 2: return 'theta';
      case 3: return 'vega';
      default: return 'delta';
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Greeks Analysis
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Delta" />
        <Tab label="Gamma" />
        <Tab label="Theta" />
        <Tab label="Vega" />
      </Tabs>
      <ChartContainer ref={chartRef} />
    </StyledPaper>
  );
}

export default GreeksVisualization; 