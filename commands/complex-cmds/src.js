// src.js

const axios = require('axios');

function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

async function getWorldRecord(gameName, categoryName, variableValue) {
    try {
        const gameResponse = await axios.get(`https://www.speedrun.com/api/v1/games?name=${encodeURIComponent(gameName)}`);
        if (!gameResponse.data.data || gameResponse.data.data.length === 0) {
            throw new Error('Game not found');
        }
        const game = gameResponse.data.data[0];
        const gameId = game.id;
        const exactGameName = game.names.international;

        const categoryResponse = await axios.get(`https://www.speedrun.com/api/v1/games/${gameId}/categories`);
        const category = categoryResponse.data.data.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
        if (!category) throw new Error('Category not found');

        const categoryId = category.id;

        const variablesResponse = await axios.get(`https://www.speedrun.com/api/v1/categories/${categoryId}/variables`);
        const variables = variablesResponse.data.data.filter(variable =>
            variable['is-subcategory'] &&
            (variable.scope.type === 'full-game' || variable.scope.type === 'global' || variable.category === categoryId)
        );

        let subcategoryCombinations = [[]];
        let variableNames = [];

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

        let wrDetails = [];
        let specificCombination = [];

        if (variableValue) {
            specificCombination = subcategoryCombinations.filter(combination =>
                combination.some(subcat => subcat.label.toLowerCase() === variableValue.toLowerCase())
            );
        }

        const combinationsToUse = specificCombination.length > 0 ? specificCombination : subcategoryCombinations;

        let retryAttempts = 0;
        const maxRetries = 3;

        for (const combination of combinationsToUse) {
            let params = combination.map(subcat => `var-${subcat.variableId}=${subcat.subcategoryId}`).join('&');
            try {
                const leaderboardResponse = await axios.get(`https://www.speedrun.com/api/v1/leaderboards/${gameId}/category/${categoryId}?top=1&${params}`);
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
                    const subcategoryLabels = combination.map(subcat => subcat.label).join(' - ');
                    wrDetails.push(`${subcategoryLabels}: ${formattedTime} by ${wrRunnerName}`);
                }
            } catch (subError) {
                retryAttempts++;
                if (retryAttempts >= maxRetries) {
                    break;
                }
            }
        }

        if (wrDetails.length === 0) {
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

        const capitalizedCategoryName = capitalizeWords(categoryName);

        if (wrDetails.length > 0) {
            return `World Records for ${exactGameName} - ${capitalizedCategoryName}: ${wrDetails.join(' | ')}`;
        } else {
            return `No World Records found for ${exactGameName} - ${capitalizedCategoryName}.`;
        }
    } catch (error) {
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
        const gameResponse = await axios.get(`https://www.speedrun.com/api/v1/games?name=${encodeURIComponent(gameName)}`);
        if (!gameResponse.data.data || gameResponse.data.data.length === 0) {
            throw new Error('Game not found');
        }
        const gameId = gameResponse.data.data[0].id;
        const exactGameName = gameResponse.data.data[0].names.international;

        const categoryResponse = await axios.get(`https://www.speedrun.com/api/v1/games/${gameId}/categories`);
        const category = categoryResponse.data.data.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
        if (!category) throw new Error('Category not found');

        const categoryId = category.id;

        const runnerResponse = await axios.get(`https://www.speedrun.com/api/v1/users?lookup=${encodeURIComponent(runnerName)}`);
        if (!runnerResponse.data.data || runnerResponse.data.data.length === 0) {
            throw new Error('Runner not found');
        }
        const runnerData = runnerResponse.data.data[0];
        const runnerId = runnerData.id;
        const runnerNameExact = runnerData.names.international;

        const variablesResponse = await axios.get(`https://www.speedrun.com/api/v1/categories/${categoryId}/variables`);
        const variables = variablesResponse.data.data;

        let subcategoryCombinations = [[]];

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

        for (const combination of subcategoryCombinations) {
            let params = combination.map(subcat => `var-${subcat.variableId}=${subcat.subcategoryId}`).join('&');
            try {
                const leaderboardResponse = await axios.get(`https://www.speedrun.com/api/v1/leaderboards/${gameId}/category/${categoryId}?top=100&${params}`);
                const runnerRuns = leaderboardResponse.data.data.runs.filter(run => run.run.players[0].id === runnerId);

                for (const runnerRun of runnerRuns) {
                    const pbTime = runnerRun.run.times.primary_t;

                    const timeInSeconds = parseInt(pbTime);
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
                retryAttempts++;
                if (retryAttempts >= maxRetries) {
                    break;
                }
            }
        }

        const capitalizedCategoryName = capitalizeWords(categoryName);

        if (pbDetails.length > 0) {
            return `${runnerNameExact}'s PB(s) for ${exactGameName} - ${capitalizedCategoryName}: ${pbDetails.join(' | ')}`;
        } else {
            return `Runner has no PB in this category.`;
        }
    } catch (error) {
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