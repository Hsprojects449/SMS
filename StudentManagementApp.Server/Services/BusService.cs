using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;
using Newtonsoft.Json;

namespace SchoolApp.Services
{
    public class BusService : IBusService
    {
        private readonly SchoolContext _context;

        public BusService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<Bus> GetAllBuses() => _context.Buses.ToList();

        public Bus GetBusById(int id) => _context.Buses.FirstOrDefault(ca => ca.BusID == id);

        // public int AddBus(Bus bus)
        // {
        //     _context.Buses.Add(bus);
        //     _context.SaveChanges();
        //     return bus.BusID;
        // }

        // public void UpdateBus(Bus bus)
        // {
        //     _context.Buses.Update(bus);
        //     _context.SaveChanges();
        // }

        public int AddBus(Bus bus)
        {
            _context.Buses.Add(bus);
            _context.SaveChanges();
            UpdateAssignedStudents(bus.AssignedUsers, bus.BusID);
            return bus.BusID;
        }

        public void UpdateBus(Bus bus)
        {
            _context.Buses.Update(bus);
            _context.SaveChanges();
            RemoveAssignedStudents(bus.RemovedUsers);
            UpdateAssignedStudents(bus.AssignedUsers, bus.BusID);
        }

        private void UpdateAssignedStudents(string assignedUsersJson, int busId)
        {
            if (string.IsNullOrEmpty(assignedUsersJson))
                return;

            try
            {
                var studentIds = JsonConvert.DeserializeObject<List<Guid>>(assignedUsersJson);

                foreach (var ID in studentIds)
                {
                    var student = _context.Students.FirstOrDefault(s => s.StudentID == ID);
                    if (student != null)
                    {
                        student.AssignedBusID = busId;
                    }
                    else
                    {
                        var teacher = _context.Teachers.FirstOrDefault(s => s.TeacherID == ID);
                        if (teacher != null)
                        {
                            teacher.AssignedBusID = busId;
                        }
                    }
                }
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating assigned students: {ex.Message}");
            }
        }
        
        public void RemoveAssignedStudents(string removedUsersJson)
        {
            if (string.IsNullOrEmpty(removedUsersJson))
                return;

            try
            {
                var removedStudentIds = JsonConvert.DeserializeObject<List<Guid>>(removedUsersJson);

                foreach (var ID in removedStudentIds)
                {
                    var student = _context.Students.FirstOrDefault(s => s.StudentID == ID);
                    if (student != null)
                    {
                        student.AssignedBusID = null;
                    }
                    else
                    {
                        var teacher = _context.Teachers.FirstOrDefault(s => s.TeacherID == ID);
                        if (teacher != null)
                        {
                            teacher.AssignedBusID = null;
                        }
                    }
                }

                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error removing assigned students: {ex.Message}");
            }
        }

        public void DeleteBus(int id)
        {
            var bus = _context.Buses.FirstOrDefault(ca => ca.BusID == id);
            if (bus != null)
            {
                _context.Buses.Remove(bus);
                _context.SaveChanges();
            }
        }
    }
}
