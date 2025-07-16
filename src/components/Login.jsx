import logo from '../assets/logo.png';
import style from '../modulesCss/Login.module.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = (e) =>{
        e.preventDefault();
        navigate('/blackboardLogin');
    }

    return (
      <div className={style.loginContainer}>
        <div className={style.loginBox}>
          <img src={logo} alt="Logo" className={style.loginLogo} />
          <button className={style.loginButton} onClick={handleLogin}>
            INGRESA CON TU CUENTA INSTITUCIONAL
          </button>
        </div>
      </div>
    );
  }
  