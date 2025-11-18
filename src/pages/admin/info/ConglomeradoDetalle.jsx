import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { Upload, FileUp, FileText, X } from "lucide-react";

const ConglomeradoDetalle = () => {
    const { idconglomerado } = useParams();
    const navigate = useNavigate();
    const [conglomerado, setConglomerado] = useState(null);
    const [alerta, setAlerta] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [informes, setInformes] = useState([]);
    let [nuevoComentario, setNuevoComentario] = useState("");
    const [editandoId, setEditandoId] = useState(null);
    const [textoEdicion, setTextoEdicion] = useState("");
    const [showModalComentario, setShowModalComentario] = useState(false);
    const [showModalInforme, setShowModalInforme] = useState(false);
    const [nuevoInforme, setNuevoInforme] = useState({
        titulo: "",
        archivo: null
    });
    const [imagenComentario, setImagenComentario] = useState(null)
    const user = useAuth();

    useEffect(() => {
        fetchComentarios();
  }, [idconglomerado]);

    useEffect(() => {
        const fetchConglomerado = async () => {
            const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

            const res = await fetch(`${API_URL}/api/conglomerados/${idconglomerado}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            const data = await res.json();
            setConglomerado(data);
        };

        fetchConglomerado();

        setInformes([
            {
                id: 1,
                titulo: "Informe Mensual Octubre 2025",
                nombre_autor: "María González",
                fecha: new Date().toISOString()
            },
            {
                id: 2,
                titulo: "Análisis de Biodiversidad Q3",
                nombre_autor: "Juan Pérez",
                fecha: new Date().toISOString()
            },
            {
                id: 3,
                titulo: "Reporte Anual 2024",
                nombre_autor: "Ana Martínez",
                fecha: new Date().toISOString()
            }
        ]);
    }, [idconglomerado]);

    // Manejador de cambios de archivo
    const handleFileChangeFotoPerfil = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) setImagenComentario(file);
        else {
            console.error("El archivo excede el tamaño máximo permitido de 5MB.");
            setImagenComentario(null);
        }
    };
    const fetchComentarios = async () => {

        const res = await fetch(`https://fast-api-brigada.vercel.app/comentarios/${idconglomerado}`, {
            headers: { Authorization: `Bearer ${user.token}` },
        });

        const data = await res.json();
        setComentarios(data.data);
    };

    // Remover archivo 
    const handleRemoveFileFotoPerfil = () => {
        setImagenComentario(null);
    };

    const FileUpload = ({ 
        file, 
        handleFileChange, 
        handleRemoveFile, 
        id, 
        label, 
        accept, 
        maxSizeMB = 5 
    }) => {
        return (
            <div className="flex flex-col">
                <label className="mb-2 font-semibold text-slate-700 flex items-center">
                    <Upload size={20} className="mr-2 text-success" /> {label} (máx {maxSizeMB}MB)
                </label>
                
                {!file ? (
                    <div
                        className="border-2 border-dashed border-slate-300 p-6 text-center bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition duration-150"
                        onClick={() => document.getElementById(id).click()}
                    >

                    <input
                        type="file"
                        id={id}
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <FileUp size={40} className="text-indigo-600 mx-auto mb-2" />

                    <p className="font-medium text-slate-700">Haz clic para adjuntar archivo</p>

                    <small className="text-slate-500">{accept.split(',').join(', ')}</small>
                    </div>

                ) : (
                    <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <FileText size={24} className="text-indigo-600" />
                            <div>
                            <p className="mb-0 font-semibold text-slate-800">{file.name}</p>
                            <small className="text-slate-600">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            onClick={handleRemoveFile}
                            className="p-1 rounded-full text-red-600 hover:bg-red-100 transition"
                            aria-label="Eliminar archivo"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>
        );
    };


    const handleAgregarComentario = async () => {
        const contenido = nuevoComentario.trim();
        if (contenido === "") return alert("El comentario no puede estar vacío");
        else if (contenido.length < 15) return alert("El comentario no tener menos de 15 caracteres.");

        try {
            const formData = new FormData();

            formData.append("usuario_id", user.usuario.id)
            formData.append("usuario_cedula", user.usuario.cedula)
            formData.append("conglomeradoId", idconglomerado)
            formData.append("contenido", contenido)

            if (imagenComentario) formData.append('imagen', imagenComentario); 
            

            const response = await fetch(`https://fast-api-brigada.vercel.app/generar-comentario`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                body: formData
            });

            if (response.ok) {
                fetchComentarios();
                setAlerta(true);
                setNuevoComentario("");
                setShowModalComentario(false);
                setImagenComentario(null)
                
                setTimeout(() => setAlerta(false), 3000);0
            } else {
                alert("Error al generar el comentario");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión");
        }
    };

    const handleAgregarInforme = () => {
        if (nuevoInforme.titulo.trim() === "") {
            alert("El título del informe no puede estar vacío");
            return;
        }
        if (!nuevoInforme.archivo) {
            alert("Debes seleccionar un archivo PDF");
            return;
        }

        const informeNuevo = {
            id: Date.now(),
            titulo: nuevoInforme.titulo,
            nombre_autor: user.usuario.nombre_completo || "Usuario Actual",
            fecha: new Date().toISOString()
        };

        setInformes([...informes, informeNuevo]);
        setNuevoInforme({ titulo: "", archivo: null });
        setShowModalInforme(false);
        alert("¡Informe agregado con éxito!");
    };

    const handleIniciarEdicion = (comentario) => {
        setEditandoId(comentario.id);
        setTextoEdicion(comentario.contenido);
    };

    const handleGuardarEdicion = (id) => {
        if (textoEdicion.trim() === "") {
            alert("El comentario no puede estar vacío");
            return;
        }

        setComentarios(
            comentarios.map((com) =>
                com.id === id ? { ...com, contenido: textoEdicion } : com
            )
        );
        setEditandoId(null);
        setTextoEdicion("");
    };

    const handleCancelarEdicion = () => {
        setEditandoId(null);
        setTextoEdicion("");
    };

    const handleEliminarComentario = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este comentario?")) {
            try {
                const res = await fetch(`https://fast-api-brigada.vercel.app/comentario/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                const data = await res.json();

                if (data.ok) setComentarios(comentarios.filter((com) => com.id !== id));
            } catch (err) {
                console.log(err)
            }
        }
    };

    const handleDescargarInforme = (informe) => {
        console.log("Descargando informe:", informe.titulo);
        alert(`Descargando: ${informe.titulo}`);
    };

    const handleEliminarInforme = (id) => {
        if (window.confirm("¿Estás seguro de eliminar este informe?")) {
            setInformes(informes.filter((inf) => inf.id !== id));
        }
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (!conglomerado) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-emerald-700 font-medium">Cargando información...</p>
            </div>
        </div>
    );

    return (
        <div className="lista-brigadas">

            <h1>Conglomerado 🌳</h1>
            <p>Aquí puedes ver toda la información acerca de este conglomerado.</p>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Alerta de éxito */}
                {alerta && (
                    <div className="mb-6 animate-fade-in">
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-4 shadow-md">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-emerald-800 font-medium">¡Comentario añadido con éxito!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Crear brigada */}
                <div className="mb-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">

                    {
                        true ? (
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-center md:text-left">
                                    <h3 className="text-xl font-bold mb-2">¿Listo para crear una nueva brigada?</h3>
                                    <p className="text-emerald-50">Gestiona tus brigadas directamente desde este conglomerado</p>
                                </div>

                                <button
                                    onClick={() => navigate(`/admin/brigadas/crear-nueva`, { state: { conglomerado: idconglomerado } })}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl font-bold whitespace-nowrap"
                                >
                                    Crear Nueva Brigada
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-xl font-bold mb-2">¿Listo para crear una nueva brigada?</h3>
                                    <p className="text-emerald-50">Gestiona tus brigadas directamente desde este conglomerado</p>
                                </div>
                            </div>
                        )
                    }

                </div>

                {/* Información del conglomerado */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-3xl">🌳</span>
                                {conglomerado.data.nombre}
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-emerald-700 mb-1">Ubicación</p>
                                            <p className="text-gray-700">{conglomerado.data.ubicacion}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-emerald-700 mb-1">Región</p>
                                            <p className="text-gray-700">{conglomerado.data.region}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-emerald-700 mb-1">Descripción</p>
                                            <p className="text-gray-700">{conglomerado.data.descripcion}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-emerald-700 mb-1">Fecha de Creación</p>
                                            <p className="text-gray-700">{conglomerado.data.fecha_creacion}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de Comentarios */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <span className="text-2xl">💬</span>
                                    Comentarios ({comentarios.length})
                                </h3>
                                <button
                                    onClick={() => setShowModalComentario(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Agregar
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {comentarios.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                                        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg font-medium">No hay comentarios aún</p>
                                    <p className="text-gray-400 mt-2">¡Sé el primero en comentar!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {comentarios.map((comentario) => (
                                        <div key={comentario.id} className="bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-emerald-100 overflow-hidden">
                                            <div className="p-5">
                                                {editandoId === comentario.id ? (
                                                    <div className="space-y-4">
                                                        <textarea
                                                            className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                                            rows="4"
                                                            value={textoEdicion}
                                                            onChange={(e) => setTextoEdicion(e.target.value)}
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleGuardarEdicion(comentario.id)}
                                                                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                                            >
                                                                💾 Guardar
                                                            </button>
                                                            <button
                                                                onClick={handleCancelarEdicion}
                                                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                                                            >
                                                                ✖ Cancelar
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="text-gray-700 mb-4 leading-relaxed min-h-[80px]">
                                                            {comentario.contenido}
                                                        </p>
                                                        
                                                        <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-emerald-100">
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                </svg>
                                                                {comentario.usuario_id}
                                                            </span>

                                                            <br />

                                                            {comentario.imagen_url ? (
                                                                <a
                                                                    href={comentario.imagen_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block w-full mb-4 px-3 py-2 text-center text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
                                                                >
                                                                    Ver Imagen
                                                                </a>
                                                            ) : (
                                                                <div className="block w-full mb-4 px-3 py-2 text-center text-xs font-medium text-red-600 bg-red-50 rounded-lg">
                                                                    Sin Imagen
                                                                </div>
                                                            )}


                                                            <br />

                                                            <span className="text-xs text-gray-500">
                                                                📅 {formatearFecha(comentario.fecha_creacion)}
                                                            </span>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleIniciarEdicion(comentario)}
                                                                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                                            >
                                                                ✏️ Editar
                                                            </button>
                                                            <button
                                                                onClick={() => handleEliminarComentario(comentario.id)}
                                                                className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                                            >
                                                                🗑️ Eliminar
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sección de Informes */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <span className="text-2xl">📄</span>
                                    Informes ({informes.length})
                                </h3>
                                <button
                                    onClick={() => setShowModalInforme(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Agregar
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {informes.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                                        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg font-medium">No hay informes disponibles</p>
                                    <p className="text-gray-400 mt-2">Agrega el primer informe</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {informes.map((informe) => (
                                        <div key={informe.id} className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 overflow-hidden">
                                            <div className="p-5">
                                                <div className="flex items-start gap-3 mb-4">
                                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                                                            {informe.titulo}
                                                        </h5>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 mb-4 pb-4 border-b border-blue-100">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                            </svg>
                                                            {informe.nombre_autor}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatearFecha(informe.fecha)}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDescargarInforme(informe)}
                                                        className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        Descargar
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarInforme(informe.id)}
                                                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver
                    </button>
                </div>
            </div>

            {/* Modal Agregar Comentario */}
            {showModalComentario && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5 flex items-center justify-between">
                            <h5 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-2xl">💬</span>
                                Agregar Comentario
                            </h5>
                            <button 
                                onClick={() => {
                                    setShowModalComentario(false);
                                    setNuevoComentario("");
                                }}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <label htmlFor="comentarioModal" className="block text-sm font-bold text-gray-700 mb-2">
                                Escribe tu comentario:
                            </label>
                            <textarea
                                id="comentarioModal"
                                className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                rows="5"
                                placeholder="Escribe tu comentario aquí... (mínimo 15 caracteres)"
                                value={nuevoComentario}
                                onChange={(e) => setNuevoComentario(e.target.value)}
                            />

                            <div className="flex justify-between items-center mt-2">
                                <small className="text-gray-500">
                                    Caracteres: <span className={nuevoComentario.length < 15 ? "text-red-500 font-bold" : "text-emerald-600 font-bold"}>{nuevoComentario.length}</span>
                                </small>
                                {nuevoComentario.length < 15 && (
                                    <small className="text-red-500 font-medium">Mínimo 15 caracteres</small>
                                )}
                            </div>

                            <br />

                            {/* Para adjuntar una imagen */}
                            <FileUpload
                                id="imagenComentarioInput"
                                label="Imagen de Interes (JPG, PNG)"
                                accept=".jpg,.jpeg,.png"
                                file={imagenComentario}
                                handleFileChange={handleFileChangeFotoPerfil}
                                handleRemoveFile={handleRemoveFileFotoPerfil}
                            />


                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end rounded-b-2xl">
                            <button 
                                onClick={() => {
                                    setShowModalComentario(false);
                                    setNuevoComentario("");
                                }}
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleAgregarComentario}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-md hover:shadow-lg"
                            >
                                Agregar Comentario
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Agregar Informe */}
            {showModalInforme && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5 flex items-center justify-between">
                            <h5 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-2xl">📄</span>
                                Agregar Informe
                            </h5>
                            <button 
                                onClick={() => {
                                    setShowModalInforme(false);
                                    setNuevoInforme({ titulo: "", archivo: null });
                                }}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label htmlFor="tituloInforme" className="block text-sm font-bold text-gray-700 mb-2">
                                    Título del Informe:
                                </label>
                                <input
                                    type="text"
                                    id="tituloInforme"
                                    className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Ej: Informe Mensual Noviembre 2025"
                                    value={nuevoInforme.titulo}
                                    onChange={(e) => setNuevoInforme({...nuevoInforme, titulo: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="archivoInforme" className="block text-sm font-bold text-gray-700 mb-2">
                                    Archivo PDF:
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="archivoInforme"
                                        className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-100 file:text-emerald-700 file:font-medium hover:file:bg-emerald-200 file:cursor-pointer"
                                        accept=".pdf"
                                        onChange={(e) => setNuevoInforme({...nuevoInforme, archivo: e.target.files[0]})}
                                    />
                                </div>
                                <small className="text-gray-500 mt-1 block">Solo archivos PDF</small>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end rounded-b-2xl">
                            <button 
                                onClick={() => {
                                    setShowModalInforme(false);
                                    setNuevoInforme({ titulo: "", archivo: null });
                                }}
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleAgregarInforme}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-md hover:shadow-lg"
                            >
                                Agregar Informe
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConglomeradoDetalle;