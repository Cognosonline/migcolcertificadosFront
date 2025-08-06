// Helper para debug - mantener separados los datos de curso y certificado
export const CourseDataHelper = {
  // Obtener datos originales del curso
  getCourseData: () => {
    try {
      return JSON.parse(sessionStorage.getItem('course_data')) || null;
    } catch (error) {
      console.error('Error parsing course_data:', error);
      return null;
    }
  },

  // Obtener datos del certificado
  getCertificateCourseData: () => {
    try {
      return JSON.parse(sessionStorage.getItem('certificate_course_data')) || null;
    } catch (error) {
      console.error('Error parsing certificate_course_data:', error);
      return null;
    }
  },

  // Verificar integridad de los datos
  validateCourseData: () => {
    const courseData = CourseDataHelper.getCourseData();
    const certificateData = CourseDataHelper.getCertificateCourseData();
    
    // console.log('🔍 Debug - Course Data:', courseData);
    // console.log('🔍 Debug - Certificate Data:', certificateData);
    
    return {
      hasCourseData: courseData !== null,
      hasCertificateData: certificateData !== null,
      courseId: courseData?.course?.courseId || null,
      studentsCount: courseData?.students?.length || 0,
    };
  },

  // Limpiar datos de certificado sin afectar curso
  clearCertificateData: () => {
    sessionStorage.removeItem('certificate_course_data');
    localStorage.removeItem('certificate_student_data');
  }
};

export default CourseDataHelper;
