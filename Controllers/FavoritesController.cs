using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebBack_Lab_2.Data;
using WebBack_Lab_2.Models;

namespace WebBack_Lab_2.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
            private readonly AppDbContext _context;
            private readonly UserManager<AppUser> _userManager;

            public FavoritesController(AppDbContext context, UserManager<AppUser> userManager)
            {
                _context = context;
                _userManager = userManager;
            }

            [HttpPost("{productId}")]
            public async Task<IActionResult> ToggleFavorite(int productId)
            {
                var user = await _userManager.GetUserAsync(User);
                var existing = await _context.Favorites
                    .FirstOrDefaultAsync(f => f.UserId == user.Id && f.ProductId == productId);

                if (existing != null)
                {
                    _context.Favorites.Remove(existing);
                }
                else
                {
                    _context.Favorites.Add(new Favorite { UserId = user.Id, ProductId = productId });
                }

                await _context.SaveChangesAsync();
                return Ok();
            }

            [HttpGet]
            public async Task<ActionResult<IEnumerable<Product>>> GetUserFavorites()
            {
                var user = await _userManager.GetUserAsync(User);

                var favorites = await _context.Favorites
                    .Where(f => f.UserId == user.Id)
                    .Select(f => f.Product)
                    .ToListAsync();

                return Ok(favorites);
            }

            [HttpGet("ids")]
            public async Task<ActionResult<IEnumerable<int>>> GetUserFavoriteProductIds()
            {
                var user = await _userManager.GetUserAsync(User);
                var ids = await _context.Favorites
                    .Where(f => f.UserId == user.Id)
                    .Select(f => f.ProductId)
                    .ToListAsync();

                return Ok(ids);
            }
        }

    }
