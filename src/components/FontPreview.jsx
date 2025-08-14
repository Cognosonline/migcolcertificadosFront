import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { FontCategories } from '../utils/FontFamilies';

const FontPreview = ({ selectedFont, text = "Ejemplo de Texto" }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mt: 1,
        maxWidth: 300,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: '1px solid #e0e0e0',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: '#666',
          fontWeight: 600,
          mb: 1,
          display: 'block',
        }}
      >
        Vista previa: {selectedFont}
      </Typography>
      
      <Box
        sx={{
          p: 2,
          background: '#ffffff',
          borderRadius: 1,
          border: '1px solid #ddd',
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: selectedFont,
            fontSize: '18px',
            color: '#333',
            lineHeight: 1.4,
          }}
        >
          {text}
        </Typography>
        
        <Typography
          sx={{
            fontFamily: selectedFont,
            fontSize: '14px',
            color: '#666',
            mt: 1,
            fontStyle: 'italic',
          }}
        >
          {text} (cursiva)
        </Typography>
        
        <Typography
          sx={{
            fontFamily: selectedFont,
            fontSize: '16px',
            color: '#333',
            mt: 1,
            fontWeight: 700,
          }}
        >
          {text} (negrita)
        </Typography>
      </Box>
    </Paper>
  );
};

export default FontPreview;
