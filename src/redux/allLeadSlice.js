import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchAllLead = createAsyncThunk(
  "lead/fetchAllLead",
  async (_, { rejectWithValue }) => {
    try {
         const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/leads/get-leads`,  {},

        {
          headers:  {
             Authorization: `Bearer ${token}`,
          }
        },
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const leadSlice = createSlice({
  name: "lead",
  initialState: {
    allLeads: [],
    loading: false,
    error: null,
  },
  reducers: {
    removeLead: ( state , action) => {
      state.allLeads = state.allLeads.filter(
        (lead) => lead._id !== action.payload,
      );
    },
  },

  extraReducers:(builder) => {
    builder
    .addCase(fetchAllLead.pending , (state , action) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchAllLead.fulfilled , (state , action) => {
        state.loading = false;
        state.allLeads = action.payload;

    })
    .addCase(fetchAllLead.rejected , (state ,action )=> {
        state.loading = false;
        state.error = action.payload;
    })
  }
});

export const {removeLead} = leadSlice.actions;
export default leadSlice.reducer;   