import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  itemCart: [],
  price: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const product = action.payload;
      const checkProduct = state.itemCart.find(
        item => item.productId === product.productId,
      );
      if (checkProduct) {
        checkProduct.quantity += 1;
      } else {
        state.itemCart.push({...product, quantity: 1});
      }
      state.price += product.price * product.quantity;
    },
    removeProduct: (state, action) => {
      const productId = action.payload;
      const indexProduct = state.itemCart.find(
        item => item.productId === productId,
      );
      if (indexProduct) {
        state.price -= indexProduct.price * indexProduct.quantity;

        state.itemCart = state.itemCart.filter(
          item => item.productId !== action.productId,
        );
      }
    },
    updateCart: (action, state) => {
      const {productId, quantity} = action.payload;
      const item = state.itemCart.find(
        indexItem => indexItem.productId === productId,
      );
      if (item) {
        state.price = (quantity - item.quantity) * item.price;
        item.quantity = quantity;
      }
      state.itemCart = itemCart;
      state.price = price;
    },
  },
});
export const {addProduct, removeProduct, updateCart} = cartSlice.actions;
export default cartSlice.reducer;
