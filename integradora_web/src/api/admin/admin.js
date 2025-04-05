import { headers } from "../../utils/config/config";
import { admin_path, all, base_api_url, course_management } from "../../utils/config/paths";

export const fetchAllCourses = async () => {
    await fetch(`${base_api_url}${admin_path}${course_management}${all}`, {
        method: "GET",
        headers: headers,
        body: JSON.stringify(
            {
                instructorId: user?.jwt
            }
        )
    }).then((response) => response.json())
        .then((response) => {
            setCourses(response.result);
        })
        .catch((error) => {
            console.log(error);
            // sweetAlert('error', "Error", "No pudimos cargar la lista de usuarios. Inténtalo nuevamente.", "", null);
        });
};