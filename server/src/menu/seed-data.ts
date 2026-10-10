export type Locale = 'fr' | 'ar' | 'en';
export type LocalizedText = Partial<Record<Locale, string>>;
export type Category = { id: string; name: string; position: number; available?: boolean; translations?: LocalizedText };
export type Product = { id: string; categoryId: string; name: string; description?: string; price: number; image?: string; available: boolean; translations?: LocalizedText; descriptions?: LocalizedText; position?: number };
export const seededCategories: Category[] = [
  {
    "id": "cat-1782006562196",
    "name": "Fraîcheur Gazeifiéé",
    "position": 0,
    "available": false
  },
  {
    "id": "cat-1785770928832",
    "name": "EAU",
    "position": 0,
    "available": true
  },
  {
    "id": "cat-1786126831703",
    "name": "Boissons Gazeuses",
    "position": 0,
    "available": false
  },
  {
    "id": "cat-1787094792446",
    "name": "Panini",
    "position": 0,
    "available": false
  },
  {
    "id": "cat-1790015914590",
    "name": "ss",
    "position": 0,
    "available": false
  },
  {
    "id": "cat-1790015926134",
    "name": "admin",
    "position": 0,
    "available": false
  },
  {
    "id": "cat-1762610662260",
    "name": "Eau",
    "position": 10000,
    "available": false
  },
  {
    "id": "cafes-classiques",
    "name": "Cafés",
    "position": 20000,
    "available": true
  },
  {
    "id": "cafes-speciaux",
    "name": "Cafés froides",
    "position": 30000,
    "available": true
  },
  {
    "id": "narguile",
    "name": "Narguilé (Chicha)",
    "position": 40000,
    "available": true
  },
  {
    "id": "thes-infusions",
    "name": "Thés",
    "position": 50000,
    "available": true
  },
  {
    "id": "chocolats-lait",
    "name": "Chocolats & Lait",
    "position": 60000,
    "available": true
  },
  {
    "id": "cat-1762689942610",
    "name": "Chocolat chaud",
    "position": 63000,
    "available": true
  },
  {
    "id": "cat-1762691240756",
    "name": "Chocolat  Froid",
    "position": 65000,
    "available": true
  },
  {
    "id": "cat-1762615054805",
    "name": "Milkshakes",
    "position": 70000,
    "available": true
  },
  {
    "id": "cat-1762901632269",
    "name": "Smoothies",
    "position": 71000,
    "available": true
  },
  {
    "id": "boissons-fraiches",
    "name": "Nos Jus",
    "position": 80000,
    "available": true
  },
  {
    "id": "cocktails-sans-alcool",
    "name": "Mojito",
    "position": 90000,
    "available": true
  },
  {
    "id": "eaux",
    "name": "Fraîcheur Gazeifiéé",
    "position": 100000,
    "available": true
  },
  {
    "id": "cat-1762694261153",
    "name": "Crêpes",
    "position": 105000,
    "available": true
  },
  {
    "id": "pancakes",
    "name": "Pancake",
    "position": 110000,
    "available": true
  },
  {
    "id": "gaufres-crepes-sucrees",
    "name": "Gaufres",
    "position": 120000,
    "available": true
  },
  {
    "id": "snacks-sales",
    "name": "Snacks Salés",
    "position": 130000,
    "available": true
  }
];

