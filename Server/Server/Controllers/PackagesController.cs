using Microsoft.AspNetCore.Mvc;
using Server.BL;
using System.Text.Json;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackagesController : ControllerBase
    {

        //--------------------------------------------------------------------
        // In case of a new package, it updates the previous one to a new one
        //--------------------------------------------------------------------
        [HttpPut("updatePackage")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult PutPackage([FromBody] PackageApprovalData packageApprovalData)
        {
            try
            {
                string actionString = "Update"; // Changed action to "Update" for a PUT request
                if (packageApprovalData == null)
                {
                    throw new ArgumentNullException(nameof(packageApprovalData), "The JSON data is null.");
                }

                if (Package.InsertOrUpdatePackage(packageApprovalData, actionString) == 4)
                {
                    return NoContent(); // Return 204 NoContent for successful update
                }
                else
                {
                    throw new Exception("Not all operations were successful");
                }
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception e)
            {
                return BadRequest($"Error: {e.Message}");
            }
        }

        //--------------------------------------------------------------------
        // Inserts a new package into the database.
        //--------------------------------------------------------------------
        [HttpPost("insertPackage")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult PostPackage([FromBody] PackageApprovalData packageApprovalData)
        {
            try
            {
                string actionString = "Insert";
                if (packageApprovalData == null)
                {
                    throw new ArgumentNullException(nameof(packageApprovalData), "The JSON data  is null.");
                }

                if (Package.InsertOrUpdatePackage(packageApprovalData, actionString) == 4)
                {
                    return Ok();
                }
                else
                {
                    throw new Exception("Not all operations were successfuL");
                }
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception e)
            {
                return BadRequest($"Error: {e.Message}");
            }
        }

        //--------------------------------------------------------------------
        // Retrieves a package  provided couple data and questionnaire answers
        //--------------------------------------------------------------------

        [HttpPost("getPackage")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Couple))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult GetPackage([FromBody] JsonElement dataForPackage)
        {
            try
            {
                // Check if dataForPackage is null
                if (dataForPackage.ValueKind == JsonValueKind.Null)
                {
                    throw new ArgumentNullException(nameof(dataForPackage), "The JSON data for the package is null.");
                }
                else
                {
                    // Accessing the properties of the JSON data using JsonElement
                    JsonElement coupleElement = dataForPackage.GetProperty("couple");
                    Couple coupleWithData = JsonSerializer.Deserialize<Couple>(coupleElement.GetRawText());
                    JsonElement questionnaireElement = dataForPackage.GetProperty("questionnaireAnswers");
                    int[] questionnaireAnswers = JsonSerializer.Deserialize<int[]>(questionnaireElement.GetRawText());

                    // Generate the package

                    Couple coupleWithPackage = Package.GetPackage(coupleWithData, questionnaireAnswers);


                    return Ok(coupleWithPackage);
                }
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
