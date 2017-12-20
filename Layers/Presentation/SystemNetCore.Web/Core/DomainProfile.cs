namespace SystemNetCore.Web.Core
{
    using Business.Entity;
    using Models;
    using AutoMapper;

    public class DomainProfile : Profile
    {
        public DomainProfile()
        {
            CreateMap<User, UserModel>().ReverseMap();
            CreateMap<Role, RoleModel>().ReverseMap();
        }
    }
}
