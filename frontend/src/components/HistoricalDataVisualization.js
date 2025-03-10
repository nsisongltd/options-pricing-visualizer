import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Grid, TextField, Button, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as d3 from 'd3';
import { styled } from '@mui/material/styles';
import { api } from '../services/api';

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

function HistoricalDataVisualization({ params }) {
  const chartRef = useRef();
  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const [endDate, setEndDate] = useState(new Date());

  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const data = await api.getHistoricalData(
        symbol,
        startDate.toISOString(),
        endDate.toISOString()
      );
      setHistoricalData(data);
      renderChart(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [symbol, startDate, endDate]);

  const renderChart = (data) => {
    if (!chartRef.current || data.length === 0) return;

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
      .scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp)))
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
      .x(d => xScale(new Date(d.timestamp)))
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
      .attr('cx', d => xScale(new Date(d.timestamp)))
      .attr('cy', d => yScale(d.price))
      .attr('r', 4)
      .attr('fill', '#90caf9')
      .append('title')
      .text(d => `Price: ${d.price.toFixed(2)}\nDate: ${new Date(d.timestamp).toLocaleDateString()}`);
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Historical Options Data
      </Typography>
      <ControlsContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={fetchHistoricalData}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </Button>
          </Grid>
        </Grid>
      </ControlsContainer>
      <ChartContainer ref={chartRef} />
    </StyledPaper>
  );
}

export default HistoricalDataVisualization; 