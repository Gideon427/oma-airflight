'use client';

import { useEffect } from 'react';

export default function GoogleTranslateProvider() {
  useEffect(() => {
    // Already loaded
    if (window.google && window.google.translate) {
      return;
    }

    // Create callback BEFORE script loads
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages:
            'en,tr,de,fr,es,ar,ru,zh-CN,ja,pt,it',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // Prevent duplicate script
    const existingScript = document.querySelector(
      'script[src*="translate.google.com"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');

      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';

      script.async = true;

      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        position: 'absolute',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  );
}