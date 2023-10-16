import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const QuioscoContext = createContext();

const QuioscoProvider = ({ children }) => {
    const [categorias, setCategorias] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState({});
    const [producto, setProducto] = useState({});
    const [modal, setModal] = useState(false);
    const [pedido, setPedido] = useState([]);
    const [nombre, setNombre] = useState("");
    const [total, settotal] = useState(0);

    const router = useRouter();

    const obtenerCategorias = async () => {
        try {
            const { data } = await axios("/api/categorias");
            setCategorias(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickCategoria = (id) => {
        const categoria = categorias.filter((c) => c.id === id);
        setCategoriaActual(categoria[0]);
        console.log(categoria);
        router.push("/");
    };

    const handleSetProducto = (producto) => {
        setProducto(producto);
    };

    const handleChangeModal = () => {
        setModal(!modal);
    };

    const handleAgregarPedido = ({ categoriaId, ...producto }) => {
        if (pedido.some((productoState) => productoState.id === producto.id)) {
            //actualizar cantidad
            const pedidoActualizado = pedido.map((productoState) =>
                productoState.id === producto.id ? producto : productoState
            );
            setPedido(pedidoActualizado);
            toast.success("Cantidad Actualizada");
        } else {
            setPedido([...pedido, producto]);
            toast.success("Agregado al pedido");
        }

        setModal(false);
    };

    const handleEditarCantidades = (id) => {
        const productoActualizar = pedido.filter(
            (producto) => producto.id === id
        );
        setProducto(productoActualizar[0]);
        setModal(!modal);
    };

    const handleEliminarProducto = (id) => {
        const pedidoActualizado = pedido.filter(
            (producto) => producto.id !== id
        );
        setPedido(pedidoActualizado);
    };
    const handleColocarOrden = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/api/ordenes", {
                pedido,
                nombre,
                total,
                fecha: Date.now().toString(),
            });

            // reset app
            setCategoriaActual(0);
            setPedido([]);
            setNombre("");
            settotal(0);

            toast.success("Pedido Realizado correctamente");

            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        obtenerCategorias();
    }, []);

    useEffect(() => {
        setCategoriaActual(categorias[0]);
    }, [categorias]);

    useEffect(() => {
        const nuevoTotal = pedido.reduce(
            (total, producto) => producto.precio * producto.cantidad + total,
            0
        );

        settotal(nuevoTotal);
    }, [pedido]);

    return (
        <QuioscoContext.Provider
            value={{
                categorias,
                categoriaActual,
                handleClickCategoria,
                handleSetProducto,
                producto,
                modal,
                handleChangeModal,
                pedido,
                handleAgregarPedido,
                handleEditarCantidades,
                handleEliminarProducto,
                nombre,
                setNombre,
                handleColocarOrden,
                total,
            }}
        >
            {children}
        </QuioscoContext.Provider>
    );
};

export { QuioscoProvider };

export default QuioscoContext;
