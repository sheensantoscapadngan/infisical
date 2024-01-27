/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Button, Input } from "@app/components/v2";
import { CreateSendSecretForm } from "@app/views/SendSecret/components/CreateSendSecretForm";

export default function SendSecret() {
  const { t } = useTranslation();
  const [isAddModalOpen, setAddModalState] = useState(false);

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
            A secure and efficient way to share text-based sensitive information with intended
            recipients
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-2/5">
              <Input
                className="bg-mineshaft-800 placeholder-mineshaft-50 duration-200 focus:bg-mineshaft-700/80"
                placeholder="Search by folder name, key name, comment..."
                leftIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              />
            </div>
            <div className="flex-grow" />
            <div className="mr-20 flex items-center">
              <Button
                variant="outline_bg"
                leftIcon={<FontAwesomeIcon icon={faPlus} />}
                className="h-10 rounded-r-none"
                onClick={() => setAddModalState(true)}
              >
                Add Secret
              </Button>
            </div>
          </div>
          <div className="thin-scrollbar mt-3 overflow-y-auto overflow-x-hidden rounded-md bg-mineshaft-800 text-left text-sm text-bunker-300">
            <div className="flex flex-col" id="dashboard">
              <div className="flex border-b border-mineshaft-600 font-medium">
                <div style={{ width: "2.8rem" }} className="flex-shrink-0 px-4 py-3" />
                <div
                  className="flex w-80 flex-shrink-0 items-center border-r border-mineshaft-600 px-4 py-2"
                  role="button"
                  tabIndex={0}
                >
                  Key
                  <FontAwesomeIcon icon={faArrowUp} className="ml-2" />
                </div>
                <div className="flex-grow px-4 py-2">Value</div>
              </div>
            </div>
          </div>
          <CreateSendSecretForm
            isAddModalOpen={isAddModalOpen}
            setAddModalState={setAddModalState}
          />
        </div>
      </div>
    </>
  );
}

Object.assign(SendSecret, { requireAuth: true });
