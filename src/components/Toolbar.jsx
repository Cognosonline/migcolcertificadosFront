import { IconButton } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import style from "../modulesCss/InfoCourse.module.css";
import { useEffect, useState } from "react";
import api from "../../axiosConfig";

const Toolbar = ({ fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  color,
  setColor,
  isItalic,
  setIsItalic,
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
          fontsize: fontSize,
          fontFamily: fontFamily,
          color: color,
          italic: isItalic
        }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'

        }
      });

      localStorage.setItem('cetificate_data', JSON.stringify(res.data));

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

      {toolView ? <><label className={style.toolbarLabel}>Tamaño:</label>
        <input
          type="number"
          min="10"
          max="50"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className={style.toolbarInput}
        />

        <label className={style.toolbarLabel}>Fuente:</label>
        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className={style.toolbarSelect}>
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        <label className={style.toolbarLabel}>Cursiva:</label>
        <input
          type="checkbox"
          checked={isItalic}
          onChange={(e) => setIsItalic(e.target.checked)}
          className={style.toolbarCheckbox}
        />

        <label className={style.toolbarLabel}>Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
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