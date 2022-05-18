import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Header } from "./components/header";
import type { ShoppingCart } from "./components/shopping-cart";
import { commitSession, getSession } from "./sessions";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Iconic Devs Exercise 1",
  viewport: "width=device-width,initial-scale=1",
});

const emptyShoppingCart: ShoppingCart = {
  items: [],
  totalPrice: 0,
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("shoppingCart")) {
    return json({ shoppingCart: emptyShoppingCart });
  }

  return json(
    {
      shoppingCart: session.get("shoppingCart"),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

interface LoaderData {
  shoppingCart: ShoppingCart;
}

export default function App() {
  const { shoppingCart } = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Header shoppingCart={shoppingCart} />

        <div className="bg-white">
          <div className="max-w-2xl mx-auto py-16 px-4 sm:py-18 sm:px-6 lg:max-w-7xl lg:px-8">
            <Outlet />
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
