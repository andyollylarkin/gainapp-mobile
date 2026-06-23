import { STORAGE_KEYS } from "@/constants/storage-keys";
import { Colors } from "@/constants/theme";
import { useOnboardingStore } from "@/store/onboarding-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OnboardingHeader from "./_header";
import OnboardingNextButton from "./_next-button";
import Slide9 from "./screens/screen9";
import Slide10 from "./screens/screen10";
import Slide5 from "./screens/screen5";
import Slide11 from "./screens/screen11";
import Screen2 from "./screens/screen2";
import Screen3 from "./screens/screen3";

export type SlideProps = {
  onAnswer: (value: unknown) => void;
  onValidChange?: (isValid: boolean) => void;
};

type SlideConfig = {
  component: React.FC<SlideProps>;
  initiallyValid?: boolean; // false = кнопка Next заблокирована пока слайд не вызовет onValidChange(true)
  fullScreen?: boolean; // true = хедер оверлеит контент, маржин не нужен
};

// ─── Add new onboarding slides here ───────────────────────────────────────────
const SLIDES: SlideConfig[] = [
  {
    component: function Slide1b({ onAnswer }) {
      return <Screen2 onAnswer={onAnswer} />;
    },
    fullScreen: true,
  },
  {
    component: function Slide1c({ onAnswer }) {
      return <Screen3 onAnswer={onAnswer} />;
    },
    fullScreen: true,
  },
  {
    component: function Slide1({ onAnswer, onValidChange }) {
      return <Slide5 onAnswer={onAnswer} onValidChange={onValidChange} />;
    },
    initiallyValid: false,
  },
  {
    component: function Slide2({ onAnswer }) {
      return <Slide9 onAnswer={onAnswer} />;
    },
  },
  {
    component: function Slide3({ onAnswer }) {
      return <Slide10 onAnswer={onAnswer} />;
    },
  },
  {
    component: function Slide0({ onAnswer, onValidChange }) {
      return <Slide11 onAnswer={onAnswer} onValidChange={onValidChange} />;
    },
  },
];
// ──────────────────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const CurrentSlide = SLIDES[index].component;
  const isFullScreen = SLIDES[index].fullScreen ?? false;
  const insets = useSafeAreaInsets();
  const setSlideAnswers = useOnboardingStore((s) => s.setSlideAnswers);
  const getSlideAnswers = useOnboardingStore((s) => s.getSlideAnswers);
  const [pendingAnswers, setPendingAnswers] = useState<Record<string, unknown>>(
    {},
  );
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setPendingAnswers(getSlideAnswers(index));
    setIsValid(SLIDES[index].initiallyValid ?? true);
  }, [index, getSlideAnswers]);

  async function handleNext() {
    setSlideAnswers(index, pendingAnswers);
    if (isLast) {
      await AsyncStorage.setItem(STORAGE_KEYS.onboardingDone, "true");
      router.replace("/(workout)");
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <View style={styles.container}>
      <OnboardingHeader
        index={index}
        total={SLIDES.length}
        onBack={() => setIndex((i) => i - 1)}
      />
      <View
        style={[styles.slide, !isFullScreen && { paddingTop: insets.top + 10 }]}
      >
        <CurrentSlide
          onAnswer={(v) => setPendingAnswers(v as Record<string, unknown>)}
          onValidChange={setIsValid}
        />
      </View>
      <OnboardingNextButton
        isLast={isLast}
        onPress={handleNext}
        disabled={!isValid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.general.color.darkTones.bg,
  },
  slide: {
    flex: 1,
  },
});
