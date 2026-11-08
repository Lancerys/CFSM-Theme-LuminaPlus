import { useEffect, type CSSProperties } from "react";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import {
  applySurfaceCache,
  buildSurfaceCache,
  persistSurfaceCache,
} from "@/utils/background";

/**
 * 背景图仍由 CF-Server-Monitor 后台注入。动画模式启用时在其上绘制独立底层，
 * 既不修改后台图片设置，也不影响卡片表面透明度。
 */
export function BackgroundLayer() {
  const {
    surfaceOpacity,
    isReady,
    animatedBackgroundMode,
    animatedBackgroundSpeed,
    animatedBackgroundVideoUrl,
  } = useThemeSettings();

  useEffect(() => {
    if (!isReady) return;
    const cache = buildSurfaceCache(surfaceOpacity);
    persistSurfaceCache(cache);
    applySurfaceCache(cache);
  }, [isReady, surfaceOpacity]);

  if (!isReady || animatedBackgroundMode === "off") return null;

  const style = {
    "--lumina-motion-speed": animatedBackgroundSpeed,
  } as CSSProperties;

  if (animatedBackgroundMode === "video") {
    if (!animatedBackgroundVideoUrl) return null;
    return (
      <div className="lumina-motion-background lumina-motion-background--video" aria-hidden="true">
        <video
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

  return (
    <div
      className={`lumina-motion-background lumina-motion-background--${animatedBackgroundMode}`}
      style={style}
      aria-hidden="true"
    >
      <span className="lumina-motion-background__field lumina-motion-background__field--one" />
      <span className="lumina-motion-background__field lumina-motion-background__field--two" />
      <span className="lumina-motion-background__field lumina-motion-background__field--three" />
      <span className="lumina-motion-background__field lumina-motion-background__field--four" />
    </div>
  );
}
