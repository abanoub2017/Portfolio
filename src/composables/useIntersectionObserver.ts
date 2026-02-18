import { ref, onMounted, onUnmounted } from "vue";

export function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const isIntersecting = ref<boolean>(false);
  const target = ref<HTMLElement | null>(null);

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (!target.value) return;

    observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        isIntersecting.value = entry.isIntersecting;
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(target.value);
  });

  onUnmounted(() => {
    if (observer && target.value) {
      observer.unobserve(target.value);
      observer.disconnect();
    }
  });

  return {
    target,
    isIntersecting,
  };
}
