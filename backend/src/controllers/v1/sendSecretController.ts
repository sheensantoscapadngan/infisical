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
      secretValueTag,
      password,
      workspaceId
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
    secretValueTag,
    password,
    workspace: workspaceId
  }).save();

  return res.status(200).send({
    sendSecret
  });
};

export const getSendSecrets = async (req: Request, res: Response) => {
  const {
    query: { workspaceId }
  } = await validateRequest(reqValidator.GetSendSecretsV1, req);

  const sendSecrets = await SendSecret.find({
    user: req.user._id,
    workspace: workspaceId
  });

  return res.status(200).send({
    sendSecrets
  });
};

export const viewSendSecret = async (req: Request, res: Response) => {
  const {
    params: { sendSecretId },
    query: { password }
  } = await validateRequest(reqValidator.ViewSendSecretV1, req);

  const sendSecret = await SendSecret.findOne({
    _id: sendSecretId
  }).select("+password");

  if (sendSecret?.password && sendSecret.password !== password) {
    return res.status(401).send();
  }

  if (!sendSecret) {
    throw new Error("Failed to fetch secret");
  }

  return res.status(200).send({
    sendSecret
  });
};

export const deleteSendSecret = async (req: Request, res: Response) => {
  const {
    params: { sendSecretId },
    query: { workspaceId }
  } = await validateRequest(reqValidator.DeleteSendSecretV1, req);

  const sendSecretToDelete = await SendSecret.findOne({
    _id: sendSecretId,
    user: req.user._id,
    workspace: workspaceId
  });

  if (!sendSecretToDelete) {
    throw new Error("Failed to delete secret");
  }

  await SendSecret.deleteOne({
    _id: sendSecretToDelete._id
  });

  return res.status(200).send();
};

export const updateSendSecretSecurity = async (req: Request, res: Response) => {
  const {
    params: { sendSecretId },
    body: { password, workspaceId }
  } = await validateRequest(reqValidator.UpdateSendSecretSecurityV1, req);

  const sendSecretToUpdate = await SendSecret.findOne({
    _id: sendSecretId,
    user: req.user._id,
    workspace: workspaceId
  });

  if (!sendSecretToUpdate) {
    throw new Error("Failed to update secret");
  }

  const updatedSendSecret = await SendSecret.findOneAndUpdate(
    {
      _id: sendSecretToUpdate._id
    },
    {
      password
    },
    {
      new: true
    }
  );

  return res.status(200).send({
    sendSecret: updatedSendSecret
  });
};
