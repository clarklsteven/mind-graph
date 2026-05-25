import { Router } from "express";
import { UserSettings } from "../user/user-settings";

const router = Router();

const userSettings = new UserSettings();

router.get("/settings", (_req, res) => {
    res.status(200).json({
        status: "ok",
        settings: userSettings.getSettings()
    });
});

router.post("/settings", (_req, res) => {
    userSettings.updateSettings(_req.body);
    res.status(200).json({
        status: "ok"
    });
});

router.post("/settings/verify-vault-path", (req, res) => {
    const { vaultPath } = req.body;
    const isValid = userSettings.verifyVaultPath(vaultPath);
    res.status(200).json({
        status: "ok",
        isValid
    });
});

export default router;