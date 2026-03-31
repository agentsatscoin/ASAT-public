type AsatLogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
};

function cn(...classes: Array<string | undefined | null | false>) {
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
      mark: 'h-7 w-7 text-[13px]',
      title: 'text-[13px] tracking-[0.18em]',
      subtitle: 'text-[8px] tracking-[0.26em]',
      gap: 'gap-2.5',
    },
    md: {
      mark: 'h-9 w-9 text-[16px]',
      title: 'text-lg tracking-[0.18em]',
      subtitle: 'text-[10px] tracking-[0.28em]',
      gap: 'gap-3',
    },
    lg: {
      mark: 'h-11 w-11 text-[18px]',
      title: 'text-xl tracking-[0.18em]',
      subtitle: 'text-[11px] tracking-[0.30em]',
      gap: 'gap-3.5',
    },
  } as const;

  const current = sizes[size];
  const showSubtitle = size !== 'sm';

  return (
    <div className={cn('flex items-center', current.gap, className)}>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center border border-white/20 bg-[#081326] text-white',
          current.mark,
          markClassName
        )}
      >
        <span className="font-semibold leading-none">A</span>
      </div>

      {showWordmark ? (
        <div className={cn('min-w-0', wordmarkClassName)}>
          <div className={cn('font-semibold uppercase leading-none text-white', current.title)}>
            ASAT
          </div>

          {showSubtitle ? (
            <div
              className={cn(
                'mt-1 uppercase leading-none text-[#8FA3BC]',
                current.subtitle
              )}
            >
              Reserve Protocol
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default AsatLogo;
