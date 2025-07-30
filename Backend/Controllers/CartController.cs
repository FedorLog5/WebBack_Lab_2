using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebBack_Lab_2.Backend.Data;
using WebBack_Lab_2.Backend.Models;
using WebBack_Lab_2.Backend.DTOs;


namespace WebBack_Lab_2.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // Получить корзину текущего пользователя
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.AppUserId == userId);

            if (cart == null || cart.CartItems.Count == 0)
            {
                return Ok(new CartDto()); // Пустая корзина
            }

            var cartDto = new CartDto
            {
                CartItems = cart.CartItems.Select(ci => new CartItemDto
                {
                    ProductId = ci.ProductId,
                    ProductName = ci.Product.Name,
                    Price = ci.Product.Price,
                    Quantity = ci.Quantity
                }).ToList()
            };

            return Ok(cartDto);
        }

        // Добавить товар в корзину
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.AppUserId == userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    AppUserId = userId
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            var existingItem = cart.CartItems.FirstOrDefault(i => i.ProductId == request.ProductId);
            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                cart.CartItems.Add(new CartItem
                {
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Товар добавлен в корзину" });
        }

        // Удалить товар из корзины
        [HttpDelete("remove/{productId}")]
        public async Task<IActionResult> RemoveFromCart(int productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.AppUserId == userId);

            if (cart == null)
                return NotFound("Корзина не найдена");

            var item = cart.CartItems.FirstOrDefault(i => i.ProductId == productId);
            if (item == null)
                return NotFound("Товар не найден в корзине");

            cart.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Товар удалён из корзины" });
        }

        // Обновить количество товара
        [HttpPut("update")]
        public async Task<IActionResult> UpdateQuantity([FromBody] UpdateCartItemRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.AppUserId == userId);

            if (cart == null)
                return NotFound("Корзина не найдена");

            var item = cart.CartItems.FirstOrDefault(i => i.ProductId == request.ProductId);
            if (item == null)
                return NotFound("Товар не найден в корзине");

            item.Quantity = request.Quantity;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Количество обновлено" });
        }
    }
}
