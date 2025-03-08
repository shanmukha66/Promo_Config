import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { usePromotionStore } from '../store/promotionStore';

const PromotionsList: React.FC = () => {
  const { promotions, fetchPromotions, deletePromotion, isLoading } = usePromotionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  // Filter promotions based on search term
  const filteredPromotions = promotions.filter(promotion => 
    promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (id: string) => {
    setPromotionToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPromotionToDelete(null);
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    if (promotionToDelete) {
      await deletePromotion(promotionToDelete);
      handleCloseDeleteDialog();
    }
  };

  // Check if a promotion uses OR conditions
  const hasOrConditions = (promotionId: string) => {
    const promotion = promotions.find(p => p.id === promotionId);
    if (!promotion) return false;
    
    return promotion.rules.some(rule => 
      rule.operator === 'OR' || rule.ruleGroups.some(group => group.operator === 'OR')
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Promotions
        </Typography>
        
        <Button
          component={RouterLink}
          to="/promotions/create"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create Promotion
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search promotions..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Tooltip title="Filter options">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Valid Period</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Conditions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Loading promotions...</TableCell>
                </TableRow>
              ) : filteredPromotions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No promotions found</TableCell>
                </TableRow>
              ) : (
                filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {promotion.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {promotion.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {promotion.discountType === 'percentage' ? `${promotion.discountValue}%` : 
                       promotion.discountType === 'fixed' ? `$${promotion.discountValue}` : 'BOGO'}
                    </TableCell>
                    <TableCell>
                      {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={promotion.isActive ? 'Active' : 'Inactive'} 
                        color={promotion.isActive ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {hasOrConditions(promotion.id) ? (
                        <Chip 
                          label="OR Conditions" 
                          color="secondary" 
                          size="small" 
                        />
                      ) : (
                        <Chip 
                          label="AND Conditions" 
                          color="primary" 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton 
                          component={RouterLink} 
                          to={`/promotions/view/${promotion.id}`}
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          component={RouterLink} 
                          to={`/promotions/edit/${promotion.id}`}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => handleOpenDeleteDialog(promotion.id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this promotion? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PromotionsList; 