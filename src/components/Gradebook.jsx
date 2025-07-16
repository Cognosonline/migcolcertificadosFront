import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useStateValue } from '../context/GlobalContext.jsx';
import style from '../modulesCss/Gradebook.module.css';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Loader from './Loader.jsx';




const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.smoke,
        fontWeight: '600',
        fontSize: 15

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



export default function GradeBook({
    fontSize,
    fontFamily,
    color,
    isItalic,
    namePosition,
    idPosition,
    imageCert,
    reqScore
}) {

    const { course, user } = useStateValue();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [filteredStudents, setFilteredStudents] = useState(course.students);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [name, setName] = useState("Nombre");
    //const [id, setId] = useState("Cedula");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [lodingImage, setLodiangImage] = useState(true)
    const [userDow, setUserDow] = useState(null)
    const [searchInput, setSearchInput] = useState('');



    const positionDataCertificate = (row) => {
        const name = document.getElementById('name');
        const cedula = document.getElementById('cedula');
        const container = document.querySelector(`.${style.imageContainer}`);



        // Establecer placeholder
        name.innerHTML = '&lt;&lt;Nombre&gt;&gt;';


        // Obtener posición relativa al contenedor
        const placeholderWidth = name.getBoundingClientRect().width;
        const halfPlaceholder = placeholderWidth / 2;

        // Paso 3: obtener el left inicial desde props (posición original del nombre)
        const originalLeft = namePosition.left;

        // Paso 4: calcular el centro del placeholder con respecto al left
        const centroPlaceholder = originalLeft + halfPlaceholder;

        // Paso 5: ahora asignamos el nombre real
        name.innerHTML = row.user.name.toUpperCase();
        cedula.innerHTML = row.user.externalId;

        // Paso 6: obtener el nuevo ancho del span con el nombre real
        const userNameWidth = name.getBoundingClientRect().width;
        const halfUserName = userNameWidth / 2;

        // Paso 7: mover el span hacia la derecha sumando el ancho del placeholder
        let nuevoLeft = originalLeft + placeholderWidth;

        // Paso 8: restar la mitad del ancho del placeholder
        nuevoLeft -= halfPlaceholder;

        // Paso 9: restar la mitad del ancho del nombre real
        nuevoLeft -= halfUserName;

        // Paso 10: aplicar el nuevo valor de left
        name.style.left = `${nuevoLeft}px`;

    };

    const DownloadButton = () => {


        const downloadPDF = async () => {
            const imageContainer = document.querySelector(`.${style.imageContainer}`);
            // Capturar el contenedor como imagen
            const canvas = await html2canvas(imageContainer, {
                scale: 4  // Aumenta la resolución (puedes cambiar el valor a 3, 4, etc., dependiendo de la calidad que desees)
            });
            const imgData = canvas.toDataURL("image/png"); // Convertir a base64

            // Crear el PDF en horizontal (A4 landscape)
            const pdf = new jsPDF("l", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();  // 297 mm
            const pageHeight = pdf.internal.pageSize.getHeight(); // 210 mm

            // Definir los márgenes (por ejemplo, 10mm)
            const margin = 10;

            // Calcular el ancho y alto de la imagen para dejar el margen
            const imgWidth = pageWidth - 2 * margin;  // Restar los márgenes
            const imgHeight = pageHeight - 2 * margin; // Restar los márgenes

            // Agregar la imagen ajustada para que ocupe el espacio con márgenes
            pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);

            // Agregar un borde alrededor del contenido
            pdf.rect(margin, margin, imgWidth, imgHeight);  // Dibujar borde

            // Descargar el PDF
            pdf.save(`Certificado_${course.course.name}_${userDow}.pdf`);
        };


        return (

            <Button onClick={downloadPDF} sx={{ margin: '10px' }} variant="contained">Descargar PDF</Button>

        );
    };


    const renderScore = (score) => {
        if (!score || score.score === 0) return '--';
        if (score.scaleType === 'Percent') return `${score.score}%`;
        if (score.scaleType === 'Tabular') return score.text;
        return score.score;
    };
    
    useEffect(() => {
        const filtered = course.students?.filter(student => {
            const externalId = student?.user?.externalId || '';
            const name = student?.user?.name || '';
            return (
                externalId.toLowerCase().includes(searchInput.toLowerCase()) ||
                name.toLowerCase().includes(searchInput.toLowerCase())
            );
        });
        setFilteredStudents(filtered);
    }, [searchInput, course.students]);


    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [course.students]);

    useEffect(() => {
        if (isModalOpen && selectedStudent) {
            // Espera un tick para asegurarte de que el DOM ya tiene el modal
            setTimeout(() => {
                positionDataCertificate(selectedStudent);
            }, 2000);
        }
    }, [isModalOpen, selectedStudent]);

    return (
        <>
            {windowWidth < 900 ?
                <><div style={{ width: '95%', height: 'auto', margin: '20px auto', background: 'black', display: 'flex', justifyContent: 'flex-start' }}>
                    <input
                        type="text"
                        placeholder="Buscar estudiante por nombre o ID"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={{
                            padding: '8px',
                            width: '250px',
                            border: '1px solid gray',
                            borderRadius: '5px'
                        }}
                    />
                </div>

                    <div style={{
                        width: '100%',
                        height: 'auto',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: '10px 0',
                        backgroundColor: 'rgb(224, 221, 221)',
                        margin: '2px auto'
                    }}>
                        {
                            course.students ? filteredStudents.map((row) => {
                                console.log(row.score.score / 100)
                                console.log(row.score.possible * (reqScore / 100))
                                console.log(reqScore / 100)

                                return (<Card key={row.user.externalId} sx={{ width: '90%', marginTop: '10px', color: 'black' }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 17 }} gutterBottom>
                                            {row.user.name}
                                        </Typography>
                                        <Typography sx={{ fontSize: 15 }} color="text.secondary" gutterBottom>
                                            ID: {row.user.externalId}
                                        </Typography>
                                        <Typography variant="h5" component="div">

                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} >
                                            NOTA: {renderScore(row.score)}
                                        </Typography>

                                    </CardContent>
                                    <CardActions>
                                        {
                                            row.score === 0 || row.score.possible * reqScore > row.score.score ?
                                                <Button variant='contained' color='success' disabled size='small'
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        //visabledCertificate(row)
                                                    }}

                                                >Certificado</Button>
                                                :
                                                <Button variant='contained' color='success' size='small'
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setIsModalOpen(true);
                                                        setSelectedStudent(row);
                                                        setUserDow(row.user.externalId)
                                                        //positionDataCertificate(row)


                                                        //visabledCertificate(row)
                                                    }}>Certificado</Button>
                                        }

                                    </CardActions>
                                </Card>)
                            })
                                : <div></div>}
                    </div></>
                : <>
                    <div style={{ width: '95%', background: '#1d1d1d', padding: '10px', margin: '20px auto', display: 'flex', justifyContent: 'flex-start' }}>
                        <input
                            type="text"
                            placeholder="Buscar estudiante por nombre o ID"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            style={{
                                padding: '8px',
                                width: '250px',
                                border: '1px solid gray',
                                borderRadius: '5px'
                            }}
                        />
                    </div>

                    <TableContainer component={Paper} sx={{
                        paddingBottom: '20px',
                        height: '50vh'

                    }}>
                        <Table sx={{ width: '95%', margin: '0 auto' }} aria-label="customized table">
                            <TableHead sx={{ fontWeight: 'bold' }}>
                                <TableRow>
                                    <StyledTableCell>Nombres y Apellidos</StyledTableCell>
                                    <StyledTableCell align="right">Numero de Documento</StyledTableCell>
                                    <StyledTableCell align="right">Calificacion General</StyledTableCell>
                                    <StyledTableCell align="right">     </StyledTableCell>
                                    <StyledTableCell align="right">     </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {

                                    course.students ? filteredStudents.map((row) => (
                                        <StyledTableRow key={row.user.name}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.user.name}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{row.user.externalId}</StyledTableCell>
                                            <StyledTableCell align="center"> {renderScore(row.score)}</StyledTableCell>
                                            <StyledTableCell align="right">
                                                {
                                                    row.score === 0 || row.score.possible * (reqScore / 100) >= row.score.score ?
                                                        <Button variant='contained' color='success' disabled size='small'>Certificado</Button>
                                                        :
                                                        <Button variant='contained' color='success' size='small'
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setIsModalOpen(true)
                                                                setSelectedStudent(row);
                                                                setUserDow(row.user.externalId)
                                                                //positionDataCertificate(row)

                                                                //visabledCertificate(row)
                                                            }}>Certificado</Button>
                                                }
                                            </StyledTableCell>

                                        </StyledTableRow>
                                    )) : <div></div>}
                            </TableBody>
                        </Table>
                    </TableContainer></>
            }
            {isModalOpen && (
                <div className={style.modalOverlay} >
                    <button className={style.closeButton} onClick={() => setIsModalOpen(false)}>
                        ✕
                    </button>
                    <div className={style.modalContent}>

                        {lodingImage ? <div className={style.imageContainer}>
                            <img src={imageCert} alt="Certificado" className={style.modalImage} />

                            {/* Nombre arrastrable */}
                            <span
                                id="name"
                                style={{
                                    position: "absolute",
                                    top: `${namePosition.top}px`,
                                    left: `${namePosition.left}px`,
                                    fontSize: `${fontSize}px`,
                                    fontFamily: fontFamily,
                                    color: color,
                                    fontStyle: isItalic ? "italic" : "normal",
                                    background: "transparent",
                                    padding: "5px",
                                    cursor: "move",
                                }}
                            >
                            </span>

                            {/* Cédula arrastrable */}
                            <span
                                id="cedula"
                                style={{
                                    position: "absolute",
                                    top: `${idPosition.top}px`,
                                    left: `${idPosition.left}px`,
                                    fontSize: `${fontSize}px`,
                                    fontFamily: fontFamily,
                                    color: color,
                                    background: "transparent",
                                    fontStyle: isItalic ? "italic" : "normal",
                                    padding: "5px",
                                    cursor: "move",
                                }}
                            >

                            </span>
                        </div> : <Loader ba={'transparent'} height={'530px'} color={'#156DF9'} load={2} />}
                        <DownloadButton />
                    </div>

                </div>
            )}

        </>
    );
}