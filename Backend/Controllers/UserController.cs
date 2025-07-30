using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using WebBack_Lab_2.Backend.Data;

[Route("api/user")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IMemoryCache _cache;

    public UserController(UserManager<AppUser> userManager, IMemoryCache cache)
    {
        _userManager = userManager;
        _cache = cache;
    }

    [HttpGet("username")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User")]
    public IActionResult GetUsername()
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return NotFound("Пользователь не найден");
        }
        return Ok(new { Greeting = $"Здравствуйте, {username}!", Username = username });
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return BadRequest("Пользователь с таким email не найден");
        }

        
        var cacheKey = $"ResetPassword_{request.Email}";
        if (_cache.TryGetValue(cacheKey, out _))
        {
            return BadRequest("Пожалуйста, подождите 2 минуты перед повторным запросом кода.");
        }

        
        var code = await _userManager.GeneratePasswordResetTokenAsync(user);

        
        Console.WriteLine($"Код для {request.Email}: {code}");

       
        _cache.Set(cacheKey, true, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2)
        });

        return Ok(new { Message = "Код сгенерирован и выведен в консоль сервера", Code = code });
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return BadRequest("Пользователь с таким email не найден");
        }

        // Проверяем токен и обновляем пароль
        var result = await _userManager.ResetPasswordAsync(user, request.Code, request.NewPassword);
        if (!result.Succeeded)
        {
            return BadRequest("Неверный код или ошибка при смене пароля");
        }

        // Удаляем кэш после успешного сброса
        var cacheKey = $"ResetPassword_{request.Email}";
        _cache.Remove(cacheKey);

        return Ok("Пароль успешно изменен");
    }
}

public class ForgotPasswordRequest
{
    public string Email { get; set; }
}

public class ResetPasswordRequest
{
    public string Email { get; set; }
    public string Code { get; set; }
    public string NewPassword { get; set; }
}