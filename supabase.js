
/*
 * MEWTERA: Supabase client, Phase 1
 * Read-only client initialization. No database writes.
 */
(function (window) {
  'use strict';

  var SUPABASE_URL = 'https://ouicacckzeiiavqnbcwp.supabase.co';
  var SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_56YAZLp3jY3gHvi0XTtrsA_qrsXCyxj';

  var PLACEHOLDER = 'PASTE_SUPABASE_PUBLISHABLE_KEY_HERE';

  var status = {
    configured: false,
    ready: false,
    reason: 'not initialised',
    url: SUPABASE_URL
  };

  window.MEWTERA_SUPABASE = null;
  window.MEWTERA_SUPABASE_STATUS = status;

  function disable(reason) {
    status.reason = reason;
    console.warn('[MEWTERA] Supabase disabled: ' + reason);
  }

  function jwtRole(key) {
    var parts = key.split('.');
    if (parts.length !== 3) return null;
    try {
      var b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      return (JSON.parse(window.atob(b64)) || {}).role || '';
    } catch (e) {
      return '';
    }
  }

  var key = String(SUPABASE_PUBLISHABLE_KEY || '').trim();

  if (!key || key === PLACEHOLDER) {
    disable('publishable key not set');
    return;
  }

  if (/^sb_secret_/i.test(key)) {
    disable('secret key refused');
    return;
  }

  if (!/^sb_publishable_/i.test(key)) {
    var role = jwtRole(key);
    if (role === 'service_role' || role !== 'anon') {
      disable('unrecognised or privileged key');
      return;
    }
  }

  if (!/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/i.test(SUPABASE_URL)) {
    disable('invalid project URL');
    return;
  }

  if (!window.supabase ||
      typeof window.supabase.createClient !== 'function') {
    disable('supabase-js library not loaded');
    return;
  }

  try {
    window.MEWTERA_SUPABASE = window.supabase.createClient(
      SUPABASE_URL,
      key,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );

    status.configured = true;
    status.ready = true;
    status.reason = 'ok';
  } catch (e) {
    window.MEWTERA_SUPABASE = null;
    disable('client creation failed');
  }
})(window);

