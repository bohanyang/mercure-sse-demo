import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ organizationId: string }> },
) {
  try {
    const { organizationId } = await params;
    // リクエストボディをパース
    const body = await req.json();

    // 環境変数からJWTキーを取得
    const secretKey = process.env.MERCURE_PUBLISHER_JWT_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'MERCURE_PUBLISHER_JWT_KEY is not set' },
        { status: 500 },
      );
    }

    // JWTペイロードを作成
    const payload = {
      mercure: {
        publish: ['*'],
      },
    };

    // JWTを生成
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(new TextEncoder().encode(secretKey));

    const mercureEndpoint = process.env.NEXT_PUBLIC_MERCURE_ENDPOINT;
    if (!mercureEndpoint) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_MERCURE_ENDPOINT is not set' },
        { status: 500 },
      );
    }

    await fetch(mercureEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      body: new URLSearchParams({
        topic: `/organizations/${organizationId}/projects/${body.id}`,
        data: JSON.stringify(body),
      }),
    });

    // トークンを返す
    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
