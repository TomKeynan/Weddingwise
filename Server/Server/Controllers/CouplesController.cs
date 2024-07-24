using Microsoft.AspNetCore.Mvc;
using Server.BL;
using System.Data.SqlClient;
using System.Text.Json;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouplesController : ControllerBase
    {

        //-------------------------------------------
        // Inserts a couple object into the database
        //-------------------------------------------
        [HttpPost("registerCouple")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Couple))] // Response type for a successful insertion
        [ProducesResponseType(StatusCodes.Status409Conflict)] // Response type for a primary key violation
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Response type for a bad request
        [ProducesResponseType(StatusCodes.Status500InternalServerError)] // Response type for an internal server error
        public ActionResult<Couple> PostCouple([FromBody] Couple couple)
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


                    Tasks.insertCoupleInitialTasks(couple.Email);

                    // Create a JsonElement from the anonymous object
                    JsonElement jsonCoupleData = JsonDocument.Parse(JsonSerializer.Serialize(coupleData)).RootElement;

                    // After successfuly registered the couple will automatically log in

                    // Call GetCouple to retrieve the newly registered couple
                    return GetCouple(jsonCoupleData);
                }
                else
                {
                    // If insertion failed, return a BadRequest response
                    return BadRequest("Failed to register couple.");
                }
            }
            catch (SqlException ex)
            {
                if (ex.Number == 2627) // Primary key violation error number
                {
                    // Handle primary key violation error
                    return Conflict("Duplicate primary key value. Please provide a unique primary key.");
                }
                else
                {
                    // Handle other types of SQL exceptions
                    return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
                }
            }
            catch (Exception ex)
            {
                // Return a BadRequest response with the exception message in case of an error
                return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
            }
        }

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
                // Check if the received couple data is null
                if (coupleData.ValueKind == JsonValueKind.Null)
                {
                    throw new ArgumentNullException(nameof(coupleData), "The JSON data for the couple is null.");
                }

                // Extract email and password from the JSON data
                string email = coupleData.GetProperty("Email").GetString();
                string password = coupleData.GetProperty("Password").GetString();

                if (email == null || password == null)
                {
                    throw new ArgumentNullException("The email or the password that were sent are empty");
                }

                // Call a method to find the couple based on email and password
                Couple couple = Couple.FindCouple(email, password);

                if (couple == null)
                {
                    return NotFound("User wasn't found. Check your email or password");
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
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                // Return a BadRequest response with the exception message in case of an error
                return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
            }
        }

        //--------------------------------------------------------------------
        // You can guess what this method does.
        //--------------------------------------------------------------------
        [HttpPut("updateCouple")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult PutCouple([FromBody] Couple couple)
        {
            try
            {
                // Check if the received couple data is null
                if (couple == null)
                {
                    throw new ArgumentNullException(nameof(couple), "The couple's object is null");
                }

                // Attempt to update the couple in the database
                if (couple.UpdateCouple() == 1)
                {
                    return NoContent(); // Return 204 NoContent for successful update
                }

                else
                {
                    // Throw an exception if the update operation was not successful
                    throw new Exception("The update wasn't successful");
                }
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception e)
            {
                // Return a BadRequest response with the error message
                return BadRequest($"Error: {e.Message}");
            }
        }
    }
}
