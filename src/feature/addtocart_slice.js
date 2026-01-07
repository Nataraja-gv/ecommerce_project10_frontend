import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.product === product);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
    increaseQuantity: (state, action) => {
      const { product } = action.payload;

      const item = state.items.find((item) => item.product === product);

      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const { product } = action.payload;
      const item = state.items.find((item) => item.product === product);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.product !== product);
        }
      }
    },
    removeItem: (state, action) => {
      const product = action.payload;

      state.items = state.items.filter((item) => item.product !== product);
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
