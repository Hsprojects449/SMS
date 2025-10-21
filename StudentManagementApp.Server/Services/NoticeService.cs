using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using SchoolApp.Models;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Text.Json;
using RestSharp;

namespace SchoolApp.Services
{
    public class NoticeService : INoticeService
    {
        private readonly SchoolContext _context;

        public NoticeService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<Notice> GetAllNotices()
        {
            return _context.Notices.ToList();
        }

        public Notice GetNoticeById(int id)
        {
            return _context.Notices.FirstOrDefault(s => s.NoticeID == id);
        }

        public async Task<int> AddNotice(Notice notice)
        {
            _context.Notices.Add(notice);
            _context.SaveChanges();

            var students = _context.Students;
            var client = new RestClient("https://sendbulkv1.pinbot.ai/v1/wamessage/bulkmsgsendapi");
            var request = new RestRequest
            {
                Method = Method.Post
            };
            request.AddHeader("APIKey", "69586149-1c61-11f0-8cb4-02c8a5e042bd");
            request.AddHeader("Content-Type", "application/json");
            var payload = students.Select(s => new
            {
                from = "919154085572",
                to = s.ParentPhone,
                type = "template",
                message = new {
                    templateid = "1463733",
                    placeholders = new[] { s.Name }
                }
            }).ToList();
            request.AddStringBody(System.Text.Json.JsonSerializer.Serialize(payload), DataFormat.Json);
            await client.ExecuteAsync(request);
            // var client = new RestClient("https://sendbulkv1.pinbot.ai/v1/wamessage/bulkmsgsendapi");
            // var request = new RestRequest
            // {
            //     Method = Method.Post
            // };
            // request.AddHeader("APIKey", "69586149-1c61-11f0-8cb4-02c8a5e042bd");
            // request.AddHeader("Content-Type", "application/json");
            // var payload = students.Select(s => new
            // {
            //     from = "919154085572",
            //     to = s.ParentPhone,
            //     type = "template",
            //     message = new {
            //         templateid = "1463733",
            //         placeholders = new[] { s.Name }
            //     }
            // }).ToList();
            // request.AddStringBody(System.Text.Json.JsonSerializer.Serialize(payload), DataFormat.Json);
            // await client.ExecuteAsync(request);
            return notice.NoticeID;
        }

        public int UpdateNotice(Notice notice)
        {
            _context.Notices.Update(notice);
            _context.SaveChanges();
            return notice.NoticeID;
        }

        public void DeleteNotice(int id)
        {
            var notice = _context.Notices.FirstOrDefault(s => s.NoticeID == id);
            if (notice != null)
            {
                _context.Notices.Remove(notice);
                _context.SaveChanges();
            }
        }
    }
}
