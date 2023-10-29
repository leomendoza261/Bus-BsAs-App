import React, { useState, useEffect } from "react";

function ListaBotones({ data, onBusClick, setRoute, valor }) {

    const [agencies, setAgencies] = useState([]);
    const [searchDestination, setSearchDestination] = useState("");
    
    useEffect(() => {
        setAgencies([1]);
    }, [data]);

    const handleRouteChange = (event) => {
        setRoute(parseInt(event.target.value));
    };

    return (
        <div>
            <div className="d-flex mb-1">
                {/* Dropdown para seleccionar el agency_id */}
                <select className="btn btn-info border-white text-white me-1" value={agencies} onChange={handleRouteChange}>
                    <option class="btn btn-warning">Rutas</option>
                    {valor.map((e) => (
                        <option class="btn btn-warning" key={e} value={e.route_id}>
                            {e.route_short_name}
                        </option>
                    ))}
                </select>

                {/* Input para buscar por destino */}
                <input
                    className="form-control bg-info text-white me-1"
                    type="text"
                    placeholder="Buscar por destino"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                />
            </div>


            {/* Lista de autobuses filtrada */}
            <div className="list-group" style={{ maxHeight: '91vh', overflowY: 'auto' }}>
                {data.map((bus) => (
                    <button key={bus.id}
                        className=" btn btn-outline-warning text-white"
                        onClick={() => onBusClick(bus)}
                    >
                        {/* Linea <span className="fw-bold">{bus.route_id}</span> -  */}Destino <span className="fw-bold">{bus.trip_headsign}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ListaBotones;
