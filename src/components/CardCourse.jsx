import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';



import style from '../modulesCss/CardCourse.module.css';
import { useStateValue } from '../context/GlobalContext';
import api from '../../axiosConfig';

const CardCourse = (props) => {

    const { course, user } = props;
    const navigate = useNavigate();
    const [isLoading2, setIsLoading2] = useState(false);
    const { getCourse } = useStateValue();
    const [validateScore, setValidateScore] = useState(true);
    const [score, setScore] = useState(null)

    const courseSelect = async (e) => {
        setIsLoading2(true)
        try {
            e.preventDefault();
            await getCourse(course.courseInfo.id);
            navigate('/course');
            setIsLoading2(false)
        } catch (error) {
            console.log('error al obtener el curso');
        }
    }

    const viewStudent = async (e) => {
        try {
            e.preventDefault();
            await getCourse(course.courseInfo.id);
            navigate('/student');
        } catch (error) {
            console.log('error al obtener el curso');
        }
    }

    useEffect(() => {
        const validateScoreU = async () => {
            try {

                const res = await api.get(`/certificateCourse/${course.courseInfo.courseId}`);
                const reqScore = res.data.payload.reqScore; // proporción entre 0 y 1

                const userScore = course.courseInfo.score?.score;
                const possible = course.courseInfo.score?.possible;


                let normalizedUserScore = 0;

                if (typeof userScore === "number" && typeof possible === "number" && possible > 0) {
                    // Si userScore está entre 0 y 100, y posible también, lo tratamos como porcentaje
                    const isProbablyPercentage = possible >= 100 && userScore <= 100;

                    if (isProbablyPercentage) {
                        normalizedUserScore = userScore / 100;
                    } else {
                        normalizedUserScore = userScore / possible;
                    }
                }

                const hasEnoughScore = (
                    typeof userScore === "number" &&
                    typeof possible === "number" &&
                    normalizedUserScore >= reqScore
                );

                setValidateScore(!hasEnoughScore);

                // ⬅️ Si NO tiene suficiente, deshabilita
            } catch (error) {
                console.log(error);
                setValidateScore(true); // ⬅️ En caso de error, deshabilita por seguridad
            }
        };

        if(course.role != "Student"){
            setValidateScore(false)
        }

        if (course.role === "Student") {
            validateScoreU();
        }
    }, [course]);


    return (
        <>{!validateScore?
            <Card className={style.cardCourse}>
            <CardContent sx={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {course.courseInfo.courseId}
                </Typography>
                <Typography sx={{ fontSize: 16 }} component="div">
                    {course.courseInfo.name}
                </Typography>
                <Typography sx={{ mb: 1, marginTop: '2px' }} color="text.secondary">
                    {course.role === 'Student' ? 'Estudiante' : 'Profesor'}
                </Typography>

            </CardContent>
            <CardActions sx={{ position: 'relative', float: 'right', margin: '2px 5px' }}>
                {course.role == 'Student' ? <LoadingButton
                    size="small"
                    onClick={viewStudent}
                    loading={isLoading2}
                    color='success'
                    variant="contained"
                    disabled={validateScore}
                >
                    <span>CERTIFICADO</span>
                </LoadingButton> :
                    <LoadingButton
                        size="small"
                        onClick={courseSelect}
                        loading={isLoading2}
                        variant="contained"
                    >
                        <span>INGRESAR</span>
                    </LoadingButton>}
            </CardActions>
        </Card>:null }</>
    );
}


export default CardCourse;