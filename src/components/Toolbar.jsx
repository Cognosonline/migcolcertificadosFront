import { IconButton } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import style from "../modulesCss/InfoCourse.module.css";
import { useEffect, useState } from "react";
import api from "../../axiosConfig";

const Toolbar = ({ 
  // Elemento seleccionado y sus propiedades
  selectedElement,
  setSelectedElement,
  currentProperties,
  updateCurrentProperty,
  
  // Propiedades individuales
  nameProperties,
  idProperties,
  courseNameProperties,
  createdAtProperties,
  
  // Posiciones
  namePosition,
  idPosition,
  courseNamePosition,
  createdAtPosition,
  
  // Props existentes que no cambian
  setLodiangImage,
  courseId,
  setImageCert,
  setValidateCert,
  setIsModalOpen,
  toolView,
  setToolView,
  setBackgroundSp
}) => {

  //const [toolView, setToolView] = useState(true);

  const handleDeleteCert = async () => {
    try {
      const res = await api.delete('/certificate',
        {
          data: { courseId: courseId }
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

      if (res.status == 200) {
        setValidateCert(false);
        setImageCert(null);
        setLodiangImage(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSaveCert = async () => {
    try {
      // Crear objeto completo con todas las propiedades nuevas

      const completeData = {
        courseId: courseId,
        nameX: namePosition.left,
        nameY: namePosition.top,
        documentX: idPosition.left,
        documentY: idPosition.top,
        courseNameX: courseNamePosition.left,
        courseNameY: courseNamePosition.top,
        createdAtX: createdAtPosition.left,
        createdAtY: createdAtPosition.top,

        // Propiedades individuales para cada elemento

        // Nombre
        nameFontSize: nameProperties.fontSize,
        nameFontFamily: nameProperties.fontFamily,
        nameColor: nameProperties.color,
        nameItalic: nameProperties.isItalic,
        nameBold: nameProperties.isBold,

        // Documento
        documentFontSize: idProperties.fontSize,
        documentFontFamily: idProperties.fontFamily,
        documentColor: idProperties.color,
        documentItalic: idProperties.isItalic,
        documentBold: idProperties.isBold,

        // Firma
        courseNameFontSize: courseNameProperties.fontSize,
        courseNameFontFamily: courseNameProperties.fontFamily,
        courseNameColor: courseNameProperties.color,
        courseNameItalic: courseNameProperties.isItalic,
        courseNameBold: courseNameProperties.isBold,

        // Fecha
        createdAtFontSize: createdAtProperties.fontSize,
        createdAtFontFamily: createdAtProperties.fontFamily,
        createdAtColor: createdAtProperties.color,
        createdAtItalic: createdAtProperties.isItalic,
        createdAtBold: createdAtProperties.isBold,

        // Mantener compatibilidad con propiedades globales

        fontsize: currentProperties.fontSize,
        fontFamily: currentProperties.fontFamily,
        color: currentProperties.color,
        italic: currentProperties.isItalic
      };

      const res = await api.post(`/coords`, completeData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Combinar respuesta del backend con nuestros datos nuevos para persistencia local
      const enhancedResponse = {
        ...res.data,
        payload: {
          ...res.data.payload,
          ...completeData // Agregar nuestros datos nuevos al payload
        }
      };

      localStorage.setItem('cetificate_data', JSON.stringify(enhancedResponse));
      console.log('Datos guardados (con propiedades individuales):', enhancedResponse);

      setLodiangImage(true)
    } catch (error) {
      console.log('error al actualizar propiedades del certificado', error);
    }
  }

  useEffect(() => {
    if (toolView == false) {
      document.getElementById('toolbar').style.background = 'transparent'
    }
  }, [])

  return (
    <div id="toolbar" className={style.toolbar}>

      {toolView ? <>
        <label className={style.toolbarLabel}>Elemento:</label>
        <select value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)} className={style.toolbarSelect}>
          <option value="name">Nombre</option>
          <option value="id">Cédula</option>
          <option value="courseName">Firma</option>
          <option value="createdAt">Fecha</option>
        </select>

        <label className={style.toolbarLabel}>Tamaño:</label>
        <input
          type="number"
          min="10"
          max="50"
          value={currentProperties.fontSize}
          onChange={(e) => updateCurrentProperty('fontSize', parseInt(e.target.value))}
          className={style.toolbarInput}
        />

        <label className={style.toolbarLabel}>Fuente:</label>
        <select value={currentProperties.fontFamily} onChange={(e) => updateCurrentProperty('fontFamily', e.target.value)} className={style.toolbarSelect}>
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        <label className={style.toolbarLabel}>Cursiva:</label>
        <input
          type="checkbox"
          checked={currentProperties.isItalic}
          onChange={(e) => updateCurrentProperty('isItalic', e.target.checked)}
          className={style.toolbarCheckbox}
        />

        <label className={style.toolbarLabel}>Color:</label>
        <input
          type="color"
          value={currentProperties.color}
          onChange={(e) => updateCurrentProperty('color', e.target.value)}
          className={style.toolbarColorPicker}
        /></> :
        <IconButton
          sx={{
            position: 'absolute',
            right: 0,
            background: 'gray'
          }}
          aria-label="save"
          onClick={() => {
            document.getElementById('toolbar').style.background = 'whitesmoke'
            setToolView(true)
            setBackgroundSp(false)

            setLodiangImage(true);
          }} // Al hacer clic, oculta el input y muestra el valor guardado
        >
          <EditIcon fontSize="large" sx={{ color: 'white' }} />
        </IconButton>}
      {toolView ?
        <div className={style.divSavedCert}>
          <IconButton
            aria-label="delete"
            onClick={() => {
              handleDeleteCert();
              setLodiangImage(false);
            }} // Al hacer clic, oculta el input y muestra el valor guardado
          >
            <DeleteForeverIcon fontSize="large" color="error" />
          </IconButton>
          <IconButton
            aria-label="save"
            onClick={() => {
              document.getElementById('toolbar').style.background = 'transparent'
              setToolView(false);

              setLodiangImage(false);
              
              handleSaveCert();
            }} // Al hacer clic, oculta el input y muestra el valor guardado
          >
            <SaveIcon fontSize="large" color="primary" />
          </IconButton>
        </div> :
        <></>
      }
    </div>
  );
};


export default Toolbar;

/**          <IconButton
            sx={{
              position: 'absolute',
              right: 0
            }}
            aria-label="save"
            onClick={() => {
              document.getElementById('toolbar').style.background = 'transparent'
              setToolView(false);
              setLodiangImage(false);
            }} // Al hacer clic, oculta el input y muestra el valor guardado
          >
            <DeleteForeverIcon fontSize="large" color="warning" />
          </IconButton>
          <IconButton
            sx={{
              position: 'absolute',
              right: 0
            }}
            aria-label="save"
            onClick={() => {
              document.getElementById('toolbar').style.background = 'transparent'
              setToolView(false);
              setLodiangImage(false);
            }} // Al hacer clic, oculta el input y muestra el valor guardado
          >
            <SaveIcon fontSize="large" color="primary" />
          </IconButton> */