import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

const BrigadaDetalle = () => {
    const { idbrigada } = useParams();
    const navigate = useNavigate();
    const [brigada, setBrigada] = useState(null);
    const [empleados, setEmpleados] = useState(null);
    const user = useAuth()

    useEffect(() => {
        const fetchBrigada = async () => {
        const res = await fetch(`https://fast-api-brigada.vercel.app/brigadas/${idbrigada}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
        });

        const data = await res.json();
        setBrigada(data.data[0]);
        };

        fetchBrigada();
    }, [idbrigada]);

    useEffect(() => {
        (async () => {
            const formData = new FormData();
            formData.append("brigada_id", idbrigada);

            const res = await fetch(`https://fast-api-brigada.vercel.app/brigada-brigadista`, {
                method: "POST",
                headers: { Authorization: `Bearer ${user.token}` },
                body: formData
            });

            const data = await res.json();
            setEmpleados(data.data || []);
        })();
    }, [idbrigada, user.usuario.id, user.token]);


    if (!brigada) return <p>Cargando brigada...</p>;

    return (
        <div className="lista-brigadas">

            <h1>Brigada</h1>
            <p>Aquí puedes ver toda la información acerca de esta brigada.</p>
        

            {/* Información de la brigada */}
            <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-4xl">🌳</span>
                            {brigada.nombre}
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-20">
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
                                        <p className="text-gray-700">{brigada.departamento && brigada.municipio ? `${brigada.departamento}, ${brigada.municipio}`: "No Asignada"}</p>
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
                                        <p className="text-gray-700">{brigada.region || "No Asignada"}</p>
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
                                        <p className="text-gray-700">{brigada.descripcion || "Sin descripción"}</p>
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
                                        <p className="text-gray-700">{brigada.fecha_creacion}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-emerald-700 mb-1">Estado</p>
                                        <p className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                            brigada.estado !== "En-Espera" 
                                            ? "bg-red-100 text-red-700"
                                            : "bg-emerald-100 text-emerald-700"
                                            }`}>{brigada.estado}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Todos los empleados asignados a esa brigada */}
            <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <svg className="w-6 h-6 text-green-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z"/>
                                </svg>
                                Empleados asignados ({empleados?.length})
                            </h2>
                        </div>
                    </div>

                    <br />


                    <div className="flex flex-col md:flex-row p-5 justify-center gap-2 md:gap-20">
                        {empleados && empleados?.length > 0 ? (
                            empleados.map((emp) => {
                                return (
                                    <div 
                                    key={emp.usuario_id} 
                                    className="bg-gradient-to-br cursor-pointer w-100 from-white to-emerald-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-emerald-100 overflow-hidden hover:scale-105 hover:-translate-y-1"
                                    >
                                    {/* Header del Card */}
                                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
                                        <h3 className="text-lg font-bold text-white truncate">
                                        {emp.usuario.nombre_completo}
                                        </h3>
                                    </div>

                                    {/* Body del Card */}
                                    <div className="p-6 space-y-4">
                                        {/* Información Principal */}
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-emerald-700 mb-1">Correo</p>
                                                    <p className="text-sm text-gray-700 truncate">{emp.usuario.correo}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h5m0-12V4a2 2 0 012-2h4a2 2 0 012 2v4m0 0h5a2 2 0 012 2v10a2 2 0 01-2 2h-5m0 0V9a2 2 0 012-2" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-emerald-700 mb-1">Cédula</p>
                                                    <p className="text-sm text-gray-700">{emp.usuario.cedula || "No asignada"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-emerald-700 mb-1">Región</p>
                                                    <p className="text-sm text-gray-700">{emp.usuario.region}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.934-8.899-2.645m16.334-12A23.931 23.931 0 0112 3c-3.183 0-6.22.934-8.899 2.645m0 0v.006v.015v.02m8.899-2.645h.008v.008h-.008v-.008m0 0c3.183 0 6.22.934 8.899 2.645m-16.334 0l-.005-.006L3.102 7.645" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-emerald-700 mb-1">Cargo</p>
                                                    <p className="text-sm text-gray-700">{emp.usuario.cargo || "No asignado"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-emerald-700 mb-1">Descripción</p>
                                                    <p className="text-sm text-gray-700 line-clamp-2">{emp.usuario.descripcion}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-emerald-100">
                                        <button
                                            onClick={() => navigate(`/admin/empleados/${emp.usuario_id}`)}
                                            className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Ver Empleado
                                        </button>
                                        </div>
                                    </div>
                                    </div>
                                )
                            })
                            ) : (
                                <h1 className="">No hay Empleados</h1>
                            )
                        }
                    </div>
                    <br />
                </div>
            </div>



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
    );
};

export default BrigadaDetalle;
