import { Metadata } from "next";

export const metadata: Metadata = {
  title: "მეწარმეები - Sellers",
  description: "უნიკალური პროდუქციის ავტორები",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full flex justify-center">{children}</div>;
}
