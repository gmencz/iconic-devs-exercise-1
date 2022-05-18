export interface ItemOffer {
  // The amount of items for the offer to be applicable.
  amount: number;

  // The price of the offer (for example, buy 3 of item "A" for 130).
  price: number;
}

export interface Item {
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
