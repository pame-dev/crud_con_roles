import React from "react";
import { Flag, Wrench } from '../iconos';
import QueueItem from './QueueItem';
import { useTranslation } from "react-i18next";

// Componente principal de la fila de turnos (class component)
export class FilaTurnos extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      turnos: [],
      loading: true,
      err: null,
    };
    this.intervalId = null;
  }

  componentDidMount() {
    this.cargarTurnos();
    this.intervalId = setInterval(this.cargarTurnos, 3000);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cargo !== this.props.cargo) {
      this.cargarTurnos();
    }
  }

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  cargarTurnos = async () => {
    try {
      const { cargo } = this.props;
      const url = new URL("http://127.0.0.1:8000/api/turnos/fila");
      if (cargo) url.searchParams.append('cargo', cargo);

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al obtener fila actual");
      const data = await res.json();

      // Guardamos datos crudos
      this.setState({ turnos: data, err: null, loading: false });
    } catch (error) {
      this.setState({ err: error.message, loading: false });
    }
  }

  render() {
    const { turnos, loading, err } = this.state;
    const { cargo, t } = this.props; // t viene del wrapper

    const mensajeVacio = cargo 
      ? t("noTurnosPendientesCargo", { cargo })
      : t("noTurnosPendientes");

    return (
      <div className="col-lg-4 mb-3">
        <div className="card shadow-lg full-width-card" style={{ backgroundColor: "rgba(255, 255, 255, 0.88)" }}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center" style={{ margin: 0, padding: 0 }}>
              <h4
                className="d-flex align-items-center text-dark fw-bold"
                style={{ margin: 0, padding: 0, lineHeight: '1.5' }}
              >
                <Flag size={20} className="text-danger me-2" /> {t("filaActual")}
              </h4>
            </div>



            <div className="d-flex flex-column gap-2 mt-2">
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t("cargando")}</span>
                  </div>
                  <p className="text-muted mt-2">{t("cargandoTurnos")}</p>
                </div>
              )}

              {err && <p className="text-danger">{err}</p>}

              {!loading && !err && turnos.length === 0 && (
                <p className="text-muted text-center py-3">{mensajeVacio}</p>
              )}

              {!loading && turnos.slice(0, 3).map((turn) => {
                // Traducción dinámica de la razón
                const reason = turn.ID_AREA === 1 
                  ? t('reparacion') 
                  : t('cotizacion'); // o t('pasarAlModulo', { modulo: turn.ID_EMPLEADO }) si aplica

                return <QueueItem key={turn.turn_number} turn={{ ...turn, reason }} />;
              })}

            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Wrapper para usar useTranslation en class component
export default function FilaTurnosWrapper(props) {
  const { t } = useTranslation();
  return <FilaTurnos {...props} t={t} />;
}
