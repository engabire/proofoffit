# Metrics & Formulas

## Primary KPIs

### Revenue Metrics
- **ARR (Annual Recurring Revenue)**: Monthly recurring revenue × 12
- **MRR Growth Rate**: (Current MRR - Previous MRR) / Previous MRR × 100
- **CAC (Customer Acquisition Cost)**: Total sales & marketing spend / New customers acquired
- **LTV (Lifetime Value)**: ARPU / Monthly churn rate
- **LTV:CAC Ratio**: Target 3:1 or higher

### Product Metrics
- **Activation Rate**: Users who complete onboarding / Total signups
- **Time to Value**: Average time from signup to first successful job match
- **Feature Adoption**: % of users using core features (job matching, fit reports)
- **User Engagement**: DAU/MAU ratio, session duration

### Customer Success
- **Churn Rate**: Customers lost / Total customers at start of period
- **NPS (Net Promoter Score)**: % Promoters - % Detractors
- **CSAT (Customer Satisfaction)**: Average support ticket rating
- **Support Ticket Volume**: Tickets per customer per month

## Secondary KPIs

### Marketing Metrics
- **MQLs (Marketing Qualified Leads)**: Leads scoring above threshold
- **SQLs (Sales Qualified Leads)**: MQLs that convert to sales opportunities
- **Conversion Rates**: Signup → Trial → Paid conversion funnel
- **Content Performance**: Blog traffic, download rates, webinar attendance

### Sales Metrics
- **Sales Cycle Length**: Average days from lead to close
- **Win Rate**: Closed deals / Total opportunities
- **Pipeline Coverage**: Pipeline value / Quota
- **Deal Size**: Average contract value (ACV)

## Guardrails

### Risk Metrics
- **Churn Rate**: < 5% monthly
- **Support Ticket Volume**: < 2 tickets per customer per month
- **System Uptime**: > 99.9%
- **Security Incidents**: 0 critical incidents
- **Compliance Score**: 100% SOC2 compliance

### Quality Metrics
- **Bug Rate**: < 1 critical bug per release
- **Performance**: Page load time < 2 seconds
- **Accessibility**: WCAG 2.1 AA compliance
- **Data Accuracy**: > 99% accuracy in job matching

## Formulas

### ROI Calculation
```
ROI = (LTV - CAC) / CAC × 100
```

### Payback Period
```
Payback Period = CAC / (ARPU × Gross Margin)
```

### Magic Number (Sales Efficiency)
```
Magic Number = (Current Quarter ARR - Previous Quarter ARR) / Previous Quarter Sales & Marketing Spend
```

### Cohort Analysis
```
Retention Rate = Active Users in Period N / Active Users in Period 0
```

## Reporting Cadence

- **Daily**: System health, signups, revenue
- **Weekly**: Product metrics, support tickets, marketing performance
- **Monthly**: Full KPI review, cohort analysis, churn analysis
- **Quarterly**: Strategic review, goal setting, roadmap planning

## Tools & Dashboards

- **Analytics**: Mixpanel, Google Analytics
- **Revenue**: Stripe Dashboard, custom reporting
- **Support**: Zendesk metrics
- **Product**: Custom telemetry dashboards
- **Marketing**: HubSpot, LinkedIn Analytics
