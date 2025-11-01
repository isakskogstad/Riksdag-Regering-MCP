-- Add RLS policies for admin panel

-- Policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Policies for data_fetch_progress table
CREATE POLICY "Anyone can view progress"
ON public.data_fetch_progress
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can update progress"
ON public.data_fetch_progress
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert progress"
ON public.data_fetch_progress
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete progress"
ON public.data_fetch_progress
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Policies for data_fetch_control table
CREATE POLICY "Anyone can view control"
ON public.data_fetch_control
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can update control"
ON public.data_fetch_control
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert control"
ON public.data_fetch_control
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete control"
ON public.data_fetch_control
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Policies for file_download_queue table
CREATE POLICY "Admins can view queue"
ON public.file_download_queue
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update queue"
ON public.file_download_queue
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert queue"
ON public.file_download_queue
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete queue"
ON public.file_download_queue
FOR DELETE
TO authenticated
USING (public.is_admin());