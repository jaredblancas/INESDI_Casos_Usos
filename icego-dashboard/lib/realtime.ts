// Evento de ventana que dispara el componente RealtimeOrders cuando entra un
// pedido nuevo. Las páginas que muestran pedidos lo escuchan para refrescar sus
// datos vía la API (patrón BFF) sin que el operador tenga que recargar.
export const PEDIDOS_CHANGED_EVENT = "icego:pedidos-changed";
