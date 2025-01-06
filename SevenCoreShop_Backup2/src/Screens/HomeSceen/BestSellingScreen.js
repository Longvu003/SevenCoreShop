import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import API__URL from "../../../config";

const TopSellingProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  // Hàm tải dữ liệu sản phẩm bán chạy
  const fetchTopSellingProducts = async () => {
    try {
      const response = await axios.get(`${API__URL}/Orders/top-order`, {
        params: { limit: 5 },
      });

      console.log("API Response:", response.data); // Kiểm tra dữ liệu trả về

      // Kiểm tra dữ liệu trả về và xử lý hợp lệ
      if (response.data && Array.isArray(response.data.data)) {
        const validProducts = response.data.data.filter(item => item != null);
        setProducts(validProducts); // Lưu dữ liệu hợp lệ vào state
      } else {
        throw new Error("Dữ liệu API không hợp lệ.");
      }
    } catch (error) {
      console.error("Error fetching top-selling products:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách sản phẩm bán chạy, vui lòng thử lại.");
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  useEffect(() => {
    fetchTopSellingProducts();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Sản Phẩm Bán Chạy</Text>

      {/* Trạng thái loading */}
      {loading ? (
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item?._id || item.id} // Kiểm tra dữ liệu item
          contentContainerStyle={styles.productListContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
  style={styles.productCard}
  onPress={() => {
    if (item && item._id) {
      const normalizedItem = {
        ...item,
        images: item.image || [], // Sử dụng `image` để tạo `images`
        description: item.description || "Không có mô tả.", // Thêm mô tả mặc định nếu thiếu
      };

      navigation.navigate("ProductDetail", { item: normalizedItem });
    } else {
      Alert.alert("Lỗi", "Dữ liệu sản phẩm không hợp lệ.");
    }
  }}
>
  {/* Hình ảnh sản phẩm */}
  <Image
    source={{
      uri: item?.image?.[0], // Sử dụng ảnh đầu tiên từ mảng `image`
    }}
    style={styles.productImage}
  />
  {/* Tên sản phẩm */}
  <Text numberOfLines={2} style={styles.productName}>
    {item?.name || "Tên sản phẩm không có"}
  </Text>
  {/* Giá sản phẩm */}
  <Text style={styles.productPrice}>
    Giá: {item?.price?.toLocaleString() || "Không có giá"} VND
  </Text>
  {/* Tổng số lượng bán */}
  <Text style={styles.productQuantity}>
    Số lượng bán: {item?.totalQuantity || 0}
  </Text>
</TouchableOpacity>

          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>Hiện không có sản phẩm bán chạy.</Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 20,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  productListContainer: {
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 10,
  },
  productPrice: {
    fontSize: 14,
    color: "#black",
    fontWeight: "bold",
    marginTop: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default TopSellingProductsScreen;
