import { Router, type IRouter } from "express";
import { requireAdmin } from "../lib/admin-session";
import { limitLoginAttempts } from "../lib/login-rate-limit";
import { getAdminMenu, getPublicMenu, login, logout, updateAdminMenu } from "../controllers/menu-controller";

const router: IRouter = Router();

router.get("/menu", getPublicMenu);
router.post("/admin/login", limitLoginAttempts, login);
router.post("/admin/logout", logout);

router.get("/admin/session", requireAdmin, (_request, response) => {
  response.json({ authenticated: true });
});

router.get("/admin/menu", requireAdmin, getAdminMenu);
router.put("/admin/menu", requireAdmin, updateAdminMenu);

export default router;
