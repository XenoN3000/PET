using Microsoft.EntityFrameworkCore;

namespace Application.Core;


public class PagedList<T> : List<T>
{

    public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
    {
        TotalCount = count;
        PageSize = pageSize;
        CurrentPage = pageNumber;
        TotalPage = (int)Math.Ceiling(count / (double)pageSize);
        AddRange(items);
    }



    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize, CancellationToken cancellationToken = default)
    {
        var count = await source.CountAsync();
        var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
    public int CurrentPage { get; set; }
    public int TotalPage { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }

}