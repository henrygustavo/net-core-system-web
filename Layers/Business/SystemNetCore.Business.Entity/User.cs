namespace SystemNetCore.Business.Entity
{
    using Microsoft.AspNetCore.Identity;

    public class User : IdentityUser<int>
    {
        public virtual bool Disabled { get; set; }

    }
}
