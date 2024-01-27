import { z } from "zod";

export const CreateSendSecretV1 = z.object({
  body: z.object({
    encryptionKeyCiphertext: z.string().trim(),
    encryptionKeyIV: z.string().trim(),
    encryptionKeyTag: z.string().trim(),
    expiresIn: z.number(),
    secretKeyCiphertext: z.string().trim(),
    secretKeyIV: z.string().trim(),
    secretKeyTag: z.string().trim(),
    secretValueCiphertext: z.string().trim(),
    secretValueIV: z.string().trim(),
    secretValueTag: z.string().trim()
  })
});

export const DeleteSendSecretV1 = z.object({
  params: z.object({
    sendSecretId: z.string()
  })
});
