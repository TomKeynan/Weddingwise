using Microsoft.AspNetCore.Mvc;
using Server.BL;
using Server.DAL;
using System.Collections.Generic;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InviteesController : ControllerBase
    {
        [HttpPost("addInvitee")]
        public ActionResult AddInvitee([FromBody] Invitee invitee)
        {
            try
            {
                DBServicesInvitee dbServicesInvitee = new DBServicesInvitee();
                int result = dbServicesInvitee.InsertInvitee(invitee);
                if (result > 0)
                {
                    return Ok(invitee);
                }
                else
                {
                    return BadRequest("Failed to add invitee.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("getInvitees")]
        public ActionResult<List<Invitee>> GetInvitees(string coupleEmail)
        {
            try
            {
                List<Invitee> invitees = Invitee.GetInvitees(coupleEmail);
                return Ok(invitees);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("deleteInvitee/{id}")]
        public ActionResult DeleteInvitee(int id)
        {
            try
            {
                DBServicesInvitee dbServicesInvitee = new DBServicesInvitee();
                int result = dbServicesInvitee.DeleteInvitee(id);
                if (result > 0)
                {
                    return Ok();
                }
                else
                {
                    return NotFound("Invitee not found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
