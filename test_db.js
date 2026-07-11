const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jtchyeylhbfxytyovdfm.supabase.co', 'sb_publishable_t86S6MG66N-YrE0EnwsqQA_6Iuzu8Cb');

async function test() {
  const { data, error } = await supabase.from('qt_completions').insert([{ user_name: 'test', date_str: '2026-07-11' }]);
  console.log('Insert Error:', error);
}
test();
