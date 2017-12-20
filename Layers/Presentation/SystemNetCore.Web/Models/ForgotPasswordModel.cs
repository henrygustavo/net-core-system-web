namespace SystemNetCore.Web.Models
{
    using System.ComponentModel.DataAnnotations;

    public class ForgotPasswordModel
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string ResetUrl { get; set; }
    }
}
