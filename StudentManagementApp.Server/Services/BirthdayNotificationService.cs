using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SchoolApp.Services;
using SchoolApp.Models;
using Microsoft.AspNetCore.WebUtilities;

public class BirthdayNotificationService : BackgroundService
{
    private readonly ILogger<BirthdayNotificationService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly HttpClient _httpClient;

    public BirthdayNotificationService(
        ILogger<BirthdayNotificationService> logger,
        IServiceProvider serviceProvider,
        IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _httpClient = httpClientFactory.CreateClient();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.Now;
            var nextRun = now.Date.AddHours(9);
            if (now > nextRun)
                nextRun = nextRun.AddDays(1);
            var delay = nextRun - now;
            _logger.LogInformation($"Birthday service sleeping for {delay.TotalMinutes} minutes until {nextRun}");

            await Task.Delay(delay, stoppingToken);
            await SendBirthdayNotificationsAsync();
        }
    }

    private async Task SendBirthdayNotificationsAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<SchoolContext>();

        var today = DateTime.Today;
        var birthdayStudents = dbContext.Students
            .Where(s => s.DOB.Month == today.Month && s.DOB.Day == today.Day)
            .ToList();

        foreach (var user in birthdayStudents)
        {
            var payload = new
            {
                messaging_product = "whatsapp",
                to = user.ParentPhone,
                type = "template",
                template = new
                {
                    name = "order_re",
                    language = new { code = "en" },
                    components = new object[]
                    {
                        new {
                            type = "body",
                            parameters = new object[]
                            {
                                new { type = "text", text = user.Name }
                            }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var request = new HttpRequestMessage(HttpMethod.Post, "https://partnersv1.pinbot.ai/v3/620543314475754/messages");
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            request.Headers.Add("APIKey", "69586149-1c61-11f0-8cb4-02c8a5e042bd");

            var response = await _httpClient.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();

            _logger.LogInformation($"Sent birthday message to {user.Name} ({user.ParentPhone}). API response: {body}");
        }
    }
}
