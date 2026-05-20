import { Animated, Easing, Modal as RNModal, View } from "react-native";
import ModalForm, { ModalProps } from "../modal-form";
import { useEffect, useRef } from "react";

type ModalContainerProps = {
  children?: React.ReactNode;
  visible: boolean;
};

function Container({ children, visible }: ModalContainerProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible]);

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
          paddingHorizontal: 8,
          paddingBottom: 8,
        }}
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          {children}
        </Animated.View>
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
