using Microsoft.AspNetCore.Mvc;
using Server.BL;
using System.Text.Json;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouplesController : ControllerBase
    {
        [HttpPost("getCouple")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Couple))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Couple> GetCouple([FromBody] JsonElement coupleData)
        {

            try
            {
                string email = coupleData.GetProperty("Email").GetString();
                string password = coupleData.GetProperty("Password").GetString();
                Couple couple = Couple.FindCouple(email, password);

                if (couple == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(couple);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
            }
        }
        [HttpPost("insertCouple")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Couple))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Couple> InsertCouple([FromBody] Couple couple)
        {
            try
            {
                if (couple == null)
                {
                    return BadRequest("Couple data is null.");
                }

                // Attempt to insert the couple into the database
                int rowsAffected = couple.InsertCouple();

                // When creating a new couple, it also creates an empty package so two tables are affected
                if (rowsAffected == 1)
                {

                    // Create a JsonElement from the couple object
                    JsonElement coupleData = JsonDocument.Parse(JsonSerializer.Serialize(couple)).RootElement;
                    return GetCouple(coupleData);
                }
                else
                {
                    return BadRequest("Failed to register couple.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while registering couple." + ex.Message);
            }
        }
    }
}
