namespace SystemNetCore.Web.Models
{
    using System;
    using System.Collections;

    public class PaginationResult
    {
        public IList Content { get; set; }

        public int CurrentPage { get; set; }

        public int PageSize { get; set; }

        public int TotalRecords { get; set; }

        public int TotalPages => (int)Math.Ceiling((decimal)TotalRecords / PageSize);
    }
}