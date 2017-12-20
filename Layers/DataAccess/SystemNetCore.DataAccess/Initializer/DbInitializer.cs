namespace SystemNetCore.DataAccess.Initializer
{
    using Implementations;
    using System.Threading.Tasks;

    public class DbInitializer
    {

        private readonly ApplicationContext _context;

        public DbInitializer(ApplicationContext context)
        {
            _context = context;
            _context.Database.EnsureCreated();
        }

        public async Task Seed()
        {

        }

    }
}
