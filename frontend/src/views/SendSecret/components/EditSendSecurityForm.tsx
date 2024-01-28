import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button, FormControl, Modal, ModalContent, SecretInput } from "@app/components/v2";

const typeSchema = z.object({
  password: z.string()
});

type TFormSchema = z.infer<typeof typeSchema>;

type Props = {
  isOpen: boolean;
  handleOnOpenChange: (state: boolean) => void;
  handleOnClose: () => void;
  handleOnConfirm: (password: string) => void;
};

export const EditSendSecurityForm = ({
  isOpen,
  handleOnOpenChange,
  handleOnClose,
  handleOnConfirm
}: Props) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<TFormSchema>({ resolver: zodResolver(typeSchema) });

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOnOpenChange}>
      <ModalContent title="Configure security settings for Send">
        <form
          onSubmit={handleSubmit(async ({ password }) => {
            await handleOnConfirm(password);
            reset();
          })}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormControl
                label="New password"
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
            <Button key="layout-edit-send-security-submit" className="mr-4" type="submit">
              Edit
            </Button>
            <Button
              key="layout-edit-send-security-cancel"
              variant="plain"
              colorSchema="secondary"
              onClick={handleOnClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
