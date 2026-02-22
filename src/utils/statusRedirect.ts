export function routeForStatus(status: string) {
  switch (status) {
    case "email_unverified":
      return "/verify-email";

    case "email_verified":
      return "/application";

    case "application_submitted":
      return "/pending-review";

    case "application_approved":
      return "/dashboard";

    case "application_rejected":
      return "/application-rejected";

    default:
      return "/login";
  }
}
