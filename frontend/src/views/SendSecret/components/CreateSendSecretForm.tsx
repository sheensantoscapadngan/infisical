import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useNotificationContext } from "@app/components/context/Notifications/NotificationProvider";
import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalContent,
  SecretInput,
  Select,
  SelectItem
} from "@app/components/v2";
import { useCreateSendSecretV1 } from "@app/hooks/api/sendSecret/mutations";
import { DecryptedSendSecret } from "@app/hooks/api/sendSecret/types";
import { UserWsKeyPair } from "@app/hooks/api/types";

const expirations = [
  { label: "1 hour", value: "1h" },
  { label: "1 day", value: "1d" },
  { label: "2 days", value: "2d" },
  { label: "3 days", value: "3d" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" }
];

const expirationMapping: { [key: string]: number } = {
  "1h": 3600,
  "1d": 86400,
  "2d": 172800,
  "3d": 259200,
  "7d": 604800,
  "30d": 2592000
};

const typeSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  expiresIn: z.string(),
  password: z.string().optional()
});

type TFormSchema = z.infer<typeof typeSchema>;

type Props = {
  isAddModalOpen: boolean;
  setAddModalState: (state: boolean) => void;
  decryptFileKey: UserWsKeyPair;
  onSendSecretCreation: (sendSecret: DecryptedSendSecret) => void;
};

export const CreateSendSecretForm = (props: Props) => {
  const { isAddModalOpen, setAddModalState, onSendSecretCreation } = props;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TFormSchema>({ resolver: zodResolver(typeSchema) });
  const { decryptFileKey } = props;

  const { mutateAsync: createSendSecretV1 } = useCreateSendSecretV1();
  const { createNotification } = useNotificationContext();

  const handleFormSubmit = async ({ key, value, expiresIn, password }: TFormSchema) => {
    try {
      const sendSecret = await createSendSecretV1({
        key: key.trim(),
        value,
        latestFileKey: decryptFileKey!,
        expiresIn: expirationMapping[expiresIn],
        password
      });

      setAddModalState(false);
      reset();
      createNotification({
        type: "success",
        text: "Successfully created secret"
      });
      onSendSecretCreation(sendSecret);
    } catch (error) {
      createNotification({
        type: "error",
        text: "Something went wrong"
      });
    }
  };

  const handleOnOpenChange = useCallback((state: boolean) => setAddModalState(state), []);

  return (
    <Modal isOpen={isAddModalOpen} onOpenChange={handleOnOpenChange}>
      <ModalContent title="Add secret" subTitle="Create a secret for sharing">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormControl label="Key" isError={Boolean(errors?.key)} errorText={errors?.key?.message}>
            <Input {...register("key")} placeholder="Type your secret name" />
          </FormControl>
          <Controller
            control={control}
            name="value"
            render={({ field }) => (
              <FormControl
                label="Value"
                isError={Boolean(errors?.value)}
                errorText={errors?.value?.message}
              >
                <SecretInput
                  {...field}
                  containerClassName="text-bunker-300 hover:border-primary-400/50 border border-mineshaft-600 bg-mineshaft-900 px-2 py-1.5"
                />
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="expiresIn"
            defaultValue="1h"
            render={({ field: { onChange, ...field }, fieldState: { error } }) => (
              <FormControl label="Expiration" errorText={error?.message} isError={Boolean(error)}>
                <Select
                  defaultValue={field.value}
                  {...field}
                  onValueChange={(e) => onChange(e)}
                  className="w-full"
                >
                  {expirations.map(({ label, value }) => (
                    <SelectItem value={String(value || "")} key={`api-key-expiration-${label}`}>
                      {label}
                    </SelectItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl
                label="Password (optional)"
                isError={Boolean(errors?.password)}
                errorText={errors?.password?.message}
              >
                <SecretInput
                  {...field}
                  containerClassName="text-bunker-300 hover:border-primary-400/50 border border-mineshaft-600 bg-mineshaft-900 px-2 py-1.5"
                />
              </FormControl>
            )}
          />

          <div className="mt-7 flex items-center">
            <Button
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              key="layout-create-project-submit"
              className="mr-4"
              type="submit"
            >
              Create
            </Button>
            <Button
              key="layout-cancel-create-project"
              variant="plain"
              colorSchema="secondary"
              onClick={() => setAddModalState(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
