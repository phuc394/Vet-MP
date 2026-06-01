import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import profileService, { UpdateProfilePayload } from "../../services/profile.service";

interface ProfileData {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  status: string;
  avatar: string | null;
  address: string | null;
}

interface ProfileState {
  profile: ProfileData | null;
  getProfileLoading: boolean;
  updateProfileLoading: boolean;
  error: string | null;
  updateSuccess: boolean;
}

const initialState: ProfileState = {
  profile: null,
  getProfileLoading: false,
  updateProfileLoading: false,
  error: null,
  updateSuccess: false,
};

export const getMyProfileThunk = createAsyncThunk(
  "profile/getMyProfile",
  async (_, thunkAPI) => {
    try {
      return await profileService.getMyProfile();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Get profile failed"
      );
    }
  }
);

export const updateMyProfileThunk = createAsyncThunk(
  "profile/updateMyProfile",
  async (payload: UpdateProfilePayload, thunkAPI) => {
    try {
      return await profileService.updateMyProfile(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update profile failed"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.error = null;
      state.updateSuccess = false;
      state.getProfileLoading = false;
      state.updateProfileLoading = false;
    },
    clearProfileData: (state) => {
      state.profile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyProfileThunk.pending, (state) => {
        state.getProfileLoading = true;
        state.error = null;
      })
      .addCase(getMyProfileThunk.fulfilled, (state, action) => {
        state.getProfileLoading = false;
        state.profile = action.payload.data; 
      })
      .addCase(getMyProfileThunk.rejected, (state, action) => {
        state.getProfileLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMyProfileThunk.pending, (state) => {
        state.updateProfileLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateMyProfileThunk.fulfilled, (state, action) => {
        state.updateProfileLoading = false;
        state.updateSuccess = true;
        // Tự động gán đè dữ liệu mới cập nhật từ Backend trả về
        if (action.payload && action.payload.data) {
          state.profile = action.payload.data;
        }
      })
      .addCase(updateMyProfileThunk.rejected, (state, action) => {
        state.updateProfileLoading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

export const { resetProfileState, clearProfileData } = profileSlice.actions;
export default profileSlice.reducer;