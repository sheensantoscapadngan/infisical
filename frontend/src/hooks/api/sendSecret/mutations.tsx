import crypto from "crypto";
import {
  createHash,
  decryptAssymmetric,
  encryptSymmetric
} from "@app/components/utilities/cryptography/crypto";
import { MutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DecryptedSendSecret,
  TCreateSendSecretV1DTO,
  TDeleteSendSecretV1DTO,
  TUpdateSendSecretSecurityV1DTO
} from "./types";
import { apiRequest } from "@app/config/request";
import { decryptSendSecrets, secretKeys } from "./queries";

const encryptSendSecret = (encryptionKey: string, key: string, value: string) => {
  // encrypt key
  const {
    ciphertext: secretKeyCiphertext,
    iv: secretKeyIV,
    tag: secretKeyTag
  } = encryptSymmetric({
    plaintext: key,
    key: encryptionKey
  });

  // encrypt value
  const {
    ciphertext: secretValueCiphertext,
    iv: secretValueIV,
    tag: secretValueTag
  } = encryptSymmetric({
    plaintext: value,
    key: encryptionKey
  });

  return {
    secretKeyCiphertext,
    secretKeyIV,
    secretKeyTag,
    secretValueCiphertext,
    secretValueIV,
    secretValueTag
  };
};

export const useCreateSendSecretV1 = ({
  options
}: {
  options?: Omit<MutationOptions<{}, {}, TCreateSendSecretV1DTO>, "mutationFn">;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation<DecryptedSendSecret, {}, TCreateSendSecretV1DTO>({
    mutationFn: async ({ key, value, expiresIn, latestFileKey, password }) => {
      const PRIVATE_KEY = localStorage.getItem("PRIVATE_KEY") as string;

      // Get key for encrypting send secret encryption key
      const privateKey = latestFileKey
        ? decryptAssymmetric({
            ciphertext: latestFileKey.encryptedKey,
            nonce: latestFileKey.nonce,
            publicKey: latestFileKey.sender.publicKey,
            privateKey: PRIVATE_KEY
          })
        : crypto.randomBytes(16).toString("hex");

      // generate encryption key for creating send
      const sendSecretEncryptionKey = crypto.randomBytes(16).toString("hex");

      // encrypt generated send encryption key for saving
      const {
        ciphertext: encryptionKeyCiphertext,
        iv: encryptionKeyIV,
        tag: encryptionKeyTag
      } = encryptSymmetric({
        plaintext: sendSecretEncryptionKey,
        key: privateKey
      });

      const {
        secretKeyCiphertext,
        secretKeyIV,
        secretKeyTag,
        secretValueCiphertext,
        secretValueIV,
        secretValueTag
      } = encryptSendSecret(sendSecretEncryptionKey, key, value);

      const reqBody = {
        encryptionKeyCiphertext,
        encryptionKeyIV,
        encryptionKeyTag,
        expiresIn,
        secretKeyCiphertext,
        secretKeyIV,
        secretKeyTag,
        secretValueCiphertext,
        secretValueIV,
        secretValueTag,
        password: password ? createHash(password, sendSecretEncryptionKey) : undefined
      };

      const { data } = await apiRequest.post(`/api/v1/send-secrets`, reqBody);
      return decryptSendSecrets([data.sendSecret], latestFileKey)[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(secretKeys.getSendSecrets());
    },
    ...options
  });
};

export const useDeleteSendSecretV1 = ({
  options
}: {
  options?: Omit<MutationOptions<{}, {}, TDeleteSendSecretV1DTO>, "mutationFn">;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation<{}, {}, TDeleteSendSecretV1DTO>({
    mutationFn: async ({ id }) => {
      const { data } = await apiRequest.delete(`/api/v1/send-secrets/${id}`);

      return data;
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries(secretKeys.getSendSecrets());
    },
    ...options
  });
};

export const useUpdateSendSecretSecurityV1 = ({
  options
}: {
  options?: Omit<MutationOptions<{}, {}, TUpdateSendSecretSecurityV1DTO>, "mutationFn">;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation<{}, {}, TUpdateSendSecretSecurityV1DTO>({
    mutationFn: async ({ id, password, encryptionKey }) => {
      const { data } = await apiRequest.patch(`/api/v1/send-secrets/${id}/security`, {
        password: createHash(password, encryptionKey)
      });

      return data;
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries(secretKeys.getSendSecrets());
    },
    ...options
  });
};
