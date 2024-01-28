import {
  createHash,
  decryptAssymmetric,
  decryptSymmetric
} from "@app/components/utilities/cryptography/crypto";
import { apiRequest } from "@app/config/request";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { UserWsKeyPair } from "../types";
import { DecryptedSendSecret, DecryptedSendSecretForView, EncryptedSendSecret } from "./types";

export const secretKeys = {
  // this is also used in secretSnapshot part
  getSendSecrets: () => ["send-secrets"] as const,
  getSendSecret: (sendSecretId: string) => [{ sendSecretId }, "send-secrets"] as const
};

export const decryptSendSecretDetails = (
  encryptedSecret: EncryptedSendSecret,
  encryptionKey: string
) => {
  const key = decryptSymmetric({
    ciphertext: encryptedSecret.secretKeyCiphertext,
    tag: encryptedSecret.secretKeyTag,
    iv: encryptedSecret.secretKeyIV,
    key: encryptionKey
  });

  const value = decryptSymmetric({
    ciphertext: encryptedSecret.secretValueCiphertext,
    tag: encryptedSecret.secretValueTag,
    iv: encryptedSecret.secretValueIV,
    key: encryptionKey
  });

  return { key, value };
};

export const decryptSendSecrets = (
  encryptedSecrets: EncryptedSendSecret[],
  decryptFileKey: UserWsKeyPair
): DecryptedSendSecret[] => {
  const PRIVATE_KEY = localStorage.getItem("PRIVATE_KEY") as string;

  const privateEncryptionKey = decryptAssymmetric({
    ciphertext: decryptFileKey.encryptedKey,
    nonce: decryptFileKey.nonce,
    publicKey: decryptFileKey.sender.publicKey,
    privateKey: PRIVATE_KEY
  });

  const { protocol, hostname, port } = window.location;
  const portSuffix = port && port !== "80" ? `:${port}` : "";
  const siteURL = `${protocol}//${hostname}${portSuffix}`;

  return encryptedSecrets.map((encryptedSecret) => {
    const sendEncryptionKey = decryptSymmetric({
      ciphertext: encryptedSecret.encryptionKeyCiphertext,
      tag: encryptedSecret.encryptionKeyTag,
      iv: encryptedSecret.encryptionKeyIV,
      key: privateEncryptionKey
    });

    const { key, value } = decryptSendSecretDetails(encryptedSecret, sendEncryptionKey);

    return {
      key,
      value,
      encryptionKey: sendEncryptionKey,
      id: encryptedSecret._id,
      url: `${siteURL}/send-secret/view/${encryptedSecret._id}/${sendEncryptionKey}`,
      expiresAt: new Date(encryptedSecret.expiresAt)
    };
  });
};

const fetchEncryptedSendSecrets = async () => {
  const { data } = await apiRequest.get<{ sendSecrets: EncryptedSendSecret[] }>(
    "/api/v1/send-secrets"
  );

  return data.sendSecrets;
};

const fetchEncryptedSendSecret = async (
  sendSecretId: string,
  encryptionKey: string,
  password?: string
) => {
  const { data } = await apiRequest.get<{ sendSecret: EncryptedSendSecret }>(
    `/api/v1/send-secrets/${sendSecretId}`,
    {
      params: {
        password: password ? createHash(password, encryptionKey) : undefined
      }
    }
  );

  return data.sendSecret;
};

export const useGetSendSecretsV1 = ({
  decryptFileKey,
  options
}: { decryptFileKey: UserWsKeyPair } & {
  options?: Omit<
    UseQueryOptions<
      EncryptedSendSecret[],
      unknown,
      DecryptedSendSecret[],
      ReturnType<typeof secretKeys.getSendSecrets>
    >,
    "queryKey" | "queryFn"
  >;
}) =>
  useQuery({
    ...options,
    enabled: Boolean(decryptFileKey) && (options?.enabled ?? true),
    queryKey: secretKeys.getSendSecrets(),
    queryFn: async () => fetchEncryptedSendSecrets(),
    select: (secrets: EncryptedSendSecret[]) => decryptSendSecrets(secrets, decryptFileKey)
  });

export const useGetSendSecretForViewV1 = ({
  encryptionKey,
  password,
  options,
  sendSecretId
}: { encryptionKey: string; sendSecretId: string; password?: string } & {
  options?: Omit<
    UseQueryOptions<
      EncryptedSendSecret,
      unknown,
      DecryptedSendSecretForView,
      ReturnType<typeof secretKeys.getSendSecret>
    >,
    "queryKey" | "queryFn"
  >;
}) =>
  useQuery({
    ...options,
    enabled: Boolean(encryptionKey && sendSecretId) && (options?.enabled ?? true),
    queryKey: secretKeys.getSendSecret(sendSecretId),
    queryFn: async () => fetchEncryptedSendSecret(sendSecretId, encryptionKey, password),
    select: (secret: EncryptedSendSecret) => decryptSendSecretDetails(secret, encryptionKey)
  });
