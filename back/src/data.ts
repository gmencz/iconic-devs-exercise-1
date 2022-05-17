// Here we will have the supermarket items, normally all of this data would come
// from a database but we are not using one to keep it simple so all the data
// will be static and maintained in this file.

interface ItemOffer {
  // The amount of items for the offer to be applicable.
  amount: number;

  // The price of the offer (for example, buy 3 of item "A" for 130).
  price: number;
}

interface Item {
  // The equivalent of an "SKU" for this project.
  letter: string;

  // The name of the item (for example, Adidas Pants).
  name: string;

  // The URL pointing to an image of the item if available.
  previewURL?: string;

  // The price of the item itself.
  price: number;

  // The current offer if any of the item.
  offer?: ItemOffer;
}

// Most of the items were taken from the Amazon and Alcampo websites.
export const items: Item[] = [
  {
    letter: "A",
    price: 50,
    name: "Optimum Nutrition Gold Standard 100% Whey Protein Powder, Double Rich Chocolate 2 Pound",
    previewURL:
      "https://m.media-amazon.com/images/I/61LUdzOBr+L._AC_SX679_.jpg",
    offer: {
      amount: 3,
      price: 130,
    },
  },

  {
    letter: "B",
    price: 2,
    name: "ALCAMPO Fresh Eggs category A (12 units)",
    previewURL: "https://www.alcampo.es/media/hd3/h3f/11316536410142.jpg",
    offer: {
      amount: 3,
      price: 4.5,
    },
  },

  {
    letter: "C",
    price: 25,
    name: "CeraVe Hydrating Facial Cleanser | Moisturizing Non-Foaming Face Wash with Hyaluronic Acid, Ceramides and Glycerin | 16 Fluid Ounce",
    previewURL: "https://m.media-amazon.com/images/I/51DbQev1thL._SX679_.jpg",
  },

  {
    letter: "D",
    price: 15,
    name: "Apple Pencil (2nd Generation)",
    previewURL:
      "https://m.media-amazon.com/images/I/21SPDoiRuGL._AC_SX679_.jpg",
  },
];
