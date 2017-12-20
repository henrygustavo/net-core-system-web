using System.ComponentModel.DataAnnotations;

namespace SystemNetCore.Web.Models
{
    public class VerificationTokenModel
    {
        [Required]
        public int IdUser { get; set; }

        [Required]
        public string Token { get; set; }
    }
}
