import { Button, IconButton, Typography } from '@mui/material';
import style from '../modulesCss/InfoCourse.module.css';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { InfoOutlined } from '@mui/icons-material/';
import { use, useEffect, useState } from 'react';
import { useStateValue } from '../context/GlobalContext';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import api from '../../axiosConfig';
import Modal from './Modal';
import Toolbar from './Toolbar';
import Loader from './Loader';
import { useRef } from 'react';

const InfoCourse = ({
    fontSize,
    setFontSize,
    fontFamily, setFontFamily,
    color, setColor,
    isItalic, setIsItalic,
    namePosition, setNamePosition,
    idPosition, setIdPosition,
    imageCert, setImageCert,
    reqScore, setReqScore,
    setLodingGrade

}) => {
    const containerRef = useRef(null);
    const [image, setImage] = useState(null);
    const [lodingImage, setLodiangImage] = useState(true);
    const [file, setFile] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    //const [imageCert, setImageCert] = useState(null);
    const [validateCert, setValidateCert] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLodingInfo, setIslodingInfo] = useState(false);
    const [toolView, setToolView] = useState(true);
    const [loaderImgPre, setLoaderImgPre] = useState(false);
    const [backgroundSp, setBackgroundSp] = useState(false);

    const { course } = useStateValue();

    const [draggingElement, setDraggingElement] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e, type) => {
        const rect = e.target.getBoundingClientRect(); // Obtener el tamaño y posición del span
        setDraggingElement(type);

        // Calcular el desplazamiento del mouse dentro del span
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });

        // Prevenir la selección de texto al arrastrar
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (draggingElement && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();

            const deltaX = e.clientX - containerRect.left - dragOffset.x;
            const deltaY = e.clientY - containerRect.top - dragOffset.y;

            if (draggingElement === "name") {
                setNamePosition({ top: deltaY, left: deltaX });
            } else if (draggingElement === "id") {
                setIdPosition({ top: deltaY, left: deltaX });
            }
        }
    };


    const handleMouseUp = () => {
        setDraggingElement(null); // Terminar el arrastre cuando se suelta el mouse
    };

    const handleTouchStart = (e, type) => {
        const touch = e.touches[0];
        const rect = e.target.getBoundingClientRect();
        setDraggingElement(type);

        // Calcular el desplazamiento del toque dentro del span
        setDragOffset({
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        });

        // Prevenir desplazamiento predeterminado en dispositivos táctiles
    };

    const handleTouchMove = (e) => {
        if (draggingElement && containerRef.current) {
            const touch = e.touches[0];
            const containerRect = containerRef.current.getBoundingClientRect();

            const deltaX = touch.clientX - containerRect.left - dragOffset.x;
            const deltaY = touch.clientY - containerRect.top - dragOffset.y;

            if (draggingElement === "name") {
                setNamePosition({ top: deltaY, left: deltaX });
            } else if (draggingElement === "id") {
                setIdPosition({ top: deltaY, left: deltaX });
            }
        }
    };


    const handleTouchEnd = () => {
        setDraggingElement(null); // Terminar el arrastre cuando se suelta el toque
    };



    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            setImage(URL.createObjectURL(file)); // Previsualización de imagen
        }
    };

    const handleCancel = () => {
        setImage(null);
        setFile(null);
        document.getElementById("file-input").value = ""; // Limpia el input
    };

    const handleUpload = async (e) => {
        e.preventDefault()
        setLoaderImgPre(true)
        if (!file) {
            alert("Selecciona una imagen primero");
            return;
        }

        const formData = new FormData();
        formData.append("certificado", file);
        formData.append('courseId', course.course.courseId);

        try {
            const response = await api.post('/certificate', formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });


            if (!response.status == 200) throw new Error("Error al subir la imagen");

            const data = await response.data;

            if (data) {
                const res = await api.get(`/certificateCourse/${course.course.courseId}`);


                setColor(res.data.payload.color);
                setFontFamily(res.data.payload.fontFamily);
                setFontSize(res.data.payload.fontsize);
                setIsItalic(res.data.payload.italic);

                if (!res.data.payload.fileName == '') {
                    const resCert = await api.get(`/certificate/${res.data.payload.fileName}`);
                    //console.log(resCert.data.image)

                    setImageCert(resCert.data.image);
                    setValidateCert(true)
                    console.log("Imagen subida con éxito: " + data);
                    handleCancel(); // Limpia la selección después de subir
                    setValidateCert(true);
                    setLodiangImage(true);
                }

            }

        } catch (error) {
            console.error("Error al subir la imagen:", error);
            alert("Error al subir la imagen");
            setImage(null);
            setFile(null);
            document.getElementById("file-input").value = ""
        }
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
            pdf.save("certificado.pdf");
        };


        return (
            <Button onClick={downloadPDF} sx={{ margin: '10px' }} size="medium" variant="contained">Descargar PDF</Button>
        );
    };

    const saveReqCal = async (value) => {

        const reqResult = value / 100;

        setIsSaved(true);
        try {
            const res = await api.post(`/reqScore/`,
                {
                    courseId: course.course.courseId,
                    reqScore: reqResult,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (res) {
                console.log('Nota actualizada');
            } else {
                console.log('No actualizada');
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const validateCertificate = async () => {
            try {
                const dataCertificate = JSON.parse(localStorage.getItem("cetificate_data"));
                const dataCertificateImage = JSON.parse(localStorage.getItem("cetificate_data_image"));

                if (dataCertificate) {
                    if (dataCertificate.payload.courseId === course.course.courseId) {
                        setColor(dataCertificate.payload.color);
                        setFontFamily(dataCertificate.payload.fontFamily);
                        setFontSize(dataCertificate.payload.fontsize);
                        setIsItalic(dataCertificate.payload.italic);
                        setNamePosition({ top: dataCertificate.payload.nameY, left: dataCertificate.payload.nameX })
                        setIdPosition({ top: dataCertificate.payload.documentY, left: dataCertificate.payload.documentX })
                        //setReqScore(dataCertificate.payload.reqScore)

                        if (dataCertificate.payload.reqScore != 0) {
                            setIsSaved(true);

                            setReqScore(dataCertificate.payload.reqScore * 100);
                        }
                        const dataCertificateImage = JSON.parse(localStorage.getItem("cetificate_data_image"));
                        setImageCert(dataCertificateImage);
                        setBackgroundSp(true);
                        setValidateCert(true);
                    }
                }
                else {
                    const res = await api.get(`/certificateCourse/${course.course.courseId}`);
                    localStorage.setItem('cetificate_data', JSON.stringify(res.data));
                    console.log(res.data)

                    if (res.data.payload == null) {
                        setIslodingInfo(true);
                    }
                    setColor(res.data.payload.color);
                    setFontFamily(res.data.payload.fontFamily);
                    setFontSize(res.data.payload.fontsize);
                    setIsItalic(res.data.payload.italic);
                    setNamePosition({ top: res.data.payload.nameY, left: res.data.payload.nameX })
                    setIdPosition({ top: res.data.payload.documentY, left: res.data.payload.documentX })
                    //setReqScore(res.data.payload.reqScore)

                    if (res.data.payload.reqScore != 0) {
                        setIsSaved(true);

                        setReqScore(res.data.payload.reqScore * 100);
                    }


                    if (!res.data.payload.fileName == '') {
                        const resCert = await api.get(`/certificate/${res.data.payload.fileName}`);
                        localStorage.setItem('cetificate_data_image', JSON.stringify(resCert.data.image));
                        //console.log(resCert.data.image)

                        setImageCert(resCert.data.image);

                        setValidateCert(true);
                    }
                }

                setIslodingInfo(true);
                setToolView(true);
                setBackgroundSp(false);
                setLodingGrade(true);


            } catch (error) {
                console.log(error)
                setLodingGrade(true);
            }
        }
        validateCertificate();

    }, []);

    return (<>
        {isLodingInfo ? <div className={style.divContainer}>
            <div className={style.divContainerInfo}>
                <div className={style.divInfoCourse}>
                    <h4>{course.course.courseId}</h4>
                    <h3>{course.course.name}</h3>
                    <h4>Total de estudiantes: {course.students ? course.students.length : 0}</h4>
                </div>
                {validateCert ? <div className={style.divConfCourse}> 
                {/*<IconButton>
                    <InfoOutlined />
                </IconButton>*/}
  
                    <label style={{ margin: '0 5px' }}>Requisito de calificación: </label>
                    {isSaved ? ( // Si se guardó, mostrar solo el valor en un <span>
                        <span>{reqScore}</span>
                    ) : (
                        <input
                            className={style.inputPorcentual}
                            onChange={(e) => setReqScore(e.target.value)}
                            type="number"
                            min="0"
                            max="100"
                            step={5}
                            placeholder="0"
                            value={reqScore}
                        />
                    )}
                    <label>%</label>
                    {isSaved ? <></> : <IconButton
                        aria-label="save"
                        onClick={() => saveReqCal(reqScore)} // Al hacer clic, oculta el input y muestra el valor guardado
                    >
                        <SaveIcon />
                    </IconButton>}
                    <IconButton
                        id="editCali"
                        aria-label="edit"
                        onClick={(e) => { setIsSaved(false) }}>
                        <EditIcon />
                    </IconButton>
                </div> : <></>}

            </div>
            <div className={style.divConfCert}>
                {/* Botón de subida personalizado */}
                {validateCert ? (
                    <div>
                        <h3>Curso con certificado</h3>
                        <button onClick={() => setIsModalOpen(true)} className={style.uploadButton2}>
                            Plantilla del certificado
                        </button>
                    </div>
                ) : (
                    <>
                        <label htmlFor="file-input" className={style.uploadButton}>Seleccionar certificado</label>
                        <input id="file-input" type="file" accept="image/*" onChange={handleImageChange} className={style.hiddenInput} />
                    </>
                )}

                {/* Previsualización de imagen */}
                {image && (
                    <div className={style.imagePreviewContainer}>
                        <div className={style.imagePreview}>
                            <img src={image} alt="Preview" className={style.previewImg} />
                            <button onClick={handleCancel} className={style.cancelButton}>✕</button>
                        </div>
                        {loaderImgPre && (<div className={style.loaderOverlay}>
                            <div className={style.loader}></div>
                        </div>)}
                        <button onClick={handleUpload} className={style.uploadImage}>
                            Subir Imagen
                        </button>
                    </div>
                )}
                {/*imageCert && (<div className={style.imagePreview}>
                    <div className={style.imagePreview}>
                            <img src={imageCert}  alt="Preview" className={style.previewImg} />
                            <button onClick={handleDeleteCert} className={style.cancelButton}>✕</button>
                        </div>

                </div>)

                */}
                {isModalOpen && (
                    <div className={style.modalOverlay} >
                        <button className={style.closeButton} onClick={() => setIsModalOpen(false)}>
                            ✕
                        </button>
                        <div className={style.modalContent}
                        >
                            <Toolbar
                                fontSize={fontSize}
                                setFontSize={setFontSize}
                                fontFamily={fontFamily}
                                setFontFamily={setFontFamily}
                                color={color}
                                setColor={setColor}
                                isItalic={isItalic}
                                setIsItalic={setIsItalic}
                                setLodiangImage={setLodiangImage}
                                courseId={course.course.courseId}
                                setValidateCert={setValidateCert}
                                setImageCert={setImageCert}
                                setIsModalOpen={setIsModalOpen}
                                namePosition={namePosition}
                                idPosition={idPosition}
                                toolView={toolView}
                                setToolView={setToolView}
                                setBackgroundsp={setBackgroundSp}

                            />
                            <div className={style.imageContainer}
                                ref={containerRef}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}>
                                {lodingImage ? <><img src={imageCert} alt="Certificado" className={style.modalImage} />

                                    {/* Nombre arrastrable */}
                                    <span
                                        className={`draggableLabel ${draggingElement === "name" ? "dragging" : ""}`}
                                        onMouseDown={(e) => handleMouseDown(e, "name")}
                                        onTouchStart={(e) => handleTouchStart(e, "name")}
                                        style={{
                                            position: "absolute",
                                            top: `${namePosition.top}px`,
                                            left: `${namePosition.left}px`,
                                            fontSize: `${fontSize}px`,
                                            fontFamily: fontFamily,
                                            color: color,
                                            fontStyle: isItalic ? "italic" : "normal",
                                            background: backgroundSp ? 'transparent' : '#e9e5e5b9',
                                            border: draggingElement === "name" ? "2px solid rgb(17, 182, 211)" : "none",
                                            padding: "5px",
                                            cursor: "move",
                                        }}
                                    >
                                        {'<<Nombre>>'}
                                    </span>

                                    {/* Cédula arrastrable */}
                                    <span
                                        className={`draggableLabel ${draggingElement === "id" ? "dragging" : ""}`}
                                        onMouseDown={(e) => handleMouseDown(e, "id")}
                                        onTouchStart={(e) => handleTouchStart(e, "id")}
                                        style={{
                                            position: "absolute",
                                            top: `${idPosition.top}px`,
                                            left: `${idPosition.left}px`,
                                            fontSize: `${fontSize}px`,
                                            fontFamily: fontFamily,
                                            color: color,
                                            fontStyle: isItalic ? "italic" : "normal",
                                            border: draggingElement === "id" ? "2px solid #ff6600" : "none",
                                            padding: "5px",
                                            cursor: "move",
                                            background: backgroundSp ? 'transparent' : '#e9e5e5b9'
                                        }}
                                    >
                                        {'1000000000'}
                                    </span></> : <Loader ba={'transparent'} height={'530px'} color={'#156DF9'} load={2} />}
                            </div>
                            <DownloadButton />
                        </div>

                    </div>
                )}
            </div>
        </div> : <Loader background={'white'} height={'100vh'} color={"#1091F4"} load={1} />}
    </>);
}

export default InfoCourse;