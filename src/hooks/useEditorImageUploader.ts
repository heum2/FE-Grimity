import { postPresignedUrl } from "@/api/images/postPresigned";
import { imageUrl } from "@/constants/imageUrl";
import { convertToWebP } from "@/utils/convertToWebP";

export const useEditorImageUploader = () => {
  const uploadImage = async (blobInfo: {
    filename: () => string;
    blob: () => Blob;
  }): Promise<string> => {
    try {
      const file = blobInfo.blob();

      const webpFile = await convertToWebP(file as File);

      const data = await postPresignedUrl({
        type: "post",
        ext: "webp",
      });

      const uploadResponse = await fetch(data.uploadUrl, {
        method: "PUT",
        body: webpFile,
        headers: {
          "Content-Type": "image/webp",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`${uploadResponse.status}`);
      }

      return `${imageUrl}/${data.imageName}`;
    } catch (error) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  };

  return { uploadImage };
};
