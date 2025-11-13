import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Para navegar
import API_URL from "../api/config";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  Tooltip, Legend,
  ResponsiveContainer,
  LabelList
} from "recharts";
import "./pages-styles/Graficas.css"; 

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#BB4455"];

const Graficas = () => {
  const navigate = useNavigate();
  const [turnosPorEmpleado, setTurnosPorEmpleado] = useState([]);
  const [tiemposTurnos, setTiemposTurnos] = useState([]);
  const [turnosPorDia, setTurnosPorDia] = useState([]);
  const [turnosPorTipo, setTurnosPorTipo] = useState([]);
  const [tiempoPorEmpleado, setTiempoPorEmpleado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const urls = [
          `${API_URL}/turnos/por-empleado`,
          `${API_URL}/turnos/tiempos`,
          `${API_URL}/turnos/dias`,
          `${API_URL}/turnos/por-tipo`,      
          `${API_URL}/turnos/tiempo-empleado` 
        ];

        const responses = await Promise.all(urls.map(url => fetch(url)));
        responses.forEach((res, i) => {
          if (!res.ok) throw new Error(`Error en la API: ${urls[i]} → Status ${res.status}`);
        });

        const [dataEmp, dataTiempo, dataDias, dataTipo, dataTiempoEmp] = await Promise.all(responses.map(res => res.json()));

        const tiemposNormalizados = dataTiempo.map(item => ({
          ...item,
          promedio: Math.abs(item.promedio / 60)
        }));

        setTurnosPorEmpleado(dataEmp);
        setTiemposTurnos(tiemposNormalizados);
        setTurnosPorDia(dataDias);
        setTurnosPorTipo(dataTipo);
        setTiempoPorEmpleado(dataTiempoEmp);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error desconocido al cargar los datos.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    border: "1px solid rgba(255, 255, 255, 0.18)",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { value } = payload[0];
      return (
        <div className="custom-tooltip darkable" style={{
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

  const tiempoPorEmpleadoOrdenado = [...tiempoPorEmpleado].sort((a, b) => a.promedio - b.promedio);

  return (
    <>
      <Header />
      <main style={backgroundStyle}>
        <div className="container">

          <div className="hero-dashboard darkable">
            <div className="hero-content text-center">
              <h1 className="text-light mb-3" style={{ fontWeight: 700, fontSize: "3.5rem" }}>
                Dashboard de Turnos
              </h1>
              <p className="text-light lead" style={{ fontSize: "1.25rem" }}>
                Gestiona tus turnos de manera rápida y eficiente
              </p>
            </div>
          </div>

          <div className="dashboard-grid">

            {/* Lado izquierdo */}
            <div className="grid-left">
              <div className="card darkable" style={cardStyle}>
                <h4 style={{ fontWeight: "600", color: "#222" }}>Empleado con más turnos</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={turnosPorEmpleado}
                      dataKey="turnos"
                      nameKey="empleado"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {turnosPorEmpleado.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={50}
                      align="center"
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="card darkable" style={cardStyle}>
                <h4 style={{ fontWeight: "600", color: "#222" }}>Turnos por día</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart 
                    data={turnosPorDia} 
                    margin={{ top: -10, right: 8, left: -30, bottom: 1 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0ff" />
                    <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="turnos" stroke="#2ca02c" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Centro */}
            <div className="grid-center">
              <div className="card darkable" style={cardStyle}>
                <h4 style={{ fontWeight: "600", color: "#222" }}>Tiempo promedio por tipo de turno (horas)</h4>
                <ResponsiveContainer width="100%" height={640}>
                  <BarChart data={tiemposTurnos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0ff" />
                    <XAxis dataKey="tipo" tick={{ fontSize: 15 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="promedio" fill="#ff7f0e" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Lado derecho */}
            <div className="grid-right">
              <div className="card darkable" style={cardStyle}>
                <h4 style={{ fontWeight: "600", color: "#222" }}>Distribución de turnos por tipo de servicio</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={turnosPorTipo}
                      dataKey="turnos"
                      nameKey="tipo"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {turnosPorTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Ranking horizontal de eficiencia */}
              <div className="card darkable" style={cardStyle}>
                <h4 style={{ fontWeight: "600", color: "#222" }}>Empleado más eficiente (ranking)</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    layout="vertical"
                    data={tiempoPorEmpleadoOrdenado}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="empleado" />
                    <Tooltip content={<CustomTooltip tipo="horas" />} />
                    <Bar dataKey="promedio" fill="#fa4444ff" radius={[0, 5, 5, 0]}>
                      <LabelList
                        dataKey="promedio"
                        position="right"
                        formatter={val => val.toFixed(1) + "h"}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default Graficas;
