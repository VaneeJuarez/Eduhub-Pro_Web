// paths.js
// Base api url
export const base_api_url = "http://localhost:8080/eduhubpro/";

// Controllers
export const auth_path = "auth/"
export const global_path = "global/"
export const admin_path = "admin/"

// Module
export const user_management = "user/"

// Request type
// Auth
export const login = "login";
export const logout = "logout";

// Users
export const create_user = "create";
export const count_all_users = "count";
export const get_all_users = "get-all";
export const change_status_instructor = "change-status-instructor";
export const change_status_student = "change-status-student";