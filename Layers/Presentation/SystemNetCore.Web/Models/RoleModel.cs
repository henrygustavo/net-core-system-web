namespace SystemNetCore.Web.Models
{
    using System.ComponentModel.DataAnnotations;

    public class RoleModel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "the {0} must be at least {2} characters long.", MinimumLength = 5)]
        public string Name { get; set; }
    }
}
