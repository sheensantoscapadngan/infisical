import { DecryptedSendSecret } from "@app/hooks/api/sendSecret/types";
import { SendSecretItem } from "./SendSecretItem";

type Props = {
  sendSecrets: DecryptedSendSecret[];
};

export const SendSecretListView = (props: Props) => {
  const { sendSecrets } = props;
  return (
    <>
      <div className="flex flex-col" key={`${sendSecrets.length}`}>
        {sendSecrets.map((sendSecret) => {
          return <SendSecretItem sendSecret={sendSecret} />;
        })}
      </div>
    </>
  );
};
