import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, Input, Modal, ModalContent, SecretInput } from "@app/components/v2";

const typeSchema = z.object({
    key: z.string(),
    value: z.string().optional()
  });
  
type TFormSchema = z.infer<typeof typeSchema>;

type Props = {
  isAddModalOpen: boolean;
  setAddModalState: (state: boolean) => void;
};

export const CreateSendSecretForm = (props: Props) => {
    const { isAddModalOpen, setAddModalState } = props;
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<TFormSchema>({ resolver: zodResolver(typeSchema) });

    const handleFormSubmit = async ({ key, value }: TFormSchema) => {
        try {
         
        } catch (error) {

        }
    };

    return (
        <Modal
          isOpen={isAddModalOpen}
          onOpenChange={(state) => setAddModalState(state)}
        >
          <ModalContent
            title="Add secret"
            subTitle="Create a secret for sharing"
          >
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <FormControl label="Key" isError={Boolean(errors?.key)} errorText={errors?.key?.message}>
                <Input
                  placeholder="Type your secret name"
                />
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
              <div className="mt-7 flex items-center">
                <Button
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  key="layout-create-project-submit"
                  className="mr-4"
                  type="submit"
                >
                  Create Send
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
}
