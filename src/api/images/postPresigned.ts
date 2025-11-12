import BASE_URL from "@/constants/baseurl";

export interface PresignedUrlRequest {
  type: "profile" | "feed" | "background" | "post" | "chat";
  ext: "jpg" | "jpeg" | "png" | "webp";
  width: number;
  height: number;
}

export interface PresignedUrlResponse {
  imageUrl: string;
  imageName: string;
  uploadUrl: string;
}

export async function postPresignedUrl({
  type,
  ext,
}: PresignedUrlRequest): Promise<PresignedUrlResponse> {
  const response = await BASE_URL.post("/images/get-upload-url", {
    type,
    ext,
  });
  return response.data;
}

export async function postPresignedUrls(
  requests: PresignedUrlRequest[],
): Promise<PresignedUrlResponse[]> {
  const response = await BASE_URL.post("/images/get-upload-urls", requests);
  return response.data;
}
