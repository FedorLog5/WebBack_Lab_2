using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebBack_Lab_2.Backend.Data;
using WebBack_Lab_2.Backend.Models;

namespace WebBack_Lab_2.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User")]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpPost("process")]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Пользователь не авторизован");
            }

            

          
            var purchase = new PurchaseHistory
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Products = JsonSerializer.Serialize(request.Products),
                PurchaseDate = DateTime.UtcNow
            };

            _context.PurchaseHistory.Add(purchase);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Платёж успешно обработан" });
        }

        
        [HttpGet("history")]
        public async Task<IActionResult> GetPurchaseHistory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Пользователь не авторизован");
            }

            var history = await _context.PurchaseHistory
                .Where(ph => ph.UserId == userId)
                .OrderByDescending(ph => ph.PurchaseDate)
                .ToListAsync();

            return Ok(history);
        }
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Пользователь не авторизован");
            }

            
            var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.AppUserId == userId);

            if (cart == null)
            {
                return Ok(new { Message = "Корзина не найдена или пуста" });
            }

           
            var cartItems = await _context.CartItems
                .Where(ci => ci.CartId == cart.Id)
                .ToListAsync();

            if (cartItems.Any())
            {
                _context.CartItems.RemoveRange(cartItems);
                await _context.SaveChangesAsync();
            }

            return Ok(new { Message = "Корзина успешно очищена" });
        }
    }
}
