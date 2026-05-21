import SliderButton from "@/components/parts/slider-button";
import { Colors } from "@/constants/theme";
import { Exercise } from "./types";
import { View } from "react-native";

export default function SelectButtons(props: {
  selectedExercises: Exercise[];
  onAddToWorkout?: (exercises: Exercise[]) => void;
  onAddSuperset?: (exercises: Exercise[]) => void;
}) {
  const { selectedExercises } = props;
  return (
    <View
      style={{
        position: "absolute",
        bottom: 42,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingHorizontal: 12,
        gap: selectedExercises.length > 1 ? 12 : 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {selectedExercises.length > 1 && (
        <View style={{ flex: 1 }}>
          <SliderButton
            color={"#001D33"}
            textColor={Colors.general.color.blueTones.main}
            holdDuration={0}
            holdOverlayColor={Colors.general.color.grayTones.main}
            text={`Add superset (${selectedExercises.length})`}
            icon={<></>}
            onHoldStart={function (): void {}}
            onHoldEnd={function (): void {
              props.onAddSuperset?.(selectedExercises);
            }}
          />
        </View>
      )}
      <View style={{ flex: selectedExercises.length > 1 ? 1 : 1 }}>
        <SliderButton
          color={Colors.general.color.grayTones.main}
          textColor={Colors.general.color.darkTones.bg}
          holdDuration={0}
          holdOverlayColor={Colors.general.color.grayTones.main}
          text={`Add exercise ${selectedExercises.length > 0 ? `(${selectedExercises.length})` : ""}`}
          icon={<></>}
          onHoldStart={function (): void {
            throw new Error("Function not implemented.");
          }}
          onHoldEnd={function (): void {
            props.onAddToWorkout?.(selectedExercises);
          }}
        />
      </View>
    </View>
  );
}
