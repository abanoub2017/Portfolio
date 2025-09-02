import { ref, computed } from "vue";

// Global loading state management
const loadingStates = ref({
  heroImage: false,
  navigation: true, // Nav is always ready
  footer: true, // Footer is always ready
  initialContent: false,
});

export function useGlobalLoading() {
  const setLoadingState = (key, value) => {
    loadingStates.value[key] = value;
  };

  const isReady = computed(() => {
    // All critical components must be ready
    return (
      loadingStates.value.heroImage &&
      loadingStates.value.navigation &&
      loadingStates.value.footer &&
      loadingStates.value.initialContent
    );
  });

  const markHeroImageReady = () => setLoadingState("heroImage", true);
  const markInitialContentReady = () => setLoadingState("initialContent", true);

  return {
    loadingStates: loadingStates.value,
    isReady,
    setLoadingState,
    markHeroImageReady,
    markInitialContentReady,
  };
}
