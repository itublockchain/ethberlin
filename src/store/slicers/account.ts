import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountState {
  account: any;
  contract: any;
  provider: any;
}

const initialState: AccountState = {
  account: null,
  contract: null,
  provider: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<any>) => {
      state.account = action.payload;
    },
    setContract: (state, action: PayloadAction<any>) => {
      state.contract = action.payload;
    },
    setProvider: (state, action: PayloadAction<any>) => {
      state.provider = action.payload;
    },

  },
});

export const {
  setAccount,
  setContract,
  setProvider,
} = accountSlice.actions;
export default accountSlice.reducer;
