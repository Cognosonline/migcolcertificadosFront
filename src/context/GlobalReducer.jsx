export const initialState = {
    user: JSON.parse(localStorage.getItem("user_data")) || null,
    dataCourses: JSON.parse(localStorage.getItem("courses_data")) || null,
    buttonCard: 0,
    course:JSON.parse(localStorage.getItem("course_data")) || null,

}

export function reducer (state,action){
    const { type, payload } = action;

    switch(type){
        case 'SING_IN_USER':
            return {
                ...state,
                user:payload
            }
        case 'GET_COURSES':
            return {
                ...state,
                dataCourses: payload
            }
        case 'GET_COURSE':
            return{
                ...state,
                course: payload
            }
    }

}