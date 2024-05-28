using Server.BL;
using Server.DAL;
using System.Diagnostics;

namespace Server.Services
{
    public static class PackageService
    {



        // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
        // ┃    💍  This section is about AHP algorithm process  💍  ┃
        // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


        // Method to calculate vendor weights based on user responses
        public static Dictionary<string, double> CalculateVendorWeights(int[] responses)
        {

            try
            {

                int numberOfSupplierTypes = 6;// Total number of supplier types

                // Create comparison matrix
                double[,] comparisonMatrix = new double[numberOfSupplierTypes, numberOfSupplierTypes];

                // Populate comparison matrix
                PopulateComparisonMatrix(comparisonMatrix, responses, numberOfSupplierTypes);

                // Calculate weights
                Dictionary<string, double> weights = CalculateWeights(comparisonMatrix, numberOfSupplierTypes);

                // Adjust weights based on database information
                return AdjustWeights(weights);
            }

            catch (Exception ex)
            {
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while calculating vendor weights in method CalculateVendorWeights:" + ex.Message);
            }
        }

        // Method to populate the comparison matrix based on user responses
        private static void PopulateComparisonMatrix(double[,] matrix, int[] responses, int NumberOfVendors)
        {
            // Initialize the index for accessing user responses
            int responseIndex = 0;

            // Iterate over the rows of the comparison matrix
            for (int i = 0; i < NumberOfVendors; i++)
            {
                // Iterate over the columns of the comparison matrix (upper triangular part)
                for (int j = i + 1; j < NumberOfVendors; j++)
                {
                    // Get the numerical value representing the strength of preference from user responses
                    double value = MapResponseToValue(responses[responseIndex++]);

                    // Fill the upper triangular part of the matrix with the obtained value
                    matrix[i, j] = value;

                    // Fill the corresponding lower triangular part with the reciprocal value to maintain symmetry
                    matrix[j, i] = 1 / value;
                }

                // Set the diagonal elements of the matrix to 1 (neutral preference, comparing an option with itself)
                matrix[i, i] = 1;
            }
        }

        // Method to map user responses to numerical values representing the strength of preference
        private static double MapResponseToValue(int response)
        {
            // Use a switch statement to handle different cases of user responses
            switch (response)
            {
                // Case 1: Strong preference for the first option over the second
                case 1:
                    return 5;

                // Case 2: Moderate preference for the first option over the second
                case 2:
                    return 3;

                // Case 3: Equal preference for both options
                case 3:
                    return 1;

                // Case 4: Moderate preference for the second option over the first
                case 4:
                    return 1.0 / 3;

                // Case 5: Strong preference for the second option over the first
                case 5:
                    return 1.0 / 5;

                // Default case: Neutral preference if the user response does not match any predefined cases
                default:
                    return 1; // Return a neutral preference
            }
        }

        // Method to calculate vendor weights using AHP
        private static Dictionary<string, double> CalculateWeights(double[,] matrix, int NumberOfVendors)
        {
            double[] weights = new double[NumberOfVendors];
            double[] sumColumn = new double[NumberOfVendors];

            // Sum columns of the matrix
            for (int j = 0; j < NumberOfVendors; j++)
                for (int i = 0; i < NumberOfVendors; i++)
                    sumColumn[j] += matrix[i, j];

            // Normalize the matrix
            for (int i = 0; i < NumberOfVendors; i++)
                for (int j = 0; j < NumberOfVendors; j++)
                    matrix[i, j] /= sumColumn[j];

            // Calculate the average of rows for weights
            for (int i = 0; i < NumberOfVendors; i++)
                for (int j = 0; j < NumberOfVendors; j++)
                    weights[i] += matrix[i, j];

            // Normalize weights
            double sum = weights.Sum();
            for (int i = 0; i < NumberOfVendors; i++)
                weights[i] /= sum;

            // Assign weights to vendor types
            Dictionary<string, double> typeWeights = new Dictionary<string, double>();
            string[] vendors = { "venue", "dj", "photographer", "dress", "rabbi", "hair and makeup" };

            for (int i = 0; i < NumberOfVendors; i++)
            {
                typeWeights[vendors[i]] = weights[i];
            }

            return typeWeights;
        }

