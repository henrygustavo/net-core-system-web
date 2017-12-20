namespace SystemNetCore.Web.Models
{
    using Business.Entity;

    public static class ModelFactory
    {

        public static UserReturnModel Create(User appUser)
        {
            UserReturnModel userReturnModel = new UserReturnModel
            {
                Id = appUser.Id,
                UserName = appUser.UserName,
                Email = appUser.Email,
                EmailConfirmed = appUser.EmailConfirmed
            };

            return userReturnModel;
        }
    }

    public class UserReturnModel
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }

        public bool EmailConfirmed { get; set; }
    }
}