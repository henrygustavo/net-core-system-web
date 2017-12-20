namespace SystemNetCore.DataAccess.Implementations
{
    using Business.Entity;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;

    public partial class ApplicationContext
    {
        //dotnet ef database drop
        //dotnet ef migrations add initialCreate -o Data\Migrations
        //dotnet ef database update

        //ini Identity Tables//

        public void MemberShipMap(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .ToTable("Users");

            modelBuilder.Entity<Role>()
                .ToTable("Roles");

            modelBuilder.Entity<IdentityRoleClaim<int>>()
                .ToTable("RolesClaims");

            modelBuilder.Entity<IdentityUserRole<int>>()
                .ToTable("UserRoles");

            modelBuilder.Entity<IdentityUserClaim<int>>()
                .ToTable("UserClaims");

            modelBuilder.Entity<IdentityUserLogin<int>>()
                .ToTable("UserLogins");

            modelBuilder.Entity<IdentityUserToken<int>>()
                .ToTable("UserTokens");

            //end Identity Tables//
        }
    }
}
