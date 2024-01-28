import { Schema, Types, model } from "mongoose";

export interface ISendSecret {
  encryptionKeyCiphertext: string;
  encryptionKeyIV: string;
  encryptionKeyTag: string;
  expiresAt: Date;
  secretKeyCiphertext: string;
  secretKeyIV: string;
  secretKeyTag: string;
  secretValueCiphertext: string;
  secretValueIV: string;
  secretValueTag: string;
  user: Types.ObjectId;
  workspace: Types.ObjectId;
  password?: string;
}

const sendSecretSchema = new Schema<ISendSecret>(
  {
    encryptionKeyCiphertext: {
      type: String,
      required: true
    },
    encryptionKeyIV: {
      type: String,
      required: true
    },
    encryptionKeyTag: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    secretKeyCiphertext: {
      type: String,
      required: true
    },
    secretKeyIV: {
      type: String,
      required: true
    },
    secretKeyTag: {
      type: String,
      required: true
    },
    secretValueCiphertext: {
      type: String,
      required: true
    },
    secretValueIV: {
      type: String,
      required: true
    },
    secretValueTag: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    },
    password: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true
  }
);

sendSecretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SendSecret = model<ISendSecret>("SendSecret", sendSecretSchema);
