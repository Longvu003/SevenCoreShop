import {configureStore} from '@reduxjs/toolkit';
import CartSlice from '../ReduxTookit/Cartslice';
const store = configureStore({
  reducer: {
    Cart: CartSlice,
  },
});

export default store;
