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

                const int NumberOfVendors = 6;

                // Create comparison matrix
                double[,] comparisonMatrix = new double[NumberOfVendors, NumberOfVendors];

                // Populate comparison matrix
                PopulateComparisonMatrix(comparisonMatrix, responses, NumberOfVendors);

                // Calculate weights
                Dictionary<string, double> weights = CalculateWeights(comparisonMatrix, NumberOfVendors);

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
            int responseIndex = 0;
            for (int i = 0; i < NumberOfVendors; i++)
            {
                for (int j = i + 1; j < NumberOfVendors; j++)
                {
                    double value = MapResponseToValue(responses[responseIndex++]);

                    // Fill upper and lower triangles of the matrix
                    matrix[i, j] = value;
                    matrix[j, i] = 1 / value;
                }

                // Diagonal elements are always 1
                matrix[i, i] = 1;
            }
        }

        // Method to map user responses to numerical values
        private static double MapResponseToValue(int response)
        {
            switch (response)
            {
                case 1: return 5;
                case 2: return 3;
                case 3: return 1;
                case 4: return 1.0 / 3;
                case 5: return 1.0 / 5;
                default: return 1; // Neutral preference
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
            DBServicesPackage dbs = new DBServicesPackage();
            Dictionary<string, int> replacementCounts = dbs.GetReplacementCounts();

            // Step 2: Calculate total replacement count
            int totalReplacements = replacementCounts.Values.Sum();

            // Step 3: Adjust the weights based on proportional differences
            Dictionary<string, double> adjustedWeights = new Dictionary<string, double>();
            double sum = 0;
            foreach (var kvp in replacementCounts)
            {
                string supplierType = kvp.Key;
                int count = kvp.Value;

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



        // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
        // ┃  📦 This section generates the best combination of suppliers based on budget and ratings. 📦  ┃
        // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

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
                        .Where(supplier => supplier.SupplierType == type && !bestCombination.Any(chosen => chosen.BusinessName == supplier.BusinessName))
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


            // Define the time limit (e.g., 30 seconds)
            TimeSpan timeLimit = TimeSpan.FromSeconds(2.5);

            // Call the GenerateCombinations function with the time limit
            List<List<Supplier>> combinations = GenerateCombinations(sortedSuppliers, budget, timeLimit);

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

            return bestCombination;
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



        private static List<List<Supplier>> GenerateCombinations(List<Supplier> suppliers, int budget, TimeSpan timeLimit)
        {
            List<List<Supplier>> results = new List<List<Supplier>>(); // Stores the generated combinations
            List<string> types = suppliers.Select(supplier => supplier.SupplierType).Distinct().ToList(); // Get unique supplier types
            Stopwatch stopwatch = new Stopwatch(); // Stopwatch to track elapsed time
            stopwatch.Start(); // Start the stopwatch
            bool timeLimitExceeded = false; // Flag to track if time limit is exceeded

            // Recursive function to generate combinations
            void Generate(List<Supplier> current, HashSet<string> usedTypes, int index)
            {
                // Check if all unique supplier types have been included in the current combination or if the time limit has been exceeded
                if ((current.Count == types.Count) || timeLimitExceeded)
                {
                    results.Add(current); // Add the current combination to the results
                    return; // Exit the function
                }

                // Iterate through remaining suppliers to add to the combination
                for (int i = index; i < suppliers.Count; i++)
                {
                    // Check if the supplier type has not been used in the current combination
                    if (!usedTypes.Contains(suppliers[i].SupplierType))
                    {
                        int totalCost = CalculateTotalCost(current) + suppliers[i].Price;
                        // Check if adding the supplier exceeds the budget
                        if (totalCost <= budget)
                        {
                            // Create a new set of used types with the current supplier type added
                            HashSet<string> newUsedTypes = new HashSet<string>(usedTypes);
                            newUsedTypes.Add(suppliers[i].SupplierType);

                            // Create a new combination with the current supplier added
                            List<Supplier> newCombination = new List<Supplier>(current);
                            newCombination.Add(suppliers[i]);

                            // Recursively generate combinations with the new combination and set of used types
                            Generate(newCombination, newUsedTypes, i + 1);

                            // Check if the time limit has been reached
                            if (stopwatch.Elapsed > timeLimit)
                            {
                                timeLimitExceeded = true;
                                return; // Return early
                            }
                        }
                    }
                }
            }

            // Start generating combinations with an empty current combination and an empty set of used types
            Generate(new List<Supplier>(), new HashSet<string>(), 0);

            return results; // Return the generated combinations
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
