import React from "react";
import styles from "../../styles/analytics.module.css";

const Analytics = ({ totalStudents, newStudents, totalInstructors, totalCourses }) => {
  const stats = [
    { value: totalStudents, label: "Estudiantes", decoration: styles.decorationBottom },
    { value: totalInstructors, label: "Instructores", decoration: styles.decorationTop },
    { value: totalCourses, label: "Cursos", decoration: styles.decorationTop },
    { value: newStudents, label: "Estudiantes nuevos", decoration: "" },
  ];

  return (
    <section className={`${styles.counter}`} id="analytics">
      <div className={`${styles.content}`}>
        <div className="container">
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-12">
                <div className={`${styles.countItem} ${stat.decoration}`}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
