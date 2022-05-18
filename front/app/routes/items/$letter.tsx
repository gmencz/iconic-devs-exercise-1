import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import clsx from "clsx";
import { json } from "@remix-run/node";
import { Form, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import type { ShoppingCart } from "~/components/shopping-cart";
import { commitSession, getSession } from "~/sessions";
import type { Item } from "..";

const emptyShoppingCart: ShoppingCart = {
  items: [],
  totalPrice: 0,
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { letter } = params;
  const response = await fetch(`${process.env.API}/items/${letter}`);
  if (response.status === 404) {
    throw new Response("Not Found", { status: 404 });
  }

  const data = await response.json();
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("shoppingCart")) {
    return json({ item: data.item, shoppingCart: emptyShoppingCart });
  }

  return json({
    item: data.item,
    shoppingCart: session.get("shoppingCart"),
  });
};

export const getTotalPrice = (items: ShoppingCart["items"]) =>
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
    const isOffer = formData.has("isOffer");

    const items: ShoppingCart["items"] = shoppingCart.items.map((item) => {
      if (item.details.letter === itemToAdd.letter) {
        return {
          ...item,
          amount: isOffer ? amount : item.amount + (amount || 1),
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
  shoppingCart: ShoppingCart;
}

export default function ItemView() {
  const { item, shoppingCart } = useLoaderData<LoaderData>();
  const transition = useTransition();
  const isOfferTransition =
    transition.state === "submitting" &&
    Number(transition.submission?.formData.get("amount") || 1) > 1;

  const isIndividualTransition =
    transition.state === "submitting" &&
    Number(transition.submission?.formData.get("amount")) === 1;

  const itemInCart = shoppingCart.items.find(
    ({ details }) => details.letter === item.letter
  );

  const isOfferInCart = shoppingCart.items.some(
    ({ details, amount }) =>
      details.letter === item.letter && amount === item.offer?.amount
  );

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
            <Form method="post">
              <div className="flex items-center mt-4 ml-4">
                <button
                  type="submit"
                  disabled={isOfferTransition || isOfferInCart}
                  className={clsx(
                    "flex items-center space-x-3 cursor-pointer group pr-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded disabled:cursor-not-allowed",

                    isOfferInCart && "line-through"
                  )}
                >
                  <span
                    className={clsx(
                      "bg-red-500 font-bold text-white p-2 rounded text-xs group-hover:bg-red-400 flex items-center disabled:bg-red-300",

                      isOfferTransition || isOfferInCart ? "bg-red-400" : null
                    )}
                  >
                    {isOfferTransition ? (
                      <svg
                        className="animate-spin h-4 w-4 text-white mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : null}

                    <span>LIMITED OFFER</span>
                  </span>

                  <span
                    className={clsx(
                      "font-medium underline group-hover:opacity-60",

                      isOfferTransition || isOfferInCart ? "opacity-60" : null
                    )}
                  >
                    {item.offer.amount} for only {item.offer.price} €
                  </span>
                </button>

                {isOfferTransition || isOfferInCart ? (
                  <span className="font-medium ml-2 text-sm">
                    Offer currently in cart
                  </span>
                ) : null}
              </div>

              <input type="hidden" name="amount" value={item.offer.amount} />
              <input type="hidden" name="isOffer" value="true" />
            </Form>
          ) : null}
        </div>

        <Form method="post">
          <button
            type="submit"
            disabled={isIndividualTransition}
            className="flex disabled:bg-red-400 disabled:cursor-not-allowed items-center text-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-8 bg-red-500 p-4 text-white rounded font-bold w-full hover:bg-red-400"
          >
            {isIndividualTransition ? (
              <svg
                className="animate-spin h-4 w-4 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}

            <span>Add 1 unit to cart</span>
          </button>

          <input type="hidden" name="amount" value="1" />
        </Form>

        {itemInCart ? (
          <p className="mt-4 font-medium text-sm">
            {itemInCart.amount} {itemInCart.amount === 1 ? "unit" : "units"}{" "}
            currently in cart
          </p>
        ) : null}
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
