import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShoppingCart } from "~/components/shopping-cart";
import { getTotalPrice } from "~/components/shopping-cart";
import { commitSession, getSession } from "~/sessions";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const letter = formData.get("letter");
  if (!letter) {
    return json({ message: "Invalid payload" }, { status: 400 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const shoppingCart: ShoppingCart = session.get("shoppingCart");
  if (!letter) {
    throw json({ message: "Empty shopping cart" }, { status: 400 });
  }

  const newItems = shoppingCart.items.filter(
    (item) => item.details.letter !== letter
  );

  const newShoppingCart: ShoppingCart = {
    ...shoppingCart,
    items: newItems,
    totalPrice: getTotalPrice(newItems),
  };

  session.set("shoppingCart", newShoppingCart);
  return redirect(request.headers.get("Referer") ?? `/items`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
