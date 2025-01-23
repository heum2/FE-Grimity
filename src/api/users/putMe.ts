import BASE_URL from "@/constants/baseurl";

export interface MyInfoRequest {
  name: string;
  description: string;
  links: { linkName: string; link: string }[];
}

export interface Response {
  success: boolean;
  message: string;
}

export async function putMyInfo({ name, description, links }: MyInfoRequest): Promise<Response> {
  const response = await BASE_URL.put("/users/me", {
    name,
    description,
    links,
  });
  return response.data;
}
