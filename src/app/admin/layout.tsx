export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-portal walker-admin-portal-shell min-vh-100">
      {children}
    </div>
  );
}
