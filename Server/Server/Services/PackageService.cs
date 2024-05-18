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

                const int numberOfVendors = 6;

                // Create comparison matrix
                double[,] comparisonMatrix = new double[numberOfVendors, numberOfVendors];

                // Populate comparison matrix
                PopulateComparisonMatrix(comparisonMatrix, responses, numberOfVendors);

                // Calculate weights
                Dictionary<string, double> weights = CalculateWeights(comparisonMatrix, numberOfVendors);

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
                // Step 1: Retrieve suppliers from the database
                DBServicesPackage dbs = new DBServicesPackage();
                List<Supplier> suppliersList = dbs.GetSuppliersForPackage(coupleWithData);

                // Step 2: Find the best combination of suppliers
                List<Supplier> bestCombination = FindBestCombination(
                    suppliersList,
                    coupleWithData.TypeWeights,
                    coupleWithData.Budget
                );

                // Step 3: Calculate total cost and total score of the best combination
                int totalCost = CalculateTotalCost(bestCombination);
                double totalScore = CalculateTotalScore(bestCombination, coupleWithData.TypeWeights);

                // Step 4: Create and populate the Package object
                Package suppliersPackage = new Package
                {
                    SelectedSuppliers = bestCombination,
                    TotalCost = totalCost,
                    TotalScore = totalScore,
                    CoupleEmail = coupleWithData.Email,
                    AlternativeSuppliers = new Dictionary<string, List<Supplier>>() // Initialize the dictionary
                };

                // Step 5: Populate the top 3 highest-rated suppliers for each type in the Package object
                foreach (var type in coupleWithData.TypeWeights.Keys)
                {
                    // Get the top 3 rated suppliers for the current type
                    var topRated = suppliersList
                        .Where(supplier => supplier.SupplierType == type && !bestCombination.Any(chosen => chosen.SupplierEmail == supplier.SupplierEmail))
                        .OrderByDescending(supplier => supplier.Rating)
                        .Take(3)
                        .ToList();

                    // Add the top rated suppliers to the dictionary
                    suppliersPackage.AlternativeSuppliers[type] = topRated;
                }

                // Step 6: Return the Package
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
            List<Supplier> bestCombination = new List<Supplier>(); // Stores the best combination found so far
            double maxScore = 0; // Stores the maximum score found

            // Sort suppliers by type weight descending
            List<Supplier> sortedSuppliers = SortSuppliersByTypeWeight(suppliersList, typeWeights);

            // Define the maximum time to generate combinations (Seconds!)
            double time = 2.5;

            // Define the maximum number of combinations
            int maxCombinations = 1000;

            // Call the GenerateCombinations function with the time limit
            List<List<Supplier>> combinations = GenerateCombinations(sortedSuppliers, budget, TimeSpan.FromSeconds(time), maxCombinations);

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


        private static List<List<Supplier>> GenerateCombinations(List<Supplier> suppliers, int budget, TimeSpan timeLimit, int maxCombinations)
        {
            List<List<Supplier>> combinationList = new List<List<Supplier>>(); // Stores the generated combinations
            const int numberOfSupplierTypes = 6; // Total number of supplier types
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
                for (int supplierIndex = currentSupplierIndex; supplierIndex < suppliers.Count; supplierIndex++)
                {
                    // Check if the supplier type has not been used in the current combination
                    if (!usedSupplierTypes.Contains(suppliers[supplierIndex].SupplierType))
                    {
                        int totalCost = CalculateTotalCost(currentCombination) + suppliers[supplierIndex].Price;
                        // Check if adding the supplier exceeds the budget
                        if (totalCost <= budget)
                        {
                            // Create a new set of used supplier types with the current supplier type added
                            HashSet<string> newUsedSupplierTypes = new HashSet<string>(usedSupplierTypes);
                            newUsedSupplierTypes.Add(suppliers[supplierIndex].SupplierType);

                            // Create a new combination with the current supplier added
                            List<Supplier> newCombination = new List<Supplier>(currentCombination);
                            newCombination.Add(suppliers[supplierIndex]);

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
    }
}
