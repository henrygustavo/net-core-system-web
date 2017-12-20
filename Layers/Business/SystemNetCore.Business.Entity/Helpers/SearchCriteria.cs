namespace SystemNetCore.Business.Entity.Helpers
{
    public class SearchCriteria
    {
        public string Field { get; set; }
        public string Value { get; set; }
        public WhereOperation Operation;
    }
}
