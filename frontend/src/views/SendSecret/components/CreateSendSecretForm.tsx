import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  "7d": 604800
};

const typeSchema = z.object({
  key: z.string(),
  value: z.string(),
  expiresIn: z.string()
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
    } catch (error) {}
  };

  return (
    <Modal isOpen={isAddModalOpen} onOpenChange={(state) => setAddModalState(state)}>
      <ModalContent title="Add secret" subTitle="Create a secret for sharing">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormControl label="Key" isError={Boolean(errors?.key)} errorText={errors?.key?.message}>
            <Input placeholder="Type your secret name" />
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
};
