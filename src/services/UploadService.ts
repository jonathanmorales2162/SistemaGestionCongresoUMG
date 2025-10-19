/**
 * Servicio de subida de imágenes a Cloudinary
 * Proyecto Congreso Tecnológico
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export const uploadImageCloudinary = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  // Validar que las variables de entorno estén configuradas
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    const error = "Variables de entorno de Cloudinary no configuradas correctamente";
    console.error(error);
    return { success: false, error };
  }

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", UPLOAD_PRESET);
  data.append("cloud_name", CLOUD_NAME);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (!result.secure_url) {
      console.error("Error al subir la imagen:", result);
      return { success: false, error: "No se obtuvo una URL válida desde Cloudinary." };
    }

    return { success: true, url: result.secure_url };
  } catch (error: any) {
    console.error("Error de conexión al subir imagen:", error.message);
    return { success: false, error: error.message };
  }
};