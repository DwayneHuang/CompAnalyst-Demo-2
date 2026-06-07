# HR Compensation Analytics Platform Demo

## Project Goal

Build a high-fidelity web application demo for an HR Compensation Analytics Platform.

This is a demonstration product for interviews and client presentations.

The objective is to showcase how HR teams can:

- Price a Job
- Benchmark compensation against market data
- Analyze employee compensation
- Manage relocation adjustments
- Perform compensation planning and budgeting

The application should feel like a modern SaaS HR analytics product rather than a simple dashboard.

---

# Technical Requirements

- Generate a complete web application prototype
- Desktop only
- Fixed viewport size: **1280 × 800**
- Responsive behavior is NOT required
- Use mock data only
- No backend required
- Simulate all database responses locally
- Use realistic HR compensation datasets

---

# Information Architecture

The application contains four primary modules:

1. Home
2. Market Data
3. Our Company
4. Analytics

---

# Global Navigation

Top navigation:

- Home
- Market Data
- Our Company
- Analytics
- Notifications
- User Profile

---

# Module 1: Home Dashboard

The Home page serves as an executive dashboard.

Layout should resemble a professional analytics dashboard using a multi-card grid system.

Recommended layout:

Left Column

- Market Price a Job
- Hot Jobs

Middle Column

- Total Compensation Statement
- Cost to Budget

Right Column

- Employees
- Relocation Wizard

---

## Card 1: Market Price a Job

Purpose:

Quick navigation to compensation benchmarking.

Components:

- Job Search Input
- Autocomplete suggestions
- Go Button

Interaction:

When user clicks Go:

Navigate to Market Data page and pre-filter results.

---

## Card 2: Hot Jobs

Purpose:

Display trending jobs.

Component:

Carousel

Show:

- Software Engineer
- Data Scientist
- AI Product Manager
- HR Business Partner
- Sales Director

Interaction:

Clicking a job opens Market Data page.

---

## Card 3: Total Compensation Statement

Purpose:

Employee compensation overview.

Input:

Employee dropdown selector

Mock Employees:

- John Smith
- Sarah Johnson
- David Lee
- Emily Brown
- Michael Chen

Display:

- Job Title
- Department
- Market Pay Level
- Years at Company
- Performance Rating
- Base Salary
- Annual Bonus
- Total Direct Compensation (TDC)
- Composite MRP
- Market Index

Display format:

Executive compensation statement card.

---

## Card 4: Employees

Purpose:

Compensation positioning analysis.

Visualisation:

Scatter Plot

X Axis:

Composite MRP

Y Axis:

Employee Pay

Mock Dataset:

100 employees

Legend:

Blue: Within market range

Orange: Overpaid

Red: Underpaid

Hover Tooltip:

- Employee Name
- Job
- Salary
- Market Pay

---

## Card 5: Cost to Budget

Purpose:

Department compensation planning.

Inputs:

Department Dropdown

Options:

- Engineering
- Product
- HR
- Finance
- Sales

Budget Input

Numeric field

Visualisation:

Histogram

Show:

- Salary Distribution
- Budget Threshold

Interaction:

Histogram updates dynamically.

---

## Card 6: Relocation Wizard

Purpose:

Relocation compensation analysis.

Inputs:

- Job Level
- Current Location
- New Location
- Current Salary

Outputs:

### Geo Differential Chart

Compare:

- Current Salary
- Adjusted Salary

### Cost of Living Chart

Compare:

- Current Location
- New Location

Visualization:

Dual Histograms

Include legends.

---

# Module 2: Market Data

Purpose:

External compensation benchmarking database.

Layout:

Search + Filters + Data Grid

Filters:

- Job Title
- Department
- Job Function
- Experience Level
- Education Level
- Location

Each job record contains:

- Job Title
- Description
- Department
- Function
- Education Requirement
- Experience Requirement
- Job Family
- Market Level

Compensation Tabs:

- Base Salary
- Bonus
- TCC

Display compensation as:

- P25
- P50
- P75
- P90

Location selector should dynamically update compensation values.

---

# Module 3: Our Company

Purpose:

Internal compensation database.

Structure similar to Market Data.

Additional employee fields:

- Employee ID
- Employee Name
- Manager
- Current Salary
- Bonus
- Performance Rating
- Tenure

Comparison indicators:

- Market Index
- Compa Ratio
- Position to Market

Enable side-by-side comparison between:

Internal Pay vs Market Pay

---

# Module 4: Analytics

Purpose:

Price a Job using predictive analytics.

This module simulates an HR compensation modeling engine.

---

## Compensation Prediction Tool

Inputs:

- Job Title
- Department
- Job Function
- Years of Experience
- Education Level
- Management Responsibility
- Location

Model:

Simulated Multiple Linear Regression

Training Data:

Market Data dataset

Outputs:

### Predicted Base Salary

P25 / P50 / P75

### Predicted Bonus

P25 / P50 / P75

### Total Compensation

P25 / P50 / P75

---

## Feature Importance Chart

Show relative contribution of:

- Experience
- Education
- Function
- Department
- Location
- Management Scope

Visualisation:

Horizontal Bar Chart

---

## Prediction Confidence

Display:

- Confidence Score
- Prediction Range
- Market Alignment Indicator

---

# Data Simulation Requirements

Generate realistic HR compensation data for:

- 500 Jobs
- 100 Employees
- 300 US Cities

Compensation ranges should vary based on:

- Location
- Experience
- Function
- Education
- Job Family

Ensure realistic salary distributions.

---

# UX Requirements

The application should resemble enterprise SaaS products such as:

- Workday
- SAP SuccessFactors
- ADP
- Mercer
- Radford

Design characteristics:

- Clean enterprise UI
- Light theme
- Minimalistic
- Executive dashboard style
- Professional data visualisations
- Dense but readable information layout
- Modern HR analytics aesthetic

---

# Deliverables

## 1. Interactive Web Application Prototype

Including:

- All pages
- Navigation
- Charts
- Maps
- Simulated datasets
- User interactions

## 2. PRD Document

Output as Markdown.

Include:

- Product Vision
- User Personas
- User Stories
- Information Architecture
- Functional Requirements
- Data Model
- Interaction Design
- Analytics Logic
- Future Roadmap

## 3. Mock Data Schema

Include:

- Job Table
- Employee Table
- Location Table
- Compensation Table

## 4. Component Hierarchy

Provide component tree for implementation.
