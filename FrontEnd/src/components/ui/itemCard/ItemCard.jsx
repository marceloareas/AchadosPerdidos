import React, { useState } from "react";
import { Card, CardContent, CardHeader, Typography, Box, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Badge from "../badge/Bagde";

const ItemCard = ({
  itemType,         
  category,         
  title,            
  location,         
  personName,       
  description,      
  showDescription = true, 
  showOptions = false,    
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const previewDescription = description?.length > 100 
    ? description.substring(0, 100) + "..."
    : description;

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        boxShadow: 2,
        transition: "0.2s",
        "&:hover": { boxShadow: 6 },
        minHeight: 0,
        '& .MuiCardHeader-root': { py: 1, px: 2 },       // menos padding no header
        '& .MuiCardContent-root': { py: 1, px: 2 },      // menos padding no conteúdo
      }}
    >
      <CardHeader
        title={
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                {title}
              </Typography>
              <Badge badgeType="item" type={itemType} label={
                itemType === "PERDIDO" ? "Item Perdido" :
                itemType === "ACHADO" ? "Item Encontrado" :
                "Item Devolvido"
              } />
            </Box>

            <Box>
              <Badge badgeType="category" label={category} />
            </Box>
          </Box>
        }
        action={
          showOptions && (
            <>
              <IconButton onClick={handleMenuOpen} size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuClose}>Visualizar</MenuItem>
                <MenuItem onClick={handleMenuClose}>Editar</MenuItem>
                <MenuItem onClick={handleMenuClose}>Excluir</MenuItem>
              </Menu>
            </>
          )
        }
      />

      <CardContent>
        {personName && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Por: {personName}
          </Typography>
        )}
        {location && (
          <Box display="flex" alignItems="center" gap={0.5} mb={showDescription && description ? 1 : 0}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {location}
            </Typography>
          </Box>
        )}
        {showDescription && description && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {previewDescription}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemCard;
