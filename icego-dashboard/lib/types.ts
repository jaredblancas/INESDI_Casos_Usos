import type { EstadoPedido } from "./constants";

export type { EstadoPedido } from "./constants";

export interface Producto {
  id: string;
  business_id: string;
  nombre: string;
  categoria: string | null;
  precio: number;
  stock: number;
  disponible: boolean;
}

export interface Faq {
  id: string;
  business_id: string;
  topic: string;
  respuesta: string;
}

export interface Cliente {
  id: string;
  business_id: string;
  client_id: string | null;
  nombre: string | null;
  telefono: string | null;
  canal: string | null;
  telegram_id: string | null;
  email: string | null;
}

// Cliente enriquecido con métricas agregadas (CRM lista).
export interface ClienteConStats extends Cliente {
  total_pedidos: number;
  total_gastado: number;
  ultimo_pedido: string | null;
}

// Pedido agrupado por numero_pedido (multi-producto = varias filas).
export interface PedidoAgrupado {
  numero_pedido: string;
  estado: EstadoPedido;
  cliente_id: string | null;
  cliente_nombre: string | null;
  hora_recogida: string | null;
  rejection_reason: string | null;
  fecha_solicitud: string | null;
  total: number;
  lineas: { producto: string; cantidad: number; precio: number }[];
}

// Detalle de un cliente: perfil + stats + historial de pedidos.
export interface ClienteDetalle {
  cliente: Cliente;
  stats: {
    total_pedidos: number;
    total_gastado: number;
    ticket_promedio: number;
    ultimo_pedido: string | null;
  };
  pedidos: PedidoAgrupado[];
}
