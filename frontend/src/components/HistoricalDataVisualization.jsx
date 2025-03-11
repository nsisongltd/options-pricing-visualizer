import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert
} from '@mui/material';
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
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState(null);

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistoricalData(
        symbol.toUpperCase(),
        startDate.toISOString(),
        endDate.toISOString()
      );
      setHistoricalData(data);
      renderChart(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setError(error.message);
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, []); // Only fetch on mount

  const renderChart = (data) => {
    if (!chartRef.current || data.length === 0) return;

    // Clear any existing SVG
    d3.select(chartRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp)))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, d => Number(d.price)) * 0.95,
        d3.max(data, d => Number(d.price)) * 1.05
      ])
      .range([height, 0]);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add line
    const line = d3
      .line()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(Number(d.price)));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2196f3')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(new Date(d.timestamp)))
      .attr('cy', d => yScale(Number(d.price)))
      .attr('r', 4)
      .attr('fill', '#2196f3')
      .attr('opacity', 0.7)
      .append('title')
      .text(d => `Price: $${Number(d.price).toFixed(2)}\nDate: ${new Date(d.timestamp).toLocaleDateString()}`);
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>Market Data: {symbol}</Typography>
      
      <ControlsContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              helperText="Enter a valid stock symbol (e.g., AAPL, GOOGL)"
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
              {loading ? 'Fetching Data...' : 'Fetch Market Data'}
            </Button>
          </Grid>
        </Grid>
      </ControlsContainer>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {historicalData.length > 0 ? (
        <>
          <ChartContainer ref={chartRef} />
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Volume</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historicalData.slice(0, 10).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(row.timestamp).toLocaleDateString()}</TableCell>
                    <TableCell>${Number(row.price).toFixed(2)}</TableCell>
                    <TableCell>{row.volume?.toLocaleString() || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : !loading && !error && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Enter a stock symbol and date range to fetch market data.
        </Alert>
      )}
    </StyledPaper>
  );
}

export default HistoricalDataVisualization; 