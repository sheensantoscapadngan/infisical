/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Button, Input } from "@app/components/v2";
import { CreateSendSecretForm } from "@app/views/SendSecret/components/CreateSendSecretForm";
import { useGetSendSecretsV1 } from "@app/hooks/api/sendSecret";
import { useWorkspace } from "@app/context";
import { useGetUserWsKey } from "@app/hooks/api";
import { SendSecretListView } from "@app/views/SendSecret/components/SendSecretListView";
import { SendSecretURLModal } from "@app/views/SendSecret/components/SendSecretListView/SendSecretURLModal";
import { usePopUp } from "@app/hooks";
import { DecryptedSendSecret } from "@app/hooks/api/sendSecret/types";

export default function SendSecret() {
  const { t } = useTranslation();
  const [isAddModalOpen, setAddModalState] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?._id || "";
  const { data: decryptFileKey } = useGetUserWsKey(workspaceId);
  const { popUp, handlePopUpToggle, handlePopUpOpen } = usePopUp(["confirmSendURL"] as const);

  const { data: sendSecrets } = useGetSendSecretsV1({
    decryptFileKey: decryptFileKey!
  });

  const onSendSecretCreation = (sendSecret: DecryptedSendSecret) => {
    handlePopUpOpen("confirmSendURL", sendSecret);
  };

  const filteredSecrets = useMemo(() => {
    if (!sendSecrets) {
      return [];
    }

    return sendSecrets.filter((value) =>
      value.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, sendSecrets]);

  return (
    <>
      <Head>
        <title>{t("common.head-title", { title: t("settings.org.title") })}</title>
        <link rel="icon" href="/infisical.ico" />
      </Head>
      <div className="container mx-auto flex flex-col justify-between bg-bunker-800 text-white">
        <div className="mx-auto mb-6 w-full max-w-7xl py-6 px-6">
          <p className="mr-4 mb-4 text-3xl font-semibold text-white">Send Secrets</p>
          <div className="mb-6 text-lg text-mineshaft-300">
            A secure way to share text-based sensitive information with intended recipients
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-2/5">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-mineshaft-800 placeholder-mineshaft-50 duration-200 focus:bg-mineshaft-700/80"
                placeholder="Search by key name..."
                leftIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              />
            </div>
            <div className="flex-grow" />
            <div className="mr-20 flex items-center">
              <Button
                colorSchema="primary"
                leftIcon={<FontAwesomeIcon icon={faPlus} />}
                className="h-10 rounded-r-none"
                onClick={() => setAddModalState(true)}
              >
                Add Secret
              </Button>
            </div>
          </div>
          {!!filteredSecrets.length && (
            <div className="thin-scrollbar mt-3 overflow-y-auto overflow-x-hidden rounded-md bg-mineshaft-800 text-left text-sm text-bunker-300">
              <div className="flex flex-col" id="dashboard">
                <div className="group flex border-b border-mineshaft-600 font-medium">
                  <div
                    className="flex w-1/4 flex-shrink-0 items-center border-mineshaft-600 px-4 py-2"
                    role="button"
                    tabIndex={0}
                  >
                    Key
                  </div>
                  <div className="flex w-1/6 border-x border-mineshaft-600 px-4 py-2">
                    Valid Until
                  </div>
                  <div className="flex-grow px-4 py-2">Value</div>
                </div>
                <SendSecretListView sendSecrets={filteredSecrets} />
              </div>
            </div>
          )}
          <CreateSendSecretForm
            isAddModalOpen={isAddModalOpen}
            setAddModalState={setAddModalState}
            decryptFileKey={decryptFileKey!}
            onSendSecretCreation={onSendSecretCreation}
          />
          <SendSecretURLModal popUp={popUp} handlePopUpToggle={handlePopUpToggle} />
        </div>
      </div>
    </>
  );
}

Object.assign(SendSecret, { requireAuth: true });
