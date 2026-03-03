import {useEffect} from "react";

export function useInsideOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  onInside: (e: MouseEvent | TouchEvent) => void,
  onOutside: (e: MouseEvent | TouchEvent) => void,
  onMove?: (e: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let moved = false;
    let touched = false;

    const TOUCH_TOLERANCE = 10; // px

    function onTouchStart(e: TouchEvent) {
      touched = true;
      moved = false;

      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    }

    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      const dx = Math.abs(t.clientX - touchStartX);
      const dy = Math.abs(t.clientY - touchStartY);

      if (dx > TOUCH_TOLERANCE || dy > TOUCH_TOLERANCE) {
        moved = true;
        onMove?.(e); // ✅ вызываем колбэк движения
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (!ref) return;
      if (moved) return; // это был скролл, а не тап

      const target = e.target as Node;
      const el = ref.current;
      if (!el) return;

      if (el.contains(target)) onInside(e);
      else onOutside(e);
    }

    function onClick(e: MouseEvent) {
      if (touched) {
        touched = false; // предотвращаем двойное срабатывание
        return;
      }

      const target = e.target as Node;
      const el = ref.current;
      if (!el) return;

      if (el.contains(target)) onInside(e);
      else onOutside(e);
    }

    document.addEventListener("touchstart", onTouchStart, {passive: true});
    document.addEventListener("touchmove", onTouchMove, {passive: true});
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("click", onClick);
    };
  }, [ref, onInside, onOutside, onMove]);
}
