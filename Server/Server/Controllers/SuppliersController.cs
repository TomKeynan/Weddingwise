
using Microsoft.AspNetCore.Mvc;
using Server.BL;
using Server.DAL;
using System.Data.SqlClient;
using System.Text.Json;


namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController : Controller
    {


        //-------------------------------------------
        // Inserts a supplier object into the database
        //-------------------------------------------
        [HttpPost("registerSupplier")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Supplier))] // Response type for a successful insertion
        [ProducesResponseType(StatusCodes.Status409Conflict)] // Response type for a primary key violation
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Response type for a bad request
        [ProducesResponseType(StatusCodes.Status500InternalServerError)] // Response type for an internal server error
        public ActionResult<Supplier> PostSupplier([FromBody] Supplier supplier)
        {
            try
            {
                // Check if couple object is null
                if (supplier == null)
                {
                    return BadRequest("Supplier data is null.");
                }
                // Attempt to insert the supplier into the database
                int rowsAffected = supplier.InsertSupplier();

                // If the insertion was successful
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

                    // After successfuly registered the couple will automatically log in

                    // Call GetCouple to retrieve the newly registered couple


                    return Ok();

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
        // Retrieves the supplier's object from the database
        //------------------------------------------------
        [HttpPost("getSupplier")] // Attribute specifying the HTTP method and route template
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Supplier))] // Attribute for specifying the expected HTTP response types
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Supplier> GetSupplier([FromBody] JsonElement supplierData) // Method signature specifying input parameters and return type
        {
            try
            {
                // Check if the received couple data is null
                if (supplierData.ValueKind == JsonValueKind.Null)
                {
                    throw new ArgumentNullException(nameof(supplierData), "The JSON data for the couple is null.");
                }

                // Extract email and password from the JSON data
                string email = supplierData.GetProperty("Email").GetString();
                string password = supplierData.GetProperty("Password").GetString();

                if (email == null || password == null)
                {
                    throw new ArgumentNullException("The email or the password that were sent are empty");
                }

                // Call a method to find the couple based on email and password
                Supplier supplier = Supplier.FindSupplier(email, password);

                if (supplier == null)
                {
                    return NotFound("User wasn't found. Check your email or password");
                }

                // Check if couple is inactive, return Unauthorized response
                if (supplier.IsActive == false)
                {
                    return Unauthorized();
                }

                // If couple is found and active, return OK response with couple object
                else
                {
                    return Ok(supplier);
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
        // Updates the supplier.
        //--------------------------------------------------------------------
        [HttpPut("updateSupplier")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult PutSupplier([FromBody] Supplier supplier)
        {
            try
            {
                // Check if the received supplier data is null
                if (supplier == null)
                {
                    throw new ArgumentNullException(nameof(supplier), "The supplier's object is null");
                }

                // Attempt to update the supplier in the database
                if (supplier.UpdateCouple() == 1)
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



        //--------------------------------------------------------------------
        // Retrieves a list of top venues from the database.
        //--------------------------------------------------------------------
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
                    return NotFound("Could not retreive the top venues for Google Maps.");
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



        //--------------------------------------------------------------------
        // Retrieves a list of top suppliers from each type from the database.
        //--------------------------------------------------------------------
        [HttpGet("getTopSuppliers")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Supplier>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<List<Supplier>> GetTopSuppliers()
        {
            try
            {
                // Retrieve list of top venues synchronously
                List<Supplier> suppliers = Supplier.GetTopSuppliers();

                if (suppliers == null)
                {
                    // No venues found, return 404 Not Found status code
                    return NotFound("Could not retreive the top suppliers for Google Maps.");
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




        //--------------------------------------------------------------------
        // Temporary 
        //--------------------------------------------------------------------
        [HttpGet("getNewSuppliers")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Supplier>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<List<Supplier>> GetNewSuppliers()
        {
            string excelFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "SuppliersData.xlsx");

            DBServicesSupplier dBServicesSupplier = new DBServicesSupplier();

            List<Supplier> newSuppliers = dBServicesSupplier.UploadSuppliersToDatabase(excelFilePath);

            return Ok(newSuppliers);
        }



    }
}
