import api from "./api";

const goalService = {
  // Get all goals
  getGoals: async () => {
    const response = await api.get("/goals");
    return response.data;
  },

  // Create goal
  createGoal: async (goalData) => {
    const response = await api.post("/goals", goalData);
    return response.data;
  },

  // Update goal
  updateGoal: async (goalId, goalData) => {
    const response = await api.put(
      `/goals/${goalId}`,
      goalData
    );

    return response.data;
  },

  // Delete goal
  deleteGoal: async (goalId) => {
    const response = await api.delete(
      `/goals/${goalId}`
    );

    return response.data;
  },
};

export default goalService;