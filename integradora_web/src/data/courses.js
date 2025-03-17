export const courses = [
    {
      id: 1,
      title: "React-Guía completa 2025",
      description:
        "Este curso es una guía completa y actualizada para dominar React en 2025, incluyendo las últimas tendencias y mejores prácticas en el desarrollo de aplicaciones modernas",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Xi8cHRogKk4vykmSdtpOfsIP2fgf-Icbawh9DKy-jidxGx1u9dGtJqdmLty41na2iDI&usqp=CAU",
      instructor: "Derick Axel Lagunes",
      startDate: "Mar 12",
      endDate: "Abr 05",
      rating: 4.8,
      price: 150.0,
      studentLimit: 120,
      tags: ["Programación", "Informática"],
      status: "En Curso",
      modules: [
        {
          title: "Introducción a React",
          lessons: [
            {
              title: "Introducción a la sección",
              type: "video",
              content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
              description: "En esta lección aprenderás qué es React y por qué es tan popular.",
            },
            {
              title: "¿Qué es React?",
              type: "video",
              content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
              description: "Aprende los conceptos fundamentales de React.",
            },
            {
              title: "Temas puntuales de la sección",
              type: "pdf",
              content: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              description: "Guía de referencia rápida para React.",
            },
          ],
          resources: [
            { name: "Guía de instalación", url: "#" },
            { name: "Cheatsheet de React", url: "#" },
          ],
        },
        {
          title: "Introducción a JavaScript moderno",
          lessons: [
            {
              title: "Introducción a JavaScript ES6+",
              type: "video",
              content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
              description: "Aprende las características modernas de JavaScript.",
            },
            {
              title: "Arrow Functions",
              type: "video",
              content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
              description: "Cómo usar arrow functions en JavaScript.",
            },
            {
              title: "Ejercicios prácticos",
              type: "pdf",
              content: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              description: "Ejercicios para practicar lo aprendido.",
            },
          ],
          resources: [{ name: "Guía de ES6", url: "#" }],
        },
        {
          title: "Primeros pasos en React",
          lessons: [
            {
              title: "Creando nuestra primera aplicación",
              type: "video",
              content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
              description: "Aprende a crear tu primera aplicación con React.",
            },
            {
              title: "Componentes en React",
              type: "video",
              content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
              description: "Entendiendo los componentes en React.",
            },
            {
              title: "Código fuente",
              type: "pdf",
              content: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              description: "Código fuente de los ejemplos.",
            },
          ],
          resources: [
            { name: "Documentación oficial", url: "#" },
            { name: "Ejemplos de código", url: "#" },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "JavaScript Avanzado",
      description: "Domina conceptos avanzados de JavaScript",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHnJDLOcdm_0b6N6kNj-1OvO9KhKYgqIy0w&s",
      instructor: "Jane Doe",
      startDate: "Ene 20",
      endDate: "Feb 28",
      rating: 4.5,
      price: 120.0,
      studentLimit: 100,
      tags: ["JavaScript", "Web Development"],
      status: "Aprobado",
      modules: [
        {
          title: "ES6+",
          lessons: [
            {
              title: "Arrow Functions",
              type: "video",
              content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
              description: "Aprende a usar arrow functions en JavaScript.",
            },
          ],
          resources: [{ name: "Guía de ES6", url: "#" }],
        },
      ],
    },
    {
      id: 3,
      title: "Desarrollo Full Stack",
      description: "Construye aplicaciones web completas",
      image: "https://www.ucatalunya.edu.co/img/blog/que-es-el-desarrollo-web-full-stack-y-por-que-es-una-de-las-profesiones-mas-demandadas-del-mercado-en-aplicaciones-web.jpg",
      instructor: "John Smith",
      startDate: "Feb 15",
      endDate: "Mar 30",
      rating: 4.7,
      price: 200.0,
      studentLimit: 80,
      tags: ["Full Stack", "Web Development", "Node.js"],
      status: "Aprobado",
      modules: [],
    },
    {
        id: 4,
        title: "Python para Ciencia de Datos",
        description:
          "Aprende Python desde lo básico hasta técnicas avanzadas para ciencia de datos, incluyendo manipulación de datos, visualización y machine learning.",
        image: "https://webandcrafts.com/_next/image?url=https%3A%2F%2Fadmin.wac.co%2Fuploads%2FFeatures_Of_Python_1_f4ccd6d9f7.jpg&w=4500&q=90",
        instructor: "Laura Martínez",
        startDate: "Abr 10",
        endDate: "May 20",
        rating: 4.9,
        price: 180.0,
        studentLimit: 90,
        tags: ["Python", "Ciencia de Datos", "Machine Learning"],
        status: "Aprobado",
        modules: [
          {
            title: "Fundamentos de Python",
            lessons: [
              {
                title: "Introducción a Python",
                type: "video",
                content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                description: "Conoce los fundamentos de Python y su sintaxis básica.",
              },
              {
                title: "Estructuras de datos en Python",
                type: "video",
                content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                description: "Aprende sobre listas, diccionarios y conjuntos en Python.",
              },
              {
                title: "Ejercicios de práctica",
                type: "pdf",
                content: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                description: "Ejercicios básicos para practicar Python.",
              },
            ],
            resources: [
              { name: "Documentación oficial de Python", url: "https://docs.python.org/3/" },
              { name: "Cheatsheet de Python", url: "#" },
            ],
          },
          {
            title: "Manipulación de Datos con Pandas",
            lessons: [
              {
                title: "Introducción a Pandas",
                type: "video",
                content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                description: "Aprende a manipular datos con Pandas.",
              },
              {
                title: "Limpieza de Datos",
                type: "video",
                content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                description: "Cómo limpiar y transformar datos en Pandas.",
              },
              {
                title: "Ejercicios con Pandas",
                type: "pdf",
                content: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                description: "Ejercicios prácticos con Pandas.",
              },
            ],
            resources: [
              { name: "Documentación de Pandas", url: "https://pandas.pydata.org/docs/" },
              { name: "Ejemplos de Pandas", url: "#" },
            ],
          },
          {
            title: "Introducción al Machine Learning",
            lessons: [
              {
                title: "Conceptos básicos de Machine Learning",
                type: "video",
                content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                description: "Aprende los fundamentos del Machine Learning.",
              },
              {
                title: "Regresión lineal con Scikit-Learn",
                type: "video",
                content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                description: "Implementa regresión lineal con Python y Scikit-Learn.",
              },
              {
                title: "Ejercicios prácticos de Machine Learning",
                type: "pdf",
                content: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                description: "Ejercicios para reforzar los conocimientos de Machine Learning.",
              },
            ],
            resources: [
              { name: "Documentación de Scikit-Learn", url: "https://scikit-learn.org/stable/" },
              { name: "Dataset de práctica", url: "#" },
            ],
          },
        ],
      }
      
  ]
  
  