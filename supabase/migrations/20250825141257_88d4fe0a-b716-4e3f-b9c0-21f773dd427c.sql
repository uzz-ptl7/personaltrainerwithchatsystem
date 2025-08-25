-- Update the chat system for single trainer setup
-- Add a single trainer ID constant to simplify the system

-- First, let's add a default trainer user (this would be the single trainer in the system)
-- We'll need to modify the RLS policies to work with this setup

-- Update RLS policies for single trainer model
DROP POLICY IF EXISTS "Clients can create chats with trainers" ON public.chats;
DROP POLICY IF EXISTS "Trainers can create chats with clients" ON public.chats;

-- New policies for single trainer setup
CREATE POLICY "Users can create chats"
ON public.chats
FOR INSERT
WITH CHECK (
  (auth.uid() = client_id AND trainer_id IS NOT NULL) OR
  (auth.uid() = trainer_id AND client_id IS NOT NULL)
);

-- Update messages policies to work better with the single trainer setup
DROP POLICY IF EXISTS "Users can send messages in their chats" ON public.messages;

CREATE POLICY "Users can send messages in their chats"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND 
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.client_id = auth.uid() OR chats.trainer_id = auth.uid())
  )
);