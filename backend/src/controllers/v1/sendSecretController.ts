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

export const getSendSecrets = async (req: Request, res: Response) => {
  const sendSecrets = await SendSecret.find({
    user: req.user._id
  });

  return res.status(200).send({
    sendSecrets
  });
};

export const getSendSecret = async (req: Request, res: Response) => {
  const {
    params: { sendSecretId }
  } = await validateRequest(reqValidator.DeleteSendSecretV1, req);

  const sendSecret = await SendSecret.findOne({
    _id: sendSecretId
  });

  if (!sendSecret) {
    throw new Error("Failed to fetch secret");
  }

  return res.status(200).send({
    sendSecret
  });
};

export const deleteSendSecret = async (req: Request, res: Response) => {
  const {
    params: { sendSecretId }
  } = await validateRequest(reqValidator.DeleteSendSecretV1, req);

  const sendSecretToDelete = await SendSecret.findOne({
    _id: sendSecretId,
    user: req.user._id
  });

  if (!sendSecretToDelete) {
    throw new Error("Failed to delete secret");
  }

  await SendSecret.deleteOne({
    _id: sendSecretToDelete._id
  });

  return res.status(200).send();
};
