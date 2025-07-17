import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadForm = () => {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !artist || !title) return;

    const storageRef = ref(storage, `songs/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "songs"), {
      artist,
      title,
      url,
      createdAt: new Date()
    });

    setArtist("");
    setTitle("");
    setFile(null);
    alert("Música enviada com sucesso!");
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="text"
        placeholder="Artista"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <input
        type="text"
        placeholder="Título da música"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default UploadForm;
