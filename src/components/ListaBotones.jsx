import React, { useState, useEffect, useRef } from "react";

function ListaBotones({ data, onBusClick, setRoute, valor }) {
  const [searchDestination, setSearchDestination] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchDestination.trim() === "") {
      setFilteredOptions([]);
    } else {
      const filtered = valor.filter((e) =>
        e.route_short_name.toLowerCase().includes(searchDestination.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchDestination, valor]);

  const handleOptionClick = (option) => {
    setSearchDestination(option.route_short_name);
    setRoute(option.route_id);
    setFilteredOptions([]);
    setVisible(false);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Input para buscar por destino */}
      <div className="d-flex mb-1">
        <input
          className="form-control bg-info text-white me-1"
          type="text"
          placeholder="Buscar por línea"
          value={searchDestination}
          onChange={(e) => {
            setSearchDestination(e.target.value);
            setVisible(true);
          }}
        />
      </div>

      {/* Sugerencias de búsqueda */}
      {visible && (
        <div
          className="list-group position-absolute"
          style={{ zIndex: 1000, maxHeight: "25vh", overflowY: "auto", width: "23.5%" }}
          ref={dropdownRef}
        >
          {filteredOptions.map((option) => (
            <button
              key={option.route_id}
              className="list-group-item list-group-item-action"
              onClick={() => handleOptionClick(option)}
            >
              {option.route_short_name}
            </button>
          ))}
        </div>
      )}

      {/* Lista de autobuses filtrada */}
      <div className="list-group" style={{ maxHeight: "91vh", overflowY: "auto" }}>
        {data.map((bus) => (
          <button
            key={bus.id}
            className="btn btn-outline-warning text-white"
            onClick={() => onBusClick(bus)}
          >
            Destino <span className="fw-bold">{bus.trip_headsign}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ListaBotones;
