import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Divider,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { RuleGroup, LogicalOperator } from '../../types';
import RuleGroupBuilder from './RuleGroupBuilder';
import LogicalOperatorSelector from './LogicalOperatorSelector';
import { RuleService } from '../../services/api';

interface RuleBuilderProps {
  title: string;
  description?: string;
  ruleGroups: RuleGroup[];
  groupsOperator: LogicalOperator;
  onRuleGroupsChange: (ruleGroups: RuleGroup[]) => void;
  onGroupsOperatorChange: (operator: LogicalOperator) => void;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  title,
  description,
  ruleGroups,
  groupsOperator,
  onRuleGroupsChange,
  onGroupsOperatorChange
}) => {
  // Add a new rule group
  const handleAddRuleGroup = () => {
    const newRuleGroup = RuleService.createRuleGroup();
    onRuleGroupsChange([...ruleGroups, newRuleGroup]);
  };

  // Update a rule group
  const handleUpdateRuleGroup = (index: number, updatedRuleGroup: RuleGroup) => {
    const updatedRuleGroups = [...ruleGroups];
    updatedRuleGroups[index] = updatedRuleGroup;
    onRuleGroupsChange(updatedRuleGroups);
  };

  // Delete a rule group
  const handleDeleteRuleGroup = (index: number) => {
    // If this is the last rule group, don't delete it
    if (ruleGroups.length <= 1) {
      return;
    }
    
    onRuleGroupsChange(ruleGroups.filter((_, i) => i !== index));
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      {ruleGroups.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No rule groups added yet. Add a rule group to define this rule.
        </Alert>
      ) : (
        <>
          {ruleGroups.length > 1 && (
            <Box sx={{ mb: 3 }}>
              <LogicalOperatorSelector
                value={groupsOperator}
                onChange={onGroupsOperatorChange}
                label="Rule groups joined by:"
              />
            </Box>
          )}
          
          {ruleGroups.map((ruleGroup, index) => (
            <Box key={ruleGroup.id} sx={{ mb: 3, position: 'relative' }}>
              {index > 0 && (
                <Box 
                  sx={{ 
                    position: 'relative', 
                    textAlign: 'center', 
                    my: 2,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: groupsOperator === 'AND' ? 'primary.main' : 'secondary.main',
                      zIndex: 0,
                      opacity: 0.7
                    }
                  }}
                >
                  <Typography 
                    variant="body1" 
                    component="span" 
                    sx={{ 
                      backgroundColor: 'background.paper', 
                      px: 2, 
                      py: 0.5,
                      position: 'relative', 
                      zIndex: 1,
                      fontWeight: 'bold',
                      color: groupsOperator === 'AND' ? 'primary.main' : 'secondary.main',
                      border: '2px solid',
                      borderColor: groupsOperator === 'AND' ? 'primary.main' : 'secondary.main',
                      borderRadius: 1
                    }}
                  >
                    {groupsOperator}
                  </Typography>
                </Box>
              )}
              <RuleGroupBuilder
                ruleGroup={ruleGroup}
                onUpdate={(updatedRuleGroup) => handleUpdateRuleGroup(index, updatedRuleGroup)}
                onDelete={() => handleDeleteRuleGroup(index)}
                showDelete={ruleGroups.length > 1}
              />
            </Box>
          ))}
        </>
      )}
      
      <Button
        startIcon={<AddIcon />}
        onClick={handleAddRuleGroup}
        variant="contained"
        color="primary"
        sx={{ mt: 1 }}
      >
        Add Rule Group
      </Button>
    </Paper>
  );
};

export default RuleBuilder; 