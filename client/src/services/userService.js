import api from "./api";

// Get my profile
export const getMyProfile = async () => {
  const response = await api.get("/users/me");

  return response.data;
};

// Update my profile
export const updateMyProfile = async (
  profileData
) => {
  const response = await api.put(
    "/users/me",
    profileData
  );

  return response.data;
};

// Get public profile
export const getPublicProfile = async (
  username
) => {
  const response = await api.get(
    `/users/${username}`
  );

  return response.data;
};