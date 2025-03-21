import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import ListaBotones from './ListaBotones';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import data from "../data/DataTransporte.json"


const Transporte = () => {
    const customIcon = new L.Icon({
        iconUrl: require("../images/bus.png"),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });


    const handleBusClick = (bus) => {
        if (bus) {
            const { latitude, longitude } = bus;
            mapRef.current.setView([latitude, longitude], 15);
        }
    };

    const mapRef = React.createRef();


    const [transportData, setTransportData] = useState(null);
    const [route, setRoute] = useState(82)

    /* actualiza la posicion de los colectivos cada 30 segundos */
    useEffect(() => {
        const fetchDataInterval = setInterval(() => {
            async function fetchTransportData() {
                try {
                    const response = await fetch(`https://datosabiertos-transporte-apis.buenosaires.gob.ar:443/colectivos/vehiclePositionsSimple?route_id=${route}&client_id=cb6b18c84b3b484d98018a791577af52&client_secret=3e3DB105Fbf642Bf88d5eeB8783EE1E6`);
                    if (!response.ok) {
                        throw new Error('Error en la solicitud a la API');
                    }
                    const data = await response.json();
                    setTransportData(data);
                    console.log(transportData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            fetchTransportData();
        },[route], 31000); // 31 segundos en milisegundos
    
        // Limpia el intervalo cuando el componente se desmonta
        return () => {
            clearInterval(fetchDataInterval);
        };
    }, [route]);



    if (!transportData) {
        return (
            <div className='row bg-info vh-100'>
                <div className='col-lg-3 col-sm-12 text-center my-2'>
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div className='col-lg-9 col-sm-12 text-center my-2'>
                    <MapContainer center={[-34.60, -58.38]} zoom={12} scrollWheelZoom={false} style={{ height: "900px", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[0, 0]} icon={customIcon} >
                            <Popup>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        )
    }

    const datosFiltrados = [];
    const rutasNombres = {};
    const idNombres = {};

    data.map((e) => {
        if (!rutasNombres[e.route_short_name] && !idNombres[e.id]) {
            rutasNombres[e.route_short_name] = true;
            idNombres[e.id] = true;
            datosFiltrados.push(e);
        }
    });

    function customComparator(a, b) {
        const routeShortNameA = a.route_short_name;
        const routeShortNameB = b.route_short_name;
       
        const segmentsA = routeShortNameA.match(/\d+|[a-zA-Z]+/g);
        const segmentsB = routeShortNameB.match(/\d+|[a-zA-Z]+/g);
       
        for (let i = 0; i < Math.min(segmentsA.length, segmentsB.length); i++) {
          const isNumberA = !isNaN(segmentsA[i]);
          const isNumberB = !isNaN(segmentsB[i]);
       
          if (isNumberA && isNumberB) {
            const diff = Number(segmentsA[i]) - Number(segmentsB[i]);
            if (diff !== 0) {
              return diff;
            }
          } else if (isNumberA) {
            return -1;
          } else if (isNumberB) {
            return 1;
          } else {
            const comparison = segmentsA[i].localeCompare(segmentsB[i]);
            if (comparison !== 0) {
              return comparison;
            }
          }
        }
       
        return segmentsA.length - segmentsB.length;
      }


    datosFiltrados.sort(customComparator)

    return (
        <div className="row bg-info">
            <div className="col-lg-3 col-sm-12 text-center my-2">
                <ListaBotones data={transportData} onBusClick={handleBusClick} setRoute={setRoute} valor={datosFiltrados}/>
            </div>
            <div className="col-lg-9 col-sm-12 text-center my-2">
                <MapContainer
                    ref={mapRef}
                    center={[-34.60, -58.38]}
                    zoom={12}
                    scrollWheelZoom={false}
                    style={{ height: '900px', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {transportData.map((item, index) => (
                        <Marker
                            key={index}
                            position={[item.latitude, item.longitude]}
                            icon={customIcon}
                        >
                            <Popup>
                                <p>Bus ID: {item.id}</p>
                                <p>Route ID: {item.route_id}</p>
                                <p>Agencia: {item.agency_name}</p>
                                <p>Route short name: {item.route_short_name}</p>
                                <p>Agencia ID: {item.agency_id}</p>
                                <p>Speed: {item.speed}</p>
                                <p>Timestamp: {item.timestamp}</p>
                                <p>Direccion: {item.direction}</p>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>

    )
}

export default Transporte