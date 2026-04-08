import CustomQuoteBuilder from "./CustomQuoteBuilder";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ name?: string; email?: string; phone?: string }>;
};

export default async function AdminNewCustomQuotePage({ searchParams }: Props) {
  const sp = await searchParams;
  return (
    <CustomQuoteBuilder
      initialName={sp.name?.trim() ?? ""}
      initialEmail={sp.email?.trim() ?? ""}
      initialPhone={sp.phone?.trim() ?? ""}
    />
  );
}
