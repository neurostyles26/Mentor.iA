-- MentorIA Simplified Schema

-- Drop existing tables if they interfere (Warning: this will delete existing data)
-- DROP TABLE IF EXISTS messages;
-- DROP TABLE IF EXISTS chats;
-- DROP TABLE IF EXISTS clipboard_items;

-- 1. Chats Table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Nueva conversación',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Clipboard Items Table
CREATE TABLE IF NOT EXISTS clipboard_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  tag TEXT DEFAULT 'Clase',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE clipboard_items ENABLE ROW LEVEL SECURITY;

-- Chats: Users can only see and manage their own chats
CREATE POLICY "Users can manage their own chats" ON chats
  FOR ALL USING (auth.uid() = user_id);

-- Messages: Users can see messages of their own chats
CREATE POLICY "Users can manage messages of their chats" ON messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

-- Clipboard: Users can manage their own items
CREATE POLICY "Users can manage their clipboard items" ON clipboard_items
  FOR ALL USING (auth.uid() = user_id);
