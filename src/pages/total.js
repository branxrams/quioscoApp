import { useEffect, useCallback } from "react";
import Layout from "@/layouts/Layout";
import useQuiosco from "@/hooks/useQuiosco";
import { formatearDinero } from "@/helpers";

export default function Total() {

    const { pedido, nombre, setNombre, handleColocarOrden, total } = useQuiosco()

    const comprobarPedido = useCallback(() => {
      return pedido.length === 0 || nombre === ''
    }, [pedido, nombre])

    useEffect(() => {
      comprobarPedido()
    }, [pedido, comprobarPedido]);

    return (
        <Layout pagina={"Total y Confirmar Pedido"}>
            <h1 className="text-4xl font-black">Total y Confirmar Pedido</h1>
            <p className="text-2xl my-10">Confirma tu pedido a continuacion</p>

            <form
              onSubmit={handleColocarOrden}
            >
                <div>
                    <label
                        htmlFor="nombre"
                        className="block uppercase text-slate-800 font-bold text-xl"
                    >
                        Nombre
                    </label>
                    <input
                        className="bg-gray-200 w-full lg:w-1/3 mt-3 p-2 rounded-md"
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={ e => setNombre(e.target.value)}
                    />
                </div>
                <div className="mt-10">
                    <p className="text-2xl">
                        Total a pagar: <span className="font-bold">{ formatearDinero(total) }</span>
                    </p>
                </div>
                <div className="mt-5">
                    <input
                        className={`${comprobarPedido() ? 'bg-indigo-200 hover:cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-800'} text-center w-full lg:w-auto px-5 py-2 rounded-md uppercase font-bold text-white hover:cursor-pointer`}
                        type="submit"
                        value="Confirmar Pedido"
                        disabled={comprobarPedido()}
                    />
                </div>
            </form>
        </Layout>
    );
}
