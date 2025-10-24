// src/pages/Graficas.jsx
import React, { useEffect, useState } from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import "./pages-styles/Graficas.css"; // 👈 Importa el CSS que agregaremos abajo

const Graficas = () => {
  const [turnosPorEmpleado, setTurnosPorEmpleado] = useState([]);
  const [tiemposTurnos, setTiemposTurnos] = useState([]);
  const [turnosPorDia, setTurnosPorDia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const urls = [
          "http://127.0.0.1:8000/api/turnos/por-empleado",
          "http://127.0.0.1:8000/api/turnos/tiempos",
          "http://127.0.0.1:8000/api/turnos/dias"
        ];

        const responses = await Promise.all(urls.map(url => fetch(url)));
        responses.forEach((res, i) => {
          if (!res.ok) throw new Error(`Error en la API: ${urls[i]} → Status ${res.status}`);
        });

        const [dataEmp, dataTiempo, dataDias] = await Promise.all(responses.map(res => res.json()));
        setTurnosPorEmpleado(dataEmp);

        const tiemposNormalizados = dataTiempo.map(item => ({
          ...item,
          promedio: Math.abs(item.promedio / 60) // minutos → horas
        }));
        setTiemposTurnos(tiemposNormalizados);
        setTurnosPorDia(dataDias);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error desconocido al cargar los datos.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 💫 Loader con animación visual
  if (loading)
    return (
      <div className="loader-container-graficas">
        <div className="loader-ring-graficas"></div>
        <p className="loader-text">Cargando datos del dashboard...</p>
      </div>
    );

  if (error)
    return (
      <p className="text-center mt-5 pt-5" style={{ color: "red" }}>
        {error}
      </p>
    );

  const cardStyle = {
    background: "rgba(255, 255, 255, 1)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    padding: "20px",
    marginBottom: "40px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { value } = payload[0];
      return (
        <div style={{
          background: "white",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
        }}>
          <p><strong>{label}</strong></p>
          <p style={{ color: "#ff7f0e" }}>
            Promedio: {value.toFixed(1)} horas
          </p>
        </div>
      );
    }
    return null;
  };

  const backgroundStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #d8080894, #b20606b7)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 15s ease infinite",
    paddingTop: "80px",
    paddingBottom: "40px",
  };

  return (
    <>
      <Header />
      <main style={backgroundStyle}>
        <div className="container">
          <h1 className="text-center mb-5 mt-5 text-light" style={{ fontWeight: "700", fontSize: "2.5rem" }}>
            Dashboard de Turnos
          </h1>

          {/* Turnos por empleado */}
          <div style={cardStyle}>
            <h4 className="mb-3" style={{ fontWeight: "600", color: "#222" }}>
              Empleado con más turnos
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={turnosPorEmpleado} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="empleado" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="turnos" fill="#d80808ff" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tiempo promedio por tipo de turno */}
          <div style={cardStyle}>
            <h4 className="mt-5" style={{ fontWeight: "600", color: "#222" }}>
              Tiempo promedio por tipo de turno (horas)
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tiemposTurnos} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0ff" />
                <XAxis dataKey="tipo" tick={{ fontSize: 15 }} />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="promedio" fill="#ff7f0e" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Turnos por día */}
          <div style={cardStyle}>
            <h4 className="mb-3" style={{ fontWeight: "600", color: "#222" }}>
              Turnos por día
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={turnosPorDia} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="turnos"
                  stroke="#2ca02c"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <Footer />

      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </>
  );
};

export default Graficas;
