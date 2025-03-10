import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import * as d3 from 'd3';
import { styled } from '@mui/material/styles';

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

function Visualization() {
  const chartRef = useRef();

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear any existing SVG
    d3.select(chartRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    // Sample data - replace with actual options data
    const data = generateSampleData();

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

  }, []);

  // Generate sample data for visualization
  const generateSampleData = () => {
    const data = [];
    for (let strike = 80; strike <= 120; strike += 2) {
      data.push({
        strike,
        price: Math.exp(-Math.pow(strike - 100, 2) / 200) * 10,
      });
    }
    return data;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Options Pricing Visualization
      </Typography>
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