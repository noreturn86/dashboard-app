import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch standings from backend (array of teams)
export const fetchNhlTeams = createAsyncThunk(
  "nhlTeams/fetchNhlTeams",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/api/nhl/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to load teams");
      }

      const data = await res.json();
      return data.nhlTeams; //array of teams
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const nhlTeamsSlice = createSlice({
  name: "nhlTeams",
  initialState: {
    nhlTeams: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchNhlTeams.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNhlTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.nhlTeams = action.payload;
      })
      .addCase(fetchNhlTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch standings";
      });
  },
});

export default nhlTeamsSlice.reducer;
