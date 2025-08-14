// Configuración de fuentes disponibles para certificados
export const FontFamilies = {
  // Fuentes del sistema
  ARIAL: 'Arial',
  HELVETICA: 'Helvetica',
  VERDANA: 'Verdana',
  TIMES_NEW_ROMAN: 'Times New Roman',
  GEORGIA: 'Georgia',
  COURIER_NEW: 'Courier New',
  
  // Fuentes elegantes
  PLAYFAIR_DISPLAY: 'Playfair Display',
  MERRIWEATHER: 'Merriweather',
  LORA: 'Lora',
  CRIMSON_TEXT: 'Crimson Text',
  LIBRE_BASKERVILLE: 'Libre Baskerville',
  OLD_STANDARD_TT: 'Old Standard TT',
  
  // Fuentes modernas
  ROBOTO: 'Roboto',
  OPEN_SANS: 'Open Sans',
  LATO: 'Lato',
  MONTSERRAT: 'Montserrat',
  SOURCE_SANS_PRO: 'Source Sans Pro',
  NUNITO: 'Nunito',
  POPPINS: 'Poppins',
  
  // Fuentes decorativas
  DANCING_SCRIPT: 'Dancing Script',
  GREAT_VIBES: 'Great Vibes',
  PACIFICO: 'Pacifico',
  LOBSTER: 'Lobster',
  SACRAMENTO: 'Sacramento',
  ALLURA: 'Allura',
  
  // Fuentes formales
  CORMORANT_GARAMOND: 'Cormorant Garamond',
  EB_GARAMOND: 'EB Garamond',
  CINZEL: 'Cinzel',
  TRAJAN_PRO: 'Trajan Pro',
  OPTIMA: 'Optima',
  MINION_PRO: 'Minion Pro',
};

// Array de fuentes organizadas por categorías
export const FontCategories = [
  {
    label: 'Fuentes Clásicas',
    fonts: [
      { value: FontFamilies.ARIAL, label: 'Arial' },
      { value: FontFamilies.HELVETICA, label: 'Helvetica' },
      { value: FontFamilies.VERDANA, label: 'Verdana' },
      { value: FontFamilies.TIMES_NEW_ROMAN, label: 'Times New Roman' },
      { value: FontFamilies.GEORGIA, label: 'Georgia' },
      { value: FontFamilies.COURIER_NEW, label: 'Courier New' },
    ]
  },
  {
    label: 'Fuentes Elegantes',
    fonts: [
      { value: FontFamilies.PLAYFAIR_DISPLAY, label: 'Playfair Display' },
      { value: FontFamilies.MERRIWEATHER, label: 'Merriweather' },
      { value: FontFamilies.LORA, label: 'Lora' },
      { value: FontFamilies.CRIMSON_TEXT, label: 'Crimson Text' },
      { value: FontFamilies.LIBRE_BASKERVILLE, label: 'Libre Baskerville' },
      { value: FontFamilies.OLD_STANDARD_TT, label: 'Old Standard TT' },
    ]
  },
  {
    label: 'Fuentes Modernas',
    fonts: [
      { value: FontFamilies.ROBOTO, label: 'Roboto' },
      { value: FontFamilies.OPEN_SANS, label: 'Open Sans' },
      { value: FontFamilies.LATO, label: 'Lato' },
      { value: FontFamilies.MONTSERRAT, label: 'Montserrat' },
      { value: FontFamilies.SOURCE_SANS_PRO, label: 'Source Sans Pro' },
      { value: FontFamilies.NUNITO, label: 'Nunito' },
      { value: FontFamilies.POPPINS, label: 'Poppins' },
    ]
  },
  {
    label: 'Fuentes Decorativas',
    fonts: [
      { value: FontFamilies.DANCING_SCRIPT, label: 'Dancing Script' },
      { value: FontFamilies.GREAT_VIBES, label: 'Great Vibes' },
      { value: FontFamilies.PACIFICO, label: 'Pacifico' },
      { value: FontFamilies.LOBSTER, label: 'Lobster' },
      { value: FontFamilies.SACRAMENTO, label: 'Sacramento' },
      { value: FontFamilies.ALLURA, label: 'Allura' },
    ]
  },
  {
    label: 'Fuentes Formales',
    fonts: [
      { value: FontFamilies.CORMORANT_GARAMOND, label: 'Cormorant Garamond' },
      { value: FontFamilies.EB_GARAMOND, label: 'EB Garamond' },
      { value: FontFamilies.CINZEL, label: 'Cinzel' },
      { value: FontFamilies.TRAJAN_PRO, label: 'Trajan Pro' },
      { value: FontFamilies.OPTIMA, label: 'Optima' },
      { value: FontFamilies.MINION_PRO, label: 'Minion Pro' },
    ]
  }
];

// Función helper para validar si una fuente existe
export const isFontAvailable = (fontFamily) => {
  return Object.values(FontFamilies).includes(fontFamily);
};

// Función para obtener fuente por defecto
export const getDefaultFont = () => FontFamilies.ARIAL;

// Función para obtener todas las fuentes en un array plano
export const getAllFonts = () => {
  return FontCategories.reduce((acc, category) => {
    return acc.concat(category.fonts);
  }, []);
};

export default FontFamilies;
