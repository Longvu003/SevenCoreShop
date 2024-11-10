import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  FlatList
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Customheader from '../../CustomHeader/Customheader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import API__URL from '../../../config';

const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;

const ProductDetail = ({ navigation, route }) => {
  const { item } = route.params;
  const [quantityProduct, setQuantityProduct] = useState(1);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState('');

  // Fetch comments for the product
  useEffect(() => {
    axios
      .get(`${API__URL}/api/comments/${item._id}`)
      .then(response => setComments(response.data))
      .catch(error => console.error('Lỗi khi lấy bình luận:', error));
  }, [item._id]);

  const increaseQuantity = () => {
    setQuantityProduct(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantityProduct > 1) {
      setQuantityProduct(prev => prev - 1);
    } else {
      Alert.alert('Sản phẩm không được dưới 1');
    }
  };

  const addProductCart = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const product = {
      userId,
      productId: item._id,
      images: item.images[0],
      nameProduct: item.name,
      quantity: quantityProduct,
      price: item.price,
    };
    try {
      const response = await axios.post(
        `${API__URL}/carts/addItemcart`,
        product,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (response.data) {
        Alert.alert('Thêm sản phẩm thành công');
      }
    } catch (error) {
      console.log('Lỗi:', error);
    }
  };

  const addComment = async () => {
    if (newComment.trim()) {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        if (!userEmail) {
          Alert.alert('Vui lòng đăng nhập trước khi bình luận');
          return;
        }

        const response = await axios.post(`${API__URL}/api/comments`, {
          commentText: newComment,
          productId: item._id,
          userEmail,
        });

        setComments([...comments, response.data]);
        setNewComment('');
      } catch (error) {
        console.log('Lỗi khi thêm bình luận', error);
        Alert.alert('Có lỗi xảy ra, vui lòng thử lại!');
      }
    } else {
      Alert.alert('Vui lòng nhập nội dung bình luận');
    }
  };

  // Khi nhấn vào nút chỉnh sửa bình luận
const updateComment = async (commentId) => {
  setEditingCommentId(commentId);
  setDialogVisible(true);
};

// Khi người dùng nhấn nút lưu để chỉnh sửa bình luận
const handleEditComment = async () => {
  if (!(editedText && typeof editedText === 'string' && editedText.trim())) {
    Alert.alert('Vui lòng nhập nội dung bình luận!');
    return;
  }

  try {
    // Gửi yêu cầu PUT đến API để cập nhật bình luận
    const response = await axios.put(`${API__URL}/api/comments/updateComment`, {
      commentId: editingCommentId,  // Truyền commentId cần cập nhật
      newText: editedText,  // Thay đổi từ newText thành editedText
    });

    // Cập nhật lại danh sách bình luận sau khi thành công
    setComments(comments.map((comment) =>
      comment._id === editingCommentId ? response.data : comment // Thay thế bình luận đã chỉnh sửa
    ));

    // Đóng dialog và reset lại text
    setDialogVisible(false);
    setEditedText('');  // Đảm bảo rằng bạn reset lại editedText sau khi chỉnh sửa xong
  } catch (error) {
    console.error('Lỗi khi cập nhật bình luận:', error);
    Alert.alert('Có lỗi xảy ra khi cập nhật bình luận');
  }
};

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`${API__URL}/api/comments/deleteComment/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
      Alert.alert('Xóa bình luận thành công');
    } catch (error) {
      console.error('Lỗi khi xóa bình luận:', error);
      Alert.alert('Có lỗi xảy ra khi xóa bình luận');
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Customheader leftIcon={require('../../../assets/imgs/back3.png')} />
      </View>

      <View style={{ flex: 6 }}>
        <Image style={styles.img__product} source={{ uri: item.images[0] }} />
        <Text style={styles.txt__nameProduct}>{item.name}</Text>
        <Text style={styles.txt__priceProduct}>{item.price}</Text>

        <View style={{ flexDirection: 'column', flex: 2 }}>
          <TouchableOpacity disabled style={styles.btn__container}>
            <View style={styles.quantity__Container}>
              <Text>Kích cỡ</Text>
            </View>
            <Text style={styles.txt__nameProduct}>{item.size}</Text>
            <TouchableOpacity>
              <Image
                style={{ marginHorizontal: 30 }}
                source={require('../../../assets/imgs/arrowdown2.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity disabled style={styles.btn__container}>
            <View style={styles.quantity__Container}>
              <Text>Số lượng</Text>
            </View>
            <TouchableOpacity onPress={increaseQuantity}>
              <Image
                style={styles.icon}
                source={require('../../../assets/imgs/add.png')}
              />
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 5 }}>{quantityProduct}</Text>
            <TouchableOpacity onPress={decreaseQuantity}>
              <Image
                style={styles.icon}
                source={require('../../../assets/imgs/minus2.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.txt__description}>{item.description}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.btn__buy} onPress={addProductCart}>
          <Text style={styles.txt__btnbuy}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>

      {/* Phần bình luận */}
      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Bình luận</Text>
        <FlatList
          data={comments}
          keyExtractor={(comment) => comment._id.toString()}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 10 }}>
              <Text>{item.text}</Text>
              <Text style={{ color: 'gray', fontSize: 12 }}>{item.date}</Text>
              <TouchableOpacity onPress={() => updateComment(item._id)}>
                <Text style={{ color: 'blue' }}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteComment(item._id)}>
                <Text style={{ color: 'red' }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TextInput
          style={{ borderColor: 'gray', borderWidth: 1, padding: 10, marginVertical: 10 }}
          placeholder="Nhập bình luận..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <View style={styles.btnCmtContainer}>
          <TouchableOpacity style={styles.btnCmt} onPress={addComment}>
            <Text style={styles.btnCmtText}>Gửi bình luận</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dialog for editing comment */}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Sửa bình luận</Dialog.Title>
        <Dialog.Input
          placeholder="Nhập nội dung mới"
          value={editedText}
          onChangeText={setEditedText}
        />
        <Dialog.Button label="Hủy" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Lưu" onPress={handleEditComment} />
      </Dialog.Container>
    </ScrollView>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  txt__description: {
    marginVertical: 20,
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 20,
  },
  txt__btnbuy: {
    fontSize: 15,
    color: 'white',
  },
  btn__buy: {
    width: WIDTH__SCREEN * 1,
    height: HEIGHT__SCREEN * 0.08,
    backgroundColor: 'black',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
  },
  quantity__Container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  btn__container: {
    height: HEIGHT__SCREEN * 0.08,
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnCmtContainer: {
    marginTop: 10,
  },
  btnCmt: {
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  btnCmtText: {
    color: 'white',
    fontSize: 16,
  },
  img__product: {
    width: WIDTH__SCREEN,
    height: HEIGHT__SCREEN * 0.4,
  },
  txt__nameProduct: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  txt__priceProduct: {
    fontSize: 18,
    textAlign: 'center',
    color: 'green',
    paddingVertical: 10,
  },
});

