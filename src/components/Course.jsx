import NavBar from "./Navbar";
import style from '../modulesCss/Course.module.css';
import InfoCourse from "./InfoCourse";
import Gradebook from "./Gradebook";

import { useState } from "react";

const Course = () => {
    const [fontSize, setFontSize] = useState(20);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [color, setColor] = useState("#000000");
    const [isItalic, setIsItalic] = useState(false)
    const [namePosition, setNamePosition] = useState({ top: 200, left: 100 });
    const [idPosition, setIdPosition] = useState({ top: 250, left: 100 });
    const [imageCert, setImageCert] = useState(null);
    const [reqScore , setReqScore] = useState(null);
    const [lodignGrade, setLodingGrade] = useState(false);

    return (
        <>
            <NavBar />
            <div className={style.divContainer}>
                <InfoCourse fontSize={fontSize}
                    setFontSize={setFontSize}
                    fontFamily={fontFamily} setFontFamily={setFontFamily}
                    color={color} setColor={setColor}
                    isItalic={isItalic} setIsItalic={setIsItalic}
                    namePosition={namePosition} setNamePosition={setNamePosition}
                    idPosition={idPosition} setIdPosition={setIdPosition}
                    imageCert= {imageCert} setImageCert = {setImageCert}
                    reqScore={reqScore}  setReqScore ={setReqScore}
                    setLodingGrade = {setLodingGrade}
                 />
                {lodignGrade?<Gradebook fontSize={fontSize}
                    fontFamily={fontFamily}
                    color={color}
                    isItalic={isItalic}
                    namePosition={namePosition}
                    idPosition={idPosition} 
                    imageCert= {imageCert}
                    reqScore={reqScore}
                   />:<></>}
            </div>
        </>
    );
}

export default Course;