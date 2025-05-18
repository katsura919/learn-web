// lib/api/user.ts
import axios from "axios";

export const fetchUserById = async (): Promise<any> => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    throw new Error("Missing token or user in localStorage");
  }

  const { id } = JSON.parse(userData); // Extract id from user JSON

  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
};
