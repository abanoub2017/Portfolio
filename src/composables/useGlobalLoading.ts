import { ref, computed } from "vue";

interface LoadingStates {
  heroImage: boolean
  navigation: boolean
  footer: boolean
  initialContent: boolean
}

// Global loading state management
const loadingStates = ref<LoadingStates>({
  heroImage: false,
  navigation: true, // Nav is always ready
  footer: true,     // Footer is always ready
  initialContent: false,
});

export function useGlobalLoading() {
  const setLoadingState = (key: keyof LoadingStates, value: boolean): void => {
    loadingStates.value[key] = value;
  };

  const isReady = computed<boolean>(() =>
    loadingStates.value.heroImage &&
    loadingStates.value.navigation &&
    loadingStates.value.footer &&
    loadingStates.value.initialContent
  );

  const markHeroImageReady = (): void => setLoadingState('heroImage', true);
  const markInitialContentReady = (): void => setLoadingState('initialContent', true);

  return {
    loadingStates: loadingStates.value,
    isReady,
    setLoadingState,
    markHeroImageReady,
    markInitialContentReady,
  };
}
