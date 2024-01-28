import express from "express";

import {
  createSendSecret,
  deleteSendSecret,
  getSendSecrets,
  updateSendSecretSecurity,
  viewSendSecret
} from "../../controllers/v1/sendSecretController";
import { viewSendSecretLimit } from "../../helpers";
import { requireAuth, requireWorkspaceAuth } from "../../middleware";
import { ADMIN, AuthMode, MEMBER } from "../../variables";

const router = express.Router();

router.post(
  "/",
  requireAuth({
    acceptedAuthModes: [AuthMode.JWT]
  }),
  requireWorkspaceAuth({
    acceptedRoles: [ADMIN, MEMBER],
    locationWorkspaceId: "body"
  }),
  createSendSecret
);

router.patch(
  "/:sendSecretId/security",
  requireAuth({
    acceptedAuthModes: [AuthMode.JWT]
  }),
  requireWorkspaceAuth({
    acceptedRoles: [ADMIN, MEMBER],
    locationWorkspaceId: "body"
  }),
  updateSendSecretSecurity
);

router.get(
  "/",
  requireAuth({
    acceptedAuthModes: [AuthMode.JWT]
  }),
  requireWorkspaceAuth({
    acceptedRoles: [ADMIN, MEMBER],
    locationWorkspaceId: "query"
  }),
  getSendSecrets
);

// for public viewing of send secret
router.get("/:sendSecretId", viewSendSecretLimit, viewSendSecret);

router.delete(
  "/:sendSecretId",
  requireAuth({
    acceptedAuthModes: [AuthMode.JWT]
  }),
  requireWorkspaceAuth({
    acceptedRoles: [ADMIN, MEMBER],
    locationWorkspaceId: "query"
  }),
  deleteSendSecret
);

export default router;
