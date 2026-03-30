'use client';

export default function CTA() {
  return (
    <section className="border-b border-white/10 bg-[#050816] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-3 protocol-kicker">Final Call / Registry Entry</div>
        <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[#F4F6F8] sm:text-6xl">
          Enter the ASAT Registry.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#C9D3DF] sm:text-xl">
          Register a wallet, secure tier visibility, and establish early position
          in the ASAT protocol.
        </p>
        <div className="mt-8">
          <a href="#registry" className="btn-primary">
            Register Wallet
          </a>
        </div>
      </div>
    </section>
  );
}
