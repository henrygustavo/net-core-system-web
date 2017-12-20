namespace SystemNetCore.Web.Models
{
    using System.ComponentModel.DataAnnotations;

    public class UserModel : RegisterModel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int IdRole { get; set; }

        public string Role { get; set; }

        [Required]
        public bool LockoutEnabled { get; set; }

        [Required]
        public bool Disabled { get; set; }

        public string PhoneNumber { get; set; }
 
    }

}
