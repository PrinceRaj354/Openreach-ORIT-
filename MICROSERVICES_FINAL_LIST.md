# OpenReach ORIT - Final Microservices List

## Summary
After analysis and optimization, the OpenReach ORIT platform will consist of **12 core microservices**.

---

## Removed Microservices

The following microservices have been removed as requested or identified as unnecessary:

### Explicitly Requested for Removal:
1. **Audit & Compliance Service** - Removed as requested
2. **Field Sync Service** - Removed as requested
3. **Field Mobile BFF (Backend for Frontend)** - Removed as requested (Field Mobile Services)

### Additional Removals After Analysis:
4. **Field Location Service** - Merged into Field Job Management Service (location tracking is now part of job management)
5. **API Gateway Service** - Moved to infrastructure layer (not a business microservice)
6. **Event Bus / Message Broker** - Infrastructure component (Kafka/RabbitMQ)
7. **Configuration Service** - Infrastructure component (Spring Cloud Config/Consul)
8. **Logging & Monitoring Service** - Infrastructure component (ELK Stack/Prometheus)

**Rationale for Additional Removals:**
- Field Location Service functionality is tightly coupled with job management and doesn't warrant a separate service
- API Gateway, Event Bus, Configuration, and Logging/Monitoring are infrastructure concerns, not business microservices
- Consolidating reduces operational complexity and inter-service communication overhead

---

## Final List of 12 Core Microservices

### Operations Domain (6 Services)

#### 1. Order Management Service
**Domain:** Order Lifecycle & Processing
- Order intake and validation
- Order lifecycle state management (14 statuses)
- SLA tracking and monitoring
- Order routing and prioritization

#### 2. Inventory Management Service
**Domain:** Stock & Asset Management
- Inventory catalog management
- Stock level tracking by exchange
- Stock allocation and reservation
- Low stock alerts

#### 3. Procurement Service
**Domain:** Supply Chain & Procurement
- Procurement request initiation
- Vendor order management
- ETA management and updates
- Procurement-to-inventory sync

#### 4. Site Assessment Service
**Domain:** Site Feasibility & Network Capacity
- Site serviceability checks
- Node capacity verification
- Network topology validation
- Civil work requirement assessment

#### 5. Resource Management Service
**Domain:** Engineer Assignment & Scheduling
- Field engineer management
- Job assignment and dispatch
- Engineer availability tracking
- Workload balancing and route optimization

#### 6. Notification Service
**Domain:** Communication & Alerts
- Real-time notification generation
- Role-based notification routing
- Multi-channel delivery (in-app, email, SMS)
- Notification preferences management

---

### Field Agent Domain (3 Services)

#### 7. Field Job Management Service
**Domain:** Field Agent Job Coordination
- Daily job queue management
- Job assignment retrieval by engineer
- Job status tracking (Assigned → In Progress → Completed)
- **Location tracking and geofencing** (merged from Field Location Service)
- Regional job filtering

#### 8. Field Evidence Service
**Domain:** Installation Evidence & Compliance
- ONT serial number capture and validation
- Photo/video upload and storage
- Fibre route documentation
- Installation notes and observations
- Evidence validation

#### 9. Field Completion Service
**Domain:** Job Completion & Outcome Management
- Job completion workflow (Success/Rework/Failed)
- Issue categorization and reporting
- Rework request creation
- Job failure documentation
- Completion validation

---

### Analytics & Support Domain (3 Services)

#### 10. Analytics & Reporting Service
**Domain:** Business Intelligence & KPIs
- KPI calculation and aggregation
- Performance metrics tracking
- Regional analytics
- SLA breach prediction
- Custom report generation

#### 11. Geospatial Service
**Domain:** Mapping & Location Intelligence
- Job location mapping
- Route optimization
- Geographic clustering
- Distance calculations
- Regional boundary management

#### 12. Authentication & Authorization Service
**Domain:** Identity & Access Management
- User authentication
- Role-based access control (RBAC)
- Regional access control
- Session management
- Token generation and validation

---

## Microservices by Category

### Core Business Services (9)
1. Order Management Service
2. Inventory Management Service
3. Procurement Service
4. Site Assessment Service
5. Resource Management Service
6. Field Job Management Service
7. Field Evidence Service
8. Field Completion Service
9. Notification Service

### Supporting Services (3)
10. Analytics & Reporting Service
11. Geospatial Service
12. Authentication & Authorization Service

---

## Infrastructure Components (Not Microservices)

These are infrastructure/platform concerns managed separately:

