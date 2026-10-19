
import { createSlice } from '@reduxjs/toolkit';

const savedItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const initialState = {
  items: savedItems,
  totalQuantity: savedItems.reduce(
    (total, item) => total + item.quantity,
    0
  ),
  totalAmount: savedItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  ),
};

const createCartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(
        item => item.id === (newItem.id || newItem._id)
      );

      state.totalQuantity++;
      state.totalAmount += Number(newItem.price);

      if (!existingItem) {
        state.items.push({
          id: newItem.id || newItem._id,
          name: newItem.name,
          price: Number(newItem.price),
          quantity: 1,
          totalPrice: Number(newItem.price),
          imageUrl: newItem.imageUrl
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += Number(newItem.price);
      }

      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (!existingItem) return;

      state.totalQuantity--;
      state.totalAmount -= existingItem.price;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
      }

      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cartItems');
    }
  }
});

export const { addItemToCart, removeItemFromCart, clearCart } =
  createCartSlice.actions;

export default createCartSlice.reducer;
