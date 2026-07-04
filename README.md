# AquaTrackSRS 🌊

> **Smart Water Consumption & Billing Management Platform**  
> **Version:** `v1.0-auth`  
> **Status:** 🟢 Authentication Module Completed

---

# 🎯 Project Overview

AquaTrackSRS is a full-stack web application for apartment water consumption monitoring, billing management, leak detection, and usage analytics. The system is being developed using **Spring Boot**, **React (Vite)** and **PostgreSQL**.

---

# 🎨 UI Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary Blue | 🟦 | `#2563EB` |
| Light Blue | 🟦 | `#0EA5E9` |
| Background | ⬜ | `#F8FAFC` |
| White | ⬜ | `#FFFFFF` |
| Primary Text | ⬛ | `#1E293B` |
| Secondary Text | ◻ | `#64748B` |
| Border | ◽ | `#E2E8F0` |

---

# 🛠 Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React (Vite), React Router, Axios |
| Backend | Spring Boot, Spring Security, JWT |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Build Tools | Maven, npm |
| Version Control | Git & GitHub |

---

# ✅ Current Progress

## Backend
- Authentication completed
- JWT implemented
- Spring Security configured
- Login/Register APIs completed
- PostgreSQL integrated
- BCrypt password encryption
- CORS configured

## Frontend
- Landing Page
- Login
- Register
- Protected Routes
- JWT Storage
- Axios Integration
- Backend Integration

---

# 📅 Milestone 1 — Foundation & Core APIs

## Backend Team

| Feature | Priority | Status | Progress |
|---------|----------|--------|---------:|
| Spring Boot Setup | High | ✅ | 100% |
| PostgreSQL Configuration | High | ✅ | 100% |
| JWT Authentication | High | ✅ | 100% |
| Spring Security | High | ✅ | 100% |
| Login API | High | ✅ | 100% |
| Register API | High | ✅ | 100% |
| User Entity | High | ✅ | 100% |
| Apartment Entity | High | ⏳ | 0% |
| Household Entity | High | ⏳ | 0% |
| Water Usage Logs | High | ⏳ | 0% |
| Billing Cycle Entity | Medium | ⏳ | 0% |
| Tariff Plan Entity | Medium | ⏳ | 0% |
| Apartment CRUD APIs | High | ⏳ | 0% |
| Household CRUD APIs | High | ⏳ | 0% |
| Resident Assignment API | High | ⏳ | 0% |
| Meter Configuration API | Medium | ⏳ | 0% |
| Manual Usage Logging | High | ⏳ | 0% |
| CSV Upload API | Medium | ⏳ | 0% |
| Bean Validation | Medium | ⏳ | 0% |
| Flyway Migration | Medium | ⏳ | 0% |
| Unit Tests | Medium | ⏳ | 0% |
| Integration Tests | Medium | ⏳ | 0% |

## Frontend Team

| Feature | Priority | Status | Progress |
|---------|----------|--------|---------:|
| React + Vite Setup | High | ✅ | 100% |
| Landing Page | High | ✅ | 100% |
| Login | High | ✅ | 100% |
| Register | High | ✅ | 100% |
| JWT Storage | High | ✅ | 100% |
| Protected Routes | High | ✅ | 100% |
| Apartment Registration UI | High | ⏳ | 0% |
| Household Registration UI | High | ⏳ | 0% |
| Meter Configuration UI | Medium | ⏳ | 0% |
| Water Usage Entry UI | High | ⏳ | 0% |
| CSV Upload UI | Medium | ⏳ | 0% |
| Profile Management | Low | ⏳ | 0% |

---

# 📅 Milestone 2 — Billing Engine & Alerts

## Backend Team

| Feature | Priority | Status |
|---------|----------|--------|
| Tiered Billing Engine | High | ⏳ |
| Tariff Management | High | ⏳ |
| Bulk Water Purchase | High | ⏳ |
| Cost Distribution Algorithm | High | ⏳ |
| Billing Cycle Management | High | ⏳ |
| Invoice Generation Logic | High | ⏳ |
| Alert Scheduler | Medium | ⏳ |
| Leak Detection (2σ) | Medium | ⏳ |
| Email Notification APIs | Medium | ⏳ |

## Frontend Team

| Feature | Priority | Status |
|---------|----------|--------|
| Billing Summary | High | ⏳ |
| Billing History | Medium | ⏳ |
| Invoice Details | Medium | ⏳ |
| Tariff Configuration UI | Medium | ⏳ |
| Alert Notification UI | Medium | ⏳ |

---

# 📅 Milestone 3 — Dashboard & Reporting

## Backend Team

| Feature | Priority | Status |
|---------|----------|--------|
| Dashboard APIs | High | ⏳ |
| Statistics APIs | High | ⏳ |
| PDF Invoice Generation | High | ⏳ |
| JavaMail / SendGrid | Medium | ⏳ |
| Resident Comparison APIs | Medium | ⏳ |
| Admin Dashboard APIs | High | ⏳ |

## Frontend Team

| Feature | Priority | Status |
|---------|----------|--------|
| Dashboard | High | ⏳ |
| Sidebar | High | ⏳ |
| Navbar | High | ⏳ |
| Logout | High | ⏳ |
| Dashboard Cards | High | ⏳ |
| Recharts Integration | Medium | ⏳ |
| Monthly Charts | Medium | ⏳ |
| Comparison Charts | Medium | ⏳ |
| Resident Dashboard | High | ⏳ |
| Admin Dashboard | High | ⏳ |
| Invoice Download | Medium | ⏳ |
| Water Saving Tips | Low | ⏳ |

---

# 📅 Milestone 4 — Integration & Finalization

## Backend Team

| Feature | Priority | Status |
|---------|----------|--------|
| End-to-End Integration | High | ⏳ |
| Swagger Documentation | Medium | ⏳ |
| Docker Compose | Medium | ⏳ |
| Load Testing | Medium | ⏳ |
| Performance Optimization | Medium | ⏳ |

## Frontend Team

| Feature | Priority | Status |
|---------|----------|--------|
| Responsive UI | High | ⏳ |
| Cross Browser Testing | Medium | ⏳ |
| Error Handling | Medium | ⏳ |
| UI Polish | Medium | ⏳ |
| Demo Preparation | High | ⏳ |

---

# 📂 Core Database Entities

- Users
- Apartments
- Households
- Water Usage Logs
- Tariff Plans
- Billing Cycles
- Invoices

---

# 🌳 Git Branch Strategy

| Branch | Usage |
|---------|-------|
| main | Stable code |
| backend/* | Backend features |
| frontend/* | Frontend features |

---

# 📝 Commit Convention

```text
feat: add apartment CRUD
fix: resolve login bug
docs: update README
refactor: optimize billing engine
```

---

# 📌 Team Rules

- Pull before starting work.
- Commit small logical changes.
- Push only tested code.
- Keep frontend and backend independent.
- Update this README after completing a feature.
- Change feature status:
  - ⏳ Pending
  - 🟡 In Progress
  - ✅ Completed

---

# 🚀 Future Scope

- AI Water Consumption Prediction
- IoT Smart Meter Integration
- Online Bill Payments
- Mobile Application
- Cloud Deployment
- Analytics Dashboard
- Multi-Apartment Support
