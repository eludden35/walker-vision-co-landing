export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-portal min-vh-100 bg-light text-dark">{children}</div>
  );
}
