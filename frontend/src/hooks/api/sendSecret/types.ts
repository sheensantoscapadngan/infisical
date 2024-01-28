import { UserWsKeyPair } from "../types";

export type TCreateSendSecretV1DTO = {
  key: string;
  expiresIn: number;
  latestFileKey: UserWsKeyPair;
  value: string;
  password?: string;
  workspaceId: string;
};

export type TGetSendSecretsV1DTO = {
  decryptFileKey: UserWsKeyPair;
  workspaceId: string;
};

export type TViewSendSecretV1DTO = {
  encryptionKey: string;
  sendSecretId: string;
  password?: string;
};

export type TDeleteSendSecretV1DTO = {
  id: string;
  workspaceId: string;
};

export type TUpdateSendSecretSecurityV1DTO = {
  id: string;
  password: string;
  encryptionKey: string;
  workspaceId: string;
};

export type EncryptedSendSecret = {
  encryptionKeyCiphertext: string;
  encryptionKeyIV: string;
  encryptionKeyTag: string;
  expiresAt: string;
  secretKeyCiphertext: string;
  secretKeyIV: string;
  secretKeyTag: string;
  secretValueCiphertext: string;
  secretValueIV: string;
  secretValueTag: string;
  url: string;
  userId: string;
  workspaceId: string;
  _id: string;
  __v: number;
};

export type DecryptedSendSecret = {
  encryptionKey: string;
  expiresAt: Date;
  id: string;
  key: string;
  url: string;
  value: string;
};

export type DecryptedSendSecretForView = Pick<DecryptedSendSecret, "key" | "value">;
