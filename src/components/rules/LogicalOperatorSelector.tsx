import React from 'react';
import { FormControl, Select, MenuItem, SelectChangeEvent, Typography, Box } from '@mui/material';
import { LogicalOperator } from '../../types';

interface LogicalOperatorSelectorProps {
  value: LogicalOperator;
  onChange: (value: LogicalOperator) => void;
  label?: string;
  disabled?: boolean;
}

const LogicalOperatorSelector: React.FC<LogicalOperatorSelectorProps> = ({
  value,
  onChange,
  label,
  disabled = false
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value as LogicalOperator);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
      {label && (
        <Typography variant="body2" sx={{ mr: 1 }}>
          {label}
        </Typography>
      )}
      <FormControl size="small" sx={{ minWidth: 80 }}>
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          disabled={disabled}
          sx={{ 
            fontWeight: 'bold',
            '& .MuiSelect-select': { 
              py: 0.5,
              color: value === 'AND' ? 'primary.main' : 'secondary.main'
            }
          }}
        >
          <MenuItem value="AND">AND</MenuItem>
          <MenuItem value="OR">OR</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LogicalOperatorSelector; 