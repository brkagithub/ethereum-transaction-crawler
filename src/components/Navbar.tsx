import NextLink from "next/link";

// Define the type for the navigation object
type navigationType = {
  name: string;
  href: string;
};

// Add more routes if needed here
const navigation: navigationType[] = [
  {
    name: "Transactions",
    href: "/",
  },
  { name: "Token balance", href: "/balance" },
];

const Navbar: React.FC<{}> = ({}) => {
  return (
    <div id="navbar" className="flex flex-row items-center justify-center">
      {navigation.map((n) => (
        <NextLink
          key={n.name}
          href={n.href}
          className="pr-3 pl-3 underline underline-offset-2"
        >
          {n.name}
        </NextLink>
      ))}
    </div>
  );
};

export default Navbar;
