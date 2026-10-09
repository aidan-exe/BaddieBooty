const card =
  "h-8 w-auto shrink-0 rounded-md shadow-[0_1px_0_rgba(0,0,0,0.12)]";

export function PaymentMarks() {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Payment options">
      <li>
        <VisaMark />
      </li>
      <li>
        <MastercardMark id="footer" />
      </li>
      <li>
        <EftMark />
      </li>
      <li>
        <PayflexMark />
      </li>
    </ul>
  );
}

function VisaMark() {
  return (
    <svg viewBox="0 0 58 32" className={card} role="img" aria-label="Visa">
      <rect width="58" height="32" rx="5" fill="#ffffff" />
      <text
        x="29"
        y="21.5"
        textAnchor="middle"
        fill="#1A1F71"
        fontFamily="Arial, Helvetica, sans-serif"
        fontStyle="italic"
        fontWeight="800"
        fontSize="16"
        letterSpacing="0.6"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardMark({ id }: { id: string }) {
  const clipId = `${id}-mastercard-overlap`;
  return (
    <svg viewBox="0 0 52 32" className={card} role="img" aria-label="Mastercard">
      <rect width="52" height="32" rx="5" fill="#ffffff" />
      <circle cx="21" cy="16" r="8" fill="#EB001B" />
      <circle cx="31" cy="16" r="8" fill="#F79E1B" />
      <circle cx="21" cy="16" r="8" fill="#FF5F00" clipPath={`url(#${clipId})`} />
      <defs>
        <clipPath id={clipId}>
          <circle cx="31" cy="16" r="8" />
        </clipPath>
      </defs>
    </svg>
  );
}

function PayFastMark() {
  return (
    <svg viewBox="0 0 78 32" className={card} role="img" aria-label="PayFast">
      <rect width="78" height="32" rx="5" fill="#ffffff" />
      <text
        x="39"
        y="21"
        textAnchor="middle"
        fill="#111111"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="13"
        letterSpacing="-0.4"
      >
        payfast
      </text>
    </svg>
  );
}

export function CheckoutTrustMarks() {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="PayFast, Visa, and Mastercard">
      <li>
        <PayFastMark />
      </li>
      <li>
        <VisaMark />
      </li>
      <li>
        <MastercardMark id="checkout" />
      </li>
    </ul>
  );
}

function EftMark() {
  return (
    <svg viewBox="0 0 52 32" className={card} role="img" aria-label="EFT">
      <rect width="52" height="32" rx="5" fill="#ffffff" />
      <path
        d="M14.2 13.2h7.2l-.55-1.35a.6.6 0 0 0-.55-.37h-5.55a.6.6 0 0 0-.55.37L14.2 13.2Z"
        fill="#0B3A66"
      />
      <path
        d="M13 14.2h9.6v6.15a.7.7 0 0 1-.7.7H13.7a.7.7 0 0 1-.7-.7V14.2Z"
        fill="#0B3A66"
      />
      <path d="M15.1 16.15h5.4M15.1 18.15h5.4" stroke="#ffffff" strokeWidth="0.8" />
      <text
        x="35.5"
        y="21"
        textAnchor="middle"
        fill="#0B3A66"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="13"
        letterSpacing="0.4"
      >
        EFT
      </text>
    </svg>
  );
}

function PayflexMark() {
  return (
    <svg viewBox="0 0 78 32" className={card} role="img" aria-label="Payflex">
      <rect width="78" height="32" rx="5" fill="#ffffff" />
      <text
        x="39"
        y="21"
        textAnchor="middle"
        fill="#111111"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="13"
        letterSpacing="-0.3"
      >
        payflex
      </text>
    </svg>
  );
}
