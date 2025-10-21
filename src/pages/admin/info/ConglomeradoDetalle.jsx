import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

    useEffect(() => {
        const fetchConglomerado = async () => {
            const session = JSON.parse(localStorage.getItem("session"));
            const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

            const res = await fetch(`${API_URL}/api/conglomerados/${idconglomerado}`, {
                headers: { Authorization: `Bearer ${session?.access_token}` },
            });

            const data = await res.json();
            setConglomerado(data);
        };

        fetchConglomerado();

        setComentarios([
            {
                id: 1,
                contenido: "Trabajo completado exitosamente",
                fecha_creacion: new Date().toISOString(),
                usuario_nombre: "Carlos Pinto"
            },
            {
                id: 2,
                contenido: "Este conglomerado necesita revisión de equipos",
                fecha_creacion: new Date().toISOString(),
                usuario_nombre: "Ferney Beltran"
            }
        ]);

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

    const handleAgregarComentario = () => {
        nuevoComentario = nuevoComentario.trim();
        if (nuevoComentario === "") {
            alert("El comentario no puede estar vacío");
            return;
        } else if (nuevoComentario.length < 15) {
            alert("El comentario no tener menos de 15 caracteres.");
            return;
        }

        const session = JSON.parse(localStorage.getItem("session"));
        const nuevoComent = {
            id: Date.now(),
            contenido: nuevoComentario,
            fecha_creacion: new Date().toISOString(),
            usuario_nombre: session?.user?.nombre_completo || "Usuario Actual"
        };

        setComentarios([...comentarios, nuevoComent]);
        setAlerta(true);
        setNuevoComentario("");
        setShowModalComentario(false);
        
        setTimeout(() => setAlerta(false), 3000);
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

        const session = JSON.parse(localStorage.getItem("session"));
        const informeNuevo = {
            id: Date.now(),
            titulo: nuevoInforme.titulo,
            nombre_autor: session?.user?.nombre_completo || "Usuario Actual",
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

    const handleEliminarComentario = (id) => {
        if (window.confirm("¿Estás seguro de eliminar este comentario?")) {
            setComentarios(comentarios.filter((com) => com.id !== id));
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
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    return (
        <div className="container-fluid px-4 py-4">
            <button 
                type="button" 
                className="btn btn-outline-danger mb-4"
                onClick={() => navigate(-1)}
            >
                ← Volver
            </button>

            <div className="row g-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-success text-white py-3">
                            <h2 className="mb-0 fs-4" style={{ color: '#ffff'}}>Conglomerado: {conglomerado.data.nombre}</h2>
                        </div>
                        <div className="card-body p-4">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <p className="mb-2">
                                        <strong className="text-success">Ubicación:</strong>{" "}
                                        <span className="text-muted">{conglomerado.data.ubicacion}</span>
                                    </p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <p className="mb-2">
                                        <strong className="text-success">Región:</strong>{" "}
                                        <span className="text-muted">{conglomerado.data.region}</span>
                                    </p>
                                </div>
                                <div className="col-12 mb-3">
                                    <p className="mb-2">
                                        <strong className="text-success">Descripción:</strong>{" "}
                                        <span className="text-muted">{conglomerado.data.descripcion}</span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-0">
                                        <strong className="text-success">Fecha Creación:</strong>{" "}
                                        <span className="text-muted">{conglomerado.data.fecha_creacion}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card comentarios border-0 shadow-sm">
                        <div className="card-header bg-success text-white py-3 text-center">
                            <h3 className="mb-0 fs-5" style={{ color: '#ffff'}}>
                                💬 Comentarios ({comentarios.length})
                            </h3>
                        </div>
                        <br />

                        {alerta &&
                            <div className="alert alert-success" role="alert" style={{ maxWidth: '50%', margin: '1%', justifySelf: 'center'}}>
                                ¡Comentario añadido con éxito!
                            </div>
                        }

                        <div className="card-body p-4">
                            <div className="mb-4 text-center">
                                <button
                                    className="btn btn-success px-4"
                                    onClick={() => setShowModalComentario(true)}
                                >
                                    ➕ Agregar Comentario
                                </button>
                            </div>

                            <hr className="my-4" />

                            {comentarios.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted fs-5">
                                        No hay comentarios aún. ¡Sé el primero en comentar!
                                    </p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {comentarios.map((comentario) => (
                                        <div key={comentario.id} className="col-12 col-md-6 col-lg-4">
                                            <div className="card container">
                                                <div className="card-body p-3 d-flex flex-column">
                                                    {editandoId === comentario.id ? (
                                                        <>
                                                            <textarea
                                                                className="form-control mb-3"
                                                                rows="3"
                                                                value={textoEdicion}
                                                                onChange={(e) => setTextoEdicion(e.target.value)}
                                                                style={{ resize: "vertical" }}
                                                            />
                                                            <div className="d-flex gap-5 justify-content-center">
                                                                <button
                                                                    className="btn btn-success px-3"
                                                                    onClick={() => handleGuardarEdicion(comentario.id)}
                                                                >
                                                                    💾 Guardar
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary px-3"
                                                                    onClick={handleCancelarEdicion}
                                                                >
                                                                    ✖ Cancelar
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="mb-3 text-dark text-center flex-grow-1" style={{ lineHeight: "1.6" }}>
                                                                {comentario.contenido}
                                                            </p>
                                                            <div className="d-flex justify-content-center align-items-center mb-2 flex-wrap gap-2">
                                                                <span className="badge bg-success px-3 py-2">
                                                                    👤 {comentario.usuario_nombre}
                                                                </span>
                                                                <span className="text-muted small">
                                                                    📅 {formatearFecha(comentario.fecha_creacion)}
                                                                </span>
                                                            </div>
                                                            <div className="d-flex gap-2 justify-content-center mt-2">
                                                                <button
                                                                    className="btn btn-outline-primary btn-sm px-3"
                                                                    onClick={() => handleIniciarEdicion(comentario)}
                                                                >
                                                                    ✏️ Editar
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm px-3"
                                                                    onClick={() => handleEliminarComentario(comentario.id)}
                                                                >
                                                                    🗑️ Eliminar
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card comentarios border-0 shadow-sm">
                        <div className="card-header bg-success text-white py-3 text-center">
                            <h3 className="mb-0 fs-5" style={{ color: '#ffff'}}>
                                📄 Informes
                            </h3>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-4 text-center">
                                <button
                                    className="btn btn-success px-4"
                                    onClick={() => setShowModalInforme(true)}
                                >
                                    ➕ Agregar Informe
                                </button>
                            </div>

                            <hr className="my-4" />

                            {informes.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted fs-5">
                                        No hay informes disponibles.
                                    </p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {informes.map((informe) => (
                                        <div key={informe.id} className="col-12 col-md-6 col-lg-4">
                                            <div className="card container">
                                                <div className="card-body p-3 d-flex flex-column">
                                                    <h5 className="text-success text-center mb-3">{informe.titulo}</h5>
                                                    <div className="mb-3 text-center">
                                                        <span className="badge bg-success px-3 py-2 mb-2">
                                                            👤 {informe.nombre_autor}
                                                        </span>
                                                        <p className="text-muted small mb-0">
                                                            📅 {formatearFecha(informe.fecha)}
                                                        </p>
                                                    </div>
                                                    <div className="d-flex gap-2 justify-content-center mt-auto">
                                                        <button
                                                            className="btn btn-success btn-sm px-3"
                                                            onClick={() => handleDescargarInforme(informe)}
                                                        >
                                                            📥 Descargar PDF
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm px-3"
                                                            onClick={() => handleEliminarInforme(informe.id)}
                                                        >
                                                            🗑️ Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Agregar Comentario */}
            {showModalComentario && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">💬 Agregar Comentario</h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={() => {
                                        setShowModalComentario(false);
                                        setNuevoComentario("");
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <label htmlFor="comentarioModal" className="form-label fw-bold">
                                    Escribe tu comentario:
                                </label>
                                <textarea
                                    id="comentarioModal"
                                    className="form-control"
                                    rows="4"
                                    placeholder="Escribe tu comentario aquí... (mínimo 15 caracteres)"
                                    value={nuevoComentario}
                                    onChange={(e) => setNuevoComentario(e.target.value)}
                                    style={{ resize: "vertical" }}
                                />
                                <small className="text-muted">
                                    Caracteres: {nuevoComentario.length}
                                </small>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowModalComentario(false);
                                        setNuevoComentario("");
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-success"
                                    onClick={handleAgregarComentario}
                                >
                                    ➕ Agregar Comentario
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Agregar Informe */}
            {showModalInforme && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">📄 Agregar Informe</h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={() => {
                                        setShowModalInforme(false);
                                        setNuevoInforme({ titulo: "", archivo: null });
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="tituloInforme" className="form-label fw-bold">
                                        Título del Informe:
                                    </label>
                                    <input
                                        type="text"
                                        id="tituloInforme"
                                        className="form-control"
                                        placeholder="Ej: Informe Mensual Noviembre 2025"
                                        value={nuevoInforme.titulo}
                                        onChange={(e) => setNuevoInforme({...nuevoInforme, titulo: e.target.value})}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="archivoInforme" className="form-label fw-bold">
                                        Archivo PDF:
                                    </label>
                                    <input
                                        type="file"
                                        id="archivoInforme"
                                        className="form-control"
                                        accept=".pdf"
                                        onChange={(e) => setNuevoInforme({...nuevoInforme, archivo: e.target.files[0]})}
                                    />
                                    <small className="text-muted">Solo archivos PDF</small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowModalInforme(false);
                                        setNuevoInforme({ titulo: "", archivo: null });
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-success"
                                    onClick={handleAgregarInforme}
                                >
                                    ➕ Agregar Informe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConglomeradoDetalle;