        // Method to adjust weights based on database information
        private static Dictionary<string, double> AdjustWeights(Dictionary<string, double> typeWeights)
        {
            // Step 1: Get replacement counts from the database
            DBServicesPackage dBServicesPackage = new DBServicesPackage();
            Dictionary<string, int> replacementCounts = dBServicesPackage.GetReplacementCounts();

            // Step 2: Calculate total replacement count
            int totalReplacements = replacementCounts.Values.Sum();

            // Step 3: Adjust the weights based on proportional differences
            Dictionary<string, double> adjustedWeights = new Dictionary<string, double>();
            double sum = 0;
            foreach (var supplierTypeCountPair in replacementCounts)
            {
                string supplierType = supplierTypeCountPair.Key;
                int count = supplierTypeCountPair.Value;

                // Calculate the proportional difference between the count and the average count
                double proportionDiff = (double)count / totalReplacements - 1.0 / replacementCounts.Count;

                // Adjust the weight based on the proportional difference
                adjustedWeights[supplierType] = typeWeights[supplierType] + 2 * proportionDiff * typeWeights[supplierType];
                sum += adjustedWeights[supplierType];
            }

            // Step 4: Normalize the adjusted weights to ensure the sum is 1
            foreach (var key in adjustedWeights.Keys.ToList())
            {
                adjustedWeights[key] /= sum;
            }

            // Step 5: Return adjusted weights
            return adjustedWeights;
        }



        // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
        // ┃  📦  This section generates the best combination of suppliers based on the couple's preferences. 📦  ┃
        // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛



        // This method "manages" the generation of a package
        public static Package GeneratePackage(Couple coupleWithData)
        {
            try
            {
                //* Step 1: Retrieve suppliers from the database
                // supplierList is already sorted by supplier type and rating.
                DBServicesPackage dBServicesPackage = new DBServicesPackage();
                List<Supplier> suppliersList = dBServicesPackage.GetSuppliersForPackage(coupleWithData);

                //* Step 2: Find the best combination of suppliers
                List<Supplier> bestCombination = FindBestCombination(
                    suppliersList,
                    coupleWithData.TypeWeights,
                    coupleWithData.Budget
                );

                //* Step 3: Calculate total cost and total score of the best combination
                int totalCost = CalculateTotalCost(bestCombination);
                double totalScore = CalculateTotalScore(bestCombination, coupleWithData.TypeWeights);

                //* Step 4: Create and populate the Package object
                Package suppliersPackage = new Package
                {
                    SelectedSuppliers = bestCombination,
                    TotalCost = totalCost,
                    TotalScore = totalScore,
                    CoupleEmail = coupleWithData.Email,
                    AlternativeSuppliers = new Dictionary<string, List<Supplier>>() // Initialize the dictionary
                };

                //* Step 5: Populate the top 3 highest-rated suppliers for each type in the Package object
                PopulateAlternativeSuppliers(suppliersPackage, suppliersList, coupleWithData.Budget);

                //* Step 6: Return the Package
                return suppliersPackage;
            }
            catch (Exception ex)
            {
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while generating the package in method GeneratePackage:" + ex.Message);
            }
        }





