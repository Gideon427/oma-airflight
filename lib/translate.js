'use client';
import { useEffect } from 'react';

export default function GoogleTranslateWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'tr,en,fr,de,es,ar,ru,zh-CN,ja', // Add more if needed
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };
  }, []);

  return (
    <div id="google_translate_element" className="my-2"></div>
  );
}