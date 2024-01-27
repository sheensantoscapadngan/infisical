import express from "express";

import { createSendSecret } from "../../controllers/v1/sendSecretController";
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

export default router;
