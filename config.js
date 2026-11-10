// Public settings only. Safe to commit: the publishable key is meant to be public,
// and the database rules (schema.sql + phase3.sql) decide who can read or write anything.
// NEVER put a "secret" or "service_role" key in this file.
window.DHS_CONFIG = {
  url: "https://qudmsjnhstvlzvyiqwej.supabase.co",   // Supabase > Project Settings > API > Project URL
  key: "sb_publishable_RDA7nwFxDyMgvfE5CoA-gA_wYhlKmTY",            // Supabase > Project Settings > API Keys > Publishable key
  emailDomain: "dhs-visitors.app"            // turns a staff ID into an internal login. No email is ever sent. Change it only if sign-up says "invalid email".
};
