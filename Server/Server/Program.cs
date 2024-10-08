﻿var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(p => p.AddPolicy("myPolicy", build =>
build.AllowAnyOrigin() // מאפשר כל מקור
.AllowAnyHeader() // נגיד רק שמוסיף אקספט או האדר מסוים
.AllowAnyMethod())); //  (מאפשר כל מטודה (רסט


var app = builder.Build();

// Configure the HTTP request pipeline.
if (true)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("myPolicy"); // להוסיף
app.UseAuthorization();

app.MapControllers();

app.Run();
