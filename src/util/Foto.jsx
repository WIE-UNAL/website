import { getDefaultProyect } from "../ctrl/StorageCtrl";
import React, { useState, useEffect } from "react";

export const FotoProyecto = ({ proyecto }) => {
  const [src, setSrc] = useState(proyecto.foto); 
  const [defaultImg, setDefaultImg] = useState("");

  useEffect(() => {
    const fetchDefaultImage = async () => {
      const defaultUrl = getDefaultProyect(); 
      setDefaultImg(defaultUrl);
    };
    fetchDefaultImage();
  }, []);

  return (
    <img
      src={src} 
      alt={`Imagen proyecto ${proyecto.nombre}`}
      onError={() => setSrc(defaultImg)} 
      style={{ width: "100%", height: "auto" }} 
    />
  );
};
