import { clsx } from "clsx";
import { Accessibility, Bike, Database } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  indianFirstNames,
  indianLastNames,
  vehicleAccessories,
} from "./constants";

// Helper for merging class names.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const BAJAJ_TOP_PRODUCTS = [
  {
    type: "Vehicle",
    icon: <Bike />,
    model: "Bajaj Pulsar 150",
    sales: 18,
    revenue: "₹18,50,000",
  },
  {
    type: "Accessories",
    icon: <Accessibility />,
    model: "Brake Shoes C28",
    sales: 90,
    revenue: "20,000",
  },
  {
    type: "Accessories",
    icon: <Accessibility />,
    model: "Clutch Plate 220",
    sales: 80,
    revenue: "50,000",
  },
  {
    type: "Apparels",
    icon: <Database />,
    model: "Bajaj Helmet",
    sales: 40,
    revenue: "69,990",
  },
];

const TRIUMPH_TOP_PRODUCTS = [
  {
    type: "Vehicle",
    icon: <Bike />,
    model: "Triumph Scambler 400X",
    sales: 18,
    revenue: "₹18,50,000",
  },
  {
    type: "Accessories",
    icon: <Accessibility />,
    model: "Brake Shoes C28",
    sales: 90,
    revenue: "20,000",
  },
  {
    type: "Accessories",
    icon: <Accessibility />,
    model: "Cylinder",
    sales: 80,
    revenue: "50,000",
  },
  {
    type: "Apparels",
    icon: <Database />,
    model: "Triumph Helmet",
    sales: 40,
    revenue: "69,990",
  },
];

const VESPA_TOP_PRODUCTS = [
  {
    type: "Vehicle",
    icon: <Bike />,
    model: "Vespa",
    sales: 18,
    revenue: "₹18,50,000",
  },
  {
    type: "Accessories",
    icon: <Accessibility />,
    model: "Brake Shoes C28",
    sales: 90,
    revenue: "20,000",
  },
  {
    type: "Accessories",
    icon: <Accessibility />,
    model: "Cylinder",
    sales: 80,
    revenue: "50,000",
  },
  {
    type: "Apparels",
    icon: <Database />,
    model: "Vespa Helmet",
    sales: 40,
    revenue: "69,990",
  },
];

const TATA_TOP_PRODUCTS = [
  {
    type: "Vehicle",
    icon: <Bike />,
    model: "Tata Nexon EV",
    sales: 18,
    revenue: "₹18,50,000",
  },
  {
    type: "Accessories",
    icon: <Accessibility />,
    model: "Brake Shoes C28",
    sales: 90,
    revenue: "20,000",
  },
  {
    type: "Accessories",
    icon: <Accessibility />,
    model: "Cylinder",
    sales: 80,
    revenue: "50,000",
  },
  {
    type: "Apparels",
    icon: <Database />,
    model: "Tata Helmet",
    sales: 40,
    revenue: "69,990",
  },
];

export const filterProductsByBrandName = (brandName) => {
  switch (brandName) {
    case "Bajaj":
      return BAJAJ_TOP_PRODUCTS;
    case "Triumph":
      return TRIUMPH_TOP_PRODUCTS;
    case "Vespa":
      return VESPA_TOP_PRODUCTS;
    case "Tata":
      return TATA_TOP_PRODUCTS;
    default:
      return [];
  }
};

export const PickAName = () => {
  const firstName =
    indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)];
  const lastName =
    indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
  return `${firstName} ${lastName}`;
};

export const PickAColor = () => {
  const colors = ["Red", "Black", "Blue", "Yellow", "White", "Cyan"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return color;
};

export const PickAccessories = () => {
  const i = Math.floor(Math.random() * 4) + 1;
  const array = new Array(i);
  for (let i = 0; i < array.length; i++) {
    array[i] =
      vehicleAccessories[
        Math.floor(Math.random() * vehicleAccessories.length)
      ];
  }
  return array;
};

export const pickAPolicyProvider = () => {
  const vehicleInsuranceProviders = [
    "Bajaj Allianz General Insurance",
    "ICICI Lombard General Insurance",
    "HDFC ERGO General Insurance",
    "Tata AIG General Insurance",
    "SBI General Insurance",
    "Oriental Insurance Company",
    "United India Insurance Company",
    "Reliance General Insurance",
    "Shriram General Insurance",
    "Royal Sundaram General Insurance",
    "Kotak Mahindra General Insurance",
    "Edelweiss General Insurance",
  ];

  const provider =
    vehicleInsuranceProviders[
      Math.floor(Math.random() * vehicleInsuranceProviders.length)
    ];
  return provider;
};

export const pickAProduct = (brandName) => {
  const productNameArray =
    brandName === "Bajaj"
      ? ["Bajaj Pulsar 150", "Bajaj Avenger 150", "Bajaj Dominar 250"]
      : brandName === "Vespa"
      ? ["Vespa 125", "Vespa 125XT"]
      : brandName === "Tata"
      ? ["Tata Nexon", "Tata Nexon 2.0", "Tata Nexon 2.0 XZ"]
      : brandName === "Triumph"
      ? [
          "Triumph Street Triple",
          "Triumph Street Triple 125",
          "Triumph Street Triple 150",
        ]
      : [];

  const product =
    productNameArray[Math.floor(Math.random() * productNameArray.length)];
  return product;
};

// Helper function to calculate day difference.
// This function accepts a createdAt date string (or value parsable by Date)
// and returns the number of days difference from the current date.
export const calculateDateDifference = (createdAt) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffTime = now - createdDate; 
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
};

export const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const pickABrand = () => {
  const brands = ["Bajaj", "Vespa", "Tata", "Triumph"];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  return brand;
<<<<<<< HEAD
};
=======
}

export const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
>>>>>>> 4c42cce905c89e5b0f938bb5480653276afdbf17
