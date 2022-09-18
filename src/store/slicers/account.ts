import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountState {
  account: string | null;
  contract: any;
  provider: any;
  isWhiteListed: boolean;
  voteDatas: any;
  voteModalDatas: any;
}

const initialState: AccountState = {
  account: null,
  contract: null,
  provider: null,
  isWhiteListed: false,
  voteDatas: null,
  voteModalDatas: {
    index: 0,
    description: "Oylama 1 oylama 1",
    options: ["Alim", "Sahin", "Kral"],
  },
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string | null>) => {
      state.account = action.payload;
    },
    setContract: (state, action: PayloadAction<any>) => {
      state.contract = action.payload;
    },
    setProvider: (state, action: PayloadAction<any>) => {
      state.provider = action.payload;
    },
    setIsWhiteListed: (state, action: PayloadAction<boolean>) => {
      state.isWhiteListed = action.payload;
    },
    setVoteDatas: (state, action: PayloadAction<any>) => {
      state.voteDatas = action.payload;
    },
    setVoteModalData: (state, action: PayloadAction<any>) => {
      state.voteModalDatas = action.payload;
    },
  },
});

export const {
  setAccount,
  setContract,
  setProvider,
  setIsWhiteListed,
  setVoteDatas,
  setVoteModalData,
} = accountSlice.actions;
export default accountSlice.reducer;