        // Find the best combination of suppliers based on budget and scores
        private static List<Supplier> FindBestCombination(List<Supplier> suppliersList, Dictionary<string, double> typeWeights, int budget)
        {


            double maxCombinationTime = 3; // Define the maximum time to generate combinations (Seconds!)

            int maxCombinations = 1000000;  // Define the maximum number of combinations

            List<Supplier> bestCombination = new List<Supplier>(); // Stores the best combination found so far
            double maxScore = 0; // Stores the maximum score found

            // Sort suppliers by type weight descending
            List<Supplier> sortedSuppliers = SortSuppliersByTypeWeight(suppliersList, typeWeights);

            // Call the GenerateCombinations function with the time limit
            List<List<Supplier>> combinations = GenerateCombinations(sortedSuppliers, budget, TimeSpan.FromSeconds(maxCombinationTime), maxCombinations);

            // Find the combination with the highest score
            foreach (var combination in combinations)
            {
                double totalScore = CalculateTotalScore(combination, typeWeights);
                if (totalScore > maxScore)
                {
                    maxScore = totalScore;
                    bestCombination = combination;
                }
            }

            // return the best found combination of suppliers
            return bestCombination;
        }


        private static List<List<Supplier>> GenerateCombinations(List<Supplier> suppliersList, int budget, TimeSpan timeLimit, int maxCombinations)
        {
            List<List<Supplier>> combinationList = new List<List<Supplier>>(); // Stores the generated combinations

            int numberOfSupplierTypes = 6;// Total number of supplier type

            Stopwatch stopwatch = new Stopwatch(); // Stopwatch to track elapsed time

            stopwatch.Start(); // Start the stopwatch

            // Recursive function to generate combinations
            void GenerateCombination(List<Supplier> currentCombination, HashSet<string> usedSupplierTypes, int currentSupplierIndex)
            {
                // Check if either the maximum number of combinations or the time limit has been reached
                if (combinationList.Count >= maxCombinations || stopwatch.Elapsed > timeLimit)
                {
                    return; // Exit the function
                }

                // Check if all unique supplier types have been included in the current combination
                if (currentCombination.Count == numberOfSupplierTypes)
                {
                    combinationList.Add(currentCombination); // Add the current combination to the combinationList
                    return; // Exit the function
                }

                // Iterate through remaining suppliers to add to the combination
                for (int supplierIndex = currentSupplierIndex; supplierIndex < suppliersList.Count; supplierIndex++)
                {
                    // Check if the supplier type has not been used in the current combination
                    if (!usedSupplierTypes.Contains(suppliersList[supplierIndex].SupplierType))
                    {
                        int totalCost = CalculateTotalCost(currentCombination) + suppliersList[supplierIndex].Price;
                        // Check if adding the supplier exceeds the budget
                        if (totalCost <= budget)
                        {
                            // Create a new set of used supplier types with the current supplier type added
                            HashSet<string> newUsedSupplierTypes = new HashSet<string>(usedSupplierTypes);
                            newUsedSupplierTypes.Add(suppliersList[supplierIndex].SupplierType);

                            // Create a new combination with the current supplier added
                            List<Supplier> newCombination = new List<Supplier>(currentCombination);
                            newCombination.Add(suppliersList[supplierIndex]);

                            // Recursively generate combinations with the new combination and set of used supplier types
                            GenerateCombination(newCombination, newUsedSupplierTypes, supplierIndex + 1);
                        }
                    }
                }
            }

            // Start generating combinations with an empty current combination and an empty set of used supplier types
            GenerateCombination(new List<Supplier>(), new HashSet<string>(), 0);

            return combinationList; // Return the generated combinations
        }


        // Sort suppliers by type weight descending
        private static List<Supplier> SortSuppliersByTypeWeight(List<Supplier> suppliers, Dictionary<string, double> typeWeights)
        {
            List<Supplier> sortedSuppliers = new List<Supplier>();

            // Sort suppliers by type weight in descending order
            foreach (var weightPair in typeWeights.OrderByDescending(pair => pair.Value))
            {
                foreach (var supplier in suppliers)
                {
                    if (supplier.SupplierType == weightPair.Key)
                    {
                        sortedSuppliers.Add(supplier);
                    }
                }
            }

            return sortedSuppliers;
        }

