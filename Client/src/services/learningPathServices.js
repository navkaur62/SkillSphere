import api from "./api";

// Get all learning paths
const getAllLearningPaths = async () => {
  const response = await api.get("/learning-paths");

  return response.data;
};

// Enroll in a learning path
const enrollInLearningPath = async (pathId) => {
  const response = await api.post(
    `/learning-paths/${pathId}/enroll`,
    {}
  );

  return response.data;
};

export default {
  getAllLearningPaths,
  enrollInLearningPath,
};