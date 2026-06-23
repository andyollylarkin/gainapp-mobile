import { STORAGE_KEYS } from "@/constants/storage-keys";
import { Colors, typography } from "@/constants/theme";
import { useOnboardingStore } from "@/store/onboarding-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";
import OnboardingHeader from "./_header";
import OnboardingNextButton from "./_next-button";
import Screen1 from "./screens/screen1";
import Slide10 from "./screens/screen10";
import Slide11 from "./screens/screen11";
import Screen2 from "./screens/screen2";
import Screen3 from "./screens/screen3";
import Slide5 from "./screens/screen5";
import Slide9 from "./screens/screen9";

export type SlideProps = {
  onAnswer: (value: unknown) => void;
  onValidChange?: (isValid: boolean) => void;
};

type SlideConfig = {
  component: React.FC<SlideProps>;
  initiallyValid?: boolean;
  fullScreen?: boolean;
  title?: string;
  subtitle?: string;
};

// ─── Add new onboarding slides here ───────────────────────────────────────────
const SLIDES: SlideConfig[] = [
  {
    component: function ({ onAnswer }) {
      return <Screen1 onAnswer={onAnswer} />;
    },
    fullScreen: true,
    title: "Gain muscles\nwith AI",
  },
  {
    component: function ({ onAnswer }) {
      return <Screen2 onAnswer={onAnswer} />;
    },
    fullScreen: true,
    title: "Personal plan",
    subtitle:
      "Get an AI-generated workout plan\ntailored to your goals and experience",
  },
  {
    component: function ({ onAnswer }) {
      return <Screen3 onAnswer={onAnswer} />;
    },
    fullScreen: true,
    title: "Smart progression",
    subtitle:
      "Your workouts automatically adjust\nto keep you in progressive overload",
  },
  {
    component: function ({ onAnswer, onValidChange }) {
      return <Slide5 onAnswer={onAnswer} onValidChange={onValidChange} />;
    },
    initiallyValid: false,
  },
  {
    component: function ({ onAnswer }) {
      return <Slide9 onAnswer={onAnswer} />;
    },
  },
  {
    component: function ({ onAnswer }) {
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

function GainIcon() {
  return (
    <Svg width={126} height={126} viewBox="0 0 134 134" fill="none">
      <Path d="M82.75 0H51.25V47.25H82.75V0Z" fill="#F2F2F2" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M130 78.75V74.5359V47.25H82.75C82.75 64.647 96.853 78.75 114.25 78.75H130ZM51.25 126V78.75L82.75 78.75V126H51.25ZM4 78.75H19.7676C37.1565 78.7405 51.25 64.6411 51.25 47.25L4 47.25L4 74.5359V78.75Z"
        fill="#F2F2F2"
      />
    </Svg>
  );
}

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const isIntro = index === 0;
  const CurrentSlide = SLIDES[index].component;
  const isFullScreen = SLIDES[index].fullScreen ?? false;
  const currentTitle = SLIDES[index].title;
  const currentSubtitle = SLIDES[index].subtitle;
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
      {/* 1. Slide — visual only, behind everything */}
      <View
        style={[
          styles.slide,
          isFullScreen
            ? styles.slideFullScreen
            : { paddingTop: insets.top + 10 },
        ]}
      >
        <CurrentSlide
          onAnswer={(v) => setPendingAnswers(v as Record<string, unknown>)}
          onValidChange={setIsValid}
        />
      </View>

      {/* 2. Gradient — full-screen dark overlay */}
      {isFullScreen && (
        <LinearGradient
          colors={["transparent", "rgba(10,10,10,0.9)", "#0a0a0a"]}
          locations={[0, 0.55, 0.8]}
          style={styles.gradient}
          pointerEvents="none"
        />
      )}

      {/* 3a. Intro slide — icon + title centered */}
      {isIntro && (
        <View style={styles.introCenter}>
          <GainIcon />
          <Text style={styles.introTitle}>{currentTitle}</Text>
        </View>
      )}

      {/* 3b. Other fullScreen slides — title + subtitle near bottom */}
      {isFullScreen && !isIntro && currentTitle && (
        <View style={styles.textArea}>
          <Text style={styles.title}>{currentTitle}</Text>
          {currentSubtitle && (
            <Text style={styles.subtitle}>{currentSubtitle}</Text>
          )}
        </View>
      )}

      {/* 4a. Intro bottom — wide button + account link + legal */}
      {isIntro && (
        <View
          style={[
            styles.introBottom,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          <OnboardingNextButton
            isLast={false}
            onPress={handleNext}
            disabled={!isValid}
            label="Get started"
            hideIcon
            wide
          />
          <TouchableOpacity>
            <Text style={styles.accountText}>I already have an account</Text>
          </TouchableOpacity>
          <Text style={styles.legalText}>
            {"By continuing you're accepting our\n"}
            <Text style={styles.legalLink}>Terms of Use</Text>
            {" and "}
            <Text style={styles.legalLink}>Privacy Notice</Text>
          </Text>
        </View>
      )}

      {/* 4b. Regular button */}
      {!isIntro && (
        <View style={isFullScreen ? styles.buttonAbsolute : undefined}>
          <OnboardingNextButton
            isLast={isLast}
            onPress={handleNext}
            disabled={!isValid}
          />
        </View>
      )}

      {/* 5. Header — always on top */}
      <OnboardingHeader
        index={index}
        total={SLIDES.length}
        onBack={() => setIndex((i) => i - 1)}
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
  slideFullScreen: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    top: "40%",
  },
  // Intro slide (screen1)
  introCenter: {
    position: "absolute",
    top: "32%",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 20,
  },
  introTitle: {
    fontFamily: "IBMPlex-SemiBold",
    fontSize: 48,
    lineHeight: 56,
    color: Colors.general.color.grayTones.main,
    textAlign: "center",
  },
  introBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 8,
  },
  accountText: {
    ...typography.regularM,
    color: Colors.general.color.grayTones.main,
    textAlign: "center",
    paddingVertical: 8,
  },
  legalText: {
    ...typography.regularS,
    color: Colors.general.color.grayTones.muted50,
    textAlign: "center",
    lineHeight: 20,
  },
  legalLink: {
    textDecorationLine: "underline",
  },
  // Other fullScreen slides
  textArea: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 12,
  },
  title: {
    ...typography.mediumExtra,
    fontSize: 40,
    lineHeight: 48,
    color: Colors.general.color.grayTones.main,
    textAlign: "center",
  },
  subtitle: {
    ...typography.regularM,
    color: Colors.general.color.grayTones.muted50,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonAbsolute: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
