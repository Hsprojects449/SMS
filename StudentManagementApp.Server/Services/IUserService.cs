using SchoolApp.Models;
using System.Collections.Generic;

namespace SchoolApp.Services
{
    public interface IUserService
    {
        IEnumerable<User> GetAllUsers();
        User GetUserById(string id);
        string CreateUser(User user);
        void UpdateUser(User user);
        void DeleteUser(string id);
    }
}