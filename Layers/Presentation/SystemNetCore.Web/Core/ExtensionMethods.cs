namespace SystemNetCore.Web.Core
{
    using System.Security.Claims;

    public static class ExtensionMethods
    {
        public static int getUserId(this ClaimsPrincipal user)
        {
            if (!user.Identity.IsAuthenticated)
                return 0;

            ClaimsPrincipal currentUser = user;
            return int.Parse(currentUser.FindFirst(ClaimTypes.NameIdentifier).Value);
        }
    }
}
