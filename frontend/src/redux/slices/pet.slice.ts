import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import petService from "../../services/pet.service";
import { CreatePetPayload, Pet, UpdatePetPayload } from "../../types/pet.type";

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  detailLoading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  detailError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: PetState = {
  pets: [],
  selectedPet: null,
  loading: false,
  detailLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  detailError: null,
  createError: null,
  updateError: null,
  deleteError: null,
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

export const fetchPetByIdThunk = createAsyncThunk(
  "pet/fetchPetById",
  async (petId: number, thunkAPI) => {
    try {
      return await petService.getPetById(petId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Get pet detail failed"
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

export const updatePetThunk = createAsyncThunk(
  "pet/updatePet",
  async ({ petId, payload }: { petId: number; payload: UpdatePetPayload }, thunkAPI) => {
    try {
      return await petService.updatePet(petId, payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update pet failed"
      );
    }
  }
);

export const deletePetThunk = createAsyncThunk(
  "pet/deletePet",
  async (petId: number, thunkAPI) => {
    try {
      return await petService.deletePet(petId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Delete pet failed"
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
      state.detailError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    setSelectedPet: (state, action) => {
      state.selectedPet = action.payload;
    },
    clearPetData: (state) => {
      state.pets = [];
      state.selectedPet = null;
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
      .addCase(fetchPetByIdThunk.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchPetByIdThunk.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedPet = action.payload;
        state.pets = state.pets.map((pet) =>
          pet.pet_id === action.payload.pet_id ? action.payload : pet
        );
      })
      .addCase(fetchPetByIdThunk.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
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
      })
      .addCase(updatePetThunk.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updatePetThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.selectedPet = action.payload;
        state.pets = state.pets.map((pet) =>
          pet.pet_id === action.payload.pet_id ? action.payload : pet
        );
      })
      .addCase(updatePetThunk.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload as string;
      })
      .addCase(deletePetThunk.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deletePetThunk.fulfilled, (state, action) => {
        state.deleting = false;
        state.pets = state.pets.filter((pet) => pet.pet_id !== action.payload);
        if (state.selectedPet?.pet_id === action.payload) {
          state.selectedPet = null;
        }
      })
      .addCase(deletePetThunk.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearPetError, clearPetData, setSelectedPet } = petSlice.actions;
export default petSlice.reducer;
