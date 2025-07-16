import { useEffect, useState } from 'react';
import { useStateValue } from '../context/GlobalContext';
import style from '../modulesCss/Student.module.css';
import { useNavigate } from 'react-router-dom';
import api from '../../axiosConfig.js';
import Loader from './Loader.jsx';
import { Button } from '@mui/material';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


const Student = () => {
    const { course, user } = useStateValue();
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [color, setColor] = useState("#000000");
    const [isItalic, setIsItalic] = useState(false)
    const [namePosition, setNamePosition] = useState({ top: 100, left: 100 });
    const [idPosition, setIdPosition] = useState({ top: 200, left: 100 });
    const [imageCert, setImageCert] = useState(null);
    const navigate = useNavigate();
    const [imageLoad, setImageLoad] = useState(false);

    const handleCloseModal = (e) => {
        e.preventDefault();
        localStorage.removeItem('cetificate_data');
        localStorage.removeItem('cetificate_data_image')
        localStorage.removeItem('course_data')
        navigate('/home');
    }

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
            pdf.save(`Certificado_${course.course.name}_${user.cedula}.pdf`);
        };


        return (

            <Button onClick={downloadPDF} sx={{margin:'10px'}} variant="contained">Descargar PDF</Button>
            
        );
    };

    const positionDataCertificate = () => {
        console.log(namePosition)
        const name = document.getElementById('name');
        const cedula = document.getElementById('cedula');
        const container = document.querySelector(`.${style.imageContainer}`);



        // Establecer placeholder
        name.innerHTML = '&lt;&lt;Nombre&gt;&gt;';


        // Obtener posición relativa al contenedor
        const placeholderWidth = name.getBoundingClientRect().width;
        const halfPlaceholder = placeholderWidth / 2;

        console.log(halfPlaceholder)

        // Paso 3: obtener el left inicial desde props (posición original del nombre)
        const originalLeft = namePosition.left;
        console.log(originalLeft)
        // Paso 4: calcular el centro del placeholder con respecto al left
        const centroPlaceholder = originalLeft + halfPlaceholder;

        // Paso 5: ahora asignamos el nombre real
        name.innerHTML = (user.nombre.given.toUpperCase() + " " + user.nombre.family.toUpperCase());
        cedula.innerHTML = user.cedula;

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
        cedula.style.top = `${idPosition.top + 3}px`
        setImageLoad(true)

    };


    useEffect(() => {
        const validateCertificate = async () => {
            try {

                const res = await api.get(`/certificateCourse/${course.course.courseId}`);
                localStorage.setItem('cetificate_data', JSON.stringify(res.data));
                console.log(res.data)


                setColor(res.data.payload.color);
                setFontFamily(res.data.payload.fontFamily);
                setFontSize(res.data.payload.fontsize);
                setIsItalic(res.data.payload.italic);
                setNamePosition({ top: res.data.payload.nameY, left: res.data.payload.nameX })
                setIdPosition({ top: res.data.payload.documentY, left: res.data.payload.documentX })



                if (!res.data.payload.fileName == '') {
                    const resCert = await api.get(`/certificate/${res.data.payload.fileName}`);
                    localStorage.setItem('cetificate_data_image', JSON.stringify(resCert.data.image));
                    //console.log(resCert.data.image)

                    setImageCert(resCert.data.image);

                }

            } catch (error) {
                console.log(error)
            }
        }

        validateCertificate();
    }, [])




    return (<>
        <div className={style.divContainer}>

            <div>
                {<div className={style.modalOverlay} >
                    <button className={style.closeButton} onClick={handleCloseModal}>
                        ✕
                    </button>
                    <div className={style.modalContent}>


                        <div className={style.imageContainer}>
                            {imageLoad ? <></> : <div style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                background: 'transparent',
                                zIndex: '3000'
                            }}><Loader ba={'transparent'} height={'530px'} color={'#156DF9'} load={2} /></div>}
                            <img src={imageCert} className={style.modalImage} onLoad={() => {
                                setImageLoad(true);
                                positionDataCertificate(); // ejecutar aquí, ahora sí la imagen y el DOM están listos
                            }} />

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
                                    fontStyle: isItalic ? "italic" : "normal",
                                    background: "transparent",
                                    padding: "5px",

                                }}
                            >

                            </span>
                        </div>
                        <DownloadButton />
                    </div>

                </div>}
            </div>
        </div>

    </>);
}

export default Student;