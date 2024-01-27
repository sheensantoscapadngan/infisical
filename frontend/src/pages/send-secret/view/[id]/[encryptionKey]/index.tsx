import { useNotificationContext } from "@app/components/context/Notifications/NotificationProvider";
import { Button, TextArea } from "@app/components/v2";
import { useGetSendSecretForViewV1 } from "@app/hooks/api/sendSecret/queries";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export default function ViewSendSecret() {
  const { t } = useTranslation();

  const { createNotification } = useNotificationContext();
  const router = useRouter();

  const onCopyValueToClipboard = () => {
    navigator.clipboard.writeText(sendSecret?.value || "");
    createNotification({
      type: "info",
      text: "Copied value"
    });
  };

  const { id, encryptionKey } = router.query;

  const { data: sendSecret } = useGetSendSecretForViewV1({
    encryptionKey: encryptionKey as string,
    sendSecretId: id as string
  });

  return (
    <div className="flex max-h-screen min-h-screen flex-col justify-center overflow-y-auto bg-gradient-to-tr from-mineshaft-600 via-mineshaft-800 to-bunker-700 px-6">
      <Head>
        <title>{t("common.head-title", { title: "View Secret" })}</title>
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
      <div className="mx-auto flex w-full flex-col items-center justify-center">
        <h1 className="mb-8 bg-gradient-to-b from-white to-bunker-200 bg-clip-text text-center text-xl font-medium text-transparent">
          Infisical Send
        </h1>
        <TextArea
          isDisabled
          className="max-w-lg border border-mineshaft-600 text-sm"
          value={sendSecret?.value || ""}
        />
      </div>
      <Button
        key="layout-create-project-submit"
        className="mr-4 mt-6 self-center pr-6 pl-6"
        type="submit"
        onClick={onCopyValueToClipboard}
      >
        Copy Value
      </Button>
      <div className="pb-28" />
    </div>
  );
}
