interface AsatLogoProps {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export function AsatLogo({
  className,
  markClassName,
  wordmarkClassName,
  size = 'md',
  showWordmark = true,
}: AsatLogoProps) {
  const sizes = {
    sm: {
      mark: 'h-8 w-8',
      wordmark: 'text-xl tracking-[0.16em]',
    },
    md: {
      mark: 'h-10 w-10',
      wordmark: 'text-2xl tracking-[0.18em]',
    },
    lg: {
      mark: 'h-20 w-20',
      wordmark: 'text-5xl tracking-[0.2em]',
    },
  };

  return (
    <div className={joinClasses('flex items-center gap-3', className)}>
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={joinClasses(
          sizes[size].mark,
          'text-[#F4F6F8]',
          markClassName
        )}
        fill="none"
      >
        <path
          d="M32 5L42 22H35L32 16L29 22H22L32 5Z"
          fill="currentColor"
        />
        <path
          d="M22 26L31 21.5V30L25 34L22 42H13L18 29.5L22 26Z"
          fill="currentColor"
        />
        <path
          d="M42 26L33 21.5V30L39 34L42 42H51L46 29.5L42 26Z"
          fill="currentColor"
        />
        <path d="M28.5 34H35.5V51L32 55L28.5 51V34Z" fill="currentColor" />
      </svg>

      {showWordmark ? (
        <span
          className={joinClasses(
            'font-semibold uppercase text-[#F4F6F8]',
            sizes[size].wordmark,
            wordmarkClassName
          )}
        >
          ASAT
        </span>
      ) : null}
    </div>
  );
}
