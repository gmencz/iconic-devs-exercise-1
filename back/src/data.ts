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

// Items were taken from the Amazon website.
export const items: Item[] = [
  {
    letter: "A",
    price: 12.99,
    name: "DELCARINO Men's Long Sleeve Button Up Shirts Solid Slim Fit Casual Business Formal Dress Shirt",
    previewURL: `${process.env.API}/item_A.png`,
    offer: {
      amount: 2,
      price: 19.99,
    },
  },

  {
    letter: "B",
    price: 12.66,
    name: "SSLR Mens Hawaiian Shirt Flamingos Casual Short Sleeve Button Down Shirts Aloha Shirt",
    previewURL: `${process.env.API}/item_B.png`,
    offer: {
      amount: 3,
      price: 27.99,
    },
  },

  {
    letter: "C",
    price: 20.39,
    name: "IGEEKWELL Mens Golf Polo Shirt Short Sleeve Tennis Running Daily Hiking Fishing Polo Shirt",
    previewURL: `${process.env.API}/item_C.png`,
  },

  {
    letter: "D",
    price: 11.77,
    name: "HISDERN Men's Inner Contrast Casual Shirts Formal Classic Button Down Dress Shirt Long Sleeve Printed Regular Fit Shirt",
    previewURL: `${process.env.API}/item_D.png`,
  },
];
