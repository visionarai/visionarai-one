export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
