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
        // Generates a package according to couple's provided data
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
                    // Deserialize the couple data and questionnaire answers from JSON
                    JsonElement coupleElement = dataForPackage.GetProperty("couple");
                    Couple coupleWithData = JsonSerializer.Deserialize<Couple>(coupleElement.GetRawText());
                    JsonElement questionnaireElement = dataForPackage.GetProperty("questionnaireAnswers");
                    int[] questionnaireAnswers = JsonSerializer.Deserialize<int[]>(questionnaireElement.GetRawText());

                    if (coupleWithData == null || questionnaireAnswers == null)
                    {
                        throw new ArgumentNullException("Someone didn't do their job correctly and he is about to be fired.");
                    }

                    // Generate the package
                    Couple coupleWithPackage = Package.GetPackage(coupleWithData, questionnaireAnswers);

                    return Ok(coupleWithPackage); // Return 200 OK with the generated package
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


                // Check if the packageApprovalData is null
                if (packageApprovalData == null)
                {
                    throw new ArgumentNullException(nameof(packageApprovalData), "The JSON data is null.");
                }

                // Insert or update the package in the database
                int numberOfSuccesses = Package.InsertOrUpdatePackage(packageApprovalData);
                if (numberOfSuccesses == 4)
                {
                    return Ok(); // Return 200 OK for successful insertion
                }

                else
                {
                    throw new Exception("Not all operations were successful only" + numberOfSuccesses + "were");
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
        // In case of a new package, it updates the previous one to a new one
        //--------------------------------------------------------------------
        [HttpPut("updatePackage")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult PutPackage([FromBody] PackageApprovalData packageApprovalData)
        {
            try
            {


                // Check if the packageApprovalData is null
                if (packageApprovalData == null)
                {
                    throw new ArgumentNullException(nameof(packageApprovalData), "The JSON data is null.");
                }

                // Insert or update the package in the database
                int numberOfSuccesses = Package.InsertOrUpdatePackage(packageApprovalData);
                if (numberOfSuccesses == 4)
                {
                    return NoContent(); // Return 204 NoContent for successful update
                }
                else
                {
                    throw new Exception("Not all operations were successful only" + numberOfSuccesses + "were");
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
    }
}
