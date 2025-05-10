import axiosInstance from "@/constants/baseurl";

export type SubscriptionType =
  | "FOLLOW"
  | "FEED_LIKE"
  | "FEED_COMMENT"
  | "FEED_REPLY"
  | "POST_COMMENT"
  | "POST_REPLY";

export const SubscriptionTypes = [
  "FOLLOW",
  "FEED_LIKE",
  "FEED_COMMENT",
  "FEED_REPLY",
  "POST_COMMENT",
  "POST_REPLY",
] as const;

export interface SubscribeResponse {
  subscription: SubscriptionType[];
}

export interface SubscribeRequest {
  type: SubscriptionType | "ALL";
}

export async function getSubscribe(): Promise<SubscribeResponse> {
  const response = await axiosInstance.get("/me/subscribe");
  return response.data;
}

export async function putSubscribe({ type }: SubscribeRequest): Promise<Response> {
  const payload = {
    subscription: type === "ALL" ? SubscriptionTypes : [type],
  };
  const response = await axiosInstance.put(`/me/subscribe`, payload);
  return response.data;
}
