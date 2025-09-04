import { NextResponse } from 'next/server';

// Явно укажем Node runtime и динамический рендер
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type StageTask = { id: number; text: string; isCompleted: boolean };
type SubStage = {
  id: number;
  title: string;
  dates: string;
  duration: string;
  tasks: StageTask[];
  result: string;
};
type Stage = {
  id: number;
  title: string;
  badge?: string;
  progress?: number;
  substages: SubStage[];
  dates?: string;
  duration?: string;
  done?: boolean;
};

type Payload = {
  data: Stage[];
  updatedAt: string; // ISO
  version: string;
};

const KEY = 'timeline:progress:v1';

// Есть ли KV в окружении
const hasKV =
  Boolean(process.env.KV_REST_API_URL) &&
  Boolean(process.env.KV_REST_API_TOKEN) &&
  Boolean(process.env.KV_URL);

// Тип для модуля @vercel/kv
type KvModule = typeof import('@vercel/kv');

// Ленивый импорт kv (без require)
let kvModulePromise: Promise<KvModule> | null = null;
function getKvModule(): Promise<KvModule> {
  if (!kvModulePromise) kvModulePromise = import('@vercel/kv');
  return kvModulePromise;
}

// In-memory хранилище для dev (живёт до рестарта процесса)
type MemStore = { value: Payload | null };
const globalForProgress = globalThis as unknown as { __MEM_PROGRESS__?: MemStore };
if (!globalForProgress.__MEM_PROGRESS__) {
  globalForProgress.__MEM_PROGRESS__ = { value: null };
}
const mem: MemStore = globalForProgress.__MEM_PROGRESS__!;

function ok<T>(data: T, status = 200) {
  return NextResponse.json<T>(data, { status });
}
function err(code: string, status = 500) {
  return NextResponse.json<{ error: string }>({ error: code }, { status });
}

// ---------- GET
export async function GET() {
  try {
    if (hasKV) {
      const { kv } = await getKvModule();
      const value = (await kv.get<Payload>(KEY)) ?? null;
      return ok(value ?? { data: null as unknown as Stage[], updatedAt: null as unknown as string, version: '0' });
    }
    // dev-фолбэк
    return ok(mem.value ?? { data: null as unknown as Stage[], updatedAt: null as unknown as string, version: '0' });
  } catch {
    return err('KV_GET_FAILED');
  }
}

// ---------- POST
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Payload>;
    if (!Array.isArray(body.data)) return err('BAD_BODY', 400);

    const payload: Payload = {
      data: body.data,
      updatedAt: new Date().toISOString(),
      version: body.version ?? '1',
    };

    if (hasKV) {
      const { kv } = await getKvModule();
      await kv.set(KEY, payload);
      await kv.set(`${KEY}:tick`, payload.updatedAt);
      return ok({ ok: true, updatedAt: payload.updatedAt });
    }

    // dev-фолбэк
    mem.value = payload;
    return ok({ ok: true, updatedAt: payload.updatedAt });
  } catch {
    return err('KV_POST_FAILED');
  }
}
