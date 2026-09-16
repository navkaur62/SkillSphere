import api from "./api";

const profileService = {
  // Get logged-in user's profile
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  // Update logged-in user's profile
  updateProfile: async (profileData) => {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },
};

export default profileService;