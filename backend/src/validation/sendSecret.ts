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
    secretValueTag: z.string().trim(),
    password: z.string().optional()
  })
});

export const DeleteSendSecretV1 = z.object({
  params: z.object({
    sendSecretId: z.string()
  })
});

export const ViewSendSecretV1 = z.object({
  params: z.object({
    sendSecretId: z.string()
  }),
  query: z.object({
    password: z.string().optional()
  })
});

export const UpdateSendSecretSecurityV1 = z.object({
  body: z.object({
    password: z.string().min(1)
  }),
  params: z.object({
    sendSecretId: z.string()
  })
});
