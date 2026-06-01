<?php
/**
 * Plugin Name: NextGen Tutors API
 * Description: REST endpoints for NextGen Tutors frontend.
 * Version: 0.2.0
 */

if (!defined('ABSPATH')) {
  exit;
}

require_once __DIR__ . '/includes/class-nextgen-tutors-api.php';

add_action('rest_api_init', function () {
  $plugin = new NextGen_Tutors_API();
  $ns = 'ngt/v1';

  $routes = [
    '/stats' => ['GET', 'route_stats'],
    '/tutors/search' => ['GET', 'route_tutors_search'],
    '/tutors/(?P<id>\d+)' => ['GET', 'route_tutors_get'],
    '/auth/login' => ['POST', 'route_auth_login'],
    '/auth/register' => ['POST', 'route_auth_register'],
    '/dashboard' => ['GET', 'route_dashboard'],
    '/reviews' => ['GET', 'route_reviews_list'],
    '/reviews' => ['POST', 'route_reviews_create'],
    '/sessions' => ['GET', 'route_sessions_list'],
    '/sessions' => ['POST', 'route_sessions_create'],
    '/messages' => ['GET', 'route_messages_list'],
    '/messages' => ['POST', 'route_messages_create'],
    '/payouts/pending' => ['GET', 'route_payouts_pending'],
    '/payouts/process' => ['POST', 'route_payouts_process'],
    '/badges' => ['GET', 'route_badges_list'],
    '/badges/unlock' => ['POST', 'route_badges_unlock'],
  ];

  foreach ($routes as $path => [$method, $callback]) {
    register_rest_route($ns, $path, [
      'methods' => $method,
      'callback' => [$plugin, $callback],
      'permission_callback' => '__return_true',
    ]);
  }
});
