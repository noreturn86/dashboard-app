import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch NHL teams
export const fetchNhlTeams = createAsyncThunk(
  "nhlTeams/fetchNhlTeams",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/nhl/teams", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to load teams");
      }

      const data = await res.json();
      return data.nhlTeams; // array of teams
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Fetch roster for a single team
export const fetchNhlRoster = createAsyncThunk(
  "nhlTeams/fetchNhlRoster",
  async (teamCode, thunkAPI) => {
    try {
      const state = thunkAPI.getState().nhlTeams;

      // Return cached roster if available
      if (state.rosters[teamCode]) {
        return { teamCode, roster: state.rosters[teamCode] };
      }

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/nhl/roster/${teamCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to load roster");
      }

      const data = await res.json();

      // Group players by position
      const roster = {
        forwards: data.players.filter(p => ["C", "LW", "RW"].includes(p.position)),
        defencemen: data.players.filter(p => p.position === "D"),
        goalies: data.players.filter(p => p.position === "G"),
      };

      return { teamCode, roster };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const nhlTeamsSlice = createSlice({
  name: "nhlTeams",
  initialState: {
    nhlTeams: [],
    rosters: {}, // { BOS: { forwards: [...], defencemen: [...], goalies: [...] } }
    loading: false,
    error: null,
    rosterLoading: false,
    rosterError: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Teams
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
        state.error = action.payload || "Failed to fetch teams";
      })

      // Rosters
      .addCase(fetchNhlRoster.pending, state => {
        state.rosterLoading = true;
        state.rosterError = null;
      })
      .addCase(fetchNhlRoster.fulfilled, (state, action) => {
        state.rosterLoading = false;
        const { teamCode, roster } = action.payload;
        state.rosters[teamCode] = roster;
      })
      .addCase(fetchNhlRoster.rejected, (state, action) => {
        state.rosterLoading = false;
        state.rosterError = action.payload || "Failed to fetch roster";
      });
  },
});

export default nhlTeamsSlice.reducer;
