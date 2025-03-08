import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton,
  Paper,
  Typography,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AttributeCondition, Attribute } from '../../types';
import AttributeSelector from './AttributeSelector';
import { mockAttributeCategories } from '../../services/mockData';

interface ConditionBuilderProps {
  condition: AttributeCondition;
  onUpdate: (condition: AttributeCondition) => void;
  onDelete: () => void;
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  condition,
  onUpdate,
  onDelete
}) => {
  const [attribute, setAttribute] = useState<Attribute | null>(null);

  // Find the attribute details based on the attributeId
  useEffect(() => {
    const findAttribute = () => {
      for (const category of mockAttributeCategories) {
        for (const attr of category.attributes) {
          if (attr.id === condition.attributeId) {
            setAttribute(attr);
            return;
          }
        }
      }
      setAttribute(null);
    };

    findAttribute();
  }, [condition.attributeId]);

  const handleAttributeChange = (attributeId: string) => {
    // Find the new attribute
    let newAttribute: Attribute | null = null;
    for (const category of mockAttributeCategories) {
      for (const attr of category.attributes) {
        if (attr.id === attributeId) {
          newAttribute = attr;
          break;
        }
      }
      if (newAttribute) break;
    }

    // Set default operator and value based on attribute type
    let defaultOperator = '=';
    let defaultValue: any = '';

    if (newAttribute) {
      switch (newAttribute.type) {
        case 'boolean':
          defaultValue = false;
          break;
        case 'number':
          defaultValue = 0;
          break;
        case 'enum':
          defaultValue = newAttribute.options?.[0] || '';
          break;
        default:
          defaultValue = '';
      }
    }

    onUpdate({
      ...condition,
      attributeId,
      operator: defaultOperator,
      value: defaultValue
    });
  };

  const handleOperatorChange = (event: SelectChangeEvent<string>) => {
    onUpdate({
      ...condition,
      operator: event.target.value
    });
  };

  const handleValueChange = (value: any) => {
    onUpdate({
      ...condition,
      value
    });
  };

  // Get available operators based on attribute type
  const getOperators = () => {
    if (!attribute) return ['='];

    switch (attribute.type) {
      case 'string':
        return ['=', '!=', 'contains', 'startsWith', 'endsWith'];
      case 'number':
        return ['=', '!=', '>', '<', '>=', '<='];
      case 'boolean':
        return ['=', '!='];
      case 'date':
        return ['=', '!=', '>', '<', '>=', '<='];
      case 'enum':
        return ['=', '!='];
      default:
        return ['='];
    }
  };

  // Render value input based on attribute type
  const renderValueInput = () => {
    if (!attribute) return null;

    switch (attribute.type) {
      case 'string':
        return (
          <TextField
            size="small"
            label="Value"
            value={condition.value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            fullWidth
          />
        );
      case 'number':
        return (
          <TextField
            size="small"
            label="Value"
            type="number"
            value={condition.value || 0}
            onChange={(e) => handleValueChange(Number(e.target.value))}
            fullWidth
          />
        );
      case 'boolean':
        return (
          <FormControl size="small" fullWidth>
            <InputLabel>Value</InputLabel>
            <Select
              value={String(condition.value)}
              label="Value"
              onChange={(e) => handleValueChange(e.target.value === 'true')}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>
        );
      case 'enum':
        return (
          <FormControl size="small" fullWidth>
            <InputLabel>Value</InputLabel>
            <Select
              value={String(condition.value)}
              label="Value"
              onChange={(e) => handleValueChange(e.target.value)}
            >
              {attribute.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'date':
        return (
          <TextField
            size="small"
            label="Value"
            type="date"
            value={typeof condition.value === 'string' || condition.value instanceof Date ? new Date(condition.value).toISOString().split('T')[0] : ''}
            onChange={(e) => handleValueChange(new Date(e.target.value))}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mb: 2, 
        border: '1px solid', 
        borderColor: 'divider',
        borderRadius: 1
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2">Condition</Typography>
        <IconButton size="small" onClick={onDelete} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AttributeSelector
          selectedAttributeId={condition.attributeId}
          onAttributeChange={handleAttributeChange}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Operator</InputLabel>
            <Select
              value={condition.operator}
              label="Operator"
              onChange={handleOperatorChange}
              disabled={!attribute}
            >
              {getOperators().map((op) => (
                <MenuItem key={op} value={op}>
                  {op}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ flexGrow: 1 }}>
            {renderValueInput()}
          </Box>
        </Box>
      </Box>
      
      {attribute && (
        <Box sx={{ mt: 2 }}>
          <Chip 
            label={`${attribute.name} ${condition.operator} ${condition.value}`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>
      )}
    </Paper>
  );
};

export default ConditionBuilder; 