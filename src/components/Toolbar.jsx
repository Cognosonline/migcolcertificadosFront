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
  
  // Propiedades individuales para guardar ambas
  nameProperties,
  idProperties,
  
  // Props existentes que no cambian
  setLodiangImage,
  courseId,
  setImageCert,
  setValidateCert,
  setIsModalOpen,
  namePosition,
  idPosition,
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
      const res = await api.post(`/coords`,
        {
          courseId: courseId,
          nameX: namePosition.left,
          nameY: namePosition.top,
          documentX: idPosition.left,
          documentY: idPosition.top,
          fontsize: currentProperties.fontSize,
          fontFamily: currentProperties.fontFamily,
          color: currentProperties.color,
          italic: currentProperties.isItalic,
          bold: currentProperties.isBold || false
        }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'

        }
      });

      // Crear un objeto con propiedades individuales para localStorage
      const certificateDataWithIndividualProps = {
        ...res.data,
        payload: {
          ...res.data.payload,
          nameProperties: nameProperties,
          idProperties: idProperties
        }
      };

      localStorage.setItem('cetificate_data', JSON.stringify(certificateDataWithIndividualProps));

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
        {/* Grupo 1: Selección de elemento */}
        <div className={style.toolbarGroup}>
          <label className={style.toolbarLabel}>Elemento:</label>
          <select value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)} className={style.toolbarSelect}>
            <option value="name">Nombre</option>
            <option value="id">Cédula</option>
          </select>
        </div>

        {/* Grupo 2: Tamaño de fuente */}
        <div className={style.toolbarGroup}>
          <label className={style.toolbarLabel}>Tamaño:</label>
          <input
            type="number"
            min="8"
            max="72"
            value={currentProperties.fontSize}
            onChange={(e) => updateCurrentProperty('fontSize', parseInt(e.target.value))}
            className={style.toolbarInput}
          />
        </div>

        {/* Grupo 3: Familia de fuente */}
        <div className={style.toolbarGroup}>
          <label className={style.toolbarLabel}>Fuente:</label>
          <select value={currentProperties.fontFamily} onChange={(e) => updateCurrentProperty('fontFamily', e.target.value)} className={style.toolbarSelect}>
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Courier New">Courier New</option>
            <option value="Impact">Impact</option>
          </select>
        </div>

        {/* Grupo 4: Estilos de texto */}
        <div className={style.toolbarGroup}>
          <label className={style.toolbarLabel}>Negrita:</label>
          <input
            type="checkbox"
            checked={currentProperties.isBold || false}
            onChange={(e) => updateCurrentProperty('isBold', e.target.checked)}
            className={style.toolbarCheckbox}
          />
          
          <label className={style.toolbarLabel}>Cursiva:</label>
          <input
            type="checkbox"
            checked={currentProperties.isItalic}
            onChange={(e) => updateCurrentProperty('isItalic', e.target.checked)}
            className={style.toolbarCheckbox}
          />
        </div>

        {/* Grupo 5: Color */}
        <div className={style.toolbarGroup}>
          <label className={style.toolbarLabel}>Color:</label>
          <input
            type="color"
            value={currentProperties.color}
            onChange={(e) => updateCurrentProperty('color', e.target.value)}
            className={style.toolbarColorPicker}
          />
        </div>

        {/* Grupo 6: Botones de acción */}
        <div className={style.toolbarActions}>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => {
              handleDeleteCert();
              setLodiangImage(false);
            }}
          >
            <DeleteForeverIcon fontSize="medium" color="error" />
          </IconButton>
          <IconButton
            aria-label="save"
            size="small"
            onClick={() => {
              document.getElementById('toolbar').style.background = 'transparent'
              setToolView(false);
              setLodiangImage(false);
              handleSaveCert();
            }}
          >
            <SaveIcon fontSize="medium" color="primary" />
          </IconButton>
        </div></> :
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
          }}
        >
          <EditIcon fontSize="large" sx={{ color: 'white' }} />
        </IconButton>}
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