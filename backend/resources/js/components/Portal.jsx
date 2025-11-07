import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
    // Estado para controlar cuando el componente está montado en el cliente
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // createPortal(que, donde)
    // - children: lo que quieres teletransportar (tu modal)
    // - document.body: a dónde lo quieres enviar (el destino)
    return mounted ? createPortal(children, document.body) : null;
};

export default Portal;