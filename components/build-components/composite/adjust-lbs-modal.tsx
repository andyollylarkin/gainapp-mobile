import ScaledPressable from "@/components/animated/scaled-pressable";
import MinusIcon from "@/components/icons/minux";
import PlusIcon from "@/components/icons/plus";
import Circle from "@/components/parts/circle";
import SliderButton from "@/components/parts/slider-button";
import { Colors, typography } from "@/constants/theme";
import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import { ModalProps } from "../modal-form";
import Modal from "./modal";

const MAX_TIME_ONE_HOUR = 3059;

type AdjustLbsProps = {
  image: ImageSourcePropType | undefined | null;
  exerciseTitle: string;
  step: number;
  currentValue?: number;
  caption: string;
  allowNegative?: boolean;
  onIncrease: (val: number) => void;
  onDecrease: (val: number) => void;
  onDone: () => void;
};

type AdjustLbsModalProps = Omit<ModalProps & AdjustLbsProps, "children">;

function ActionButton(props: {
  children: React.ReactNode;
  onPress: () => void;
  currentValue: number;
}) {
  return (
    <ScaledPressable scaleTo={0.97} scaleDuration={100}>
      <Pressable onPress={props.onPress}>
        <Circle bgColor={Colors.general.color.darkTones.bgMiddle} size={72}>
          <>{props.children}</>
        </Circle>
      </Pressable>
    </ScaledPressable>
  );
}

export default function AdjustLbsModal(props: AdjustLbsModalProps) {
  const {
    title,
    openState,
    setClose,
    exerciseTitle,
    image,
    step,
    allowNegative = false,
  } = props;
  const [lbsValue, setLbsValue] = useState<number>(props.currentValue ?? 0);

  return (
    <Modal.ModalBox openState={openState} setClose={setClose} title={title}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        <View
          style={{
            padding: 12,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 24,
            borderStyle: "dashed",
            flexDirection: "row",
            gap: 12,
            borderWidth: 2,
            borderColor: Colors.general.color.darkTones.bgMiddle,
            paddingHorizontal: 12,
            paddingVertical: 12,
            width: "100%",
          }}
        >
          {image ? (
            <Image source={image} style={{ maxWidth: 40, maxHeight: 36 }} />
          ) : (
            <View
              style={{
                width: 40,
                height: 36,
                backgroundColor: Colors.general.color.grayTones.muted50,
              }}
            />
          )}
          <Text
            style={{
              ...typography.mediumL,
              color: Colors.general.color.grayTones.main,
            }}
          >
            {exerciseTitle}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <ActionButton
            onPress={() => {
              const newValue = lbsValue - step;

              if (newValue < 0 && !allowNegative) return;

              setLbsValue(newValue);
              props.onDecrease(newValue);
            }}
            currentValue={lbsValue}
          >
            <MinusIcon
              width={43}
              height={43}
              color={Colors.general.color.grayTones.muted40}
            />
          </ActionButton>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 12,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontWeight: 500,
                fontSize: 48,
                color: Colors.general.color.grayTones.main,
              }}
            >
              {lbsValue}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontWeight: 500,
                fontSize: 48,
                color: Colors.general.color.grayTones.muted40,
              }}
            >
              {"lbs"}
            </Text>
          </View>
          <ActionButton
            onPress={() => {
              const newValue = lbsValue + step;
              if (newValue > MAX_TIME_ONE_HOUR) return;
              setLbsValue(newValue);
              props.onIncrease(newValue);
            }}
            currentValue={lbsValue}
          >
            <PlusIcon
              width={43}
              height={43}
              color={Colors.general.color.grayTones.muted40}
            />
          </ActionButton>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              ...typography.mediumS,
              color: Colors.general.color.grayTones.muted30,
              textAlign: "center",
            }}
          >
            {props.caption}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <SliderButton
            onHoldEnd={props.onDone}
            fullWidth
            icon={<></>}
            text="Done"
            holdDuration={0}
            holdOverlayColor={""}
            color={Colors.general.color.grayTones.main}
            textColor={Colors.general.color.darkTones.bg}
            onHoldStart={() => {}}
          />
        </View>
      </View>
    </Modal.ModalBox>
  );
}
