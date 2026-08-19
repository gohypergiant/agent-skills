# Deployment Notes

We use blue-green deployment: two identical production environments are
kept running, and traffic is switched from the old one (blue) to the new
one (green) once the new version passes health checks.