        // Calculate total cost of a list of suppliers
        private static int CalculateTotalCost(List<Supplier> suppliers)
        {
            return suppliers.Sum(supplier => supplier.Price);
        }

        // Calculate total score of a list of suppliers based on weights
        private static double CalculateTotalScore(List<Supplier> suppliers, Dictionary<string, double> typeWeights)
        {
            double totalScore = 0;

            foreach (var supplier in suppliers)
            {
                totalScore += (double)supplier.Rating * 20 * typeWeights[supplier.SupplierType];
            }

            return totalScore;
        }


        // Populates the alternative suppliers for each selected supplier in the package, considering replacements within and beyond the budget.
        private static void PopulateAlternativeSuppliers(Package suppliersPackage, List<Supplier> suppliersList, int budget)
        {
            // Iterate through each selected supplier
            foreach (Supplier selectedSupplier in suppliersPackage.SelectedSuppliers)
            {
                // Initialize a list to store replacements within and beyond the budget
                List<Supplier> topRatedReplacements = new List<Supplier>();

                // Iterate through each supplier in the list of available suppliers
                foreach (Supplier supplier in suppliersList)
                {
                    // Skip suppliers that are not of the same type or are the same as the selected supplier
                    if (supplier.SupplierType != selectedSupplier.SupplierType || suppliersPackage.SelectedSuppliers.Contains(supplier))
                    {
                        continue;
                    }

                    // Check if replacing the selected supplier with the current supplier remains within budget
                    if (CanReplaceWithoutExceedingBudget(suppliersPackage.SelectedSuppliers, selectedSupplier, supplier, budget))
                    {
                        // Add the current supplier to the list of replacements within budget
                        topRatedReplacements.Add(supplier);

                        // Check if three replacements within budget have been found and break the loop if so
                        if (topRatedReplacements.Count == 3)
                        {
                            break;
                        }
                    }
                }

                // If the number of replacements within budget is less than 3, find replacements beyond the budget
                if (topRatedReplacements.Count < 3)
                {
                    List<Supplier> exceedingBudgetSuppliers = new List<Supplier>();

                    // Order suppliers by price ascending
                    suppliersList.Sort((s1, s2) => s1.Price.CompareTo(s2.Price));

                    // Find suppliers who exceed the budget when replacing selectedSupplier and are cheaper than selectedSupplier
                    foreach (Supplier supplier in suppliersList)
                    {
                        if (supplier.Price > selectedSupplier.Price &&
                            !topRatedReplacements.Contains(supplier) &&
                            !suppliersPackage.SelectedSuppliers.Contains(supplier) &&
                            supplier.SupplierType == selectedSupplier.SupplierType)
                        {
                            exceedingBudgetSuppliers.Add(supplier);
                        }
                    }


                    // Add suppliers from exceeding budget list to topRatedReplacements until it has three suppliers
                    foreach (var supplier in exceedingBudgetSuppliers)
                    {
                        topRatedReplacements.Add(supplier);
                        if (topRatedReplacements.Count == 3)
                        {
                            break;
                        }
                    }
                }


                // Add replacements to the dictionary of alternative suppliers
                suppliersPackage.AlternativeSuppliers[selectedSupplier.SupplierType] = topRatedReplacements;
            }
        }


        // Checks whether replacing a supplier with a new supplier keeps the total cost within the budget.
        private static bool CanReplaceWithoutExceedingBudget(List<Supplier> selectedSuppliers, Supplier selectedSupplier, Supplier newSupplier, int budget)
        {
            // Calculate the current total cost of selected suppliers
            int currentTotalCost = CalculateTotalCost(selectedSuppliers);

            // Calculate the new total cost if the selected supplier is replaced with the new supplier
            int newTotalCost = currentTotalCost - selectedSupplier.Price + newSupplier.Price;

            // Check if the new total cost remains within the budget
            return (newTotalCost <= budget);
        }


    }
}
