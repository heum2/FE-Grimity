import BASE_URL from "@/constants/baseurl";

export type SubscriptionType =
  | "FOLLOW"
  | "FEED_LIKE"
  | "FEED_COMMENT"
  | "FEED_REPLY"
  | "POST_COMMENT"
  | "POST_REPLY";

export interface SubscribeResponse {
  subscription: SubscriptionType[];
}

export interface SubscribeRequest {
  type: SubscriptionType | "ALL";
}

export async function getSubscribe(): Promise<SubscribeResponse> {
  const response = await BASE_URL.get("/users/me/subscribe");
  return response.data;
}

export async function putSubscribe({ type }: SubscribeRequest): Promise<Response> {
  const response = await BASE_URL.put(`/users/me/subscribe?type=${type}`);
  return response.data;
}
