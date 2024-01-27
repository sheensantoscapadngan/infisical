import { UserWsKeyPair } from "../types";

export type TCreateSendSecretV1DTO = {
  key: string;
  expiresIn: number;
  latestFileKey: UserWsKeyPair;
  value: string;
};
