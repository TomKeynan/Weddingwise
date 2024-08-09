using Microsoft.AspNetCore.Mvc;
using Server.BL;
using Server.DAL;
using System;
using System.Collections.Generic;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        [HttpPost("addExpense")]
        public ActionResult AddExpense([FromBody] Expense expense)
        {
            try
            {
                DBServicesExpense dbServicesExpense = new DBServicesExpense();
                int result = dbServicesExpense.InsertExpense(expense);
                if (result > 0)
                {
                    return Ok(expense);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("getExpenses")]
        public ActionResult<List<Expense>> GetExpenses(string coupleEmail)
        {
            try
            {
                DBServicesExpense dbServicesExpense = new DBServicesExpense();
                List<Expense> expenses = dbServicesExpense.GetExpenses(coupleEmail);
                return Ok(expenses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("deleteExpense/{id}")]
        public ActionResult DeleteExpense(int id)
        {
            try
            {
                DBServicesExpense dbServicesExpense = new DBServicesExpense();
                int result = dbServicesExpense.DeleteExpense(id);
                if (result > 0)
                {
                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}