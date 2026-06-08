import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "@/constants/theme";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useOnboardingStore } from "@/store/onboarding-store";
import OnboardingHeader from "./_header";
import OnboardingNextButton from "./_next-button";

export type SlideProps = {
  onAnswer: (answers: Record<string, unknown>) => void;
};

// ─── Add new onboarding slides here ───────────────────────────────────────────
const SLIDES: React.FC<SlideProps>[] = [
  function Slide1({ onAnswer }) {
    return <View style={styles.slide} />;
  },
  function Slide2({ onAnswer }) {
    return <View style={styles.slide} />;
  },
  function Slide3({ onAnswer }) {
    return <View style={styles.slide} />;
  },
];
// ──────────────────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const CurrentSlide = SLIDES[index];
  const setSlideAnswers = useOnboardingStore((s) => s.setSlideAnswers);
  const getSlideAnswers = useOnboardingStore((s) => s.getSlideAnswers);
  const [pendingAnswers, setPendingAnswers] = useState<Record<string, unknown>>({});

  useEffect(() => {
    setPendingAnswers(getSlideAnswers(index));
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
      <CurrentSlide onAnswer={setPendingAnswers} />
      <OnboardingNextButton isLast={isLast} onPress={handleNext} />
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
