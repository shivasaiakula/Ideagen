import { supabase } from './supabase';

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// ─── JOINED PROJECTS ─────────────────────────────────────────────────────────

export async function fetchJoinedProjects(userId) {
  const { data, error } = await supabase
    .from('joined_projects')
    .select('project_id, project_data, joined_at')
    .eq('user_id', userId)
    .order('joined_at', { ascending: false });
  if (error) throw error;
  // Return as { projectId: projectData } map
  return (data || []).reduce((acc, row) => {
    acc[row.project_id] = row.project_data;
    return acc;
  }, {});
}

export async function joinProject(userId, project) {
  const { error } = await supabase
    .from('joined_projects')
    .upsert({ user_id: userId, project_id: project.id, project_data: project });
  if (error) throw error;
}

export async function leaveProject(userId, projectId) {
  const { error } = await supabase
    .from('joined_projects')
    .delete()
    .eq('user_id', userId)
    .eq('project_id', projectId);
  if (error) throw error;
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────

export async function fetchProgress(userId) {
  const { data, error } = await supabase
    .from('progress')
    .select('project_id, step_key, completed')
    .eq('user_id', userId);
  if (error) throw error;
  // Return as { projectId: { stepKey: bool } } map
  return (data || []).reduce((acc, row) => {
    if (!acc[row.project_id]) acc[row.project_id] = {};
    acc[row.project_id][row.step_key] = row.completed;
    return acc;
  }, {});
}

export async function toggleStep(userId, projectId, stepKey, currentValue) {
  const { error } = await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      project_id: projectId,
      step_key: stepKey,
      completed: !currentValue,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
}

// ─── UPVOTES ──────────────────────────────────────────────────────────────────

export async function fetchUpvotes(userId) {
  const { data, error } = await supabase
    .from('upvotes')
    .select('project_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).reduce((acc, row) => {
    acc[row.project_id] = true;
    return acc;
  }, {});
}

export async function toggleUpvote(userId, projectId, isCurrentlyUpvoted) {
  if (isCurrentlyUpvoted) {
    const { error } = await supabase
      .from('upvotes')
      .delete()
      .eq('user_id', userId)
      .eq('project_id', projectId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('upvotes')
      .upsert({ user_id: userId, project_id: projectId });
    if (error) throw error;
  }
}

// ─── MENTOR MESSAGES ──────────────────────────────────────────────────────────

export async function fetchMentorMessages(userId, projectId) {
  const { data, error } = await supabase
    .from('mentor_messages')
    .select('role, message, created_at')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
    .limit(100);
  if (error) throw error;
  return (data || []).map(row => ({ role: row.role, text: row.message }));
}

export async function saveMentorMessage(userId, projectId, role, message) {
  const { error } = await supabase
    .from('mentor_messages')
    .insert({ user_id: userId, project_id: projectId, role, message });
  if (error) throw error;
}
