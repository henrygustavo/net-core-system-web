namespace SystemNetCore.Web.Models
{
    using System.ComponentModel.DataAnnotations;

    public class CredentialModel
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}