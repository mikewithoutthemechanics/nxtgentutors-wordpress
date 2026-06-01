<?php
/**
 * Plugin Name: NextGen Tutors API
 * Description: REST endpoints for NextGen Tutors frontend (stats, tutors, auth, dashboard, reviews, sessions, messages, payouts, badges).
 * Version: 0.2.0
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('rest_api_init', function () {
  $ns = 'ngt/v1';

  require_once __DIR__ . '/nextgen-tutors-api.php';
  $plugin = new NextGen_Tutors_API();

  register_rest_route($ns, '/stats', [
    'methods' => 'GET',
    'callback' => [$plugin, 'route_stats'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/tutors/search', [
    'methods' => 'GET',
    'callback' => [$plugin, 'route_tutors_search'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/tutors/(?P<id>\d+)', [
    'methods' => 'GET',
    'callback' => [$plugin, 'route_tutors_get'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/auth/login', [
    'methods' => 'POST',
    'callback' => [$plugin, 'route_auth_login'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/auth/register', [
    'methods' => 'POST',
    'callback' => [$plugin, 'route_auth_register'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/dashboard', [
    'methods' => 'GET',
    'callback' => [$plugin, 'route_dashboard'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/reviews', [
    'methods' => 'GET',
    'callback' => [$plugin, 'route_reviews_list'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/reviews', [
    'methods' => 'POST',
    'callback' => [$plugin, 'route_reviews_create'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/sessions', [
    'methods' => 'GET',
    'callback' => [$plugin, 'route_sessions_list'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/sessions', [
    'methods' => 'POST',
    'callback' => [$plugin, 'route_sessions_create'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/messages', [
    'methods' => 'GET',
    'callback' => [$plugin, 'route_messages_list'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/messages', [
    'methods' => 'POST',
    'callback' => [$plugin, 'route_messages_create'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/payouts/pending', [
    'methods' => 'GET',
    'callback' => [$plugin, 'route_payouts_pending'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/payouts/process', [
    'methods' => 'POST',
    'callback' => [$plugin, 'route_payouts_process'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/badges', [
    'methods' => 'GET',
    'callback' => [$plugin, 'route_badges_list'],
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/badges/unlock', [
    'methods' => 'POST',
    'callback' => [$plugin, 'route_badges_unlock'],
    'permission_callback' => '__return_true',
  ]);
});

class NextGen_Tutors_API {

  private function table_exists($table) {
    global $wpdb;
    return $wpdb->get_var("SHOW TABLES LIKE '$table'") === $table;
  }

  private function get_or_create_user_id($payload) {
    $email = sanitize_email($payload['email'] ?? '');
    $name = sanitize_text_field($payload['name'] ?? '');
    $role = sanitize_text_field($payload['role'] ?? 'student');

    if ($email === '') {
      return 0;
    }

    $user = get_user_by('email', $email);
    if ($user) {
      return $user->ID;
    }

    $password = wp_generate_password(12, true);
    $user_id = wp_create_user($email, $password, $email);
    if (is_wp_error($user_id)) {
      return 0;
    }

    wp_update_user([
      'ID' => $user_id,
      'first_name' => $name,
      'last_name' => '',
    ]);

    $user = get_user_by('id', $user_id);
    if ($user) {
      $user->set_role($role);
    }

    return $user_id;
  }

  public function route_stats() {
    return rest_ensure_response([
      'tutors' => '500+',
      'rating' => '4.9/5',
      'sessions' => '10k+',
    ]);
  }

  public function route_tutors_search(WP_REST_Request $req) {
    $subject = strtolower((string) $req->get_param('subject'));
    $tutors = [
      [
        'id' => 1,
        'name' => 'David M.',
        'subjects' => ['Mathematics', 'Physics'],
        'grade' => 'Grade 10-12',
        'rating' => 5.0,
        'reviews' => 42,
        'sessions' => 150,
        'rate' => 450,
        'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        'province' => 'Gauteng',
      ],
      [
        'id' => 2,
        'name' => 'Sarah J.',
        'subjects' => ['English', 'History'],
        'grade' => 'Grade 8-12',
        'rating' => 4.9,
        'reviews' => 28,
        'sessions' => 85,
        'rate' => 400,
        'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        'province' => 'Western Cape',
      ],
      [
        'id' => 3,
        'name' => 'Michael K.',
        'subjects' => ['Chemistry', 'Biology'],
        'grade' => 'Grade 11-12',
        'rating' => 4.8,
        'reviews' => 35,
        'sessions' => 120,
        'rate' => 500,
        'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        'province' => 'KwaZulu-Natal',
      ],
    ];

    if ($subject !== '') {
      $tutors = array_values(array_filter($tutors, function ($t) use ($subject) {
        foreach ($t['subjects'] as $s) {
          if (str_contains(strtolower($s), $subject)) {
            return true;
          }
        }
        return false;
      }));
    }

    return rest_ensure_response(array_values($tutors));
  }

  public function route_tutors_get(WP_REST_Request $req) {
    $id = (int) $req->get_param('id');
    $tutors = [
      1 => [
        'id' => 1,
        'name' => 'David M.',
        'subjects' => ['Mathematics', 'Physics'],
        'bio' => 'Passionate about making maths and physics intuitive.',
        'rating' => 5.0,
        'reviews' => 42,
        'sessions' => 150,
        'rate' => 450,
        'province' => 'Gauteng',
        'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      ],
      2 => [
        'id' => 2,
        'name' => 'Sarah J.',
        'subjects' => ['English', 'History'],
        'bio' => 'Helping students craft stronger arguments and better essays.',
        'rating' => 4.9,
        'reviews' => 28,
        'sessions' => 85,
        'rate' => 400,
        'province' => 'Western Cape',
        'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      ],
      3 => [
        'id' => 3,
        'name' => 'Michael K.',
        'subjects' => ['Chemistry', 'Biology'],
        'bio' => 'Breaking complex life-science topics into simple steps.',
        'rating' => 4.8,
        'reviews' => 35,
        'sessions' => 120,
        'rate' => 500,
        'province' => 'KwaZulu-Natal',
        'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      ],
    ];

    if (!isset($tutors[$id])) {
      return new WP_Error('ngt_tutor_not_found', 'Tutor not found', ['status' => 404]);
    }

    return rest_ensure_response($tutors[$id]);
  }

  public function route_auth_login(WP_REST_Request $req) {
    $params = $req->get_json_params();
    $email = sanitize_email($params['email'] ?? '');
    $password = (string) ($params['password'] ?? '');

    $user = get_user_by('email', $email);
    if (!$user || !wp_check_password($password, $user->user_pass, $user->ID)) {
      return new WP_Error('ngt_invalid_credentials', 'Invalid credentials', ['status' => 401]);
    }

    $roles = $user->roles;
    $role = $roles[0] ?? 'student';

    return rest_ensure_response([
      'success' => true,
      'user' => [
        'id' => $user->ID,
        'email' => $user->user_email,
        'firstName' => $user->first_name,
        'lastName' => $user->last_name,
        'role' => $role,
      ],
    ]);
  }

  public function route_auth_register(WP_REST_Request $req) {
    $params = $req->get_json_params();
    $email = sanitize_email($params['email'] ?? '');
    $password = (string) ($params['password'] ?? '');
    $firstName = sanitize_text_field($params['firstName'] ?? '');
    $lastName = sanitize_text_field($params['lastName'] ?? '');
    $role = sanitize_text_field($params['role'] ?? 'student');

    if ($email === '' || $password === '') {
      return new WP_Error('ngt_missing_fields', 'Email and password required', ['status' => 400]);
    }

    $user_id = wp_create_user($email, $password, $email);
    if (is_wp_error($user_id)) {
      return new WP_Error('ngt_user_create_failed', $user_id->get_error_message(), ['status' => 400]);
    }

    wp_update_user([
      'ID' => $user_id,
      'first_name' => $firstName,
      'last_name' => $lastName,
    ]);

    $user = get_user_by('id', $user_id);
    if ($user) {
      $user->set_role($role);
    }

    return rest_ensure_response([
      'success' => true,
      'user' => [
        'id' => $user->ID,
        'email' => $user->user_email,
        'firstName' => $user->first_name,
        'lastName' => $user->last_name,
        'role' => $role,
      ],
    ]);
  }

  public function route_dashboard(WP_REST_Request $req) {
    $role = sanitize_text_field((string) $req->get_param('role'));

    if ($role === 'student') {
      return rest_ensure_response([
        'success' => true,
        'stats' => [
          'upcomingSessions' => 3,
          'totalHours' => 24.5,
          'credits' => 'R1,200',
          'achievements' => 12,
        ],
        'nextSession' => [
          'subject' => 'Mathematics - Calculus',
          'tutor' => 'Dr. Sarah K.',
          'time' => 'Tomorrow at 14:00',
          'joinUrl' => '/dashboard/student/lessons/1',
        ],
        'badges' => ['🎓', '🔥', '✨', '🌟'],
      ]);
    }

    if ($role === 'tutor') {
      return rest_ensure_response([
        'success' => true,
        'stats' => [
          'earnings' => 'R5,650',
          'sessionsCompleted' => 15,
          'avgRating' => 4.8,
          'activeStudents' => 8,
        ],
        'nextSession' => [
          'subject' => 'Physics - Mechanics',
          'student' => 'Jason L.',
          'time' => 'Today at 16:00',
          'joinUrl' => '/dashboard/tutor/lessons/1',
        ],
        'pendingPayout' => 'R5,650',
      ]);
    }

    if ($role === 'admin') {
      return rest_ensure_response([
        'success' => true,
        'stats' => [
          'monthlyRevenue' => 'R125,000',
          'activeUsers' => 1450,
          'avgSatisfaction' => '96%',
          'activeTutors' => 45,
        ],
        'systemHealth' => [
          'status' => 'Optimal',
          'pendingVerifications' => 5,
          'activeDisputes' => 0,
        ],
      ]);
    }

    return new WP_Error('ngt_invalid_role', 'Invalid role', ['status' => 400]);
  }

  public function route_reviews_list(WP_REST_Request $req) {
    $table = $this->table_exists($this->reviews_table()) ? $this->reviews_table() : null;
    if (!$table) {
      return rest_ensure_response([]);
    }

    global $wpdb;
    $tutor = (int) $req->get_param('tutorId');
    $query = 'SELECT * FROM ' . esc_sql($table) . ' ORDER BY created_at DESC';
    $prepared = $wpdb->prepare($query, []);
    $items = $wpdb->get_results($prepared);

    return rest_ensure_response(array_values($items ?: []));
  }

  public function route_reviews_create(WP_REST_Request $req) {
    $params = $req->get_json_params();
    $table = $this->ensure_reviews_table();
    $user_id = $this->get_or_create_user_id($params);

    if (!$table || !$user_id) {
      return rest_ensure_response(['success' => true, 'stored' => false]);
    }

    global $wpdb;
    $wpdb->insert($table, [
      'tutor_id' => (int) ($params['tutorId'] ?? 0),
      'user_id' => $user_id,
      'rating' => (float) ($params['rating'] ?? 5),
      'comment' => sanitize_textarea_field($params['comment'] ?? ''),
      'created_at' => current_time('mysql', true),
    ]);
    if ($wpdb->last_error) {
      return rest_ensure_response(['success' => true, 'stored' => false]);
    }

    return rest_ensure_response(['success' => true, 'stored' => true]);
  }

  public function route_sessions_list(WP_REST_Request $req) {
    $table = $this->table_exists($this->sessions_table()) ? $this->sessions_table() : null;
    if (!$table) {
      return rest_ensure_response([]);
    }

    global $wpdb;
    $items = $wpdb->get_results('SELECT * FROM ' . esc_sql($table) . ' ORDER BY created_at DESC');
    return rest_ensure_response(array_values($items ?: []));
  }

  public function route_sessions_create(WP_REST_Request $req) {
    $params = $req->get_json_params();
    $table = $this->ensure_sessions_table();
    $user_id = $this->get_or_create_user_id($params);

    if (!$table || !$user_id) {
      return rest_ensure_response(['success' => true, 'stored' => false]);
    }

    global $wpdb;
    $wpdb->insert($table, [
      'tutor_id' => (int) ($params['tutorId'] ?? 0),
      'user_id' => $user_id,
      'subject' => sanitize_text_field($params['subject'] ?? ''),
      'starts_at' => sanitize_text_field($params['startsAt'] ?? ''),
      'status' => sanitize_text_field($params['status'] ?? 'scheduled'),
      'created_at' => current_time('mysql', true),
    ]);

    return rest_ensure_response(['success' => true, 'stored' => true]);
  }

  public function route_messages_list(WP_REST_Request $req) {
    global $wpdb;
    $table = $this->table_exists($this->messages_table()) ? $this->messages_table() : null;
    if (!$table) {
      return rest_ensure_response([
        'conversations' => [
          [
            'id' => 1,
            'name' => 'David M.',
            'lastMessage' => 'See you tomorrow.',
            'time' => current_time('mysql', true),
          ],
        ],
        'messages' => [],
      ]);
    }

    $conversationId = (int) $req->get_param('conversationId');
    $query = 'SELECT * FROM ' . esc_sql($table) . ' ORDER BY created_at ASC';
    $prepared = $wpdb->prepare($query, []);
    $messages = $wpdb->get_results($prepared);

    return rest_ensure_response([
      'conversations' => [],
      'messages' => array_values($messages ?: []),
    ]);
  }

  public function route_messages_create(WP_REST_Request $req) {
    $params = $req->get_json_params();
    $table = $this->ensure_messages_table();
    $senderId = $this->get_or_create_user_id($params);

    if (!$table || !$senderId) {
      return rest_ensure_response(['success' => true, 'stored' => false]);
    }

    global $wpdb;
    $wpdb->insert($table, [
      'sender_id' => $senderId,
      'receiver_id' => (int) ($params['receiverId'] ?? 0),
      'body' => sanitize_textarea_field($params['body'] ?? ''),
      'created_at' => current_time('mysql', true),
    ]);

    return rest_ensure_response(['success' => true, 'stored' => true]);
  }

  public function route_payouts_pending() {
    // Wire to WP posts/transactions later; for now return no-op unless suspense is enabled.
    return rest_ensure_response([]);
  }

  public function route_payouts_process(WP_REST_Request $req) {
    return rest_ensure_response(['success' => true, 'processed' => []]);
  }

  public function route_badges_list() {
    return rest_ensure_response([
      [
        'id' => 'first-session',
        'name' => 'First Session',
        'desc' => 'Completed your first session.',
        'icon' => '🚀',
        'unlocked' => true,
      ],
      [
        'id' => 'reviewer',
        'name' => 'Reviewer',
        'desc' => 'Left your first review.',
        'icon' => '⭐',
        'unlocked' => true,
      ],
      [
        'id' => 'streak-3',
        'name' => '3-Day Streak',
        'desc' => 'Studied 3 days in a row.',
        'icon' => '🔥',
        'unlocked' => false,
      ],
      [
        'id' => 'planner',
        'name' => 'Planner',
        'desc' => 'Generated your first study plan.',
        'icon' => '🗓️',
        'unlocked' => false,
      ],
    ]);
  }

  public function route_badges_unlock(WP_REST_Request $req) {
    $params = $req->get_json_params();
    $table = $this->table_exists($this->badges_table()) ? $this->badges_table() : null;
    if (!$table) {
      return rest_ensure_response(['success' => true, 'stored' => false]);
    }

    global $wpdb;
    $wpdb->insert($table, [
      'user_id' => (int) ($params['userId'] ?? 0),
      'badge_id' => sanitize_text_field($params['badgeId'] ?? ''),
      'unlocked_at' => current_time('mysql', true),
    ]);

    return rest_ensure_response(['success' => true, 'stored' => true]);
  }

  private function reviews_table() {
    global $wpdb;
    return $wpdb->prefix . 'ngt_reviews';
  }

  private function ensure_reviews_table() {
    global $wpdb;
    $table = $this->reviews_table();
    $collate = $wpdb->get_charset_collate();
    if ($this->table_exists($table)) {
      return $table;
    }

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    $sql = "CREATE TABLE {$table} (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      tutor_id BIGINT(20) UNSIGNED NOT NULL,
      user_id BIGINT(20) UNSIGNED NOT NULL,
      rating FLOAT NOT NULL,
      comment TEXT NULL,
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id),
      KEY tutor_id (tutor_id),
      KEY user_id (user_id)
    ) {$collate};";
    dbDelta($sql);
    return $table;
  }

  private function sessions_table() {
    global $wpdb;
    return $wpdb->prefix . 'ngt_sessions';
  }

  private function ensure_sessions_table() {
    global $wpdb;
    $table = $this->sessions_table();
    $collate = $wpdb->get_charset_collate();
    if ($this->table_exists($table)) {
      return $table;
    }

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    $sql = "CREATE TABLE {$table} (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      tutor_id BIGINT(20) UNSIGNED NOT NULL,
      user_id BIGINT(20) UNSIGNED NOT NULL,
      subject VARCHAR(191) NOT NULL,
      starts_at DATETIME NOT NULL,
      status VARCHAR(100) NOT NULL DEFAULT 'scheduled',
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id),
      KEY tutor_id (tutor_id),
      KEY user_id (user_id)
    ) {$collate};";
    dbDelta($sql);
    return $table;
  }

  private function messages_table() {
    global $wpdb;
    return $wpdb->prefix . 'ngt_messages';
  }

  private function ensure_messages_table() {
    global $wpdb;
    $table = $this->messages_table();
    $collate = $wpdb->get_charset_collate();
    if ($this->table_exists($table)) {
      return $table;
    }

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    $sql = "CREATE TABLE {$table} (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      sender_id BIGINT(20) UNSIGNED NOT NULL,
      receiver_id BIGINT(20) UNSIGNED NOT NULL,
      body TEXT NULL,
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id),
      KEY sender_id (sender_id),
      KEY receiver_id (receiver_id)
    ) {$collate};";
    dbDelta($sql);
    return $table;
  }

  private function badges_table() {
    global $wpdb;
    return $wpdb->prefix . 'ngt_badges';
  }

  private function ensure_badges_table() {
    global $wpdb;
    $table = $this->badges_table();
    $collate = $wpdb->get_charset_collate();
    if ($this->table_exists($table)) {
      return $table;
    }

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    $sql = "CREATE TABLE {$table} (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id BIGINT(20) UNSIGNED NOT NULL,
      badge_id VARCHAR(191) NOT NULL,
      unlocked_at DATETIME NOT NULL,
      PRIMARY KEY (id),
      KEY user_id (user_id)
    ) {$collate};";
    dbDelta($sql);
    return $table;
  }
}
