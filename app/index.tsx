import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import { Colors } from "@/constants/theme";

export default function Index() {
  const [target, setTarget] = useState<"/(onboarding)" | "/(workout)" | null>(
    null
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.onboardingDone).then((value) => {
      setTarget("/(onboarding)");
    });
  }, []);

  if (!target) {
    return (
      <View
        style={{ flex: 1, backgroundColor: Colors.general.color.darkTones.bg }}
      />
    );
  }

  return <Redirect href={target} />;
}
