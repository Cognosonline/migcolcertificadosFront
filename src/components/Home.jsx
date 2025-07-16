import style from '../modulesCss/Home.module.css'
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';

import CardCourse from './CardCourse';
import NavBar from '../components/Navbar';
import Profile from './Profile';
import { useStateValue } from '../context/GlobalContext';

const Home = () => {
    const [searchInput, setSearchInput] = useState('');
    const [myCourse, setMyCourse] = useState(21);
    const [showCourses, setShowCourses] = useState(false);

    const { user, dataCourses, getCourses } = useStateValue();

    const handleChange = (event) => {

        setMyCourse(event.target.value);
    };

    const handleSearch = (value) => {
        setSearchInput(value)
    }

    useEffect(() => {
        try {

            const fetchData = async () => {
                try {
                    if (dataCourses == null) {
                        await getCourses(user.cedula);
                        setShowCourses(true)
                    }
                } catch (error) {
                    console.error('Error al obtener los cursos:', error);
                } finally {
                    setShowCourses(true);
                }
            };
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (<>
        <NavBar />
        <div className={style.divContainer}>
            <Profile />
            {<div className={style.divContainerSearchs}>
                <h2 style={{ color: 'whiteSmoke', padding: '10px', fontWeight: '400', fontSize: '20px' }}>Cursos</h2>
                <div style={{
                    width: '200px',
                    height: '30px',
                    display: 'flex',
                    alignContent: 'center',
                    background: 'white',
                    border: '1px solid gray',
                }}>
                    <SearchIcon />
                    <input
                        type='search'
                        style={{ border: 'none', background: 'white' }}
                        placeholder='Buscar  ID o Nombres'
                        value={searchInput}
                        onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div>
                    <FormControl sx={{ m: 1, minWidth: 200, background: 'white' }}>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={myCourse}
                            onChange={handleChange}
                            autoWidth
                            label="myCourse"
                        >
                            <MenuItem value={0}><em>Todos los cursos</em></MenuItem>
                            <MenuItem value={10}>Cursos - Profesor</MenuItem>
                            <MenuItem value={21}>Cursos - Estudiante</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>}
            {showCourses ? <Grid container className={style.gridCourses}>
                {dataCourses
                    .filter((course) => {
                        // Filtro por tipo de curso
                        if (myCourse === 10) {
                            return course.role === 'Instructor' || course.role === 'A';
                        } else if (myCourse === 21) {
                            return course.role === 'Student';
                        }
                        return true; // myCourse === 0 → todos
                    })
                    .filter((course) => {
                        // Filtro por búsqueda
                        const query = searchInput.toLowerCase();
                        const id = course.courseInfo?.id?.toLowerCase() || '';
                        const name = course.courseInfo?.name?.toLowerCase() || '';
                        return id.includes(query) || name.includes(query);
                    })
                    .map((course) => (
                        <CardCourse key={course.courseInfo.id} course={course} />
                    ))}


            </Grid> : <div></div>}
        </div>

    </>);
}


export default Home;