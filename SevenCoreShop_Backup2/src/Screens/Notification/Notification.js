import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import API__URL from '../../../config';
import Customheader from '../../CustomHeader/Customheader';
const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API__URL}/Notification/`);
        if (response.data && response.data.data) {
          const ArrayNoti = response.data.data; // Truy cập đúng trường `data`
          setNotifications(ArrayNoti); // Cập nhật state với dữ liệu
        } else {
          console.error('Dữ liệu trả về không đúng định dạng.');
          setNotifications([]); // Gán mảng trống nếu dữ liệu không hợp lệ
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Lỗi tải thông báo, vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const renderNotificationItem = ({item}) => {
    return (
      <View style={styles.notificationItem}>
        <Text style={styles.icon}>{item.icon || '🔔'}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!Array.isArray(notifications) || notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Không có thông báo nào!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Customheader title="Thông báo" />
      </View>
      <FlatList
        data={notifications || []} // Đảm bảo data là một mảng (tránh lỗi khi notifications undefined)
        keyExtractor={item => item._id} // Sử dụng `_id` làm key
        renderItem={renderNotificationItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationScreen;
