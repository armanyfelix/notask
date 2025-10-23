import { AccountState, useAccountStore } from "../utils/zustand";
import SunCloudIcon from "../assets/weather/sunCloud.svg?react";
import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import {
  BaseDirectory,
  writeTextFile,
  readTextFile,
  remove,
  readDir,
  mkdir,
} from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";

export default function Home({}: any) {
  const user = useAccountStore((s: AccountState) => s.account);

  const [fileName, setFileName] = useState("mi-archivo.txt");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [fileList, setFileList] = useState([]);

  // CREATE - Crear nuevo archivo
  const createFile = async () => {
    try {
      // Crear directorio si no existe
      await mkdir("notask", {
        baseDir: BaseDirectory.Document,
        recursive: true,
      });

      await writeTextFile(fileName, content || "Contenido inicial", {
        baseDir: BaseDirectory.Document,
      });
      setMessage(`Archivo "${fileName}" creado exitosamente`);
      listFiles(); // Actualizar lista
    } catch (error) {
      setMessage(`Error al crear archivo: ${error}`);
    }
  };

  // READ - Leer archivo existente
  const readFile = async (filename = fileName) => {
    try {
      const fileContent = await readTextFile(filename, {
        baseDir: BaseDirectory.Document,
      });
      setContent(fileContent);
      setMessage(`Archivo "${filename}" leído exitosamente`);
    } catch (error) {
      setMessage(`Error al leer archivo: ${error}`);
    }
  };

  // UPDATE - Actualizar archivo
  const updateFile = async () => {
    try {
      await writeTextFile(fileName, content, {
        baseDir: BaseDirectory.Document,
      });
      setMessage(`Archivo "${fileName}" actualizado exitosamente`);
    } catch (error) {
      setMessage(`Error al actualizar archivo: ${error}`);
    }
  };

  // DELETE - Eliminar archivo
  const deleteFile = async (filename = fileName) => {
    try {
      await remove(filename, {
        baseDir: BaseDirectory.Document,
      });
      setMessage(`Archivo "${filename}" eliminado exitosamente`);
      setContent("");
      listFiles(); // Actualizar lista
    } catch (error) {
      setMessage(`Error al eliminar archivo: ${error}`);
    }
  };

  // Listar archivos en el directorio de la app
  const listFiles = async () => {
    try {
      const entries = await readDir("", { baseDir: BaseDirectory.Document });
      const files: any = entries
        .filter((entry: any) => !entry.children) // Solo archivos, no directorios
        .map((entry: any) => entry.name);
      setFileList(files);
    } catch (error) {
      console.error("Error al listar archivos:", error);
    }
  };

  // Obtener ruta del directorio de la app
  const getAppDir = async () => {
    try {
      const dir = await appDataDir();
      console.log("Directorio de la app:", dir);
    } catch (error) {
      console.error("Error al obtener directorio:", error);
    }
  };

  // Cargar lista de archivos al montar el componente
  useEffect(() => {
    listFiles();
    getAppDir();
  }, []);

  return (
    <div className="h-screen overflow-auto rounded-xl m-1 bg-linear-to-tr from-primary/20 to-secondary/20">
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center">
          <SunCloudIcon className="h-14 w-14" />
          <h1 className="ml-8 text-4xl font-extrabold">
            Good afternoon, {user?.name}
          </h1>
        </div>
        <div>
          <Button className="btn btn-primary">Create</Button>
        </div>
      </header>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1>CRUD de Archivos de Texto con Tauri</h1>

        {/* Selector de archivos */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Archivos disponibles:</h3>
          <select
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          >
            <option value="">Nuevo archivo...</option>
            {fileList.map((file) => (
              <option key={file} value={file}>
                {file}
              </option>
            ))}
          </select>
          <button onClick={listFiles} style={{ marginLeft: "10px" }}>
            Actualizar lista
          </button>
        </div>

        {/* Nombre del archivo */}
        <div style={{ marginBottom: "20px" }}>
          <label>
            Nombre del archivo:
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="ejemplo.txt"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
          </label>
        </div>

        {/* Editor de contenido */}
        <div style={{ marginBottom: "20px" }}>
          <label>
            Contenido:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe el contenido aquí..."
              rows={10}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                fontFamily: "monospace",
              }}
            />
          </label>
        </div>

        {/* Botones de acciones */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={createFile}
            style={{
              padding: "10px 15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Crear
          </button>

          <button
            onClick={() => readFile()}
            style={{
              padding: "10px 15px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Leer
          </button>

          <button
            onClick={updateFile}
            style={{
              padding: "10px 15px",
              backgroundColor: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Actualizar
          </button>

          <button
            onClick={() => deleteFile()}
            style={{
              padding: "10px 15px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Eliminar
          </button>
        </div>

        {/* Botones para archivos específicos */}
        <div style={{ marginBottom: "20px" }}>
          <h4>Acciones rápidas:</h4>
          {fileList.map((file) => (
            <div key={file} style={{ marginBottom: "5px" }}>
              <span style={{ marginRight: "10px" }}>{file}</span>
              <button
                onClick={() => {
                  setFileName(file);
                  readFile(file);
                }}
                style={{
                  padding: "5px 10px",
                  marginRight: "5px",
                  fontSize: "12px",
                }}
              >
                Abrir
              </button>
              <button
                onClick={() => deleteFile(file)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#f44336",
                  color: "white",
                  fontSize: "12px",
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        {/* Mensajes */}
        {message && (
          <div
            style={{
              padding: "10px",
              color: "#000",
              backgroundColor: message.includes("Error")
                ? "#ffebee"
                : "#e8f5e8",
              border: `1px solid ${message.includes("Error") ? "#f44336" : "#4CAF50"}`,
              borderRadius: "4px",
              marginTop: "20px",
            }}
          >
            {message}
          </div>
        )}

        {/* Información */}
        <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
          <p>Los archivos se guardan en el directorio de la aplicación.</p>
          <p>
            Puedes crear nuevos archivos escribiendo un nombre y haciendo click
            en "Crear".
          </p>
        </div>
      </div>
      {/* <div className='grid grid-cols-3 gap-6 px-6'>
        <Agenda today={today} events={events} />
        <Notifications />
        <Recent />
        <ToDos />
      </div> */}
      {/* <div className="bg-base-20 mt-40 p-10">footer</div> */}
    </div>
  );
}
