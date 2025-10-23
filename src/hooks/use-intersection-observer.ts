import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0.1, rootMargin = "200px" } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) {
      setIsIntersecting(false);
      return;
    }

    let hasCheckedInitial = false;
    let initiallyVisible = false;

    const checkInitialIntersection = () => {
      if (!target || hasCheckedInitial) return;
      hasCheckedInitial = true;
      
      const rect = target.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const marginValue = parseInt(rootMargin) || 200;
      const isVisible = rect.top <= windowHeight + marginValue && rect.bottom > 0;
      
      if (isVisible) {
        initiallyVisible = true;
        setIsIntersecting(true);
      }
    };

    checkInitialIntersection();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!hasCheckedInitial || !initiallyVisible) {
          setIsIntersecting(entry.isIntersecting);
        } else if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { targetRef, isIntersecting };
}
