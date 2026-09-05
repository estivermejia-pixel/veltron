/**
 * Capa Unificada de Servicios de Veltron Capital
 * Arquitectura modular con Fachada de Retrocompatibilidad Total
 */

export { BANCOLOMBIA_LLAVE } from '../config/env';

export {
  getActiveProducts,
  getProductById,
  createProduct
} from './productsService';

export {
  generateShortRef,
  createOrder,
  searchOrders,
  getAdminOrders,
  updateOrderStatus,
  getAuditLogs,
  getPaymentAlerts
} from './ordersService';

export {
  validateAndGetDownload,
  markTokenAsUsed
} from './downloadsService';

export {
  getRequests,
  createRequest,
  voteRequest,
  updateRequestStatus
} from './requestsService';

export {
  paymentService,
  createWompiTransaction
} from './paymentService';

export {
  createContactMessage,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage
} from './contactMessagesService';



