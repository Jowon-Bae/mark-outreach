-- 1. User Table (Links to Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT UNIQUE,
  role TEXT DEFAULT 'participant' CHECK (role IN ('participant', 'team_leader', 'admin')),
  is_admin BOOLEAN DEFAULT FALSE,
  team_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Team Table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraint back to users
ALTER TABLE public.users ADD CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

-- 3. Schedule Table
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Notice Board
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_notice BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Gallery
CREATE TABLE public.galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Prayer Relay
CREATE TABLE public.prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. QT Check
CREATE TABLE public.qt_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, date)
);

-- 8. Rolling Paper
CREATE TABLE public.rolling_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Checklist
CREATE TABLE public.checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  is_checked BOOLEAN DEFAULT FALSE
);

-- Enable RLS (Row Level Security) - Basic Setup (Open read for now, can be restricted later)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qt_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rolling_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.galleries FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.prayers FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.qt_checks FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.rolling_papers FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.checklists FOR SELECT USING (true);

-- Insert Dummy Data for Schedule
INSERT INTO public.schedules (title, description, start_time, end_time) VALUES
('기상 및 아침 묵상', '개인 묵상 및 조식', '2026-07-07 07:00:00+09', '2026-07-07 08:00:00+09'),
('오전 사역 진행', '마을 회관 보수 및 청소', '2026-07-07 09:00:00+09', '2026-07-07 12:00:00+09'),
('점심 식사', '마을 주민들과 함께하는 식사', '2026-07-07 12:30:00+09', '2026-07-07 13:30:00+09');

-- Insert Dummy Data for Prayers
INSERT INTO public.prayers (content, is_anonymous) VALUES
('이번 아웃리치를 통해 우리 팀원들 모두가 하나님의 사랑을 깊이 경험하게 하소서.', false),
('마을 어르신들의 건강을 지켜주시고, 준비한 복음이 잘 전달되기를 기도합니다.', true);
