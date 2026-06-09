
-- 1) Lock down admin_emails: deny direct access entirely (is_admin uses SECURITY DEFINER and bypasses RLS)
DROP POLICY IF EXISTS "No direct access to admin_emails" ON public.admin_emails;
CREATE POLICY "No direct access to admin_emails"
ON public.admin_emails
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 2) Revoke EXECUTE on is_admin from public/anon/authenticated to prevent enumeration via RPC.
-- RLS policies invoke the function as the table owner regardless of grants.
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM authenticated;

-- 3) Replace the always-true appointment INSERT policy with validated WITH CHECK
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
CREATE POLICY "Anyone can create appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND char_length(phone) BETWEEN 5 AND 20
  AND char_length(service) BETWEEN 1 AND 100
  AND char_length(preferred_time) BETWEEN 1 AND 20
  AND preferred_date >= CURRENT_DATE
  AND (notes IS NULL OR char_length(notes) <= 1000)
  AND status = 'pending'
);
