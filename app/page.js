import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <Link href="/login">Login</Link>
    </div>
  );
}
