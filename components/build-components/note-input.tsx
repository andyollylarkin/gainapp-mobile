import { Colors, typography } from "@/constants/theme";
import { useNoteStore } from "@/store/note-store";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface NoteInputProps {
  exerciseId?: string;
  numberOfLines?: number;
}

export default function NoteInput({
  exerciseId,
  numberOfLines,
}: NoteInputProps) {
  const value = useNoteStore((s) =>
    exerciseId ? (s.exerciseNotes[exerciseId] ?? "") : "",
  );
  const setExerciseNotes = useNoteStore((s) => s.setExerciseNotes);

  return (
    <View>
      <TextInput
        style={{
          ...typography.regularL,
          color: Colors.general.color.grayTones.muted40,
        }}
        placeholderTextColor={Colors.general.color.grayTones.muted40}
        placeholder="Add Note"
        multiline
        value={value}
        onChangeText={(text) =>
          exerciseId && setExerciseNotes(exerciseId, text)
        }
        numberOfLines={numberOfLines ?? 10}
      />
    </View>
  );
}
