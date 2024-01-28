import { useCallback } from "react";

import { Button, Modal, ModalContent, TextArea } from "@app/components/v2";
import { DecryptedSendSecret } from "@app/hooks/api/sendSecret/types";
import { UsePopUpState } from "@app/hooks/usePopUp";

type Props = {
  popUp: UsePopUpState<["confirmSendURL"]>;
  handlePopUpToggle: (popUpName: keyof UsePopUpState<["confirmSendURL"]>, state?: boolean) => void;
};

export const SendSecretURLModal = ({ popUp, handlePopUpToggle }: Props) => {
  const sendSecret = popUp.confirmSendURL.data as DecryptedSendSecret;

  const onCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(sendSecret.url);

    handlePopUpToggle("confirmSendURL", false);
  }, [sendSecret]);

  return (
    <Modal
      isOpen={popUp.confirmSendURL.isOpen}
      onOpenChange={(open) => {
        handlePopUpToggle("confirmSendURL", open);
      }}
    >
      {!!sendSecret && (
        <ModalContent title={`Send URL for ${sendSecret.key}`}>
          <TextArea
            readOnly
            className="border border-mineshaft-600 text-sm"
            rows={5}
            value={sendSecret.url}
          />
          <div className="mt-8 flex items-center">
            <Button className="mr-4" type="submit" onClick={onCopyToClipboard}>
              Copy to Clipboard
            </Button>
          </div>
        </ModalContent>
      )}
    </Modal>
  );
};
