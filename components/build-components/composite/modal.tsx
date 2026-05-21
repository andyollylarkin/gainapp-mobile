import { Animated, Easing, Modal as RNModal, View } from "react-native";
import ModalForm, { ModalProps } from "../modal-form";
import { useEffect, useRef } from "react";

type ModalContainerProps = {
  children?: React.ReactNode;
  visible: boolean;
};

function Container({ children, visible }: ModalContainerProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: 10,
          paddingBottom: 8,
          opacity: opacityAnim,
          position: "relative",
        }}
      >
        <Animated.View
          style={{
            opacity: opacityAnim,
            backgroundColor: "rgba(0,0,0,0.5)",
            width: "200%",
            height: "200%",
            position: "absolute",
          }}
        />
        <Animated.View style={{ transform: [{ translateY: slideAnim }], marginBottom: "9%" }}>
          {children}
        </Animated.View>
      </Animated.View>
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
