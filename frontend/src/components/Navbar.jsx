import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CalculateIcon from '@mui/icons-material/Calculate';
import TimelineIcon from '@mui/icons-material/Timeline';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext.jsx';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static">
      <StyledToolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Options Pricing Visualizer
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NavButton
            component={RouterLink}
            to="/"
            startIcon={<ShowChartIcon />}
          >
            Dashboard
          </NavButton>
          <NavButton
            component={RouterLink}
            to="/calculator"
            startIcon={<CalculateIcon />}
          >
            Calculator
          </NavButton>
          <NavButton
            component={RouterLink}
            to="/visualization"
            startIcon={<TimelineIcon />}
          >
            Visualization
          </NavButton>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{ ml: 2 }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
}

export default Navbar; 