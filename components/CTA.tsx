export function CTA() {
  return (
    <section className="border-b border-white/10 bg-[#050816]">
      <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <div className="text-[11px] uppercase tracking-[0.28em] text-[#8FA3BC]">
          Final Call / Registry Entry
        </div>

        <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
          Enter the ASAT Registry.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#C8D2DF] sm:text-xl">
          Register a wallet, secure tier visibility, and establish early position in the ASAT
          protocol.
        </p>

        <div className="mt-8">
          <a
            href="#registry"
            className="inline-flex items-center justify-center border border-[#F4F0E8] bg-[#F4F0E8] px-8 py-4 text-base font-semibold text-[#050816] transition hover:opacity-90"
          >
            Register Wallet
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
