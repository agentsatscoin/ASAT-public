import { NextResponse } from 'next/server';

const ASAT_MINT =
  process.env.NEXT_PUBLIC_ASAT_MINT ||
  'HumYaGUBQva6HgP9BNqioicEGijVRK2xtSUMiT4gpump';

const RPC_URL =
  process.env.SOLANA_RPC_URL ||
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  'https://api.mainnet-beta.solana.com';

function json(payload: unknown, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function readUiAmount(tokenAmount: any): number {
  if (tokenAmount?.uiAmount != null) {
    return toNumber(tokenAmount.uiAmount);
  }

  if (tokenAmount?.uiAmountString != null) {
    return toNumber(tokenAmount.uiAmountString);
  }

  const raw = toNumber(tokenAmount?.amount);
  const decimals = toNumber(tokenAmount?.decimals);

  if (decimals <= 0) return raw;
  return raw / Math.pow(10, decimals);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = String(searchParams.get('wallet') || '').trim();

    if (!wallet) {
      return json({ error: 'Missing wallet address' }, 400);
    }

    const rpcRes = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          wallet,
          { mint: ASAT_MINT },
          { encoding: 'jsonParsed' },
        ],
      }),
    });

    const rpcData = await rpcRes.json().catch(() => null);

    if (!rpcRes.ok || rpcData?.error) {
      return json(
        {
          error:
            rpcData?.error?.message ||
            'Failed to fetch ASAT balance from Solana RPC',
          details: rpcData,
        },
        500
      );
    }

    const accounts = Array.isArray(rpcData?.result?.value)
      ? rpcData.result.value
      : [];

    const asatBalance = accounts.reduce((sum: number, account: any) => {
      return (
        sum +
        readUiAmount(account?.account?.data?.parsed?.info?.tokenAmount)
      );
    }, 0);

    return json({
      wallet,
      mint: ASAT_MINT,
      asatBalance,
    });
  } catch (error) {
    return json(
      {
        error: 'Failed to fetch ASAT balance',
        message: String(error),
      },
      500
    );
  }
}
