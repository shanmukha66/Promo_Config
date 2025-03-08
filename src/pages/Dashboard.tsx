import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Box,
  Divider,
  Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { usePromotionStore } from '../store/promotionStore';

const Dashboard: React.FC = () => {
  const { promotions, fetchPromotions, isLoading } = usePromotionStore();

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  // Get active promotions count
  const activePromotionsCount = promotions.filter(p => p.isActive).length;

  // Get promotions with OR conditions
  const orConditionPromotions = promotions.filter(p => 
    p.rules.some(rule => 
      rule.operator === 'OR' || rule.ruleGroups.some(group => group.operator === 'OR')
    )
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Promotions
              </Typography>
              <Typography variant="h3" component="div">
                {isLoading ? '...' : promotions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Promotions
              </Typography>
              <Typography variant="h3" component="div">
                {isLoading ? '...' : activePromotionsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                With OR Conditions
              </Typography>
              <Typography variant="h3" component="div">
                {isLoading ? '...' : orConditionPromotions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography color="text.secondary" gutterBottom>
                Create New Promotion
              </Typography>
              <Typography variant="body2">
                Configure a new promotion with AND/OR conditions
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                component={RouterLink} 
                to="/promotions/create" 
                variant="contained" 
                fullWidth
              >
                Create
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Recent Promotions
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        {isLoading ? (
          <Grid item xs={12}>
            <Typography>Loading promotions...</Typography>
          </Grid>
        ) : promotions.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No promotions found. Create your first promotion!</Typography>
          </Grid>
        ) : (
          promotions.slice(0, 3).map((promotion) => (
            <Grid item xs={12} md={4} key={promotion.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {promotion.name}
                    </Typography>
                    <Chip 
                      label={promotion.isActive ? 'Active' : 'Inactive'} 
                      color={promotion.isActive ? 'success' : 'default'} 
                      size="small" 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {promotion.description}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Discount:</strong> {promotion.discountType === 'percentage' ? `${promotion.discountValue}%` : 
                      promotion.discountType === 'fixed' ? `$${promotion.discountValue}` : 'Buy One Get One'}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Valid:</strong> {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                  </Typography>
                  
                  {promotion.rules.some(rule => 
                    rule.operator === 'OR' || rule.ruleGroups.some(group => group.operator === 'OR')
                  ) && (
                    <Chip 
                      label="Uses OR Conditions" 
                      color="secondary" 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    component={RouterLink} 
                    to={`/promotions/view/${promotion.id}`} 
                    size="small"
                  >
                    View
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to={`/promotions/edit/${promotion.id}`} 
                    size="small"
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      
      {promotions.length > 3 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            component={RouterLink} 
            to="/promotions" 
            variant="outlined"
          >
            View All Promotions
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard; 