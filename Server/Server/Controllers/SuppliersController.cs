
using Microsoft.AspNetCore.Mvc;
using Server.BL;
using System.Data.SqlClient;
using System.Text.Json;


namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController : Controller
    {


        //--------------------------------------------------------------------
        // Retrieves a list of top venues from the database.
        //--------------------------------------------------------------------
        // GET: api/Supplier/getTopVenues
        [HttpGet("getTopVenues")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Supplier>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<List<Supplier>> GetTopVenues()
        {
            try
            {
                // Retrieve list of top venues synchronously
                List<Supplier> suppliers = Supplier.GetTopVenues();

                if (suppliers == null)
                {
                    // No venues found, return 404 Not Found status code
                    return NotFound();
                }

                // Return the list of top venues with 200 OK status code
                return Ok(suppliers);
            }
            catch (Exception e)
            {
                // Handle internal server error and return 500 Internal Server Error status code
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }


        //  ****************   Currently not in use   ****************  \\

        //-------------------------------------------
        // Inserts a supplier object into the database
        //-------------------------------------------
        [HttpPost("registerSupplier")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Supplier))] // Response type for a successful insertion
        [ProducesResponseType(StatusCodes.Status409Conflict)] // Response type for a primary key violation
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Response type for a bad request
        [ProducesResponseType(StatusCodes.Status500InternalServerError)] // Response type for an internal server error
        public ActionResult<Supplier> PostCouple([FromBody] Supplier supplier)
        {
            try
            {
                // Check if couple object is null
                if (supplier == null)
                {
                    return BadRequest("Couple data is null.");
                }

                // Attempt to insert the couple into the database
                int rowsAffected = supplier.InsertSupplier();

                // When creating a new couple, it also creates an empty package so two tables are affected
                if (rowsAffected == 1)
                {
                    // Create a new anonymous object with necessary data for logging in
                    var supplierData = new
                    {
                        Email = supplier.SupplierEmail,
                        Password = supplier.Password
                    };

                    // Create a JsonElement from the anonymous object
                    JsonElement jsonSupplierData = JsonDocument.Parse(JsonSerializer.Serialize(supplierData)).RootElement;

                    // Call GetCouple to retrieve the newly inserted couple
                    return null /*GetSupplier(jsonSupplierData);*/;
                }
                else
                {
                    // If insertion failed, return a BadRequest response
                    return BadRequest("Failed to register couple.");
                }
            }

            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
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
                // Handle other types of exceptions
                throw new Exception("An error occurred while inserting a new couple in the InsertCouple method" + ex.Message);
            }

        }

    }
}
