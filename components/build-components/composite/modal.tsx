import { View } from "react-native";
import ModalForm, { ModalProps } from "../modal-form";

type ModalContainerProps = {
  children?: React.ReactNode;
  topIndent?: number;
};

function Container({ children, topIndent }: ModalContainerProps) {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        top: topIndent ?? "35%",
        zIndex: 9999,
        paddingHorizontal: 8,
      }}
    >
      {children}
    </View>
  );
}

export interface ModalType {
  Container: React.FC<ModalContainerProps>;
  ModalBox: React.FC<ModalProps>;
}

const Modal: ModalType = {
  Container: Container,
  ModalBox: ModalForm,
};

export default Modal;
