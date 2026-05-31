<?php
/**
 * Plugin Name: NextGen Tutors API
 * Description: REST endpoints for NextGen Tutors frontend (stats, tutors, auth, dashboard).
 * Version: 0.1.0
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('rest_api_init', function () {
  $ns = 'ngt/v1';

  register_rest_route($ns, '/stats', [
    'methods' => 'GET',
    'callback' => function () {
      return rest_ensure_response([
        'tutors' => '500+',
        'rating' => '4.9/5',
        'sessions' => '10k+',
      ]);
    },
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/tutors/search', [
    'methods' => 'GET',
    'callback' => function (WP_REST_Request $req) {
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
    },
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/tutors/(?P<id>\d+)', [
    'methods' => 'GET',
    'callback' => function (WP_REST_Request $req) {
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
    },
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/auth/login', [
    'methods' => 'POST',
    'callback' => function (WP_REST_Request $req) {
      $params = $req->get_json_params();
      $email = sanitize_email($params['email'] ?? '');
      $password = $params['password'] ?? '';

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
    },
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/auth/register', [
    'methods' => 'POST',
    'callback' => function (WP_REST_Request $req) {
      $params = $req->get_json_params();
      $email = sanitize_email($params['email'] ?? '');
      $password = $params['password'] ?? '';
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
      $user->set_role($role);

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
    },
    'permission_callback' => '__return_true',
  ]);

  register_rest_route($ns, '/dashboard', [
    'methods' => 'GET',
    'callback' => function (WP_REST_Request $req) {
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
    },
    'permission_callback' => '__return_true',
  ]);
});
