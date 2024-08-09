const axios = require('axios');
  
function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

async function getWorldRecord(gameName, categoryName, variableValue) {
    try {
        // Fetch the game ID
        console.log(`Fetching game ID for: ${gameName}`);
        const gameResponse = await axios.get(`https://www.speedrun.com/api/v1/games?name=${encodeURIComponent(gameName)}`);
        if (!gameResponse.data.data || gameResponse.data.data.length === 0) {
            throw new Error('Game not found');
        }
        const game = gameResponse.data.data[0];
        const gameId = game.id;
        const exactGameName = game.names.international;
        console.log(`Game ID: ${gameId}`);
        console.log(`Exact game name: ${exactGameName}`);

        // Fetch the category ID
        console.log(`Fetching category ID for: ${categoryName}`);
        const categoryResponse = await axios.get(`https://www.speedrun.com/api/v1/games/${gameId}/categories`);
        const category = categoryResponse.data.data.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
        if (!category) throw new Error('Category not found');

        const categoryId = category.id;
        console.log(`Category ID: ${categoryId}`);

        // Fetch variables for the category (to get subcategories)
        console.log(`Fetching variables for category ID: ${categoryId}`);
        const variablesResponse = await axios.get(`https://www.speedrun.com/api/v1/categories/${categoryId}/variables`);
        const variables = variablesResponse.data.data.filter(variable =>
            variable['is-subcategory'] &&
            (variable.scope.type === 'full-game' || variable.scope.type === 'global' || variable.category === categoryId)
        );
        console.log('Filtered variables:', variables);

        let subcategoryCombinations = [[]];
        let variableNames = [];

        // Create combinations of all subcategory values
        for (const variable of variables) {
            variableNames.push(variable.name);
            let newCombinations = [];
            if (variable.values && variable.values.values) {
                for (const subcategoryId in variable.values.values) {
                    const subcategoryValue = variable.values.values[subcategoryId];
                    subcategoryCombinations.forEach(combination => {
                        newCombinations.push([...combination, { variableId: variable.id, subcategoryId, label: subcategoryValue.label }]);
                    });
                }
            }
            subcategoryCombinations = newCombinations;
        }

        console.log('Variable names:', variableNames);
        console.log('Subcategory combinations:', subcategoryCombinations);

        let wrDetails = [];
        let specificCombination = [];

        // If a variableValue is provided, find the specific combination
        if (variableValue) {
            specificCombination = subcategoryCombinations.filter(combination =>
                combination.some(subcat => subcat.label.toLowerCase() === variableValue.toLowerCase())
            );
            console.log(`Specific combination for variable value "${variableValue}":`, specificCombination);
        }

        // Use either specificCombination or all combinations
        const combinationsToUse = specificCombination.length > 0 ? specificCombination : subcategoryCombinations;
        console.log('Combinations to use:', combinationsToUse);

        let retryAttempts = 0;
        const maxRetries = 3;

        // Fetch the leaderboard for each combination of subcategories
        for (const combination of combinationsToUse) {
            let params = combination.map(subcat => `var-${subcat.variableId}=${subcat.subcategoryId}`).join('&');
            console.log(`Fetching leaderboard with params: ${params}`);
            try {
                const leaderboardResponse = await axios.get(`https://www.speedrun.com/api/v1/leaderboards/${gameId}/category/${categoryId}?top=1&${params}`);
                const wrRun = leaderboardResponse.data.data.runs[0];

                if (wrRun) {
                    // Extract necessary information
                    const wrTime = wrRun.run.times.primary_t;
                    let wrRunnerName = "Unknown";

                    // Fetch runner name if available
                    if (wrRun.run.players && wrRun.run.players.length > 0) {
                        const wrRunnerId = wrRun.run.players[0].id;
                        const runnerResponse = await axios.get(`https://www.speedrun.com/api/v1/users/${wrRunnerId}`);
                        wrRunnerName = runnerResponse.data.data.names.international;
                    }

                    // Convert time to HH:MM:SS format or MM:SS format
                    const timeInSeconds = parseInt(wrTime); // Assuming wrTime is in seconds
                    const hours = Math.floor(timeInSeconds / 3600);
                    const minutes = Math.floor((timeInSeconds % 3600) / 60);
                    const seconds = timeInSeconds % 60;

                    const formattedTime = hours > 0
                        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    const subcategoryLabels = combination.map(subcat => subcat.label).join(' - ');
                    wrDetails.push(`${subcategoryLabels}: ${formattedTime} by ${wrRunnerName}`);
                }
            } catch (subError) {
                console.error(`Error fetching leaderboard with params ${params}:`, subError.message);
                retryAttempts++;
                if (retryAttempts >= maxRetries) {
                    console.log('Max retry attempts reached. Skipping to next combination.');
                    break;
                }
            }
        }

        // If there are no subcategory records found, try fetching the top run without subcategory
        if (wrDetails.length === 0) {
            console.log('No subcategory records found. Fetching top run without subcategories.');
            const leaderboardResponse = await axios.get(`https://www.speedrun.com/api/v1/leaderboards/${gameId}/category/${categoryId}?top=1`);
            const wrRun = leaderboardResponse.data.data.runs[0];

            if (wrRun) {
                const wrTime = wrRun.run.times.primary_t;
                let wrRunnerName = "Unknown";

                if (wrRun.run.players && wrRun.run.players.length > 0) {
                    const wrRunnerId = wrRun.run.players[0].id;
                    const runnerResponse = await axios.get(`https://www.speedrun.com/api/v1/users/${wrRunnerId}`);
                    wrRunnerName = runnerResponse.data.data.names.international;
                }

                const timeInSeconds = parseInt(wrTime);
                const hours = Math.floor(timeInSeconds / 3600);
                const minutes = Math.floor((timeInSeconds % 3600) / 60);
                const seconds = timeInSeconds % 60;

                const formattedTime = hours > 0
                    ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                    : `${minutes}:${seconds.toString().padStart(2, '0')}`;
                wrDetails.push(`Default: ${formattedTime} by ${wrRunnerName}`);
            }
        }

        // Capitalize first letters of all words in category name
        const capitalizedCategoryName = capitalizeWords(categoryName);

        if (wrDetails.length > 0) {
            return `World Records for ${exactGameName} - ${capitalizedCategoryName}: ${wrDetails.join(' | ')}`;
        } else {
            return `No World Records found for ${exactGameName} - ${capitalizedCategoryName}.`;
        }
    } catch (error) {
        console.error('Error fetching World Record:', error.message);
        if (error.message.includes('Game not found')) {
            return 'Game not found.';
        } else if (error.message.includes('Category not found')) {
            return 'Category not found.';
        } else {
            return 'Error fetching World Record. Please check the game and category names.';
        }
    }
}

