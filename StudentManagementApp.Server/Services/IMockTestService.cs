using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IMockTestService
    {
        IEnumerable<MockTest> GetAllMockTests();
        MockTest GetMockTestById(int id);
        List<MockTest> GetMockTestforStudent(string cls, string subject);
        int AddMockTest(MockTest mockTest);
        void UpdateMockTest(MockTest mockTest);
        Task<bool> UpdateMockTestStatusAsync(int testId, bool newStatus);
        void DeleteMockTest(int id);
    }
}
