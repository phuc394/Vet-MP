import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import petService from "../../services/pet.service";
import { CreatePetPayload, Pet } from "../../types/pet.type";

interface PetState {
  pets: Pet[];
  loading: boolean;
  creating: boolean;
  error: string | null;
  createError: string | null;
}

const initialState: PetState = {
  pets: [],
  loading: false,
  creating: false,
  error: null,
  createError: null,
};

export const fetchPetsThunk = createAsyncThunk(
  "pet/fetchPets",
  async (_, thunkAPI) => {
    try {
      return await petService.getPets();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Get pets failed"
      );
    }
  }
);

export const createPetThunk = createAsyncThunk(
  "pet/createPet",
  async (payload: CreatePetPayload, thunkAPI) => {
    try {
      return await petService.createPet(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create pet failed"
      );
    }
  }
);

const petSlice = createSlice({
  name: "pet",
  initialState,
  reducers: {
    clearPetError: (state) => {
      state.error = null;
      state.createError = null;
    },
    clearPetData: (state) => {
      state.pets = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPetsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPetsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.pets = action.payload;
      })
      .addCase(fetchPetsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPetThunk.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createPetThunk.fulfilled, (state, action) => {
        state.creating = false;
        state.pets = [action.payload, ...state.pets];
      })
      .addCase(createPetThunk.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload as string;
      });
  },
});

export const { clearPetError, clearPetData } = petSlice.actions;
export default petSlice.reducer;