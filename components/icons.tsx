/** Small stroke icons (24px grid, currentColor). */
type P = { className?: string };
const S = ({ className, children }: P & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

export const IcPhone = (p: P) => (
  <S {...p}>
    <path d="M5 3h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 5.1 5.1l1.4-2.3L19 13.5V17a2 2 0 0 1-2 2A14 14 0 0 1 3 5a2 2 0 0 1 2-2z" />
  </S>
);
export const IcMail = (p: P) => (
  <S {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </S>
);
export const IcPin = (p: P) => (
  <S {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.6" />
  </S>
);
export const IcFactory = (p: P) => (
  <S {...p}>
    <path d="M3 21V10l6 3.5V10l6 3.5V6h3l1 15z" />
    <path d="M7 17h2M12 17h2" />
  </S>
);
export const IcBox = (p: P) => (
  <S {...p}>
    <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
    <path d="M3 7.5 12 12l9-4.5M12 12v9M7.5 5.2l9 4.5" />
  </S>
);
export const IcCallback = (p: P) => (
  <S {...p}>
    <path d="M5 3h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 5.1 5.1l1.4-2.3L19 13.5V17a2 2 0 0 1-2 2A14 14 0 0 1 3 5a2 2 0 0 1 2-2z" />
    <path d="M15 3h6v6M21 3l-6 6" />
  </S>
);
export const IcHeart = (p: P) => (
  <S {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
  </S>
);
export const IcShield = (p: P) => (
  <S {...p}>
    <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z" />
    <path d="m8.8 12 2.3 2.3 4.2-4.6" />
  </S>
);
export const IcWheat = (p: P) => (
  <S {...p}>
    <path d="M12 22V9" />
    <path d="M12 9c-2.5 0-3.5-2-3.5-4C11 5 12 7 12 9zM12 9c2.5 0 3.5-2 3.5-4C13 5 12 7 12 9zM12 14c-2.5 0-4-1.8-4-4 2.6 0 4 1.8 4 4zM12 14c2.5 0 4-1.8 4-4-2.6 0-4 1.8-4 4zM12 19c-2.5 0-4-1.8-4-4 2.6 0 4 1.8 4 4zM12 19c2.5 0 4-1.8 4-4-2.6 0-4 1.8-4 4z" />
  </S>
);
export const IcFlame = (p: P) => (
  <S {...p}>
    <path d="M12 21c-3.9 0-6.5-2.7-6.5-6.2 0-4.3 4-6.3 4.5-10.8 3 1.8 4.8 4.4 4.8 7 1-.6 1.6-1.6 1.8-2.8 1.3 1.4 1.9 3.3 1.9 5.2C18.5 18.3 15.9 21 12 21z" />
  </S>
);
export const IcKnife = (p: P) => (
  <S {...p}>
    <rect x="4" y="9" width="16" height="10" rx="2.5" />
    <path d="M9 9v10M14 9v10M7 5l2 2M12 4v3M17 5l-2 2" />
  </S>
);
export const IcPack = (p: P) => (
  <S {...p}>
    <path d="M6 3h12l-1 3v12l1 3H6l1-3V6z" />
    <path d="M9.5 10h5M9.5 13.5h5" />
  </S>
);
export const IcClock = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </S>
);
export const IcArrow = (p: P) => (
  <S {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </S>
);

export const IcWhatsapp = ({ className }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <path
      fill="currentColor"
      d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"
    />
  </svg>
);
export const GmailLogo = ({ className }: P) => (
  <svg viewBox="52 42 88 66" className={className} aria-hidden>
    <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
    <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
    <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
    <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
    <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
  </svg>
);
export const IcFacebook = (p: P) => (
  <S {...p}>
    <path d="M14 21v-8h3l.5-3.5H14V7.8c0-1 .3-1.8 1.8-1.8h1.8V3a24 24 0 0 0-2.6-.1c-2.6 0-4.3 1.6-4.3 4.4v2.2H7.8V13h2.9v8" />
  </S>
);
export const IcInstagram = (p: P) => (
  <S {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </S>
);
export const IcYoutube = (p: P) => (
  <S {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10 9 5 3-5 3z" fill="currentColor" />
  </S>
);
