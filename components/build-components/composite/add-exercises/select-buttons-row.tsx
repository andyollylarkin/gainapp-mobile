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
            fullWidth
            holdDuration={0}
            holdOverlayColor={"#001D33"}
            text={`Add superset (${selectedExercises.length})`}
            icon={<></>}
            onHoldStart={function (): void {}}
            onHoldEnd={function (): void {
              if (selectedExercises.length === 0) {
                return;
              }
              props.onAddSuperset?.(selectedExercises);
            }}
          />
        </View>
      )}
      <View style={{ flex: selectedExercises.length > 1 ? 1 : 1 }}>
        <SliderButton
          color={Colors.general.color.grayTones.main}
          textColor={Colors.general.color.darkTones.bg}
          fullWidth
          holdDuration={0}
          disabled={selectedExercises.length === 0}
          holdOverlayColor={Colors.general.color.grayTones.main}
          text={`Add exercise ${selectedExercises.length > 0 ? `(${selectedExercises.length})` : ""}`}
          icon={<></>}
          onHoldStart={function (): void {
            if (selectedExercises.length === 0) {
              return;
            }
          }}
          onHoldEnd={function (): void {
            console.log("Add to workout", selectedExercises);
            if (selectedExercises.length === 0) {
              return;
            }
            props.onAddToWorkout?.(selectedExercises);
          }}
        />
      </View>
    </View>
  );
}