export const seededProducts: Product[] = [
  {
    "id": "prod-1782006587616",
    "categoryId": "cat-1782006562196",
    "name": "Wow",
    "description": "",
    "price": 4.2,
    "image": "/assets/menu/BogaCidre.jpg",
    "available": false
  },
  {
    "id": "prod-1785771002946",
    "categoryId": "cat-1785770928832",
    "name": "EAU 1L",
    "description": "",
    "price": 3,
    "image": "/assets/menu/Eau1L.jpg",
    "available": true
  },
  {
    "id": "prod-1786196110582",
    "categoryId": "cat-1785770928832",
    "name": "Eau 0,5L",
    "description": "",
    "price": 1.8,
    "image": "/assets/menu/Eau0.5L.jpg",
    "available": true
  },
  {
    "id": "prod-1786196315450",
    "categoryId": "cat-1785770928832",
    "name": "Eau Hayet 1L",
    "description": "",
    "price": 3.8,
    "image": "/assets/menu/Eau1L.jpg",
    "available": true
  },
  {
    "id": "prod-1786196549672",
    "categoryId": "cat-1785770928832",
    "name": "Eau Garci 1L",
    "description": "",
    "price": 4.2,
    "image": "/assets/menu/Eau1L.jpg",
    "available": true
  },
  {
    "id": "prod-1786196605387",
    "categoryId": "cat-1785770928832",
    "name": "Eau Garci 0,5L",
    "description": "",
    "price": 2,
    "image": "/assets/menu/Eau0.5L.jpg",
    "available": true
  },
  {
    "id": "prod-1786126962238",
    "categoryId": "cat-1786126831703",
    "name": "Coca,coca zero",
    "description": "",
    "price": 3.5,
    "image": "/assets/menu/Coca-Cola.jpg",
    "available": false
  },
  {
    "id": "prod-1762612458035",
    "categoryId": "cat-1762610662260",
    "name": "Eau 1L",
    "description": "",
    "price": 3,
    "image": "/assets/menu/Eau1L.jpg",
    "available": false
  },
  {
    "id": "prod-1762612489273",
    "categoryId": "cat-1762610662260",
    "name": "Eau",
    "description": "",
    "price": 3.8,
    "image": "/assets/menu/Eau0.5L.jpg",
    "available": false
  },
  {
    "id": "prod-1762612526130",
    "categoryId": "cat-1762610662260",
    "name": "Eau Gazeifiée 1L",
    "description": "",
    "price": 3.2,
    "image": "/assets/menu/EauGazeifi%C3%A9e1L.jpg",
    "available": false
  },
  {
    "id": "prod-1762612583833",
    "categoryId": "cat-1762610662260",
    "name": "Eau Gazeifiée 0.5L",
    "description": "",
    "price": 2,
    "image": "/assets/menu/Eau%20Gazeifi%C3%A9e0.5L.jpg",
    "available": false
  },
  {
    "id": "prod-1782003217555",
    "categoryId": "cat-1762610662260",
    "name": "Eau Gazeifiée 0.5L",
    "description": "",
    "price": 2,
    "image": "/assets/menu/Eau%20Gazeifi%C3%A9e0.5L.jpg",
    "available": false
  },
  {
    "id": "prod-1782253684452",
    "categoryId": "cat-1762610662260",
    "name": "Eau 0.5L",
    "description": "",
    "price": 1.8,
    "image": "/assets/menu/Eau0.5L.jpg",
    "available": false
  },
  {
    "id": "prod-1761393475891",
    "categoryId": "cafes-classiques",
    "name": "nouveau caffe",
    "description": "",
    "price": 10000,
    "image": "/assets/menu/Caf%C3%A9Turc.jpg",
    "available": false
  },
  {
    "id": "prod-1762614560725",
    "categoryId": "cafes-classiques",
    "name": "Espresso au Miel",
    "description": "",
    "price": 5.8,
    "image": "/assets/menu/EspressoauMiel.jpg",
    "available": true
  },
  {
    "id": "prod-1762614597284",
    "categoryId": "cafes-classiques",
    "name": "Americain au Miel",
    "description": "",
    "price": 5.9,
    "image": "/assets/menu/AmericainauMiel.jpg",
    "available": true
  },
  {
    "id": "prod-1762614609164",
    "categoryId": "cafes-classiques",
    "name": "Capucin au Miel",
    "description": "",
    "price": 6.4,
    "image": "/assets/menu/CapucinauMiel.png",
    "available": true
  },
  {
    "id": "prod-1762614626177",
    "categoryId": "cafes-classiques",
    "name": "Latte au Miel",
    "description": "",
    "price": 6.9,
    "image": "/assets/menu/LatteauMiel.jpg",
    "available": true
  },
  {
    "id": "prod-1762614641702",
    "categoryId": "cafes-classiques",
    "name": "Espresso Vanille",
    "description": "",
    "price": 5.4,
    "image": "/assets/menu/EspressoVanille.avif",
    "available": true
  },
  {
    "id": "prod-1762614686166",
    "categoryId": "cafes-classiques",
    "name": "Espresso Nestlé",
    "description": "",
    "price": 5.4,
    "image": "/assets/menu/EspressoNestl%C3%A9.jpg",
    "available": true
  },
  {
    "id": "prod-1762614698970",
    "categoryId": "cafes-classiques",
    "name": "Capucin Nestlé",
    "description": "",
    "price": 6.4,
    "image": "/assets/menu/CapuccinNestl%C3%A9.jpg",
    "available": true
  },
  {
    "id": "prod-1762614710024",
    "categoryId": "cafes-classiques",
    "name": "Latte Nestlé",
    "description": "",
    "price": 6.8,
    "image": "/assets/menu/latteNestl%C3%A9.jpg",
    "available": true
  },
  {
    "id": "prod-1762614729086",
    "categoryId": "cafes-classiques",
    "name": "Café Turc",
    "description": "",
    "price": 8.4,
    "image": "/assets/menu/Caf%C3%A9Turc.jpg",
    "available": true
  },
  {
    "id": "cc-1",
    "categoryId": "cafes-classiques",
    "name": "Espresso",
    "description": "",
    "price": 4.4,
    "image": "/assets/menu/Espresso.jpg",
    "available": true
  },
  {
    "id": "cc-2",
    "categoryId": "cafes-classiques",
    "name": "Espresso Serré",
    "description": "",
    "price": 4.4,
    "image": "/assets/menu/Espresso%20Serr%C3%A9.png",
    "available": false
  },
  {
    "id": "cc-3",
    "categoryId": "cafes-classiques",
    "name": "Espresso Allongé",
    "description": "",
    "price": 4.4,
    "image": "/assets/menu/Espresso%20Allong%C3%A9.jpg",
    "available": true
  },
  {
    "id": "cc-4",
    "categoryId": "cafes-classiques",
    "name": "Americain",
    "description": "",
    "price": 4.4,
    "image": "/assets/menu/Americain.jpg",
    "available": true
  },
  {
    "id": "cc-5",
    "categoryId": "cafes-classiques",
    "name": "Capucin",
    "description": "",
    "price": 4.9,
    "available": true
  },
  {
    "id": "cc-6",
    "categoryId": "cafes-classiques",
    "name": "Cappuccino",
    "description": "",
    "price": 6.4,
    "image": "/assets/menu/Cappuccino.jpg",
    "available": true
  },
  {
    "id": "cc-7",
    "categoryId": "cafes-classiques",
    "name": "Cappuccino Chantilly",
    "description": "",
    "price": 8,
    "image": "/assets/menu/Cappuccino%20Chantilly.jpg",
    "available": true
  },
  {
    "id": "cc-8",
    "categoryId": "cafes-classiques",
    "name": "Latte",
    "description": "",
    "price": 5.4,
    "image": "/assets/menu/Latte.jpg",
    "available": true
  },
  {
    "id": "cc-9",
    "categoryId": "cafes-classiques",
    "name": "Nescafé",
    "description": "",
    "price": 5.4,
    "image": "/assets/menu/Nescaf%C3%A9.jpg",
    "available": true
  },
  {
    "id": "cs-1",
    "categoryId": "cafes-speciaux",
    "name": "Espresso au Miel",
    "description": "",
    "price": 5.8,
    "image": "/assets/menu/EspressoauMiel.jpg",
    "available": false
  },
  {
    "id": "cs-2",
    "categoryId": "cafes-speciaux",
    "name": "Americain au Miel",
    "description": "",
    "price": 5.8,
    "image": "/assets/menu/AmericainauMiel.jpg",
    "available": false
  },
  {
    "id": "cs-3",
    "categoryId": "cafes-speciaux",
    "name": "Capucin au Miel",
    "description": "",
    "price": 6.4,
    "image": "/assets/menu/CapucinauMiel.png",
    "available": false
  },
  {
    "id": "cs-4",
    "categoryId": "cafes-speciaux",
    "name": "Latte au Miel",
    "description": "",
    "price": 6.9,
    "image": "/assets/menu/LatteauMiel.jpg",
    "available": false
  },
  {
    "id": "cs-5",
    "categoryId": "cafes-speciaux",
    "name": "Espresso Vanille",
    "description": "",
    "price": 5.4,
    "image": "/assets/menu/EspressoVanille.avif",
    "available": false
  },
  {
    "id": "cs-6",
    "categoryId": "cafes-speciaux",
    "name": "Espresso Nestlé",
    "description": "",
    "price": 5.4,
    "image": "/assets/menu/EspressoNestl%C3%A9.jpg",
    "available": false
  },
  {
    "id": "cs-7",
    "categoryId": "cafes-speciaux",
    "name": "Capuccin Nestlé",
    "description": "",
    "price": 6.4,
    "image": "/assets/menu/CapuccinNestl%C3%A9.jpg",
    "available": false
  },
  {
    "id": "cs-8",
    "categoryId": "cafes-speciaux",
    "name": "Latte Nestlé",
    "description": "",
    "price": 6.8,
    "image": "/assets/menu/latteNestl%C3%A9.jpg",
    "available": false
  },
  {
    "id": "cs-9",
    "categoryId": "cafes-speciaux",
    "name": "Iced Coffee",
    "description": "",
    "price": 6.8,
    "image": "/assets/menu/IcedCoffeejpg.jpg",
    "available": true
  },
  {
    "id": "cs-10",
    "categoryId": "cafes-speciaux",
    "name": "Iced Coffee Vanille",
    "description": "",
    "price": 7.9,
    "image": "/assets/menu/IcedCoffeeVanille.jpg",
    "available": true
  },
  {
    "id": "cs-11",
    "categoryId": "cafes-speciaux",
    "name": "Iced Coffee Caramel",
    "description": "",
    "price": 7.9,
    "image": "/assets/menu/IcedCoffeeCaramel.jpg",
    "available": true
  },
  {
    "id": "cs-12",
    "categoryId": "cafes-speciaux",
    "name": "Iced Coffee Noisette",
    "description": "",
    "price": 7.9,
    "image": "/assets/menu/IcedCoffeeNoisette.jpg",
    "available": true
  },
  {
    "id": "cs-13",
    "categoryId": "cafes-speciaux",
    "name": "Frappuccino",
    "description": "",
    "price": 8.4,
    "image": "/assets/menu/Frappuccino.jpg",
    "available": true
  },
  {
    "id": "cs-14",
    "categoryId": "cafes-speciaux",
    "name": "Frappuccino Nutella",
    "description": "",
    "price": 10.8,
    "image": "/assets/menu/FrappuccinoNutella.jpg",
    "available": true
  },
  {
    "id": "cs-15",
    "categoryId": "cafes-speciaux",
    "name": "Frappuccino Oreo",
    "description": "",
    "price": 9.8,
    "image": "/assets/menu/FrappuccinoOreo.jpg",
    "available": true
  },
  {
    "id": "cs-16",
    "categoryId": "cafes-speciaux",
    "name": "Frappuccino Vanille",
    "description": "",
    "price": 9.4,
    "image": "/assets/menu/FrappuccinoVanille.jpg",
    "available": true
  },
  {
    "id": "cs-17",
    "categoryId": "cafes-speciaux",
    "name": "Frappuccino Caramel",
    "description": "",
    "price": 9.4,
    "image": "/assets/menu/FrappuccinoCaramel.jpg",
    "available": true
  },
  {
    "id": "cs-18",
    "categoryId": "cafes-speciaux",
    "name": "Frappuccino Noisette",
    "description": "",
    "price": 9.4,
    "image": "/assets/menu/FrappuccinoNoisette.jpg",
    "available": true
  },
  {
    "id": "prod-1762689011714",
    "categoryId": "narguile",
    "name": "Pomme",
    "description": "",
    "price": 12,
    "image": "/assets/menu/FakherPomme.jpg",
    "available": true
  },
  {
    "id": "prod-1762689033736",
    "categoryId": "narguile",
    "name": "shwingum",
    "description": "",
    "price": 12,
    "image": "/assets/menu/FakherShwingum.jpg",
    "available": true
  },
  {
    "id": "prod-1762689047974",
    "categoryId": "narguile",
    "name": "Raisin",
    "description": "",
    "price": 12,
    "image": "/assets/menu/FakherRaisin.jpg",
    "available": true
  },
  {
    "id": "prod-1762689066601",
    "categoryId": "narguile",
    "name": "Raisin Menthe",
    "description": "",
    "price": 12,
    "image": "/assets/menu/Raisin-Menthe.jpg",
    "available": true
  },
  {
    "id": "prod-1762689088199",
    "categoryId": "narguile",
    "name": "Love 66",
    "description": "",
    "price": 16,
    "image": "/assets/menu/Love66.jpg",
    "available": true
  },
  {
    "id": "prod-1762689102244",
    "categoryId": "narguile",
    "name": "Jocker",
    "description": "",
    "price": 16,
    "image": "/assets/menu/Joker.jpg",
    "available": true
  },
  {
    "id": "prod-1762689136744",
    "categoryId": "narguile",
    "name": "Mia More",
    "description": "",
    "price": 16,
    "image": "/assets/menu/MiaMore.jpg",
    "available": true
  },
  {
    "id": "prod-1762689164796",
    "categoryId": "narguile",
    "name": "hawai",
    "description": "",
    "price": 18,
    "image": "/assets/menu/Tutti-Frutti.jpg",
    "available": true
  },
  {
    "id": "na-1",
    "categoryId": "narguile",
    "name": "Berlin",
    "description": "",
    "price": 16,
    "image": "/assets/menu/Berlin.jpg",
    "available": true
  },
  {
    "id": "na-2",
    "categoryId": "narguile",
    "name": "Menthe",
    "description": "",
    "price": 12,
    "image": "/assets/menu/MentheAdaiya.jpg",
    "available": true
  },
  {
    "id": "na-3",
    "categoryId": "narguile",
    "name": "Chikh Money",
    "description": "",
    "price": 18,
    "image": "/assets/menu/ChikhMoney.jpg",
    "available": true
  },
  {
    "id": "na-4",
    "categoryId": "narguile",
    "name": "Chicha Lastrada",
    "description": "",
    "price": 20,
    "image": "/assets/menu/ChichaLastrada.jpg",
    "available": true
  },
  {
    "id": "na-5",
    "categoryId": "narguile",
    "name": "Lastrada Menthe",
    "description": "",
    "price": 20,
    "image": "/assets/menu/LastradaMenthe.jpg",
    "available": true
  },
  {
    "id": "na-6",
    "categoryId": "narguile",
    "name": "Lastrada Pomme",
    "description": "",
    "price": 20,
    "image": "/assets/menu/LastradaPomme.jpg",
    "available": true
  },
  {
    "id": "na-7",
    "categoryId": "narguile",
    "name": "Lastrada Love",
    "description": "",
    "price": 20,
    "image": "/assets/menu/LastradaLove.jpg",
    "available": true
  },
  {
    "id": "na-8",
    "categoryId": "narguile",
    "name": "Lastrada Shwing",
    "description": "",
    "price": 20,
    "image": "/assets/menu/LastradaShwing.jpg",
    "available": true
  },
  {
    "id": "na-9",
    "categoryId": "narguile",
    "name": "Lastrada Raisin Menthe",
    "description": "",
    "price": 20,
    "image": "/assets/menu/LastradaRaisinMenthe.jpg",
    "available": true
  },
  {
    "id": "na-10",
    "categoryId": "narguile",
    "name": "Chikh Money Lastrada",
    "description": "",
    "price": 20,
    "image": "/assets/menu/ChikhMoneyLastrada.jpg",
    "available": true
  },
  {
    "id": "ti-1",
    "categoryId": "thes-infusions",
    "name": "Thé",
    "description": "",
    "price": 3.4,
    "image": "/assets/menu/Th%C3%A9.jpg",
    "available": true
  },
  {
    "id": "ti-2",
    "categoryId": "thes-infusions",
    "name": "Thé Infusion",
    "description": "",
    "price": 4.2,
    "image": "/assets/menu/Th%C3%A9Infusion.jpg",
    "available": true
  },
  {
    "id": "ti-3",
    "categoryId": "thes-infusions",
    "name": "Thé aux Amandes",
    "description": "",
    "price": 7,
    "image": "/assets/menu/Th%C3%A9auxAmandes.jpg",
    "available": true
  },
  {
    "id": "ti-4",
    "categoryId": "thes-infusions",
    "name": "Thé aux Pignons",
    "description": "",
    "price": 10.4,
    "image": "/assets/menu/Th%C3%A9auxPignons.jpg",
    "available": true
  },
  {
    "id": "ti-5",
    "categoryId": "thes-infusions",
    "name": "Thé Lastrada",
    "description": "",
    "price": 13,
    "image": "/assets/menu/Th%C3%A9Lastrada.jpg",
    "available": true
  },
  {
    "id": "ch-1",
    "categoryId": "chocolats-lait",
    "name": "Chocolat au Lait",
    "description": "",
    "price": 4,
    "image": "/assets/menu/ChocolatauLait.jpg",
    "available": true
  },
  {
    "id": "ch-2",
    "categoryId": "chocolats-lait",
    "name": "Chocolat Lastrada",
    "description": "",
    "price": 12,
    "image": "/assets/menu/ChocolatLastrada.jpg",
    "available": false
  },
  {
    "id": "ch-3",
    "categoryId": "chocolats-lait",
    "name": "Verre de Lait",
    "description": "",
    "price": 3,
    "image": "/assets/menu/VerredeLait.jpg",
    "available": true
  },
  {
    "id": "prod-1762691092588",
    "categoryId": "cat-1762689942610",
    "name": "Chocolat chaud Nature",
    "description": "",
    "price": 7,
    "image": "/assets/menu/ChocolatChaudNature.jpg",
    "available": true
  },
  {
    "id": "prod-1762691123415",
    "categoryId": "cat-1762689942610",
    "name": "Chocolat chaud chantilly",
    "description": "",
    "price": 8,
    "image": "/assets/menu/ChocolatChaudChantilly.jpg",
    "available": true
  },
  {
    "id": "prod-1762691145735",
    "categoryId": "cat-1762689942610",
    "name": "Chocolat chaud Vanille",
    "description": "",
    "price": 9,
    "image": "/assets/menu/ChocolatChaudVanille.jpg",
    "available": true
  },
  {
    "id": "prod-1762691162326",
    "categoryId": "cat-1762689942610",
    "name": "Chocolat chaud Caramell",
    "description": "",
    "price": 9,
    "image": "/assets/menu/ChocolatChaudCaramel.jpg",
    "available": true
  },
  {
    "id": "prod-1762691171744",
    "categoryId": "cat-1762689942610",
    "name": "Chocolat chaud Noisette",
    "description": "",
    "price": 9,
    "image": "/assets/menu/chocolatchaudnoisette.jpg",
    "available": true
  },
  {
    "id": "prod-1762691279565",
    "categoryId": "cat-1762691240756",
    "name": "Chocolat Leigeois",
    "description": "",
    "price": 9,
    "image": "/assets/menu/ChocolatLi%C3%A9geois.jpg",
    "available": true
  },
  {
    "id": "prod-1762691303755",
    "categoryId": "cat-1762691240756",
    "name": "Chocolat Viennois",
    "description": "",
    "price": 9,
    "image": "/assets/menu/ChocolatViennois.jpg",
    "available": true
  },
  {
    "id": "prod-1762691318274",
    "categoryId": "cat-1762691240756",
    "name": "Chocolat Lastrada",
    "description": "",
    "price": 12,
    "image": "/assets/menu/ChocolatLastrada.jpg",
    "available": true
  },
  {
    "id": "prod-1762615383287",
    "categoryId": "cat-1762615054805",
    "name": "Milk-Shake Vanille",
    "description": "",
    "price": 10.4,
    "image": "/assets/menu/Milk-ShakeVanille.jpg",
    "available": true
  },
  {
    "id": "prod-1762615394765",
    "categoryId": "cat-1762615054805",
    "name": "Milk-Shake Swingum",
    "description": "",
    "price": 10.4,
    "image": "/assets/menu/Milk-ShakeSwingum.jpg",
    "available": true
  },
  {
    "id": "prod-1762615405527",
    "categoryId": "cat-1762615054805",
    "name": "Milk-Shake Bueno",
    "description": "",
    "price": 12,
    "image": "/assets/menu/Milk-ShakeBueno.jpg",
    "available": true
  },
  {
    "id": "prod-1762615421445",
    "categoryId": "cat-1762615054805",
    "name": "Milk-Shake Mixte",
    "description": "",
    "price": 14,
    "image": "/assets/menu/Milk-ShakeMixte.jpg",
    "available": true
  },
  {
    "id": "prod-1762691363945",
    "categoryId": "cat-1762615054805",
    "name": "Milk-Shake Oreo",
    "description": "",
    "price": 11.8,
    "image": "/assets/menu/Milk-ShakeOreo.jpg",
    "available": true
  },
  {
    "id": "prod-1762691445765",
    "categoryId": "cat-1762615054805",
    "name": "Milk-Shake Nutella",
    "description": "",
    "price": 12.8,
    "image": "/assets/menu/Milk-Shake%20Nutella.jpg",
    "available": true
  },
  {
    "id": "prod-1762691470955",
    "categoryId": "cat-1762615054805",
    "name": "Milk-Shake Banane",
    "description": "",
    "price": 10.4,
    "image": "/assets/menu/Milk-ShakeBanane.jpg",
    "available": true
  },
  {
    "id": "prod-1762692947767",
    "categoryId": "cat-1762615054805",
    "name": "Milk-Shake Fraise",
    "description": "",
    "price": 10.4,
    "image": "/assets/menu/Milk-ShakeFraise.jpg",
    "available": true
  },
  {
    "id": "prod-1782257866226",
    "categoryId": "cat-1762615054805",
    "name": "Milk_shake snickers",
    "description": "",
    "price": 13.8,
    "image": "/assets/menu/Milk-Shake%20Nutella.jpg",
    "available": true
  },
  {
    "id": "prod-1782257962996",
    "categoryId": "cat-1762615054805",
    "name": "Milk_shake pistacho",
    "description": "",
    "price": 11.5,
    "image": "/assets/menu/Milk-ShakeMixte.jpg",
    "available": true
  },
  {
    "id": "prod-1785772130751",
    "categoryId": "cat-1762615054805",
    "name": "Milk-shake Mangue",
    "description": "",
    "price": 10.8,
    "image": "/assets/menu/Milk-ShakeMixte.jpg",
    "available": true
  },
  {
    "id": "prod-1762901682880",
    "categoryId": "cat-1762901632269",
    "name": "Smoothie Pina Colada",
    "description": "",
    "price": 11.8,
    "image": "/assets/menu/SmoothiePinaColada.jpg",
    "available": true
  },
  {
    "id": "prod-1762901835483",
    "categoryId": "cat-1762901632269",
    "name": "Bailamo",
    "description": "",
    "price": 10.8,
    "image": "/assets/menu/Bailamo.jpg",
    "available": true
  },
  {
    "id": "prod-1762901854025",
    "categoryId": "cat-1762901632269",
    "name": "Paradisso",
    "description": "",
    "price": 12,
    "image": "/assets/menu/Paradisso.jpg",
    "available": true
  },
  {
    "id": "prod-1762901873559",
    "categoryId": "cat-1762901632269",
    "name": "California Dream",
    "description": "",
    "price": 12.8,
    "image": "/assets/menu/CaliforniaDream.jpg",
    "available": true
  },
  {
    "id": "prod-1762901925923",
    "categoryId": "cat-1762901632269",
    "name": "Tutti Frutti",
    "description": "",
    "price": 13.4,
    "image": "/assets/menu/Tutti-Frutti.jpg",
    "available": true
  },
  {
    "id": "prod-1762901947571",
    "categoryId": "cat-1762901632269",
    "name": "Smoothie Framboise",
    "description": "",
    "price": 12,
    "image": "/assets/menu/SmoothieFramboise.jpg",
    "available": false
  },
  {
    "id": "prod-1786197952005",
    "categoryId": "cat-1762901632269",
    "name": "Smoothie Pêche",
    "description": "",
    "price": 9.4,
    "image": "/assets/menu/SmoothieMangue.jpg",
    "available": true
  },
  {
    "id": "prod-1786198186989",
    "categoryId": "cat-1762901632269",
    "name": "Smoothie Kiwi",
    "description": "",
    "price": 10.4,
    "image": "/assets/menu/SmoothieKiwi.jpg",
    "available": true
  },
  {
    "id": "prod-1786198392684",
    "categoryId": "cat-1762901632269",
    "name": "Smoothie Ananas",
    "description": "",
    "price": 10.8,
    "image": "/assets/menu/SmoothieAnanas.jpg",
    "available": true
  },
  {
    "id": "prod-1786198625166",
    "categoryId": "cat-1762901632269",
    "name": "Smoothie Mangue",
    "description": "",
    "price": 10.8,
    "image": "/assets/menu/SmoothieMangue.jpg",
    "available": true
  },
  {
    "id": "prod-1786913957462",
    "categoryId": "cat-1762901632269",
    "name": "Smoothie Fruit Rouge",
    "description": "",
    "price": 13.4,
    "image": "/assets/menu/SmoothieFramboise.jpg",
    "available": false
  },
  {
    "id": "prod-1782258073172",
    "categoryId": "boissons-fraiches",
    "name": "Jus kiwi_banane",
    "description": "",
    "price": 11.5,
    "image": "/assets/menu/JusdeKiwi.jpg",
    "available": true
  },
  {
    "id": "bf-1",
    "categoryId": "boissons-fraiches",
    "name": "Jus d'Orange",
    "description": "",
    "price": 4.8,
    "image": "/assets/menu/Jusd'Orange.jpg",
    "available": true
  },
  {
    "id": "bf-2",
    "categoryId": "boissons-fraiches",
    "name": "Jus de Fraise",
    "description": "",
    "price": 8.4,
    "image": "/assets/menu/JusdeFraise.jpg",
    "available": true
  },
  {
    "id": "bf-3",
    "categoryId": "boissons-fraiches",
    "name": "Jus de Banane",
    "description": "",
    "price": 9.4,
    "image": "/assets/menu/JusdeBanane.jpg",
    "available": true
  },
  {
    "id": "bf-4",
    "categoryId": "boissons-fraiches",
    "name": "Jus de Kiwi",
    "description": "",
    "price": 8.8,
    "image": "/assets/menu/JusdeKiwi.jpg",
    "available": true
  },
  {
    "id": "bf-5",
    "categoryId": "boissons-fraiches",
    "name": "Jus Fraise-Banane",
    "description": "",
    "price": 10.8,
    "image": "/assets/menu/JusFraise-Banane.jpg",
    "available": true
  },
  {
    "id": "bf-6",
    "categoryId": "boissons-fraiches",
    "name": "Jus Datte-Banane",
    "description": "",
    "price": 12,
    "image": "/assets/menu/JusDatte-Banane.jpg",
    "available": true
  },
  {
    "id": "bf-7",
    "categoryId": "boissons-fraiches",
    "name": "Jus Lastrada",
    "description": "",
    "price": 16,
    "image": "/assets/menu/JusLastrada.jpg",
    "available": true
  },
  {
    "id": "bf-8",
    "categoryId": "boissons-fraiches",
    "name": "Smoothie Pina Colada",
    "description": "",
    "price": 10.8,
    "image": "/assets/menu/SmoothiePinaColada.jpg",
    "available": false
  },
  {
    "id": "bf-9",
    "categoryId": "boissons-fraiches",
    "name": "Smoothie Framboise",
    "description": "",
    "price": 12,
    "image": "/assets/menu/SmoothieFramboise.jpg",
    "available": false
  },
  {
    "id": "bf-10",
    "categoryId": "boissons-fraiches",
    "name": "Bailamo",
    "description": "",
    "price": 9.8,
    "image": "/assets/menu/Bailamo.jpg",
    "available": false
  },
  {
    "id": "bf-11",
    "categoryId": "boissons-fraiches",
    "name": "Paradisso",
    "description": "",
    "price": 11,
    "image": "/assets/menu/Paradisso.jpg",
    "available": false
  },
  {
    "id": "bf-12",
    "categoryId": "boissons-fraiches",
    "name": "California Dream",
    "description": "",
    "price": 11.8,
    "image": "/assets/menu/CaliforniaDream.jpg",
    "available": false
  },
  {
    "id": "bf-13",
    "categoryId": "boissons-fraiches",
    "name": "Tutti-Frutti",
    "description": "",
    "price": 12.4,
    "image": "/assets/menu/Tutti-Frutti.jpg",
    "available": false
  },
  {
    "id": "bf-14",
    "categoryId": "boissons-fraiches",
    "name": "Citronnade",
    "description": "",
    "price": 4.9,
    "image": "/assets/menu/Citronnade.jpg",
    "available": true
  },
  {
    "id": "bf-15",
    "categoryId": "boissons-fraiches",
    "name": "Citronnade aux Amandes",
    "description": "",
    "price": 7.4,
    "image": "/assets/menu/CitronnadeauxAmandes.jpg",
    "available": true
  },
  {
    "id": "bf-16",
    "categoryId": "boissons-fraiches",
    "name": "Milk-Shake Vanille",
    "description": "",
    "price": 10.4,
    "image": "/assets/menu/Milk-ShakeVanille.jpg",
    "available": false
  },
  {
    "id": "bf-17",
    "categoryId": "boissons-fraiches",
    "name": "Milk-Shake Mixte",
    "description": "",
    "price": 14,
    "image": "/assets/menu/Milk-ShakeMixte.jpg",
    "available": false
  },
  {
    "id": "bf-18",
    "categoryId": "boissons-fraiches",
    "name": "Milk-Shake Bueno",
    "description": "",
    "price": 12,
    "image": "/assets/menu/Milk-ShakeBueno.jpg",
    "available": false
  },
  {
    "id": "bf-19",
    "categoryId": "boissons-fraiches",
    "name": "Milk-Shake Swingum",
    "description": "",
    "price": 10.4,
    "image": "/assets/menu/Milk-ShakeSwingum.jpg",
    "available": false
  },
  {
    "id": "prod-1785879707255",
    "categoryId": "cocktails-sans-alcool",
    "name": "Mojito Black",
    "description": "",
    "price": 9,
    "available": true
  },
  {
    "id": "prod-1786061155551",
    "categoryId": "cocktails-sans-alcool",
    "name": "Mojito Bleu",
    "description": "",
    "price": 9,
    "image": "/assets/menu/MojitoBleu.jpg",
    "available": true
  },
  {
    "id": "ca-1",
    "categoryId": "cocktails-sans-alcool",
    "name": "Mojito Green",
    "description": "",
    "price": 8,
    "image": "/assets/menu/MojitoGreen.jpg",
    "available": true
  },
  {
    "id": "ca-2",
    "categoryId": "cocktails-sans-alcool",
    "name": "Mojito Red",
    "description": "",
    "price": 9,
    "image": "/assets/menu/Mojito%20Red.jpg",
    "available": true
  },
  {
    "id": "ca-3",
    "categoryId": "cocktails-sans-alcool",
    "name": "Mojito Bleu",
    "description": "",
    "price": 9,
    "image": "/assets/menu/MojitoBleu.jpg",
    "available": false
  },
  {
    "id": "ca-4",
    "categoryId": "cocktails-sans-alcool",
    "name": "Mojito Pina Colada",
    "description": "",
    "price": 10.4,
    "image": "/assets/menu/MojitPinaColada.jpg",
    "available": true
  },
  {
    "id": "ca-5",
    "categoryId": "cocktails-sans-alcool",
    "name": "Mojito Lastrada",
    "description": "",
    "price": 14,
    "image": "/assets/menu/MojitoLastrada.jpg",
    "available": true
  },
  {
    "id": "prod-1762609946823",
    "categoryId": "eaux",
    "name": "Soda BOGA LIMON",
    "description": "",
    "price": 3.5,
    "image": "/assets/menu/BogaLimonade.jpg",
    "available": false
  },
  {
    "id": "prod-1762609969660",
    "categoryId": "eaux",
    "name": "Soda BOGA CIDRE",
    "description": "",
    "price": 3.5,
    "image": "/assets/menu/BogaCidre.jpg",
    "available": false
  },
  {
    "id": "prod-1762609991339",
    "categoryId": "eaux",
    "name": "Soda APLA",
    "description": "",
    "price": 5,
    "image": "/assets/menu/Apla.jpg",
    "available": false
  },
  {
    "id": "prod-1762610017067",
    "categoryId": "eaux",
    "name": "Soda APLA",
    "description": "",
    "price": 3.5,
    "image": "/assets/menu/Apla.jpg",
    "available": false
  },
  {
    "id": "prod-1782003478504",
    "categoryId": "eaux",
    "name": "Tout les soda",
    "description": "",
    "price": 3.5,
    "image": "/assets/menu/BogaLimonade.jpg",
    "available": true
  },
  {
    "id": "prod-1782003584268",
    "categoryId": "eaux",
    "name": "Schweppes",
    "description": "",
    "price": 3.5,
    "image": "/assets/menu/BogaLimonade.jpg",
    "available": true
  },
  {
    "id": "prod-1782003645039",
    "categoryId": "eaux",
    "name": "Wow",
    "description": "",
    "price": 3.5,
    "image": "/assets/menu/BogaCidre.jpg",
    "available": true
  },
  {
    "id": "prod-1786914630549",
    "categoryId": "eaux",
    "name": "Boisson Énergétique",
    "description": "",
    "price": 7.8,
    "available": true
  },
  {
    "id": "ea-1",
    "categoryId": "eaux",
    "name": "Soda COCA",
    "description": "",
    "price": 3.5,
    "image": "/assets/menu/Coca-Cola.jpg",
    "available": false
  },
  {
    "id": "ea-2",
    "categoryId": "eaux",
    "name": "Soda FANTA",
    "description": "",
    "price": 3.5,
    "image": "/assets/menu/Fanta.jpg",
    "available": false
  },
  {
    "id": "ea-3",
    "categoryId": "eaux",
    "name": "Eau Gazeifiée 1L",
    "description": "",
    "price": 3.2,
    "image": "/assets/menu/EauGazeifi%C3%A9e1L.jpg",
    "available": false
  },
  {
    "id": "ea-4",
    "categoryId": "eaux",
    "name": "Eau Gazeifiée 0.5L",
    "description": "",
    "price": 2,
    "image": "/assets/menu/Eau%20Gazeifi%C3%A9e0.5L.jpg",
    "available": false
  },
  {
    "id": "prod-1762694277362",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe Nutella",
    "description": "",
    "price": 11.4,
    "image": "/assets/menu/Cr%C3%AApeNutella.jpg",
    "available": true
  },
  {
    "id": "prod-1762694292081",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe Oreo",
    "description": "",
    "price": 13.4,
    "image": "/assets/menu/Cr%C3%AApeOreo.jpg",
    "available": true
  },
  {
    "id": "prod-1762694302303",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe snickers",
    "description": "",
    "price": 13.5,
    "image": "/assets/menu/Cr%C3%AApeSnickers.jpg",
    "available": true
  },
  {
    "id": "prod-1762694335902",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe Rafaellos",
    "description": "",
    "price": 13.9,
    "image": "/assets/menu/Cr%C3%AApeRaffaello.jpg.png",
    "available": true
  },
  {
    "id": "prod-1762694348092",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe fruits sec",
    "description": "",
    "price": 13.5,
    "available": true
  },
  {
    "id": "prod-1762694356903",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe Bounty",
    "description": "",
    "price": 12.5,
    "image": "/assets/menu/Cr%C3%AApeBounty.jpg",
    "available": true
  },
  {
    "id": "prod-1762694369800",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe chocolat vanoise",
    "description": "",
    "price": 7,
    "image": "/assets/menu/Cr%C3%AApeChocolatVanoise.jpg",
    "available": true
  },
  {
    "id": "prod-1762694379731",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe Oreo vanoise",
    "description": "",
    "price": 8.5,
    "image": "/assets/menu/Cr%C3%AApeOreoVanoise.jpg",
    "available": true
  },
  {
    "id": "prod-1762694393363",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe Rafaello vanoise",
    "description": "",
    "price": 10,
    "available": true
  },
  {
    "id": "prod-1762694402772",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe Snickers vanoise",
    "description": "",
    "price": 9,
    "image": "/assets/menu/Cr%C3%AApeSnickers.jpg",
    "available": true
  },
  {
    "id": "prod-1762694423242",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe Fruits sec vanoise",
    "description": "",
    "price": 8.5,
    "available": true
  },
  {
    "id": "prod-1762694439322",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe Bounty vanoise",
    "description": "",
    "price": 9,
    "image": "/assets/menu/Cr%C3%AApeBountyVanoise.jpg",
    "available": true
  },
  {
    "id": "prod-1782312894925",
    "categoryId": "cat-1762694261153",
    "name": "Crêpe Mars",
    "description": "",
    "price": 13,
    "image": "/assets/menu/Cr%C3%AApeSnickers.jpg",
    "available": true
  },
  {
    "id": "prod-1762615619644",
    "categoryId": "pancakes",
    "name": "Pancake Bounty",
    "description": "",
    "price": 13.5,
    "image": "/assets/menu/PancakeBountyVanoise.jpg",
    "available": true
  },
  {
    "id": "prod-1762693548336",
    "categoryId": "pancakes",
    "name": "Pancake chocolat vanoise",
    "description": "",
    "price": 7.5,
    "image": "/assets/menu/PancakeNutella.jpg",
    "available": true
  },
  {
    "id": "prod-1762693566297",
    "categoryId": "pancakes",
    "name": "Pancake Oreo vanoise",
    "description": "",
    "price": 8.5,
    "available": true
  },
  {
    "id": "prod-1762693594938",
    "categoryId": "pancakes",
    "name": "Pancake Rafaello vanoise",
    "description": "",
    "price": 10.5,
    "image": "/assets/menu/PancakeFruitSecVanoise.jpg",
    "available": true
  },
  {
    "id": "prod-1762693667327",
    "categoryId": "pancakes",
    "name": "Pancake sinkers vanoise",
    "description": "",
    "price": 9,
    "image": "/assets/menu/PancakeSnickers.jpg",
    "available": true
  },
  {
    "id": "prod-1762693696736",
    "categoryId": "pancakes",
    "name": "Pancake fruits-sec vanoise",
    "description": "",
    "price": 9.5,
    "image": "/assets/menu/PancakeFruitSecVanoise.jpg",
    "available": true
  },
  {
    "id": "prod-1762693715707",
    "categoryId": "pancakes",
    "name": "Pancake bounty vanoise",
    "description": "",
    "price": 7,
    "image": "/assets/menu/PancakeBountyVanoise.jpg",
    "available": true
  },
  {
    "id": "pa-1",
    "categoryId": "pancakes",
    "name": "Pancake Nutella",
    "description": "",
    "price": 11.5,
    "image": "/assets/menu/PancakeNutella.jpg",
    "available": true
  },
  {
    "id": "pa-2",
    "categoryId": "pancakes",
    "name": "Pancake Oreo",
    "description": "",
    "price": 12.5,
    "image": "/assets/menu/PancakeNutella.jpg",
    "available": true
  },
  {
    "id": "pa-3",
    "categoryId": "pancakes",
    "name": "Pancake Snickers",
    "description": "",
    "price": 13.5,
    "image": "/assets/menu/PancakeSnickers.jpg",
    "available": true
  },
  {
    "id": "pa-4",
    "categoryId": "pancakes",
    "name": "Pancake Raffaello",
    "description": "",
    "price": 14.5,
    "available": true
  },
  {
    "id": "pa-5",
    "categoryId": "pancakes",
    "name": "Pancake Fruit Sec",
    "description": "",
    "price": 13.5,
    "image": "/assets/menu/PancakeFruitSec.jpg",
    "available": true
  },
  {
    "id": "prod-1762693964495",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre chocolat vanoise",
    "description": "",
    "price": 7,
    "image": "/assets/menu/GaufreNutella.jpg",
    "available": true
  },
  {
    "id": "prod-1762693978016",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre Oreo vanoise",
    "description": "",
    "price": 8.5,
    "image": "/assets/menu/GaufreOreo.jpg",
    "available": true
  },
  {
    "id": "prod-1762693993416",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre rafaello vanoise",
    "description": "",
    "price": 10.5,
    "image": "/assets/menu/GaufreRaffaello.jpg",
    "available": true
  },
  {
    "id": "prod-1762694008657",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre snickers vanoise",
    "description": "",
    "price": 9,
    "image": "/assets/menu/GaufreSnickers.jpeg",
    "available": true
  },
  {
    "id": "prod-1762694031775",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre fruits sec vanoise",
    "description": "",
    "price": 8.8,
    "image": "/assets/menu/GaufreFruitSec.jpg",
    "available": true
  },
  {
    "id": "prod-1762694072457",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre bounty vanoise",
    "description": "",
    "price": 7,
    "image": "/assets/menu/GaufreBountyNutella.jpg",
    "available": true
  },
  {
    "id": "gc-1",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre Nutella",
    "description": "",
    "price": 12,
    "image": "/assets/menu/GaufreNutella.jpg",
    "available": true
  },
  {
    "id": "gc-2",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre Oreo",
    "description": "",
    "price": 13.5,
    "image": "/assets/menu/GaufreOreo.jpg",
    "available": true
  },
  {
    "id": "gc-3",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre Snickers",
    "description": "",
    "price": 13.9,
    "image": "/assets/menu/GaufreSnickers.jpeg",
    "available": true
  },
  {
    "id": "gc-4",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre Raffaello",
    "description": "",
    "price": 14.5,
    "image": "/assets/menu/GaufreRaffaello.jpg",
    "available": true
  },
  {
    "id": "gc-5",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre Fruit Sec",
    "description": "",
    "price": 13.4,
    "image": "/assets/menu/GaufreFruitSec.jpg",
    "available": true
  },
  {
    "id": "gc-6",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Gaufre Bounty Nutella",
    "description": "",
    "price": 13.5,
    "image": "/assets/menu/GaufreBountyNutella.jpg",
    "available": true
  },
  {
    "id": "gc-7",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Crêpe Nutella",
    "description": "",
    "price": 10.4,
    "image": "/assets/menu/Cr%C3%AApeNutella.jpg",
    "available": false
  },
  {
    "id": "gc-8",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Crêpe Oreo",
    "description": "",
    "price": 12,
    "image": "/assets/menu/Cr%C3%AApeOreo.jpg",
    "available": false
  },
  {
    "id": "gc-9",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Crêpe Snickers",
    "description": "",
    "price": 12,
    "image": "/assets/menu/Cr%C3%AApeSnickers.jpg",
    "available": false
  },
  {
    "id": "gc-10",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Crêpe Raffaello",
    "description": "",
    "price": 12.9,
    "image": "/assets/menu/Cr%C3%AApeRaffaello.jpg.png",
    "available": false
  },
  {
    "id": "gc-11",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Crêpe Fruit Sec",
    "description": "",
    "price": 11.5,
    "image": "/assets/menu/Cr%C3%AApeFruitSec.jpg",
    "available": false
  },
  {
    "id": "gc-12",
    "categoryId": "gaufres-crepes-sucrees",
    "name": "Crêpe Bounty",
    "description": "",
    "price": 11,
    "image": "/assets/menu/Cr%C3%AApeBounty.jpg",
    "available": false
  },
  {
    "id": "prod-1787094992842",
    "categoryId": "snacks-sales",
    "name": "Panini Thon",
    "description": "",
    "price": 6.8,
    "image": "/assets/menu/PaniniThon.png",
    "available": true
  },
  {
    "id": "prod-1787095033745",
    "categoryId": "snacks-sales",
    "name": "Panini Jombon",
    "description": "",
    "price": 6,
    "image": "/assets/menu/PaniniJambon.png",
    "available": true
  },
  {
    "id": "prod-1787095057520",
    "categoryId": "snacks-sales",
    "name": "Panini Spécial",
    "description": "",
    "price": 8,
    "image": "/assets/menu/PaniniSp%C3%A9cial.png",
    "available": true
  },
  {
    "id": "ss-1",
    "categoryId": "snacks-sales",
    "name": "Crêpe Thon",
    "description": "",
    "price": 9,
    "image": "/assets/menu/Cr%C3%AApeThon.jpg",
    "available": true
  },
  {
    "id": "ss-2",
    "categoryId": "snacks-sales",
    "name": "Crêpe Jambon",
    "description": "",
    "price": 8.5,
    "image": "/assets/menu/Cr%C3%AApeJambon.jpg",
    "available": true
  },
  {
    "id": "ss-3",
    "categoryId": "snacks-sales",
    "name": "Crêpe Spéciale",
    "description": "",
    "price": 11,
    "image": "/assets/menu/Cr%C3%AApeSp%C3%A9ciale.jpg",
    "available": true
  }
];
