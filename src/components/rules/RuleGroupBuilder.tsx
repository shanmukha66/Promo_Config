import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Divider,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { RuleGroup, AttributeCondition, LogicalOperator } from '../../types';
import ConditionBuilder from './ConditionBuilder';
import LogicalOperatorSelector from './LogicalOperatorSelector';
import { RuleService } from '../../services/api';

interface RuleGroupBuilderProps {
  ruleGroup: RuleGroup;
  onUpdate: (ruleGroup: RuleGroup) => void;
  onDelete: () => void;
  showDelete?: boolean;
}

const RuleGroupBuilder: React.FC<RuleGroupBuilderProps> = ({
  ruleGroup,
  onUpdate,
  onDelete,
  showDelete = true
}) => {
  // Update the operator for this rule group
  const handleOperatorChange = (operator: LogicalOperator) => {
    onUpdate({
      ...ruleGroup,
      operator
    });
  };

  // Add a new condition to this rule group
  const handleAddCondition = () => {
    const newCondition: AttributeCondition = {
      id: RuleService.generateId(),
      attributeId: '',
      operator: '=',
      value: ''
    };

    onUpdate({
      ...ruleGroup,
      conditions: [...ruleGroup.conditions, newCondition]
    });
  };

  // Update a condition in this rule group
  const handleUpdateCondition = (index: number, updatedCondition: AttributeCondition) => {
    const updatedConditions = [...ruleGroup.conditions];
    updatedConditions[index] = updatedCondition;

    onUpdate({
      ...ruleGroup,
      conditions: updatedConditions
    });
  };

  // Delete a condition from this rule group
  const handleDeleteCondition = (index: number) => {
    onUpdate({
      ...ruleGroup,
      conditions: ruleGroup.conditions.filter((_, i) => i !== index)
    });
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 2,
        backgroundColor: '#f8f9fa'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="medium">Rule Group</Typography>
          <Box sx={{ ml: 2 }}>
            <LogicalOperatorSelector
              value={ruleGroup.operator}
              onChange={handleOperatorChange}
              label="Conditions joined by:"
            />
          </Box>
        </Box>
        
        {showDelete && (
          <IconButton onClick={onDelete} color="error" size="small">
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {ruleGroup.conditions.length === 0 ? (
        <Typography color="text.secondary" sx={{ my: 2, textAlign: 'center' }}>
          No conditions added yet. Add a condition to define this rule group.
        </Typography>
      ) : (
        <Box sx={{ mb: 2 }}>
          {ruleGroup.conditions.map((condition, index) => (
            <Box key={condition.id} sx={{ mb: 2, position: 'relative' }}>
              {index > 0 && (
                <Box 
                  sx={{ 
                    position: 'relative', 
                    textAlign: 'center', 
                    my: 1,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      height: '1px',
                      backgroundColor: 'divider',
                      zIndex: 0
                    }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    component="span" 
                    sx={{ 
                      backgroundColor: '#f8f9fa', 
                      px: 2, 
                      position: 'relative', 
                      zIndex: 1,
                      fontWeight: 'bold',
                      color: ruleGroup.operator === 'AND' ? 'primary.main' : 'secondary.main'
                    }}
                  >
                    {ruleGroup.operator}
                  </Typography>
                </Box>
              )}
              <ConditionBuilder
                condition={condition}
                onUpdate={(updatedCondition) => handleUpdateCondition(index, updatedCondition)}
                onDelete={() => handleDeleteCondition(index)}
              />
            </Box>
          ))}
        </Box>
      )}
      
      <Button
        startIcon={<AddIcon />}
        onClick={handleAddCondition}
        variant="outlined"
        size="small"
        fullWidth
      >
        Add Condition
      </Button>
    </Paper>
  );
};

export default RuleGroupBuilder; 