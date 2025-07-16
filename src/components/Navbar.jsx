import * as React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import { LibraryBooks as LibraryBooksIcon, ContactMail as ContactMailIcon, Logout as LogoutIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import logoColor from '../assets/avafpLogoColor.png';
import style from '../modulesCss/NavBar.module.css';


const drawerWidth = 240;
const navItemsData = [
  { label: 'Cursos', path: '/home', icon: <LibraryBooksIcon sx={{ position: "absolute", left: 20, color: 'whitesmoke' }} /> },
  { label: 'Salir', path: '/', icon: <LogoutIcon sx={{ position: "absolute", left: 20, color: 'whitesmoke' }} /> },
];

function NavBar({ window }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const container = window !== undefined ? () => window().document.body : undefined;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <img className={style.imgMobile} src={logoColor} alt="Logo" />
      <Divider />
      <List>
        {navItemsData.map(({ label, path, icon }) => (
          <ListItem key={label} disablePadding sx={{ height: "40px" }}>
            <ListItemButton
              className={style.listBttn}
              sx={{
                justifyContent: "center",
                width: "100%",
                height: "auto",
                padding: "10px 0",
                display: "flex",
                alignItems: "center"
                
              }}
              onClick={() => { label === "Salir" ? (localStorage.clear(), navigate(path)) :
                ( localStorage.removeItem('cetificate_data'), localStorage.removeItem('cetificate_data_image'),localStorage.removeItem('course_data'), navigate(path)); }} 
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", justifyContent: "center" }}>
                {icon}
                <ListItemText primary={label} sx={{ textAlign: "center", fontSize: "15px" }} />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>;
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', background: '#fff', zIndex: 10 }}>
      <CssBaseline />
      <AppBar component="nav" className={style.container} sx={{ background: '#0045ad', color: '#fff' }}>
        <Toolbar sx={{ padding: 0, width: '100%', borderBottom: '1px solid black' }}>
          <img className={style.imgNav} src={logo} alt="Logo" />
          <div className={style.divSeparated} />
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'center', paddingTop: '20px', width: '100%' }}>
          {navItemsData.map(({ label, path, icon }) => (
            <button
              key={label}
              className={style.bttn}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 0' }}
              onClick={() => { label === "Salir" ? (localStorage.clear(), navigate(path)) :
                 (localStorage.removeItem('cetificate_data'), localStorage.removeItem('cetificate_data_image'),localStorage.removeItem('course_data'), navigate(path)); }}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </Box>
      </AppBar>
      <nav>
        <Drawer container={container} variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

NavBar.propTypes = {
  window: PropTypes.func,
};

export default NavBar;