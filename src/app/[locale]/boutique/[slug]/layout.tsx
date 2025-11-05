import { LangType } from "@/i18n/request";
import Product from "./page";

export default async function ModalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: LangType; slug: string }>;
}) {
  const { locale, slug } = await params; // Await the params
  return (
    <div>
      <Product params={Promise.resolve({ locale, slug })} />
      {children}
    </div>
  );
}
