import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { PercentCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useModalStore } from "@/states/modalStore";

const ReactCrop = dynamic(() => import("react-image-crop"), { ssr: false });
import Button from "@/components/Button/Button";
import styles from "./Background.module.scss";
import { useToast } from "@/hooks/useToast";
import { postPresignedUrl } from "@/api/images/postPresigned";
import { putBackgroundImage } from "@/api/users/putMeImage";
import IconComponent from "@/components/Asset/Icon";
import { useMutation } from "@tanstack/react-query";
import { useMyData } from "@/api/users/getMe";
import { getImageDimensions } from "@/utils/getImageDimensions";

interface BackgroundProps {
  imageSrc: string;
  file: File;
  onUploadSuccess?: () => void;
}

export default function Background({ imageSrc, file, onUploadSuccess }: BackgroundProps) {
  const { refetch } = useMyData();
  const closeModal = useModalStore((state) => state.closeModal);
  const { showToast } = useToast();
  const [crop, setCrop] = useState<PercentCrop>({
    unit: "%",
    width: 100,
    height: 30,
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const [completedCrop, setCompletedCrop] = useState<PercentCrop>();
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  const { mutate: updateBackgroundImage } = useMutation({
    mutationFn: (imageName: string) => putBackgroundImage(imageName),
  });

  function getCroppedImage(image: HTMLImageElement, crop: PercentCrop): Promise<Blob> {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = viewportWidth * pixelRatio;
    canvas.height = 400 * pixelRatio;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = ((crop.x * image.width) / 100) * scaleX;
    const cropY = ((crop.y * image.height) / 100) * scaleY;
    const cropWidth = ((crop.width * image.width) / 100) * scaleX;
    const cropHeight = ((crop.height * image.height) / 100) * scaleY;

    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, viewportWidth, 400);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Canvas is empty");
          }
          resolve(blob);
        },
        "image/webp",
        0.9,
      );
    });
  }

  const convertToWebP = async (blob: Blob): Promise<File> => {
    return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
      type: "image/webp",
    });
  };

  const handleSaveCrop = async () => {
    try {
      if (!completedCrop || !imgRef.current) {
        showToast("이미지를 선택해주세요.", "error");
        return;
      }

      const croppedBlob = await getCroppedImage(imgRef.current, completedCrop);
      const webpFile = await convertToWebP(croppedBlob);

      const { width, height } = await getImageDimensions(webpFile);

      const data = await postPresignedUrl({
        type: "background",
        ext: "webp",
        width,
        height,
      });

      updateBackgroundImage(data.imageName);

      const uploadResponse = await fetch(data.uploadUrl, {
        method: "PUT",
        body: webpFile,
        headers: {
          "Content-Type": "image/webp",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      showToast("커버 이미지가 변경되었습니다!", "success");
      closeModal();
      refetch();

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Cover image upload error:", error);
      showToast("커버 이미지 업로드에 실패했습니다.", "error");
    }
  };

  const onImageLoad = (img: HTMLImageElement) => {
    const { width, height } = img;
    const aspectRatio = viewportWidth / 400;
    const cropHeight = width / aspectRatio;

    const newCrop: PercentCrop = {
      unit: "%",
      width: 100,
      height: (cropHeight / height) * 100,
      x: 0,
      y: 0,
    };
    setCrop(newCrop);
    setCompletedCrop(newCrop);
  };

  if (!viewportWidth) return null;

  return (
    <div className={styles.backgroundContainer}>
      <h2 className={styles.title}>커버 이미지 수정</h2>
      <div className={styles.cropContainer}>
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(_, percentCrop) => setCompletedCrop(percentCrop)}
          aspect={viewportWidth / 400}
          minWidth={100}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop me"
            style={{ transform: `scale(${scale})`, width: `${viewportWidth}px`, height: "auto" }}
            onLoad={(event) => onImageLoad(event.currentTarget)}
            loading="lazy"
          />
        </ReactCrop>
      </div>
      <div className={styles.controls}>
        <div className={styles.zoomContainer}>
          <IconComponent name="zoomOut" size={18} />
          <input
            type="range"
            className={styles.rangeInput}
            min={1}
            max={3}
            step={0.1}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
          />
          <IconComponent name="zoomIn" size={18} />
        </div>
        <Button type="filled-primary" size="l" onClick={handleSaveCrop}>
          변경 내용 저장
        </Button>
      </div>
    </div>
  );
}
