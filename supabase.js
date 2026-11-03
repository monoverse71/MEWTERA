
/*
 * MEWTERA — Supabase Client
 * Phase 2: Read-only product catalog
 *
 * Database reads are handled by index.html.
 * This file only initializes the Supabase client.
 *
 * No checkout, orders, payments, authentication or database writes.
 */

(function (window) {
  'use strict';

  // Public Supabase configuration
  var SUPABASE_URL =
    'https://ouicacckzeiiavqnbcwp.supabase.co';

  var SUPABASE_PUBLISHABLE_KEY =
    'sb_publishable_56YAZLp3jY3gHvi0XTtrsA_qrsXCyxj';

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

    console.warn(
      '[MEWTERA] Supabase disabled:',
      reason
    );
  }

  // Reject secret keys
  var key = String(
    SUPABASE_PUBLISHABLE_KEY || ''
  ).trim();

  if (!key) {
    disable('publishable key missing');
    return;
  }

  if (/^sb_secret_/i.test(key)) {
    disable('secret key refused');
    return;
  }

  if (!/^sb_publishable_/i.test(key)) {
    disable('invalid publishable key format');
    return;
  }

  // Validate project URL
  if (
    !/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/i.test(
      SUPABASE_URL
    )
  ) {
    disable('invalid Supabase URL');
    return;
  }

  // Check Supabase JS CDN
  if (
    !window.supabase ||
    typeof window.supabase.createClient !== 'function'
  ) {
    disable('Supabase JS library not loaded');
    return;
  }

  // Initialize client
  try {
    window.MEWTERA_SUPABASE =
      window.supabase.createClient(
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

    console.info(
      '[MEWTERA] Supabase client initialized successfully.'
    );

  } catch (error) {
    window.MEWTERA_SUPABASE = null;
    disable('client initialization failed');

    console.error(error);
  }

})(window);
