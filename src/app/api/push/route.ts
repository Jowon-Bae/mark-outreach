import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webPush from 'web-push';

// VAPID 키 설정
const publicVapidKey = 'BB611KNZS2KvEkk7Nystn0Mvdk35Cdks3yaRJy8txCNb0FAHiIcLw8S9nHVK-NbZEiOM8F4dFEsN-n7V0oxIGlA';
const privateVapidKey = 'qXIoPWDmX1vWSWWIl4oRhEjMYNb_iMrj3G37rn2mWOw';

webPush.setVapidDetails(
  'mailto:admin@dreamchurch.com',
  publicVapidKey,
  privateVapidKey
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const { title, body } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    // Supabase에서 모든 구독자 조회
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch subscriptions: ' + error.message }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscribers found' });
    }

    const payload = JSON.stringify({ title, body });

    // 알림 전송 프로미스들
    const pushPromises = subscriptions.map(async (row) => {
      try {
        await webPush.sendNotification(row.subscription, payload);
      } catch (err: any) {
        // 사용자가 알림을 차단했거나 기기 만료 시 DB에서 자동 삭제 처리 (410 Gone / 404 Not Found)
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`Deleting expired push subscription: ${row.id}`);
          await supabase.from('push_subscriptions').delete().eq('id', row.id);
        } else {
          console.error(`Error sending push notification to subscriber: ${row.id}`, err);
        }
      }
    });

    await Promise.all(pushPromises);

    return NextResponse.json({ success: true, count: subscriptions.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
