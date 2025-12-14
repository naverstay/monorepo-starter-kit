import {useEffect, useState, type RefObject} from "react";

export function useElementPosition(
  ref: RefObject<HTMLDivElement | null>
): "top" | "bottom" {
  const [position, setPosition] = useState<"top" | "bottom">("bottom");

  useEffect(() => {
    if (!ref) return;
    const el = document.body;

    function update() {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const screenCenter = window.innerHeight / 2;

      setPosition(elementCenter < screenCenter ? "bottom" : "top");
    }

    update();
    el.addEventListener("scroll", update, {passive: true});

    return () => el.removeEventListener("scroll", update);
  }, [ref]);

  // useEffect(() => {
  //   function update() {
  //     if (!ref) return;
  //
  //     const el = ref.current;
  //     if (!el) return;
  //
  //     const rect = el.getBoundingClientRect();
  //     console.log('rect', rect);
  //     const elementCenter = rect.top + rect.height / 2;
  //     const screenCenter = window.innerHeight / 2;
  //
  //     if (elementCenter < screenCenter) {
  //       setPosition("bottom");
  //     } else {
  //       setPosition("top");
  //     }
  //   }
  //
  //   update();
  //   window.addEventListener("scroll", update, {passive: true});
  //   window.addEventListener("resize", update);
  //
  //   return () => {
  //     window.removeEventListener("scroll", update);
  //     window.removeEventListener("resize", update);
  //   };
  // }, [ref]);

  return position;
}
