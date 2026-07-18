import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_API_URL;


export const fetchTeamList = createAsyncThunk(
  "team/fetchTeamList",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/team/all-team`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return rejectWithValue(result.message || "failed to fetch team member");
      }
      console.log("team member come in reducer", result.data);
     return result.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const teamSlice = createSlice({
  name: "team",
  initialState: {
    teamList: [],
    loading: false,
    error: null,
  },
  reducers: {
 removeteamMember: (state, action) => {
  state.teamList = state.teamList.filter(
    (member) => member._id !== action.payload
  );
},
  },

  extraReducers: (builder) => {
    builder
    .addCase(fetchTeamList.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchTeamList.fulfilled , (state , action) => {
        state.loading=false;
        state.teamList= action.payload;
    })
    .addCase(fetchTeamList.rejected , (state, action ) =>{
     state.loading = false;
        state.error = action.payload;
    })
  },
});


export const {removeteamMember} = teamSlice.actions;
export default teamSlice.reducer