import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { ConnectedDevice, SyncConflict, SyncStatus } from '../types';

const SyncContainer = styled.div<{ theme: any }>`
  width: 100%;
  height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  padding: 20px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SyncStatusCard = styled(motion.div)<{ theme: any; status: SyncStatus['status'] }>`
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => 
    props.status === 'synced' ? '#4CAF50' :
    props.status === 'syncing' ? '#FF9800' :
    props.status === 'conflict' ? '#F44336' :
    props.status === 'error' ? '#F44336' :
    '#607D8B'
  };
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatusIcon = styled.div<{ status: SyncStatus['status'] }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => 
    props.status === 'synced' ? '#4CAF50' :
    props.status === 'syncing' ? '#FF9800' :
    props.status === 'conflict' ? '#F44336' :
    props.status === 'error' ? '#F44336' :
    '#607D8B'
  };
  ${props => props.status === 'syncing' && 'animation: pulse 1.5s infinite;'}

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.2); }
  }
`;

const StatusText = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const ProgressContainer = styled.div`
  margin: 16px 0;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #2196F3);
    transition: width 0.3s ease;
  }
`;

const DevicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const DeviceCard = styled(motion.div)<{ theme: any; connected: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => props.connected ? '#4CAF50' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
`;

const DeviceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const DeviceInfo = styled.div`
  flex: 1;
`;

const DeviceName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
`;

const DeviceType = styled.span<{ type: string }>`
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => 
    props.type === 'desktop' ? '#2196F3' :
    props.type === 'mobile' ? '#4CAF50' :
    props.type === 'tablet' ? '#FF9800' :
    props.type === 'watch' ? '#9C27B0' :
    '#607D8B'
  };
  color: white;
  text-transform: capitalize;
`;

const DeviceDetails = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 12px 0;
`;

const LastSeen = styled.div`
  font-size: 0.8rem;
  opacity: 0.6;
`;

const ConflictSection = styled.div`
  margin-top: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ConflictCard = styled(motion.div)<{ theme: any }>`
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const ConflictTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #F44336;
`;

const ConflictDescription = styled.p`
  font-size: 0.9rem;
  margin: 0 0 16px 0;
  opacity: 0.8;
  line-height: 1.4;
