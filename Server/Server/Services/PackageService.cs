using Server.BL;
using Server.DAL;

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
                List<Supplier> suppliers = dbs.GetSuppliersForPackage(coupleWithData);

                // Step 2: Create a dictionary to hold the top suppliers for each type
                Dictionary<string, List<Supplier>> topSuppliers = new Dictionary<string, List<Supplier>>();

                // Step 3: Insert suppliers into the topSuppliers dictionary based on their type
                foreach (var type in coupleWithData.TypeWeights.Keys)
                {
                    // 
                    topSuppliers[type] = suppliers
                        .Where(supplier => supplier.SupplierType == type)
                        .ToList(); //
                }

                // Step 4: Find the best combination of suppliers
                List<Supplier> bestCombination = FindBestCombination(
                    topSuppliers.Values.SelectMany(list => list).ToList(),
                    coupleWithData.TypeWeights,
                    coupleWithData.Budget
                );

                // Step 5: Calculate total cost and total score of the best combination
                int totalCost = CalculateTotalCost(bestCombination);
                double totalScore = CalculateTotalScore(bestCombination, coupleWithData.TypeWeights);

                // Step 6: Create and populate the Package object
                Package suppliersPackage = new Package
                {

                    SelectedSuppliers = bestCombination,
                    TotalCost = totalCost,
                    TotalScore = totalScore,
                    CoupleEmail = coupleWithData.Email,
                    AlternativeSuppliers = new Dictionary<string, List<Supplier>>() // Initialize the dictionary
                };

                // Step 7: Populate the top 3 highest-rated suppliers for each type in the Package object
                foreach (var type in coupleWithData.TypeWeights.Keys)
                {
                    // Get the top 3 rated suppliers for the current type
                    var topRated = topSuppliers[type]
                        .OrderByDescending(supplier => supplier.Rating)
                        .Where(supplier => !bestCombination.Any(chosen => chosen.BusinessName == supplier.BusinessName))
                        .Take(3)
                        .ToList();

                    // Add the top rated suppliers to the dictionary
                    suppliersPackage.AlternativeSuppliers[type] = topRated;
                }

                // Step 8: Return the Package
                return suppliersPackage;
            }

            catch (Exception ex)
            {
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while generating the package in method GeneratePackage:" + ex.Message);
            }
        }

        // Find the best combination of suppliers based on budget and scores
        private static List<Supplier> FindBestCombination(List<Supplier> suppliers, Dictionary<string, double> typeWeights, int budget)
        {
            List<Supplier> bestCombination = new List<Supplier>();
            double maxScore = 0;

            List<List<Supplier>> combinations = GenerateCombinations(suppliers);

            foreach (var combination in combinations)
            {
                int totalCost = CalculateTotalCost(combination);
                if (totalCost <= budget)
                {
                    double totalScore = CalculateTotalScore(combination, typeWeights);
                    if (totalScore > maxScore)
                    {
                        maxScore = totalScore;
                        bestCombination = combination;
                    }
                }
            }

            return bestCombination;
        }

        // Generate all possible combinations of suppliers
        private static List<List<Supplier>> GenerateCombinations(List<Supplier> suppliers)
        {
            List<List<Supplier>> results = new List<List<Supplier>>();
            List<string> types = suppliers.Select(supplier => supplier.SupplierType).Distinct().ToList();

            void Generate(List<Supplier> current, HashSet<string> usedTypes, int index)
            {
                if (current.Count == types.Count)
                {
                    results.Add(current);
                    return;
                }

                for (int i = index; i < suppliers.Count; i++)
                {
                    if (!usedTypes.Contains(suppliers[i].SupplierType))
                    {
                        HashSet<string> newUsedTypes = new HashSet<string>(usedTypes);
                        newUsedTypes.Add(suppliers[i].SupplierType);

                        List<Supplier> newCombination = new List<Supplier>(current);
                        newCombination.Add(suppliers[i]);
                        Generate(newCombination, newUsedTypes, i + 1);
                    }
                }
            }

            Generate(new List<Supplier>(), new HashSet<string>(), 0);
            return results;
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
                totalScore += supplier.Rating * typeWeights[supplier.SupplierType];
            }

            return totalScore;
        }
    }
}
