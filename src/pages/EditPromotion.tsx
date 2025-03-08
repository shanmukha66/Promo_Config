import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Switch, 
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import RuleBuilder from '../components/rules/RuleBuilder';
import { usePromotionStore } from '../store/promotionStore';

const EditPromotion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    formState, 
    setFormField, 
    fetchPromotionById,
    updatePromotion, 
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

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (id) {
      try {
        const updatedPromotion = await updatePromotion(id);
        navigate(`/promotions/view/${updatedPromotion.id}`);
      } catch (error) {
        console.error('Failed to update promotion:', error);
      }
    }
  };

  // Steps for the stepper
  const steps = ['Basic Information', 'Qualifying Rules', 'Target Rules', 'Review'];
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Render the current step content
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Promotion Name"
                value={formState.name}
                onChange={(e) => setFormField('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formState.description}
                onChange={(e) => setFormField('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formState.startDate}
                  onChange={(date) => setFormField('startDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formState.endDate}
                  onChange={(date) => setFormField('endDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  value={formState.discountType}
                  label="Discount Type"
                  onChange={(e) => setFormField('discountType', e.target.value as 'percentage' | 'fixed' | 'bogo')}
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                  <MenuItem value="bogo">Buy One Get One</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Discount Value"
                type="number"
                value={formState.discountValue}
                onChange={(e) => setFormField('discountValue', Number(e.target.value))}
                disabled={formState.discountType === 'bogo'}
                InputProps={{
                  startAdornment: formState.discountType === 'percentage' ? null : '$',
                  endAdornment: formState.discountType === 'percentage' ? '%' : null,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formState.isActive}
                    onChange={(e) => setFormField('isActive', e.target.checked)}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <>
            <RuleBuilder
              title="Qualifying Inclusions"
              description="Define the conditions that must be met for this promotion to apply. Items matching these conditions will qualify for the promotion."
              ruleGroups={formState.qualifierInclusions}
              groupsOperator={formState.qualifierInclusionsOperator}
              onRuleGroupsChange={(ruleGroups) => setFormField('qualifierInclusions', ruleGroups)}
              onGroupsOperatorChange={(operator) => setFormField('qualifierInclusionsOperator', operator)}
            />
            
            <RuleBuilder
              title="Qualifying Exclusions"
              description="Define conditions that will exclude items from qualifying for this promotion. Items matching these conditions will not qualify."
              ruleGroups={formState.qualifierExclusions}
              groupsOperator={formState.qualifierExclusionsOperator}
              onRuleGroupsChange={(ruleGroups) => setFormField('qualifierExclusions', ruleGroups)}
              onGroupsOperatorChange={(operator) => setFormField('qualifierExclusionsOperator', operator)}
            />
          </>
        );
      case 2:
        return (
          <>
            <RuleBuilder
              title="Target Inclusions"
              description="Define the items that will receive the discount. Only items matching these conditions will be discounted."
              ruleGroups={formState.targetInclusions}
              groupsOperator={formState.targetInclusionsOperator}
              onRuleGroupsChange={(ruleGroups) => setFormField('targetInclusions', ruleGroups)}
              onGroupsOperatorChange={(operator) => setFormField('targetInclusionsOperator', operator)}
            />
            
            <RuleBuilder
              title="Target Exclusions"
              description="Define items that should be excluded from receiving the discount. Items matching these conditions will not be discounted."
              ruleGroups={formState.targetExclusions}
              groupsOperator={formState.targetExclusionsOperator}
              onRuleGroupsChange={(ruleGroups) => setFormField('targetExclusions', ruleGroups)}
              onGroupsOperatorChange={(operator) => setFormField('targetExclusionsOperator', operator)}
            />
          </>
        );
      case 3:
        return (
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Promotion Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Name</Typography>
                  <Typography variant="body1">{formState.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Typography variant="body1">{formState.isActive ? 'Active' : 'Inactive'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography variant="body1">{formState.description}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Start Date</Typography>
                  <Typography variant="body1">
                    {formState.startDate ? new Date(formState.startDate).toLocaleDateString() : 'Not set'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">End Date</Typography>
                  <Typography variant="body1">
                    {formState.endDate ? new Date(formState.endDate).toLocaleDateString() : 'Not set'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Discount</Typography>
                  <Typography variant="body1">
                    {formState.discountType === 'percentage' ? `${formState.discountValue}%` : 
                     formState.discountType === 'fixed' ? `$${formState.discountValue}` : 'Buy One Get One'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Qualifying Rules</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Inclusions</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formState.qualifierInclusions.length > 0 
                    ? `${formState.qualifierInclusions.length} rule groups joined by ${formState.qualifierInclusionsOperator}`
                    : 'No inclusions defined'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Exclusions</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formState.qualifierExclusions.length > 0 
                    ? `${formState.qualifierExclusions.length} rule groups joined by ${formState.qualifierExclusionsOperator}`
                    : 'No exclusions defined'}
                </Typography>
              </Box>
            </Paper>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Target Rules</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Inclusions</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formState.targetInclusions.length > 0 
                    ? `${formState.targetInclusions.length} rule groups joined by ${formState.targetInclusionsOperator}`
                    : 'No inclusions defined'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Exclusions</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formState.targetExclusions.length > 0 
                    ? `${formState.targetExclusions.length} rule groups joined by ${formState.targetExclusionsOperator}`
                    : 'No exclusions defined'}
                </Typography>
              </Box>
            </Paper>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
          </Box>
        );
      default:
        return null;
    }
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
          <Button variant="contained" onClick={() => navigate('/promotions')}>
            Back to Promotions
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Promotion
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              <Button 
                onClick={() => navigate('/promotions')} 
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Promotion'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditPromotion; 