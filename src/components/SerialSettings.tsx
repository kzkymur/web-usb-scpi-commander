import { useSerialStore } from '../store/serialStore';
import { Button, TextField, Box, Typography } from '@mui/material';

const SerialSettings = () => {
  const { port, baudRate, isConnected, connect, disconnect, setBaudRate } = useSerialStore();

  const handleConnect = async () => {
    try {
      await connect(baudRate);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Serial Settings
      </Typography>
      
      {!isConnected ? (
        <Button 
          variant="contained" 
          onClick={handleConnect}
          fullWidth
        >
          Select Serial Device
        </Button>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Connected to: {port?.getInfo().usbProductId || 'Unknown device'}
          </Typography>
          
          <TextField
            label="Baud Rate"
            type="number"
            value={baudRate}
            onChange={(e) => setBaudRate(Number(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
          />
          
          <Button 
            variant="outlined" 
            onClick={disconnect}
            fullWidth
          >
            Disconnect
          </Button>
        </>
      )}
    </Box>
  );
};

export default SerialSettings;