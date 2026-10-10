-- LASTRADA menu schema and initial data.
-- Run this complete file once in the Neon SQL Editor (or with psql).
-- Safe to re-run: existing rows are preserved by ON CONFLICT DO NOTHING.

BEGIN;

CREATE TABLE IF NOT EXISTS public.menu_categories (
  id text PRIMARY KEY,
  name text NOT NULL CHECK (length(btrim(name)) > 0),
  position integer NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  translations jsonb NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(translations) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.menu_products (
  id text PRIMARY KEY,
  category_id text NOT NULL REFERENCES public.menu_categories(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  name text NOT NULL CHECK (length(btrim(name)) > 0),
  description text NOT NULL DEFAULT '',
  price numeric(10, 3) NOT NULL CHECK (price >= 0),
  image text,
  available boolean NOT NULL DEFAULT true,
  translations jsonb NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(translations) = 'object'),
  descriptions jsonb NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(descriptions) = 'object'),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS menu_categories_order_idx
  ON public.menu_categories (position, id);

CREATE INDEX IF NOT EXISTS menu_categories_available_order_idx
  ON public.menu_categories (position, id) WHERE available;

CREATE INDEX IF NOT EXISTS menu_products_category_order_idx
  ON public.menu_products (category_id, position, id);

CREATE INDEX IF NOT EXISTS menu_products_available_order_idx
  ON public.menu_products (category_id, position, id) WHERE available;

CREATE OR REPLACE FUNCTION public.set_menu_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS menu_categories_set_updated_at ON public.menu_categories;
CREATE TRIGGER menu_categories_set_updated_at
  BEFORE UPDATE ON public.menu_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_menu_updated_at();

DROP TRIGGER IF EXISTS menu_products_set_updated_at ON public.menu_products;
CREATE TRIGGER menu_products_set_updated_at
  BEFORE UPDATE ON public.menu_products
  FOR EACH ROW EXECUTE FUNCTION public.set_menu_updated_at();

INSERT INTO public.menu_categories
  (id, name, position, available, translations)
VALUES
  ('cat-1782006562196', 'Fraîcheur Gazeifiéé', 0, false, '{}'::jsonb),
  ('cat-1785770928832', 'EAU', 0, true, '{}'::jsonb),
  ('cat-1786126831703', 'Boissons Gazeuses', 0, false, '{}'::jsonb),
  ('cat-1787094792446', 'Panini', 0, false, '{}'::jsonb),
  ('cat-1790015914590', 'ss', 0, false, '{}'::jsonb),
  ('cat-1790015926134', 'admin', 0, false, '{}'::jsonb),
  ('cat-1762610662260', 'Eau', 10000, false, '{}'::jsonb),
  ('cafes-classiques', 'Cafés', 20000, true, '{}'::jsonb),
  ('cafes-speciaux', 'Cafés froides', 30000, true, '{}'::jsonb),
  ('narguile', 'Narguilé (Chicha)', 40000, true, '{}'::jsonb),
  ('thes-infusions', 'Thés', 50000, true, '{}'::jsonb),
  ('chocolats-lait', 'Chocolats & Lait', 60000, true, '{}'::jsonb),
  ('cat-1762689942610', 'Chocolat chaud', 63000, true, '{}'::jsonb),
  ('cat-1762691240756', 'Chocolat  Froid', 65000, true, '{}'::jsonb),
  ('cat-1762615054805', 'Milkshakes', 70000, true, '{}'::jsonb),
  ('cat-1762901632269', 'Smoothies', 71000, true, '{}'::jsonb),
  ('boissons-fraiches', 'Nos Jus', 80000, true, '{}'::jsonb),
  ('cocktails-sans-alcool', 'Mojito', 90000, true, '{}'::jsonb),
  ('eaux', 'Fraîcheur Gazeifiéé', 100000, true, '{}'::jsonb),
  ('cat-1762694261153', 'Crêpes', 105000, true, '{}'::jsonb),
  ('pancakes', 'Pancake', 110000, true, '{}'::jsonb),
  ('gaufres-crepes-sucrees', 'Gaufres', 120000, true, '{}'::jsonb),
  ('snacks-sales', 'Snacks Salés', 130000, true, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.menu_products
  (id, category_id, name, description, price, image, available, translations, descriptions, position)
VALUES
  ('prod-1782006587616', 'cat-1782006562196', 'Wow', '', 4.2, '/assets/menu/BogaCidre.jpg', false, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1785771002946', 'cat-1785770928832', 'EAU 1L', '', 3, '/assets/menu/Eau1L.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1786196110582', 'cat-1785770928832', 'Eau 0,5L', '', 1.8, '/assets/menu/Eau0.5L.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1786196315450', 'cat-1785770928832', 'Eau Hayet 1L', '', 3.8, '/assets/menu/Eau1L.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1786196549672', 'cat-1785770928832', 'Eau Garci 1L', '', 4.2, '/assets/menu/Eau1L.jpg', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('prod-1786196605387', 'cat-1785770928832', 'Eau Garci 0,5L', '', 2, '/assets/menu/Eau0.5L.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('prod-1786126962238', 'cat-1786126831703', 'Coca,coca zero', '', 3.5, '/assets/menu/Coca-Cola.jpg', false, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762612458035', 'cat-1762610662260', 'Eau 1L', '', 3, '/assets/menu/Eau1L.jpg', false, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762612489273', 'cat-1762610662260', 'Eau', '', 3.8, '/assets/menu/Eau0.5L.jpg', false, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1762612526130', 'cat-1762610662260', 'Eau Gazeifiée 1L', '', 3.2, '/assets/menu/EauGazeifi%C3%A9e1L.jpg', false, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762612583833', 'cat-1762610662260', 'Eau Gazeifiée 0.5L', '', 2, '/assets/menu/Eau%20Gazeifi%C3%A9e0.5L.jpg', false, '{}'::jsonb, '{}'::jsonb, 3),
  ('prod-1782003217555', 'cat-1762610662260', 'Eau Gazeifiée 0.5L', '', 2, '/assets/menu/Eau%20Gazeifi%C3%A9e0.5L.jpg', false, '{}'::jsonb, '{}'::jsonb, 4),
  ('prod-1782253684452', 'cat-1762610662260', 'Eau 0.5L', '', 1.8, '/assets/menu/Eau0.5L.jpg', false, '{}'::jsonb, '{}'::jsonb, 5),
  ('prod-1761393475891', 'cafes-classiques', 'nouveau caffe', '', 10000, '/assets/menu/Caf%C3%A9Turc.jpg', false, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762614560725', 'cafes-classiques', 'Espresso au Miel', '', 5.8, '/assets/menu/EspressoauMiel.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1762614597284', 'cafes-classiques', 'Americain au Miel', '', 5.9, '/assets/menu/AmericainauMiel.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762614609164', 'cafes-classiques', 'Capucin au Miel', '', 6.4, '/assets/menu/CapucinauMiel.png', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('prod-1762614626177', 'cafes-classiques', 'Latte au Miel', '', 6.9, '/assets/menu/LatteauMiel.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('prod-1762614641702', 'cafes-classiques', 'Espresso Vanille', '', 5.4, '/assets/menu/EspressoVanille.avif', true, '{}'::jsonb, '{}'::jsonb, 5),
  ('prod-1762614686166', 'cafes-classiques', 'Espresso Nestlé', '', 5.4, '/assets/menu/EspressoNestl%C3%A9.jpg', true, '{}'::jsonb, '{}'::jsonb, 6),
  ('prod-1762614698970', 'cafes-classiques', 'Capucin Nestlé', '', 6.4, '/assets/menu/CapuccinNestl%C3%A9.jpg', true, '{}'::jsonb, '{}'::jsonb, 7),
  ('prod-1762614710024', 'cafes-classiques', 'Latte Nestlé', '', 6.8, '/assets/menu/latteNestl%C3%A9.jpg', true, '{}'::jsonb, '{}'::jsonb, 8),
  ('prod-1762614729086', 'cafes-classiques', 'Café Turc', '', 8.4, '/assets/menu/Caf%C3%A9Turc.jpg', true, '{}'::jsonb, '{}'::jsonb, 9),
  ('cc-1', 'cafes-classiques', 'Espresso', '', 4.4, '/assets/menu/Espresso.jpg', true, '{}'::jsonb, '{}'::jsonb, 10),
  ('cc-2', 'cafes-classiques', 'Espresso Serré', '', 4.4, '/assets/menu/Espresso%20Serr%C3%A9.png', false, '{}'::jsonb, '{}'::jsonb, 11),
  ('cc-3', 'cafes-classiques', 'Espresso Allongé', '', 4.4, '/assets/menu/Espresso%20Allong%C3%A9.jpg', true, '{}'::jsonb, '{}'::jsonb, 12),
  ('cc-4', 'cafes-classiques', 'Americain', '', 4.4, '/assets/menu/Americain.jpg', true, '{}'::jsonb, '{}'::jsonb, 13),
  ('cc-5', 'cafes-classiques', 'Capucin', '', 4.9, NULL, true, '{}'::jsonb, '{}'::jsonb, 14),
  ('cc-6', 'cafes-classiques', 'Cappuccino', '', 6.4, '/assets/menu/Cappuccino.jpg', true, '{}'::jsonb, '{}'::jsonb, 15),
  ('cc-7', 'cafes-classiques', 'Cappuccino Chantilly', '', 8, '/assets/menu/Cappuccino%20Chantilly.jpg', true, '{}'::jsonb, '{}'::jsonb, 16),
  ('cc-8', 'cafes-classiques', 'Latte', '', 5.4, '/assets/menu/Latte.jpg', true, '{}'::jsonb, '{}'::jsonb, 17),
  ('cc-9', 'cafes-classiques', 'Nescafé', '', 5.4, '/assets/menu/Nescaf%C3%A9.jpg', true, '{}'::jsonb, '{}'::jsonb, 18),
  ('cs-1', 'cafes-speciaux', 'Espresso au Miel', '', 5.8, '/assets/menu/EspressoauMiel.jpg', false, '{}'::jsonb, '{}'::jsonb, 0),
  ('cs-2', 'cafes-speciaux', 'Americain au Miel', '', 5.8, '/assets/menu/AmericainauMiel.jpg', false, '{}'::jsonb, '{}'::jsonb, 1),
  ('cs-3', 'cafes-speciaux', 'Capucin au Miel', '', 6.4, '/assets/menu/CapucinauMiel.png', false, '{}'::jsonb, '{}'::jsonb, 2),
  ('cs-4', 'cafes-speciaux', 'Latte au Miel', '', 6.9, '/assets/menu/LatteauMiel.jpg', false, '{}'::jsonb, '{}'::jsonb, 3),
  ('cs-5', 'cafes-speciaux', 'Espresso Vanille', '', 5.4, '/assets/menu/EspressoVanille.avif', false, '{}'::jsonb, '{}'::jsonb, 4),
  ('cs-6', 'cafes-speciaux', 'Espresso Nestlé', '', 5.4, '/assets/menu/EspressoNestl%C3%A9.jpg', false, '{}'::jsonb, '{}'::jsonb, 5),
  ('cs-7', 'cafes-speciaux', 'Capuccin Nestlé', '', 6.4, '/assets/menu/CapuccinNestl%C3%A9.jpg', false, '{}'::jsonb, '{}'::jsonb, 6),
  ('cs-8', 'cafes-speciaux', 'Latte Nestlé', '', 6.8, '/assets/menu/latteNestl%C3%A9.jpg', false, '{}'::jsonb, '{}'::jsonb, 7),
  ('cs-9', 'cafes-speciaux', 'Iced Coffee', '', 6.8, '/assets/menu/IcedCoffeejpg.jpg', true, '{}'::jsonb, '{}'::jsonb, 8),
  ('cs-10', 'cafes-speciaux', 'Iced Coffee Vanille', '', 7.9, '/assets/menu/IcedCoffeeVanille.jpg', true, '{}'::jsonb, '{}'::jsonb, 9),
  ('cs-11', 'cafes-speciaux', 'Iced Coffee Caramel', '', 7.9, '/assets/menu/IcedCoffeeCaramel.jpg', true, '{}'::jsonb, '{}'::jsonb, 10),
  ('cs-12', 'cafes-speciaux', 'Iced Coffee Noisette', '', 7.9, '/assets/menu/IcedCoffeeNoisette.jpg', true, '{}'::jsonb, '{}'::jsonb, 11),
  ('cs-13', 'cafes-speciaux', 'Frappuccino', '', 8.4, '/assets/menu/Frappuccino.jpg', true, '{}'::jsonb, '{}'::jsonb, 12),
  ('cs-14', 'cafes-speciaux', 'Frappuccino Nutella', '', 10.8, '/assets/menu/FrappuccinoNutella.jpg', true, '{}'::jsonb, '{}'::jsonb, 13),
  ('cs-15', 'cafes-speciaux', 'Frappuccino Oreo', '', 9.8, '/assets/menu/FrappuccinoOreo.jpg', true, '{}'::jsonb, '{}'::jsonb, 14),
  ('cs-16', 'cafes-speciaux', 'Frappuccino Vanille', '', 9.4, '/assets/menu/FrappuccinoVanille.jpg', true, '{}'::jsonb, '{}'::jsonb, 15),
  ('cs-17', 'cafes-speciaux', 'Frappuccino Caramel', '', 9.4, '/assets/menu/FrappuccinoCaramel.jpg', true, '{}'::jsonb, '{}'::jsonb, 16),
  ('cs-18', 'cafes-speciaux', 'Frappuccino Noisette', '', 9.4, '/assets/menu/FrappuccinoNoisette.jpg', true, '{}'::jsonb, '{}'::jsonb, 17),
  ('prod-1762689011714', 'narguile', 'Pomme', '', 12, '/assets/menu/FakherPomme.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762689033736', 'narguile', 'shwingum', '', 12, '/assets/menu/FakherShwingum.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1762689047974', 'narguile', 'Raisin', '', 12, '/assets/menu/FakherRaisin.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762689066601', 'narguile', 'Raisin Menthe', '', 12, '/assets/menu/Raisin-Menthe.jpg', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('prod-1762689088199', 'narguile', 'Love 66', '', 16, '/assets/menu/Love66.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('prod-1762689102244', 'narguile', 'Jocker', '', 16, '/assets/menu/Joker.jpg', true, '{}'::jsonb, '{}'::jsonb, 5),
  ('prod-1762689136744', 'narguile', 'Mia More', '', 16, '/assets/menu/MiaMore.jpg', true, '{}'::jsonb, '{}'::jsonb, 6),
  ('prod-1762689164796', 'narguile', 'hawai', '', 18, '/assets/menu/Tutti-Frutti.jpg', true, '{}'::jsonb, '{}'::jsonb, 7),
  ('na-1', 'narguile', 'Berlin', '', 16, '/assets/menu/Berlin.jpg', true, '{}'::jsonb, '{}'::jsonb, 8),
  ('na-2', 'narguile', 'Menthe', '', 12, '/assets/menu/MentheAdaiya.jpg', true, '{}'::jsonb, '{}'::jsonb, 9),
  ('na-3', 'narguile', 'Chikh Money', '', 18, '/assets/menu/ChikhMoney.jpg', true, '{}'::jsonb, '{}'::jsonb, 10),
  ('na-4', 'narguile', 'Chicha Lastrada', '', 20, '/assets/menu/ChichaLastrada.jpg', true, '{}'::jsonb, '{}'::jsonb, 11),
  ('na-5', 'narguile', 'Lastrada Menthe', '', 20, '/assets/menu/LastradaMenthe.jpg', true, '{}'::jsonb, '{}'::jsonb, 12),
  ('na-6', 'narguile', 'Lastrada Pomme', '', 20, '/assets/menu/LastradaPomme.jpg', true, '{}'::jsonb, '{}'::jsonb, 13),
  ('na-7', 'narguile', 'Lastrada Love', '', 20, '/assets/menu/LastradaLove.jpg', true, '{}'::jsonb, '{}'::jsonb, 14),
  ('na-8', 'narguile', 'Lastrada Shwing', '', 20, '/assets/menu/LastradaShwing.jpg', true, '{}'::jsonb, '{}'::jsonb, 15),
  ('na-9', 'narguile', 'Lastrada Raisin Menthe', '', 20, '/assets/menu/LastradaRaisinMenthe.jpg', true, '{}'::jsonb, '{}'::jsonb, 16),
  ('na-10', 'narguile', 'Chikh Money Lastrada', '', 20, '/assets/menu/ChikhMoneyLastrada.jpg', true, '{}'::jsonb, '{}'::jsonb, 17),
  ('ti-1', 'thes-infusions', 'Thé', '', 3.4, '/assets/menu/Th%C3%A9.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('ti-2', 'thes-infusions', 'Thé Infusion', '', 4.2, '/assets/menu/Th%C3%A9Infusion.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('ti-3', 'thes-infusions', 'Thé aux Amandes', '', 7, '/assets/menu/Th%C3%A9auxAmandes.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('ti-4', 'thes-infusions', 'Thé aux Pignons', '', 10.4, '/assets/menu/Th%C3%A9auxPignons.jpg', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('ti-5', 'thes-infusions', 'Thé Lastrada', '', 13, '/assets/menu/Th%C3%A9Lastrada.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('ch-1', 'chocolats-lait', 'Chocolat au Lait', '', 4, '/assets/menu/ChocolatauLait.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('ch-2', 'chocolats-lait', 'Chocolat Lastrada', '', 12, '/assets/menu/ChocolatLastrada.jpg', false, '{}'::jsonb, '{}'::jsonb, 1),
  ('ch-3', 'chocolats-lait', 'Verre de Lait', '', 3, '/assets/menu/VerredeLait.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762691092588', 'cat-1762689942610', 'Chocolat chaud Nature', '', 7, '/assets/menu/ChocolatChaudNature.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762691123415', 'cat-1762689942610', 'Chocolat chaud chantilly', '', 8, '/assets/menu/ChocolatChaudChantilly.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1762691145735', 'cat-1762689942610', 'Chocolat chaud Vanille', '', 9, '/assets/menu/ChocolatChaudVanille.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762691162326', 'cat-1762689942610', 'Chocolat chaud Caramell', '', 9, '/assets/menu/ChocolatChaudCaramel.jpg', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('prod-1762691171744', 'cat-1762689942610', 'Chocolat chaud Noisette', '', 9, '/assets/menu/chocolatchaudnoisette.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('prod-1762691279565', 'cat-1762691240756', 'Chocolat Leigeois', '', 9, '/assets/menu/ChocolatLi%C3%A9geois.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762691303755', 'cat-1762691240756', 'Chocolat Viennois', '', 9, '/assets/menu/ChocolatViennois.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1762691318274', 'cat-1762691240756', 'Chocolat Lastrada', '', 12, '/assets/menu/ChocolatLastrada.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762615383287', 'cat-1762615054805', 'Milk-Shake Vanille', '', 10.4, '/assets/menu/Milk-ShakeVanille.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762615394765', 'cat-1762615054805', 'Milk-Shake Swingum', '', 10.4, '/assets/menu/Milk-ShakeSwingum.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1762615405527', 'cat-1762615054805', 'Milk-Shake Bueno', '', 12, '/assets/menu/Milk-ShakeBueno.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762615421445', 'cat-1762615054805', 'Milk-Shake Mixte', '', 14, '/assets/menu/Milk-ShakeMixte.jpg', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('prod-1762691363945', 'cat-1762615054805', 'Milk-Shake Oreo', '', 11.8, '/assets/menu/Milk-ShakeOreo.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('prod-1762691445765', 'cat-1762615054805', 'Milk-Shake Nutella', '', 12.8, '/assets/menu/Milk-Shake%20Nutella.jpg', true, '{}'::jsonb, '{}'::jsonb, 5),
  ('prod-1762691470955', 'cat-1762615054805', 'Milk-Shake Banane', '', 10.4, '/assets/menu/Milk-ShakeBanane.jpg', true, '{}'::jsonb, '{}'::jsonb, 6),
  ('prod-1762692947767', 'cat-1762615054805', 'Milk-Shake Fraise', '', 10.4, '/assets/menu/Milk-ShakeFraise.jpg', true, '{}'::jsonb, '{}'::jsonb, 7),
  ('prod-1782257866226', 'cat-1762615054805', 'Milk_shake snickers', '', 13.8, '/assets/menu/Milk-Shake%20Nutella.jpg', true, '{}'::jsonb, '{}'::jsonb, 8),
  ('prod-1782257962996', 'cat-1762615054805', 'Milk_shake pistacho', '', 11.5, '/assets/menu/Milk-ShakeMixte.jpg', true, '{}'::jsonb, '{}'::jsonb, 9),
  ('prod-1785772130751', 'cat-1762615054805', 'Milk-shake Mangue', '', 10.8, '/assets/menu/Milk-ShakeMixte.jpg', true, '{}'::jsonb, '{}'::jsonb, 10),
  ('prod-1762901682880', 'cat-1762901632269', 'Smoothie Pina Colada', '', 11.8, '/assets/menu/SmoothiePinaColada.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762901835483', 'cat-1762901632269', 'Bailamo', '', 10.8, '/assets/menu/Bailamo.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1762901854025', 'cat-1762901632269', 'Paradisso', '', 12, '/assets/menu/Paradisso.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762901873559', 'cat-1762901632269', 'California Dream', '', 12.8, '/assets/menu/CaliforniaDream.jpg', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('prod-1762901925923', 'cat-1762901632269', 'Tutti Frutti', '', 13.4, '/assets/menu/Tutti-Frutti.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('prod-1762901947571', 'cat-1762901632269', 'Smoothie Framboise', '', 12, '/assets/menu/SmoothieFramboise.jpg', false, '{}'::jsonb, '{}'::jsonb, 5),
  ('prod-1786197952005', 'cat-1762901632269', 'Smoothie Pêche', '', 9.4, '/assets/menu/SmoothieMangue.jpg', true, '{}'::jsonb, '{}'::jsonb, 6),
  ('prod-1786198186989', 'cat-1762901632269', 'Smoothie Kiwi', '', 10.4, '/assets/menu/SmoothieKiwi.jpg', true, '{}'::jsonb, '{}'::jsonb, 7),
  ('prod-1786198392684', 'cat-1762901632269', 'Smoothie Ananas', '', 10.8, '/assets/menu/SmoothieAnanas.jpg', true, '{}'::jsonb, '{}'::jsonb, 8),
  ('prod-1786198625166', 'cat-1762901632269', 'Smoothie Mangue', '', 10.8, '/assets/menu/SmoothieMangue.jpg', true, '{}'::jsonb, '{}'::jsonb, 9),
  ('prod-1786913957462', 'cat-1762901632269', 'Smoothie Fruit Rouge', '', 13.4, '/assets/menu/SmoothieFramboise.jpg', false, '{}'::jsonb, '{}'::jsonb, 10),
  ('prod-1782258073172', 'boissons-fraiches', 'Jus kiwi_banane', '', 11.5, '/assets/menu/JusdeKiwi.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('bf-1', 'boissons-fraiches', 'Jus d''Orange', '', 4.8, '/assets/menu/Jusd''Orange.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('bf-2', 'boissons-fraiches', 'Jus de Fraise', '', 8.4, '/assets/menu/JusdeFraise.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('bf-3', 'boissons-fraiches', 'Jus de Banane', '', 9.4, '/assets/menu/JusdeBanane.jpg', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('bf-4', 'boissons-fraiches', 'Jus de Kiwi', '', 8.8, '/assets/menu/JusdeKiwi.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('bf-5', 'boissons-fraiches', 'Jus Fraise-Banane', '', 10.8, '/assets/menu/JusFraise-Banane.jpg', true, '{}'::jsonb, '{}'::jsonb, 5),
  ('bf-6', 'boissons-fraiches', 'Jus Datte-Banane', '', 12, '/assets/menu/JusDatte-Banane.jpg', true, '{}'::jsonb, '{}'::jsonb, 6),
  ('bf-7', 'boissons-fraiches', 'Jus Lastrada', '', 16, '/assets/menu/JusLastrada.jpg', true, '{}'::jsonb, '{}'::jsonb, 7),
  ('bf-8', 'boissons-fraiches', 'Smoothie Pina Colada', '', 10.8, '/assets/menu/SmoothiePinaColada.jpg', false, '{}'::jsonb, '{}'::jsonb, 8),
  ('bf-9', 'boissons-fraiches', 'Smoothie Framboise', '', 12, '/assets/menu/SmoothieFramboise.jpg', false, '{}'::jsonb, '{}'::jsonb, 9),
  ('bf-10', 'boissons-fraiches', 'Bailamo', '', 9.8, '/assets/menu/Bailamo.jpg', false, '{}'::jsonb, '{}'::jsonb, 10),
  ('bf-11', 'boissons-fraiches', 'Paradisso', '', 11, '/assets/menu/Paradisso.jpg', false, '{}'::jsonb, '{}'::jsonb, 11),
  ('bf-12', 'boissons-fraiches', 'California Dream', '', 11.8, '/assets/menu/CaliforniaDream.jpg', false, '{}'::jsonb, '{}'::jsonb, 12),
  ('bf-13', 'boissons-fraiches', 'Tutti-Frutti', '', 12.4, '/assets/menu/Tutti-Frutti.jpg', false, '{}'::jsonb, '{}'::jsonb, 13),
  ('bf-14', 'boissons-fraiches', 'Citronnade', '', 4.9, '/assets/menu/Citronnade.jpg', true, '{}'::jsonb, '{}'::jsonb, 14),
  ('bf-15', 'boissons-fraiches', 'Citronnade aux Amandes', '', 7.4, '/assets/menu/CitronnadeauxAmandes.jpg', true, '{}'::jsonb, '{}'::jsonb, 15),
  ('bf-16', 'boissons-fraiches', 'Milk-Shake Vanille', '', 10.4, '/assets/menu/Milk-ShakeVanille.jpg', false, '{}'::jsonb, '{}'::jsonb, 16),
  ('bf-17', 'boissons-fraiches', 'Milk-Shake Mixte', '', 14, '/assets/menu/Milk-ShakeMixte.jpg', false, '{}'::jsonb, '{}'::jsonb, 17),
  ('bf-18', 'boissons-fraiches', 'Milk-Shake Bueno', '', 12, '/assets/menu/Milk-ShakeBueno.jpg', false, '{}'::jsonb, '{}'::jsonb, 18),
  ('bf-19', 'boissons-fraiches', 'Milk-Shake Swingum', '', 10.4, '/assets/menu/Milk-ShakeSwingum.jpg', false, '{}'::jsonb, '{}'::jsonb, 19),
  ('prod-1785879707255', 'cocktails-sans-alcool', 'Mojito Black', '', 9, NULL, true, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1786061155551', 'cocktails-sans-alcool', 'Mojito Bleu', '', 9, '/assets/menu/MojitoBleu.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('ca-1', 'cocktails-sans-alcool', 'Mojito Green', '', 8, '/assets/menu/MojitoGreen.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('ca-2', 'cocktails-sans-alcool', 'Mojito Red', '', 9, '/assets/menu/Mojito%20Red.jpg', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('ca-3', 'cocktails-sans-alcool', 'Mojito Bleu', '', 9, '/assets/menu/MojitoBleu.jpg', false, '{}'::jsonb, '{}'::jsonb, 4),
  ('ca-4', 'cocktails-sans-alcool', 'Mojito Pina Colada', '', 10.4, '/assets/menu/MojitPinaColada.jpg', true, '{}'::jsonb, '{}'::jsonb, 5),
  ('ca-5', 'cocktails-sans-alcool', 'Mojito Lastrada', '', 14, '/assets/menu/MojitoLastrada.jpg', true, '{}'::jsonb, '{}'::jsonb, 6),
  ('prod-1762609946823', 'eaux', 'Soda BOGA LIMON', '', 3.5, '/assets/menu/BogaLimonade.jpg', false, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762609969660', 'eaux', 'Soda BOGA CIDRE', '', 3.5, '/assets/menu/BogaCidre.jpg', false, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1762609991339', 'eaux', 'Soda APLA', '', 5, '/assets/menu/Apla.jpg', false, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762610017067', 'eaux', 'Soda APLA', '', 3.5, '/assets/menu/Apla.jpg', false, '{}'::jsonb, '{}'::jsonb, 3),
  ('prod-1782003478504', 'eaux', 'Tout les soda', '', 3.5, '/assets/menu/BogaLimonade.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('prod-1782003584268', 'eaux', 'Schweppes', '', 3.5, '/assets/menu/BogaLimonade.jpg', true, '{}'::jsonb, '{}'::jsonb, 5),
  ('prod-1782003645039', 'eaux', 'Wow', '', 3.5, '/assets/menu/BogaCidre.jpg', true, '{}'::jsonb, '{}'::jsonb, 6),
  ('prod-1786914630549', 'eaux', 'Boisson Énergétique', '', 7.8, NULL, true, '{}'::jsonb, '{}'::jsonb, 7),
  ('ea-1', 'eaux', 'Soda COCA', '', 3.5, '/assets/menu/Coca-Cola.jpg', false, '{}'::jsonb, '{}'::jsonb, 8),
  ('ea-2', 'eaux', 'Soda FANTA', '', 3.5, '/assets/menu/Fanta.jpg', false, '{}'::jsonb, '{}'::jsonb, 9),
  ('ea-3', 'eaux', 'Eau Gazeifiée 1L', '', 3.2, '/assets/menu/EauGazeifi%C3%A9e1L.jpg', false, '{}'::jsonb, '{}'::jsonb, 10),
  ('ea-4', 'eaux', 'Eau Gazeifiée 0.5L', '', 2, '/assets/menu/Eau%20Gazeifi%C3%A9e0.5L.jpg', false, '{}'::jsonb, '{}'::jsonb, 11),
  ('prod-1762694277362', 'cat-1762694261153', 'Crêpe Nutella', '', 11.4, '/assets/menu/Cr%C3%AApeNutella.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762694292081', 'cat-1762694261153', 'Crêpe Oreo', '', 13.4, '/assets/menu/Cr%C3%AApeOreo.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1762694302303', 'cat-1762694261153', 'Crêpe snickers', '', 13.5, '/assets/menu/Cr%C3%AApeSnickers.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762694335902', 'cat-1762694261153', 'Crêpe Rafaellos', '', 13.9, '/assets/menu/Cr%C3%AApeRaffaello.jpg.png', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('prod-1762694348092', 'cat-1762694261153', 'Crêpe fruits sec', '', 13.5, NULL, true, '{}'::jsonb, '{}'::jsonb, 4),
  ('prod-1762694356903', 'cat-1762694261153', 'Crêpe Bounty', '', 12.5, '/assets/menu/Cr%C3%AApeBounty.jpg', true, '{}'::jsonb, '{}'::jsonb, 5),
  ('prod-1762694369800', 'cat-1762694261153', 'Crêpe chocolat vanoise', '', 7, '/assets/menu/Cr%C3%AApeChocolatVanoise.jpg', true, '{}'::jsonb, '{}'::jsonb, 6),
  ('prod-1762694379731', 'cat-1762694261153', 'Crêpe Oreo vanoise', '', 8.5, '/assets/menu/Cr%C3%AApeOreoVanoise.jpg', true, '{}'::jsonb, '{}'::jsonb, 7),
  ('prod-1762694393363', 'cat-1762694261153', 'Crêpe Rafaello vanoise', '', 10, NULL, true, '{}'::jsonb, '{}'::jsonb, 8),
  ('prod-1762694402772', 'cat-1762694261153', 'Crêpe Snickers vanoise', '', 9, '/assets/menu/Cr%C3%AApeSnickers.jpg', true, '{}'::jsonb, '{}'::jsonb, 9),
  ('prod-1762694423242', 'cat-1762694261153', 'Crêpe Fruits sec vanoise', '', 8.5, NULL, true, '{}'::jsonb, '{}'::jsonb, 10),
  ('prod-1762694439322', 'cat-1762694261153', 'Crêpe Bounty vanoise', '', 9, '/assets/menu/Cr%C3%AApeBountyVanoise.jpg', true, '{}'::jsonb, '{}'::jsonb, 11),
  ('prod-1782312894925', 'cat-1762694261153', 'Crêpe Mars', '', 13, '/assets/menu/Cr%C3%AApeSnickers.jpg', true, '{}'::jsonb, '{}'::jsonb, 12),
  ('prod-1762615619644', 'pancakes', 'Pancake Bounty', '', 13.5, '/assets/menu/PancakeBountyVanoise.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762693548336', 'pancakes', 'Pancake chocolat vanoise', '', 7.5, '/assets/menu/PancakeNutella.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1762693566297', 'pancakes', 'Pancake Oreo vanoise', '', 8.5, NULL, true, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762693594938', 'pancakes', 'Pancake Rafaello vanoise', '', 10.5, '/assets/menu/PancakeFruitSecVanoise.jpg', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('prod-1762693667327', 'pancakes', 'Pancake sinkers vanoise', '', 9, '/assets/menu/PancakeSnickers.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('prod-1762693696736', 'pancakes', 'Pancake fruits-sec vanoise', '', 9.5, '/assets/menu/PancakeFruitSecVanoise.jpg', true, '{}'::jsonb, '{}'::jsonb, 5),
  ('prod-1762693715707', 'pancakes', 'Pancake bounty vanoise', '', 7, '/assets/menu/PancakeBountyVanoise.jpg', true, '{}'::jsonb, '{}'::jsonb, 6),
  ('pa-1', 'pancakes', 'Pancake Nutella', '', 11.5, '/assets/menu/PancakeNutella.jpg', true, '{}'::jsonb, '{}'::jsonb, 7),
  ('pa-2', 'pancakes', 'Pancake Oreo', '', 12.5, '/assets/menu/PancakeNutella.jpg', true, '{}'::jsonb, '{}'::jsonb, 8),
  ('pa-3', 'pancakes', 'Pancake Snickers', '', 13.5, '/assets/menu/PancakeSnickers.jpg', true, '{}'::jsonb, '{}'::jsonb, 9),
  ('pa-4', 'pancakes', 'Pancake Raffaello', '', 14.5, NULL, true, '{}'::jsonb, '{}'::jsonb, 10),
  ('pa-5', 'pancakes', 'Pancake Fruit Sec', '', 13.5, '/assets/menu/PancakeFruitSec.jpg', true, '{}'::jsonb, '{}'::jsonb, 11),
  ('prod-1762693964495', 'gaufres-crepes-sucrees', 'Gaufre chocolat vanoise', '', 7, '/assets/menu/GaufreNutella.jpg', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1762693978016', 'gaufres-crepes-sucrees', 'Gaufre Oreo vanoise', '', 8.5, '/assets/menu/GaufreOreo.jpg', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1762693993416', 'gaufres-crepes-sucrees', 'Gaufre rafaello vanoise', '', 10.5, '/assets/menu/GaufreRaffaello.jpg', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('prod-1762694008657', 'gaufres-crepes-sucrees', 'Gaufre snickers vanoise', '', 9, '/assets/menu/GaufreSnickers.jpeg', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('prod-1762694031775', 'gaufres-crepes-sucrees', 'Gaufre fruits sec vanoise', '', 8.8, '/assets/menu/GaufreFruitSec.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('prod-1762694072457', 'gaufres-crepes-sucrees', 'Gaufre bounty vanoise', '', 7, '/assets/menu/GaufreBountyNutella.jpg', true, '{}'::jsonb, '{}'::jsonb, 5),
  ('gc-1', 'gaufres-crepes-sucrees', 'Gaufre Nutella', '', 12, '/assets/menu/GaufreNutella.jpg', true, '{}'::jsonb, '{}'::jsonb, 6),
  ('gc-2', 'gaufres-crepes-sucrees', 'Gaufre Oreo', '', 13.5, '/assets/menu/GaufreOreo.jpg', true, '{}'::jsonb, '{}'::jsonb, 7),
  ('gc-3', 'gaufres-crepes-sucrees', 'Gaufre Snickers', '', 13.9, '/assets/menu/GaufreSnickers.jpeg', true, '{}'::jsonb, '{}'::jsonb, 8),
  ('gc-4', 'gaufres-crepes-sucrees', 'Gaufre Raffaello', '', 14.5, '/assets/menu/GaufreRaffaello.jpg', true, '{}'::jsonb, '{}'::jsonb, 9),
  ('gc-5', 'gaufres-crepes-sucrees', 'Gaufre Fruit Sec', '', 13.4, '/assets/menu/GaufreFruitSec.jpg', true, '{}'::jsonb, '{}'::jsonb, 10),
  ('gc-6', 'gaufres-crepes-sucrees', 'Gaufre Bounty Nutella', '', 13.5, '/assets/menu/GaufreBountyNutella.jpg', true, '{}'::jsonb, '{}'::jsonb, 11),
  ('gc-7', 'gaufres-crepes-sucrees', 'Crêpe Nutella', '', 10.4, '/assets/menu/Cr%C3%AApeNutella.jpg', false, '{}'::jsonb, '{}'::jsonb, 12),
  ('gc-8', 'gaufres-crepes-sucrees', 'Crêpe Oreo', '', 12, '/assets/menu/Cr%C3%AApeOreo.jpg', false, '{}'::jsonb, '{}'::jsonb, 13),
  ('gc-9', 'gaufres-crepes-sucrees', 'Crêpe Snickers', '', 12, '/assets/menu/Cr%C3%AApeSnickers.jpg', false, '{}'::jsonb, '{}'::jsonb, 14),
  ('gc-10', 'gaufres-crepes-sucrees', 'Crêpe Raffaello', '', 12.9, '/assets/menu/Cr%C3%AApeRaffaello.jpg.png', false, '{}'::jsonb, '{}'::jsonb, 15),
  ('gc-11', 'gaufres-crepes-sucrees', 'Crêpe Fruit Sec', '', 11.5, '/assets/menu/Cr%C3%AApeFruitSec.jpg', false, '{}'::jsonb, '{}'::jsonb, 16),
  ('gc-12', 'gaufres-crepes-sucrees', 'Crêpe Bounty', '', 11, '/assets/menu/Cr%C3%AApeBounty.jpg', false, '{}'::jsonb, '{}'::jsonb, 17),
  ('prod-1787094992842', 'snacks-sales', 'Panini Thon', '', 6.8, '/assets/menu/PaniniThon.png', true, '{}'::jsonb, '{}'::jsonb, 0),
  ('prod-1787095033745', 'snacks-sales', 'Panini Jombon', '', 6, '/assets/menu/PaniniJambon.png', true, '{}'::jsonb, '{}'::jsonb, 1),
  ('prod-1787095057520', 'snacks-sales', 'Panini Spécial', '', 8, '/assets/menu/PaniniSp%C3%A9cial.png', true, '{}'::jsonb, '{}'::jsonb, 2),
  ('ss-1', 'snacks-sales', 'Crêpe Thon', '', 9, '/assets/menu/Cr%C3%AApeThon.jpg', true, '{}'::jsonb, '{}'::jsonb, 3),
  ('ss-2', 'snacks-sales', 'Crêpe Jambon', '', 8.5, '/assets/menu/Cr%C3%AApeJambon.jpg', true, '{}'::jsonb, '{}'::jsonb, 4),
  ('ss-3', 'snacks-sales', 'Crêpe Spéciale', '', 11, '/assets/menu/Cr%C3%AApeSp%C3%A9ciale.jpg', true, '{}'::jsonb, '{}'::jsonb, 5)
ON CONFLICT (id) DO NOTHING;

COMMIT;
