// app/api/progress/route.ts
import { NextResponse } from 'next/server';

// В DEV используем node runtime, чтобы работало in-memory хранилище.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type StageTask = { id: number; text: string; isCompleted: boolean };
type SubStage = { id: number; title: string; dates: string; duration: string; tasks: StageTask[]; result: string };
type Stage = { id: number; title: string; badge?: string; progress?: number; substages: SubStage[]; dates?: string; duration?: string; done?: boolean };

type Payload = {
  data: Stage[];
  updatedAt: string; // ISO
  version: string;
};

const KEY = 'timeline:progress:v1';

// --- определяем, доступен ли KV по env
const hasKV =
  !!process.env.KV_REST_API_URL &&
  !!process.env.KV_REST_API_TOKEN &&
  !!process.env.KV_URL;

// --- lazy-импорт kv только при наличии env (чтобы не падать локально)
let kv: any = null;
if (hasKV) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  kv = require('@vercel/kv');
}

// --- in-memory стор для dev (живёт до перезапуска dev-сервера)
const g = globalThis as any;
if (!g.__MEM_PROGRESS__) {
  g.__MEM_PROGRESS__ = { data: null as Payload | null };
}

function ok(data: any, status = 200) {
  return NextResponse.json(data, { status });
}
function err(code: string, status = 500) {
  return NextResponse.json({ error: code }, { status });
}

// ---------- GET
export async function GET() {
  try {
    if (hasKV && kv) {
      const value = (await kv.kv.get<Payload>(KEY)) ?? null;
      return ok(value ?? { data: null, updatedAt: null, version: '0' });
    }
    // dev-фолбэк (in-memory)
    return ok(g.__MEM_PROGRESS__.data ?? { data: null, updatedAt: null, version: '0' });
  } catch {
    return err('KV_GET_FAILED');
  }
}

// ---------- POST
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Payload>;
    if (!body?.data || !Array.isArray(body.data)) return err('BAD_BODY', 400);

    const payload: Payload = {
      data: body.data,
      updatedAt: new Date().toISOString(),
      version: body.version ?? '1',
    };

    if (hasKV && kv) {
      await kv.kv.set(KEY, payload);
      await kv.kv.set(`${KEY}:tick`, payload.updatedAt);
      return ok({ ok: true, updatedAt: payload.updatedAt });
    }

    // dev-фолбэк
    g.__MEM_PROGRESS__.data = payload;
    return ok({ ok: true, updatedAt: payload.updatedAt });
  } catch {
    return err('KV_POST_FAILED');
  }
}
