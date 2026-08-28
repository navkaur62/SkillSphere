import axios from "axios";

const API_URL = "http://localhost:5000/api/learning-paths";

// Get all learning paths
const getAllLearningPaths = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Enroll in a learning path
const enrollInLearningPath = async (pathId) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API_URL}/${pathId}/enroll`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export default {
    getAllLearningPaths,
    enrollInLearningPath,
};