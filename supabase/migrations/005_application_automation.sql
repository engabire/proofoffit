-- Create auto_apply_configs table
CREATE TABLE IF NOT EXISTS public.auto_apply_configs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enabled BOOLEAN NOT NULL DEFAULT false,
    preferences JSONB NOT NULL DEFAULT '{}',
    resume_template JSONB NOT NULL DEFAULT '{}',
    cover_letter_template JSONB NOT NULL DEFAULT '{}',
    notification_settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id SERIAL PRIMARY KEY,
    job_id VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(50) NOT NULL DEFAULT 'manual',
    application_data JSONB NOT NULL DEFAULT '{}',
    tracking_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_postings table for employers
CREATE TABLE IF NOT EXISTS public.job_postings (
    id SERIAL PRIMARY KEY,
    employer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    remote BOOLEAN NOT NULL DEFAULT false,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    description TEXT NOT NULL,
    requirements JSONB NOT NULL DEFAULT '{}',
    benefits JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    posted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    applications_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    matches_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create candidate_profiles table
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skills TEXT[] DEFAULT '{}',
    experience JSONB NOT NULL DEFAULT '{}',
    education JSONB NOT NULL DEFAULT '{}',
    preferences JSONB NOT NULL DEFAULT '{}',
    resume JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create match_results table for AI matching
CREATE TABLE IF NOT EXISTS public.match_results (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
    fit_score INTEGER NOT NULL,
    breakdown JSONB NOT NULL DEFAULT '{}',
    strengths TEXT[] DEFAULT '{}',
    gaps TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    confidence INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(candidate_id, job_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_auto_apply_configs_user_id ON public.auto_apply_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON public.job_applications(applied_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_job_postings_employer_id ON public.job_postings(employer_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_posted_at ON public.job_postings(posted_at);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user_id ON public.candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_match_results_candidate_id ON public.match_results(candidate_id);
CREATE INDEX IF NOT EXISTS idx_match_results_job_id ON public.match_results(job_id);
CREATE INDEX IF NOT EXISTS idx_match_results_fit_score ON public.match_results(fit_score);

-- Enable RLS
ALTER TABLE public.auto_apply_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auto_apply_configs
CREATE POLICY "Users can manage their own auto-apply configs" ON public.auto_apply_configs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all auto-apply configs" ON public.auto_apply_configs
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for job_applications
CREATE POLICY "Users can manage their own applications" ON public.job_applications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all applications" ON public.job_applications
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for notifications
CREATE POLICY "Users can manage their own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all notifications" ON public.notifications
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for job_postings
CREATE POLICY "Employers can manage their own job postings" ON public.job_postings
    FOR ALL USING (auth.uid() = employer_id);

CREATE POLICY "Authenticated users can view active job postings" ON public.job_postings
    FOR SELECT USING (auth.role() = 'authenticated' AND status = 'active');

CREATE POLICY "Service role can manage all job postings" ON public.job_postings
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for candidate_profiles
CREATE POLICY "Users can manage their own candidate profiles" ON public.candidate_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all candidate profiles" ON public.candidate_profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for match_results
CREATE POLICY "Users can view their own match results" ON public.match_results
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.candidate_profiles WHERE id = candidate_id
        )
    );

CREATE POLICY "Employers can view match results for their jobs" ON public.match_results
    FOR SELECT USING (
        auth.uid() IN (
            SELECT employer_id FROM public.job_postings WHERE id = job_id
        )
    );

CREATE POLICY "Service role can manage all match results" ON public.match_results
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_auto_apply_configs_updated_at 
    BEFORE UPDATE ON public.auto_apply_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at 
    BEFORE UPDATE ON public.job_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at 
    BEFORE UPDATE ON public.job_postings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_profiles_updated_at 
    BEFORE UPDATE ON public.candidate_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
