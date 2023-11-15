import { createSlice } from "@reduxjs/toolkit";

import nProgress from "nprogress";

const initialState = {
  isLoading: nProgress.isStarted(),
  messages: [],
};

const CommonSlice = createSlice({
  name: "CommonSlice",
  initialState,
  reducers: {
    startLoading: (state, action) => {},
    removeSession: (state, action) => {},
  },
  extraReducers(builder) {},
});

export const {} = CommonSlice.actions;
export default CommonSlice.reducer;
