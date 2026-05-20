import { Modal as RNModal, View } from "react-native";
import ModalForm, { ModalProps } from "../modal-form";

type ModalContainerProps = {
  children?: React.ReactNode;
  visible: boolean;
};

function Container({ children, visible }: ModalContainerProps) {
  return (
    <RNModal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 8,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        {children}
      </View>
    </RNModal>
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
