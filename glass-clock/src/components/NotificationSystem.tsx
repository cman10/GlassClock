import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { AppNotification } from '../types';

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  pointer-events: none;
  max-width: 400px;
`;

const NotificationCard = styled(motion.div)<{ theme: any; type: string }>`
  background: ${props => 
    props.type === 'error' ? '#fef2f2' :
    props.type === 'success' ? '#f0fdf4' :
    props.type === 'warning' ? '#fffbeb' :
    props.type === 'premium' ? '#fdf2f8' :
    'rgba(255, 255, 255, 0.95)'
  };
  border-left: 4px solid ${props => 
    props.type === 'error' ? '#ef4444' :
    props.type === 'success' ? '#22c55e' :
    props.type === 'warning' ? '#f59e0b' :
    props.type === 'premium' ? '#ec4899' :
    props.theme.accentColor
  };
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  pointer-events: auto;
  max-width: 100%;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const NotificationIcon = styled.div<{ type: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 0.9rem;
  background: ${props => 
    props.type === 'error' ? '#ef4444' :
    props.type === 'success' ? '#22c55e' :
    props.type === 'warning' ? '#f59e0b' :
    props.type === 'premium' ? '#ec4899' :
    '#3b82f6'
  };
  color: white;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.h4<{ type: string }>`
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: ${props => 
    props.type === 'error' ? '#dc2626' :
    props.type === 'success' ? '#16a34a' :
    props.type === 'warning' ? '#d97706' :
    props.type === 'premium' ? '#be185d' :
    '#1f2937'
  };
`;

const NotificationMessage = styled.p<{ type: string }>`
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
  color: ${props => 
    props.type === 'error' ? '#7f1d1d' :
    props.type === 'success' ? '#14532d' :
    props.type === 'warning' ? '#92400e' :
    props.type === 'premium' ? '#831843' :
    '#4b5563'
  };
`;

const CloseButton = styled.button<{ type: string }>`
  background: none;
  border: none;
  color: ${props => 
    props.type === 'error' ? '#dc2626' :
    props.type === 'success' ? '#16a34a' :
    props.type === 'warning' ? '#d97706' :
    props.type === 'premium' ? '#be185d' :
    '#6b7280'
  };
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const ActionContainer = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
`;

const ActionButton = styled(motion.button)<{ type: string; variant?: 'primary' | 'secondary' }>`
  background: ${props => 
    props.variant === 'primary' ? (
      props.type === 'error' ? '#ef4444' :
      props.type === 'success' ? '#22c55e' :
      props.type === 'warning' ? '#f59e0b' :
      props.type === 'premium' ? '#ec4899' :
      '#3b82f6'
    ) : 'transparent'
  };
  color: ${props => 
    props.variant === 'primary' ? 'white' : (
      props.type === 'error' ? '#dc2626' :
      props.type === 'success' ? '#16a34a' :
      props.type === 'warning' ? '#d97706' :
      props.type === 'premium' ? '#be185d' :
      '#3b82f6'
    )
  };
  border: 1px solid ${props => 
    props.type === 'error' ? '#ef4444' :
    props.type === 'success' ? '#22c55e' :
    props.type === 'warning' ? '#f59e0b' :
    props.type === 'premium' ? '#ec4899' :
    '#3b82f6'
  };
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => 
      props.type === 'error' ? '#ef4444' :
      props.type === 'success' ? '#22c55e' :
      props.type === 'warning' ? '#f59e0b' :
      props.type === 'premium' ? '#ec4899' :
      '#3b82f6'
    };
    color: white;
  }
`;

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '✕';
    case 'warning': return '⚠';
    case 'premium': return '⭐';
    default: return 'ℹ';
  }
};

interface NotificationItemProps {
  notification: AppNotification;
  onDismiss: (id: string) => void;
  onAction: (notification: AppNotification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss, onAction }) => {
  return (
    <NotificationCard
      theme={{ accentColor: '#3b82f6' }}
      type={notification.type}
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      layout
    >
      <NotificationHeader>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <NotificationIcon type={notification.type}>
            {getNotificationIcon(notification.type)}
          </NotificationIcon>
          <NotificationContent>
            <NotificationTitle type={notification.type}>
              {notification.title}
            </NotificationTitle>
            <NotificationMessage type={notification.type}>
              {notification.message}
            </NotificationMessage>
          </NotificationContent>
        </div>
        <CloseButton 
          type={notification.type}
          onClick={() => onDismiss(notification.id)}
        >
          ×
        </CloseButton>
      </NotificationHeader>

      {notification.action && (
        <ActionContainer>
          <ActionButton
            type={notification.type}
            variant="primary"
            onClick={() => onAction(notification)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {notification.action.label}
          </ActionButton>
          <ActionButton
            type={notification.type}
            variant="secondary"
            onClick={() => onDismiss(notification.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Dismiss
          </ActionButton>
        </ActionContainer>
      )}
    </NotificationCard>
  );
};

export const NotificationSystem: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const handleDismiss = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const handleAction = (notification: AppNotification) => {
    if (notification.action) {
      switch (notification.action.type) {
        case 'navigate':
          if (notification.action.payload === 'premium') {
            dispatch({ type: 'SET_CURRENT_VIEW', payload: 'premium' });
          } else if (notification.action.payload) {
            dispatch({ type: 'SET_CURRENT_VIEW', payload: notification.action.payload });
          }
          break;
        case 'dismiss':
          handleDismiss(notification.id);
          break;
        case 'upgrade':
          dispatch({ type: 'SET_CURRENT_VIEW', payload: 'premium' });
          break;
      }
    }
    handleDismiss(notification.id);
  };

  // Auto-dismiss notifications after 5 seconds (except premium ones)
  React.useEffect(() => {
    const timers: { [key: string]: NodeJS.Timeout } = {};

    state.notifications.forEach(notification => {
      if (!notification.read && notification.type !== 'premium') {
        timers[notification.id] = setTimeout(() => {
          handleDismiss(notification.id);
        }, 5000);
      }
    });

    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, [state.notifications]);

  // Only show unread notifications
  const visibleNotifications = state.notifications.filter(n => !n.read);

  return (
    <NotificationContainer>
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={handleDismiss}
            onAction={handleAction}
          />
        ))}
      </AnimatePresence>
    </NotificationContainer>
  );
};