import IncreaseIcon from "@/components/icons/increase";
import {
  FrontBodyProps,
  FrontBodyView,
} from "@/components/icons/muscle-body/front";
import TimerIcon from "@/components/icons/timer";
import { Colors, typography } from "@/constants/theme";
import { Image, Pressable, Text, View } from "react-native";
import { Box, BoxList } from "./box";
import Modal from "../modal";
import AdjustTimerModal from "../adjust-timer-modal";
import { useState } from "react";
import AdjustLbsModal from "../adjust-lbs-modal";
import { useExerciseSettings } from "@/store/excercise-settings-store";

interface InfoTabProps {
  muscles: {
    primary: keyof FrontBodyProps | null | undefined;
    secondary: keyof FrontBodyProps | null | undefined;
  };
  equipment: {
    imageUrl: string;
    name: string;
  }[];
}

export default function InfoTab(props: InfoTabProps) {
  const [timerModalOpen, setTimerModalOpen] = useState<boolean>(false);
  const [lbsModalOpen, setLbsModalOpen] = useState<boolean>(false);
  const {
    incrementIncrement,
    incrementRestTime,
    increment,
    restTime,
    decrementIncrement,
    decrementRestTime,
  } = useExerciseSettings();

  return (
    <>
      <Modal.Container visible={timerModalOpen || lbsModalOpen}>
        <AdjustLbsModal
          openState={lbsModalOpen}
          currentValue={increment}
          setClose={() => setLbsModalOpen(false)}
          title="Adjust increment"
          exerciseTitle="Barbell Bench Press"
          step={1}
          onIncrease={() => incrementIncrement(1)}
          onDecrease={() => decrementIncrement(1)}
          onDone={() => setLbsModalOpen(false)}
          image={null}
          caption={""}
        />
        <AdjustTimerModal
          currentValue={restTime}
          openState={timerModalOpen}
          setClose={() => setTimerModalOpen(false)}
          title="Adjust rest timer"
          exerciseTitle="Barbell Bench Press"
          caption="Rest 1:30–2:00 min between sets for maximum muscle growth. Take your time if needed"
          onIncrease={() => {
            incrementRestTime(30);
          }}
          onDecrease={() => {
            decrementRestTime(30);
          }}
          onDone={() => setTimerModalOpen(false)}
          step={30}
          image={null}
        />
      </Modal.Container>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <BodyInfo {...props} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            width: "100%",
            gap: 12,
          }}
        >
          <Text
            style={{
              ...typography.mediumL,
              color: Colors.general.color.grayTones.muted40,
              textAlign: "left",
              paddingHorizontal: 4,
            }}
          >
            Exercise Settings
          </Text>
          <SettingsList
            openTimerModal={() => setTimerModalOpen(true)}
            openLbsModal={() => setLbsModalOpen(true)}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            width: "100%",
            gap: 12,
          }}
        >
          <Text
            style={{
              ...typography.mediumL,
              color: Colors.general.color.grayTones.muted40,
              textAlign: "left",
              paddingHorizontal: 4,
            }}
          >
            Equipment
          </Text>
          <BoxList>
            {props?.equipment?.map((item, index) => (
              <Box key={index}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={{ width: 40, height: 40, marginRight: 12 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        marginRight: 12,
                        backgroundColor:
                          Colors.general.color.darkTones.bgMiddle,
                        borderRadius: 12,
                      }}
                    />
                  )}
                  <Text
                    style={{
                      ...typography.mediumM,
                      color: Colors.general.color.grayTones.main,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              </Box>
            ))}
          </BoxList>
        </View>
      </View>
    </>
  );
}

function SettingsList(props: {
  openTimerModal?: () => void;
  openLbsModal?: () => void;
}) {
  const { restTime, increment } = useExerciseSettings();

  return (
    <BoxList>
      <Box>
        <Pressable onPress={() => props.openTimerModal?.()}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 6,
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
            >
              <TimerIcon
                width={20}
                height={20}
                color={Colors.general.color.grayTones.main}
              />
              <Text
                style={{
                  ...typography.mediumM,
                  color: Colors.general.color.grayTones.main,
                }}
              >
                Rest time
              </Text>
            </View>
            <Text
              style={{
                ...typography.mediumM,
                color: Colors.general.color.grayTones.muted40,
              }}
            >
              {`${Math.floor(restTime / 60)}m ${(restTime % 60).toString().padStart(2, "0")}s`}
            </Text>
          </View>
        </Pressable>
      </Box>
      <Box>
        <Pressable onPress={() => props.openLbsModal?.()}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 6,
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
            >
              <IncreaseIcon
                width={20}
                height={20}
                color={Colors.general.color.grayTones.main}
              />
              <Text
                style={{
                  ...typography.mediumM,
                  color: Colors.general.color.grayTones.main,
                }}
              >
                Increment
              </Text>
            </View>
            <Text
              style={{
                ...typography.mediumM,
                color: Colors.general.color.grayTones.muted40,
              }}
            >
              {increment} lbs
            </Text>
          </View>
        </Pressable>
      </Box>
    </BoxList>
  );
}

function BodyInfo(props: InfoTabProps) {
  return (
    <View
      style={{
        width: "100%",
        minHeight: 200,
        backgroundColor: Colors.general.color.darkTones.bgTray,
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 24,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          gap: 42,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FrontBodyView
          partPrimary={props?.muscles?.primary}
          partSecondary={props?.muscles?.secondary}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          alignSelf: "flex-start",
          width: "100%",
        }}
      >
        <View style={{ width: "100%" }}>
          <Text
            style={{
              ...typography.mediumM,
              color: Colors.general.color.grayTones.muted50,
              textAlign: "left",
            }}
          >
            Primary muscle
          </Text>
        </View>
        <View style={{ width: "100%" }}>
          <Text
            style={{
              ...typography.mediumM,
              color: Colors.general.color.grayTones.main,
              textAlign: "left",
            }}
          >
            {props?.muscles?.primary ?? ""}
          </Text>
        </View>
        <View style={{ width: "100%", marginTop: 12 }}>
          <Text
            style={{
              ...typography.mediumM,
              color: Colors.general.color.grayTones.muted50,
              textAlign: "left",
            }}
          >
            Secondary muscles
          </Text>
        </View>
        <View style={{ width: "100%" }}>
          <Text
            style={{
              ...typography.mediumM,
              color: Colors.general.color.grayTones.main,
              textAlign: "left",
            }}
          >
            {props?.muscles?.secondary ?? ""}
          </Text>
        </View>
      </View>
    </View>
  );
}
