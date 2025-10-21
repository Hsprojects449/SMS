using SchoolApp.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace SchoolApp.Services
{
    public class TimetableService : ITimetableService
    {
        private readonly SchoolContext _context;

        public TimetableService(SchoolContext context)
        {
            _context = context;
        }
        public async Task<int> AddTimetableAsync(List<TimetableDto> timetables)
        {
            var classId = timetables.First().ClassID;
            var existingTimeTables = _context.Timetables
                .Where(t => t.ClassID == classId)
                .ToList();

            foreach (var timetbl in timetables)
            {
                if (timetbl.PeriodID.StartsWith("new"))
                {
                    var startTime = TimeSpan.Parse(timetbl.From);
                    var endTime = TimeSpan.Parse(timetbl.To);
                    var existingPeriod = await _context.Periods
                        .FirstOrDefaultAsync(p => p.StartTime == startTime && p.EndTime == endTime);

                    Period periodToUse;

                    if (existingPeriod != null)
                    {
                        periodToUse = existingPeriod;
                    }
                    else
                    {
                        periodToUse = new Period
                        {
                            StartTime = startTime,
                            EndTime = endTime
                        };
                        _context.Periods.Add(periodToUse);
                        await _context.SaveChangesAsync();
                    }
                    _context.Timetables.Add(new Timetable
                    {
                        ClassID = timetbl.ClassID,
                        DayOfWeek = timetbl.DayOfWeek,
                        PeriodID = periodToUse.PeriodID,
                        SyllabusID = timetbl.SyllabusID
                    });
                }
                else if (int.TryParse(timetbl.PeriodID, out var periodId))
                {
                    var existing = existingTimeTables.FirstOrDefault(m =>
                        m.DayOfWeek == timetbl.DayOfWeek &&
                        m.PeriodID == periodId
                    );

                    if (existing != null)
                    {
                        existing.SyllabusID = timetbl.SyllabusID;
                    }
                    else
                    {
                        _context.Timetables.Add(new Timetable
                        {
                            ClassID = timetbl.ClassID,
                            DayOfWeek = timetbl.DayOfWeek,
                            PeriodID = periodId,
                            SyllabusID = timetbl.SyllabusID
                        });
                    }
                }
                else
                {
                    throw new Exception($"Invalid PeriodId: {timetbl.PeriodID}");
                }
            }

            await _context.SaveChangesAsync();
            return timetables.Count;
        }

        public async Task<IEnumerable<Timetable>> GetTimetablesAsync()
        {
            return await _context.Timetables
                .Include(t => t.Period)
                .Include(t => t.Class)
                .Include(t => t.Syllabus)
                .Include(t => t.Teacher)
                .ToListAsync();
        }

        public async Task<object> GetTimetableByIdAsync(int id)
        {
            // var timetables = _context.Timetables
            //     .Include(t => t.Period)
            //     .Include(t => t.Class)
            //     .Include(t => t.Syllabus)
            //     .Include(t => t.Teacher)
            //     .Where(t => t.ClassId == id)
            //     .ToList();
            // var dayOrder = new[]
            // {
            //     DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday,
            //     DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday
            // };

            // var periodNumbers = timetables
            //     .Select(t => t.Period.PeriodNumber)
            //     .Distinct()
            //     .OrderBy(n => n)
            //     .ToList();

            // var cellLookup = timetables.ToLookup(
            //     t => ((int)t.DayOfWeek, t.Period.PeriodNumber),
            //     t => new
            //     {
            //     Text = (t.Syllabus?.Name ?? string.Empty) +
            //     (t.Teacher != null ? " (" + t.Teacher.Name + ")" : string.Empty)
            //     });

            // var columns = new List<object> { new { field = "Day", headerName = "Day" } };

            // foreach (var n in periodNumbers)
            // {
            //     var anyForPeriod = timetables.FirstOrDefault(t => t.Period.PeriodNumber == n)?.Period;
            //     string start = anyForPeriod?.StartTime != null ? anyForPeriod.StartTime.ToString() : null;
            //     string end = anyForPeriod?.EndTime != null ? anyForPeriod.EndTime.ToString() : null;

            //     columns.Add(new
            //     {
            //         field = "P" + n,
            //         headerName = "Period " + n,
            //         PeriodNumber = n,
            //         StartTime = start,
            //         EndTime = end
            //     });
            // }

            // var rows = new List<Dictionary<string, object>>();
            // foreach (var day in dayOrder)
            // {
            //     var row = new Dictionary<string, object>
            //     {
            //         ["id"] = (int)day, 
            //         ["Day"] = Enum.GetName(typeof(DayOfWeek), day)
            //     };

            //     foreach (var n in periodNumbers)
            //     {
            //         var entry = cellLookup[((int)day, n)].FirstOrDefault();
            //         row["P" + n] = entry != null ? entry.Text : string.Empty;
            //     }

            //     rows.Add(row);
            // }

            var timetables = _context.Timetables
                .Include(t => t.Period)
                .Include(t => t.Class)
                .Include(t => t.Syllabus)
                .Include(t => t.Teacher)
                .Where(t => t.ClassID == id)
                .ToList();
            return new
            {
                timetables
            };
        }

        public async Task<IEnumerable<Timetable>> GetClassTimetableAsync(int classId, int dayOfWeek)
        {
            return await _context.Timetables
                .Include(t => t.Period)
                .Include(t => t.Syllabus)
                .Where(t => t.ClassID == classId && t.DayOfWeek == dayOfWeek)
                .ToListAsync();
        }

        public async Task<bool> DeleteTimetableAsync(int id)
        {
            var timetable = await _context.Timetables.FindAsync(id);
            if (timetable == null) return false;

            _context.Timetables.Remove(timetable);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}