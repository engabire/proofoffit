# Pull Request

## 📋 Risk & Changes
- [ ] **Security impact noted** - Any security implications have been identified and documented
- [ ] **Secrets unchanged / rotated as needed** - No hardcoded secrets added, existing secrets rotated if needed
- [ ] **Data handling reviewed** - Any new data processing follows security policies
- [ ] **Third-party integrations assessed** - New integrations have been security reviewed

## ✅ Checks (tick = evidence)
- [ ] **CI passed** (lint, tests, typecheck) - All automated checks are passing
- [ ] **Dependencies updated or reviewed** - Dependencies are up-to-date or security reviewed
- [ ] **Threat sketch added** when introducing new data/AI logic (see `/security/policies/03-secure-sdlc.md`)
- [ ] **Code review completed** - At least one team member has reviewed the code
- [ ] **Security review completed** - Security implications have been reviewed (if applicable)

## 🔒 Data Touchpoints
- [ ] **New PII?** Listed in `/security/registers/data-inventory.yaml`
- [ ] **Data flow documented** - Any new data flows have been documented
- [ ] **Retention policy defined** - Data retention policies are defined for new data
- [ ] **Access controls implemented** - Appropriate access controls are in place
- [ ] **Encryption applied** - Sensitive data is properly encrypted

## 🛡️ Security Checklist
- [ ] **Input validation** - All user inputs are properly validated
- [ ] **Output encoding** - All outputs are properly encoded
- [ ] **Authentication/Authorization** - Proper auth controls are implemented
- [ ] **Error handling** - Secure error handling is implemented
- [ ] **Logging** - Appropriate logging is implemented (no sensitive data)

## 📊 Compliance
- [ ] **GDPR compliance** - Any new data processing is GDPR compliant
- [ ] **Privacy policy updated** - Privacy policy reflects any changes (if applicable)
- [ ] **Data processing agreement** - New subprocessors have DPAs (if applicable)
- [ ] **Audit trail** - Changes are properly documented for audit purposes

## 🧪 Testing
- [ ] **Unit tests** - New code has appropriate unit tests
- [ ] **Integration tests** - Integration points are tested
- [ ] **Security tests** - Security-critical code has security tests
- [ ] **Manual testing** - Manual testing has been performed
- [ ] **Performance testing** - Performance impact has been assessed

## 📚 Documentation
- [ ] **Code documented** - New code is properly documented
- [ ] **API documented** - New APIs are documented (if applicable)
- [ ] **Security procedures updated** - Security procedures reflect changes (if applicable)
- [ ] **Runbooks updated** - Operational procedures are updated (if applicable)

## 🚀 Deployment
- [ ] **Environment variables** - New environment variables are documented
- [ ] **Database migrations** - Database changes are properly migrated
- [ ] **Configuration changes** - Configuration changes are documented
- [ ] **Rollback plan** - Rollback procedures are defined
- [ ] **Monitoring** - Appropriate monitoring is in place

## 📝 Additional Notes
<!-- Add any additional context, concerns, or notes here -->

## 🔗 Related Issues
<!-- Link to related issues, tickets, or documentation -->

## 📸 Screenshots
<!-- Add screenshots if applicable -->

---

**Security Review Required:** [ ] Yes [ ] No  
**Data Impact:** [ ] None [ ] Low [ ] Medium [ ] High  
**Deployment Risk:** [ ] Low [ ] Medium [ ] High  

**Reviewer Checklist:**
- [ ] Code quality and standards
- [ ] Security implications
- [ ] Performance impact
- [ ] Documentation completeness
- [ ] Testing coverage

