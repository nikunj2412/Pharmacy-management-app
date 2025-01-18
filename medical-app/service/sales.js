const { salesModel, medicineModel } = require('../models'); // Import medicineModel to update inventory
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

async function createSales(body) {
    // Start a transaction to ensure atomic operations
    const session = await salesModel.startSession();
    session.startTransaction();

    try {
        // Decrease quantity of medicines in inventory
        for (const item of body.medicines) {
            const medicine = await medicineModel.findById(item.medicineId);

            if (!medicine) {
                throw new ApiError(httpStatus.BAD_REQUEST, `Medicine with ID ${item.medicineId} not found`);
            }

            if (medicine.quantity < item.quantity) {
                throw new ApiError(httpStatus.BAD_REQUEST, `Insufficient quantity for medicine ID ${item.medicineId}`);
            }

            // Decrement the quantity in the medicine inventory
            medicine.Quantity -= item.Quantity;
            await medicine.save({ session });
        }

        // Create sales record
        const sales = await salesModel.create([body], { session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return sales;
    } catch (error) {
        // Abort the transaction in case of an error
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

async function getSalesByUserId(userId) {
    const sales = await salesModel
        .find({ userId: userId })
        .populate('medicines.medicineId', 'name price Quantity')
        .populate('userId', 'firstName lastName');

    if (!sales) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Sales not found for this user');
    }

    return sales;
}

async function getSalesById(id) {
    const sales = await salesModel.findById(id)
    .populate("userId", "firstName lastName")
    .populate("medicines.medicineId", "name price Quantity");

    return sales;
}

async function getOne(query) {
    const sales = await salesModel.findOne(query);
    return sales;
}

async function updateSales(filter, body) {
    const salesData = await getOne(filter);
    if (!salesData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Sales not found');
    }

    const sales = await salesModel.findOneAndUpdate(filter, body, { new: true });
    return sales;
}

async function removeSales(filter) {
    const sales = await salesModel.findOneAndDelete(filter);
    return sales;
}

module.exports = {
    createSales,
    getSalesByUserId,
    getSalesById,
    updateSales,
    removeSales,
};
