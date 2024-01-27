import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SecretInput, Tooltip, IconButton, Input } from "@app/components/v2";
import { faCheck, faClose, faCopy } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useWorkspace } from "@app/context";
import { DecryptedSendSecret } from "@app/hooks/api/sendSecret/types";
import { z } from "zod";
import { useToggle } from "@app/hooks";
import { useEffect } from "react";

type Props = {
  sendSecret: DecryptedSendSecret;
  onDeleteSecret: (sec: DecryptedSendSecret) => void;
};

export const formSchema = z.object({
  key: z.string().trim(),
  value: z.string().transform((val) => (val.at(-1) === "\n" ? `${val.trim()}\n` : val.trim()))
});

export type TFormSchema = z.infer<typeof formSchema>;

export const SendSecretItem = (props: Props) => {
  const { sendSecret, onDeleteSecret } = props;

  const { control } = useForm<TFormSchema>({
    defaultValues: {
      key: sendSecret.key,
      value: sendSecret.value
    }
  });
  const [isSecretURLCopied, setIsSecretURLCopied] = useToggle(false);

  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSecretURLCopied) {
      timer = setTimeout(() => setIsSecretURLCopied.off(), 2000);
    }
    return () => clearTimeout(timer);
  }, [isSecretURLCopied]);

  const copyURLToClipboard = () => {
    navigator.clipboard.writeText(sendSecret.url);
    setIsSecretURLCopied.on();
  };

  return (
    <>
      <form>
        <div className="border-b border-mineshaft-600 bg-mineshaft-800 shadow-none hover:bg-mineshaft-700">
          <div className="group flex">
            <div className="flex h-11 w-1/4 flex-shrink-0 items-center px-4 py-2">
              <Controller
                name="key"
                control={control}
                render={({ field }) => (
                  <Input
                    isReadOnly
                    autoComplete="off"
                    autoCapitalization={currentWorkspace?.autoCapitalization}
                    variant="plain"
                    {...field}
                    className="w-full px-0 focus:text-bunker-100 focus:ring-transparent"
                  />
                )}
              />
            </div>
            <div className="flex  w-1/6 flex-shrink-0 items-center border-x border-mineshaft-600 py-1 pl-4 pr-2">
              {sendSecret.expiresAt.toUTCString()}
            </div>
            <div
              className="flex flex-grow items-center border-mineshaft-600 py-1 pl-4"
              tabIndex={0}
              role="button"
            >
              <Controller
                name="value"
                control={control}
                key="secret-value"
                render={({ field }) => (
                  <SecretInput
                    isReadOnly
                    key="secret-value"
                    {...field}
                    containerClassName="py-1.5 rounded-md transition-all group-hover:mr-2"
                  />
                )}
              />
              <div key="actions" className="flex h-8 flex-shrink-0 self-start transition-all">
                <Tooltip content="Copy Send URL">
                  <IconButton
                    ariaLabel="copy-value"
                    variant="plain"
                    size="sm"
                    className="w-0 overflow-hidden p-0 group-hover:mr-2 group-hover:w-5"
                    onClick={copyURLToClipboard}
                  >
                    <FontAwesomeIcon icon={isSecretURLCopied ? faCheck : faCopy} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key="options-save"
                className="flex h-10 flex-shrink-0 items-center space-x-4 px-3"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
              >
                <Tooltip content="Delete">
                  <IconButton
                    ariaLabel="more"
                    variant="plain"
                    size="md"
                    className="p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => onDeleteSecret(sendSecret)}
                  >
                    <FontAwesomeIcon icon={faClose} size="lg" />
                  </IconButton>
                </Tooltip>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </form>
    </>
  );
};
