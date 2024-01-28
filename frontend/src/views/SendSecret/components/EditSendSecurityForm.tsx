import { Button, FormControl, Modal, ModalContent, SecretInput } from "@app/components/v2";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const typeSchema = z.object({
  password: z.string()
});

type TFormSchema = z.infer<typeof typeSchema>;

type Props = {
  isOpen: boolean;
  onOpenChange: (state: boolean) => void;
  onClose: () => void;
  onConfirm: (password: string) => void;
};

export const EditSendSecurityForm = ({ isOpen, onOpenChange, onClose, onConfirm }: Props) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<TFormSchema>({ resolver: zodResolver(typeSchema) });
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent title="Configure security settings for Send">
        <form
          onSubmit={handleSubmit(async ({ password }) => {
            await onConfirm(password);
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
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
