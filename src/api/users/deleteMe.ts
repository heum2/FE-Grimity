import axiosInstance from "@/constants/baseurl";

export async function deleteMe(): Promise<void> {
  try {
    await axiosInstance.delete("/users/me", {
      headers: {
        "is-delete-account": "true",
      },
    });

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");

    return;
  } catch (error) {
    throw error;
  }
}
