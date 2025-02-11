import BASE_URL from "@/constants/baseurl";

export interface ReportsRequest {
  type: number;
  refType: "USER" | "FEED" | "FEED_COMMENT" | "POST" | "POST_COMMENT";
  refId: string;
  content?: string;
}

export async function postReports({ type, refType, refId, content }: ReportsRequest) {
  const response = await BASE_URL.post("/reports", {
    type,
    refType,
    refId,
    content,
  });
  return response;
}
