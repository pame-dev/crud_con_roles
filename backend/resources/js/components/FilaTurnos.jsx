import React from "react";
import { Clock, Flag } from '../iconos';
import QueueItem from './QueueItem';
import { fetchFilaActual } from "../api/turnosApi";

//Componente de la Fila de turnos, maneja la logica de datos para la fila 
//mapea el array de turnos y crea multiples componentes de QueueItem
export class FilaTurnos extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      turnos: [], //array de turnos, inicia vacio
      loading: true, 
      err: null,
      ultimaActualizacion: null
    };
    this.intervalId = null;
  }

  componentDidMount() {
    // Cargar inmediatamente sin delay
    this.cargarTurnos();
    this.intervalId = setInterval(this.cargarTurnos, 3000); //actualiza la carga cada 3 segundos
     }

  componentDidUpdate(prevProps) {
    if (prevProps.cargo !== this.props.cargo) {
      this.cargarTurnos(); //recarga si cambia el filtro de cargo
      }
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // libera la memoria reservada para evitar que haya fugas de memoria(memory leaks)
    }
    }

  cargarTurnos = async () => {
    try {
      const { cargo } = this.props;
      //construye url con parametro de filtro
      const url = new URL("http://127.0.0.1:8000/api/turnos/fila");
      if (cargo) {
        url.searchParams.append('cargo', cargo);
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al obtener fila actual");
      const data = await res.json();

      //actualiza el estado con nuevos datos
      this.setState({
        turnos: data,
        err: null,
        ultimaActualizacion: new Date(),
        loading: false
      });
      } catch (error) {
      //manejo de errores
      this.setState({ 
        err: error.message,
        loading: false 
      });
      }
  }

  formatearHora = (fecha) => {
    return fecha ? fecha.toLocaleTimeString() : '';
  }

  render() {
    const { turnos, loading, err, ultimaActualizacion } = this.state;
    const { cargo } = this.props;

    const mensajeVacio = cargo 
      ? `No hay turnos pendientes en ${cargo}`
      : 'No hay turnos pendientes';

      return (
      <div className="col-lg-4 mb-3">
        <div className="card shadow-lg full-width-card darkable" style={{ backgroundColor: "rgba(255, 255, 255, 0.88)" }}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-0 mt-0">
                <Flag size={20} className="text-danger me-2" />Fila Actual
                </h4>

            </div>

            <div className="d-flex flex-column gap-3">
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                    </div>
                  <p className="text-muted mt-2">Cargando turnos...</p>
                  </div>
              )}
              
              {err && <p className="text-danger">{err}</p>}
              
              {!loading && !err && turnos.length === 0 && (
                <p className="text-muted text-center py-3">{mensajeVacio}</p>
              )}

              {!loading && turnos.map((turn) => (
                <QueueItem key={turn.turn_number} turn={turn} />
              ))}
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FilaTurnos;
