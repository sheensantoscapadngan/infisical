import {
  decryptAssymmetric,
  decryptSymmetric
} from "@app/components/utilities/cryptography/crypto";
import { apiRequest } from "@app/config/request";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { UserWsKeyPair } from "../types";
import { DecryptedSendSecret, EncryptedSendSecret } from "./types";

export const secretKeys = {
  // this is also used in secretSnapshot part
  getSendSecrets: () => ["send-secrets"] as const
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

    const key = decryptSymmetric({
      ciphertext: encryptedSecret.secretKeyCiphertext,
      tag: encryptedSecret.secretKeyTag,
      iv: encryptedSecret.secretKeyIV,
      key: sendEncryptionKey
    });

    const value = decryptSymmetric({
      ciphertext: encryptedSecret.secretValueCiphertext,
      tag: encryptedSecret.secretValueTag,
      iv: encryptedSecret.secretValueIV,
      key: sendEncryptionKey
    });

    return {
      key,
      value,
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
