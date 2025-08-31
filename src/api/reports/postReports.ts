import axiosInstance from "@/constants/baseurl";

export type ReportType =
  | "사칭계정"
  | "스팸/도배"
  | "욕설/비방"
  | "부적절한 프로필"
  | "선정적인 컨텐츠"
  | "기타";

export interface ReportsRequest {
  type: ReportType;
  refType: "USER" | "FEED" | "FEED_COMMENT" | "POST" | "POST_COMMENT";
  refId: string;
  content?: string;
}

export async function postReports({ type, refType, refId, content }: ReportsRequest) {
  const response = await axiosInstance.post("/reports", {
    type,
    refType,
    refId,
    content,
  });
  return response;
}
