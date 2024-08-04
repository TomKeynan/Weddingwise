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
                    return Ok(task);
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

        [HttpPut("updateTask")]
        public ActionResult UpdateTask([FromBody] Tasks task)
        {
            try
            {
                DBServicesTask dbServicesTask = new DBServicesTask();
                int result = dbServicesTask.updateTask(task);
                if (result > 0)
                {
                    return Ok(task);
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
        [HttpDelete("deleteTask/{taskId}")]
        public ActionResult DeleteTask(int taskId)
        {
            try
            {
                DBServicesTask dbServicesTask = new DBServicesTask();
                int result = dbServicesTask.DeleteTask(taskId);
                if (result > 0)
                {
                    return Ok($"Task with ID {taskId} deleted successfully.");
                }
                else
                {
                    return NotFound($"Task with ID {taskId} not found or could not be deleted.");
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
                    return Ok(subTask);
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

        [HttpDelete("deleteSubTask/{subTaskId}")]
        public ActionResult DeleteSubTask(int subTaskId)
        {
            try
            {
                DBServicesTask dbServicesTask = new DBServicesTask();
                int result = dbServicesTask.DeleteSubTask(subTaskId);
                if (result > 0)
                {
                    return Ok($"SubTask with ID {subTaskId} deleted successfully.");
                }
                else
                {
                    return NotFound($"SubTask with ID {subTaskId} not found or could not be deleted.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("getTasks")]
        public ActionResult<List<Tasks>> GetTasks(string coupleEmail)
        {
            try
            {
                DBServicesTask dbServicesTask = new DBServicesTask();
                List<Tasks> tasks = dbServicesTask.GetTasks(coupleEmail);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

    }
}
