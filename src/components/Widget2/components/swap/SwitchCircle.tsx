export function SwitchCircle({ onClick, style }: { onClick: () => void; style: React.CSSProperties }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={style}
    >
      <rect width="40" height="40" rx="12" fill="#ffffff" />
      <path
        d="M18 14.5L22.5 10M22.5 10L27 14.5M22.5 10V20"
        stroke="#121212"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 25.5L17.5 30M17.5 30L13 25.5M17.5 30L17.5 21"
        stroke="#121212"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
