export function calculateEndTime(startISO, variantIds, allVariants) {
    const start = new Date(startISO);

    const totalMinutes = variantIds.reduce((sum, variantId) => {
        const variant = allVariants.find(v => v.id === Number(variantId));
        return sum + (variant?.duration || 0);
    }, 0);

    const end = new Date(start.getTime() + totalMinutes * 60000);
    return end.toISOString();
}