import { ref, onMounted, onUnmounted } from "vue";

export function useIntersectionObserver(options = {}) {
  const isIntersecting = ref(false);
  const target = ref(null);

  let observer = null;

  onMounted(() => {
    if (!target.value) return;

    observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting.value = entry.isIntersecting;
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
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
