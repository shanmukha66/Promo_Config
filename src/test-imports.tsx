import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

const TestImports: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={null}
        onChange={(date) => {}}
        renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
      />
    </LocalizationProvider>
  );
};

export default TestImports; 