`;

const ResolutionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ResolutionButton = styled(motion.button)<{ theme: any; variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.variant === 'primary' ? props.theme.accentColor : 'rgba(255, 255, 255, 0.3)'};
  background: ${props => props.variant === 'primary' ? props.theme.accentColor : 'transparent'};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.textColor};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const ActionButton = styled(motion.button)<{ theme: any; variant?: 'primary' | 'danger' }>`
  padding: 12px 24px;
  border: 1px solid ${props => props.variant === 'danger' ? '#F44336' : props.theme.accentColor};
  background: ${props => props.variant === 'danger' ? '#F44336' : props.theme.accentColor};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const CrossDeviceSyncManager: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    status: 'synced',
    progress: 100,
    pendingChanges: 0,
    bandwidth: 'high'
  });
  
  const [devices, setDevices] = useState<ConnectedDevice[]>([
    {
      id: 'device-1',
      name: 'MacBook Pro',
      type: 'desktop',
      platform: 'macOS 14.0',
      lastSeen: Date.now() - 300000, // 5 minutes ago
      syncEnabled: true,
      capabilities: [
        { feature: 'full_sync', supported: true },
        { feature: 'real_time', supported: true },
        { feature: 'offline_mode', supported: true }
      ],
      version: '2.0.0'
    },
    {
      id: 'device-2',
      name: 'iPhone 15 Pro',
      type: 'mobile',
      platform: 'iOS 17.0',
      lastSeen: Date.now() - 600000, // 10 minutes ago
      syncEnabled: true,
      capabilities: [
        { feature: 'full_sync', supported: true },
        { feature: 'real_time', supported: true },
        { feature: 'offline_mode', supported: false }
      ],
      version: '2.0.0'
    },
    {
      id: 'device-3',
      name: 'iPad Air',
      type: 'tablet',
      platform: 'iPadOS 17.0',
      lastSeen: Date.now() - 86400000, // 1 day ago
      syncEnabled: false,
      capabilities: [
        { feature: 'full_sync', supported: true },
        { feature: 'real_time', supported: false },
        { feature: 'offline_mode', supported: true }
      ],
      version: '1.9.5'
    }
  ]);

  const [conflicts, setConflicts] = useState<SyncConflict[]>([
    {
      id: 'conflict-1',
      type: 'settings',
      description: 'Timer settings differ between MacBook Pro and iPhone',
      devices: ['MacBook Pro', 'iPhone 15 Pro'],
      resolution: 'manual',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      resolved: false
    },
    {
      id: 'conflict-2',
      type: 'data',
      description: 'Mood entries have conflicting timestamps',
      devices: ['iPhone 15 Pro', 'iPad Air'],
      resolution: 'latest',
      timestamp: Date.now() - 3600000, // 1 hour ago
      resolved: false
    }
  ]);

  const handleSyncNow = async () => {
    setSyncStatus(prev => ({ ...prev, status: 'syncing', progress: 0 }));
    
    // Simulate sync progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setSyncStatus(prev => ({ ...prev, progress: i }));
    }
    
    setSyncStatus(prev => ({ 
      ...prev, 
      status: 'synced', 
      progress: 100,
      pendingChanges: 0
    }));

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `notification-${Date.now()}`,
        type: 'success',
        title: 'Sync Complete',
        message: 'All devices have been synchronized successfully',
        timestamp: Date.now(),
        read: false
      }
    });
  };

  const handleResolveConflict = (conflictId: string, resolution: 'latest' | 'merge' | 'manual') => {
    setConflicts(prev => prev.map(conflict => 
      conflict.id === conflictId 
        ? { ...conflict, resolution, resolved: true }
        : conflict
    ));

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `notification-${Date.now()}`,
        type: 'success',
        title: 'Conflict Resolved',
        message: `Conflict resolved using ${resolution} strategy`,
        timestamp: Date.now(),
        read: false
      }
    });
  };

  const handleToggleDeviceSync = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, syncEnabled: !device.syncEnabled }
        : device
    ));
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(device => device.id !== deviceId));
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `notification-${Date.now()}`,
        type: 'info',
        title: 'Device Removed',
        message: 'Device has been removed from sync',
        timestamp: Date.now(),
        read: false
      }
    });
  };

  const formatLastSeen = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getStatusMessage = (): string => {
    switch (syncStatus.status) {
      case 'synced': return 'All devices synchronized';
      case 'syncing': return 'Synchronizing devices...';
      case 'conflict': return 'Sync conflicts detected';
      case 'error': return 'Sync error occurred';
      case 'offline': return 'Offline mode';
      default: return 'Unknown status';
    }
  };

  return (
    <SyncContainer theme={state.currentTheme}>
      <Header>
        <Title>🔄 Cross-Device Sync</Title>
        <ActionButton
          theme={state.currentTheme}
          onClick={handleSyncNow}
          disabled={syncStatus.status === 'syncing'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {syncStatus.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
        </ActionButton>
      </Header>

      {/* Sync Status */}
      <SyncStatusCard
        theme={state.currentTheme}
        status={syncStatus.status}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <StatusHeader>
          <StatusIcon status={syncStatus.status} />
          <StatusText>{getStatusMessage()}</StatusText>
        </StatusHeader>
        
        {syncStatus.status === 'syncing' && (
          <ProgressContainer>
            <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
              Syncing... {syncStatus.progress}%
            </div>
            <ProgressBar progress={syncStatus.progress} />
          </ProgressContainer>
        )}

        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Last sync: {formatLastSeen(Date.now() - 300000)} • 
          Pending changes: {syncStatus.pendingChanges} • 
          Bandwidth: {syncStatus.bandwidth}
        </div>
      </SyncStatusCard>

      {/* Connected Devices */}
      <SectionTitle>📱 Connected Devices</SectionTitle>
      <DevicesGrid>
        <AnimatePresence>
          {devices.map((device, index) => (
            <DeviceCard
              key={device.id}
              theme={state.currentTheme}
              connected={device.syncEnabled}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <DeviceHeader>
                <DeviceInfo>
                  <DeviceName>{device.name}</DeviceName>
                  <DeviceType type={device.type}>{device.type}</DeviceType>
                </DeviceInfo>
              </DeviceHeader>

              <DeviceDetails>
                <div>Platform: {device.platform}</div>
                <div>Version: {device.version}</div>
                <div>
                  Capabilities: {device.capabilities.filter(c => c.supported).length}/
                  {device.capabilities.length} supported
                </div>
              </DeviceDetails>

              <LastSeen>Last seen: {formatLastSeen(device.lastSeen)}</LastSeen>

              <ResolutionButtons style={{ marginTop: '16px' }}>
                <ResolutionButton
                  theme={state.currentTheme}
                  variant={device.syncEnabled ? 'secondary' : 'primary'}
                  onClick={() => handleToggleDeviceSync(device.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {device.syncEnabled ? 'Disable Sync' : 'Enable Sync'}
                </ResolutionButton>
                <ResolutionButton
                  theme={state.currentTheme}
                  onClick={() => handleRemoveDevice(device.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Remove
                </ResolutionButton>
              </ResolutionButtons>
            </DeviceCard>
          ))}
        </AnimatePresence>
      </DevicesGrid>

      {/* Sync Conflicts */}
      {conflicts.filter(c => !c.resolved).length > 0 && (
        <ConflictSection>
          <SectionTitle>⚠️ Sync Conflicts</SectionTitle>
          <AnimatePresence>
            {conflicts.filter(c => !c.resolved).map((conflict, index) => (
              <ConflictCard
                key={conflict.id}
                theme={state.currentTheme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <ConflictTitle>
                  {conflict.type.charAt(0).toUpperCase() + conflict.type.slice(1)} Conflict
                </ConflictTitle>
                <ConflictDescription>{conflict.description}</ConflictDescription>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '16px' }}>
                  Devices: {conflict.devices.join(', ')} • 
                  {formatLastSeen(conflict.timestamp)}
                </div>
                
                <ResolutionButtons>
                  <ResolutionButton
                    theme={state.currentTheme}
                    variant="primary"
                    onClick={() => handleResolveConflict(conflict.id, 'latest')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Use Latest
                  </ResolutionButton>
                  <ResolutionButton
                    theme={state.currentTheme}
                    onClick={() => handleResolveConflict(conflict.id, 'merge')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Merge Data
                  </ResolutionButton>
                  <ResolutionButton
                    theme={state.currentTheme}
                    onClick={() => handleResolveConflict(conflict.id, 'manual')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Manual Review
                  </ResolutionButton>
                </ResolutionButtons>
              </ConflictCard>
            ))}
          </AnimatePresence>
        </ConflictSection>
      )}
    </SyncContainer>
  );
};

export default CrossDeviceSyncManager; 