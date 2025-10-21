using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface INoticeService
    {
        IEnumerable<Notice> GetAllNotices();
        Notice GetNoticeById(int id);
        Task<int> AddNotice(Notice notice);
        int UpdateNotice(Notice notice);
        void DeleteNotice(int id);
    }
}
