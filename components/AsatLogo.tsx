type AsatLogoProps = {
  className?: string;
};

export function AsatLogo({ className = "h-6 w-6" }: AsatLogoProps) {
  return (
    <img
      src="/logos/asat-agent-glyph.svg"
      alt="ASAT"
      className={className}
    />
  );
}

export default AsatLogo;
