import { useNotificationContext } from "@app/components/context/Notifications/NotificationProvider";
import { Button, Input, TextArea } from "@app/components/v2";
import { useViewSendSecretV1 } from "@app/hooks/api/sendSecret/queries";
import { AxiosError } from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ViewSendSecret() {
  const { t } = useTranslation();

  const router = useRouter();
  const { createNotification } = useNotificationContext();
  const { id, encryptionKey } = router.query;
  const [password, setPassword] = useState("");

  const {
    data: sendSecret,
    error,
    refetch
  } = useViewSendSecretV1({
    encryptionKey: encryptionKey as string,
    sendSecretId: id as string,
    password
  });

  const onCopyValueToClipboard = useCallback(() => {
    navigator.clipboard.writeText(sendSecret?.value || "");
    createNotification({
      type: "info",
      text: "Copied value"
    });
  }, [sendSecret]);

  const isAccessError = (error: unknown) => (error as AxiosError)?.response?.status === 401;

  const onUnlockSecret = () => {
    refetch();
  };

  return (
    <div className="flex max-h-screen min-h-screen flex-col justify-center overflow-y-auto bg-gradient-to-tr from-mineshaft-600 via-mineshaft-800 to-bunker-700 px-6">
      <Head>
        <title>{t("common.head-title", { title: t("send.view-secret-title") })}</title>
        <link rel="icon" href="/infisical.ico" />
        <meta property="og:image" content="/images/message.png" />
        <meta property="og:title" content={t("login.og-title") ?? ""} />
        <meta name="og:description" content={t("login.og-description") ?? ""} />
      </Head>
      <Link href="/">
        <div className="mb-4 mt-20 flex justify-center">
          <Image src="/images/gradientLogo.svg" height={90} width={120} alt="Infisical logo" />
        </div>
      </Link>
      {isAccessError(error) && (
        <>
          <div className="mx-auto flex flex-col items-center justify-center sm:w-5/12 lg:w-4/12">
            <h1 className="mb-5 bg-gradient-to-b from-white to-bunker-200 bg-clip-text text-center text-xl font-medium text-transparent">
              Infisical
            </h1>
            <p className="justify mb-5 text-gray-400">{t("send.view-secret-description")}</p>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password..."
              isRequired
              autoComplete="current-password"
              id="current-password"
              className="select:-webkit-autofill:focus h-10"
            />
            <Button
              key="view-send-secret-unlock-submit"
              className="mr-4 mt-6 self-center pr-6 pl-6"
              type="submit"
              onClick={onUnlockSecret}
            >
              Unlock
            </Button>
          </div>
        </>
      )}
      {!!sendSecret && (
        <>
          <div className="mx-auto flex w-full flex-col items-center justify-center">
            <h1 className="mb-5 bg-gradient-to-b from-white to-bunker-200 bg-clip-text text-center text-xl font-medium text-transparent">
              Infisical
            </h1>
            <h2 className="mb-2 max-w-md bg-black bg-gradient-to-b from-white to-bunker-200 bg-clip-text text-left text-base font-normal text-transparent">
              {sendSecret.key}
            </h2>
            <TextArea
              isDisabled
              className="h-40 max-w-md border border-mineshaft-600 text-sm"
              value={sendSecret?.value || ""}
            />
          </div>
          <Button
            key="view-send-secret-copy-clipboard"
            className="mr-4 mt-6 self-center pr-6 pl-6"
            type="submit"
            onClick={onCopyValueToClipboard}
          >
            Copy Value
          </Button>
        </>
      )}
      <div className="pb-28" />
    </div>
  );
}
