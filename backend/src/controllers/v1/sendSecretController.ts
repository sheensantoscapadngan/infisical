import { Request, Response } from "express";
import { validateRequest } from "../../helpers/validation";
import { SendSecret } from "../../models/sendSecret";
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

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

  const sendSecret = await new SendSecret({
    encryptionKeyCiphertext,
    encryptionKeyIV,
    encryptionKeyTag,
    expiresAt,
    user: req.user._id,
    secretKeyCiphertext,
    secretKeyIV,
    secretKeyTag,
    secretValueCiphertext,
    secretValueIV,
    secretValueTag
  }).save();

  return res.status(200).send({
    sendSecret
  });
};
