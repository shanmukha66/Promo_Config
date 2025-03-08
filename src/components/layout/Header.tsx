import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Link
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LocalOfferIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Promo Config UI
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              underline="none"
              sx={{ mx: 1 }}
            >
              <Button color="inherit">Dashboard</Button>
            </Link>
            <Link
              component={RouterLink}
              to="/promotions"
              color="inherit"
              underline="none"
              sx={{ mx: 1 }}
            >
              <Button color="inherit">Promotions</Button>
            </Link>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Button 
              component={RouterLink} 
              to="/promotions/create" 
              variant="contained" 
              color="secondary"
            >
              Create Promotion
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 