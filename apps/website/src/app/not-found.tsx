'use client';

import Error from 'next/error';

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <h1 className="text-4xl font-bold text-center mt-20">Page Not Found</h1>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
