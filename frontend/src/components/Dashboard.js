import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import CalculateIcon from '@mui/icons-material/Calculate';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Options Pricing Visualizer
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  component={RouterLink}
                  to="/calculator"
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<CalculateIcon />}
                >
                  New Calculation
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  component={RouterLink}
                  to="/visualization"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={<TimelineIcon />}
                >
                  View Visualizations
                </Button>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>

        {/* Feature Cards */}
        <Grid item xs={12} md={4}>
          <FeatureCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Options Calculator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calculate option prices using the Black-Scholes model with real-time
                WebAssembly-powered computations.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={RouterLink}
                to="/calculator"
                startIcon={<CalculateIcon />}
              >
                Try Calculator
              </Button>
            </CardActions>
          </FeatureCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <FeatureCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interactive Visualizations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore option pricing relationships through interactive charts and
                graphs powered by D3.js.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={RouterLink}
                to="/visualization"
                startIcon={<TimelineIcon />}
              >
                View Charts
              </Button>
            </CardActions>
          </FeatureCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <FeatureCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analyze option performance metrics and risk factors with detailed
                breakdowns and insights.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={RouterLink}
                to="/visualization"
                startIcon={<ShowChartIcon />}
              >
                View Analytics
              </Button>
            </CardActions>
          </FeatureCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 