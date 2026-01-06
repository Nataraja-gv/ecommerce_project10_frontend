import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../feature/user-slice";
import cartSlice from "../feature/addtocart_slice";

const store = configureStore({
  reducer: {
    user: userSlice,
    cartItem: cartSlice,
  },
});
export default store;
