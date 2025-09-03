import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15.545 6.558C14.832 5.844 13.92 5.5 13 5.5c-1.818 0-3.375 1.05-4.037 2.537C8.28 9.537 8 10.737 8 12s.28 2.463.963 3.963C9.625 17.45 11.182 18.5 13 18.5c.92 0 1.832-.344 2.545-1.058.423-.423.75-.9.955-1.442h-3.5V13H18v.5c0 1.344-.463 2.537-1.25 3.537-.9.9-2.063 1.463-3.75 1.463-2.318 0-4.318-1.5-5.063-3.563C7.25 13.963 7 12.963 7 12s.25-1.963.937-3.437C8.682 6.5 10.682 5 13 5c1.455 0 2.727.563 3.682 1.563L15.545 6.558z" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
