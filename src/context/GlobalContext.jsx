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
            showError(error?.response?.data?.message || error?.response?.data?.error || error?.data?.message || error?.data?.error || error?.response?.data?.error || 'Error de conexión con el api de BlackBoard');
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
            showError('Error al cargar los cursos');
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
            showError('Error al cargar el curso');
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
            showError('Error al cargar el certificado');
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