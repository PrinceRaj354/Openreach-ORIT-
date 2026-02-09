import { mockOrders } from './mockData';

interface OrderState {
  orderId: string;
  currentStage: string;
  timeline: Array<{ time: string; title: string; actor: string }>;  
  paymentVerified?: boolean;
  workStarted?: boolean;
  workCompleted?: boolean;
}

class OrderStateManager {
  private orders: Map<string, OrderState> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Initialize with mock data
    mockOrders.forEach(order => {
      this.orders.set(order.orderId, {
        orderId: order.orderId,
        currentStage: order.currentStage,
        timeline: order.timeline,
        paymentVerified: false,
        workStarted: false,
        workCompleted: false
      });
    });
  }

  getOrder(orderId: string): OrderState | undefined {
    return this.orders.get(orderId);
  }

  updateStage(orderId: string, newStage: string, actor: string) {
    const order = this.orders.get(orderId);
    if (order) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      order.currentStage = newStage;
      order.timeline.push({
        time: timeStr,
        title: this.getStageTitle(newStage),
        actor
      });

      this.orders.set(orderId, order);
      this.notifyListeners();

      // Send notification for Field Agent Assignment
      if (newStage === 'Field Agent Assigned') {
        this.sendNotification(orderId, 'New Order Assigned', `Order ${orderId} has been assigned to you`, 'AGENT');
      }
    }
  }

  startWork(orderId: string, actor: string) {
    const order = this.orders.get(orderId);
    if (order && order.currentStage === 'Field Agent Assigned') {
      order.workStarted = true;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      order.timeline.push({
        time: timeStr,
        title: 'Work Started',
        actor
      });
      this.orders.set(orderId, order);
      this.notifyListeners();
      this.sendNotification(orderId, 'Work Started', `Field agent has started work on ${orderId}`, 'OPS');
    }
  }

  completeWork(orderId: string, actor: string) {
    const order = this.orders.get(orderId);
    if (order && order.currentStage === 'Field Agent Assigned' && order.workStarted) {
      order.workCompleted = true;
      this.updateStage(orderId, 'Work Completed by Agent', actor);
      this.sendNotification(orderId, 'Work Completed', `Field agent has completed work on ${orderId}. Payment verification required.`, 'OPS');
    }
  }

  markPaymentVerified(orderId: string, actor: string) {
    const order = this.orders.get(orderId);
    if (order) {
      order.paymentVerified = true;
      this.updateStage(orderId, 'Service Enabled', actor);
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  private getStageTitle(stage: string): string {
    const titles: Record<string, string> = {
      'Site Check': 'Site Check Completed',
      'Inventory Check': 'Inventory Check Completed',
      'Node Capacity Check': 'Node Capacity Verified',
      'Allocate Local Stock': 'Stock Allocated',
      'Field Agent Assigned': 'Agent Assigned',
      'Work Completed by Agent': 'Work Completed by Agent',
      'Payment Verification': 'Payment Verified',
      'Service Enabled': 'Service Enabled'
    };
    return titles[stage] || 'Step Completed';
  }

  private sendNotification(orderId: string, title: string, message: string, target: 'OPS' | 'AGENT') {
    const event = new CustomEvent('orderNotification', {
      detail: { orderId, title, message, target }
    });
    window.dispatchEvent(event);
  }
}

export const orderStateManager = new OrderStateManager();
