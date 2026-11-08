import { useEffect } from "react";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import {
  applySurfaceCache,
  buildSurfaceCache,
  persistSurfaceCache,
} from "@/utils/background";

/**
 * 保留后端原生静态背景；用户选择视频时额外绘制一个固定视频背景层。
 * 不再提供 CSS 渐变动画，避免增加合成开销。
 */
export function BackgroundLayer() {
  const {
    surfaceOpacity,
    isReady,
    animatedBackgroundMode,
    animatedBackgroundVideoUrl,
  } = useThemeSettings();

  useEffect(() => {
    if (!isReady) return;
    const cache = buildSurfaceCache(surfaceOpacity);
    persistSurfaceCache(cache);
    applySurfaceCache(cache);
  }, [isReady, surfaceOpacity]);

  if (!isReady || animatedBackgroundMode !== "video" || !animatedBackgroundVideoUrl) {
    return null;
  }

  return (
    <div className="lumina-video-background" aria-hidden="true">
      <video
        key={animatedBackgroundVideoUrl}
        src={animatedBackgroundVideoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
      />
    </div>
  );
}
