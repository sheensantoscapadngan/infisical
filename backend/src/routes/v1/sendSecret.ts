import express from "express";

import { createSendSecret, getSendSecrets } from "../../controllers/v1/sendSecretController";
import { requireAuth } from "../../middleware";
import { AuthMode } from "../../variables";
const router = express.Router();

router.post(
  "/",
  requireAuth({
    acceptedAuthModes: [AuthMode.JWT]
  }),
  createSendSecret
);

router.get(
  "/",
  requireAuth({
    acceptedAuthModes: [AuthMode.JWT]
  }),
  getSendSecrets
);

export default router;
