import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(req: Request, { params }: { params: Promise<{ organizationId: string }> }) {
  try {
    const { organizationId } = await params;

    // 環境変数からJWTキーを取得
    const secretKey = process.env.MERCURE_SUBSCRIBER_JWT_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: 'MERCURE_SUBSCRIBER_JWT_KEY is not set' }, { status: 500 });
    }

    // JWTペイロードを作成
    const payload = {
      mercure: {
        subscribe: [`/organizations/${organizationId}/projects`],
      },
    };

    // JWTを生成
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(new TextEncoder().encode(secretKey));

    // トークンを返す
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating JWT:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}