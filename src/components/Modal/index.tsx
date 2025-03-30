import { Button, Modal, Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';

import WarningIcon from '@mui/icons-material/Warning';

interface type {
  modalType: 'success' | 'error' | 'warning' | '';
  modalMessage: string;
  handleModalClose: () => void;
  handleConfirm: () => void;
  isProcessing: boolean;
}

export function CustomModal({
  modalType,
  modalMessage,
  handleModalClose,
  handleConfirm,
  isProcessing = false,
}: type) {
  return (
    <Modal open={modalType !== ''} onClose={handleModalClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        {modalType === 'error' && (
          <ErrorIcon sx={{ fontSize: 50, mb: 2, color: 'error.main' }} />
        )}
        {modalType === 'success' && (
          <CheckCircle sx={{ fontSize: 50, mb: 2, color: 'success.main' }} />
        )}
        {modalType === 'warning' && (
          <WarningIcon sx={{ fontSize: 50, mb: 2, color: 'warning.main' }} />
        )}
        <Typography variant="h6" color={'textPrimary'}>
          {modalMessage}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent:
              modalType === 'warning' ? 'space-between' : 'center',
            mt: 3,
          }}
        >
          <Button
            onClick={handleModalClose}
            sx={{
              mt: 2,
              display: modalType === 'warning' ? 'block' : 'none',
            }}
            variant="outlined"
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={modalType === 'warning' ? handleConfirm : handleModalClose}
            sx={{
              mt: 2,
            }}
            variant="contained"
            color={'primary'}
            disabled={isProcessing}
          >
            {modalType === 'warning' ? 'Sim' : 'ok'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
