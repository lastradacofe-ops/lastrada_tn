import { Router, type IRouter } from "express";
import { loadMenu, saveMenu } from "../menu/menu-store";
import { adminAuthConfigured, clearAdminSession, createAdminSession, requireAdmin, verifyAdminCredentials } from "../lib/admin-session";

const router: IRouter = Router();

router.get("/menu", async (_request, response, next) => {
  try {
    const menu = await loadMenu();
    const activeCategories = new Set(menu.categories.filter((category) => category.available !== false).map((category) => category.id));
    const products = menu.products.filter((product) => product.available && activeCategories.has(product.categoryId));
    const categoryIds = new Set(products.map((product) => product.categoryId));
    response.json({
      categories: menu.categories.filter((category) => categoryIds.has(category.id)),
      products,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/admin/login", (request, response) => {
  if (!adminAuthConfigured()) {
    response.status(503).json({ error: "Admin credentials are not configured on the server." });
    return;
  }
  if (!verifyAdminCredentials(request.body?.email, request.body?.password)) {
    response.status(401).json({ error: "Email or password is incorrect." });
    return;
  }
  createAdminSession(response);
  response.json({ authenticated: true });
});

router.post("/admin/logout", (_request, response) => {
  clearAdminSession(response);
  response.status(204).end();
});

router.get("/admin/session", requireAdmin, (_request, response) => {
  response.json({ authenticated: true });
});

router.get("/admin/menu", requireAdmin, async (_request, response, next) => {
  try {
    response.json(await loadMenu());
  } catch (error) {
    next(error);
  }
});

router.put("/admin/menu", requireAdmin, async (request, response, next) => {
  try {
    response.json(await saveMenu(request.body));
  } catch (error) {
    if (error instanceof Error && error.message === "Menu payload is invalid.") {
      response.status(400).json({ error: error.message });
      return;
    }
    next(error);
  }
});

export default router;
