import api from "./api";

const goalService = {
  // Get all goals of the logged-in user
  getGoals: async () => {
    const response = await api.get("/goals");
    return response.data;
  },

  // Create a new goal
  createGoal: async (goalData) => {
    const response = await api.post("/goals", goalData);
    return response.data;
  },

  // Update a goal
  updateGoal: async (goalId, goalData) => {
    const response = await api.put(
      `/goals/${goalId}`,
      goalData
    );
    return response.data;
  },

  // Delete a goal
  deleteGoal: async (goalId) => {
    const response = await api.delete(
      `/goals/${goalId}`
    );
    return response.data;
  },
};

export default goalService;