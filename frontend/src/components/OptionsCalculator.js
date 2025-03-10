import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ResultBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

function OptionsCalculator() {
  const [formData, setFormData] = useState({
    spotPrice: '',
    strikePrice: '',
    timeToExpiry: '',
    volatility: '',
    riskFreeRate: '',
    optionType: 'call',
  });

  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalculate = async () => {
    // TODO: Implement WebAssembly calculation
    // This is a placeholder for the actual calculation
    const calculatedPrice = 0.0; // Replace with actual calculation
    setResult(calculatedPrice);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Options Pricing Calculator
      </Typography>
      <StyledPaper>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Spot Price"
              name="spotPrice"
              type="number"
              value={formData.spotPrice}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Strike Price"
              name="strikePrice"
              type="number"
              value={formData.strikePrice}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Time to Expiry (years)"
              name="timeToExpiry"
              type="number"
              value={formData.timeToExpiry}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Volatility"
              name="volatility"
              type="number"
              value={formData.volatility}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Risk-Free Rate"
              name="riskFreeRate"
              type="number"
              value={formData.riskFreeRate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Option Type</InputLabel>
              <Select
                name="optionType"
                value={formData.optionType}
                onChange={handleChange}
                label="Option Type"
              >
                <MenuItem value="call">Call</MenuItem>
                <MenuItem value="put">Put</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCalculate}
              fullWidth
            >
              Calculate
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>

      {result !== null && (
        <ResultBox>
          <Typography variant="h6" gutterBottom>
            Result
          </Typography>
          <Typography variant="h4" color="primary">
            ${result.toFixed(4)}
          </Typography>
        </ResultBox>
      )}
    </Box>
  );
}

export default OptionsCalculator; 