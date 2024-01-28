import { useNotificationContext } from "@app/components/context/Notifications/NotificationProvider";
import { DeleteActionModal } from "@app/components/v2";
import { usePopUp } from "@app/hooks";
import { useDeleteSendSecretV1 } from "@app/hooks/api/sendSecret/mutations";
import { DecryptedSendSecret } from "@app/hooks/api/sendSecret/types";
import { useCallback } from "react";
import { SendSecretItem } from "./SendSecretItem";

type Props = {
  sendSecrets: DecryptedSendSecret[];
};

export const SendSecretListView = (props: Props) => {
  const { sendSecrets } = props;
  const { popUp, handlePopUpToggle, handlePopUpOpen, handlePopUpClose } = usePopUp([
    "deleteSendSecret",
    "editSendSecurity"
  ] as const);

  const { createNotification } = useNotificationContext();
  const { mutateAsync: deleteSendSecretV1 } = useDeleteSendSecretV1();

  const handleSecretDelete = useCallback(async () => {
    await deleteSendSecretV1({ id: (popUp.deleteSendSecret?.data as DecryptedSendSecret).id });
    handlePopUpClose("deleteSendSecret");
    createNotification({
      type: "success",
      text: "Successfully deleted secret"
    });
  }, [(popUp.deleteSendSecret?.data as DecryptedSendSecret)?.key]);

  const onDeleteSecret = useCallback(
    (secret: DecryptedSendSecret) => handlePopUpOpen("deleteSendSecret", secret),
    []
  );

  return (
    <>
      <div className="flex flex-col" key={`${sendSecrets.length}`}>
        {sendSecrets.map((sendSecret) => {
          return (
            <SendSecretItem
              sendSecret={sendSecret}
              onDeleteSecret={onDeleteSecret}
              handlePopUpOpen={handlePopUpOpen}
            />
          );
        })}
      </div>
      <DeleteActionModal
        isOpen={popUp.deleteSendSecret.isOpen}
        deleteKey={(popUp.deleteSendSecret?.data as DecryptedSendSecret)?.key}
        title="Do you want to delete this send secret?"
        onChange={(isOpen) => handlePopUpToggle("deleteSendSecret", isOpen)}
        onDeleteApproved={handleSecretDelete}
        buttonText="Delete"
      />
    </>
  );
};
