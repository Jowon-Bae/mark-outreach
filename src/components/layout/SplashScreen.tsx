'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './splash.css';

export default function SplashScreen() {
  return (
    <div className="splash-container">
      <div className="splash-logo-wrapper pulse">
        <div className="splash-logo" />
      </div>
    </div>
  );
}
