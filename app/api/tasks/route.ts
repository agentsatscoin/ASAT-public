import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/asat-supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidSolanaAddress(value: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
}

function cleanText(value: unknown, max = 5000) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().slice(0, max);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet')?.trim() || '';

    const openTasksResult = await supabaseAdmin
      .from('asat_tasks')
      .select('*')
      .eq('status', 'open')
      .order('reward_asat', { ascending: false })
      .order('created_at', { ascending: true });

    if (openTasksResult.error) {
      throw openTasksResult.error;
    }

    const allTasksResult = await supabaseAdmin
      .from('asat_tasks')
      .select('status,reward_asat');

    if (allTasksResult.error) {
      throw allTasksResult.error;
    }

    let myClaimedTasks: any[] = [];
    let myRewards: any[] = [];

    if (walletAddress && isValidSolanaAddress(walletAddress)) {
      const claimedResult = await supabaseAdmin
        .from('asat_tasks')
        .select('*')
        .eq('claimant_wallet', walletAddress)
        .in('status', ['claimed', 'submitted', 'approved', 'rewarded', 'rejected'])
        .order('updated_at', { ascending: false });

      if (claimedResult.error) {
        throw claimedResult.error;
      }

      const rewardsResult = await supabaseAdmin
        .from('asat_task_rewards')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false });

      if (rewardsResult.error) {
        throw rewardsResult.error;
      }

      myClaimedTasks = claimedResult.data || [];
      myRewards = rewardsResult.data || [];
    }

    const stats = (allTasksResult.data || []).reduce(
      (acc, item: any) => {
        acc.total += 1;
        acc[item.status] = (acc[item.status] || 0) + 1;
        if (item.status === 'rewarded') {
          acc.totalRewardedAsat += Number(item.reward_asat || 0);
        }
        return acc;
      },
      {
        total: 0,
        open: 0,
        claimed: 0,
        submitted: 0,
        approved: 0,
        rejected: 0,
        rewarded: 0,
        cancelled: 0,
        totalRewardedAsat: 0,
      } as Record<string, number>,
    );

    return NextResponse.json({
      ok: true,
      openTasks: openTasksResult.data || [],
      myClaimedTasks,
      myRewards,
      stats,
    });
  } catch (error) {
    console.error('GET /api/tasks failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to load tasks.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = cleanText(body.action, 50);
    const taskId = cleanText(body.taskId, 100);
    const walletAddress = cleanText(body.walletAddress, 80);
    const xHandle = cleanText(body.xHandle, 100);
    const proofText = cleanText(body.proofText, 5000);
    const proofUrl = cleanText(body.proofUrl, 500);

    if (!taskId) {
      return NextResponse.json({ ok: false, error: 'Missing taskId.' }, { status: 400 });
    }

    if (!isValidSolanaAddress(walletAddress)) {
      return NextResponse.json({ ok: false, error: 'Enter a valid Solana wallet address.' }, { status: 400 });
    }

    if (action === 'claim') {
      const claimResult = await supabaseAdmin
        .from('asat_tasks')
        .update({
          status: 'claimed',
          claimant_wallet: walletAddress,
          claimant_handle: xHandle || null,
          claimed_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .eq('status', 'open')
        .select('*')
        .single();

      if (claimResult.error || !claimResult.data) {
        return NextResponse.json(
          { ok: false, error: 'Task is no longer open.' },
          { status: 409 },
        );
      }

      await supabaseAdmin.from('asat_audit_log').insert({
        actor_type: 'wallet',
        actor_label: walletAddress,
        event_type: 'task_claimed',
        metadata: {
          taskId,
          xHandle: xHandle || null,
        },
      });

      return NextResponse.json({ ok: true, task: claimResult.data });
    }

    if (action === 'submit') {
      if (!proofText && !proofUrl) {
        return NextResponse.json(
          { ok: false, error: 'Add proof text or proof URL before submitting.' },
          { status: 400 },
        );
      }

      const existingTask = await supabaseAdmin
        .from('asat_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (existingTask.error || !existingTask.data) {
        return NextResponse.json({ ok: false, error: 'Task not found.' }, { status: 404 });
      }

      if (existingTask.data.claimant_wallet !== walletAddress) {
        return NextResponse.json(
          { ok: false, error: 'Only the claiming wallet can submit proof for this task.' },
          { status: 403 },
        );
      }

      if (existingTask.data.status !== 'claimed') {
        return NextResponse.json(
          { ok: false, error: 'Task must be in claimed status before submission.' },
          { status: 409 },
        );
      }

      const submitResult = await supabaseAdmin
        .from('asat_tasks')
        .update({
          status: 'submitted',
          proof_text: proofText || null,
          proof_url: proofUrl || null,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .eq('claimant_wallet', walletAddress)
        .select('*')
        .single();

      if (submitResult.error || !submitResult.data) {
        return NextResponse.json(
          { ok: false, error: 'Could not submit proof.' },
          { status: 500 },
        );
      }

      await supabaseAdmin.from('asat_audit_log').insert({
        actor_type: 'wallet',
        actor_label: walletAddress,
        event_type: 'task_submitted',
        metadata: {
          taskId,
          hasProofText: Boolean(proofText),
          hasProofUrl: Boolean(proofUrl),
        },
      });

      return NextResponse.json({ ok: true, task: submitResult.data });
    }

    return NextResponse.json({ ok: false, error: 'Unsupported action.' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/tasks failed', error);
    return NextResponse.json(
      { ok: false, error: 'Task action failed.' },
      { status: 500 },
    );
  }
}