async function getPersonalBest(gameName, categoryName, runnerName) {
    try {
        // Fetch the game ID
        const gameResponse = await axios.get(`https://www.speedrun.com/api/v1/games?name=${encodeURIComponent(gameName)}`);
        if (!gameResponse.data.data || gameResponse.data.data.length === 0) {
            throw new Error('Game not found');
        }
        const gameId = gameResponse.data.data[0].id;
        const exactGameName = gameResponse.data.data[0].names.international;

        // Fetch the category ID
        const categoryResponse = await axios.get(`https://www.speedrun.com/api/v1/games/${gameId}/categories`);
        const category = categoryResponse.data.data.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
        if (!category) throw new Error('Category not found');

        const categoryId = category.id;

        // Fetch the runner ID and name
        const runnerResponse = await axios.get(`https://www.speedrun.com/api/v1/users?lookup=${encodeURIComponent(runnerName)}`);
        if (!runnerResponse.data.data || runnerResponse.data.data.length === 0) {
            throw new Error('Runner not found');
        }
        const runnerData = runnerResponse.data.data[0];
        const runnerId = runnerData.id;
        const runnerNameExact = runnerData.names.international;

        // Fetch variables for the category (to get subcategories)
        const variablesResponse = await axios.get(`https://www.speedrun.com/api/v1/categories/${categoryId}/variables`);
        const variables = variablesResponse.data.data;

        let subcategoryCombinations = [[]];

        // Create combinations of all subcategory values
        for (const variable of variables) {
            if (variable['is-subcategory']) {
                let newCombinations = [];
                for (const subcategoryValueId in variable.values.values) {
                    const subcategoryValue = variable.values.values[subcategoryValueId];
                    subcategoryCombinations.forEach(combination => {
                        newCombinations.push([...combination, { variableId: variable.id, subcategoryId: subcategoryValueId, label: subcategoryValue.label }]);
                    });
                }
                subcategoryCombinations = newCombinations;
            }
        }

        let pbDetails = [];
        let retryAttempts = 0;
        const maxRetries = 3;

        // Fetch the runner's PB for each subcategory
        for (const combination of subcategoryCombinations) {
            let params = combination.map(subcat => `var-${subcat.variableId}=${subcat.subcategoryId}`).join('&');
            try {
                const leaderboardResponse = await axios.get(`https://www.speedrun.com/api/v1/leaderboards/${gameId}/category/${categoryId}?top=100&${params}`);
                const runnerRuns = leaderboardResponse.data.data.runs.filter(run => run.run.players[0].id === runnerId);

                for (const runnerRun of runnerRuns) {
                    // Extract necessary information
                    const pbTime = runnerRun.run.times.primary_t;

                    // Convert time to HH:MM:SS or MM:SS format
                    const timeInSeconds = parseInt(pbTime); // Assuming pbTime is in seconds
                    const hours = Math.floor(timeInSeconds / 3600);
                    const minutes = Math.floor((timeInSeconds % 3600) / 60);
                    const seconds = timeInSeconds % 60;

                    const formattedTime = hours > 0 
                        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    const subcategoryLabels = combination.map(subcat => subcat.label).join(' - ');
                    pbDetails.push(`${subcategoryLabels}: ${formattedTime}`);
                }
            } catch (subError) {
                console.error(`Error fetching leaderboard with params ${params}:`, subError.message);
                retryAttempts++;
                if (retryAttempts >= maxRetries) {
                    console.log('Max retry attempts reached. Skipping to next combination.');
                    break;
                }
            }
        }

        // Capitalize first letters of all words in category name
        const capitalizedCategoryName = capitalizeWords(categoryName);

        if (pbDetails.length > 0) {
            return `${runnerNameExact}'s PB(s) for ${exactGameName} - ${capitalizedCategoryName}: ${pbDetails.join(' | ')}`;
        } else {
            return `Runner has no PB in this category.`;
        }
    } catch (error) {
        console.error('Error fetching PB:', error.message);
        if (error.message.includes('Game not found')) {
            return 'Game not found.';
        } else if (error.message.includes('Category not found')) {
            return 'Category not found.';
        } else if (error.message.includes('Runner not found')) {
            return 'Runner not found.';
        } else {
            return 'Error fetching Personal Best. Please check the game, category, and runner names.';
        }
    }
}

module.exports = {
  getWorldRecord,
  getPersonalBest,
};