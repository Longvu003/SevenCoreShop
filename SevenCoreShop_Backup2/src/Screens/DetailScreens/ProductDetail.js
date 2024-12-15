import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Customheader from '../../CustomHeader/Customheader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import API__URL from '../../../config';
import ProductDetailStyle from '../../StyleSheets/ProductDetailStyle';
const HEIGHT__SCREEN = Dimensions.get('screen').height;
const WIDTH__SCREEN = Dimensions.get('screen').width;

const ProductDetail = ({navigation, route}) => {
  const {item} = route.params;
  const [quantityProduct, setQuantityProduct] = useState(1);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      setCurrentUserEmail(email);
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    axios
      .get(`${API__URL}/api/comments/${item._id}`)
      .then(response => setComments(response.data))
      .catch(error => console.log('Lỗi khi lấy bình luận:', error));
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
    const getuserId = await AsyncStorage.getItem('userId');
    const userId = JSON.parse(getuserId);
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
          headers: {'Content-Type': 'application/json'},
        },
      );
      if (response.data) {
        Alert.alert('Thông báo!', 'Thêm sản phẩm thành công');
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

  const updateComment = async commentId => {
    setEditingCommentId(commentId);
    setDialogVisible(true);
  };

  const handleEditComment = async () => {
    if (!(editedText && typeof editedText === 'string' && editedText.trim())) {
      Alert.alert('Vui lòng nhập nội dung bình luận!');
      return;
    }

    try {
      const response = await axios.put(
        `${API__URL}/api/comments/updateComment`,
        {
          commentId: editingCommentId,
          newText: editedText,
        },
      );

      setComments(
        comments.map(comment =>
          comment._id === editingCommentId ? response.data : comment,
        ),
      );

      setDialogVisible(false);
      setEditedText('');
    } catch (error) {
      console.log('Lỗi khi cập nhật bình luận:', error);
      Alert.alert('Có lỗi xảy ra khi cập nhật bình luận');
    }
  };

  const deleteComment = async commentId => {
    try {
      await axios.delete(`${API__URL}/api/comments/deleteComment/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
      Alert.alert('Xóa bình luận thành công');
    } catch (error) {
      console.log('Lỗi khi xóa bình luận:', error);
      Alert.alert('Có lỗi xảy ra khi xóa bình luận');
    }
  };

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View style={{height: HEIGHT__SCREEN * 0.08}}>
        <Customheader leftIcon={require('../../../assets/imgs/back3.png')} />
      </View>

      <View style={{flex: 3}}>
        <Image
          style={ProductDetailStyle.img__product}
          source={{uri: item.images[0]}}
        />
        <Text style={ProductDetailStyle.txt__nameProduct}>{item.name}</Text>
        <Text style={ProductDetailStyle.txt__priceProduct}>{item.price}</Text>
      </View>
      <View style={{flexDirection: 'column'}}>
        <TouchableOpacity disabled style={ProductDetailStyle.btn__container}>
          <View style={ProductDetailStyle.quantity__Container}>
            <Text>Kích cỡ</Text>
          </View>
          <Text style={ProductDetailStyle.txt__nameProduct}>{item.size}</Text>
          <TouchableOpacity>
            <Image
              style={{marginHorizontal: 30}}
              source={require('../../../assets/imgs/arrowdown2.png')}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity disabled style={ProductDetailStyle.btn__container}>
          <View style={ProductDetailStyle.quantity__Container}>
            <Text>Số lượng</Text>
          </View>
          <TouchableOpacity onPress={increaseQuantity}>
            <Image
              style={ProductDetailStyle.icon}
              source={require('../../../assets/imgs/add.png')}
            />
          </TouchableOpacity>
          <Text style={{marginHorizontal: 5}}>{quantityProduct}</Text>
          <TouchableOpacity onPress={decreaseQuantity}>
            <Image
              style={ProductDetailStyle.icon}
              source={require('../../../assets/imgs/minus2.png')}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        <Text style={ProductDetailStyle.txt__description}>
          {item.description}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={ProductDetailStyle.btn__buy}
          onPress={() => addProductCart(item)}>
          <Text style={ProductDetailStyle.txt__btnbuy}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
      <View style={ProductDetailStyle.container__comment}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Bình luận</Text>
        <FlatList
          data={comments}
          scrollEnabled={false}
          keyExtractor={comment => comment._id.toString()}
          renderItem={({item}) => (
            <View style={{paddingVertical: 10}}>
              <Text style={{fontWeight: 'bold'}}>{item.userEmail}</Text>
              <Text>{item.text}</Text>
              <Text style={{color: 'gray', fontSize: 12}}>{item.date}</Text>
              {item.userEmail === currentUserEmail && (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <TouchableOpacity
                    onPress={() => updateComment(item._id)}
                    style={ProductDetailStyle.smallButton}>
                    <Text style={{color: 'blue'}}>Sửa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => deleteComment(item._id)}
                    style={ProductDetailStyle.smallButton}>
                    <Text style={{color: 'red'}}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
        <TextInput
          style={ProductDetailStyle.input__comment}
          placeholder="Nhập bình luận..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <View style={ProductDetailStyle.btnCmtContainer}>
          <TouchableOpacity
            style={ProductDetailStyle.btnCmt}
            onPress={addComment}>
            <Text style={ProductDetailStyle.btnCmtText}>Gửi bình luận</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Chỉnh sửa bình luận</Dialog.Title>
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
