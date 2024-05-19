using Microsoft.AspNetCore.Mvc;
using Server.BL;
using Server.DAL;
using System.Collections.Generic;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        [HttpPost("addTask")]
        public ActionResult AddTask([FromBody] Tasks task)
        {
            try
            {
                DBServicesTask dbServicesTask = new DBServicesTask();
                int result = dbServicesTask.InsertTask(task);
                if (result > 0)
                {
                    return Ok("Task added successfully.");
                }
                else
                {
                    return BadRequest("Failed to add task.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("addSubTask")]
        public ActionResult AddSubTask([FromBody] SubTask subTask)
        {
            try
            {
                DBServicesTask dbServicesTask = new DBServicesTask();
                int result = dbServicesTask.InsertSubTask(subTask);
                if (result > 0)
                {
                    return Ok("SubTask added successfully.");
                }
                else
                {
                    return BadRequest("Failed to add subtask.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("getTasks")]
        public ActionResult<List<Tasks>> GetTasks([FromQuery] string coupleEmail)
        {
            try
            {
                if (string.IsNullOrEmpty(coupleEmail))
                {
                    return BadRequest("couple_email is required.");
                }

                DBServicesTask dbServicesTask = new DBServicesTask();
                List<Tasks> tasks = dbServicesTask.GetTasks(coupleEmail);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpPut("updateTask")]
        public ActionResult UpdateTask([FromBody] Tasks task)
        {
            try
            {
                DBServicesTask dbServicesTask = new DBServicesTask();
                int result = dbServicesTask.UpdateTask(task);
                if (result > 0)
                {
                    return Ok("Task updated successfully.");
                }
                else
                {
                    return BadRequest("Failed to update task.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
