import { createContext, useReducer, useContext } from "react";
import { initialState, reducer } from "./GlobalReducer";
import api from '../../axiosConfig.js';
import { useNotifications } from "../hooks/useNotifications";

export const MyContext = createContext();

const ContextProvider = ({ children }) => {

    //const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { showSuccess, showError, showWarning, showInfo } = useNotifications();

    const saveUserData = (dataUser) => {
        localStorage.setItem('user_data', JSON.stringify(dataUser));
    };

    const saveCoursesData = (dataCourses) => {
        sessionStorage.setItem('courses_data', JSON.stringify(dataCourses));
    };

    const saveCourseData = (dataCourse) => {
        sessionStorage.setItem('course_data', JSON.stringify(dataCourse));
    };

    const saveCertificateCourseData = (certificateCourseData) => {
        sessionStorage.setItem('certificate_course_data', JSON.stringify(certificateCourseData));
    };


    const singInUser = async (userId) => {
        try {
            const result = await api.get(`/user/${userId}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true
            });

            const dataUser = result.data.payload;

            saveUserData(dataUser);

            dispatch({
                type: 'SING_IN_USER',
                payload: result.data.payload
            })

        } catch (error) {
            console.log(error);
            
            // Manejo mejorado de errores de Axios
            let errorMessage = 'Error de conexión con el api de BlackBoard';
            
            if (error.response) {
                const status = error.response.status;
                const serverMessage = error.response.data?.message || error.response.data?.error;
                
                if (status === 401) {
                    errorMessage = 'Credenciales inválidas. Verifica tu usuario.';
                } else if (status === 404) {
                    errorMessage = 'Usuario no encontrado.';
                } else if (status === 500) {
                    errorMessage = `Error interno del servidor. ${serverMessage || 'Intenta nuevamente más tarde.'}`;
                } else {
                    errorMessage = serverMessage || `Error ${status} en el servidor`;
                }
            } else if (error.request) {
                errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
            } else {
                errorMessage = error.message || 'Error inesperado al iniciar sesión.';
            }
            
            showError(errorMessage);
        }
    }

    const getCourses = async (id) => {
        try {
            const result = await api.get(`/courses/${id}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const dataCourses = result.data.payload;

            // 🔍 Filtrar los cursos según roles y score
            const filteredCourses = dataCourses.filter(course => {
                const role = course.role || ""; // Asegurar que sea string
                const isTeacher = role === "Instructor" || role === "A";  // "A" suena a un código que tal vez significa profesor
                const isStudent = role === "Student";


                const score = course.courseInfo?.score;

                if (isTeacher) return true;
                if (isStudent && score !== null && score.score !== 0 && score !== undefined) return true;

                return false;
            });

            // Guardar y despachar solo los cursos filtrados
            saveCoursesData(filteredCourses);

            dispatch({
                type: 'GET_COURSES',
                payload: filteredCourses
            });

        } catch (error) {
            console.log(error);
            
            // Manejo mejorado de errores
            let errorMessage = 'Error al cargar los cursos';
            
            if (error.response) {
                const status = error.response.status;
                const serverMessage = error.response.data?.message || error.response.data?.error;
                
                if (status === 401) {
                    errorMessage = 'No tienes autorización para ver los cursos.';
                } else if (status === 404) {
                    errorMessage = 'No se encontraron cursos para este usuario.';
                } else if (status === 500) {
                    errorMessage = `Error interno del servidor. ${serverMessage || 'Intenta nuevamente más tarde.'}`;
                } else {
                    errorMessage = serverMessage || `Error ${status} al cargar los cursos`;
                }
            } else if (error.request) {
                errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
            } else {
                errorMessage = error.message || 'Error inesperado al cargar los cursos.';
            }
            
            showError(errorMessage);
        }
    };


    const getCourse = async (idCourse) => {
        try {

            const result = await api.get(`/course/${idCourse}`);

            const dataCourse = result.data.payload
            saveCourseData(dataCourse);


            dispatch({
                type: 'GET_COURSE',
                payload: dataCourse
            })

        } catch (error) {
            console.log('error al cargar el curso');
            
            // Manejo mejorado de errores
            let errorMessage = 'Error al cargar el curso';
            
            if (error.response) {
                const status = error.response.status;
                const serverMessage = error.response.data?.message || error.response.data?.error;
                
                if (status === 404) {
                    errorMessage = 'Curso no encontrado.';
                } else if (status === 401) {
                    errorMessage = 'No tienes autorización para ver este curso.';
                } else if (status === 500) {
                    errorMessage = `Error interno del servidor. ${serverMessage || 'Intenta nuevamente más tarde.'}`;
                } else {
                    errorMessage = serverMessage || `Error ${status} al cargar el curso`;
                }
            } else if (error.request) {
                errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
            } else {
                errorMessage = error.message || 'Error inesperado al cargar el curso.';
            }
            
            showError(errorMessage);
        }

    }

    const getUserCertificate = async (userId, courseId) => {
        try {
            // console.log(`🔄 Llamando API: /user-certificate/${userId}/${courseId}`)

            const result = await api.get(`/user-certificate/${userId}/${courseId}`);
            // console.log("📡 Respuesta de la API:", result.data)

            const certificateData = result.data
            // Guardar los datos del certificado con una clave específica
            localStorage.setItem('certificate_student_data', JSON.stringify(certificateData));

            // Guardar datos del certificado en sessionStorage con clave específica
            saveCertificateCourseData(certificateData);

            // ❌ NO sobrescribir course_data - mantener los datos originales del curso
            // const dataCourse = result.data.payload
            // saveCourseData(dataCourse);

            // ❌ NO despachar al reducer para evitar sobrescribir el estado del curso
            // dispatch({
            //     type: 'GET_COURSE',
            //     payload: dataCourse
            // })

            // ✅ IMPORTANTE: Retornar los datos del certificado
            // console.log("✅ Retornando certificateData:", certificateData)
            return certificateData;

        } catch (error) {
            console.log('❌ Error al cargar el certificado:', error);
            
            // Manejo mejorado de errores de Axios
            let errorMessage = 'Error al cargar el certificado';
            
            if (error.response) {
                // Error de respuesta del servidor (4xx, 5xx)
                const status = error.response.status;
                const serverMessage = error.response.data?.message || error.response.data?.error;
                
                if (status === 500) {
                    errorMessage = `Error interno del servidor (${status}). ${serverMessage || 'Por favor, intenta nuevamente más tarde.'}`;
                } else if (status === 404) {
                    errorMessage = 'Certificado no encontrado para este usuario y curso.';
                } else if (status === 401) {
                    errorMessage = 'No tienes autorización para acceder a este certificado.';
                } else {
                    errorMessage = `Error ${status}: ${serverMessage || 'Error en el servidor'}`;
                }
            } else if (error.request) {
                // Error de red (no hay respuesta)
                errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
            } else {
                // Error de configuración
                errorMessage = error.message || 'Error inesperado al procesar la solicitud.';
            }
            
            showError(errorMessage);
            return null; // Retornar null en caso de error
        }
    }

    // Función helper para obtener datos de certificado sin afectar el estado del curso
    const getCertificateCourseData = () => {
        return JSON.parse(sessionStorage.getItem('certificate_course_data')) || null;
    }


    return (
        <MyContext.Provider value={{
            ...state,
            singInUser,
            getCourses,
            getCourse,
            getUserCertificate,
            getCertificateCourseData,
        }}>
            {children}
        </MyContext.Provider>
    );
}

export default ContextProvider;

export const useStateValue = () => useContext(MyContext);