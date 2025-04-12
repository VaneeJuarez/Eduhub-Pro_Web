
// paths.js
const IP = "192.168.0.169";
// 1. Base API URL
export const base_api_url = `http://${IP}:8080/eduhubpro/`;

// 2. Role
export const admin_path = "admin/";
export const student_path = "student/";
export const instructor_path = "instructor/";
export const auth_path = "auth/";
export const storage_path = "api/storage/";

// 3. Modules
export const user_management = "user/";
export const category_management = "category/";
export const course_management = "course/";
export const account_management = "account/";
export const registration_management = "registration/";
export const payment_management = "payment/";
export const module_management = "module/";
export const section_management = "section/";
export const attendance_management = "attendance/";
export const review_management = "review/";

// 4. Common Actions
export const all = "all";
export const by_id = "by-id";
export const save = "save";
export const create = "create";
export const update = "update";
export const change_status = "change-status";

// 5. Specific Actions
// Auth
export const login = "login";
export const logout = "logout";
export const register = "register";
export const request_reset = "request-reset";
export const reset = "reset";

// User
export const count = "count";
export const profile = "profile";
export const upload_photo = "upload-photo";
export const update_profile = "update-profile";
export const change_status_instructor = "change-status-instructor";
export const change_status_student = "change-status-student";
export const support = "support";

// Course
export const by_name = "by-name";
export const by_date = "by-date";
export const by_category = "by-category";
export const to_approve = "to-approve";
export const registered_students = "registered-students";

// Payment
export const by_student = "by-student";

// Category
export const get_actives = "get-actives";

// Review 
export const by_course = "by-course";

// Registration
export const pending_payment = "pending-payment";

// CloudFare
export const object_list = "object-list";
export const get_file = "get-file";
export const delete_file = "delete"; // para no chocar con la palabra reservada 'delete'
export const upload = "upload";