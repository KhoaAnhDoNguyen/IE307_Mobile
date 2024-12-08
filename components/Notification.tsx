import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
}

const notificationsData: Notification[] = [
  { id: 1, title: 'Welcome!', message: 'Thank you for joining our platform.', read: false },
  { id: 2, title: 'New Movie Released', message: 'Check out the latest movies now!', read: false },
  { id: 3, title: 'Promotion!', message: 'Get 50% off your next ticket.', read: true },
  { id: 4, title: 'Update Available', message: 'New features have been added to the app!', read: false },
  { id: 5, title: 'Feedback Requested', message: 'We would love to hear your thoughts!', read: true },
  { id: 6, title: 'Weekly Top Picks', message: 'Don’t miss out on this week’s top movies.', read: false },
  { id: 7, title: 'Reminder', message: 'Your subscription will expire soon.', read: false },
];

interface NotificationProps {
  visible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => markAsRead(item.id)}
      style={[styles.notificationItem, item.read ? styles.read : styles.unread]}
    >
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.notificationContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    width: '90%',
    backgroundColor: '#1e1e2f',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#f4f4f8',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationItem: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  unread: {
    backgroundColor: '#29293d',
    borderColor: '#4f4fad',
  },
  read: {
    backgroundColor: '#39395a',
    borderColor: '#6f6f9a',
  },
  notificationTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    color: '#b3b3d1',
    fontSize: 14,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#4f4fad',
    borderRadius: 8,
  },
});

export default Notification;
