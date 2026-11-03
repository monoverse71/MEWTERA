
/*
 * MEWTERA — Production Supabase Client
 * Phase 2: Real Storefront Catalog
 * Read-only initialization
 */

(function (window) {
  'use strict';

  const SUPABASE_URL =
    'https://ouicacckzeiiavqnbcwp.supabase.co';

  const SUPABASE_PUBLISHABLE_KEY =
    'sb_publishable_56YAZLp3jY3gHvi0XTtrsA_qrsXCyxj';

  const status = {
    configured: false,
    ready: false,
    reason: 'not initialised',
    url: SUPABASE_URL
  };

  window.MEWTERA_SUPABASE = null;
  window.MEWTERA_SUPABASE_STATUS = status;

  function disable(reason) {
    status.reason = reason;
    console.error('[MEWTERA] Supabase:', reason);
  }

  // Validate public key
  if (
    !SUPABASE_PUBLISHABLE_KEY ||
    !SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_')
  ) {
    disable('Invalid publishable key');
    return;
  }

  // Validate project URL
  if (
    !/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/i.test(
      SUPABASE_URL
    )
  ) {
    disable('Invalid Supabase project URL');
    return;
  }

  // Check Supabase JS library
  if (
    !window.supabase ||
    typeof window.supabase.createClient !== 'function'
  ) {
    disable('Supabase JS CDN not loaded');
    return;
  }

  try {
    const client = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            'X-Client-Info': 'mewtera-storefront'
          }
        }
      }
    );

    window.MEWTERA_SUPABASE = client;

    status.configured = true;
    status.ready = true;
    status.reason = 'ok';

    console.info(
      '[MEWTERA] Supabase client initialized.'
    );

  } catch (error) {
    window.MEWTERA_SUPABASE = null;
    disable('Client initialization failed');
    console.error(error);
  }

})(window);
