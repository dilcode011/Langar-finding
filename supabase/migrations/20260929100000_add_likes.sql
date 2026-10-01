
ALTER TABLE langars ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS langar_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  langar_id uuid NOT NULL REFERENCES langars(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, langar_id)
);

ALTER TABLE langar_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "likes_select_own" ON langar_likes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "likes_insert_own" ON langar_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own" ON langar_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RPC to toggle like and auto-verify
CREATE OR REPLACE FUNCTION public.toggle_langar_like(p_langar_id uuid, p_user_id uuid)
RETURNS json AS $$
DECLARE
  v_exists boolean;
  v_likes integer;
BEGIN
  -- Check if already liked
  SELECT EXISTS(SELECT 1 FROM langar_likes WHERE user_id = p_user_id AND langar_id = p_langar_id) INTO v_exists;
  
  IF v_exists THEN
    -- Unlike
    DELETE FROM langar_likes WHERE user_id = p_user_id AND langar_id = p_langar_id;
    UPDATE langars SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = p_langar_id RETURNING likes_count INTO v_likes;
    RETURN json_build_object('liked', false, 'likes_count', v_likes);
  ELSE
    -- Like
    INSERT INTO langar_likes (user_id, langar_id) VALUES (p_user_id, p_langar_id);
    UPDATE langars SET 
      likes_count = likes_count + 1,
      is_verified = CASE WHEN likes_count + 1 >= 20 THEN true ELSE is_verified END
    WHERE id = p_langar_id 
    RETURNING likes_count INTO v_likes;
    RETURN json_build_object('liked', true, 'likes_count', v_likes);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
