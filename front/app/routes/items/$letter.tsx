import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import type { ShoppingCart } from "~/components/shopping-cart";
import { commitSession, getSession } from "~/sessions";
import type { Item } from "..";

export const loader: LoaderFunction = async ({ params }) => {
  const { letter } = params;
  const response = await fetch(`${process.env.API}/items/${letter}`);

  if (response.status === 404) {
    throw new Response("Not Found", { status: 404 });
  }

  const data = await response.json();
  return json(data);
};

const emptyShoppingCart: ShoppingCart = {
  items: [],
  totalPrice: 0,
};

const getTotalPrice = (items: ShoppingCart["items"]) =>
  items.reduce((sum, item) => {
    if (item.amount === item.details.offer?.amount) {
      return sum + item.details.offer.price;
    }

    return sum + item.amount * item.details.price;
  }, 0);

export const action: ActionFunction = async ({ params, request }) => {
  const formData = await request.formData();
  if (!formData.has("amount")) {
    throw json({ message: "Invalid payload" }, { status: 400 });
  }

  const letter = params.letter;
  const response = await fetch(`${process.env.API}/items/${letter}`);
  if (response.status === 404) {
    throw json({ message: "Internal Server Error" }, { status: 500 });
  }

  const data = await response.json();
  if (!data.item) {
    throw json({ message: "Item not found" }, { status: 404 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const { item: itemToAdd } = data as { item: Item };

  const shoppingCart: ShoppingCart =
    session.get("shoppingCart") || emptyShoppingCart;

  const isItemInShoppingCart = shoppingCart.items.some(
    (item) => item.details.letter === itemToAdd.letter
  );

  if (isItemInShoppingCart) {
    const amount = Number(formData.get("amount"));
    const items: ShoppingCart["items"] = shoppingCart.items.map((item) => {
      if (item.details.letter === itemToAdd.letter) {
        return {
          ...item,
          amount: item.amount + (amount || 1),
        };
      }

      return item;
    });

    const newShoppingCart: ShoppingCart = {
      items,
      totalPrice: getTotalPrice(items),
    };

    session.set("shoppingCart", newShoppingCart);
    return redirect(`/items/${letter}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const amount = Number(formData.get("amount"));
  const items: ShoppingCart["items"] = [
    ...shoppingCart.items,
    { amount, details: itemToAdd },
  ];

  const newShoppingCart: ShoppingCart = {
    items,
    totalPrice: getTotalPrice(items),
  };

  session.set("shoppingCart", newShoppingCart);
  return redirect(`/items/${letter}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export function CatchBoundary() {
  const caught = useCatch();

  switch (caught.status) {
    case 404:
      return (
        <>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Item not found
          </h1>
        </>
      );

    default:
      return (
        <>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Something went wrong with the item
          </h1>
        </>
      );
  }
}

interface LoaderData {
  item: Item;
}

export default function ItemView() {
  const { item } = useLoaderData<LoaderData>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-10">
      <div className="relative z-10">
        <h2 className="text-2xl text-gray-900 font-extrabold tracking-tight sm:text-3xl">
          {item.name}
        </h2>
        <div className="flex items-center">
          <p className="mt-4 text-lg font-medium pr-4 border-r">
            {item.price} €
          </p>

          {item.offer ? (
            <form method="POST">
              <button
                type="submit"
                className="mt-4 ml-4 flex items-center space-x-3 cursor-pointer group pr-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              >
                <span className="bg-red-500 font-bold text-white p-2 rounded text-xs group-hover:bg-red-400">
                  LIMITED OFFER
                </span>

                <span className="font-medium underline group-hover:opacity-60">
                  {item.offer.amount} for only {item.offer.price} €
                </span>
              </button>

              <input type="hidden" name="amount" value={item.offer.amount} />
            </form>
          ) : null}
        </div>

        <form method="POST">
          <button
            type="submit"
            className="focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-8 bg-red-500 p-4 text-white rounded font-bold w-full hover:bg-red-400"
          >
            Add to cart
          </button>

          <input type="hidden" name="amount" value="1" />
        </form>
      </div>

      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
        <img
          src={item.previewURL}
          alt="Preview not available"
          className="w-full h-full object-center object-cover group-hover:opacity-75"
        />
      </div>
    </div>
  );
}
