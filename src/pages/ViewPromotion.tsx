import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { usePromotionStore } from '../store/promotionStore';

const ViewPromotion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    fetchPromotionById,
    isLoading, 
    error,
    currentPromotion
  } = usePromotionStore();

  // Fetch promotion data when component mounts
  useEffect(() => {
    if (id) {
      fetchPromotionById(id);
    }
  }, [id, fetchPromotionById]);

  // Check if a rule uses OR conditions
  const hasOrConditions = (rule: any) => {
    return rule.operator === 'OR' || rule.ruleGroups.some((group: any) => group.operator === 'OR');
  };

  // Format rule group for display
  const formatRuleGroup = (group: any) => {
    if (!group.conditions || group.conditions.length === 0) {
      return 'No conditions';
    }

    return group.conditions.map((condition: any, index: number) => {
      // In a real app, you would look up the attribute name and format the condition properly
      const conditionText = `Attribute ${condition.attributeId} ${condition.operator} ${condition.value}`;
      
      if (index === 0) {
        return conditionText;
      }
      
      return `${group.operator} ${conditionText}`;
    }).join(' ');
  };

  if (isLoading && !currentPromotion) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading promotion...</Typography>
      </Container>
    );
  }

  if (!currentPromotion && !isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Promotion not found. The promotion may have been deleted or you may not have permission to view it.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/promotions')}
            startIcon={<ArrowBackIcon />}
          >
            Back to Promotions
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {currentPromotion?.name}
        </Typography>
        
        <Box>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/promotions')}
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate(`/promotions/edit/${id}`)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Promotion Details</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Description</Typography>
                    <Typography variant="body1">{currentPromotion?.description}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Status</Typography>
                    <Chip 
                      label={currentPromotion?.isActive ? 'Active' : 'Inactive'} 
                      color={currentPromotion?.isActive ? 'success' : 'default'} 
                      size="small" 
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Discount</Typography>
                    <Typography variant="body1">
                      {currentPromotion?.discountType === 'percentage' ? `${currentPromotion.discountValue}%` : 
                       currentPromotion?.discountType === 'fixed' ? `$${currentPromotion.discountValue}` : 'Buy One Get One'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Start Date</Typography>
                    <Typography variant="body1">
                      {currentPromotion?.startDate ? new Date(currentPromotion.startDate).toLocaleDateString() : 'Not set'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">End Date</Typography>
                    <Typography variant="body1">
                      {currentPromotion?.endDate ? new Date(currentPromotion.endDate).toLocaleDateString() : 'Not set'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Created</Typography>
                    <Typography variant="body1">
                      {currentPromotion?.createdAt ? new Date(currentPromotion.createdAt).toLocaleString() : 'Unknown'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Last Updated</Typography>
                    <Typography variant="body1">
                      {currentPromotion?.updatedAt ? new Date(currentPromotion.updatedAt).toLocaleString() : 'Unknown'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Logical Conditions</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  {currentPromotion?.rules.some(rule => hasOrConditions(rule)) ? (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      This promotion uses OR conditions between different attribute categories, allowing for more flexible rule definitions.
                    </Alert>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      This promotion uses only AND conditions between attribute categories.
                    </Alert>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {currentPromotion?.rules.some(rule => rule.operator === 'OR') && (
                    <Chip label="OR between rule groups" color="secondary" size="small" />
                  )}
                  
                  {currentPromotion?.rules.some(rule => 
                    rule.ruleGroups.some(group => group.operator === 'OR')
                  ) && (
                    <Chip label="OR between conditions" color="secondary" size="small" />
                  )}
                  
                  {currentPromotion?.rules.some(rule => rule.operator === 'AND') && (
                    <Chip label="AND between rule groups" color="primary" size="small" />
                  )}
                  
                  {currentPromotion?.rules.some(rule => 
                    rule.ruleGroups.some(group => group.operator === 'AND')
                  ) && (
                    <Chip label="AND between conditions" color="primary" size="small" />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Qualifying Rules</Typography>
                <Divider sx={{ mb: 2 }} />
                
                {currentPromotion?.rules
                  .filter(rule => rule.type === 'Qualifier')
                  .map((rule, index) => (
                    <Box key={rule.id} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {rule.isInclusion ? 'Inclusions' : 'Exclusions'}
                        {rule.ruleGroups.length > 1 && (
                          <Chip 
                            label={`Joined by ${rule.operator}`} 
                            color={rule.operator === 'AND' ? 'primary' : 'secondary'} 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                      
                      <List dense>
                        {rule.ruleGroups.map((group, groupIndex) => (
                          <ListItem key={group.id} sx={{ 
                            backgroundColor: 'background.paper', 
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1
                          }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" fontWeight="medium">
                                    Rule Group {groupIndex + 1}
                                  </Typography>
                                  {group.conditions.length > 1 && (
                                    <Chip 
                                      label={`Conditions joined by ${group.operator}`} 
                                      color={group.operator === 'AND' ? 'primary' : 'secondary'} 
                                      size="small" 
                                      sx={{ ml: 1 }}
                                    />
                                  )}
                                </Box>
                              }
                              secondary={formatRuleGroup(group)}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Target Rules</Typography>
                <Divider sx={{ mb: 2 }} />
                
                {currentPromotion?.rules
                  .filter(rule => rule.type === 'Target')
                  .map((rule, index) => (
                    <Box key={rule.id} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {rule.isInclusion ? 'Inclusions' : 'Exclusions'}
                        {rule.ruleGroups.length > 1 && (
                          <Chip 
                            label={`Joined by ${rule.operator}`} 
                            color={rule.operator === 'AND' ? 'primary' : 'secondary'} 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                      
                      <List dense>
                        {rule.ruleGroups.map((group, groupIndex) => (
                          <ListItem key={group.id} sx={{ 
                            backgroundColor: 'background.paper', 
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1
                          }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" fontWeight="medium">
                                    Rule Group {groupIndex + 1}
                                  </Typography>
                                  {group.conditions.length > 1 && (
                                    <Chip 
                                      label={`Conditions joined by ${group.operator}`} 
                                      color={group.operator === 'AND' ? 'primary' : 'secondary'} 
                                      size="small" 
                                      sx={{ ml: 1 }}
                                    />
                                  )}
                                </Box>
                              }
                              secondary={formatRuleGroup(group)}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewPromotion; 