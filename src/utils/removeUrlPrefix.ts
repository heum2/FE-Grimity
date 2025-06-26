import { imageUrl } from "@/constants/imageUrl";

export const removeUrlPrefix = (url: string) => {
  if (url.startsWith("http")) {
    const parts = url.split("/");
    return parts.slice(3).join("/");
  }
  return url.replace(`${imageUrl}/`, "");
};
