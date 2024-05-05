using Microsoft.AspNetCore.Mvc;
using Server.BL;
using System.Text.Json;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouplesController : ControllerBase
    {


        //------------------------------------------------
        // Retrieves the couple's object from the database
        //------------------------------------------------
        [HttpPost("getCouple")] // Attribute specifying the HTTP method and route template
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Couple))] // Attribute for specifying the expected HTTP response types
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Couple> GetCouple([FromBody] JsonElement coupleData) // Method signature specifying input parameters and return type
        {
            try
            {
                // Extract email and password from the JSON data
                string email = coupleData.GetProperty("Email").GetString();
                string password = coupleData.GetProperty("Password").GetString();

                // Call a method to find the couple based on email and password
                Couple couple = Couple.FindCouple(email, password);

                // Check if couple is not found, return NotFound response
                if (couple == null)
                {
                    return NotFound();
                }
                // Check if couple is inactive, return Unauthorized response
                if (couple.IsActive == false)
                {
                    return Unauthorized();
                }
                // If couple is found and active, return OK response with couple object
                else
                {
                    return Ok(couple);
                }
            }
            catch (Exception ex)
            {
                // Return a BadRequest response with the exception message in case of an error
                return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
            }
        }



        //-------------------------------------------
        // Inserts a couple object into the database
        //-------------------------------------------
        [HttpPost("insertCouple")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Couple))] // Response type for a successful insertion
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Response type for a bad request
        [ProducesResponseType(StatusCodes.Status500InternalServerError)] // Response type for an internal server error
        public ActionResult<Couple> InsertCouple([FromBody] Couple couple)
        {
            try
            {
                // Check if couple object is null
                if (couple == null)
                {
                    return BadRequest("Couple data is null.");
                }

                // Attempt to insert the couple into the database
                int rowsAffected = couple.InsertCouple();

                // When creating a new couple, it also creates an empty package so two tables are affected
                if (rowsAffected == 1)
                {
                    // Create a new anonymous object with necessary data for logging in
                    var coupleData = new
                    {
                        Email = couple.Email,
                        Password = couple.Password
                    };

                    // Create a JsonElement from the anonymous object
                    JsonElement jsonCoupleData = JsonDocument.Parse(JsonSerializer.Serialize(coupleData)).RootElement;

                    // Call GetCouple to retrieve the newly inserted couple
                    return GetCouple(jsonCoupleData);
                }
                else
                {
                    // If insertion failed, return a BadRequest response
                    return BadRequest("Failed to register couple.");
                }
            }
            catch (Exception ex)
            {
                // Return a 500 Internal Server Error response with the error message
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while registering couple: " + ex.Message);
            }
        }






    }
}
