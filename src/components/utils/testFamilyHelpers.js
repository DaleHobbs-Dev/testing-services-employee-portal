/**
 * Check if a test family allows multiple variants in a single session
 * @param {Object} testFamily - The test family object
 * @returns {boolean}
 */
export const allowsMultipleVariants = (testFamily) => {
    if (!testFamily) return false;

    if (Object.prototype.hasOwnProperty.call(testFamily, 'allowsMultipleVariants')) {
        return testFamily.allowsMultipleVariants === true;
    }

    // Fallback to name checking
    const multiVariantFamilies = ['HiSET', 'Accuplacer'];
    return multiVariantFamilies.includes(testFamily.name);
};

/**
 * Check if a test family is a faculty test
 * @param {Object} testFamily - The test family object
 * @returns {boolean}
 */
export const isFacultyTest = (testFamily) => {
    if (!testFamily) return false;
    return testFamily.name === 'Faculty Test';
};

/**
 * Check if a test family requires variant selection
 * @param {Object} testFamily - The test family object
 * @returns {boolean}
 */
export const requiresVariantSelection = (testFamily) => {
    if (!testFamily) return true; // Default to requiring selection

    // Use the database field if it exists
    if (Object.prototype.hasOwnProperty.call(testFamily, 'requiresVariantSelection')) {
        return testFamily.requiresVariantSelection === true;
    }

    return true; // Default behavior
};