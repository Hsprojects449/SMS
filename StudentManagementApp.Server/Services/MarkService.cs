using Microsoft.EntityFrameworkCore;
using SchoolApp.Models;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.WebUtilities;

namespace SchoolApp.Services
{
    public class MarkService : IMarkService
    {
        private readonly SchoolContext _context;

        public MarkService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<Mark> GetAllMarks()
        {
            return _context.Marks.ToList();
        }

        public object GetMarksByClassandSubject(string cls, string sub)
        {
            // 1. Get students of the class
            var students = _context.Students
                .Where(s => s.Class == cls)
                .ToList();

            // 2. Get marks of that class and subject
            var marks = _context.Marks
                .Where(m => m.Class == cls && m.Syllabus == sub) // assuming "Syllabus" is subject
                .ToList();

            var examNames = marks
            .Select(m => m.ExamName)
            .Distinct()
            .OrderBy(x => x)
            .ToList();

            // 4. Prepare columns
            var columns = new List<object>
            {
                new { field = "studentID", headerName = "Student ID", flex = 1, headerClassName= "boldHeaderCell" },
                new { field = "name", headerName = "Name", flex = 1, headerClassName= "boldHeaderCell" }
            };

            columns.AddRange(examNames.Select(exam => new
            {
                field = exam,
                headerName = exam,
                flex = 1,
                editable = true,
                headerClassName= "boldHeaderCell"
            }));
            var rows = students.Select(s => {
            var row = new Dictionary<string, object>
            {
                ["studentID"] = s.StudentID,
                ["name"] = s.Name
            };

            foreach (var exam in examNames)
            {
                var mark = marks.FirstOrDefault(m => m.StudentID == s.StudentID && m.ExamName == exam);
                row[exam] = mark?.MarksObtained ?? (object)null;
            }

            return row;
            }).ToList();

            // 6. Return as object (rows + columns)
            return new
            {
                columns,
                rows
            };
        }

        public List<Mark> GetMarksforStudent(Guid SID)
        {
            var marks = _context.Marks
                .Where(m => m.StudentID == SID)
                .ToList();
            return marks;
        }

        public Mark GetMarksById(int id)
        {
            return _context.Marks.FirstOrDefault(s => s.MarkID == id);
        }

        public async Task<int> AddMark(string cls, string sub, List<Mark> marks)
        {
            var existingMarks = _context.Marks
                .Where(m => m.Class == cls && m.Syllabus == sub)
                .ToList();

            foreach (var mark in marks)
            {
                var existing = existingMarks.FirstOrDefault(m =>
                    m.StudentID == mark.StudentID &&
                    m.ExamName == mark.ExamName
                );

                if (existing != null)
                {
                    existing.MarksObtained = mark.MarksObtained;
                    // _context.Marks.Update(existing);
                }
                else
                {
                    var newMark = new Mark
                    {
                        StudentID = mark.StudentID,
                        Name = mark.Name,
                        Class = cls,
                        Syllabus = sub,
                        ExamName = mark.ExamName,
                        MarksObtained = mark.MarksObtained
                    };

                    _context.Marks.Add(newMark);
                    // existingMarks.Add(newMark);
                }
            }
            
            var studentIds = marks.Select(s => s.StudentID).ToList();
            var parentPhones = await _context.Students
                .Where(s => s.Class == cls && studentIds.Contains(s.StudentID))
                .Select(s => s.ParentPhone)
                .ToListAsync();
            var phoneNumbers = string.Join(",", parentPhones);
            
            
            using var httpClient = new HttpClient();
            string baseUrl = "https://api.smartping.ai/fe/api/v1/multiSend";
            var query = new Dictionary<string, string>
            {
                { "username", "vsngrp.trans" },
                { "password", "VsnGrp@*2025" },
                { "unicode", "false" },
                { "from", "VSNGRS" },
                { "to", phoneNumbers },
                { "dltContentId", "1707175515747111895" },
                { "dltPrincipalEntityId", "1401834120000042403" },
                { "text", "Independence Day! 70% Off on Meta WhatsApp-0.25/msg\nSMS-0.13/msg\nRCS-0.135/msg\nVoice-0.18/30s\nDigital Marketing SEO+Website under 15k\nPh: 9912719111\nVSN Groups" }
            };
            var uri = QueryHelpers.AddQueryString(baseUrl, query);
            await httpClient.GetAsync(uri);
            return _context.SaveChanges();
        }

        public void UpdateMark(Mark mark)
        {
            _context.Marks.Update(mark);
            _context.SaveChanges();
        }

        public void DeleteMark(int id)
        {
            var mark = _context.Marks.FirstOrDefault(m => m.MarkID == id);
            if (mark != null)
            {
                _context.Marks.Remove(mark);
                _context.SaveChanges();
            }
        }
    }
}
