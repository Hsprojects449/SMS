using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{  
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            return Ok(_userService.GetAllUsers());
        }
        // public IActionResult Index()
        // {
        //     return View(_userService.GetAllUsers());
        // }

        [HttpGet("{id}")]
        public IActionResult GetUserById(string id)
        {
            var user = _userService.GetUserById(id);
            if (user == null) return NotFound();
            return Ok(user);
        }
        // public IActionResult Details(int id)
        // {
        //     var user = _userService.GetUserById(id);
        //     if (user == null) return NotFound();
        //     return View(user);
        // }

        // public IActionResult Create() => View();

        [HttpPost]
        public IActionResult CreateUser([FromBody] User user)
        {
            _userService.CreateUser(user);
            return CreatedAtAction(nameof(GetUserById), new { id = user.UserID }, user);
        }
        // public IActionResult Create(User user)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         _userService.CreateUser(user);
        //         return RedirectToAction("Index");
        //     }
        //     return View(user);
        // }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(string id, [FromBody] User user)
        {
            if (id != user.UserID) return BadRequest();
            _userService.UpdateUser(user);
            return NoContent();
        }
        // public IActionResult Edit(int id)
        // {
        //     var user = _userService.GetUserById(id);
        //     if (user == null) return NotFound();
        //     return View(user);
        // }

        // [HttpPost]
        // public IActionResult Edit(User user)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         _userService.UpdateUser(user);
        //         return RedirectToAction("Index");
        //     }
        //     return View(user);
        // }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(string id)
        {
            _userService.DeleteUser(id);
            return NoContent();
        }
        // public IActionResult Delete(int id)
        // {
        //     var user = _userService.GetUserById(id);
        //     if (user == null) return NotFound();
        //     return View(user);
        // }

        // [HttpPost, ActionName("Delete")]
        // public IActionResult DeleteConfirmed(int id)
        // {
        //     _userService.DeleteUser(id);
        //     return RedirectToAction("Index");
        // }
    }
}