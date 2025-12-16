import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: []
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction(state, action) {
      state.list.push({
        id: Date.now(),
        ...action.payload,
      });
    },

    deleteTransaction(state, action) {
      state.list = state.list.filter((t) => t.id !== action.payload);
    }
  },
});

export const { addTransaction, deleteTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