1. **API Gateway** - Kong, AWS API Gateway, or NGINX
2. **Message Broker** - Apache Kafka or RabbitMQ
3. **Configuration Management** - Spring Cloud Config or AWS Parameter Store
4. **Logging & Monitoring** - ELK Stack, Prometheus, Grafana
5. **Service Mesh** - Istio or Linkerd (optional)
6. **Container Orchestration** - Kubernetes
7. **CI/CD Pipeline** - Jenkins, GitLab CI, or AWS CodePipeline

---

## Field Agent Architecture (Simplified)

```
┌─────────────────────────────────────┐
│     Field Agent Mobile App          │
│  (React Native / Flutter / PWA)     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         API Gateway                 │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┬──────────────┐
       ▼               ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│Field Job │  │ Evidence │  │Completion│
│ Service  │  │ Service  │  │ Service  │
└──────────┘  └──────────┘  └──────────┘
```

**Key Changes:**
- Removed Field Mobile BFF - Mobile app communicates directly via API Gateway
- Removed Field Sync Service - Sync handled by individual services with event-driven architecture
- Removed Field Location Service - Location tracking integrated into Field Job Management Service
- Simplified architecture reduces latency and complexity

---

## Communication Patterns

### Synchronous (REST/HTTP)
- User-facing operations
- Real-time queries
- Direct service-to-service calls when immediate response needed

### Asynchronous (Event-Driven)
- State changes (Order status, Job completion)
- Notifications
- Analytics updates
- Cross-service data synchronization

### Event Examples:
- `OrderCreated` → Triggers Site Assessment
- `JobCompleted` → Updates Order Management, Triggers Notification, Updates Analytics
- `StockLevelChanged` → May trigger Procurement
- `EngineerAssigned` → Updates Field Job Management

---

## Benefits of Streamlined Architecture

### Reduced Complexity
- 12 services instead of 17+ (29% reduction)
- Fewer inter-service dependencies
- Simpler deployment and monitoring

### Improved Performance
- Eliminated unnecessary service hops (no BFF layer)
- Direct API Gateway routing
- Reduced network latency

### Lower Operational Costs
- Fewer services to deploy and maintain
- Reduced infrastructure costs
- Simplified DevOps workflows

### Better Maintainability
- Clear service boundaries
- Consolidated related functionality
- Easier to understand and debug

### Preserved Functionality
- All business requirements still met
- Location tracking integrated into job management
- Event-driven sync replaces dedicated sync service
- Infrastructure concerns properly separated

---

## Migration Priority

### Phase 1: Foundation (Months 1-3)
1. Authentication & Authorization Service
2. Order Management Service
3. Notification Service

### Phase 2: Core Operations (Months 4-6)
4. Inventory Management Service
5. Site Assessment Service
6. Resource Management Service

### Phase 3: Field Operations (Months 7-9)
7. Field Job Management Service (with location tracking)
8. Field Evidence Service
9. Field Completion Service

### Phase 4: Analytics & Optimization (Months 10-12)
10. Procurement Service
11. Analytics & Reporting Service
12. Geospatial Service

---

## Technology Stack Summary

### Backend Services
- **Primary:** Node.js/Express or Java Spring Boot
- **Analytics:** Python (for data science) or Node.js
- **Geospatial:** Python or Node.js with PostGIS

### Databases
- **Transactional:** PostgreSQL
- **Caching:** Redis
- **Analytics:** Data Warehouse (Snowflake/Redshift/BigQuery)
- **Geospatial:** PostgreSQL with PostGIS extension

### Messaging
- **Event Streaming:** Apache Kafka or AWS Kinesis
- **Message Queue:** RabbitMQ or AWS SQS/SNS

### Storage
- **Media Files:** AWS S3 or Azure Blob Storage
- **CDN:** CloudFront or Azure CDN

### Infrastructure
- **Containers:** Docker
- **Orchestration:** Kubernetes (EKS/AKS)
- **API Gateway:** Kong, AWS API Gateway, or NGINX
- **Monitoring:** Prometheus, Grafana, ELK Stack

---

## Conclusion

The streamlined architecture with **12 core microservices** provides:

✅ **Simplified Architecture** - Removed 5 unnecessary services  
✅ **Maintained Functionality** - All business requirements preserved  
✅ **Better Performance** - Reduced service hops and latency  
✅ **Lower Costs** - Fewer services to deploy and maintain  
✅ **Clear Separation** - Business services vs infrastructure components  
✅ **Scalability** - Each service can scale independently  
✅ **Maintainability** - Clear boundaries and responsibilities  

This architecture positions OpenReach ORIT for sustainable growth while minimizing operational complexity.

---

**Document Version:** 2.0  
**Last Updated:** 2024  
**Status:** Final - Optimized Architecture
