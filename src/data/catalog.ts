export interface Product {
  id: number;
  name: string;
  code: string;
  category: 'Hidromasajes' | 'Turcos' | 'Saunas' | 'Piletas' | 'Tuberías' | 'Agua Potable' | 'Riego' | 'Accesorios';
  price: number;
  promoPrice?: number;
  img: string;
  tags?: string[];
}

export const catalogData: Product[] = [
  // HIDROMASAJES
  {
    id: 1,
    name: "HIDROMASAJE DUO PREMIUM",
    code: "AQ-HID-DUO",
    category: 'Hidromasajes',
    price: 2450.00,
    promoPrice: 2190.00,
    img: "https://cesarweb.b-cdn.net/Hidromasaje-Aquatech/model-duo.webp",
    tags: ['BEST SELLER', 'IBAX TECH']
  },
  {
    id: 2,
    name: "HIDROMASAJE MERENGUE SOCIAL",
    code: "AQ-HID-MER",
    category: 'Hidromasajes',
    price: 3120.00,
    img: "https://cesarweb.b-cdn.net/Hidromasaje-Aquatech/model-merengue.webp",
    tags: ['NEW']
  },
  {
    id: 3,
    name: "RELAX ELITE RECTANGULAR",
    code: "AQ-HID-REL",
    category: 'Hidromasajes',
    price: 1890.00,
    promoPrice: 1750.00,
    img: "https://cesarweb.b-cdn.net/Hidromasaje-Aquatech/model-relax.webp"
  },
  {
    id: 4,
    name: "SWIM SPA PRO FLOW",
    code: "AQ-HID-SWI",
    category: 'Hidromasajes',
    price: 8400.00,
    img: "https://cesarweb.b-cdn.net/Hidromasaje-Aquatech/model-swim.webp",
    tags: ['EXCLUSIVE']
  },
  {
    id: 5,
    name: "SPA EXTERIOR TITANIUM",
    code: "AQ-HID-SPA-T",
    category: 'Hidromasajes',
    price: 5900.00,
    img: "https://cesarweb.b-cdn.net/Hidromasaje-Aquatech/cat-spas.webp"
  },
  {
    id: 6,
    name: "JACUZZI ESQUINERO JADE",
    code: "AQ-HID-JAD",
    category: 'Hidromasajes',
    price: 1650.00,
    img: "https://cesarweb.b-cdn.net/Hidromasaje-Aquatech/cat-jacuzzis.webp"
  },
  {
    id: 7,
    name: "TINA ROMA MINIMALIST",
    code: "AQ-HID-ROM",
    category: 'Hidromasajes',
    price: 1100.00,
    img: "https://cesarweb.b-cdn.net/Hidromasaje-Aquatech/cat-tinas.webp"
  },
  {
    id: 8,
    name: "HIDROMASAJE ZEN CIRCULAR",
    code: "AQ-HID-ZEN",
    category: 'Hidromasajes',
    price: 2800.00,
    img: "https://cesarweb.b-cdn.net/Hidromasaje-Aquatech/hero-hidromasaje.webp"
  },
  {
    id: 9,
    name: "SPA FAMILIAR GRANDE",
    code: "AQ-HID-FAM",
    category: 'Hidromasajes',
    price: 4500.00,
    img: "https://cesarweb.b-cdn.net/home/hero-slider-3.webp"
  },
  {
    id: 10,
    name: "HIDROMASAJE EXECUTIVE",
    code: "AQ-HID-EXE",
    category: 'Hidromasajes',
    price: 3200.00,
    img: "https://cesarweb.b-cdn.net/home/featured-product.webp"
  }
];
