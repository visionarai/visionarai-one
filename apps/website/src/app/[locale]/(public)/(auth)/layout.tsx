export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <section className="w-full max-w-md rounded-lg bg-card p-8 shadow-md">{children}</section>
    </div>
  );
}
