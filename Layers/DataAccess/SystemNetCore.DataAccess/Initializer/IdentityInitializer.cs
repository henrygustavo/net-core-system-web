using System.Reflection;

namespace SystemNetCore.DataAccess.Initializer
{
    using Business.Entity;
    using Microsoft.AspNetCore.Identity;
    using System;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using System.IO;
    using Newtonsoft.Json;

    public class IdentityInitializer
    {
        private readonly RoleManager<Role> _roleMgr;
        private readonly UserManager<User> _userMgr;

        public IdentityInitializer(UserManager<User> userMgr, RoleManager<Role> roleMgr)
        {
            _userMgr = userMgr;
            _roleMgr = roleMgr;

        }

        public async Task Seed()
        {
            await SeedAdmin();
            await SeedMember();
            await SeedTestMemberData();
        }

        public async Task SeedAdmin()
        {
            var user = await _userMgr.FindByNameAsync("admin");

            // Add User
            if (user == null)
            {
                if (!await _roleMgr.RoleExistsAsync("Admin"))
                {
                    var role = new Role { Name = "Admin" };
                    await _roleMgr.CreateAsync(role);
                }

                user = new User
                {
                    UserName = "admin",
                    Email = "admin@henrygustavo.com",
                    EmailConfirmed = true,
                    PhoneNumber = "530-685-2496"
                };

                var userResult = await _userMgr.CreateAsync(user, "P@$$w0rd");
                var roleResult = await _userMgr.AddToRoleAsync(user, "Admin");
                var claimResult = await _userMgr.AddClaimAsync(user, new Claim(ClaimTypes.Role, "Admin"));

                if (!userResult.Succeeded || !roleResult.Succeeded || !claimResult.Succeeded)
                {
                    throw new InvalidOperationException("Failed to build user and roles");
                }

            }
        }

        public async Task SeedMember()
        {
            var user = await _userMgr.FindByNameAsync("member");

            // Add User
            if (user == null)
            {
                if (!await _roleMgr.RoleExistsAsync("Member"))
                {
                    var role = new Role { Name = "Member" };

                    await _roleMgr.CreateAsync(role);
                }

                user = new User
                {
                    UserName = "member",
                    Email = "member@test.com",
                    EmailConfirmed = true,
                    PhoneNumber = "530-685-2496"
                };

                var userResult = await _userMgr.CreateAsync(user, "P@$$w0rd");
                var roleResult = await _userMgr.AddToRoleAsync(user, "Member");
                var claimResult = await _userMgr.AddClaimAsync(user, new Claim(ClaimTypes.Role, "Member"));

                if (!userResult.Succeeded || !roleResult.Succeeded|| !claimResult.Succeeded)
                {
                    throw new InvalidOperationException("Failed to build user and roles");
                }

            }
        }

        public async Task SeedTestMemberData()
        {
            try
            {
                Assembly currentAssembly = Assembly.GetExecutingAssembly();
                string localFilePath = Path.Combine(Path.GetDirectoryName(currentAssembly.GetName().CodeBase), Path.Combine("testData", "User.json"));
                string json = File.ReadAllText(new Uri(localFilePath).LocalPath);

                List<User> users = JsonConvert.DeserializeObject<List<User>>(json);

                foreach (User user in users)
                {
                    var userTemp = await _userMgr.FindByNameAsync(user.UserName);

                    if (userTemp == null)
                    {
                        var userResult = await _userMgr.CreateAsync(user, "P@$$w0rd");
                        var roleResult = await _userMgr.AddToRoleAsync(user, "Member");
                        var claimResult = await _userMgr.AddClaimAsync(user, new Claim(ClaimTypes.Role, "Member"));
                    }

                }
            }
            catch(Exception ex)
            {
                
            }
        }

    }
}
