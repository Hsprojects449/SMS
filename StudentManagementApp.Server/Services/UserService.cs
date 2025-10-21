using SchoolApp.Models;
using System.Collections.Generic;
using System.Linq;

namespace SchoolApp.Services
{
    public class UserService : IUserService
    {
        private readonly SchoolContext _context;

        public UserService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAllUsers() => _context.Users.ToList();

        public User GetUserById(string id) => _context.Users.Find(id);
// _context.Users.FirstOrDefault(u => u.UserID == id);
        public string CreateUser(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user.UserID;
        }

        public void UpdateUser(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void DeleteUser(string id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }
    }
}