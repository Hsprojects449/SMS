using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class MockTestService : IMockTestService
    {
        private readonly SchoolContext _context;

        public MockTestService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<MockTest> GetAllMockTests() => _context.MockTests.ToList();

        public MockTest GetMockTestById(int id) => _context.MockTests.FirstOrDefault(mt => mt.TestID == id);
        public List<MockTest> GetMockTestforStudent(string cls, string subject) => _context.MockTests.Where(mt => mt.Class == cls && mt.Subject == subject).ToList();

        public int AddMockTest(MockTest mockTest)
        {
            _context.MockTests.Add(mockTest);
            _context.SaveChanges();
            return mockTest.TestID;
        }

        public void UpdateMockTest(MockTest mockTest)
        {
            _context.MockTests.Update(mockTest);
            _context.SaveChanges();
        }

        public async Task<bool> UpdateMockTestStatusAsync(int testId, bool newStatus)
        {
            var mockTest = await _context.MockTests.FindAsync(testId);
            if (mockTest == null)
            {
                return false;
            }
            mockTest.Status = newStatus;
            _context.MockTests.Update(mockTest);
            await _context.SaveChangesAsync();
            return true;
        }

        public void DeleteMockTest(int id)
        {
            var mockTest = _context.MockTests.FirstOrDefault(mt => mt.TestID == id);
            if (mockTest != null)
            {
                _context.MockTests.Remove(mockTest);
                _context.SaveChanges();
            }
        }
    }
}
