import express from "express";

import {
  createSendSecret,
  deleteSendSecret,
  getSendSecret,
  getSendSecrets,
  updateSendSecretSecurity
} from "../../controllers/v1/sendSecretController";
import { viewSendSecretLimit } from "../../helpers";
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

router.patch(
  "/:sendSecretId/security",
  requireAuth({
    acceptedAuthModes: [AuthMode.JWT]
  }),
  updateSendSecretSecurity
);

router.get(
  "/",
  requireAuth({
    acceptedAuthModes: [AuthMode.JWT]
  }),
  getSendSecrets
);

// for public viewing of send secret
router.get("/:sendSecretId", viewSendSecretLimit, getSendSecret);

router.delete(
  "/:sendSecretId",
  requireAuth({
    acceptedAuthModes: [AuthMode.JWT]
  }),
  deleteSendSecret
);

export default router;
