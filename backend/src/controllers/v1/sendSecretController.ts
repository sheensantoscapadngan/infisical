import { Request, Response } from "express";
import { validateRequest } from "../../helpers/validation";
import { SendSecretService } from "../../services/SendSecret";
import * as reqValidator from "../../validation/sendSecret";

export const createSendSecret = async (req: Request, res: Response) => {
  const {
    body: {
      encryptionKeyCiphertext,
      encryptionKeyIV,
      encryptionKeyTag,
      expiresIn,
      secretKeyCiphertext,
      secretKeyIV,
      secretKeyTag,
      secretValueCiphertext,
      secretValueIV,
      secretValueTag
    }
  } = await validateRequest(reqValidator.CreateSendSecretV1, req);

  return SendSecretService.createSendSecret();
};
