import { Router } from "express";

const router = Router();

router.get("/settings", (_req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

router.post("/settings", (_req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

export default router;