import { useToast } from "@/hooks/useToast";

export function useClipboard() {
  const { showToast } = useToast();

  const copyToClipboard = async (text: string, successMessage = "클립보드에 복사되었습니다.") => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage, "success");
    } catch {
      showToast("복사에 실패했습니다.", "error");
    }
  };

  return { copyToClipboard };
}
