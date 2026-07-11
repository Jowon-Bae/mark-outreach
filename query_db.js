require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const { data, error } = await supabase
    .from('qt_completions')
    .update({ content: '테스트 업데이트2' })
    .eq('user_name', '배주원')
    .eq('date_str', '2026-07-11')
    .select();
  console.log("Update Data:", data);
  console.log("Update Error:", error);
}

main();
