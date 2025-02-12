import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PercentCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { modalState } from "@/states/modalState";
import Button from "@/components/Button/Button";
import styles from "./Background.module.scss";
import { useToast } from "@/hooks/useToast";
import { postPresignedUrl } from "@/api/aws/postPresigned";
import { putBackgroundImage } from "@/api/users/putMeImage";
import router from "next/router";
import IconComponent from "@/components/Asset/Icon";
import { useMutation } from "react-query";

interface BackgroundProps {
  imageSrc: string;
}

export default function Background({ imageSrc }: BackgroundProps) {
  const [, setModal] = useRecoilState(modalState);
  const { showToast } = useToast();
  const [crop, setCrop] = useState<Crop>({
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

  const CoverImageMutation = useMutation((imageName: string) => putBackgroundImage(imageName));

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
        "image/jpeg",
        1
      );
    });
  }

  const handleSaveCrop = async () => {
    try {
      if (!completedCrop || !imgRef.current) {
        showToast("이미지를 선택해주세요.", "error");
        return;
      }

      const croppedBlob = await getCroppedImage(imgRef.current, completedCrop);
      const file = new File([croppedBlob], "cover.jpg", { type: "image/jpeg" });

      const data = await postPresignedUrl({
        type: "background",
        ext: "jpg",
      });

      CoverImageMutation.mutate(data.imageName);

      const uploadResponse = await fetch(data.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      showToast("커버 이미지가 변경되었습니다!", "success");
      setModal({ isOpen: false, type: null, data: null });
      router.reload();
    } catch (error) {
      console.error("Cover image upload error:", error);
      showToast("커버 이미지 업로드에 실패했습니다.", "error");
    }
  };

  const onImageLoad = (img: HTMLImageElement) => {
    const { width, height } = img;
    const aspectRatio = viewportWidth / 400;
    const cropHeight = width / aspectRatio;

    const newCrop: Crop = {
      unit: "%",
      width: 100,
      height: (cropHeight / height) * 100,
      x: 0,
      y: 0,
    };
    setCrop(newCrop);
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
          <Image
            ref={imgRef}
            src={imageSrc}
            alt="Crop me"
            style={{ transform: `scale(${scale})` }}
            width={viewportWidth}
            height={0}
            layout="intrinsic"
            onLoadingComplete={onImageLoad}
            unoptimized
          />
        </ReactCrop>
      </div>
      <div className={styles.controls}>
        <div className={styles.zoomContainer}>
          <IconComponent name="zoomOut" width={18} height={18} />
          <input
            type="range"
            className={styles.rangeInput}
            min={1}
            max={3}
            step={0.1}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
          />
          <IconComponent name="zoomIn" width={18} height={18} />
        </div>
        <Button type="filled-primary" size="l" onClick={handleSaveCrop}>
          변경 내용 저장
        </Button>
      </div>
    </div>
  );
}
