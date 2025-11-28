import { useState } from "react";
import style from "./Chat.module.scss";

import ContentChat from "../chat/ContentChat.jsx";
import HeaderChat from "./HeaderChat.jsx";
import Input from "./Input.jsx";

import useMatchStore from "../../store/match";
import ModalConfirm from "../ui/dialog/ModalConfirm.jsx";
import CustomButton from "../ui/button/CustomButton.jsx";
import { useNotification } from "../../utils/NotificationContext.jsx";

const Chat = ({ item, person, mensagens, currentUserId, onBack, match }) => {
  const { confirmMatch } = useMatchStore();
  const { showNotification } = useNotification();

  const [confirmModal, setConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = () => {
    console.log(match);
    setConfirmModal(true);
  };

  const handleCloseModal = () => {
    setConfirmModal(false);
  };

  const handleMatchConfirm = async (idMatch) => {
    setIsLoading(true);
    try {
      await confirmMatch(idMatch);
      const { error, response } = useMatchStore.getState();
      handleCloseModal();
      if (!error) {
        showNotification(response, "success");
      } else {
        showNotification(response, "error");
        setTimeout(() => setIsLoading(false), 1000);
      }
    } catch {
      showNotification("Erro ao confirmar Devolução", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={style.chatLayout}>
        <HeaderChat
          item={item}
          usuario={person.nome}
          onBack={onBack}
          openModal={handleOpenModal}
        />
        <ContentChat listMessage={mensagens} currentUserId={currentUserId} />
        <Input />
      </div>
      <ModalConfirm
        open={confirmModal}
        onClose={handleCloseModal}
        title={"Deseja confirmar a devolução do item?"}
        content={"Essa operação não poderá ser desfeita."}
      >
        <CustomButton
          type="button"
          variant="default"
          size="lg"
          onClick={handleCloseModal}
          disabled={isLoading}
        >
          {isLoading ? "Cancelando..." : "Cancelar"}
        </CustomButton>

        <CustomButton
          type="button"
          variant={"default"}
          size="lg"
          onClick={() => handleMatchConfirm(match)}
          disabled={isLoading}
        >
          {isLoading ? "Confirmando..." : "Confirmar"}
        </CustomButton>
      </ModalConfirm>
    </>
  );
};

export default Chat;
